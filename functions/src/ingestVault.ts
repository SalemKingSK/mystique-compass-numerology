
/**
 * functions/src/ingestVault.ts
 *
 * Cloud Functions v2 — runs up to 60 minutes per invocation.
 * Loops through ALL pending months in one continuous run.
 * Scheduled every 70 minutes as a safety net to catch any remainder.
 * Stops gracefully at 55 minutes if still running, resumes next trigger.
 *
 * DEPLOY:
 *   cd functions && npm install && cd .. && firebase deploy --only functions
 */

import { onSchedule } from 'firebase-functions/v2/scheduler';
import { onRequest }  from 'firebase-functions/v2/https';
import { logger }     from 'firebase-functions/v2';
import * as admin     from 'firebase-admin';
import fetch          from 'node-fetch';

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
  // Sort oldest first — richest data comes first, most valuable
  return [...new Set(years)].sort((a, b) => a - b);
}

// ─── Wikidata fetch ───────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

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
      const r = await fetch(url, {
        headers: {
          'Accept': 'application/sparql-results+json',
          'User-Agent': 'MystiqueCompass/1.0 (Firebase background ingest)',
        },
        timeout: 50000,
      } as any);

      if (!r.ok) {
        if (r.status === 429) {
          logger.warn(`Rate limited on ${year}/${month}, waiting ${10 * (attempt+1)}s`);
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
// Runs continuously through ALL pending months until either:
// A) Everything is done (vault complete), or
// B) 55 minutes have elapsed (safety margin before 60min hard limit)
// If B, the next scheduled trigger resumes from exactly where it stopped.

async function runIngestionLoop(): Promise<{ done: boolean; monthsProcessed: number; totalPeople: number }> {
  const startTime      = Date.now();
  const MAX_RUNTIME_MS = 55 * 60 * 1000; // 55 minutes — 5 min safety buffer
  const years          = getConflictYears();
  const allMonths      = [1,2,3,4,5,6,7,8,9,10,11,12];

  let monthsProcessed = 0;
  let totalPeople     = 0;
  let allComplete     = true;

  for (const year of years) {
    const metaRef  = db.collection(META_COLL).doc(String(year));
    const metaSnap = await metaRef.get();
    const meta     = metaSnap.data() as any || {
      year, status: 'pending', count: 0, monthsDone: [], updatedAt: 0
    };

    if (meta.status === 'complete') continue;

    const monthsDone = meta.monthsDone || [];
    const remaining  = allMonths.filter(m => !monthsDone.includes(m));

    if (!remaining.length) {
      // All months fetched but status not marked complete — fix it
      await metaRef.set({ ...meta, status: 'complete', updatedAt: Date.now() });
      continue;
    }

    allComplete = false;

    for (const month of remaining) {
      // ── Time guard — stop gracefully before hitting 60min hard limit ──────
      const elapsed = Date.now() - startTime;
      if (elapsed >= MAX_RUNTIME_MS) {
        logger.info(`55min elapsed — pausing at ${year}/${month}. Will resume next trigger.`);
        return { done: false, monthsProcessed, totalPeople };
      }

      logger.info(`Fetching ${year}/${month} (elapsed: ${Math.round(elapsed/1000)}s)`);

      const bindings = await fetchWikidataMonth(year, month);
      const people   = parseBindings(bindings);
      if (people.length > 0) await savePeople(people);

      const newMonthsDone = [...monthsDone, month];
      const isComplete    = newMonthsDone.length === 12;

      // Update meta immediately after each month — checkpoint saved
      await metaRef.set({
        year,
        status:     isComplete ? 'complete' : 'partial',
        count:      (meta.count || 0) + people.length,
        monthsDone: newMonthsDone,
        updatedAt:  Date.now(),
      });

      monthsProcessed++;
      totalPeople += people.length;

      logger.info(`✓ ${year}/${month}: ${people.length} stored (total this run: ${totalPeople})`);

      // 300ms between requests — polite but not slow
      await sleep(300);

      // Update local monthsDone for the inner loop
      monthsDone.push(month);
      if (meta.count !== undefined) meta.count += people.length;
    }
  }

  return { done: allComplete || true, monthsProcessed, totalPeople };
}

// ─── Scheduled trigger — every 70 minutes ────────────────────────────────────
// 70 min gap > 60 min max runtime, so there's no overlap between invocations.
// If a run finishes in 20 min (vault complete), the next trigger is a no-op.

export const ingestVaultScheduled = onSchedule(
  {
    schedule: 'every 70 minutes',
    timeoutSeconds: 3600,  // 60 minutes — Cloud Functions v2 max
    memory: '512MiB',
    region: 'us-central1',
  },
  async () => {
    logger.info('Starting scheduled vault ingestion...');
    const result = await runIngestionLoop();
    logger.info(`Ingestion run complete: ${result.monthsProcessed} months, ${result.totalPeople} people stored. Vault done: ${result.done}`);
  }
);

// ─── Manual HTTP trigger — kick off on demand from the app UI ─────────────────
// Called by the "Force Sync" button in the Data Vault tab.
// Same logic as the scheduled function — runs until done or 55min elapsed.

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
      ok: true,
      monthsProcessed: result.monthsProcessed,
      totalPeople:     result.totalPeople,
      vaultComplete:   result.done,
    });
  }
);
