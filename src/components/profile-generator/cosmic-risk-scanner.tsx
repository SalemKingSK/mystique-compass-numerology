
'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, Search, ShieldAlert, Zap, 
  RotateCcw, Globe, Loader2, Info,
  ChevronDown, ChevronUp, ExternalLink,
  Target, Calendar, AlertTriangle,
  Play, Square, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ANIMALS } from '@/lib/cosmic-fate/constants';

// --- CONFIGURATION ---
const UY_2026 = 1;
const MO = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Conflict Types matching the app's animal indices
// 0: Rat, 6: Horse, 1: Ox, 3: Rabbit
const CF_CONFIG: Record<number, any> = {
  0: { type: "Chong", label: "Direct Clash", score: 4, color: "#ff4444", bg: "rgba(255,68,68,0.13)", border: "rgba(255,68,68,0.5)", glyph: "☠", rel: "Rat ↔ Horse" },
  6: { type: "Xing", label: "Self-Punishment", score: 3, color: "#e07828", bg: "rgba(224,120,40,0.12)", border: "rgba(224,120,40,0.5)", glyph: "⚔", rel: "Horse ↔ Horse" },
  1: { type: "Hai", label: "Harm", score: 2, color: "#d4aa20", bg: "rgba(212,170,32,0.11)", border: "rgba(212,170,32,0.45)", glyph: "⚠", rel: "Ox ↔ Horse" },
  3: { type: "Po", label: "Breaking", score: 1, color: "#9b8ec4", bg: "rgba(155,142,196,0.11)", border: "rgba(155,142,196,0.4)", glyph: "◎", rel: "Rabbit ↔ Horse" },
};

const DANGER_TIERS = [
  { min: 6, label: "CRITICAL", color: "#ff2020", bg: "rgba(255,32,32,0.16)", border: "rgba(255,32,32,0.55)" },
  { min: 5, label: "SEVERE", color: "#e05020", bg: "rgba(224,80,32,0.14)", border: "rgba(224,80,32,0.55)" },
  { min: 4, label: "HIGH", color: "#e09428", bg: "rgba(224,148,40,0.13)", border: "rgba(224,148,40,0.5)" },
  { min: 3, label: "ELEVATED", color: "#c8c020", bg: "rgba(200,192,32,0.11)", border: "rgba(200,192,32,0.45)" },
  { min: 2, label: "NOTABLE", color: "#9b8ec4", bg: "rgba(155,142,196,0.11)", border: "rgba(155,142,196,0.4)" },
];

const SCAN_YEARS = [
  { year: 1960, zodiacKey: 0 }, { year: 1972, zodiacKey: 0 }, { year: 1984, zodiacKey: 0 }, { year: 1996, zodiacKey: 0 },
  { year: 1966, zodiacKey: 6 }, { year: 1978, zodiacKey: 6 }, { year: 1990, zodiacKey: 6 },
  { year: 1961, zodiacKey: 1 }, { year: 1973, zodiacKey: 1 }, { year: 1985, zodiacKey: 1 }, { year: 1997, zodiacKey: 1 },
  { year: 1963, zodiacKey: 3 }, { year: 1975, zodiacKey: 3 }, { year: 1987, zodiacKey: 3 }, { year: 1999, zodiacKey: 3 },
];

const DEPTHS = [
  { label: "Quick", sub: "~10/yr", perYear: 10 },
  { label: "Standard", sub: "~25/yr", perYear: 25 },
  { label: "Deep", sub: "~50/yr", perYear: 50 },
];

// --- LOGIC HELPERS ---
function reduce(n: number) {
  let s = Math.abs(n);
  while (s > 9) s = String(s).split("").reduce((acc, d) => acc + +d, 0);
  return s || 9;
}

function getPY(d: number, m: number) {
  return reduce(d + m + UY_2026);
}

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

async function fetchCategoryMembers(year: number, limit: number) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:${year}_births&cmlimit=${limit}&cmnamespace=0&format=json&origin=*`;
  const res = await fetch(url);
  const data = await res.json();
  return (data.query?.categorymembers || []).map((m: any) => m.title);
}

async function batchFetchWikitext(titles: string[]) {
  if (!titles.length) return {};
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles.join('|'))}&prop=revisions&rvprop=content&format=json&origin=*`;
  const res = await fetch(url);
  const data = await res.json();
  const pages = data.query?.pages || {};
  const result: Record<string, string> = {};
  for (const p of Object.values(pages) as any[]) {
    if (p.title) result[p.title] = p?.revisions?.[0]?.['*'] || '';
  }
  return result;
}

export function CosmicRiskScanner() {
  const [depthIdx, setDepthIdx] = useState(1);
  const [activeYears, setActiveYears] = useState(new Set(SCAN_YEARS.map(y => y.year)));
  const [running, setRunning] = useState(false);
  const [stats, setStats] = useState({ checked: 0, flagged: 0, currentYear: null as number | null, done: false, phase: "" });
  const [found, setFound] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [scanLog, setScanLog] = useState<any[]>([]);
  const abort = useRef(false);
  const foundRef = useRef<any[]>([]);

  const toggleYear = (y: number) => {
    setActiveYears(prev => {
      const next = new Set(prev);
      if (next.has(y)) next.delete(y);
      else next.add(y);
      return next;
    });
  };

  const startScan = async () => {
    abort.current = false;
    setRunning(true);
    setFound([]);
    foundRef.current = [];
    setExpandedId(null);
    setScanLog([]);
    setStats({ checked: 0, flagged: 0, currentYear: null, done: false, phase: "Initializing Engine..." });

    const perYear = DEPTHS[depthIdx].perYear;
    const yearsToScan = SCAN_YEARS.filter(y => activeYears.has(y.year));
    let totalChecked = 0;
    let totalFlagged = 0;

    for (const { year, zodiacKey } of yearsToScan) {
      if (abort.current) break;
      const cf = CF_CONFIG[zodiacKey];
      const animal = ANIMALS[zodiacKey];
      
      setScanLog(p => [...p, { year, status: "loading", found: 0, checked: 0, animal: animal.n, cf }]);
      setStats(s => ({ ...s, currentYear: year, phase: `Connecting to Wikipedia Category:${year}_births...` }));

      let titles: string[] = [];
      try {
        titles = await fetchCategoryMembers(year, perYear);
      } catch (e) {
        setScanLog(p => p.map(l => l.year === year ? { ...l, status: "error" } : l));
        continue;
      }
      
      if (abort.current) break;

      let yearChecked = 0;
      let yearFound = 0;
      const batches = [];
      for (let i = 0; i < titles.length; i += 20) batches.push(titles.slice(i, i + 20));

      for (const batch of batches) {
        if (abort.current) break;
        setStats(s => ({ ...s, phase: `Scanning ${year} births — Batch ${batches.indexOf(batch) + 1}/${batches.length}...` }));
        
        let wikitextMap: Record<string, string> = {};
        try {
          wikitextMap = await batchFetchWikitext(batch);
        } catch (e) { continue; }

        for (const title of batch) {
          if (abort.current) break;
          const wt = wikitextMap[title] || '';
          const bd = wt ? extractBirthDate(wt) : null;
          
          yearChecked++;
          totalChecked++;

          if (bd) {
            const py = getPY(bd.day, bd.month);
            if (py === 4 || py === 7) {
              const pyPoints = py === 4 ? 2 : 1;
              const totalScore = cf.score + pyPoints;
              const tier = getDangerTier(totalScore);
              
              const entry = {
                name: title,
                bd,
                animal: animal.n,
                emoji: animal.e,
                cf,
                py,
                pyPoints,
                totalScore,
                tier,
                url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`
              };
              
              yearFound++;
              totalFlagged++;
              foundRef.current = [...foundRef.current, entry].sort((a, b) => b.totalScore - a.totalScore);
              setFound([...foundRef.current]);
            }
          }
          
          setStats(s => ({
            ...s,
            checked: totalChecked,
            flagged: totalFlagged,
            phase: `Analyzing ${year} Births... (${yearChecked}/${titles.length})`
          }));
        }
        setScanLog(p => p.map(l => l.year === year ? { ...l, checked: yearChecked, found: yearFound, status: "scanning" } : l));
        // Small throttle
        if (!abort.current) await new Promise(r => setTimeout(r, 100));
      }
      setScanLog(p => p.map(l => l.year === year ? { ...l, status: "done", checked: yearChecked, found: yearFound } : l));
    }

    setRunning(false);
    setStats(s => ({ ...s, currentYear: null, done: true, phase: "Scan Complete" }));
  };

  const stopScan = () => {
    abort.current = true;
    setRunning(false);
    setStats(s => ({ ...s, phase: "Terminated by User" }));
  };

  const resultsByTier = DANGER_TIERS.map(tier => ({
    tier,
    items: found.filter(f => f.tier.label === tier.label)
  })).filter(g => g.items.length > 0);

  return (
    <div className="space-y-6">
      <Card className="glass-card p-6 border-primary/20 relative overflow-hidden">
        {/* Animated Scanline Effect */}
        {running && (
          <motion.div 
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-10 opacity-50"
          />
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
            <h2 className="text-xl font-decorative text-primary flex items-center gap-3">
              <Target className="h-6 w-6" /> Cosmic Risk Scanner
            </h2>
            <p className="text-xs font-cinzel text-muted-foreground uppercase tracking-widest">
              2026 Horse Year · Global Discovery Engine
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30 py-1">
              Live Wikipedia Feed
            </Badge>
          </div>
        </div>

        <div className="p-4 bg-white/5 border border-white/10 rounded-lg mb-6">
          <p className="text-sm leading-relaxed text-slate-300 font-body">
            This engine identifies global figures facing the most volatile energy in 2026. It automatically batch-scans 
            thousands of public profiles from <strong className="text-primary">conflicting zodiac years</strong>, 
            calculates their Personal Year for 2026, and flags those at the intersection of a zodiac clash and a 
            critical numeric vibration (PY 4 or 7).
          </p>
        </div>

        {/* Configuration Panel */}
        {!running && !stats.done && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {Object.values(CF_CONFIG).map(cf => (
                <div key={cf.type} className="p-3 rounded-lg border flex flex-col items-center text-center gap-1" style={{ backgroundColor: cf.bg, borderColor: cf.border, color: cf.color }}>
                  <span className="text-xl">{cf.glyph}</span>
                  <div className="text-[10px] font-black uppercase">{cf.type}</div>
                  <div className="text-[9px] opacity-70 tracking-tighter">{cf.rel}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Zodiac Conflict Target Years</span>
                <Button variant="ghost" size="sm" className="h-6 text-[9px] uppercase" onClick={() => setActiveYears(new Set(SCAN_YEARS.map(y => y.year)))}>
                  Reset Selection
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SCAN_YEARS.map(sy => (
                  <Button
                    key={sy.year}
                    variant={activeYears.has(sy.year) ? "primary" : "outline"}
                    size="sm"
                    onClick={() => toggleYear(sy.year)}
                    className={`h-8 px-3 text-xs ${activeYears.has(sy.year) ? 'bg-primary/20 text-primary border-primary/40' : 'opacity-50'}`}
                  >
                    {sy.year}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 bg-black/20 p-1 rounded-full border border-white/10 w-full sm:w-auto">
                {DEPTHS.map((d, i) => (
                  <button
                    key={d.label}
                    onClick={() => setDepthIdx(i)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all ${
                      depthIdx === i ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {d.label} <span className="opacity-60 text-[8px]">{d.sub}</span>
                  </button>
                ))}
              </div>
              <Button 
                onClick={startScan} 
                disabled={activeYears.size === 0}
                className="w-full sm:w-auto ml-auto bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-black uppercase tracking-[0.1em] px-8"
              >
                <Zap className="mr-2 h-4 w-4" /> Initialize Scan
              </Button>
            </div>
          </div>
        )}

        {/* Active Scan UI */}
        {(running || stats.done) && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-black text-primary">{stats.checked}</div>
                <div className="text-[8px] uppercase tracking-widest text-muted-foreground">Profiles Evaluated</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-black text-orange-400">{stats.flagged}</div>
                <div className="text-[8px] uppercase tracking-widest text-muted-foreground">Risks Flagged</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-black text-rose-500">{found.filter(f => f.totalScore >= 5).length}</div>
                <div className="text-[8px] uppercase tracking-widest text-muted-foreground">Critical/Severe</div>
              </div>
              <div className="text-center p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-2xl font-black text-blue-400">{found.filter(f => f.totalScore <= 3).length}</div>
                <div className="text-[8px] uppercase tracking-widest text-muted-foreground">Elevated/Notable</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-primary/80 font-cinzel">
                  {running && <Loader2 className="h-3 w-3 animate-spin" />}
                  {stats.phase}
                </div>
                {running && (
                  <Button variant="ghost" size="sm" onClick={stopScan} className="h-6 text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 text-[9px] uppercase">
                    <Square className="mr-1.5 h-3 w-3 fill-current" /> Terminate
                  </Button>
                )}
              </div>
              <Progress value={yearsToScanProgress(scanLog)} className="h-1 bg-white/5" />
            </div>

            {/* Scrollable Scan Log */}
            <div className="max-h-32 overflow-y-auto space-y-1 pr-2 scrollbar-thin border-y border-white/5 py-2">
              {scanLog.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded bg-black/20 text-[10px] font-medium">
                  <div className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      log.status === 'done' ? 'bg-emerald-500' : 
                      log.status === 'scanning' ? 'bg-orange-500 animate-pulse' : 
                      'bg-slate-700'
                    }`} />
                    <span className="text-slate-200">{log.year}</span>
                    <span className="text-slate-500 uppercase tracking-tighter">{log.animal}</span>
                    <span className="opacity-60" style={{ color: log.cf.color }}>{log.cf.type}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-500 italic">{log.checked} checked</span>
                    <span className={log.found > 0 ? "text-orange-400 font-bold" : "text-emerald-500"}>
                      {log.found > 0 ? `⚠️ ${log.found} flagged` : '✓ Clear'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {stats.done && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setStats({ checked: 0, flagged: 0, currentYear: null, done: false, phase: "" });
                  setFound([]);
                  setScanLog([]);
                  foundRef.current = [];
                }}
                className="w-full text-primary/70 border-primary/20 hover:bg-primary/5 h-8 text-[10px] uppercase"
              >
                <RotateCcw className="mr-2 h-3 w-3" /> New Scan / Reset Engine
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Results Display */}
      <AnimatePresence>
        {found.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
              <h3 className="font-cinzel text-[0.7rem] text-orange-400 uppercase tracking-[0.3em]">Scanned Individuals — Ranked by Composite Risk</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
            </div>

            {resultsByTier.map(({ tier, items }) => (
              <div key={tier.label} className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-slate-900 border border-white/10 text-xs font-black" style={{ color: tier.color, borderColor: tier.border }}>
                    {tier.min}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: tier.color }}>{tier.label}</span>
                  <span className="text-[9px] text-slate-500">· {items.length} {items.length === 1 ? 'Individual' : 'Individuals'} Found</span>
                </div>

                <div className="space-y-2">
                  {items.map((person, idx) => (
                    <Card 
                      key={`${person.name}-${idx}`} 
                      className={`glass-card p-0 border-transparent overflow-hidden transition-all duration-300 hover:border-white/20`}
                      style={{ borderLeft: `3px solid ${person.tier.color}`, backgroundColor: expandedId === idx ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)' }}
                    >
                      <button 
                        className="w-full p-4 flex items-center justify-between text-left gap-4"
                        onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-100 truncate">{person.name}</h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] text-slate-500">
                            <span className="flex items-center gap-1">{person.emoji} {person.animal}</span>
                            <span>•</span>
                            <span>{person.bd.day} {MO[person.bd.month]} {person.bd.year}</span>
                            <span>•</span>
                            <span className="font-bold text-primary">PY {person.py}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="h-6 text-[8px] uppercase border-white/10" style={{ color: person.cf.color, backgroundColor: person.cf.bg }}>
                            {person.cf.type}
                          </Badge>
                          <div className="w-10 h-10 rounded-lg flex flex-col items-center justify-center border border-white/10 bg-black/40" style={{ borderColor: person.tier.border }}>
                            <span className="text-xs font-black" style={{ color: person.tier.color }}>{person.totalScore}</span>
                            <span className="text-[6px] uppercase opacity-50">/ 6</span>
                          </div>
                          {expandedId === idx ? <ChevronUp className="h-4 w-4 text-slate-600" /> : <ChevronDown className="h-4 w-4 text-slate-600" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {expandedId === idx && (
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 pt-0 border-t border-white/5 space-y-4 bg-black/20">
                              <div className="grid grid-cols-2 gap-3 pt-4">
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                  <div className="text-[8px] uppercase text-slate-500 mb-1">Zodiac Conflict</div>
                                  <div className="text-xs font-bold" style={{ color: person.cf.color }}>{person.cf.label}</div>
                                  <div className="text-[9px] text-slate-400 mt-1">Score: {person.cf.score}/4</div>
                                </div>
                                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                                  <div className="text-[8px] uppercase text-slate-500 mb-1">Personal Year 2026</div>
                                  <div className="text-xs font-bold text-primary">Vibration {person.py}</div>
                                  <div className="text-[9px] text-slate-400 mt-1">Weight: +{person.pyPoints} pts</div>
                                </div>
                              </div>
                              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 italic text-[11px] text-slate-300 leading-relaxed font-body">
                                <span className="text-primary font-bold not-italic mr-1 uppercase">Analysis:</span>
                                {person.name} ({person.animal}) enters 2026 under a {person.cf.label} with the Horse Year. Combined with a Personal Year {person.py}, this creates a high-voltage {person.tier.label.toLowerCase()} tension where structural discipline or mystical detachment will be forced by external circumstances.
                              </div>
                              <a 
                                href={person.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 text-[9px] text-primary/70 hover:text-primary transition-colors uppercase tracking-widest font-bold"
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
          </motion.div>
        )}
      </AnimatePresence>

      {!running && !stats.done && found.length === 0 && (
        <div className="py-20 text-center opacity-30 space-y-4">
          < Globe className="h-16 w-16 mx-auto stroke-[1]" />
          <div className="space-y-1">
            <p className="font-cinzel text-xs uppercase tracking-[0.2em]">Discovery Engine Idle</p>
            <p className="font-body text-sm italic">Initialize the engine to begin active scanning of historical records.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function yearsToScanProgress(log: any[]) {
  if (!log.length) return 0;
  const done = log.filter(l => l.status === 'done').length;
  return (done / log.length) * 100;
}
