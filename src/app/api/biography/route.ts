// Wikipedia REST API — no key required, free & reliable
// Usage: GET /api/biography?name=Albert+Einstein

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // fast edge runtime

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Missing name parameter' }, { status: 400 });
  }

  try {
    const bio = await fetchWikipediaBio(name);
    return NextResponse.json(bio, {
      headers: {
        // Cache for 24 hours at the edge — bios don't change often
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    console.error('[Biography API] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch biography' }, { status: 500 });
  }
}

// ─── Wikipedia Fetching Logic ─────────────────────────────────────────────────

export interface BiographyData {
  name: string;
  title: string;
  extract: string;       // Plain text summary (2–5 sentences)
  description: string;  // Short Wikipedia description (e.g. "German-born physicist")
  imageUrl: string | null;
  wikiUrl: string;
  birthYear: number | null;
  birthMonth: number | null;
  birthDay: number | null;
  deathYear: number | null;
  deathMonth: number | null;
  deathDay: number | null;
  birthPlace: string | null;
  gender: 'male' | 'female' | 'other' | null;
  found: boolean;
}

async function fetchWikipediaBio(name: string): Promise<BiographyData> {
  const encodedName = encodeURIComponent(name.trim());

  // Step 1: Search for the best matching article
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedName}&srlimit=1&format=json&origin=*`;
  const searchRes = await fetch(searchUrl, { headers: { 'User-Agent': 'FamousBirthdaysApp/1.0' } });
  const searchData = await searchRes.json();

  const results = searchData?.query?.search;
  if (!results || results.length === 0) {
    return emptyBio(name);
  }

  const pageTitle = results[0].title;
  const encodedTitle = encodeURIComponent(pageTitle);

  // Step 2: Fetch full summary + image from the REST Summary API (much cleaner than action=query)
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`;
  const summaryRes = await fetch(summaryUrl, {
    headers: {
      'User-Agent': 'FamousBirthdaysApp/1.0',
      'Accept': 'application/json',
    },
  });

  if (!summaryRes.ok) return emptyBio(name);
  const summary = await summaryRes.json();

  // Step 3: Fetch birth/death dates and gender from Wikidata
  let birthParts: { year: number, month: number, day: number } | null = null;
  let birthPlace: string | null = null;
  let deathParts: { year: number, month: number, day: number } | null = null;
  let gender: 'male' | 'female' | 'other' | null = null;

  try {
    const wikidataUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedTitle}&prop=pageprops&format=json&origin=*`;
    const wikidataRes = await fetch(wikidataUrl, { headers: { 'User-Agent': 'FamousBirthdaysApp/1.0' } });
    const wikidataJson = await wikidataRes.json();
    const pages = wikidataJson?.query?.pages;
    const page = pages ? Object.values(pages)[0] as any : null;
    const wikidataId = page?.pageprops?.wikibase_item;

    if (wikidataId) {
      const entityUrl = `https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`;
      const entityRes = await fetch(entityUrl, { headers: { 'User-Agent': 'FamousBirthdaysApp/1.0' } });
      const entityData = await entityRes.json();
      const entity = entityData?.entities?.[wikidataId]?.claims;

      // P569 = date of birth, P570 = date of death, P19 = place of birth, P21 = gender
      birthParts = extractWikidataDateParts(entity?.P569);
      deathParts = extractWikidataDateParts(entity?.P570);
      birthPlace = await extractWikidataPlace(entity?.P19);
      
      const genderId = entity?.P21?.[0]?.mainsnak?.datavalue?.value?.id;
      if (genderId === 'Q6581097') gender = 'male';
      else if (genderId === 'Q6581072') gender = 'female';
      else if (genderId) gender = 'other';
    }
  } catch {
    // Silently skip — Wikidata is a bonus, not critical
  }

  return {
    name,
    title: summary.title || name,
    extract: summary.extract || '',
    description: summary.description || '',
    imageUrl: summary.thumbnail?.source || summary.originalimage?.source || null,
    wikiUrl: summary.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodedTitle}`,
    birthYear: birthParts?.year || null,
    birthMonth: birthParts?.month || null,
    birthDay: birthParts?.day || null,
    deathYear: deathParts?.year || null,
    deathMonth: deathParts?.month || null,
    deathDay: deathParts?.day || null,
    birthPlace,
    gender,
    found: true,
  };
}

function emptyBio(name: string): BiographyData {
  return {
    name,
    title: name,
    extract: '',
    description: '',
    imageUrl: null,
    wikiUrl: `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(name)}`,
    birthYear: null,
    birthMonth: null,
    birthDay: null,
    deathYear: null,
    deathMonth: null,
    deathDay: null,
    birthPlace: null,
    gender: null,
    found: false,
  };
}

function extractWikidataDateParts(claims: any[] | undefined): { year: number, month: number, day: number } | null {
  if (!claims || claims.length === 0) return null;
  const value = claims[0]?.mainsnak?.datavalue?.value?.time;
  if (!value) return null;
  // Format: +1879-03-14T00:00:00Z
  try {
    const match = value.match(/[+-](\d+)-(\d{2})-(\d{2})/);
    if (!match) return null;
    return {
      year: parseInt(match[1], 10),
      month: parseInt(match[2], 10),
      day: parseInt(match[3], 10)
    };
  } catch {
    return null;
  }
}

async function extractWikidataPlace(claims: any[] | undefined): Promise<string | null> {
  if (!claims || claims.length === 0) return null;
  const entityId = claims[0]?.mainsnak?.datavalue?.value?.id;
  if (!entityId) return null;
  try {
    const res = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=labels&languages=en&format=json&origin=*`,
      { headers: { 'User-Agent': 'FamousBirthdaysApp/1.0' } }
    );
    const data = await res.json();
    return data?.entities?.[entityId]?.labels?.en?.value || null;
  } catch {
    return null;
  }
}
