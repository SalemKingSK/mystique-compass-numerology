
/**
 * @fileOverview Precision-engineered Cosmic Fate Map refactored to native React state.
 * Expanded to include dedicated detail blocks for Personal Year, Universal Year, and Life Path.
 */
'use client';

import React, { useState, useMemo } from 'react';
import { ZOO } from '@/lib/cosmic-fate/zoo';
import { YD } from '@/lib/cosmic-fate/oracle';
import { CONVERGENCE_CARDS } from '@/lib/cosmic-fate/convergence';
import { PINNACLE_DESC, CHALLENGE_DESC } from '@/lib/cosmic-fate/pinnacles';
import { INTERSECTION_SYNTHESIS } from '@/lib/cosmic-fate/intersections';
import { CHINESE_CALENDAR } from '@/lib/new-astrology/chinese-calendar';
import { BOOK } from '@/lib/cosmic-fate/book';
import { ANIMALS, RELATIONS, CAT_META } from '@/lib/cosmic-fate/constants';
import { CosmicRiskScanner } from './cosmic-risk-scanner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CalendarDays, Star, Compass, Activity, ShieldAlert, Telescope, BookOpen, Zap, Globe, Info } from 'lucide-react';
import { AccordionContentWithPlayer } from './accordion-content-with-player';

interface Props {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
}

const reduce = (n: number): number => {
  let s = Math.abs(n);
  while (s > 9) { s = String(s).split('').reduce((a, c) => a + (+c), 0); }
  return s || 9;
};

const lpName = (n: number) => ['', 'The Initiator', 'The Cooperative', 'The Creative', 'The Builder', 'The Freedom Seeker', 'The Harmonizer', 'The Seeker', 'The Achiever', 'The Humanitarian'][n] || '';

const getAnimalForDate = (d: number, m: number, y: number) => {
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);

  const entry = CHINESE_CALENDAR.find(e => {
    const s = new Date(e.start);
    const end = new Date(e.end);
    s.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return date >= s && date <= end;
  });

  if (entry) {
    const parts = entry.title.split(' ');
    return parts[parts.length - 1]; 
  }

  const signs = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  return signs[((y - 1900) % 12 + 12) % 12];
};

const getCategory = (birthSign: string, yearSign: string) => {
  if (birthSign === yearSign) return 'ben';
  
  const clashes = [
    ['Rat', 'Horse'], ['Ox', 'Goat'], ['Tiger', 'Monkey'],
    ['Rabbit', 'Rooster'], ['Dragon', 'Dog'], ['Snake', 'Pig']
  ];
  if (clashes.some(p => (p[0] === birthSign && p[1] === yearSign) || (p[1] === birthSign && p[0] === yearSign))) return 'clash';

  const harms = [
    ['Rat', 'Goat'], ['Ox', 'Horse'], ['Tiger', 'Snake'],
    ['Rabbit', 'Dragon'], ['Monkey', 'Pig'], ['Rooster', 'Dog']
  ];
  if (harms.some(p => (p[0] === birthSign && p[1] === yearSign) || (p[1] === birthSign && p[0] === yearSign))) return 'harm';

  const destructions = [
    ['Rat', 'Rooster'], ['Ox', 'Dragon'], ['Tiger', 'Pig'],
    ['Rabbit', 'Horse'], ['Goat', 'Dog'], ['Monkey', 'Snake']
  ];
  if (destructions.some(p => (p[0] === birthSign && p[1] === yearSign) || (p[1] === birthSign && p[0] === yearSign))) return 'destruction';

  const sanHe = [
    ['Tiger', 'Horse', 'Dog'], ['Monkey', 'Rat', 'Dragon'],
    ['Pig', 'Rabbit', 'Goat'], ['Snake', 'Rooster', 'Ox']
  ];
  if (sanHe.some(triad => triad.includes(birthSign) && triad.includes(yearSign))) return 'alliance';

  const liuHe = [
    ['Rat', 'Ox'], ['Tiger', 'Pig'], ['Rabbit', 'Dog'],
    ['Dragon', 'Rooster'], ['Snake', 'Monkey'], ['Horse', 'Goat']
  ];
  if (liuHe.some(p => (p[0] === birthSign && p[1] === yearSign) || (p[1] === birthSign && p[0] === yearSign))) return 'alliance';

  return 'neutral';
};

const catLabel = (c: string) => ({ 
  'ben': 'BEN MING NIAN', 'clash': 'DIRECT CLASH', 'harm': 'HARM YEAR', 
  'destruction': 'DESTRUCTION YEAR', 'alliance': 'ALLIANCE YEAR', 'neutral': 'NEUTRAL YEAR' 
}[c] || 'NEUTRAL YEAR');

const getStatusLabelShort = (c: string) => ({ 
  'ben': 'BEN MING', 'clash': 'CLASH', 'harm': 'HARM', 
  'destruction': 'DESTRUCTION', 'alliance': 'ALLIANCE', 'neutral': 'NEUTRAL' 
}[c] || 'NEUTRAL');

const pyColors: Record<number, string> = {
  1: "#e8b830", 2: "#98b4de", 3: "#68c268", 4: "#c86040", 5: "#dca030", 6: "#de78a0", 7: "#8870c8", 8: "#a8b5cc", 9: "#c84848"
};

export function CosmicFateMap({ birthDay, birthMonth, birthYear }: Props) {
  const [activeTab, setActiveTab] = useState('synthesis');
  const [readYear, setReadYear] = useState(new Date().getFullYear());
  const [selectedZodiacYear, setSelectedZodiacYear] = useState<any>(null);
  const [diveSubTab, setDiveSubTab] = useState('ov');

  const pmNames = ['', 'Initiation', 'Partnership', 'Creativity', 'Foundation', 'Freedom', 'Harmony', 'Retreat', 'Power', 'Completion'];

  const stats = useMemo(() => {
    const py = reduce(reduce(birthMonth) + reduce(birthDay) + reduce(readYear));
    const uy = reduce(readYear);
    const lp = reduce(reduce(birthMonth) + reduce(birthDay) + reduce(birthYear));
    const bv = reduce(birthDay);
    const today = new Date();
    const currentMonthIndex = readYear === today.getFullYear() ? today.getMonth() + 1 : 1;
    const pm = reduce(py + currentMonthIndex);
    
    // Pinnacles
    const p1 = reduce(reduce(birthMonth) + reduce(birthDay));
    const p2 = reduce(reduce(birthDay) + reduce(birthYear));
    const p3 = reduce(p1 + p2);
    const p4 = reduce(reduce(birthMonth) + reduce(birthYear));
    const p1end = 36 - lp;
    const p2end = p1end + 9;
    const p3end = p2end + 9;
    const age = readYear - birthYear;
    
    let pNum, pStage;
    if (age <= p1end) { pStage = 1; pNum = p1; }
    else if (age <= p2end) { pStage = 2; pNum = p2; }
    else if (age <= p3end) { pStage = 3; pNum = p3; }
    else { pStage = 4; pNum = p4; }

    const c1 = Math.abs(reduce(birthMonth) - reduce(birthDay));
    const c2 = Math.abs(reduce(birthDay) - reduce(birthYear));
    const c3 = Math.abs(c1 - c2);
    const c4 = Math.abs(reduce(birthMonth) - reduce(birthYear));
    let cNum;
    if (age <= p1end) cNum = c1;
    else if (age <= p2end) cNum = c2;
    else if (age <= p3end) cNum = c3;
    else cNum = c4;

    const birthSign = getAnimalForDate(birthDay, birthMonth, birthYear);
    const yearAnimalName = getAnimalForDate(15, 6, readYear); 
    const cat = getCategory(birthSign, yearAnimalName);

    return { py, uy, lp, bv, pm, pNum, pStage, cNum, age, birthSign, yearAnimalName, cat, p1end, p2end, p3end, p1, p2, p3, p4, c1, c2, c3, c4 };
  }, [birthDay, birthMonth, birthYear, readYear]);

  const oracleText = useMemo(() => {
    const yr = YD[stats.py];
    const cm = CAT_META[stats.cat === 'alliance' ? 'sanhe' : stats.cat === 'ben' ? 'self' : stats.cat];
    const lpRelationText = (stats.py === stats.lp) ? "exceptional harmony" : (Math.abs(stats.py - stats.lp) === 4 || Math.abs(stats.py - stats.lp) === 5) ? "notable friction" : "productive dialogue — neither in obvious tension nor exceptional harmony";
    const lpInteractionText = (stats.py === stats.lp) ? "match" : (Math.abs(stats.py - stats.lp) === 4 || Math.abs(stats.py - stats.lp) === 5) ? "creates notable friction with" : "and";
    
    return `In ${readYear}, you are in a Personal Year ${stats.py} — ${yr?.title}, riding the ${yr?.phase.toLowerCase()} phase of your nine-year cycle. The Universal Year ${stats.uy} (${YD[stats.uy]?.title}) sets the collective backdrop — the shared frequency every person on earth is navigating alongside their personal arc. Your current Personal Month is ${stats.pm} (${pmNames[stats.pm]}), offering a finer-grained window into this season's immediate texture. Your ${stats.birthSign} nature meets a ${stats.yearAnimalName} year (${catLabel(stats.cat)}) — a ${stats.cat === 'neutral' ? 'neutral year where outcomes reflect pure personal effort rather than exceptional external forces' : catLabel(stats.cat).toLowerCase() + ' where trajectories are specifically influenced by Tai Sui energy'}. Your Life Path ${stats.lp} (${lpName(stats.lp)}) ${lpInteractionText} Personal Year ${stats.py} (${yr?.title}) are in ${lpRelationText} — allowing this year's work to proceed through genuine effort. Your active Pinnacle is ${stats.pNum} — the long-arc life theme operating beneath every annual cycle — while your active Challenge number ${stats.cNum} (${lpName(stats.cNum)}) names the specific resistance pattern this life chapter asks you to develop through. Taken together, these layers describe not one story but several simultaneous ones: the year's momentum, the month's focus, the decade's theme, and the lifetime's direction — all converging in ${readYear}.`;
  }, [stats, readYear]);

  const renderSynthesis = () => {
    const yr = YD[stats.py];
    const uy = YD[stats.uy];
    return (
      <div className="space-y-6 relative z-10 animate-in fade-in duration-500 dash-panel active">
        <div className="core-strip">
          <div className="core-chip hl-py">
            <div className="core-chip-label">Personal Year {readYear}</div>
            <div className="core-chip-num">{stats.py}</div>
            <div className="core-chip-name">{yr?.title}</div>
          </div>
          <div className="core-chip">
            <div className="core-chip-label">Life Path</div>
            <div className="core-chip-num" style={{ color: 'var(--cf-jade-bright)' }}>{stats.lp}</div>
            <div className="core-chip-name">{lpName(stats.lp)}</div>
          </div>
          <div className="core-chip">
            <div className="core-chip-label">Universal Year</div>
            <div className="core-chip-num" style={{ color: 'var(--cf-amethyst)' }}>{stats.uy}</div>
            <div className="core-chip-name">{YD[stats.uy]?.title}</div>
          </div>
          <div className="core-chip">
            <div className="core-chip-label">Birth Vibration</div>
            <div className="core-chip-num" style={{ color: '#de78a0' }}>{stats.bv}</div>
            <div className="core-chip-name">{lpName(stats.bv)}</div>
          </div>
        </div>

        {(stats.py === stats.uy || stats.py === stats.bv || stats.py === stats.lp) && (
          <div className="alert-banner visible">
            <AccordionContentWithPlayer text={
              stats.py === stats.uy ? `⚡ Double Amplification: Personal Year ${stats.py} aligns with Universal Year ${stats.uy}. This creates a high-voltage energetic resonance where your personal mission and the collective momentum of the planet are vibrating on the same frequency.` :
              stats.py === stats.bv ? `✦ Core Identity Activation: Personal Year ${stats.py} matches your Birth Vibration ${stats.bv}. It is as if the universe is reflecting your core essence back to you, allowing for an effortless expression of your authentic self.` :
              `✦ Life Path Activation: Personal Year ${stats.py} matches your Life Path ${stats.lp} — a year of destiny alignment. The immediate tasks of this year are in direct service to your overall life mission.`
            } />
          </div>
        )}

        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full space-y-3">
            <AccordionItem value="py-detail" className="border-none bg-white/5 rounded-xl overflow-hidden px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">Active Personal Year</div>
                    <div className="text-sm font-bold text-white">Year ${stats.py}: ${yr.title}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[8px] border-primary/30 text-primary uppercase">{yr.planet}</Badge>
                    <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-400 uppercase">{yr.chakra}</Badge>
                  </div>
                  <AccordionContentWithPlayer text={yr.overview} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="uy-detail" className="border-none bg-white/5 rounded-xl overflow-hidden px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-purple-400" />
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-purple-400/60">Collective Universal Year</div>
                    <div className="text-sm font-bold text-white">Year ${stats.uy}: ${uy.title}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4">
                  <Badge variant="outline" className="text-[8px] border-purple-400/30 text-purple-400 uppercase">{uy.planet}</Badge>
                  <AccordionContentWithPlayer text={uy.overview} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="lp-detail" className="border-none bg-white/5 rounded-xl overflow-hidden px-4">
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60">Soul Path / Life Path</div>
                    <div className="text-sm font-bold text-white">Path ${stats.lp}: ${lpName(stats.lp)}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed italic">Your Life Path represents the core developmental mission of your soul in this incarnation. It is the fixed frequency beneath all temporary annual cycles.</p>
                  <AccordionContentWithPlayer text={PINNACLE_DESC[stats.lp] || "Description not available."} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <Card className="p-6 bg-slate-900/60 border-primary/20">
          <div className="section-header">✦ &nbsp; Your ${readYear} Reading &nbsp; ✦</div>
          <AccordionContentWithPlayer text={oracleText} />
        </Card>
      </div>
    );
  };

  const renderDive = () => {
    const yr = YD[stats.py];
    return (
      <div className="year-deep-dive animate-in fade-in duration-500 relative z-10 dash-panel active">
        <div className="year-dive-header">
          <div className="year-num-big" style={{ color: 'var(--cf-gold)' }}>{stats.py}</div>
          <div className="year-dive-title">{yr.title}</div>
          <div className="year-dive-sub">{yr.phase}</div>
        </div>
        <div className="tab-nav">
          {['ov', 'es', 'py', 've', 'ch', 'ca', 'pr'].map(id => (
            <button key={id} onClick={() => setDiveSubTab(id)} className={`tab-btn ${diveSubTab === id ? 'active' : ''}`}>
              {id === 'ov' ? 'Overview' : id === 'es' ? 'Esoteric' : id === 'py' ? 'Pythagorean' : id === 've' ? 'Vedic' : id === 'ch' ? 'Chinese' : id === 'ca' ? 'Chaldean' : 'Practices'}
            </button>
          ))}
        </div>
        <div className="p-4 min-h-[300px]">
          {diveSubTab === 'pr' ? (
            <div className="practice-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
              {yr.pr.map((p: any, idx: number) => (
                <div key={idx} className="pi p-4 rounded-xl bg-black/40 border border-white/5">
                  <div className="pi-icon text-xl mb-2">{p.i}</div>
                  <div className="pi-name font-cinzel text-[10px] font-black uppercase text-primary/80 mb-1">{p.n}</div>
                  <div className="pi-desc text-xs text-slate-400">{p.d}</div>
                </div>
              ))}
            </div>
          ) : (
            <AccordionContentWithPlayer text={
              diveSubTab === 'ov' ? yr.overview :
              diveSubTab === 'es' ? yr.esoteric :
              diveSubTab === 'py' ? yr.pyth :
              diveSubTab === 've' ? yr.vedic :
              diveSubTab === 'ch' ? yr.chinese :
              yr.chald
            } />
          )}
        </div>
      </div>
    );
  };

  const renderIntersections = () => (
    <div className="space-y-6 animate-in fade-in duration-500 relative z-10 dash-panel active">
      <div className="section-header">🔥 &nbsp; Critical Year Intersections &nbsp; 🔥</div>
      <p className="text-xs text-muted-foreground text-center mb-4 px-4 italic">Years where Personal Years 4 and 7 intersect with your Chinese cycle.</p>
      <div className="space-y-4 px-2">
        {useMemo(() => {
          const list = [];
          for (let y = readYear; y <= readYear + 30; y++) {
            const pyn = reduce(reduce(birthMonth) + reduce(birthDay) + reduce(y));
            if (pyn === 4 || pyn === 7) {
              const yearAni = getAnimalForDate(15, 6, y);
              const iCat = getCategory(stats.birthSign, yearAni);
              const isNegative = iCat === 'clash' || iCat === 'harm' || iCat === 'destruction' || iCat === 'ben';
              const synKey = `${pyn}_${iCat}`;
              const synth = INTERSECTION_SYNTHESIS[synKey] || INTERSECTION_SYNTHESIS[`${pyn}_neutral`].replace('Neutral', yearAni + ' Neutral');
              const dyn = ZOO[stats.birthSign][`${iCat}Desc`] || ZOO[stats.birthSign][`${iCat === 'destruction' ? 'destruction' : iCat}Desc`] || `Personal Year ${pyn}'s discipline proceeds in a ${yearAni} Neutral year — neither amplified by alliance support nor undermined by conflict energy.`;
              list.push({ y, pyn, yearAni, iCat, isNegative, synth, dyn });
            }
          }
          return list;
        }, [stats.birthSign, birthDay, birthMonth, readYear]).map(i => (
          <Card key={i.y} className="intersection-card p-5 border-rose-500/20 bg-rose-950/5">
            <div className="flex justify-between items-start border-b border-rose-500/10 pb-3 mb-4">
              <div>
                <div className="text-2xl font-serif font-bold text-rose-400">{i.y}</div>
                <div className="text-xs font-bold text-white">PY ${i.pyn} · ${i.yearAni} Year ${ZOO[i.yearAni].e}</div>
              </div>
              {i.isNegative && <Badge className="bg-rose-500 text-[8px] px-2 py-0">HIGH TENSION</Badge>}
            </div>
            <div className="space-y-4">
              <AccordionContentWithPlayer text={`${i.synth}\n\nSpecific dynamics: ${i.dyn}`} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderZodiac = () => (
    <div className="space-y-8 py-4 animate-in fade-in duration-500 relative z-10 dash-panel active">
      <div className="text-center px-4">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-2xl">{ZOO[stats.birthSign].e}</span>
          <h2 className="text-xl font-bold tracking-[0.3em] uppercase text-primary font-cinzel">Your {stats.birthSign} Zodiac</h2>
          <span className="text-2xl">{ZOO[stats.birthSign].e}</span>
        </div>
        <div className="cp text-lg leading-relaxed text-slate-300 max-w-2xl mx-auto mb-8 font-body">
          <AccordionContentWithPlayer text={`Born in a ${stats.birthSign} year — ${ZOO[stats.birthSign].el} element, Branch ${ZOO[stats.birthSign].br}. Nature: ${ZOO[stats.birthSign].trait}. Health: ${ZOO[stats.birthSign].organ}.`} />
        </div>
      </div>
      <div className="zodiac-grid grid grid-cols-2 md:grid-cols-4 gap-3">
        {useMemo(() => {
          const list = [];
          for (let y = readYear; y <= readYear + 11; y++) {
            const yearAni = getAnimalForDate(15, 6, y);
            const zCat = getCategory(stats.birthSign, yearAni);
            const pyn = reduce(reduce(birthMonth) + reduce(birthDay) + reduce(y));
            const age = y - birthYear;
            list.push({ y, yearAni, zCat, pyn, age });
          }
          return list;
        }, [stats.birthSign, birthDay, birthMonth, birthYear, readYear]).map(item => {
          const isCritical = item.pyn === 4 || item.pyn === 7;
          const isEnemy = item.zCat === 'clash' || item.zCat === 'harm' || item.zCat === 'destruction';
          return (
            <div 
              key={item.y} 
              onClick={() => setSelectedZodiacYear(item)}
              className={`zc flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.03] ${
                isEnemy && isCritical ? 'border-rose-500 bg-rose-950/20' : 'border-white/10'
              }`}
            >
              <div className="text-3xl mb-2">{ZOO[item.yearAni].e}</div>
              <div className="text-xs font-bold text-white font-cinzel">{item.y}</div>
              <div className="text-lg font-black" style={{ color: pyColors[item.pyn] }}>PY {item.pyn}</div>
              <div className="text-[9px] uppercase font-bold text-muted-foreground">{getStatusLabelShort(item.zCat)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderPinnacles = () => {
    const pStages = [
      { n: 1, p: stats.p1, c: stats.c1, label: `Birth - Age ${stats.p1end}`, active: stats.age <= stats.p1end },
      { n: 2, p: stats.p2, c: stats.c2, label: `Age ${stats.p1end+1} - ${stats.p2end}`, active: stats.age > stats.p1end && stats.age <= stats.p2end },
      { n: 3, p: stats.p3, c: stats.c3, label: `Age ${stats.p2end+1} - ${stats.p3end}`, active: stats.age > stats.p2end && stats.age <= stats.p3end },
      { n: 4, p: stats.p4, c: stats.c4, label: `Age ${stats.p3end+1}+`, active: stats.age > stats.p3end }
    ];

    return (
      <div className="space-y-6 animate-in fade-in duration-500 relative z-10 dash-panel active">
        <div className="section-header">◈ &nbsp; Pinnacles & Challenges &nbsp; ◈</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pStages.map(s => (
            <Card key={s.n} className={`p-5 border rounded-2xl ${s.active ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'bg-slate-900/40 border-white/5'}`}>
              <div className="flex justify-between items-center mb-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{s.label}</div>
                {s.active && <Badge className="bg-primary text-[8px] py-0 px-2">ACTIVE</Badge>}
              </div>
              <div className="flex gap-8 mb-4 justify-center">
                <div className="text-center">
                  <div className="text-4xl font-serif font-bold text-emerald-400">{s.p}</div>
                  <div className="text-[8px] uppercase tracking-widest text-muted-foreground">Pinnacle</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-serif font-bold text-rose-400">{s.c}</div>
                  <div className="text-[8px] uppercase tracking-widest text-muted-foreground">Challenge</div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-slate-300">{PINNACLE_DESC[s.p]}</p>
                <p className="text-[11px] italic text-rose-300/80">Challenge: {CHALLENGE_DESC[s.c]}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="cosmic-fate-root relative min-h-screen rounded-3xl overflow-hidden">
      <div id="stars-cf"></div>
      <div className="cf-page p-4">
        <div className="cf-hero">
          <span className="hero-glyph">🌌</span>
          <h1>Cosmic Fate Map</h1>
          <p className="hero-sub">Destiny Synthesis & Critical Year Oracle</p>
        </div>

        <Card className="calc-card p-6 bg-slate-950/80 mb-8 border-primary/30 shadow-2xl relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Temporal Focus</label>
                <div className="text-2xl font-bold text-white font-cinzel">Year {readYear}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                value={readYear} 
                onChange={(e) => setReadYear(parseInt(e.target.value) || new Date().getFullYear())}
                className="w-28 bg-black/40 border-white/10 font-bold text-lg text-center"
                min={1900} max={2100}
              />
              <button 
                onClick={() => setReadYear(new Date().getFullYear())}
                className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
              >
                Today
              </button>
            </div>
          </div>
        </Card>

        <nav className="dash-nav grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1 mb-6 relative z-20">
          {[
            { id: 'synthesis', label: '✦ Oracle', icon: <Star className="h-3 w-3" /> },
            { id: 'yeardive', label: '☽ Dive', icon: <Compass className="h-3 w-3" /> },
            { id: 'intersections', label: '🔥 Critical', icon: <Zap className="h-3 w-3" /> },
            { id: 'zodiac', label: '☯ Zodiac', icon: <BookOpen className="h-3 w-3" /> },
            { id: 'pinnacles', label: '◈ Pinnacle', icon: <Activity className="h-3 w-3" /> },
            { id: 'convergence', label: '⚠ Enemy', icon: <ShieldAlert className="h-3 w-3" /> },
            { id: 'scanner', label: '🔭 Scan', icon: <Telescope className="h-3 w-3" /> },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`dash-tab flex items-center justify-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <div className="dash-body p-6 min-h-[600px]">
          {activeTab === 'synthesis' && renderSynthesis()}
          {activeTab === 'yeardive' && renderDive()}
          {activeTab === 'intersections' && renderIntersections()}
          {activeTab === 'zodiac' && renderZodiac()}
          {activeTab === 'pinnacles' && renderPinnacles()}
          {activeTab === 'scanner' && <CosmicRiskScanner targetYear={readYear} />}
          {activeTab === 'convergence' && (
            <div className="space-y-6 animate-in fade-in duration-500 relative z-10 dash-panel active">
              <div className="section-header">⚠ &nbsp; Enemy Year Dynamics &nbsp; ⚠</div>
              <div className="space-y-8">
                {CONVERGENCE_CARDS.map(c => (
                  <Card key={c.year} className="conv-card border-rose-500/20 bg-rose-950/5 overflow-hidden">
                    <div className="p-6 bg-rose-500/10 border-b border-rose-500/20">
                      <div className="text-2xl font-bold text-rose-400">{c.title}</div>
                      <div className="text-sm italic text-muted-foreground">{c.sub}</div>
                    </div>
                    <div className="p-6 space-y-6">
                      <AccordionContentWithPlayer text={c.intro} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {c.chips.map((chip, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5">
                            <div className="text-[10px] font-black uppercase text-rose-400 mb-2">{chip.t}</div>
                            <p className="text-xs leading-relaxed text-slate-300">{chip.p}</p>
                          </div>
                        ))}
                      </div>
                      <div className="wbox p-4 rounded-r-xl text-sm italic border-l-4 border-rose-500 bg-rose-500/5">
                        <AccordionContentWithPlayer text={c.warning} />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedZodiacYear} onOpenChange={() => setSelectedZodiacYear(null)}>
        {selectedZodiacYear && (
          <DialogContent className="max-w-2xl bg-slate-950 border-primary/20 text-white">
            <DialogHeader>
              <div className="text-6xl mb-4 block text-center">{ZOO[selectedZodiacYear.yearAni].e}</div>
              <DialogTitle className="text-3xl font-bold text-primary text-center mb-2 font-cinzel">
                {selectedZodiacYear.y}: {selectedZodiacYear.yearAni} Year
              </DialogTitle>
              <DialogDescription className="text-xs uppercase tracking-[0.3em] text-center opacity-60 mb-8 font-cinzel text-slate-400">
                {stats.birthSign} × {selectedZodiacYear.yearAni} — {catLabel(selectedZodiacYear.zCat)}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin">
              <div className="p-4 bg-primary/5 border-l-[3px] border-primary rounded-r-lg font-body italic text-sm text-slate-300">
                <AccordionContentWithPlayer text={`${selectedZodiacYear.y} (${selectedZodiacYear.yearAni} Year, Age ${selectedZodiacYear.age}) — Tai Sui: ${catLabel(selectedZodiacYear.zCat)}`} />
              </div>
              <div className="space-y-4">
                <h4 className="font-cinzel text-xs uppercase tracking-widest opacity-60">Your {stats.birthSign.toUpperCase()} in {selectedZodiacYear.yearAni.toUpperCase()} Year</h4>
                <div className="font-body text-base leading-relaxed text-slate-200">
                  <AccordionContentWithPlayer text={ZOO[stats.birthSign][`${selectedZodiacYear.zCat}Desc`] || ZOO[stats.birthSign][`${selectedZodiacYear.zCat === 'destruction' ? 'destruction' : selectedZodiacYear.zCat}Desc`] || `This ${selectedZodiacYear.y} ${selectedZodiacYear.yearAni} year is a Neutral period for ${stats.birthSign}.`} />
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-cinzel text-xs uppercase tracking-widest opacity-60">{selectedZodiacYear.yearAni.toUpperCase()} Year Qualities</h4>
                <div className="font-body text-sm text-slate-400">
                  <AccordionContentWithPlayer text={`${ZOO[selectedZodiacYear.yearAni].trait}. Health focus: ${ZOO[selectedZodiacYear.yearAni].organ}. Direction: ${ZOO[selectedZodiacYear.yearAni].dir}.`} />
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
