'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown, Minus,
         Loader2, ChevronDown, Zap, Shield, Clock } from 'lucide-react';
import { detectTransitions, type DetectedTransition, type MatrixState } from '@/lib/transitions/engine';
import { generateTransitionAdvisory } from '@/lib/transitions/advisory-service';
import type { NumerologyData } from './types';

function reduceNum(n: number): number {
  if (n===11||n===22||n===33) return n;
  let val = Math.abs(n);
  while (val > 9) val = String(val).split('').reduce((a, d) => a + +d, 0);
  return val || 9;
}
function getPersonalYear(d: number, m: number): number {
  const yr = new Date().getFullYear();
  return reduceNum(reduceNum(d) + reduceNum(m) + reduceNum(String(yr).split('').reduce((a,c)=>a+ +c,0)));
}

const URGENCY_CONFIG = {
  critical: { label:'CRITICAL', color:'#ef4444', bg:'rgba(239,68,68,0.1)', border:'rgba(239,68,68,0.35)' },
  high:     { label:'HIGH',     color:'#f59e0b', bg:'rgba(245,158,11,0.1)', border:'rgba(245,158,11,0.3)' },
  moderate: { label:'ACTIVE',   color:'#a78bfa', bg:'rgba(167,139,250,0.1)', border:'rgba(167,139,250,0.28)' },
  latent:   { label:'LATENT',   color:'#60a5fa', bg:'rgba(96,165,250,0.08)', border:'rgba(96,165,250,0.2)' },
};

const DIRECTION_ICON = {
  ascent:  <TrendingUp  style={{ width:16, height:16, color:'#34d399' }} />,
  descent: <TrendingDown style={{ width:16, height:16, color:'#ef4444' }} />,
  dual:    <Minus       style={{ width:16, height:16, color:'#d4af37' }} />,
};

function NumberArrow({ from, to, direction }: { from: number; to: number; direction: string }) {
  const col = direction === 'ascent' ? '#34d399' : direction === 'descent' ? '#ef4444' : '#d4af37';
  return (
    <svg viewBox="0 0 120 40" style={{ width:120, height:40, flexShrink:0 }}>
      <defs>
        <marker id={`ta-arrow-${from}${to}`} markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={col}/>
        </marker>
      </defs>
      <circle cx="20" cy="20" r="16" fill={`${col}1a`} stroke={col} strokeWidth="1.5" />
      <text x="20" y="20" textAnchor="middle" dominantBaseline="middle" fontFamily="'Cinzel Decorative', serif" fontSize="13" fontWeight="700" fill={col}>{from}</text>
      <line x1="37" y1="20" x2="80" y2="20" stroke={col} strokeWidth="1.5" markerEnd={`url(#ta-arrow-${from}${to})`} strokeDasharray="4 3" />
      <circle cx="100" cy="20" r="16" fill={`${col}1a`} stroke={col} strokeWidth="1.5" />
      <text x="100" y="20" textAnchor="middle" dominantBaseline="middle" fontFamily="'Cinzel Decorative', serif" fontSize="13" fontWeight="700" fill={col}>{to}</text>
    </svg>
  );
}

function AdvisoryViewer({ text }: { text: string }) {
  const sections = text.split(/###\s+SECTION \d+:/g).filter(Boolean);
  const headers = [...text.matchAll(/###\s+SECTION \d+:\s*(.+)/g)].map(m => m[1].trim());
  const [activeSection, setActiveSection] = React.useState(0);

  return (
    <div className="mt-4 space-y-4">
      <div className="flex gap-1.5 flex-wrap">
        {headers.map((h, i) => (
          <button key={i} onClick={() => setActiveSection(i)}
            className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold border transition-all ${
              activeSection === i ? 'bg-primary/20 text-primary border-primary/40' : 'bg-white/5 text-muted-foreground border-white/10'
            }`}>
            {i + 1}. {h.split('—')[0].trim()}
          </button>
        ))}
      </div>
      <motion.div key={activeSection} initial={{ opacity:0 }} animate={{ opacity:1 }} className="p-4 rounded-xl bg-black/40 border border-white/5 text-[13px] leading-relaxed text-slate-300">
        <h4 className="font-cinzel text-xs text-primary mb-3 uppercase tracking-widest">{headers[activeSection]}</h4>
        <div className="whitespace-pre-wrap">{sections[activeSection]?.trim()}</div>
      </motion.div>
    </div>
  );
}

function TransitionCard({ t, matrixState }: { t: DetectedTransition; matrixState: MatrixState }) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [advisory, setAdvisory] = React.useState<string | null>(null);
  const urg = URGENCY_CONFIG[t.urgency];

  const fetchAdvisory = async () => {
    if (advisory) { setOpen(!open); return; }
    setLoading(true); setOpen(true);
    try {
      const text = await generateTransitionAdvisory(t, matrixState);
      setAdvisory(text);
    } catch {
      setAdvisory("Failed to generate advisory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="glass-card border-white/10 overflow-hidden" style={{ borderLeft: `4px solid ${urg.color}` }}>
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <NumberArrow from={t.from} to={t.to} direction={t.direction} />
          <div className="flex-1 text-right">
            <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full" style={{ background: urg.bg, color: urg.color, border: `1px solid ${urg.border}` }}>
              {urg.label}
            </span>
            <h3 className="font-cinzel text-sm text-slate-100 mt-2">{t.name}</h3>
            <p className="text-[10px] text-muted-foreground uppercase italic">{t.subtitle}</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 italic px-2 border-l border-white/10">{t.coreConflict}</p>
        <button onClick={fetchAdvisory} className="w-full py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
          {advisory ? 'View Full Advisory' : '✦ Generate Deep Advisory'}
        </button>
      </div>
      <AnimatePresence>
        {open && advisory && <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="border-t border-white/5 bg-black/20 p-5"><AdvisoryViewer text={advisory} /></motion.div>}
      </AnimatePresence>
    </Card>
  );
}

export function TransitionsDisplay({ numerology }: { numerology: NumerologyData }) {
  const matrixState: MatrixState = React.useMemo(() => ({
    counts: Object.fromEntries(Object.entries(numerology.numberCounts || {}).map(([k, v]) => [Number(k), v])),
    personalYear: getPersonalYear(numerology.birthDay, numerology.birthMonth),
    birthDay: numerology.birthDay, birthMonth: numerology.birthMonth, birthYear: numerology.birthYear,
    gender: (numerology as any).gender || 'male',
  }), [numerology]);

  const transitions = React.useMemo(() => detectTransitions(matrixState), [matrixState]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-decorative text-2xl text-primary">Karmic Transitions</h2>
        <p className="text-[10px] font-cinzel uppercase tracking-[0.3em] text-slate-500">Mathematical Soul Resonances</p>
      </div>
      <div className="space-y-4">
        {transitions.length > 0 ? transitions.map(t => <TransitionCard key={t.id} t={t} matrixState={matrixState} />) : <p className="text-center py-10 text-muted-foreground text-xs font-cinzel uppercase">No Transitions Detected</p>}
      </div>
    </div>
  );
}
