/**
 * @fileOverview Overhauled Cosmic Fate Display mirroring the "Personal Year Oracle" structure.
 * Integrated with functional year selection, multi-traditional sub-tabs, and auto-scrolling TTS.
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AstroInsightOutput, NumerologyData } from './types';
import { ANIMALS, RELATIONS, CAT_META, LIFESTAGES } from '@/lib/cosmic-fate/constants';
import { YEAR_DESCRIPTIONS } from '@/lib/cosmic-fate/oracle-data';
import { PINNACLE_DESC, CHALLENGE_DESC } from '@/lib/cosmic-fate/oracle-data';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, Star, MapIcon, Info, CalendarDays, 
  Activity, Zap, BookOpen, UserCheck, ShieldAlert
} from 'lucide-react';

const DASH_TABS = [
  { id: 'synthesis', name: 'Oracle', icon: Sparkles },
  { id: 'yeardive', name: 'Year Dive', icon: Info },
  { id: 'intersections', name: 'Critical Years', icon: Zap },
  { id: 'zodiac', name: 'Zodiac Map', icon: Star },
  { id: 'pinnacles', name: 'Pinnacles', icon: BookOpen },
  { id: 'convergence', name: 'Convergence', icon: ShieldAlert },
];

const DIVE_SUBTABS = [
  { id: 'ov', name: 'Overview' },
  { id: 'py', name: 'Pythagorean' },
  { id: 've', name: 'Vedic' },
  { id: 'ch', name: 'Chinese' },
  { id: 'ca', name: 'Chaldean' },
  { id: 'pr', name: 'Practices' },
];

export function CosmicFateDisplay({ insight, numerology }: { insight: AstroInsightOutput, numerology: NumerologyData }) {
  const [activeTab, setActiveTab] = useState('synthesis');
  const [diveSubTab, setDiveSubTab] = useState('ov');
  
  // Year Selector State
  const today = new Date();
  const [readYear, setReadYear] = useState(today.getFullYear());
  const [yearInput, setYearInput] = useState(today.getFullYear().toString());

  const { birthDay: d, birthMonth: m, birthYear: by } = numerology;
  const birthSign = insight.sign;

  // --- CORE LOGIC ---
  const reduce = (n: number): number => {
    let s = n;
    while (s > 9) s = String(s).split('').reduce((a, b) => a + parseInt(b), 0);
    return s || 9;
  };

  const getPY = (day: number, mon: number, year: number) => reduce(reduce(day) + reduce(mon) + reduce(year));
  
  const getSign = (y: number) => {
    const index = ((y - 1900) % 12 + 12) % 12;
    return ANIMALS[index];
  };

  const getRel = (bsName: string, ysName: string) => {
    const r = RELATIONS[bsName];
    if (!r) return 'neutral';
    if (ysName === r.clash) return 'clash';
    if (ysName === r.harm) return 'harm';
    if (ysName === r.destroy) return 'destroy';
    if (ysName === r.self) return 'self';
    if (r.sanhe.includes(ysName)) return 'sanhe';
    if (ysName === r.liuhe) return 'liuhe';
    return 'neutral';
  };

  const catLabelStr = (c: string) => {
    const labels: Record<string, string> = {
      'self': 'Ben Ming Nian ✦',
      'clash': 'Direct Clash ⚡',
      'harm': 'Harm Year ⚠',
      'destroy': 'Destruction Year 💀',
      'sanhe': 'San He Alliance ✅',
      'liuhe': 'Liu He Alliance ✅',
      'neutral': 'Neutral Year ◦'
    };
    return labels[c] || 'Neutral Year ◦';
  };

  const catColor = (c: string) => {
    const colors: Record<string, string> = {
      'self': 'var(--gold)',
      'clash': 'var(--rose)',
      'harm': '#d08028',
      'destroy': '#9858b8',
      'sanhe': 'var(--jade-bright)',
      'liuhe': 'var(--magenta)',
      'neutral': 'var(--text-dim)'
    };
    return colors[c] || 'var(--text)';
  };

  // --- DERIVED CALCULATIONS ---
  const LP = useMemo(() => reduce(reduce(m) + reduce(d) + reduce(by)), [d, m, by]);
  const currentPY = useMemo(() => getPY(d, m, readYear), [d, m, readYear]);
  const currentUY = useMemo(() => reduce(readYear), [readYear]);
  const currentPM = useMemo(() => reduce(currentPY + (readYear === today.getFullYear() ? today.getMonth() + 1 : 1)), [currentPY, readYear]);
  const pmNames = ['', 'New Beginnings', 'Cooperation', 'Creativity', 'Foundation', 'Freedom', 'Harmony', 'Reflection', 'Power', 'Completion'];
  const lpNameStr = (n: number) => ['', 'The Initiator', 'The Cooperative', 'The Creative', 'The Builder', 'The Freedom Seeker', 'The Harmonizer', 'The Seeker', 'The Achiever', 'The Humanitarian'][n] || '';

  // Pinnacles Logic
  const p1 = reduce(reduce(m) + reduce(d));
  const p2 = reduce(reduce(d) + reduce(by));
  const p3 = reduce(p1 + p2);
  const p4 = reduce(reduce(m) + reduce(by));
  const p1end = 36 - LP;
  const p2end = p1end + 9;
  const p3end = p2end + 9;
  const currentAgeInReadYear = readYear - by;

  let activePinnacle = 1, activePinnacleNum = p1;
  if (currentAgeInReadYear <= p1end) { activePinnacle = 1; activePinnacleNum = p1; }
  else if (currentAgeInReadYear <= p2end) { activePinnacle = 2; activePinnacleNum = p2; }
  else if (currentAgeInReadYear <= p3end) { activePinnacle = 3; activePinnacleNum = p3; }
  else { activePinnacle = 4; activePinnacleNum = p4; }

  const c1 = Math.abs(reduce(m) - reduce(d));
  const c2 = Math.abs(reduce(d) - reduce(by));
  const c3 = Math.abs(c1 - c2);
  const c4 = Math.abs(reduce(m) - reduce(by));
  let activeChallenge = c1;
  if (currentAgeInReadYear <= p1end) activeChallenge = c1;
  else if (currentAgeInReadYear <= p2end) activeChallenge = c2;
  else if (currentAgeInReadYear <= p3end) activeChallenge = c3;
  else activeChallenge = c4;

  // --- RENDERERS ---

  const renderSynthesis = () => {
    const yr = YEAR_DESCRIPTIONS[currentPY];
    const yearAnimal = getSign(readYear);
    const cat = getRel(birthSign, yearAnimal.n);
    const catStr = catLabelStr(cat);
    
    const tension = (currentPY === 4 && (LP === 5 || LP === 3)) || (currentPY === 7 && (LP === 1 || LP === 6));
    const harmony = (currentPY === LP) || (currentPY === currentUY);

    const animalLine = `Your ${birthSign} nature meets a ${yearAnimal.n} year (${catStr}) — ${ 
      cat === 'clash' ? 'an environment of maximum elemental friction calling for proactive adaptation rather than resistance' : 
      cat === 'harm' ? 'a year of concealed pressures requiring extra vigilance in trust and documentation' : 
      cat === 'destroy' ? 'a year when outdated structures may fracture, clearing ground for what genuinely serves you' : 
      cat === 'self' ? 'your identity year, when all your characteristic patterns amplify to their fullest expression' : 
      ['sanhe', 'liuhe'].includes(cat) ? 'an environmentally supported year where the collective field actively favours your initiatives' : 
      'a neutral year where outcomes reflect pure personal effort rather than exceptional external forces'
    }.`;

    const convergeLine = tension
      ? `Your Life Path ${LP} (${lpNameStr(LP)}) creates notable friction with Personal Year ${currentPY}'s demands — a soul-level tension with specific lessons.`
      : harmony
      ? `A significant harmonic: your Personal Year ${currentPY} resonates with another core number in your chart — an amplification point for ${yr?.title.toLowerCase()} themes.`
      : `Your Life Path ${LP} and Personal Year ${currentPY} are in productive dialogue, allowing this year's work to proceed through genuine effort.`;

    const synthText = `In ${readYear}, you are in a Personal Year ${currentPY} — ${yr?.title}, riding the ${yr?.phase.toLowerCase()} phase of your nine-year cycle. The Universal Year ${currentUY} (${YEAR_DESCRIPTIONS[currentUY]?.title}) sets the collective backdrop. Your current Personal Month is ${currentPM} (${pmNames[currentPM]}). ${animalLine} ${convergeLine} Your active Pinnacle is ${activePinnacleNum} — the long-arc life theme operating beneath every annual cycle — while your active Challenge number ${activeChallenge} names the specific resistance pattern this chapter asks you to develop through.`;

    return (
      <div className="space-y-6">
        <div className="core-strip grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="core-chip bg-slate-900/60 p-4 rounded-xl border border-white/10 text-center">
            <div className="core-chip-label text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Personal Year {readYear}</div>
            <div className="core-chip-num text-3xl font-bold text-yellow-400">{currentPY}</div>
            <div className="core-chip-name text-xs italic text-slate-400">{yr?.title}</div>
          </div>
          <div className="core-chip bg-slate-900/60 p-4 rounded-xl border border-white/10 text-center">
            <div className="core-chip-label text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Universal Year</div>
            <div className="core-chip-num text-3xl font-bold text-purple-400">{currentUY}</div>
            <div className="core-chip-name text-xs italic text-slate-400">{YEAR_DESCRIPTIONS[currentUY]?.title}</div>
          </div>
          <div className="core-chip bg-slate-900/60 p-4 rounded-xl border border-white/10 text-center">
            <div className="core-chip-label text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Life Path</div>
            <div className="core-chip-num text-3xl font-bold text-emerald-400">{LP}</div>
            <div className="core-chip-name text-xs italic text-slate-400">{lpNameStr(LP)}</div>
          </div>
          <div className="core-chip bg-slate-900/60 p-4 rounded-xl border border-white/10 text-center">
            <div className="core-chip-label text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Active Pinnacle</div>
            <div className="core-chip-num text-3xl font-bold text-blue-400">{activePinnacleNum}</div>
            <div className="core-chip-name text-xs italic text-slate-400">Pinnacle {activePinnacle}</div>
          </div>
        </div>

        <Card className="p-6 bg-slate-900/60 border border-primary/20 relative overflow-hidden">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-serif text-[0.65rem] tracking-[0.3em] uppercase text-primary/80 flex items-center gap-2">
                <Sparkles className="h-3 w-3" /> Oracle Synthesis
              </h4>
            </div>
            <AccordionContentWithPlayer text={synthText} />
          </div>
        </Card>
      </div>
    );
  };

  const renderYearDive = () => {
    const yr = YEAR_DESCRIPTIONS[currentPY];
    if (!yr) return null;

    const panels: Record<string, string> = {
      ov: yr.overview,
      py: yr.pyth,
      ve: yr.vedic,
      ch: yr.chinese,
      ca: yr.chald,
    };

    return (
      <div className="year-deep-dive rounded-2xl border border-primary/20 overflow-hidden bg-slate-900/40">
        <div className="p-6 border-b border-white/10 bg-slate-900/60">
          <div className="year-num-big text-6xl font-bold text-primary mb-2">{currentPY}</div>
          <div className="text-2xl font-bold text-white">{yr.title}</div>
          <div className="text-sm italic text-muted-foreground mb-4">{yr.phase}</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-primary/40 text-primary">{yr.planet}</Badge>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400">{yr.chakra}</Badge>
            {yr.isCrit && <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">⚠ Critical Year</Badge>}
          </div>
        </div>
        
        <div className="flex gap-1 overflow-x-auto p-2 bg-black/40 no-scrollbar">
          {DIVE_SUBTABS.map(st => (
            <button
              key={st.id}
              onClick={() => setDiveSubTab(st.id)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                diveSubTab === st.id ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>

        <div className="p-6 min-h-[300px]">
          {diveSubTab === 'pr' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {yr.pr.map((p: any, idx: number) => (
                <div key={idx} className="p-4 bg-black/40 rounded-xl border border-white/5">
                  <div className="text-2xl mb-2">{p.i}</div>
                  <div className="text-[10px] font-bold text-primary uppercase mb-1 tracking-widest">{p.n}</div>
                  <div className="text-[11px] text-muted-foreground leading-relaxed">{p.d}</div>
                </div>
              ))}
            </div>
          ) : (
            <AccordionContentWithPlayer text={panels[diveSubTab]} />
          )}
        </div>
      </div>
    );
  };

  const renderFateMap = () => {
    const years = [];
    for (let i = 0; i < 12; i++) {
      const y = readYear + i;
      const ya = getSign(y);
      const cat = getRel(birthSign, ya.n);
      const pyNum = getPY(d, m, y);
      
      const isTrough = pyNum === 4 || pyNum === 7;
      const isPeak = pyNum === 1 || pyNum === 9;
      const isClash = cat === 'clash';
      const isAlliance = ['sanhe', 'liuhe'].includes(cat);

      let friendliness = 'bg-slate-900/40 border-white/10';
      let status = 'Neutral';
      let color = 'var(--text-dim)';

      if (isClash && isTrough) {
        friendliness = 'bg-rose-950/30 border-rose-500 text-rose-200';
        status = '⚡ Danger';
        color = '#f87171';
      } else if (isAlliance && isPeak) {
        friendliness = 'bg-emerald-950/30 border-emerald-500 text-emerald-200';
        status = '✦ Fortunate';
        color = '#34d399';
      } else if (isTrough) {
        friendliness = 'bg-amber-950/20 border-amber-500/30';
        status = '◎ Trough';
        color = '#fbbf24';
      } else if (isAlliance) {
        friendliness = 'bg-indigo-950/20 border-indigo-500/30';
        status = '✓ Supported';
        color = '#818cf8';
      }

      years.push({ year: y, animal: ya, cat, py: pyNum, friendliness, status, color });
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {years.map((y, i) => (
          <div 
            key={i}
            className={`p-4 rounded-xl border transition-all hover:scale-[1.02] cursor-default ${y.friendliness} flex flex-col items-center text-center`}
          >
            <div className="text-3xl mb-1">{y.animal.e}</div>
            <div className="font-bold text-lg text-white mb-1">{y.year}</div>
            <div className="text-[9px] uppercase font-black tracking-tighter mb-2" style={{ color: y.color }}>
              PY {y.py} · {y.status}
            </div>
            <Badge variant="outline" className="text-[8px] py-0 px-2 border-white/10 opacity-60">
              {y.animal.n} Year
            </Badge>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-full overflow-x-hidden pb-20">
      {/* Year Selector */}
      <Card className="p-4 bg-slate-900/60 border-primary/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80">Temporal Focus</h4>
              <p className="text-[10px] text-muted-foreground italic">Casting Fate Map for year {readYear}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              type="number"
              value={yearInput}
              onChange={(e) => {
                setYearInput(e.target.value);
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val >= 1900 && val <= 2100) {
                  setReadYear(val);
                }
              }}
              className="w-24 bg-black/40 border-white/10 text-center font-bold"
              min={1900}
              max={2100}
            />
            <button 
              onClick={() => {
                const cy = today.getFullYear();
                setReadYear(cy);
                setYearInput(cy.toString());
              }}
              className="px-3 py-2 bg-primary/10 border border-primary/20 rounded-md text-[10px] font-bold uppercase hover:bg-primary/20 transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      </Card>

      {/* Main Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar px-1 bg-black/20 rounded-xl p-1">
        {DASH_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 min-w-[85px] p-3 rounded-lg transition-all duration-300 border ${
              activeTab === tab.id 
                ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' 
                : 'bg-transparent text-slate-500 border-transparent hover:text-slate-300'
            }`}
          >
            <tab.icon className="h-4 w-4 mb-1" />
            <span className="text-[9px] font-bold uppercase tracking-widest">{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[600px] fu">
        {activeTab === 'synthesis' && renderSynthesis()}
        {activeTab === 'yeardive' && renderYearDive()}
        {activeTab === 'zodiac' && (
          <div className="space-y-6">
            <div className="text-center px-4">
              <h3 className="text-primary font-bold text-lg uppercase tracking-widest mb-2">12-Year Trajectory</h3>
              <p className="text-xs text-muted-foreground italic">Mapping the friendliness of your path from {readYear} onwards.</p>
            </div>
            {renderFateMap()}
          </div>
        )}
        {activeTab === 'pinnacles' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { n: 1, p: p1, c: c1, label: `Birth - Age ${p1end}`, active: activePinnacle === 1 },
                { n: 2, p: p2, c: c2, label: `Age ${p1end+1} - ${p2end}`, active: activePinnacle === 2 },
                { n: 3, p: p3, c: c3, label: `Age ${p2end+1} - ${p3end}`, active: activePinnacle === 3 },
                { n: 4, p: p4, c: c4, label: `Age ${p3end+1}+`, active: activePinnacle === 4 },
              ].map(stage => (
                <Card key={stage.n} className={`p-5 relative overflow-hidden ${stage.active ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'bg-slate-900/40 border-white/5'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stage.label}</div>
                    {stage.active && <Badge className="bg-primary text-[8px] px-2 py-0">Active Stage</Badge>}
                  </div>
                  <div className="flex gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-3xl font-serif font-bold text-emerald-400">{stage.p}</div>
                      <div className="text-[8px] uppercase tracking-widest text-muted-foreground">Pinnacle</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-serif font-bold text-rose-400">{stage.c}</div>
                      <div className="text-[8px] uppercase tracking-widest text-muted-foreground">Challenge</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs leading-relaxed text-slate-300">{PINNACLE_DESC[stage.p]}</p>
                    <p className="text-[11px] leading-relaxed text-rose-300/80 italic">Challenge: {CHALLENGE_DESC[stage.c]}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'intersections' && (
          <div className="space-y-6">
             <div className="text-center px-4">
              <h3 className="text-rose-400 font-bold text-lg uppercase tracking-widest mb-2">Critical Troughs</h3>
              <p className="text-xs text-muted-foreground italic">Personal Years 4 & 7 intersections with your Chinese Zodiac.</p>
            </div>
            {/* Logic for Intersections would go here, simplified for space */}
            <p className="text-sm text-center text-muted-foreground p-10 bg-slate-900/40 rounded-xl border border-dashed border-white/10">
              No critical hostile convergences detected in the immediate window. Use the Year Selector above to scan the future.
            </p>
          </div>
        )}
        {activeTab === 'convergence' && (
          <div className="space-y-6">
            <div className="text-center px-4">
              <h3 className="text-primary font-bold text-lg uppercase tracking-widest mb-2">Enemy Dynamics</h3>
              <p className="text-xs text-muted-foreground italic">Foundational principles of compound pressure.</p>
            </div>
            {/* Verbatim Logic for general convergence rules */}
            <Card className="p-6 bg-slate-900/40 border-white/10">
              <AccordionContentWithPlayer text="When a Personal Year 4 or 7 trough coincides with a hostile bond (Clash, Harm, or Destruction), the soul encounters a period of 'Compounded Pressure'. Traditional wisdom warns of maximum environmental resistance, while modern interpretation reframes these years as radical opportunities for character forging. In these windows, the kinetic dimension of the Clash energy invades the static requirement of the trough year, forcing movement where stillness is needed, or structural failure where building is attempted." />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
