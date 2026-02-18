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
  isEntity?: boolean;    // Indicates if it's a geographic/non-person entity
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

  // Step 2: Fetch full summary + image from the REST Summary API
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedTitle}`;
  const summaryRes = await fetch(summaryUrl, {
    headers: {
      'User-Agent': 'FamousBirthdaysApp/1.0',
      'Accept': 'application/json',
    },
  });

  if (!summaryRes.ok) return emptyBio(name);
  const summary = await summaryRes.json();

  // Step 3: Fetch birth/death dates or founding/inception dates from Wikidata
  let birthParts: { year: number, month: number, day: number } | null = null;
  let birthPlace: string | null = null;
  let deathParts: { year: number, month: number, day: number } | null = null;
  let gender: 'male' | 'female' | 'other' | null = null;
  let isEntity = false;

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
      const claims = entityData?.entities?.[wikidataId]?.claims;

      // P569 = date of birth (usually for people)
      birthParts = getBestDateParts(claims?.P569);
      
      // If no birth date, check for inception/founding/independence (usually for entities)
      if (!birthParts) {
        // P571 = inception, P580 = start time, P1246 = independence date
        const inception = getBestDateParts(claims?.P571, true); // true = prioritize latest
        const startTime = getBestDateParts(claims?.P580, true);
        const independence = getBestDateParts(claims?.P1246, true);

        // Prioritize independence date, then latest inception, then start time
        birthParts = independence || inception || startTime;

        if (birthParts) {
          isEntity = true;
          gender = 'male'; // Assume male for geographic entities
        }
      }

      deathParts = getBestDateParts(claims?.P570);
      birthPlace = await extractWikidataPlace(claims?.P19);
      
      // If it's a person, get their actual gender
      if (!isEntity) {
        const genderId = claims?.P21?.[0]?.mainsnak?.datavalue?.value?.id;
        if (genderId === 'Q6581097') gender = 'male';
        else if (genderId === 'Q6581072') gender = 'female';
        else if (genderId) gender = 'other';
      }
    }
  } catch (err) {
    console.error('[Biography API] Wikidata error:', err);
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
    found: !!birthParts,
    isEntity
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

/**
 * Parses multiple Wikidata claims for a date and returns the best match.
 * For entities, we often want the *latest* formation date (e.g. Revolution or modern Independence).
 * For people, we usually want the *first* (primary) birth date.
 */
function getBestDateParts(claims: any[] | undefined, latest: boolean = false): { year: number, month: number, day: number } | null {
  if (!claims || claims.length === 0) return null;
  
  const validDates: { year: number, month: number, day: number }[] = [];

  for (const claim of claims) {
    const value = claim?.mainsnak?.datavalue?.value?.time;
    if (!value) continue;
    
    try {
      const match = value.match(/[+-](\d+)-(\d{2})-(\d{2})/);
      if (!match) continue;
      
      const year = parseInt(match[1], 10);
      let month = parseInt(match[2], 10);
      let day = parseInt(match[3], 10);
      
      // Wikidata uses 00 for imprecise months/days
      const isImprecise = month === 0 || day === 0;
      
      // Default to Jan 1st if totally imprecise
      if (month === 0) month = 1;
      if (day === 0) day = 1;
      
      validDates.push({ year, month, day });
      
      // If we're looking for a person's birth date and we found a precise one, return it immediately
      if (!latest && !isImprecise) {
        return { year, month, day };
      }
    } catch {
      continue;
    }
  }

  if (validDates.length === 0) return null;

  if (latest) {
    // Return the latest date found (good for modern state formations)
    return validDates.sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      if (a.month !== b.month) return b.month - a.month;
      return b.day - a.day;
    })[0];
  }

  // Default fallback to the first one found
  return validDates[0];
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
