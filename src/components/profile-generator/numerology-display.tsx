'use client';

/**
 * MYSTIQUE COMPASS — Premium Numerology Display
 * REPLACE: src/components/profile-generator/numerology-display.tsx
 *
 * New Sections Added:
 *  1. ThisYearBanner      — glowing gold card: Personal Year / Month / Day
 *  2. MissingNumbers      — tappable circles, 3-layer analysis
 *  3. PinnaclesAccordion  — 4 life-stage accordion, current stage highlighted
 *  4. LuckyCompassSVG     — full SVG compass rose, Kua directions as coloured nodes
 *
 * All original sections preserved and enhanced.
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoShuGrid from '@/components/lo-shu-grid';
import type { NumerologyData, PersonalYearData } from './types';
import {
  Wand2, BrainCircuit, Sparkles, Grid, Layers, Compass,
  Skull, BookUser, Star, Activity, ChevronRight,
  CalendarDays, Zap, Info, AlertTriangle, TrendingUp,
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { PersonalYearChart } from './personal-year-chart';
import { ZodiacSection } from './zodiac-section';
import LoshuArrowDetailPanel from '@/components/LoshuArrowDetailPanel';
import { FateChambers } from './fate-chambers';
import { CoreVibrations } from './core-vibrations';
import { PINNACLE_DESC, CHALLENGE_DESC } from '@/lib/cosmic-fate/pinnacles';

// ─────────────────────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function reduceNum(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  while (n > 9) n = String(n).split('').reduce((a, d) => a + +d, 0);
  return n;
}

function personalYearNow(birthDay: number, birthMonth: number): number {
  const yr = new Date().getFullYear();
  return reduceNum(
    reduceNum(birthDay) +
    reduceNum(birthMonth) +
    reduceNum(String(yr).split('').reduce((a, d) => a + +d, 0))
  );
}

function personalMonth(py: number, month: number): number {
  return reduceNum(py + month);
}

function personalDay(py: number, day: number, month: number): number {
  return reduceNum(py + day + month);
}

/** Pinnacle & Challenge calculator (from birthDay/Month/Year + lifePath) */
function calcPinnacles(lp: number, d: number, m: number, y: number) {
  const firstEnd = 36 - lp;
  const reduceOnce = (n: number) => String(n).split('').reduce((a, x) => a + +x, 0);
  const yearDigits = (yr: number) => reduceNum(String(yr).split('').reduce((a, d) => a + +d, 0));

  const p1 = reduceNum(reduceNum(d) + reduceNum(m));
  const p2 = reduceNum(reduceNum(d) + yearDigits(y));
  const p3 = reduceNum(p1 + p2);
  const p4 = reduceNum(reduceNum(m) + yearDigits(y));

  const c1 = reduceNum(Math.abs(reduceNum(d) - reduceNum(m)));
  const c2 = reduceNum(Math.abs(reduceNum(d) - yearDigits(y)));
  const c3 = reduceNum(Math.abs(c1 - c2));
  const c4 = reduceNum(Math.abs(reduceNum(m) - yearDigits(y)));

  const age = new Date().getFullYear() - y;

  return [
    { stage: 1, label: 'First Pinnacle',  ages: `0 – ${firstEnd}`,           p: p1, c: c1, active: age < firstEnd },
    { stage: 2, label: 'Second Pinnacle', ages: `${firstEnd} – ${firstEnd+9}`,p: p2, c: c2, active: age >= firstEnd && age < firstEnd+9 },
    { stage: 3, label: 'Third Pinnacle',  ages: `${firstEnd+9} – ${firstEnd+18}`, p: p3, c: c3, active: age >= firstEnd+9 && age < firstEnd+18 },
    { stage: 4, label: 'Fourth Pinnacle', ages: `${firstEnd+18}+`,            p: p4, c: c4, active: age >= firstEnd+18 },
  ];
}

const YEAR_COLOUR: Record<number, string> = {
  1:'#ef4444',2:'#c084fc',3:'#fbbf24',4:'#34d399',
  5:'#60a5fa',6:'#f472b6',7:'#818cf8',8:'#f59e0b',9:'#a78bfa',
};

const YEAR_THEME: Record<number, { title: string; keyword: string; warning?: true }> = {
  1:{ title:'New Beginnings', keyword:'Independence & Initiative' },
  2:{ title:'Cooperation',    keyword:'Partnership & Patience' },
  3:{ title:'Creative Bloom', keyword:'Expression & Joy' },
  4:{ title:'Foundation',     keyword:'Hard Work & Structure', warning:true },
  5:{ title:'Freedom',        keyword:'Change & Expansion' },
  6:{ title:'Responsibility', keyword:'Home & Heart' },
  7:{ title:'Reflection',     keyword:'Inner Wisdom & Solitude', warning:true },
  8:{ title:'Power',          keyword:'Abundance & Authority' },
  9:{ title:'Completion',     keyword:'Release & Transformation', warning:true },
};

const MISSING_ANALYSIS: Record<number, { title: string; layers: [string, string, string] }> = {
  1:{ title:'Self-Reliance', layers:[
    'Over-dependency on external approval — you seek validation before acting.',
    'Leadership is a skill, not a trait you were born lacking. This life teaches you to author yourself.',
    'Daily practice: Make one significant decision entirely without seeking consensus.',
  ]},
  2:{ title:'Emotional Depth', layers:[
    'Emotional detachment or hypersensitivity used as armour against being truly known.',
    'Partnership is your greatest classroom — vulnerability is not weakness here, it\'s currency.',
    'Daily practice: Sit with one uncomfortable feeling for 60 seconds before reacting.',
  ]},
  3:{ title:'Creative Voice', layers:[
    'Creative self-expression was suppressed early — possibly by perfectionism or criticism.',
    'Joy and play feel indulgent, yet they are the exact frequency your soul was encoded with.',
    'Daily practice: Create something daily — writing, doodle, hum — purely for yourself, unseen.',
  ]},
  4:{ title:'Discipline', layers:[
    'Structures feel like traps. Routine triggers existential dread or resistance.',
    'You are not lazy — you are ancestrally wired against constraint that felt like oppression.',
    'Daily practice: Honour one micro-routine for 21 days without negotiating exceptions.',
  ]},
  5:{ title:'Freedom', layers:[
    'You either cling to rigid routine or blow up your life seeking stimulation. No middle ground exists yet.',
    'The freedom you seek is internal — a state of radical adaptability, not external chaos.',
    'Daily practice: Deliberately change one comfortable habit each week.',
  ]},
  6:{ title:'Nurturing', layers:[
    'Giving and receiving care triggers a complex tangle of obligation and resentment.',
    'You are learning the difference between sacred service and self-erasure.',
    'Daily practice: Cook or prepare something for someone — the ritual matters more than the gesture.',
  ]},
  7:{ title:'Inner Wisdom', layers:[
    'Over-rationalisation blocks intuition. You dismiss the non-logical before it can inform you.',
    'Your spiritual bandwidth is vast but sealed — trauma or conditioning closed the channel.',
    'Daily practice: 5 minutes of unstructured silence every morning before any screen.',
  ]},
  8:{ title:'Abundance', layers:[
    'Money and power carry unexamined ancestral fear — either chased desperately or sabotaged.',
    'Financial karma is highly active. Your relationship with resources mirrors your self-worth.',
    'Daily practice: Track every transaction this week without judgement. Awareness precedes shift.',
  ]},
  9:{ title:'Completion', layers:[
    'You struggle to close chapters — people, roles, identities are clung to past their expiry.',
    'Old wounds orbit without resolution because forgiveness has been confused with condoning.',
    'Daily practice: Write a completion letter to one unresolved chapter. Sending is optional.',
  ]},
};

const KUA_DATA_COMPASS: Record<number, {
  name: string; best: string[]; avoid: string[]; element: string; colour: string;
}> = {
  1:{ name:'Water', best:['SE','E','S','N'],    avoid:['W','NW','NE','SW'], element:'Water', colour:'#60a5fa' },
  2:{ name:'Earth', best:['NE','W','NW','SW'],  avoid:['E','SE','S','N'],   element:'Earth', colour:'#fbbf24' },
  3:{ name:'Thunder',best:['S','N','SE','E'],   avoid:['SW','NE','W','NW'], element:'Wood',  colour:'#34d399' },
  4:{ name:'Wind',  best:['N','S','E','SE'],    avoid:['NE','NW','SW','W'], element:'Wood',  colour:'#6ee7b7' },
  5:{ name:'Earth', best:['NE','W','NW','SW'],  avoid:['E','SE','S','N'],   element:'Earth', colour:'#f59e0b' },
  6:{ name:'Heaven',best:['W','NE','SW','NW'],  avoid:['E','SE','S','N'],   element:'Metal', colour:'#c0c0c0' },
  7:{ name:'Lake',  best:['NW','SW','NE','W'],  avoid:['N','SE','S','E'],   element:'Metal', colour:'#a78bfa' },
  8:{ name:'Mountain',best:['SW','NW','W','NE'],avoid:['SE','S','N','E'],   element:'Earth', colour:'#fb923c' },
  9:{ name:'Fire',  best:['E','SE','N','S'],    avoid:['W','NW','SW','NE'], element:'Fire',  colour:'#ef4444' },
};

// ─────────────────────────────────────────────────────────────────────────────
//  THIS YEAR BANNER
// ─────────────────────────────────────────────────────────────────────────────

function ThisYearBanner({ birthDay, birthMonth }: { birthDay: number; birthMonth: number }) {
  const today = new Date();
  const py  = personalYearNow(birthDay, birthMonth);
  const pm  = personalMonth(py, today.getMonth() + 1);
  const pd  = personalDay(py, today.getDate(), today.getMonth() + 1);
  const col = YEAR_COLOUR[py] || '#d4af37';
  const theme = YEAR_THEME[py];

  const dateStr = today.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="tyb-root"
      style={{ '--tyb-col': col } as React.CSSProperties}
    >
      <style>{`
        .tyb-root {
          position: relative;
          overflow: hidden;
          border-radius: 1.1rem;
          border: 1px solid color-mix(in srgb, var(--tyb-col) 40%, transparent);
          background: linear-gradient(145deg,
            rgba(20,5,50,0.95) 0%,
            color-mix(in srgb, var(--tyb-col) 12%, rgba(10,2,30,0.97)) 100%
          );
          padding: 1rem 1.25rem 1rem;
          margin-bottom: 1.25rem;
          box-shadow:
            0 0 0 1px color-mix(in srgb, var(--tyb-col) 15%, transparent),
            0 8px 40px color-mix(in srgb, var(--tyb-col) 18%, transparent),
            inset 0 1px 0 color-mix(in srgb, var(--tyb-col) 20%, transparent);
        }
        .tyb-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%,
            color-mix(in srgb, var(--tyb-col) 14%, transparent) 0%, transparent 70%);
          pointer-events: none;
        }
        .tyb-top-line {
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, var(--tyb-col), transparent);
          border-radius: 99px;
        }
        .tyb-date {
          font-family: 'Cinzel', serif;
          font-size: 0.55rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(212,175,55,0.5);
          margin-bottom: 0.6rem;
        }
        .tyb-numbers {
          display: flex;
          align-items: stretch;
          gap: 0;
          margin-bottom: 0.75rem;
        }
        .tyb-num-block {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          padding: 0.5rem 0.25rem;
        }
        .tyb-num-block + .tyb-num-block {
          border-left: 1px solid rgba(255,255,255,0.06);
        }
        .tyb-num-label {
          font-family: 'Cinzel', serif;
          font-size: 0.5rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(200,180,240,0.45);
        }
        .tyb-num-val {
          font-family: 'Cinzel Decorative', serif;
          font-size: 2.2rem;
          font-weight: 700;
          line-height: 1;
          color: var(--tyb-col);
          text-shadow: 0 0 28px color-mix(in srgb, var(--tyb-col) 60%, transparent);
        }
        .tyb-theme-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          flex-wrap: wrap;
        }
        .tyb-theme-badge {
          background: color-mix(in srgb, var(--tyb-col) 18%, rgba(0,0,0,0));
          border: 1px solid color-mix(in srgb, var(--tyb-col) 35%, transparent);
          border-radius: 99px;
          padding: 0.25rem 0.7rem;
          font-family: 'Cinzel', serif;
          font-size: 0.58rem;
          font-weight: 700;
          color: var(--tyb-col);
          letter-spacing: 0.1em;
        }
        .tyb-keyword {
          font-size: 0.7rem;
          color: rgba(210,195,240,0.65);
          font-style: italic;
          font-family: var(--font-body, serif);
        }
        .tyb-warning {
          margin-top: 0.6rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 0.5rem;
          padding: 0.4rem 0.75rem;
          font-size: 0.7rem;
          color: #fca5a5;
          font-family: var(--font-body, serif);
        }
      `}</style>

      <div className="tyb-top-line" />
      <div className="tyb-date">{dateStr}</div>

      <div className="tyb-numbers">
        <div className="tyb-num-block">
          <span className="tyb-num-label">Personal Year</span>
          <span className="tyb-num-val">{py}</span>
        </div>
        <div className="tyb-num-block">
          <span className="tyb-num-label">Personal Month</span>
          <span className="tyb-num-val">{pm}</span>
        </div>
        <div className="tyb-num-block">
          <span className="tyb-num-label">Personal Day</span>
          <span className="tyb-num-val">{pd}</span>
        </div>
      </div>

      <div className="tyb-theme-row">
        <span className="tyb-theme-badge">Year {py} · {theme?.title}</span>
        <span className="tyb-keyword">{theme?.keyword}</span>
      </div>

      {theme?.warning && (
        <div className="tyb-warning">
          <AlertTriangle className="h-3.5 w-3.5 text-red-400 flex-shrink-0" />
          <span>Challenging season ahead — heightened awareness recommended this cycle.</span>
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MISSING NUMBERS
// ─────────────────────────────────────────────────────────────────────────────

function getMissingNums(numberCounts: { [key: string]: number }): number[] {
  return [1,2,3,4,5,6,7,8,9].filter(n => !numberCounts[String(n)] || numberCounts[String(n)] === 0);
}

function MissingNumbers({ numberCounts }: { numberCounts: { [key: string]: number } }) {
  const missing = getMissingNums(numberCounts);
  const [expanded, setExpanded] = React.useState<number | null>(null);
  const [activeLayer, setActiveLayer] = React.useState<number>(0);

  if (missing.length === 0) {
    return (
      <div className="mn-empty">
        <style>{`.mn-empty{text-align:center;padding:1.5rem;color:rgba(212,175,55,0.5);font-family:'Cinzel',serif;font-size:0.72rem;letter-spacing:0.15em;}`}</style>
        ✦ Complete grid — no missing numbers detected
      </div>
    );
  }

  return (
    <>
      <style>{`
        .mn-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }
        .mn-card {
          cursor: pointer;
          border-radius: 1rem;
          border: 1px solid rgba(124,58,237,0.2);
          background: rgba(15,5,40,0.6);
          transition: border-color 0.3s, background 0.3s, transform 0.3s;
          overflow: hidden;
        }
        .mn-card:hover { border-color: rgba(212,175,55,0.35); background: rgba(20,8,55,0.8); }
        .mn-card.mn-open {
          grid-column: 1 / -1;
          border-color: rgba(212,175,55,0.45);
          background: rgba(20,5,50,0.9);
          transform: none;
        }
        .mn-card-inner { padding: 0.8rem; display: flex; flex-direction: column; align-items: center; gap: 0.4rem; }
        .mn-circle-wrap {
          position: relative;
          width: 52px; height: 52px;
        }
        .mn-circle-svg { position: absolute; inset: 0; }
        .mn-num {
          position: absolute;
          inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel Decorative', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: #d4af37;
        }
        .mn-title {
          font-family: 'Cinzel', serif;
          font-size: 0.55rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(200,180,240,0.55);
          text-align: center;
        }
        .mn-layers { padding: 0 1rem 1rem; }
        .mn-layer-tabs {
          display: flex;
          gap: 0.4rem;
          margin-bottom: 0.75rem;
        }
        .mn-layer-tab {
          flex: 1;
          padding: 0.3rem 0;
          border-radius: 0.4rem;
          border: 1px solid transparent;
          background: rgba(255,255,255,0.04);
          font-family: 'Cinzel', serif;
          font-size: 0.52rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(200,180,240,0.4);
          cursor: pointer;
          transition: all 0.2s;
        }
        .mn-layer-tab.active {
          background: rgba(212,175,55,0.12);
          border-color: rgba(212,175,55,0.3);
          color: #d4af37;
        }
        .mn-layer-content {
          font-size: 0.8rem;
          line-height: 1.65;
          color: rgba(210,195,240,0.75);
          font-family: var(--font-body, serif);
          padding: 0.6rem 0;
          border-left: 2px solid rgba(212,175,55,0.3);
          padding-left: 0.75rem;
        }
      `}</style>

      <div className="mn-grid">
        {missing.map(n => {
          const info = MISSING_ANALYSIS[n];
          const isOpen = expanded === n;

          return (
            <motion.div
              key={n}
              layout
              className={`mn-card ${isOpen ? 'mn-open' : ''}`}
              onClick={() => { setExpanded(isOpen ? null : n); setActiveLayer(0); }}
            >
              <div className="mn-card-inner">
                <div className="mn-circle-wrap">
                  <svg viewBox="0 0 52 52" className="mn-circle-svg">
                    <defs>
                      <linearGradient id={`mn-grad-${n}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#d4af37" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                    {/* Background circle */}
                    <circle cx="26" cy="26" r="24" fill="rgba(15,5,40,0.8)"
                      stroke={`url(#mn-grad-${n})`} strokeWidth="1.5" strokeDasharray="4 3" />
                    {/* Pulse ring */}
                    {isOpen && (
                      <circle cx="26" cy="26" r="24" fill="none"
                        stroke="#d4af37" strokeWidth="1.5" strokeOpacity="0.6">
                        <animate attributeName="r" values="22;26;22" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </svg>
                  <div className="mn-num">{n}</div>
                </div>
                <div className="mn-title">{info?.title}</div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className="mn-layers"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.23,1,0.32,1] }}
                  >
                    <div className="mn-layer-tabs">
                      {['Shadow', 'Soul Lesson', 'Practice'].map((l, i) => (
                        <button key={i}
                          className={`mn-layer-tab ${activeLayer === i ? 'active' : ''}`}
                          onClick={e => { e.stopPropagation(); setActiveLayer(i); }}
                        >{l}</button>
                      ))}
                    </div>
                    <div className="mn-layer-content">
                      {info?.layers[activeLayer]}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  PINNACLES & CHALLENGES
// ─────────────────────────────────────────────────────────────────────────────

function PinnaclesAccordion({
  destinyNum, birthDay, birthMonth, birthYear,
}: { destinyNum: number; birthDay: number; birthMonth: number; birthYear: number }) {
  const lifePath = destinyNum;
  const stages = calcPinnacles(lifePath, birthDay, birthMonth, birthYear);
  const [open, setOpen] = React.useState<number | null>(
    stages.findIndex(s => s.active) + 1 || null
  );

  return (
    <>
      <style>{`
        .pin-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .pin-row {
          border-radius: 0.9rem;
          border: 1px solid rgba(124,58,237,0.18);
          background: rgba(12,4,32,0.7);
          overflow: hidden;
          transition: border-color 0.3s;
        }
        .pin-row.pin-active {
          border-color: rgba(212,175,55,0.45);
          background: rgba(20,5,50,0.85);
        }
        .pin-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 1rem;
          cursor: pointer;
          user-select: none;
          gap: 0.5rem;
        }
        .pin-left { display: flex; flex-direction: column; gap: 0.2rem; flex: 1; }
        .pin-you-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-family: 'Cinzel', serif;
          font-size: 0.45rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #34d399;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.3);
          border-radius: 99px;
          padding: 0.15rem 0.5rem;
          width: fit-content;
          margin-bottom: 0.1rem;
        }
        .pin-label {
          font-family: 'Cinzel', serif;
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(210,195,240,0.85);
          letter-spacing: 0.05em;
        }
        .pin-ages {
          font-family: 'Cinzel', serif;
          font-size: 0.5rem;
          letter-spacing: 0.12em;
          color: rgba(212,175,55,0.45);
        }
        .pin-right { display: flex; align-items: center; gap: 0.5rem; }
        .pin-badge {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cinzel Decorative', serif;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .pin-badge-gold {
          background: rgba(212,175,55,0.15);
          border: 1px solid rgba(212,175,55,0.4);
          color: #d4af37;
        }
        .pin-badge-red {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #ef4444;
        }
        .pin-chevron {
          color: rgba(212,175,55,0.4);
          font-size: 0.7rem;
          transition: transform 0.25s;
        }
        .pin-chevron.open { transform: rotate(180deg); }
        .pin-body { padding: 0 1rem 1rem; }
        .pin-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .pin-col {
          border-radius: 0.6rem;
          padding: 0.75rem;
          font-size: 0.75rem;
          line-height: 1.65;
          color: rgba(210,195,240,0.7);
          font-family: var(--font-body, serif);
        }
        .pin-col-gold {
          background: rgba(212,175,55,0.06);
          border-left: 2px solid rgba(212,175,55,0.4);
        }
        .pin-col-red {
          background: rgba(239,68,68,0.06);
          border-left: 2px solid rgba(239,68,68,0.35);
        }
        .pin-col-title {
          font-family: 'Cinzel', serif;
          font-size: 0.55rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 0.4rem;
        }
        .pin-col-gold .pin-col-title { color: rgba(212,175,55,0.7); }
        .pin-col-red .pin-col-title { color: rgba(239,68,68,0.7); }
        @media (max-width: 400px) { .pin-cols { grid-template-columns: 1fr; } }
      `}</style>

      <div className="pin-list">
        {stages.map(s => (
          <div key={s.stage} className={`pin-row ${s.active ? 'pin-active' : ''}`}>
            <div className="pin-header" onClick={() => setOpen(open === s.stage ? null : s.stage)}>
              <div className="pin-left">
                {s.active && (
                  <span className="pin-you-badge">
                    <TrendingUp size={8} /> You Are Here
                  </span>
                )}
                <span className="pin-label">{s.label}</span>
                <span className="pin-ages">Ages {s.ages}</span>
              </div>
              <div className="pin-right">
                <div className="pin-badge pin-badge-gold">{s.p}</div>
                <div className="pin-badge pin-badge-red">{s.c}</div>
                <span className={`pin-chevron ${open === s.stage ? 'open' : ''}`}>▾</span>
              </div>
            </div>

            <AnimatePresence>
              {open === s.stage && (
                <motion.div
                  className="pin-body"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: [0.23,1,0.32,1] }}
                >
                  <div className="pin-cols">
                    <div className="pin-col pin-col-gold">
                      <div className="pin-col-title">✦ Pinnacle {s.p} — Opportunity</div>
                      {(PINNACLE_DESC[s.p] || '').slice(0, 220)}…
                    </div>
                    <div className="pin-col pin-col-red">
                      <div className="pin-col-title">⚡ Challenge {s.c} — Lesson</div>
                      {(CHALLENGE_DESC[s.c] || '').slice(0, 220)}…
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  LUCKY COMPASS SVG
// ─────────────────────────────────────────────────────────────────────────────

function LuckyCompassSVG({ kuaNum, kuaAttributes }: {
  kuaNum: number;
  kuaAttributes: NumerologyData['kuaAttributes'];
}) {
  const kua = KUA_DATA_COMPASS[kuaNum] || KUA_DATA_COMPASS[1];
  const dirs8 = ['N','NE','E','SE','S','SW','W','NW'];
  const CX = 130, CY = 130, R_OUTER = 110, R_NODES = 82;

  function dirPos(dir: string, r: number) {
    const idx = dirs8.indexOf(dir);
    const angle = (idx * 45 - 90) * (Math.PI / 180);
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  }

  return (
    <>
      <style>{`
        .lc-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .lc-svg { width: 100%; max-width: 280px; }
        .lc-legend {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.4rem 1rem;
          width: 100%;
        }
        .lc-legend-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.68rem;
          font-family: var(--font-body, serif);
          color: rgba(210,195,240,0.65);
        }
        .lc-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .lc-dir { font-weight: 700; margin-left: 0.15rem; }
        .lc-dir-type {
          font-size: 0.55rem;
          font-family: 'Cinzel', serif;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(212,175,55,0.45);
          margin-left: auto;
        }
        .lc-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 1rem;
          border-radius: 0.75rem;
          background: rgba(212,175,55,0.06);
          border: 1px solid rgba(212,175,55,0.15);
          width: 100%;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .lc-chip {
          font-family: 'Cinzel', serif;
          font-size: 0.55rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(212,175,55,0.65);
        }
        .lc-chip strong { color: #d4af37; }
      `}</style>

      <div className="lc-wrap">
        <svg viewBox="0 0 260 260" className="lc-svg">
          <defs>
            <radialGradient id="lc-bg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1a0a3a" />
              <stop offset="100%" stopColor="#080318" />
            </radialGradient>
            <filter id="lc-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="lc-node-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Background */}
          <circle cx={CX} cy={CY} r={R_OUTER + 8} fill="url(#lc-bg)"
            stroke="rgba(124,58,237,0.18)" strokeWidth="1" />

          {/* Degree tick marks */}
          {Array.from({ length: 72 }, (_, i) => {
            const a = (i * 5 - 90) * Math.PI / 180;
            const big = i % 9 === 0;
            const r1 = R_OUTER - (big ? 12 : 5);
            const r2 = R_OUTER;
            return (
              <line key={i}
                x1={CX + r1 * Math.cos(a)} y1={CY + r1 * Math.sin(a)}
                x2={CX + r2 * Math.cos(a)} y2={CY + r2 * Math.sin(a)}
                stroke={big ? 'rgba(212,175,55,0.35)' : 'rgba(124,58,237,0.2)'}
                strokeWidth={big ? 1.2 : 0.6} />
            );
          })}

          {/* Outer ring */}
          <circle cx={CX} cy={CY} r={R_OUTER} fill="none"
            stroke="rgba(212,175,55,0.22)" strokeWidth="1" />

          {/* Inner decorative circles */}
          <circle cx={CX} cy={CY} r={60} fill="none"
            stroke="rgba(124,58,237,0.15)" strokeWidth="0.8" strokeDasharray="3 4" />
          <circle cx={CX} cy={CY} r={35} fill="none"
            stroke="rgba(212,175,55,0.1)" strokeWidth="0.8" />

          {/* Cross lines */}
          {[0, 45, 90, 135].map(deg => {
            const a = deg * Math.PI / 180;
            return (
              <line key={deg}
                x1={CX - R_OUTER * Math.cos(a)} y1={CY - R_OUTER * Math.sin(a)}
                x2={CX + R_OUTER * Math.cos(a)} y2={CY + R_OUTER * Math.sin(a)}
                stroke="rgba(124,58,237,0.1)" strokeWidth="0.6" />
            );
          })}

          {/* Direction nodes */}
          {dirs8.map(dir => {
            const pos = dirPos(dir, R_NODES);
            const isBest = kua.best.includes(dir);
            const isAvoid = kua.avoid.includes(dir);
            const nodeR = isBest ? 12 : isAvoid ? 9 : 7;
            const nodeCol = isBest ? kua.colour : isAvoid ? '#ef4444' : 'rgba(255,255,255,0.2)';
            return (
              <g key={dir} filter={isBest ? 'url(#lc-node-glow)' : undefined}>
                <circle cx={pos.x} cy={pos.y} r={nodeR}
                  fill={`${nodeCol}22`}
                  stroke={nodeCol}
                  strokeWidth={isBest ? 2 : 1} />
                {isBest && (
                  <circle cx={pos.x} cy={pos.y} r={nodeR * 1.6}
                    fill="none" stroke={nodeCol} strokeWidth="0.8" strokeOpacity="0.3">
                    <animate attributeName="r" values={`${nodeR};${nodeR * 2.2};${nodeR}`}
                      dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" values="0.3;0;0.3"
                      dur="2.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <text x={pos.x} y={pos.y + 1}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={isBest ? 7 : 6}
                  fill={isBest ? nodeCol : isAvoid ? '#ef4444' : 'rgba(200,180,240,0.4)'}
                  fontFamily="'Cinzel', serif"
                  fontWeight={isBest ? 'bold' : 'normal'}
                >{dir}</text>
              </g>
            );
          })}

          {/* Centre compass rose */}
          <g filter="url(#lc-glow)">
            {/* N arrow */}
            <polygon
              points={`${CX},${CY - 32} ${CX - 7},${CY} ${CX},${CY - 10} ${CX + 7},${CY}`}
              fill="#d4af37" fillOpacity="0.9" />
            {/* S arrow */}
            <polygon
              points={`${CX},${CY + 32} ${CX - 7},${CY} ${CX},${CY + 10} ${CX + 7},${CY}`}
              fill="#7c3aed" fillOpacity="0.7" />
          </g>
          <circle cx={CX} cy={CY} r={7} fill="#1a0a3a"
            stroke="rgba(212,175,55,0.6)" strokeWidth="1.5" />
          <circle cx={CX} cy={CY} r={3} fill="#d4af37" />

          {/* Kua number centre-bottom */}
          <text x={CX} y={CY + 48} textAnchor="middle"
            fontFamily="'Cinzel Decorative', serif" fontSize="18" fontWeight="700"
            fill="#d4af37" fillOpacity="0.8" filter="url(#lc-glow)">
            {kuaNum}
          </text>
          <text x={CX} y={CY + 60} textAnchor="middle"
            fontFamily="'Cinzel', serif" fontSize="5.5" letterSpacing="3"
            fill="rgba(212,175,55,0.4)" textTransform="uppercase">
            KUA NUMBER
          </text>
        </svg>

        {/* Best / Avoid legend */}
        <div className="lc-legend">
          {kua.best.slice(0, 4).map(d => (
            <div key={d} className="lc-legend-row">
              <div className="lc-dot" style={{ background: kua.colour, boxShadow: `0 0 6px ${kua.colour}` }} />
              <span className="lc-dir">{d}</span>
              <span className="lc-dir-type">Auspicious</span>
            </div>
          ))}
          {kua.avoid.slice(0, 4).map(d => (
            <div key={d} className="lc-legend-row">
              <div className="lc-dot" style={{ background: '#ef4444' }} />
              <span className="lc-dir">{d}</span>
              <span className="lc-dir-type">Avoid</span>
            </div>
          ))}
        </div>

        {/* Metadata chips */}
        <div className="lc-meta">
          <span className="lc-chip">Trigram: <strong>{kua.name}</strong></span>
          <span className="lc-chip" style={{ color: 'rgba(212,175,55,0.3)' }}>·</span>
          <span className="lc-chip">Element: <strong>{kua.element}</strong></span>
          {kuaAttributes?.lucky_colours && (
            <>
              <span className="lc-chip" style={{ color: 'rgba(212,175,55,0.3)' }}>·</span>
              <span className="lc-chip">Colors: <strong>{kuaAttributes.lucky_colours.join(', ')}</strong></span>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SECTION HEADER
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      <h3 className="font-cinzel font-semibold text-[0.7rem] text-primary flex items-center gap-2 uppercase tracking-[0.28em]">
        {icon} {title}
      </h3>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ORIGINAL SUB-COMPONENTS (InfoCard, ArrowsDisplay, KuaDisplay — preserved)
// ─────────────────────────────────────────────────────────────────────────────

const InfoCard = ({ title, value, icon, onClick }: { title: string; value: string | number; icon: React.ReactNode; onClick?: () => void }) => (
  <div
    className={`glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center aspect-square ${onClick ? 'transition-all duration-300 hover:bg-purple-500/20 cursor-pointer' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center gap-2 text-purple-200/80">
      {icon}
      <p className="text-[0.6rem] font-cinzel uppercase tracking-widest">{title}</p>
    </div>
    <p className="text-5xl font-bold text-yellow-300 mt-2 font-decorative shadow-yellow-500/20 drop-shadow-lg">{value || ''}</p>
  </div>
);

const ArrowsDisplay = React.forwardRef<HTMLDivElement, { arrowsOfStrength: any[]; arrowsOfWeakness: any[]; openItems: string[]; onToggle: (v: string[]) => void; birthDate: string; numberCounts: Record<number,number> }>(
  ({ arrowsOfStrength, arrowsOfWeakness, openItems, onToggle, birthDate, numberCounts }, ref) => {
    const categories = Array.from(new Set([
      ...arrowsOfStrength.map(a => a.category),
      ...arrowsOfWeakness.map(a => a.category),
    ])).filter(Boolean);

    const renderArrowItem = (arrow: any) => {
      const isShadow = arrow.type === 'shadow' || arrow.type === 'weakness';
      return (
        <AccordionItem value={arrow.name} key={arrow.name} className="glass-card px-4 mb-1 border-l-[3px] border-l-[#c8a84b]/40">
          <AccordionTrigger>
            <span className={`text-left font-cinzel text-[0.7rem] uppercase tracking-wider flex items-center gap-2 ${isShadow ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isShadow ? <ChevronRight className="h-3 w-3 rotate-90" /> : <ChevronRight className="h-3 w-3" />}
              {arrow.name} ({arrow.numbers.join('-')})
            </span>
          </AccordionTrigger>
          <AccordionContent className="font-body text-base leading-relaxed">
            <LoshuArrowDetailPanel arrowId={arrow.id} existingMeaning={arrow.description} birthDate={birthDate} externalCounts={numberCounts as any} />
          </AccordionContent>
        </AccordionItem>
      );
    };

    return (
      <div className="glass-card p-4 space-y-6" ref={ref}>
        <SectionHeader icon={<Activity className="h-4 w-4" />} title="Arrows of Power" />
        {categories.map(cat => (
          <div key={cat} className="space-y-2">
            <h4 className="font-cinzel text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em] mb-2 px-2 border-l border-primary/30">{cat}</h4>
            <Accordion type="multiple" className="w-full" value={openItems} onValueChange={onToggle}>
              {[...arrowsOfStrength, ...arrowsOfWeakness]
                .filter(a => (a.category || (a.type === 'shadow' ? 'Deficiency' : 'Primary Plane')) === cat)
                .map(renderArrowItem)}
            </Accordion>
          </div>
        ))}
      </div>
    );
  }
);
ArrowsDisplay.displayName = 'ArrowsDisplay';

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export function NumerologyDisplay({ numerology }: { numerology: NumerologyData }) {
  const {
    birthDay, birthMonth, birthYear,
    psycheNum, destinyNum, kuaNum,
    loShuGrid, arrowsOfStrength, arrowsOfWeakness, kuaAttributes,
    compoundNum, compoundMeaning, reducedCompoundNum, reducedCompoundMeaning,
    karmicFateNum, karmicFateMeaning, numberCounts, repeatedNumberMeanings,
    psychicMeaning, specialTraitMeaning, destinyMeaning,
  } = numerology;

  const [openSections, setOpenSections] = React.useState<string[]>([]);
  const [selectedPersonalYear, setSelectedPersonalYear] = React.useState<PersonalYearData | null>(null);
  const [personalYearAccordionValue, setPersonalYearAccordionValue] = React.useState<string>('');
  const [activeCoreLayer, setActiveCoreLayer] = React.useState<string | null>(null);
  const [activeFateLayer, setActiveFateLayer] = React.useState<number | null>(null);
  const [openPYLayer, setOpenPYLayer] = React.useState<number | null>(1);

  const coreVibrationsRef = React.useRef<HTMLDivElement>(null);
  const fateChambersRef = React.useRef<HTMLDivElement>(null);
  const arrowsRef = React.useRef<HTMLDivElement>(null);
  const kuaRef = React.useRef<HTMLDivElement>(null);
  const pyDetailRef = React.useRef<HTMLDivElement>(null);

  const birthDate = `${birthDay}/${birthMonth}/${birthYear}`;

  const handleYearSelect = (data: PersonalYearData | null) => {
    if (data?.year !== selectedPersonalYear?.year) {
      setSelectedPersonalYear(data);
      if (data) {
        setPersonalYearAccordionValue('personal-year-detail');
        setOpenPYLayer(1);
        setTimeout(() => pyDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
      } else {
        setPersonalYearAccordionValue('');
      }
    }
  };

  const handleCoreNavigation = (layerId: string) => {
    setActiveCoreLayer(layerId);
    setTimeout(() => coreVibrationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
  };

  const handleFateNavigation = (layerNum: number) => {
    setActiveFateLayer(layerNum);
    setTimeout(() => fateChambersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
  };

  return (
    <div className="space-y-6">

      {/* ── 1. THIS YEAR BANNER ── */}
      <ThisYearBanner birthDay={birthDay} birthMonth={birthMonth} />

      {/* ── 2. CORE NUMBERS ── */}
      <div className="glass-card p-4">
        <SectionHeader icon={<Star className="h-4 w-4" />} title="Core Vibrations" />
        <div className="grid grid-cols-3 gap-3">
          <InfoCard title="Psyche" value={psycheNum} icon={<BrainCircuit className="h-3.5 w-3.5" />}
            onClick={() => handleCoreNavigation('psyche')} />
          <InfoCard title="Destiny" value={destinyNum} icon={<Sparkles className="h-3.5 w-3.5" />}
            onClick={() => handleCoreNavigation('destiny')} />
          <InfoCard title="Kua" value={kuaNum} icon={<Compass className="h-3.5 w-3.5" />}
            onClick={() => kuaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })} />
        </div>
      </div>

      {/* ── 3. CORE VIBRATIONS DETAIL ── */}
      <CoreVibrations
        ref={coreVibrationsRef}
        psycheNum={psycheNum}
        destinyNum={destinyNum}
        psychicMeaning={psychicMeaning}
        destinyMeaning={destinyMeaning}
        compoundNum={compoundNum}
        compoundMeaning={compoundMeaning}
        reducedCompoundNum={reducedCompoundNum}
        reducedCompoundMeaning={reducedCompoundMeaning}
        karmicFateNum={karmicFateNum}
        karmicFateMeaning={karmicFateMeaning}
        specialTraitMeaning={specialTraitMeaning}
        activeLayer={activeCoreLayer}
        onLayerChange={setActiveCoreLayer}
      />

      {/* ── 4. LO SHU GRID ── */}
      <div className="glass-card p-4">
        <SectionHeader icon={<Grid className="h-4 w-4" />} title="Lo Shu Grid" />
        <LoShuGrid gridData={loShuGrid} numberCounts={numberCounts} repeatedNumberMeanings={repeatedNumberMeanings} title="Numerology Matrix" birthDate={birthDate} />
      </div>

      {/* ── 5. MISSING NUMBERS ── */}
      <div className="glass-card p-4">
        <SectionHeader icon={<Zap className="h-4 w-4" />} title="Missing Numbers" />
        <MissingNumbers numberCounts={numberCounts} />
      </div>

      {/* ── 6. PINNACLES & CHALLENGES ── */}
      <div className="glass-card p-4">
        <SectionHeader icon={<Layers className="h-4 w-4" />} title="Pinnacles & Challenges" />
        <PinnaclesAccordion
          destinyNum={destinyNum}
          birthDay={birthDay}
          birthMonth={birthMonth}
          birthYear={birthYear}
        />
      </div>

      {/* ── 7. FATE CHAMBERS ── */}
      <FateChambers
        ref={fateChambersRef}
        compoundNum={compoundNum}
        compoundMeaning={compoundMeaning}
        reducedCompoundNum={reducedCompoundNum}
        reducedCompoundMeaning={reducedCompoundMeaning}
        karmicFateNum={karmicFateNum}
        karmicFateMeaning={karmicFateMeaning}
        activeLayer={activeFateLayer}
        onLayerChange={setActiveFateLayer}
      />

      {/* ── 8. PERSONAL YEAR CHART ── */}
      <div className="glass-card p-4">
        <SectionHeader icon={<CalendarDays className="h-4 w-4" />} title="Personal Year Wave" />
        <PersonalYearChart
          birthDay={birthDay}
          birthMonth={birthMonth}
          birthYear={birthYear}
          onYearSelect={handleYearSelect}
        />
      </div>

      {/* Personal Year Detail accordion */}
      {selectedPersonalYear && (
        <Accordion type="single" collapsible
          value={personalYearAccordionValue}
          onValueChange={setPersonalYearAccordionValue}
          ref={pyDetailRef}
        >
          <AccordionItem value="personal-year-detail" className="border-none">
            <div className="glass-card p-4">
              <AccordionTrigger className="font-cinzel text-sm text-primary uppercase tracking-wider">
                Year {selectedPersonalYear.year} · Personal Year {selectedPersonalYear.pyn}
              </AccordionTrigger>
              <AccordionContent>
                <AccordionContentWithPlayer text={selectedPersonalYear.meaning} />
              </AccordionContent>
            </div>
          </AccordionItem>
        </Accordion>
      )}

      {/* ── 9. ZODIAC SECTION ── */}
      <ZodiacSection
        birthDay={birthDay}
        birthMonth={birthMonth}
        birthYear={birthYear}
      />

      {/* ── 10. ARROWS OF POWER ── */}
      <ArrowsDisplay
        ref={arrowsRef}
        arrowsOfStrength={arrowsOfStrength}
        arrowsOfWeakness={arrowsOfWeakness}
        openItems={openSections}
        onToggle={setOpenSections}
        birthDate={birthDate}
        numberCounts={numberCounts as Record<number, number>}
      />

      {/* ── 11. LUCKY COMPASS (replaces old plain Kua text list) ── */}
      <div className="glass-card p-4" ref={kuaRef}>
        <SectionHeader icon={<Compass className="h-4 w-4" />} title="Lucky Compass" />
        <LuckyCompassSVG kuaNum={kuaNum} kuaAttributes={kuaAttributes} />
      </div>

    </div>
  );
}
