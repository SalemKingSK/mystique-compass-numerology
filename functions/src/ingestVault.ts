/**
 * functions/src/ingestVault.ts
 *
 * Cloud Functions v2 — runs up to 60 minutes per invocation.
 * Uses Node 20 native fetch — no node-fetch package needed.
 */

import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest }  from 'firebase-functions/v2/https';
import { logger }     from 'firebase-functions/v2';
import * as admin     from 'firebase-admin';

// ── Node 20 has fetch built in — no import needed ────────────────────────────

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

const META_COLL   = 'cosmic_vault_meta';
const PEOPLE_COLL = 'cosmic_vault_people';
const TARGET_YEAR = 2026;

// ─── Conflict year calculation ────────────────────────────────────────────────

function getConflictYears(): number[] {
  // Horse year 2026 conflict animal zodiac keys:
  // Chong = Rat (4), Xing = Horse (10), Hai = Ox (5), Po = Rabbit (7)
  const conflictKeys = [4, 10, 5, 7];
  const years: number[] = [];
  for (const key of conflictKeys) {
    let y = 1900 + key;
    while (y < 1930) y += 12;
    while (y <= 2003) {
      if (y < TARGET_YEAR) years.push(y);
      y += 12;
    }
  }
  return [...new Set(years)].sort((a, b) => a - b);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Wikidata fetch — uses Node 20 native fetch ───────────────────────────────

async function fetchWikidataMonth(year: number, month: number): Promise<any[]> {
  const sparql = `
SELECT ?person ?personLabel ?dob ?description WHERE {
  ?person wdt:P31 wd:Q5 ;
          wdt:P569 ?dob .
  FILTER(YEAR(?dob) = ${year} && MONTH(?dob) = ${month})
  FILTER(DATATYPE(?dob) = xsd:dateTime)
  OPTIONAL {
    ?person schema:description ?description .
    FILTER(LANG(?description) = "en")
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
}
LIMIT 2000`.trim();

  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(sparql)}`;

  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      // AbortController handles timeout — native fetch doesn't have a timeout option
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 50000);

      const r = await fetch(url, {
        headers: {
          'Accept': 'application/sparql-results+json',
          'User-Agent': 'MystiqueCompass/1.0 (Firebase background ingest)',
        },
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!r.ok) {
        if (r.status === 429) {
          logger.warn(`Rate limited on ${year}/${month}, waiting ${10 * (attempt + 1)}s`);
          await sleep(10000 * (attempt + 1));
          continue;
        }
        throw new Error(`HTTP ${r.status}`);
      }

      const data = await r.json() as any;
      return data?.results?.bindings || [];

    } catch (e: any) {
      if (attempt === 3) {
        logger.warn(`${year}/${month} failed after 4 attempts: ${e.message}`);
        return [];
      }
      await sleep(4000 * (attempt + 1));
    }
  }
  return [];
}

function parseBindings(bindings: any[]): any[] {
  const people: any[] = [];
  for (const b of bindings) {
    const wikidataId = b.person?.value?.split('/').pop();
    if (!wikidataId) continue;
    const dobStr = b.dob?.value || '';
    const match  = dobStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) continue;
    const birthYear  = parseInt(match[1]);
    const birthMonth = parseInt(match[2]);
    const birthDay   = parseInt(match[3]);
    if (birthMonth < 1 || birthMonth > 12 || birthDay < 1 || birthDay > 31) continue;
    const name = b.personLabel?.value || '';
    if (/^Q\d+$/.test(name)) continue;
    people.push({
      wikidataId, name, birthDay, birthMonth, birthYear,
      description: b.description?.value || '',
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(name.replace(/ /g, '_'))}`,
    });
  }
  return people;
}

async function savePeople(people: any[]) {
  const CHUNK = 450;
  for (let i = 0; i < people.length; i += CHUNK) {
    const batch = db.batch();
    people.slice(i, i + CHUNK).forEach(p => {
      batch.set(db.collection(PEOPLE_COLL).doc(p.wikidataId), p, { merge: true });
    });
    await batch.commit();
  }
}

// ─── Core ingestion loop ──────────────────────────────────────────────────────

async function runIngestionLoop(): Promise<{
  done: boolean;
  monthsProcessed: number;
  totalPeople: number;
}> {
  const startTime      = Date.now();
  const MAX_RUNTIME_MS = 55 * 60 * 1000;
  const years          = getConflictYears();
  const allMonths      = [1,2,3,4,5,6,7,8,9,10,11,12];

  let monthsProcessed = 0;
  let totalPeople     = 0;
  let allComplete     = true;

  for (const year of years) {
    const metaRef  = db.collection(META_COLL).doc(String(year));
    const metaSnap = await metaRef.get();
    const meta     = metaSnap.data() as any || {
      year, status: 'pending', count: 0, monthsDone: [], updatedAt: 0,
    };

    if (meta.status === 'complete') continue;

    const monthsDone = (meta.monthsDone || []) as number[];
    const remaining  = allMonths.filter(m => !monthsDone.includes(m));

    if (!remaining.length) {
      await metaRef.set({ ...meta, status: 'complete', updatedAt: Date.now() });
      continue;
    }

    allComplete = false;

    for (const month of remaining) {
      const elapsed = Date.now() - startTime;
      if (elapsed >= MAX_RUNTIME_MS) {
        logger.info(`55min guard — pausing at ${year}/${month}. Resuming next trigger.`);
        return { done: false, monthsProcessed, totalPeople };
      }

      logger.info(`Fetching ${year}/${month} (${Math.round(elapsed / 1000)}s elapsed)`);

      const bindings = await fetchWikidataMonth(year, month);
      const people   = parseBindings(bindings);
      if (people.length > 0) await savePeople(people);

      const newMonthsDone = [...monthsDone, month];
      const isComplete    = newMonthsDone.length === 12;

      await metaRef.set({
        year,
        status:     isComplete ? 'complete' : 'partial',
        count:      (meta.count || 0) + people.length,
        monthsDone: newMonthsDone,
        updatedAt:  Date.now(),
      });

      monthsProcessed++;
      totalPeople    += people.length;
      meta.count      = (meta.count || 0) + people.length;
      monthsDone.push(month);

      logger.info(`✓ ${year}/${month}: ${people.length} stored`);
      await sleep(300);
    }
  }

  return { done: allComplete || true, monthsProcessed, totalPeople };
}

// ─── Scheduled trigger ────────────────────────────────────────────────────────

export const ingestVaultScheduled = onSchedule(
  {
    schedule: 'every 70 minutes',
    timeoutSeconds: 3600,  // 60 minutes — Cloud Functions v2 max
    memory: '512MiB',
    region: 'us-central1',
  },
  async () => {
    logger.info('Scheduled vault ingestion starting...');
    const result = await runIngestionLoop();
    logger.info(`Done: ${result.monthsProcessed} months, ${result.totalPeople} people. Complete: ${result.done}`);
  }
);

// ─── Manual HTTP trigger ──────────────────────────────────────────────────────

export const ingestVaultNow = onRequest(
  {
    timeoutSeconds: 3600,
    memory: '512MiB',
    region: 'us-central1',
    cors: true,
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'POST only' });
      return;
    }
    logger.info('Manual vault ingest triggered');
    const result = await runIngestionLoop();
    res.json({
      ok:              true,
      monthsProcessed: result.monthsProcessed,
      totalPeople:     result.totalPeople,
      vaultComplete:   result.done,
    });
  }
);
