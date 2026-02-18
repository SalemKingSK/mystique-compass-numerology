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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BiographyData {
  name: string;
  title: string;
  extract: string;
  description: string;
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
  isEntity?: boolean;
  foundingEvent?: string | null; // e.g. "Iranian Revolution"
}

interface DateParts {
  year: number;
  month: number;
  day: number;
  isPrecise: boolean; // true if both month AND day are real (non-zero) values
  label?: string;     // optional event label from Wikidata qualifiers
}

// ─── Main Fetcher ─────────────────────────────────────────────────────────────

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

  // Step 3: Fetch dates from Wikidata
  let birthParts: DateParts | null = null;
  let deathParts: DateParts | null = null;
  let birthPlace: string | null = null;
  let gender: 'male' | 'female' | 'other' | null = null;
  let isEntity = false;
  let foundingEvent: string | null = null;

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

      // ── Person: P569 = date of birth ──────────────────────────────────────
      birthParts = getPersonBirthDate(claims?.P569);

      if (birthParts) {
        // It's a person — get gender and birthplace normally
        deathParts = getPersonBirthDate(claims?.P570);
        birthPlace = await extractWikidataPlace(claims?.P19);

        const genderId = claims?.P21?.[0]?.mainsnak?.datavalue?.value?.id;
        if (genderId === 'Q6581097') gender = 'male';
        else if (genderId === 'Q6581072') gender = 'female';
        else if (genderId) gender = 'other';

      } else {
        // ── Entity (country / city / state): pick the best founding date ───
        const allEntityDates: DateParts[] = [
          ...parseDateClaims(claims?.P571),  // inception
          ...parseDateClaims(claims?.P580),  // start time
          ...parseDateClaims(claims?.P1246), // independence
        ];

        if (allEntityDates.length > 0) {
          birthParts = pickBestEntityDate(allEntityDates);
          isEntity = true;
          gender = 'male'; // All geographic entities are treated as male per app logic
          foundingEvent = birthParts?.label || null;
        }
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
    birthYear: birthParts?.year ?? null,
    birthMonth: birthParts?.month ?? null,
    birthDay: birthParts?.day ?? null,
    deathYear: deathParts?.year ?? null,
    deathMonth: deathParts?.month ?? null,
    deathDay: deathParts?.day ?? null,
    birthPlace,
    gender,
    found: !!birthParts,
    isEntity,
    foundingEvent,
  };
}

// ─── Date Parsing Helpers ─────────────────────────────────────────────────────

function parseWikidataTime(timeStr: string): { year: number; rawMonth: number; rawDay: number } | null {
  const match = timeStr.match(/[+-](\d+)-(\d{2})-(\d{2})/);
  if (!match) return null;

  const year = parseInt(match[1], 10);
  const rawMonth = parseInt(match[2], 10);
  const rawDay = parseInt(match[3], 10);

  if (year === 0) return null;

  return { year, rawMonth, rawDay };
}

function parseDateClaims(claims: any[] | undefined): DateParts[] {
  if (!claims || claims.length === 0) return [];

  const results: DateParts[] = [];

  for (const claim of claims) {
    const timeStr = claim?.mainsnak?.datavalue?.value?.time;
    if (!timeStr) continue;

    const parsed = parseWikidataTime(timeStr);
    if (!parsed) continue;

    const { year, rawMonth, rawDay } = parsed;
    const isPrecise = rawMonth > 0 && rawDay > 0;
    const month = rawMonth > 0 ? rawMonth : 0;
    const day = rawDay > 0 ? rawDay : 0;

    results.push({ year, month, day, isPrecise });
  }

  return results;
}

function getPersonBirthDate(claims: any[] | undefined): DateParts | null {
  const dates = parseDateClaims(claims);
  if (dates.length === 0) return null;

  const precise = dates.find(d => d.isPrecise);
  if (precise) return precise;

  const first = dates[0];
  return {
    ...first,
    month: first.month || 1,
    day: first.day || 1,
  };
}

function pickBestEntityDate(dates: DateParts[]): DateParts | null {
  if (dates.length === 0) return null;

  const preciseDates = dates.filter(d => d.isPrecise);
  const impreciseDates = dates.filter(d => !d.isPrecise);

  const sortDesc = (a: DateParts, b: DateParts) => {
    if (a.year !== b.year) return b.year - a.year;
    if (a.month !== b.month) return b.month - a.month;
    return b.day - a.day;
  };

  if (preciseDates.length > 0) {
    preciseDates.sort(sortDesc);
    return preciseDates[0];
  }

  if (impreciseDates.length > 0) {
    impreciseDates.sort(sortDesc);
    const best = impreciseDates[0];
    return {
      ...best,
      month: best.month || 1,
      day: best.day || 1,
      isPrecise: false,
    };
  }

  return null;
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
    foundingEvent: null,
  };
}
