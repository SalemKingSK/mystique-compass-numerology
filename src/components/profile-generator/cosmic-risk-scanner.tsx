'use client';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Zap, Loader2,
  ExternalLink, Telescope, Trash2, History, Globe, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ANIMALS, RELATIONS } from '@/lib/cosmic-fate/constants';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function reduce(n: number) {
  let s = Math.abs(n);
  while (s > 9) s = String(s).split('').reduce((acc, d) => acc + +d, 0);
  return s || 9;
}

const DANGER_TIERS = [
  { min: 6, label: 'CRITICAL',  color: '#ff2020', bg: 'rgba(255,32,32,0.16)',   border: 'rgba(255,32,32,0.55)'   },
  { min: 5, label: 'SEVERE',    color: '#e05020', bg: 'rgba(224,80,32,0.14)',   border: 'rgba(224,80,32,0.55)'   },
  { min: 4, label: 'HIGH',      color: '#e09428', bg: 'rgba(224,148,40,0.13)',  border: 'rgba(224,148,40,0.5)'   },
  { min: 3, label: 'ELEVATED',  color: '#c8c020', bg: 'rgba(200,192,32,0.11)', border: 'rgba(200,192,32,0.45)'  },
  { min: 2, label: 'NOTABLE',   color: '#9b8ec4', bg: 'rgba(155,142,196,0.11)',border: 'rgba(155,142,196,0.4)'  },
];

const DEPTHS = [
  { label: 'Quick',    sub: '~50/yr',  perYear: 50  },
  { label: 'Global',   sub: '~250/yr', perYear: 250 },
  { label: 'Infinite', sub: '~500/yr', perYear: 500 },
];

function getDangerTier(total: number) {
  return DANGER_TIERS.find(x => total >= x.min) || DANGER_TIERS[4];
}

function extractBirthDate(wikitext: string) {
  const p1 = wikitext.match(/\{\{birth[\s_]date(?:[\s_]and[\s_]age)?\s*(?:\|[^|{}]*)*?\|\s*(\d{4})\s*\|\s*(\d{1,2})\s*\|\s*(\d{1,2})/i);
  if (p1) return { year: +p1[1], month: +p1[2], day: +p1[3] };
  const p2 = wikitext.match(/\|\s*birth[_ ]date\s*=\s*(\d{4})-(\d{1,2})-(\d{1,2})/i);
  if (p2) return { year: +p2[1], month: +p2[2], day: +p2[3] };
  const p3 = wikitext.match(/\{\{dob\s*\|\s*(\d{4})\s*\|\s*(\d{1,2})\s*\|\s*(\d{1,2})/i);
  if (p3) return { year: +p3[1], month: +p3[2], day: +p3[3] };
  const p4 = wikitext.match(/\{\{birth[\s_]date[^}]{0,100}\|\s*(\d{4})\s*\|\s*(\d{1,2})\s*\|\s*(\d{1,2})/i);
  if (p4) return { year: +p4[1], month: +p4[2], day: +p4[3] };
  return null;
}

// ─── Network helpers ───────────────────────────────────────────────────────────

async function fetchWithRetry(url: string, retries = 3, delay = 1200) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const r = await fetch(url);
      if (!r.ok) {
        if (r.status === 429) {
          await new Promise(res => setTimeout(res, delay * 3));
          continue;
        }
        throw new Error(`HTTP ${r.status}`);
      }
      return await r.json();
    } catch (e: any) {
      if (attempt === retries - 1) {
        console.warn('Fetch failed after retries:', e.message);
        return null;
      }
      await new Promise(res => setTimeout(res, delay * Math.pow(2, attempt)));
    }
  }
}

async function fetchAllMembersForYear(
  year: number,
  limit: number,
  resumeToken?: string | null
): Promise<{ titles: string[]; finalToken: string | null }> {
  const titles: string[] = [];
  const PAGE_SIZE = 50;
  let cmcontinue: string | null = resumeToken || null;

  while (titles.length < limit) {
    const need = Math.min(PAGE_SIZE, limit - titles.length);
    const contParam = cmcontinue ? `&cmcontinue=${encodeURIComponent(cmcontinue)}` : '';
    const url =
      `https://en.wikipedia.org/w/api.php?` +
      `action=query&list=categorymembers` +
      `&cmtitle=Category:${year}_births` +
      `&cmlimit=${need}&cmnamespace=0&format=json&origin=*` +
      contParam;

    const data = await fetchWithRetry(url);
    if (!data) break;

    const page = (data.query?.categorymembers || []).map((m: any) => m.title);
    titles.push(...page);
    cmcontinue = data.continue?.cmcontinue || null;
    if (!cmcontinue) break;
    await new Promise(r => setTimeout(r, 650));
  }

  return { titles, finalToken: cmcontinue };
}

async function batchFetchMetadata(
  titles: string[]
): Promise<Record<string, { wikitext: string; description: string }>> {
  if (!titles.length) return {};
  const url =
    `https://en.wikipedia.org/w/api.php?` +
    `action=query&titles=${encodeURIComponent(titles.join('|'))}` +
    `&prop=revisions|description&rvprop=content&format=json&origin=*`;
  const data = await fetchWithRetry(url);
  if (!data) return {};
  const pages = data.query?.pages || {};
  const result: Record<string, { wikitext: string; description: string }> = {};
  for (const p of Object.values(pages) as any[]) {
    if (p.title) {
      result[p.title] = {
        wikitext: p?.revisions?.[0]?.['*'] || '',
        description: p?.description || '',
      };
    }
  }
  return result;
}

// ─── Inline confirm dialog (replaces window.confirm which is blocked in iframes) ──

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 max-w-sm w-full bg-[#0d0a1a] border border-primary/30 rounded-2xl p-6 space-y-5 shadow-2xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-200 font-body leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-200 font-cinzel text-[10px] uppercase">
            Cancel
          </Button>
          <Button size="sm"
            onClick={onConfirm}
            className="bg-rose-500 hover:bg-rose-600 text-white font-cinzel text-[10px] uppercase">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CosmicRiskScanner({ targetYear }: { targetYear: number }) {
  const [depthIdx, setDepthIdx]         = useState(1);
  const [running, setRunning]           = useState(false);
  const [stats, setStats]               = useState({ checked: 0, flagged: 0, done: false, phase: '' });
  const [found, setFound]               = useState<any[]>([]);
  const [expandedId, setExpandedId]     = useState<string | null>(null);
  const [scanLog, setScanLog]           = useState<any[]>([]);
  const [filterQuery, setFilterQuery]   = useState('');
  const [continueTokens, setContinueTokens] = useState<Record<number, string | null>>({});

  // ── FIX: React-state dialogs — replaces window.confirm (blocked in iframes) ──
  const [dialog, setDialog] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);

  function showConfirm(message: string, onConfirm: () => void) {
    setDialog({ message, onConfirm });
  }
  function dismissDialog() {
    setDialog(null);
  }
  // ─────────────────────────────────────────────────────────────────────────────

  const abort     = useRef(false);
  const foundRef  = useRef<any[]>([]);
  const statsRef  = useRef({ checked: 0, flagged: 0 });
  const tokensRef = useRef<Record<number, string | null>>({});

  // ── Dynamic config ──────────────────────────────────────────────────────────

  const targetSign = useMemo(() => {
    const idx = ((targetYear - 1900) % 12 + 12) % 12;
    return ANIMALS[idx] || ANIMALS[0];
  }, [targetYear]);

  const targetUY = useMemo(() => reduce(targetYear), [targetYear]);

  const CF_CONFIG = useMemo(() => {
    const rels = RELATIONS[targetSign.n] || RELATIONS.Rat;
    return {
      Chong: { label: 'Direct Clash',    score: 4, color: '#ff4444', bg: 'rgba(255,68,68,0.13)',    border: 'rgba(255,68,68,0.5)',    glyph: '☠', animal: rels.clash    },
      Xing:  { label: 'Self-Punishment', score: 3, color: '#e07828', bg: 'rgba(224,120,40,0.12)',   border: 'rgba(224,120,40,0.5)',   glyph: '⚔', animal: ['Horse','Dragon','Rooster','Pig'].includes(targetSign.n) ? targetSign.n : null },
      Hai:   { label: 'Harm',            score: 2, color: '#d4aa20', bg: 'rgba(212,170,32,0.11)',  border: 'rgba(212,170,32,0.45)',  glyph: '⚠', animal: rels.harm     },
      Po:    { label: 'Breaking',        score: 1, color: '#9b8ec4', bg: 'rgba(155,142,196,0.11)', border: 'rgba(155,142,196,0.4)',  glyph: '◎', animal: rels.destroy  },
    };
  }, [targetSign]);

  const SCAN_YEARS_DYNAMIC = useMemo(() => {
    const list: { year: number; type: string; config: any }[] = [];
    Object.entries(CF_CONFIG).forEach(([type, config]) => {
      if (!config.animal) return;
      const animalIdx = ANIMALS.findIndex(a => a.n === config.animal);
      [2, 3, 4, 5, 6].forEach(cycle => {
        list.push({
          year: targetYear - (cycle * 12) + (animalIdx - (targetYear - 1900) % 12),
          type,
          config,
        });
      });
    });
    return list
      .filter(y => y.year > 1900 && y.year < targetYear)
      .sort((a, b) => b.year - a.year);
  }, [targetYear, CF_CONFIG]);

  // ── Checkpoint ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const key = `scanner_posterity_v6_${targetYear}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        foundRef.current  = state.found  || [];
        statsRef.current  = state.stats  || { checked: 0, flagged: 0 };
        tokensRef.current = state.tokens || {};
        setFound(state.found || []);
        setStats(state.stats || { checked: 0, flagged: 0, done: true, phase: '' });
        setContinueTokens(state.tokens || {});
      } catch { /* corrupt — start fresh */ }
    } else {
      foundRef.current  = [];
      statsRef.current  = { checked: 0, flagged: 0 };
      tokensRef.current = {};
      setFound([]);
      setStats({ checked: 0, flagged: 0, done: false, phase: '' });
      setContinueTokens({});
    }
    setScanLog([]);
  }, [targetYear]);

  function persistState() {
    const key = `scanner_posterity_v6_${targetYear}`;
    localStorage.setItem(key, JSON.stringify({
      found:  foundRef.current,
      stats:  statsRef.current,
      tokens: tokensRef.current,
    }));
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  function clearData() {
    // ← was: if (!confirm(...)) return;  — blocked in iframes
    showConfirm(
      `Clear all discovered data for ${targetYear}? This cannot be undone.`,
      () => {
        dismissDialog();
        const key = `scanner_posterity_v6_${targetYear}`;
        localStorage.removeItem(key);
        foundRef.current  = [];
        statsRef.current  = { checked: 0, flagged: 0 };
        tokensRef.current = {};
        setFound([]);
        setStats({ checked: 0, flagged: 0, done: false, phase: '' });
        setContinueTokens({});
        setScanLog([]);
      }
    );
  }

  function handleScanButton() {
    if (found.length > 0) {
      // Already have data — continue from checkpoint, no confirmation needed
      executeScan(true);
    } else {
      // Fresh start — no prior data so no need to confirm reset
      executeScan(false);
    }
  }

  // Separate the scan execution from the confirmation flow
  const executeScan = async (isContinuing: boolean) => {
    abort.current = false;
    setRunning(true);

    if (!isContinuing) {
      // Reset everything for a clean run
      tokensRef.current = {};
      statsRef.current  = { checked: 0, flagged: 0 };
      foundRef.current  = [];
      setFound([]);
      setContinueTokens({});
    }

    setStats(s => ({ ...s, done: false, phase: 'Initialising Engine...' }));

    const perYear = DEPTHS[depthIdx].perYear;

    for (const { year, type, config } of SCAN_YEARS_DYNAMIC) {
      if (abort.current) break;

      const currentToken = tokensRef.current[year];
      if (isContinuing && currentToken === 'COMPLETED') continue;

      setScanLog(prev => {
        const exists = prev.find(l => l.year === year);
        if (exists) return prev.map(l => l.year === year ? { ...l, status: 'loading' } : l);
        return [...prev, { year, status: 'loading', found: 0, checked: 0, animal: config.animal, type, config }];
      });

      setStats(s => ({ ...s, phase: `Fetching Category:${year}_births...` }));

      let titles: string[]        = [];
      let finalToken: string | null = null;
      try {
        const resumeFrom = isContinuing && currentToken !== 'COMPLETED' ? currentToken : null;
        const result     = await fetchAllMembersForYear(year, perYear, resumeFrom);
        titles           = result.titles;
        finalToken       = result.finalToken;
        tokensRef.current[year] = finalToken ?? 'COMPLETED';
        setContinueTokens({ ...tokensRef.current });
      } catch {
        setScanLog(p => p.map(l => l.year === year ? { ...l, status: 'error' } : l));
        continue;
      }

      if (abort.current) break;
      if (!titles.length) {
        setScanLog(p => p.map(l => l.year === year ? { ...l, status: 'done' } : l));
        continue;
      }

      let yearChecked = 0;
      let yearFound   = 0;
      const batches: string[][] = [];
      for (let i = 0; i < titles.length; i += 50) batches.push(titles.slice(i, i + 50));

      for (const batch of batches) {
        if (abort.current) break;

        setStats(s => ({
          ...s,
          phase: `Scanning ${year} Births... (${yearChecked}/${titles.length})`,
        }));

        let metadataMap: Record<string, { wikitext: string; description: string }> = {};
        try {
          metadataMap = await batchFetchMetadata(batch);
        } catch {
          yearChecked            += batch.length;
          statsRef.current.checked += batch.length;
          continue;
        }

        for (const title of batch) {
          if (abort.current) break;
          const meta           = metadataMap[title];
          const wt             = meta?.wikitext    || '';
          const bioDescription = meta?.description || '';
          const bd             = wt ? extractBirthDate(wt) : null;

          yearChecked++;
          statsRef.current.checked++;

          if (bd) {
            const py = reduce(bd.day + bd.month + targetUY);
            if (py === 4 || py === 7) {
              const pyPoints   = py === 4 ? 2 : 1;
              const totalScore = config.score + pyPoints;
              const tier       = getDangerTier(totalScore);
              const entry      = {
                name: title, bioDescription, bd,
                animal: config.animal, type, config,
                py, pyPoints, totalScore, tier,
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
              };
              if (!foundRef.current.find(f => f.name === entry.name)) {
                yearFound++;
                statsRef.current.flagged++;
                foundRef.current = [...foundRef.current, entry].sort((a, b) => b.totalScore - a.totalScore);
                setFound([...foundRef.current]);
              }
            }
          }

          setStats(s => ({
            ...s,
            checked: statsRef.current.checked,
            flagged: statsRef.current.flagged,
            phase:   `Scanning ${year} Births... (${yearChecked}/${titles.length})`,
          }));
        }

        setScanLog(p => p.map(l =>
          l.year === year ? { ...l, checked: yearChecked, found: yearFound, status: 'scanning' } : l
        ));
        persistState();
        if (!abort.current) await new Promise(r => setTimeout(r, 650));
      }

      setScanLog(p => p.map(l =>
        l.year === year
          ? { ...l, status: tokensRef.current[year] === 'COMPLETED' ? 'done' : 'ready' }
          : l
      ));
    }

    setRunning(false);
    setStats(s => ({ ...s, done: true, phase: 'Batch Complete' }));
    persistState();
  };

  // ── When user wants to RESTART a scan that already has data ────────────────
  function handleRestartScan() {
    showConfirm(
      'Reset current progress and start from the beginning? All stored results will be cleared.',
      () => {
        dismissDialog();
        tokensRef.current = {};
        statsRef.current  = { checked: 0, flagged: 0 };
        foundRef.current  = [];
        setFound([]);
        setContinueTokens({});
        executeScan(false);
      }
    );
  }

  // ── Derived state ──────────────────────────────────────────────────────────

  const filteredFound = useMemo(() =>
    found.filter(p =>
      `${p.name} ${p.bioDescription}`.toLowerCase().includes(filterQuery.toLowerCase())
    ),
    [found, filterQuery]
  );

  const resultsByTier = useMemo(() =>
    DANGER_TIERS
      .map(tier => ({ tier, items: filteredFound.filter(f => f.tier.label === tier.label) }))
      .filter(g => g.items.length > 0),
    [filteredFound]
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Inline dialog — replaces window.confirm */}
      {dialog && (
        <ConfirmDialog
          message={dialog.message}
          onConfirm={dialog.onConfirm}
          onCancel={dismissDialog}
        />
      )}

      <div className="space-y-6">
        <Card className="glass-card p-6 border-primary/20 relative overflow-hidden">
          {running && (
            <motion.div
              initial={{ top: '-10%' }}
              animate={{ top: '110%' }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-10 opacity-50"
            />
          )}

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <h2 className="text-xl font-decorative text-primary flex items-center gap-3">
                <Telescope className="h-6 w-6" /> Cosmic Risk Scanner
              </h2>
              <p className="text-xs font-cinzel text-muted-foreground uppercase tracking-widest">
                TEMPORAL CONTEXT: {targetYear} {targetSign.n} YEAR ({targetSign.e})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={clearData}
                title="Clear Stored Data"
                className="text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30 py-1 font-cinzel text-[10px]">
                WIKIPEDIA LIVE FEED
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              [stats.checked,                                'Total Checked',    'text-primary'  ],
              [found.length,                                 'Discovered',       'text-orange-400'],
              [found.filter(f => f.totalScore >= 5).length,  'Critical/Severe',  'text-rose-500'  ],
              [found.filter(f => f.totalScore <= 3).length,  'Elevated/Notable', 'text-blue-400'  ],
            ].map(([val, label, cls]) => (
              <div key={label as string} className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                <div className={`text-2xl font-black font-decorative tabular-nums ${cls}`}>{val}</div>
                <div className="text-[8px] uppercase tracking-widest text-muted-foreground font-cinzel">{label}</div>
              </div>
            ))}
          </div>

          {/* Controls */}
          {running ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-primary/80 font-cinzel">
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {stats.phase}
                </span>
                <Button variant="ghost" size="sm"
                  onClick={() => { abort.current = true; }}
                  className="h-6 text-rose-400 text-[9px] uppercase">
                  Stop
                </Button>
              </div>
              <Progress value={(statsRef.current.checked % 500) / 5} className="h-1 bg-white/5" />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 bg-black/20 p-1 rounded-full border border-white/10 w-full sm:w-auto">
                {DEPTHS.map((d, i) => (
                  <button key={d.label} onClick={() => setDepthIdx(i)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all font-cinzel ${
                      depthIdx === i ? 'bg-primary text-primary-foreground' : 'text-slate-500'
                    }`}>
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 w-full sm:w-auto ml-auto">
                {/* Main action button */}
                <Button
                  onClick={handleScanButton}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-orange-500 to-rose-500 text-white font-black uppercase tracking-[0.1em] px-8 h-auto py-3 whitespace-normal text-center leading-tight">
                  <Zap className="mr-2 h-4 w-4 shrink-0" />
                  {found.length > 0 ? 'Scan Next Batch' : 'Start Discovery'}
                </Button>

                {/* Restart button — only shown when there's existing data */}
                {found.length > 0 && (
                  <Button
                    onClick={handleRestartScan}
                    variant="outline"
                    className="shrink-0 border-slate-600 text-slate-400 hover:text-slate-200 font-cinzel text-[10px] uppercase px-3 h-auto py-3">
                    Reset
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>

        {/* Results */}
        {found.length > 0 && (
          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
              <Input
                placeholder="Filter by name, profession or nationality..."
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                className="pl-10 bg-black/40 border-primary/20 font-body placeholder:text-muted-foreground/50 h-12"
              />
            </div>

            <div className="flex items-center gap-2 mb-2 px-2">
              <History className="h-4 w-4 text-primary/60" />
              <span className="text-xs font-cinzel text-primary/60 uppercase tracking-widest">
                History Database Entry Total for {targetYear}:{' '}
                <span className="font-bold text-primary">{found.length} Profiles</span>
              </span>
            </div>

            {resultsByTier.map(({ tier, items }) => (
              <div key={tier.label} className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] font-cinzel"
                    style={{ color: tier.color }}>{tier.label}</span>
                  <span className="text-[9px] text-slate-500 font-cinzel">· {items.length} Discoveries</span>
                </div>

                <div className="space-y-2">
                  {items.map((person, idx) => (
                    <Card key={`${person.name}-${idx}`}
                      className="glass-card p-0 border-transparent overflow-hidden"
                      style={{ borderLeft: `3px solid ${person.tier.color}` }}>
                      <button
                        className="w-full p-4 flex items-start justify-between text-left gap-4"
                        onClick={() => setExpandedId(expandedId === person.name ? null : person.name)}>
                        <div className="flex-1" style={{ minWidth: 0 }}>
                          <h4 className="text-sm font-bold text-slate-100 font-body leading-snug">{person.name}</h4>
                          <p className="text-[10px] text-primary/70 font-cinzel uppercase leading-relaxed mt-0.5"
                            style={{ wordBreak: 'break-word', whiteSpace: 'normal', overflow: 'visible' }}>
                            {person.bioDescription || 'Notable Individual'}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-cinzel">
                            <span>Born {person.bd.year}</span>
                            <span>•</span>
                            <span className="font-bold text-primary">PY {person.py}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline"
                            className="h-6 text-[8px] uppercase border-white/10 font-cinzel"
                            style={{ color: person.config.color, backgroundColor: person.config.bg }}>
                            {person.config.label}
                          </Badge>
                          <div className="w-8 h-8 rounded bg-black/40 flex flex-col items-center justify-center border border-white/10"
                            style={{ borderColor: person.tier.border }}>
                            <span className="text-xs font-black font-decorative"
                              style={{ color: person.tier.color }}>{person.totalScore}</span>
                          </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedId === person.name && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden bg-black/20 border-t border-white/5">
                            <div className="p-4 space-y-4">
                              {person.bioDescription && (
                                <div className="pb-3 border-b border-white/5">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-primary/50 font-cinzel block mb-1">Profile</span>
                                  <p className="text-[11px] text-slate-200 font-cinzel uppercase leading-relaxed">
                                    {person.bioDescription}
                                  </p>
                                </div>
                              )}
                              <p className="text-[11px] text-slate-300 leading-relaxed font-body italic">
                                <span className="text-primary font-bold not-italic mr-1 uppercase font-cinzel">
                                  Astrological Headwind:
                                </span>
                                {person.name} faces a {person.config.label} with the {targetYear}{' '}
                                {targetSign.n} cycle. Coupled with a Personal Year {person.py}{' '}
                                ({person.py === 4 ? 'Structure/Restriction' : 'Reflection/Endings'}),
                                this creates a high-voltage energetic tension requiring profound discernment.
                              </p>
                              <a href={person.url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 text-[9px] text-primary/70 hover:text-primary transition-colors uppercase font-bold font-cinzel">
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

        {!running && found.length === 0 && (
          <div className="py-20 text-center opacity-30 space-y-4">
            <Globe className="h-16 w-16 mx-auto stroke-[1]" />
            <p className="font-cinzel text-xs uppercase tracking-[0.2em]">Discovery Engine Ready</p>
          </div>
        )}
      </div>
    </>
  );
}
