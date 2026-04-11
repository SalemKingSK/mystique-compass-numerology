'use client';

/**
 * MYSTIQUE COMPASS — Premium Results Display
 *
 * Rules-based synthesis engine replaces external AI.
 * Deterministic character profiling across all systems.
 */

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { AstroInsightOutput, NumerologyData } from './types';
import { AstroDisplay } from './astro-display';
import { NumerologyDisplay } from './numerology-display';
import { CosmicFateMap } from './cosmic-fate-map';
import {
  ArrowLeft, History, Heart, Home, Users, Briefcase,
  AlertTriangle, Brain, Loader2, ChevronDown, BookUser
} from 'lucide-react';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import InstallButton from '../InstallButton';
import { ZOO } from '@/lib/cosmic-fate/zoo';
import { buildCosmicProfile } from '@/lib/cosmic-synthesizer';

// ── helpers ───────────────────────────────────────────────────────────────────
function reduceNum(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n;
  let val = Math.abs(n);
  while (val > 9) val = String(val).split('').reduce((a, d) => a + +d, 0);
  return val || 9;
}

function getPersonalYear(d: number, m: number): number {
  const yr = new Date().getFullYear();
  return reduceNum(
    reduceNum(d) + reduceNum(m) +
    reduceNum(String(yr).split('').reduce((a, c) => a + +c, 0))
  );
}

function detectWarning(numerology: NumerologyData): string | null {
  const py = getPersonalYear(numerology.birthDay, numerology.birthMonth);
  if (py === 4) return 'Personal Year 4 detected — the Consolidation cycle often brings restriction and forced slowing. Prioritise foundations over ambition this year.';
  if (py === 7) return 'Personal Year 7 detected — an inward, sacrificial year. Avoid major financial or relational decisions. The cosmos asks for retreat, not expansion.';
  if (py === 9) return 'Personal Year 9 detected — the Great Completion. Endings are imminent. Avoid clinging to what is already departing. Radical release unlocks Year 1.';
  const missing8 = !numerology.numberCounts?.[String(8)] || numerology.numberCounts[String(8)] === 0;
  if (missing8 && (py === 2 || py === 4)) return 'Financial karma is active — Missing 8 combined with your current Personal Year creates a vulnerable window. Caution with investments.';
  return null;
}

// ── Warning Banner ────────────────────────────────────────────────────────────
function WarningBanner({ message }: { message: string }) {
  const [dismissed, setDismissed] = React.useState(false);
  if (dismissed) return null;
  return (
    <motion.div initial={{ opacity: 0, y: -12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5, delay: 0.4 }}
      className="rd-warning"
    >
      <style>{`
        .rd-warning {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.9rem 1rem;
          margin-bottom: 1rem;
          border-radius: 0.9rem;
          background: linear-gradient(135deg, rgba(239,68,68,0.12), rgba(154,12,50,0.1));
          border: 1px solid rgba(239,68,68,0.3);
          box-shadow: 0 0 24px rgba(239,68,68,0.08), inset 0 1px 0 rgba(239,68,68,0.1);
        }
        .rd-warning::before {
          content:'';
          position:absolute;
          top:0; left:10%; right:10%;
          height:1px;
          background:linear-gradient(90deg,transparent,rgba(239,68,68,0.5),transparent);
        }
      `}</style>
      <AlertTriangle style={{ width: 20, height: 20, color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#ef4444', marginBottom: '0.3rem' }}>
          ⚠ Cosmic Warning Detected
        </div>
        <div style={{ fontSize: '0.78rem', color: 'rgba(255,180,180,0.85)', lineHeight: 1.6 }}>{message}</div>
      </div>
      <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.4)', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1, padding: 0, flexShrink: 0, transition: 'color 0.2s' }}>×</button>
    </motion.div>
  );
}

// ── Constellation Reveal ──────────────────────────────────────────────────────
function ConstellationReveal({ onDone }: { onDone: () => void }) {
  React.useEffect(() => { const t = setTimeout(onDone, 1800); return () => clearTimeout(t); }, [onDone]);
  const lines = [[60, 80, 140, 50], [140, 50, 200, 90], [200, 90, 280, 60], [280, 60, 340, 100], [60, 160, 140, 140], [140, 140, 200, 90], [200, 90, 260, 170], [260, 170, 340, 150]];
  const dots = [[60, 80], [140, 50], [200, 90], [280, 60], [340, 100], [60, 160], [140, 140], [260, 170], [340, 150]];
  return (
    <motion.div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent:'center', background: 'rgba(5,1,18,0.95)' }}
      initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, delay: 1.3 }}>
      <svg viewBox="0 0 400 220" style={{ width: '100%', maxWidth: '22rem', opacity: 0.8 }}>
        <defs><filter id="cr-glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        {lines.map(([x1, y1, x2, y2], i) => (
          <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(212,175,55,0.6)" strokeWidth="0.8"
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: i * 0.08, duration: 0.4 }} />
        ))}
        {dots.map(([cx, cy], i) => (
          <motion.circle key={i} cx={cx} cy={cy} r={i === 2 ? 4 : 2.5} fill={i === 2 ? '#d4af37' : 'rgba(212,175,55,0.7)'} filter="url(#cr-glow)"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.09 + 0.2, duration: 0.3, type: 'spring' }} />
        ))}
      </svg>
    </motion.div>
  );
}

// ── AI Cosmic Profiler (Rules-Based) ──────────────────────────────────────────
function CosmicProfilerPanel({ insight, numerology }: { insight: AstroInsightOutput; numerology: NumerologyData }) {
  const [revealed, setRevealed] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const profile = React.useMemo(() => buildCosmicProfile(insight, numerology), [insight, numerology]);

  return (
    <div style={{ borderRadius: '1.1rem', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.22)', background: 'rgba(15,5,40,0.95)', marginBottom: '1.25rem' }}>
      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)', marginBottom: '0.25rem' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', cursor: revealed ? 'pointer' : 'default', gap: '0.75rem' }}
        onClick={() => revealed && setOpen(o => !o)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Brain style={{ color: '#d4af37', width: 20, height: 20 }} />
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.85)' }}>Cosmic Profile Synthesis</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(200,180,240,0.4)', fontStyle: 'italic' }}>Rules-based deterministic character analysis</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {!revealed && (
            <button onClick={e => { e.stopPropagation(); setRevealed(true); setOpen(true); }}
              style={{ background: 'linear-gradient(135deg,#5b21b6,#d4af37,#7c3aed)', backgroundSize: '200%', border: 'none', borderRadius: '0.65rem', padding: '0.45rem 1rem', fontFamily: "'Cinzel',serif", fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1a0a2e', cursor: 'pointer', boxShadow: '0 4px 18px rgba(212,175,55,0.25)', transition: 'box-shadow 0.3s' }}>
              Reveal
            </button>
          )}
          {revealed && <ChevronDown style={{ color: 'rgba(212,175,55,0.4)', width: 16, height: 16, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />}
        </div>
      </div>
      <AnimatePresence>
        {open && revealed && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            style={{ padding: '0 1.25rem 1.25rem' }}>
            <div style={{ fontSize: '0.82rem', lineHeight: 1.75, color: 'rgba(210,195,240,0.8)', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body, serif)' }}>
              {profile.split('\n\n').map((para, i) => {
                const labels = ['Core Essence', 'Shadow & Wounds', 'Gifts & Peak Power', 'Timing & Directive'];
                return (
                  <div key={i} style={{ marginBottom: '1.2rem' }}>
                    <span style={{ display: 'block', fontSize: '0.48rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.4)', marginBottom: '0.35rem', fontFamily: "'Cinzel', serif" }}>{labels[i]}</span>
                    <p style={{ margin: 0 }}>{para}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Animated Tab ──────────────────────────────────────────────────────────────
function AnimatedTab({ isActive, onClick, children }: { isActive: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <div className="animated-border">
      <button onClick={onClick} className={`w-full h-full rounded-lg py-2 px-4 text-[0.65rem] font-cinzel tracking-widest font-medium cursor-pointer transition-colors duration-300 relative uppercase ${isActive ? 'text-yellow-300' : 'text-white/70'}`}>
        {children}
      </button>
    </div>
  );
}

// ── New Astro Layer ───────────────────────────────────────────────────────────
function NewAstroLayer({ layerNum, title, icon, content, badgeColor, isOpen, onToggle }: { layerNum: number; title: string; icon: React.ReactNode; content: string | undefined; badgeColor: string; isOpen: boolean; onToggle: () => void }) {
  if (!content) return null;
  return (
    <div style={{ borderTop: '1px solid #2a2340' }}>
      <button onClick={onToggle} aria-expanded={isOpen} style={{ width: '100%', background: 'transparent', border: 'none', padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '2px 7px', borderRadius: 20, border: '1px solid', background: `${badgeColor}22`, color: badgeColor, borderColor: `${badgeColor}55`, fontFamily: "'Cinzel',serif" }}>Layer {layerNum}</span>
          <span style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '0.03em', color: '#c4b8e8', fontFamily: "'Cinzel',serif" }}>{title}</span>
        </div>
        <span style={{ fontSize: 18, color: '#7a6fa0', transition: 'transform 0.2s ease', transform: isOpen ? 'rotate(180deg)' : 'none', lineHeight: 1 }}>▾</span>
      </button>
      {isOpen && (
        <div style={{ padding: '4px 0 18px', animation: 'naFadeIn 0.2s ease' }}>
          <style>{`@keyframes naFadeIn{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}`}</style>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: `3px solid ${badgeColor}`, borderRadius: '0 10px 10px 0', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              {icon}
              <span style={{ fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em', color: badgeColor }}>{title} Analysis</span>
            </div>
            <AccordionContentWithPlayer text={content} />
          </div>
        </div>
      )}
    </div>
  );
}

function NewAstroSignDetails({ sign, signData }: { sign: string; signData: AstroInsightOutput['signData'] }) {
  const [openLayer, setOpenLayer] = React.useState<number | null>(1);
  const animalName = sign.split('/')[1]?.trim();
  const animalEmoji = ZOO[animalName]?.e || '';
  const toggle = (num: number) => setOpenLayer(openLayer === num ? null : num);
  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <h2 className="font-decorative text-xl text-primary flex items-center justify-center gap-3"><span>{animalEmoji}</span>{sign}<span>{animalEmoji}</span></h2>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
      <div className="flex flex-col">
        <NewAstroLayer layerNum={1} title="Psychological Profile" icon={<BookUser className="h-4 w-4" />} content={signData.description} badgeColor="#9b8ec4" isOpen={openLayer === 1} onToggle={() => toggle(1)} />
        <NewAstroLayer layerNum={2} title="Romantic Blueprint" icon={<Heart className="h-4 w-4" />} content={signData.love} badgeColor="#3a8ee0" isOpen={openLayer === 2} onToggle={() => toggle(2)} />
        <NewAstroLayer layerNum={3} title="Domestic Sphere" icon={<Home className="h-4 w-4" />} content={signData.homeAndFamily} badgeColor="#4caf7d" isOpen={openLayer === 3} onToggle={() => toggle(3)} />
        <NewAstroLayer layerNum={4} title="Social Resonance" icon={<Users className="h-4 w-4" />} content={signData.compatibilities} badgeColor="#e0a83a" isOpen={openLayer === 4} onToggle={() => toggle(4)} />
        <NewAstroLayer layerNum={5} title="Professional Path" icon={<Briefcase className="h-4 w-4" />} content={signData.profession} badgeColor="#de78a0" isOpen={openLayer === 5} onToggle={() => toggle(5)} />
      </div>
    </div>
  );
}

// ── Results Header ────────────────────────────────────────────────────────────
function ResultsHeader({ name, newAstroSign, birthDate, onTabClick, activeTab }: { name: string; newAstroSign: string; birthDate: string; onTabClick: (t: string) => void; activeTab: string }) {
  const animalName = newAstroSign.split('/')[1]?.trim();
  const animalEmoji = ZOO[animalName]?.e || '';
  return (
    <div className="flex flex-col items-center justify-center mb-6 p-4 rounded-xl w-full">
      <motion.h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-purple-300 to-pink-400 tracking-wider text-center font-decorative mb-2"
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}>
        {name}
      </motion.h1>
      <p className="text-[0.7rem] text-white/50 mt-1 font-cinzel uppercase tracking-[0.2em]">{birthDate}</p>
      <div className="relative grid grid-cols-2 gap-3 w-full max-w-2xl mx-auto mt-6 px-4">
        <AnimatedTab isActive={activeTab === 'new-astro'} onClick={() => onTabClick('new-astro')}>{animalEmoji} {newAstroSign} {animalEmoji}</AnimatedTab>
        <AnimatedTab isActive={activeTab === 'astro'} onClick={() => onTabClick('astro')}>Astrology</AnimatedTab>
        <AnimatedTab isActive={activeTab === 'numerology'} onClick={() => onTabClick('numerology')}>Numerology</AnimatedTab>
        <AnimatedTab isActive={activeTab === 'cosmic-fate'} onClick={() => onTabClick('cosmic-fate')}>🌌 Cosmic Fate Map</AnimatedTab>
      </div>
    </div>
  );
}

// ── Floating Nav ──────────────────────────────────────────────────────────────
function FloatingNavigation({ onReset, onHistoryOpen }: { onReset: () => void; onHistoryOpen: () => void }) {
  return (
    <>
      <div className="fixed bottom-6 left-6 z-50 pointer-events-auto">
        <Button variant="ghost" size="icon" onClick={onReset} className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"><ArrowLeft className="h-5 w-5" /></Button>
      </div>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"><InstallButton minimal /></div>
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <Button variant="ghost" size="icon" onClick={onHistoryOpen} className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"><History className="h-5 w-5" /></Button>
      </div>
    </>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export function ResultsDisplay({ insight, numerology, onReset, onHistoryOpen }: { insight: AstroInsightOutput; numerology: NumerologyData; onReset: () => void; onHistoryOpen: () => void }) {
  const [activeTab, setActiveTab] = React.useState('astro');
  const [showReveal, setShowReveal] = React.useState(true);
  const warning = React.useMemo(() => detectWarning(numerology), [numerology]);

  React.useEffect(() => {
    return () => { if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) window.speechSynthesis.cancel(); };
  }, [activeTab]);

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) { case 1: return 'st'; case 2: return 'nd'; case 3: return 'rd'; default: return 'th'; }
  };
  const formatDate = () => {
    const { birthDay } = numerology; const { month, year } = insight;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `Born ${birthDay}${getOrdinalSuffix(birthDay)} ${months[month - 1]} ${year}`;
  };

  return (
    <>
      <AnimatePresence>{showReveal && <ConstellationReveal onDone={() => setShowReveal(false)} />}</AnimatePresence>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}
        className="results-background w-full min-h-screen flex flex-col p-4">
        <div className="w-full max-w-4xl mx-auto flex-grow">
          <ResultsHeader name={insight.name} newAstroSign={insight.new_astrology_sign} birthDate={formatDate()} onTabClick={setActiveTab} activeTab={activeTab} />
          <AnimatePresence>{warning && <WarningBanner message={warning} />}</AnimatePresence>
          <CosmicProfilerPanel insight={insight} numerology={numerology} />
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.99 }} transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}>
              {activeTab === 'astro' && <AstroDisplay insight={insight} />}
              {activeTab === 'numerology' && <NumerologyDisplay numerology={numerology} />}
              {activeTab === 'new-astro' && <NewAstroSignDetails sign={insight.new_astrology_sign} signData={insight.signData} />}
              {activeTab === 'cosmic-fate' && <CosmicFateMap birthDay={numerology.birthDay} birthMonth={numerology.birthMonth} birthYear={numerology.birthYear} />}
            </motion.div>
          </AnimatePresence>
        </div>
        <footer className="text-center p-4 pb-24 text-white/50 text-[0.65rem] whitespace-pre-line font-body italic leading-relaxed">
          {"He who knows others is learned;\nHe who knows himself is wise.\n— Lao Tzu, Dao De Jing"}
        </footer>
      </motion.div>
      <FloatingNavigation onReset={onReset} onHistoryOpen={onHistoryOpen} />
    </>
  );
}
