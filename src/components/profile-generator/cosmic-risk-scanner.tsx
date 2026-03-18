'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Zap, Loader2, ExternalLink, Telescope,
  Trash2, History, Globe, Database, RefreshCw, AlertTriangle,
  CloudLightning,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ANIMALS, RELATIONS } from '@/lib/cosmic-fate/constants';
import { db } from '@/lib/firebase';
import {
  collection, doc, setDoc, getDoc, getDocs,
  query as fsQuery, where, writeBatch,
} from 'firebase/firestore';

// ─── Types ───────────────────────────────────────────────────────────────────
interface PersonRecord {
  wikidataId: string;
  name: string;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  description: string;
  url: string;
}
interface YearMeta {
  year: number;
  status: 'pending' | 'ingesting' | 'partial' | 'complete';
  count: number;
  monthsDone: number[];
  updatedAt: number;
}
interface ScanResult extends PersonRecord {
  animal: string;
  conflictType: string;
  config: any;
  py: number;
  pyPoints: number;
  totalScore: number;
  tier: any;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function reduce(n: number) {
  let s = Math.abs(n);
  while (s > 9) s = String(s).split('').reduce((acc, d) => acc + +d, 0);
  return s || 9;
}

const DANGER_TIERS = [
  { min: 6, label: 'CRITICAL',  color: '#ff2020', bg: 'rgba(255,32,32,0.16)',    border: 'rgba(255,32,32,0.55)' },
  { min: 5, label: 'SEVERE',    color: '#e05020', bg: 'rgba(224,80,32,0.14)',    border: 'rgba(224,80,32,0.55)' },
  { min: 4, label: 'HIGH',      color: '#e09428', bg: 'rgba(224,148,40,0.13)',   border: 'rgba(224,148,40,0.5)' },
  { min: 3, label: 'ELEVATED',  color: '#c8c020', bg: 'rgba(200,192,32,0.11)',   border: 'rgba(200,192,32,0.45)' },
  { min: 2, label: 'NOTABLE',   color: '#9b8ec4', bg: 'rgba(155,142,196,0.11)', border: 'rgba(155,142,196,0.4)' },
];
function getDangerTier(total: number) {
  return DANGER_TIERS.find(x => total >= x.min) || DANGER_TIERS[4];
}

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ─── Firestore config ─────────────────────────────────────────────────────────
const META_COLL   = 'cosmic_vault_meta';
const PEOPLE_COLL = 'cosmic_vault_people';

// ─── Firestore helpers ────────────────────────────────────────────────────────
async function getYearMeta(year: number): Promise<YearMeta | null> {
  const snap = await getDoc(doc(db, META_COLL, String(year)));
  return snap.exists() ? (snap.data() as YearMeta) : null;
}
async function saveYearMeta(meta: YearMeta) {
  await setDoc(doc(db, META_COLL, String(meta.year)), meta);
}
async function savePeopleBatch(people: PersonRecord[]) {
  const BATCH_SIZE = 450;
  for (let i = 0; i < people.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    people.slice(i, i + BATCH_SIZE).forEach(p => {
      batch.set(doc(db, PEOPLE_COLL, p.wikidataId), p, { merge: true });
    });
    await batch.commit();
  }
}
async function getPeopleForYears(years: number[]): Promise<PersonRecord[]> {
  const results: PersonRecord[] = [];
  for (let i = 0; i < years.length; i += 30) {
    const chunk = years.slice(i, i + 30);
    const snap = await getDocs(
      fsQuery(collection(db, PEOPLE_COLL), where('birthYear', 'in', chunk))
    );
    snap.forEach(d => results.push(d.data() as PersonRecord));
  }
  return results;
}

// ─── Wikidata SPARQL ──────────────────────────────────────────────────────────
async function fetchWikidataMonth(year: number, month: number): Promise<PersonRecord[]> {
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
LIMIT 3000`.trim();

  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(sparql)}`;
  let data: any;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const r = await fetch(url, { headers: { Accept: 'application/sparql-results+json' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      data = await r.json();
      break;
    } catch (e: any) {
      if (attempt === 2) { console.warn(`Wikidata ${year}/${month} failed:`, e.message); return []; }
      await new Promise(r => setTimeout(r, 2000 * (attempt + 1)));
    }
  }
  const bindings: any[] = data?.results?.bindings || [];
  const people: PersonRecord[] = [];
  for (const b of bindings) {
    const wikidataId = b.person?.value?.split('/').pop();
    if (!wikidataId) continue;
    const dobStr = b.dob?.value || '';
    const match = dobStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) continue;
    const birthYear  = parseInt(match[1]);
    const birthMonth = parseInt(match[2]);
    const birthDay   = parseInt(match[3]);
    if (birthMonth < 1 || birthMonth > 12 || birthDay < 1 || birthDay > 31) continue;
    const rawName = b.personLabel?.value || '';
    if (/^Q\d+$/.test(rawName)) continue;
    people.push({
      wikidataId,
      name: rawName,
      birthDay,
      birthMonth,
      birthYear,
      description: b.description?.value || '',
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(rawName.replace(/ /g, '_'))}`,
    });
  }
  return people;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function CosmicRiskScanner({ targetYear }: { targetYear: number }) {
  const [tab, setTab]                   = useState<'vault' | 'scanner'>('vault');
  const [yearMetas, setYearMetas]       = useState<Record<number, YearMeta>>({});
  const [ingesting, setIngesting]       = useState(false);
  const [ingestLog, setIngestLog]       = useState<string[]>([]);
  const [ingestDone, setIngestDone]     = useState(0);
  const [ingestTotal, setIngestTotal]   = useState(0);
  const [ingestPhase, setIngestPhase]   = useState('');
  const [scanning, setScanning]         = useState(false);
  const [scanResults, setScanResults]   = useState<ScanResult[]>([]);
  const [scanStats, setScanStats]       = useState({ checked: 0, flagged: 0 });
  const [filterQuery, setFilterQuery]   = useState('');
  const [expandedId, setExpandedId]     = useState<string | null>(null);
  const [cloudSyncing, setCloudSyncing] = useState(false);
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);
  const [dialog, setDialog]             = useState<{ message: string; onConfirm: () => void } | null>(null);
  const abortRef = useRef(false);

  const targetSign = useMemo(() => {
    const idx = ((targetYear - 1900) % 12 + 12) % 12;
    return ANIMALS[idx] || ANIMALS[0];
  }, [targetYear]);

  const targetUY = useMemo(() => reduce(targetYear), [targetYear]);

  const CF_CONFIG = useMemo(() => {
    const rels = RELATIONS[targetSign.n] || RELATIONS.Rat;
    return {
      Chong: { label: 'Direct Clash',      score: 4, color: '#ff4444', bg: 'rgba(255,68,68,0.13)',    border: 'rgba(255,68,68,0.5)',    glyph: '☠', animal: rels.clash },
      Xing:  { label: 'Self-Punishment',   score: 3, color: '#e07828', bg: 'rgba(224,120,40,0.12)',   border: 'rgba(224,120,40,0.5)',   glyph: '⚔', animal: ['Horse','Dragon','Rooster','Pig'].includes(targetSign.n) ? targetSign.n : null },
      Hai:   { label: 'Harm',              score: 2, color: '#d4aa20', bg: 'rgba(212,170,32,0.11)',   border: 'rgba(212,170,32,0.45)',  glyph: '⚠', animal: rels.harm },
      Po:    { label: 'Breaking',          score: 1, color: '#9b8ec4', bg: 'rgba(155,142,196,0.11)', border: 'rgba(155,142,196,0.4)',  glyph: '◎', animal: rels.destroy },
    };
  }, [targetSign]);

  const CONFLICT_YEARS = useMemo(() => {
    const list: { year: number; type: string; config: any }[] = [];
    Object.entries(CF_CONFIG).forEach(([type, config]) => {
      if (!config.animal) return;
      const animalIdx = ANIMALS.findIndex((a: any) => a.n === config.animal);
      if (animalIdx < 0) return;
      let y = 1900 + animalIdx;
      while (y < 1930) y += 12;
      while (y <= 2010) {
        if (y < targetYear) list.push({ year: y, type, config });
        y += 12;
      }
    });
    return list.sort((a, b) => b.year - a.year);
  }, [targetYear, CF_CONFIG]);

  const uniqueYears = useMemo(() =>
    [...new Set(CONFLICT_YEARS.map(c => c.year))].sort((a, b) => b - a),
    [CONFLICT_YEARS]
  );

  const yearConflictMap = useMemo(() => {
    const m: Record<number, { type: string; config: any }> = {};
    CONFLICT_YEARS.forEach(c => { if (!m[c.year]) m[c.year] = c; });
    return m;
  }, [CONFLICT_YEARS]);

  useEffect(() => { refreshMetas(); }, [targetYear]);

  async function refreshMetas() {
    const metas: Record<number, YearMeta> = {};
    await Promise.all(
      uniqueYears.map(async y => {
        const m = await getYearMeta(y);
        if (m) metas[y] = m;
      })
    );
    setYearMetas(metas);
  }

  async function ingestOneYear(year: number) {
    const existing = yearMetas[year];
    const monthsDone = existing?.monthsDone || [];
    const remaining = [1,2,3,4,5,6,7,8,9,10,11,12].filter(m => !monthsDone.includes(m));
    if (!remaining.length) return 0;
    let meta: YearMeta = existing || { year, status: 'ingesting', count: 0, monthsDone: [], updatedAt: Date.now() };
    meta.status = 'ingesting';
    await saveYearMeta(meta);
    setYearMetas(p => ({ ...p, [year]: { ...meta } }));
    let yearTotal = 0;
    for (const month of remaining) {
      if (abortRef.current) break;
      setIngestPhase(`${year} · ${MONTHS_SHORT[month - 1]} — fetching Wikidata...`);
      const people = await fetchWikidataMonth(year, month);
      if (people.length > 0) await savePeopleBatch(people);
      meta = {
        ...meta,
        monthsDone: [...meta.monthsDone, month],
        count: meta.count + people.length,
        updatedAt: Date.now(),
        status: meta.monthsDone.length + 1 === 12 ? 'complete' : 'partial',
      };
      yearTotal += people.length;
      await saveYearMeta(meta);
      setYearMetas(p => ({ ...p, [year]: { ...meta } }));
      setIngestDone(d => d + 1);
      setIngestLog(l => [`✓ ${year} ${MONTHS_SHORT[month-1]}: ${people.length} stored`, ...l.slice(0, 39)]);
      if (!abortRef.current) await new Promise(r => setTimeout(r, 1000));
    }
    return yearTotal;
  }

  async function startIngestion(yearsToIngest: number[]) {
    abortRef.current = false;
    setIngesting(true);
    setIngestLog([]);
    setScanResults([]);
    const total = yearsToIngest.reduce((sum, y) => {
      const done = yearMetas[y]?.monthsDone?.length || 0;
      return sum + (12 - done);
    }, 0);
    setIngestTotal(total);
    setIngestDone(0);
    setIngestPhase('Initialising...');
    for (const year of yearsToIngest) {
      if (abortRef.current) break;
      await ingestOneYear(year);
    }
    setIngesting(false);
    setIngestPhase(abortRef.current ? 'Stopped.' : 'Ingestion complete ✓');
    await refreshMetas();
  }

  function handleIngestAll() {
    const pending = uniqueYears.filter(y => {
      const s = yearMetas[y]?.status;
      return !s || s === 'pending' || s === 'partial';
    });
    if (!pending.length) return;
    startIngestion(pending);
  }

  async function clearVault() {
    setDialog({
      message: `Delete all stored people data from Firestore for ${targetYear} conflict years? This cannot be undone — you will need to re-run ingestion.`,
      onConfirm: async () => {
        setDialog(null);
        await Promise.all(uniqueYears.map(y =>
          setDoc(doc(db, META_COLL, String(y)), { year: y, status: 'pending', count: 0, monthsDone: [], updatedAt: Date.now() })
        ));
        await refreshMetas();
        setScanResults([]);
        setScanStats({ checked: 0, flagged: 0 });
        setIngestLog([]);
      },
    });
  }

  async function handleCloudSync() {
    setCloudSyncing(true);
    setCloudSyncError(null);
    try {
      // Call our own Next.js API route — same origin, no CORS issue
      const r = await fetch('/api/cloud-sync', { method: 'POST' });
      const d = await r.json() as {
        ok: boolean;
        error?: string;
        monthsProcessed?: number;
        totalPeople?: number;
        vaultComplete?: boolean;
      };

      if (!r.ok || !d.ok) {
        setCloudSyncError(d.error ?? 'Unknown error from worker');
        return;
      }

      await refreshMetas();
    } catch (e: any) {
      console.error('Cloud Sync Error:', e.message);
      setCloudSyncError(e.message);
    } finally {
      setCloudSyncing(false);
    }
  }

  async function runScan() {
    setScanning(true);
    setScanResults([]);
    setScanStats({ checked: 0, flagged: 0 });
    try {
      const readableYears = uniqueYears.filter(y => (yearMetas[y]?.count || 0) > 0);
      if (!readableYears.length) { setScanning(false); return; }
      const people = await getPeopleForYears(readableYears);
      const results: ScanResult[] = [];
      for (const p of people) {
        const conflict = yearConflictMap[p.birthYear];
        if (!conflict) continue;
        const py = reduce(p.birthDay + p.birthMonth + targetUY);
        if (py !== 4 && py !== 7) continue;
        const pyPoints  = py === 4 ? 2 : 1;
        const totalScore = conflict.config.score + pyPoints;
        results.push({ ...p, animal: conflict.config.animal, conflictType: conflict.type, config: conflict.config, py, pyPoints, totalScore, tier: getDangerTier(totalScore) });
      }
      results.sort((a, b) => b.totalScore - a.totalScore);
      setScanResults(results);
      setScanStats({ checked: people.length, flagged: results.length });
    } catch (e) {
      console.error('Scan error:', e);
    }
    setScanning(false);
  }

  const filtered = useMemo(() =>
    scanResults.filter(p =>
      `${p.name} ${p.description}`.toLowerCase().includes(filterQuery.toLowerCase())
    ),
    [scanResults, filterQuery]
  );

  const byTier = useMemo(() =>
    DANGER_TIERS.map(tier => ({ tier, items: filtered.filter(f => f.tier.label === tier.label) }))
      .filter(g => g.items.length > 0),
    [filtered]
  );

  const vaultSummary = useMemo(() => {
    const complete    = uniqueYears.filter(y => yearMetas[y]?.status === 'complete').length;
    const partial     = uniqueYears.filter(y => yearMetas[y]?.status === 'partial').length;
    const pending     = uniqueYears.filter(y => !yearMetas[y] || yearMetas[y].status === 'pending').length;
    const totalPeople = Object.values(yearMetas).reduce((s, m) => s + (m.count || 0), 0);
    return { complete, partial, pending, totalPeople };
  }, [yearMetas, uniqueYears]);

  const ingestPct = ingestTotal > 0 ? Math.round((ingestDone / ingestTotal) * 100) : 0;

  return (
    <>
      {dialog && (
        <ConfirmDialog
          message={dialog.message}
          onConfirm={dialog.onConfirm}
          onCancel={() => setDialog(null)}
        />
      )}
      <div className="space-y-4">
        <Card className="glass-card p-6 border-primary/20 relative overflow-hidden">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-decorative text-primary flex items-center gap-3">
                <Telescope className="h-6 w-6" /> Cosmic Risk Scanner
              </h2>
              <p className="text-xs font-cinzel text-muted-foreground uppercase tracking-widest mt-1">
                {targetYear} · {targetSign.n} Year · {uniqueYears.length} conflict years · 1930–2010
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={clearVault} title="Clear vault data"
                className="text-rose-400 hover:bg-rose-500/10 h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30 font-cinzel text-[10px]">
                FIRESTORE VAULT
              </Badge>
            </div>
          </div>
          <div className="flex gap-1 bg-black/20 p-1 rounded-xl border border-white/10">
            {[
              { id: 'vault',   label: '🗄 Data Vault' },
              { id: 'scanner', label: '🔭 Scanner' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest font-cinzel transition-all ${
                  tab === t.id ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:text-slate-300'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </Card>

        {tab === 'vault' && (
          <Card className="glass-card p-6 border-primary/20 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                [vaultSummary.totalPeople.toLocaleString(), 'People Stored',  'text-primary'     ],
                [uniqueYears.length,                        'Conflict Years', 'text-orange-400'  ],
                [vaultSummary.complete,                     'Complete',       'text-emerald-400' ],
                [vaultSummary.pending + vaultSummary.partial, 'Remaining',   'text-slate-400'   ],
              ].map(([v, l, c]) => (
                <div key={l as string} className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className={`text-xl font-black font-decorative tabular-nums ${c}`}>{v}</div>
                  <div className="text-[8px] uppercase tracking-widest text-muted-foreground font-cinzel mt-0.5">{l}</div>
                </div>
              ))}
            </div>

            {ingesting ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-primary/80 font-cinzel">
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {ingestPhase}
                  </span>
                  <button onClick={() => { abortRef.current = true; }}
                    className="text-rose-400 text-[9px] uppercase font-cinzel">
                    Stop
                  </button>
                </div>
                <Progress value={ingestPct} className="h-2 bg-white/5" />
                <div className="bg-black/30 rounded-xl border border-white/5 p-3 max-h-36 overflow-y-auto space-y-1">
                  {ingestLog.map((l, i) => (
                    <p key={i} className="text-[9px] font-cinzel text-slate-400">{l}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Button onClick={handleIngestAll}
                    disabled={vaultSummary.pending === 0 && vaultSummary.partial === 0}
                    className="flex-1 bg-gradient-to-r from-primary/80 to-primary text-primary-foreground font-black uppercase tracking-widest font-cinzel text-[10px] py-3 h-auto">
                    <Database className="mr-2 h-4 w-4" />
                    {vaultSummary.pending === 0 && vaultSummary.partial === 0
                      ? 'Vault Complete ✓'
                      : `Local Ingest (${vaultSummary.pending + vaultSummary.partial} left)`}
                  </Button>
                  <Button variant="outline" size="icon" onClick={refreshMetas}
                    className="border-white/10 text-slate-400 h-auto px-3">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleCloudSync}
                  disabled={cloudSyncing}
                  variant="outline"
                  className="border-primary/30 text-primary h-auto py-3 px-4 font-black uppercase text-[10px] font-cinzel hover:bg-primary/10 w-full"
                >
                  {cloudSyncing
                    ? <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    : <Globe className="h-4 w-4 mr-2" />}
                  Force Cloud Sync (Background Job)
                </Button>

                {cloudSyncError && (
                  <div className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                    <AlertTriangle className="h-3 w-3 text-rose-400 mt-0.5 shrink-0" />
                    <p className="text-[9px] font-cinzel text-rose-400 leading-relaxed break-all">
                      {cloudSyncError}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-2">
              <p className="text-[10px] font-black uppercase tracking-wider font-cinzel text-primary/80 flex items-center gap-2">
                <CloudLightning className="h-3 w-3" /> Cloud Ingestion Active
              </p>
              <p className="text-[11px] text-slate-400 font-body leading-relaxed">
                A background worker automatically populates your Firestore vault every hour.
                Use <strong className="text-slate-200">Local Ingest</strong> to scan manually from your browser,
                or <strong className="text-slate-200">Cloud Sync</strong> to trigger the server-side worker.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {uniqueYears.map(year => {
                const meta   = yearMetas[year];
                const status = meta?.status || 'pending';
                const info   = yearConflictMap[year];
                const c      = info?.config;
                const pct    = meta ? Math.round((meta.monthsDone?.length || 0) / 12 * 100) : 0;
                const style  = {
                  complete:  { b: 'rgba(76,175,125,0.5)',    bg: 'rgba(76,175,125,0.08)',    dot: '#4caf7d' },
                  partial:   { b: 'rgba(224,148,40,0.5)',    bg: 'rgba(224,148,40,0.08)',    dot: '#e09428' },
                  ingesting: { b: 'rgba(155,142,196,0.5)',   bg: 'rgba(155,142,196,0.08)',   dot: '#9b8ec4' },
                  pending:   { b: 'rgba(255,255,255,0.07)',  bg: 'rgba(255,255,255,0.01)',   dot: '#2a2a3a' },
                }[status];
                return (
                  <div key={year} style={{ border: `1px solid ${style.b}`, background: style.bg }}
                    className="rounded-xl p-2.5 text-center relative overflow-hidden">
                    <div className="text-[12px] font-black text-slate-100 font-decorative">{year}</div>
                    {c && (
                      <div className="text-[7px] uppercase tracking-wide font-cinzel mt-0.5" style={{ color: c.color }}>
                        {c.glyph} {info.type}
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: style.dot }} />
                      <span className="text-[7px] text-slate-500 font-cinzel uppercase">{status}</span>
                    </div>
                    {status === 'partial' && (
                      <div className="absolute bottom-0 left-0 h-[2px] bg-orange-400/50" style={{ width: `${pct}%` }} />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {tab === 'scanner' && (
          <>
            <Card className="glass-card p-6 border-primary/20">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  [scanStats.checked.toLocaleString(),                    'Checked',         'text-primary'    ],
                  [scanResults.length,                                     'Flagged',         'text-orange-400' ],
                  [scanResults.filter(r => r.totalScore >= 5).length,     'Critical/Severe', 'text-rose-500'   ],
                  [scanResults.filter(r => r.totalScore <= 3).length,     'Elevated/Notable','text-blue-400'   ],
                ].map(([v, l, c]) => (
                  <div key={l as string} className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className={`text-2xl font-black font-decorative tabular-nums ${c}`}>{v}</div>
                    <div className="text-[8px] uppercase tracking-widest text-muted-foreground font-cinzel">{l}</div>
                  </div>
                ))}
              </div>

              {scanning ? (
                <div className="flex items-center gap-3 text-xs text-primary/80 font-cinzel py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Reading from Firestore vault — no API calls needed...
                </div>
              ) : vaultSummary.totalPeople === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <Database className="h-10 w-10 mx-auto opacity-20" />
                  <p className="text-[11px] text-slate-500 font-cinzel">
                    Vault is empty. Go to 🗄 Data Vault and run ingestion first.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button onClick={runScan}
                    className="w-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black uppercase tracking-[0.1em] py-3 h-auto font-cinzel">
                    <Zap className="mr-2 h-4 w-4" />
                    Scan {vaultSummary.totalPeople.toLocaleString()} People Instantly
                  </Button>
                </div>
              )}
            </Card>

            {scanResults.length > 0 && (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
                  <Input
                    placeholder="Filter by name, profession or nationality..."
                    value={filterQuery}
                    onChange={e => setFilterQuery(e.target.value)}
                    className="pl-10 bg-black/40 border-primary/20 font-body placeholder:text-muted-foreground/50 h-12"
                  />
                </div>
                {byTier.map(({ tier, items }) => (
                  <div key={tier.label} className="space-y-3">
                    <div className="flex items-center gap-3 px-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] font-cinzel" style={{ color: tier.color }}>
                        {tier.label}
                      </span>
                      <span className="text-[9px] text-slate-500 font-cinzel">· {items.length} people</span>
                    </div>
                    <div className="space-y-2">
                      {items.map((person, idx) => (
                        <Card
                          key={`${person.wikidataId}-${idx}`}
                          className="glass-card p-0 border-transparent overflow-hidden"
                          style={{ borderLeft: `3px solid ${person.tier.color}` }}
                        >
                          <button
                            className="w-full p-4 flex items-start justify-between text-left gap-4"
                            onClick={() => setExpandedId(expandedId === person.wikidataId ? null : person.wikidataId)}
                          >
                            <div className="flex-1" style={{ minWidth: 0 }}>
                              <h4 className="text-sm font-bold text-slate-100 font-body leading-snug">{person.name}</h4>
                              {person.description && (
                                <p className="text-[10px] text-primary/70 font-cinzel uppercase leading-relaxed mt-0.5"
                                  style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                  {person.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-cinzel">
                                <span>{person.birthDay} {MONTHS_SHORT[person.birthMonth - 1]} {person.birthYear}</span>
                                <span>•</span>
                                <span className="font-bold text-primary">PY {person.py}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="outline"
                                className="h-6 text-[8px] uppercase border-white/10 font-cinzel"
                                style={{ color: person.config.color, backgroundColor: person.config.bg }}>
                                {person.config.label}
                              </Badge>
                              <div className="w-8 h-8 rounded bg-black/40 flex flex-col items-center justify-center border"
                                style={{ borderColor: person.tier.border }}>
                                <span className="text-xs font-black font-decorative" style={{ color: person.tier.color }}>
                                  {person.totalScore}
                                </span>
                              </div>
                            </div>
                          </button>
                          <AnimatePresence>
                            {expandedId === person.wikidataId && (
                              <motion.div
                                initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                className="overflow-hidden bg-black/20 border-t border-white/5"
                              >
                                <div className="p-4 space-y-3">
                                  <p className="text-[11px] text-slate-300 leading-relaxed font-body italic">
                                    <span className="text-primary font-bold not-italic mr-1 uppercase font-cinzel">
                                      Astrological Headwind:
                                    </span>
                                    {person.name} ({person.animal}, born {person.birthDay} {MONTHS_SHORT[person.birthMonth - 1]} {person.birthYear}) faces a{' '}
                                    <span style={{ color: person.config.color }}>{person.config.label}</span>{' '}
                                    with the {targetYear} {targetSign.n} cycle. Combined with a Personal Year {person.py}{' '}
                                    ({person.py === 4 ? 'Structure/Restriction' : 'Reflection/Endings'}), this produces a composite danger score of{' '}
                                    <span style={{ color: person.tier.color }}>{person.totalScore}/6 — {person.tier.label}</span>.
                                  </p>
                                  <a
                                    href={person.url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[9px] text-primary/70 hover:text-primary transition-colors uppercase font-bold font-cinzel"
                                  >
                                    <ExternalLink className="h-3 w-3" /> Verify via Wikipedia
                                  </a>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!scanning && scanResults.length === 0 && vaultSummary.totalPeople > 0 && (
              <div className="py-16 text-center opacity-30 space-y-3">
                <Globe className="h-14 w-14 mx-auto stroke-[1]" />
                <p className="font-cinzel text-xs uppercase tracking-[0.2em]">
                  Tap scan to analyse {vaultSummary.totalPeople.toLocaleString()} stored records
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
