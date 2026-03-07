'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AstroInsightOutput, NumerologyData } from './types';
import { ANIMALS, RELATIONS, CAT_META, LIFESTAGES, TAISUI } from '@/lib/cosmic-fate/constants';
import { YEAR_DESCRIPTIONS, PINNACLE_MEANINGS, CHALLENGE_MEANINGS } from '@/lib/cosmic-fate/oracle-data';
import { ANIMAL_ENEMY_DESCRIPTIONS } from '@/lib/cosmic-fate/animal-descriptions';
import { BOOK } from '@/lib/cosmic-fate/book';
import { ZodiacWheel } from './cosmic-fate/zodiac-wheel';
import { PersonalYearChart } from './personal-year-chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { Sparkles, Star, Activity, MapIcon, BookOpen, Clock, CalendarDays, ChevronDown, Info, ShieldAlert, Users, Layers, Compass, Wand2, BookUser, History, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TABS = [
  { id: 'ov', name: 'Oracle', icon: Sparkles },
  { id: 'dv', name: 'Year Dive', icon: Info },
  { id: 'wh', name: 'Wheel', icon: Star },
  { id: 'cy', name: 'Cycles', icon: Activity },
  { id: 'mp', name: 'Fate Map', icon: MapIcon },
  { id: 'dr', name: 'Deep Read', icon: BookOpen },
  { id: 'co', name: 'Codex', icon: BookUser },
  { id: 'rf', name: 'Ref', icon: Layers },
];

export function CosmicFateDisplay({ insight, numerology }: { insight: AstroInsightOutput, numerology: NumerologyData }) {
  const [activeTab, setActiveTab] = useState('ov');
  const [selectedCodex, setSelectedCodex] = useState('Rat');
  const [readYear, setReadYear] = useState(new Date().getFullYear());
  const [yearInput, setYearInput] = useState(new Date().getFullYear().toString());
  const [isYearSelectorOpen, setIsYearSelectorOpen] = useState(false);

  const { birthDay: d, birthMonth: m, birthYear: by } = numerology;
  const birthSign = insight.sign;
  const curYear = new Date().getFullYear();

  // --- HELPERS ---
  const reduce = (n: number): number => {
    let s = n;
    while (s > 9) s = String(s).split('').reduce((a, b) => a + parseInt(b), 0);
    return s || 9;
  };

  const getPY = (day: number, mon: number, year: number) => reduce(reduce(day) + reduce(mon) + reduce(year));
  
  const getSign = (y: number) => {
    const index = ((y - 1900) % 12 + 12) % 12;
    return ANIMALS[index] || ANIMALS[0];
  };

  const getRel = (ysName: string) => {
    const r = RELATIONS[birthSign];
    if (!r) return 'neutral';
    if (ysName === r.clash) return 'clash';
    if (ysName === r.harm) return 'harm';
    if (ysName === r.destroy) return 'destroy';
    if (ysName === r.self) return 'self';
    if (r.sanhe.includes(ysName)) return 'sanhe';
    if (ysName === r.liuhe) return 'liuhe';
    return 'neutral';
  };

  const catLabel = (c: string) => {
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
      'self': 'var(--primary)',
      'clash': 'var(--destructive)',
      'harm': '#d08028',
      'destroy': '#9858b8',
      'sanhe': '#34d399',
      'liuhe': '#e040fb',
      'neutral': 'var(--muted-foreground)'
    };
    return colors[c] || 'var(--foreground)';
  };

  // --- DERIVED NUMEROLOGY ---
  const LP = useMemo(() => reduce(reduce(m) + reduce(d) + reduce(by)), [d, m, by]);
  const currentPY = useMemo(() => getPY(d, m, readYear), [d, m, readYear]);
  const currentUY = useMemo(() => reduce(readYear), [readYear]);
  const pmNames = ['', 'New Beginnings', 'Cooperation', 'Creativity', 'Foundation', 'Freedom', 'Harmony', 'Reflection', 'Power', 'Completion'];
  const today = new Date();
  const currentMonth = readYear === today.getFullYear() ? today.getMonth() + 1 : 1;
  const PM = useMemo(() => reduce(currentPY + currentMonth), [currentPY, currentMonth]);
  const lpName = (n: number) => ['', 'The Initiator', 'The Cooperative', 'The Creative', 'The Builder', 'The Freedom Seeker', 'The Harmonizer', 'The Seeker', 'The Achiever', 'The Humanitarian'][n] || '';

  // --- RENDERERS ---
  const renderYearSelector = () => (
    <Collapsible
      open={isYearSelectorOpen}
      onOpenChange={setIsYearSelectorOpen}
      className="w-full glass-card p-4 border-primary/20"
    >
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full text-primary font-bold uppercase tracking-widest text-sm">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Reading Focus: {readYear}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isYearSelectorOpen ? 'rotate-180' : ''}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="read-year" className="text-[10px] uppercase tracking-wider text-muted-foreground">Select Year to Cast</Label>
          <div className="flex gap-2">
            <Input
              id="read-year"
              type="number"
              value={yearInput}
              onChange={(e) => {
                setYearInput(e.target.value);
                const val = parseInt(e.target.value);
                if (val >= 1900 && val <= 2100) {
                  setReadYear(val);
                }
              }}
              className="bg-black/40 border-white/10"
              min={1900}
              max={2100}
            />
            <button 
              onClick={() => {
                setReadYear(curYear);
                setYearInput(curYear.toString());
              }}
              className="px-4 py-2 bg-primary/20 border border-primary/30 rounded-md text-xs font-bold hover:bg-primary/30 transition-colors"
            >
              Current
            </button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  const renderSynthesis = () => {
    const yr = YEAR_DESCRIPTIONS[currentPY];
    const yearAnimal = getSign(readYear);
    const cat = getRel(yearAnimal.n);
    const catLabelStr = catLabel(cat);
    
    const tension = (currentPY===4 && (LP===5||LP===3)) || (currentPY===7 && (LP===1||LP===6));
    const harmony = (currentPY===LP) || (currentPY===currentUY);

    const animalLine = `Your ${birthSign} nature meets a ${yearAnimal.n} year (${catLabelStr}) — ${ 
      cat==='clash'?'an environment of maximum elemental friction calling for proactive adaptation rather than resistance': 
      cat==='harm'?'a year of concealed pressures requiring extra vigilance in trust and documentation': 
      cat==='destroy'?'a year when outdated structures may fracture, clearing ground for what genuinely serves you': 
      cat==='self'?'your identity year, when all your characteristic patterns amplify to their fullest expression': 
      ['sanhe','liuhe'].includes(cat)?'an environmentally supported year where the collective field actively favours your initiatives': 
      'a neutral year where outcomes reflect pure personal effort rather than exceptional external forces'
    }.`;

    const convergeLine = tension
      ? `Your Life Path ${LP} (${lpName(LP)}) creates notable friction with Personal Year ${currentPY}'s demands — a soul-level tension with specific lessons.`
      : harmony
      ? `A significant harmonic: your Personal Year ${currentPY} resonates with another core number in your chart — an amplification point for ${yr?.title.toLowerCase()} themes.`
      : `Your Life Path ${LP} and Personal Year ${currentPY} are in productive dialogue, allowing this year's work to proceed through genuine effort.`;

    const synthText = `In ${readYear}, you are in a Personal Year ${currentPY} — ${yr?.title}, riding the ${yr?.phase.toLowerCase()} phase of your nine-year cycle. The Universal Year ${currentUY} (${YEAR_DESCRIPTIONS[currentUY]?.title}) sets the collective backdrop. Your current Personal Month is ${PM} (${pmNames[PM]}). ${animalLine} ${convergeLine}`;

    return (
      <Card className="p-6 bg-slate-900/60 border border-primary/20">
        <h4 className="font-serif text-[0.65rem] tracking-[0.3em] uppercase text-primary/80 mb-4">✦ Oracle Synthesis</h4>
        <AccordionContentWithPlayer text={synthText} />
      </Card>
    );
  };

  const renderConvergences = () => {
    const ENEMY = ['clash', 'harm', 'destroy', 'self'];
    const range = 20;
    const hits = [];
    for (let y = curYear; y < curYear + range; y++) {
      const p = getPY(d, m, y);
      const ys = getSign(y);
      const rt = getRel(ys.n);
      if ((p === 4 || p === 7) && ENEMY.includes(rt)) {
        hits.push({ y, p, ys, rt });
      }
    }

    if (!hits.length) return <p className="text-muted-foreground italic text-sm p-4">No critical convergences detected in the next 20 years.</p>;

    return (
      <div className="space-y-4">
        {hits.map((h, i) => {
          const cm = CATM[h.rt];
          const pi = YEAR_DESCRIPTIONS[h.p];
          const ba = ANIMAL_ENEMY_DESCRIPTIONS[birthSign];
          
          let narrative = '';
          if (h.p === 4) {
            if (h.rt === 'clash') narrative = `This is the most challenging configuration: PY 4's discipline collides with Direct Clash disruption. ${ba?.clashDesc || ''}`;
            else if (h.rt === 'harm') narrative = `PY 4's building meets Harm's concealed erosion. ${ba?.harmDesc || ''}`;
            else if (h.rt === 'destroy') narrative = `PY 4's foundations meet Destruction's fragmentation. ${ba?.destDesc || ''}`;
            else if (h.rt === 'self') narrative = `PY 4's demand meets Ben Ming Nian's amplification. ${ba?.benDesc || ''}`;
          } else {
            if (h.rt === 'clash') narrative = `PY 7's retreat meets Clash's external pressure. ${ba?.clashDesc || ''}`;
            else if (h.rt === 'harm') narrative = `PY 7's solitude meets Harm's trust violation. ${ba?.harmDesc || ''}`;
            else if (h.rt === 'destroy') narrative = `PY 7's dissolution meets Destruction's fragmentation. ${ba?.destDesc || ''}`;
            else if (h.rt === 'self') narrative = `PY 7's inward turn meets Ben Ming Nian's identity amplification. ${ba?.benDesc || ''}`;
          }

          return (
            <Card key={i} className={`p-6 border-l-4 ${h.rt === 'clash' || h.rt === 'self' ? 'border-rose-500 bg-rose-950/10' : 'border-amber-500 bg-amber-950/10'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="text-2xl font-bold font-serif text-primary">{h.y}</div>
                <Badge style={{ backgroundColor: catColor(h.rt) }}>{catLabel(h.rt)}</Badge>
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Personal Year {h.p} · {h.ys.e} {h.ys.n} Year</div>
              <AccordionContentWithPlayer text={narrative} />
            </Card>
          );
        })}
      </div>
    );
  };

  const renderZodiacMap = () => {
    const years = [];
    for (let y = curYear; y < curYear + 12; y++) {
      const ya = getSign(y);
      const cat = getRel(ya.n);
      const pyNum = getPY(d, m, y);
      const isCrit = pyNum === 4 || pyNum === 7;
      const isPeak = pyNum === 1 || pyNum === 9;
      const isClash = cat === 'clash';
      const isAlliance = ['sanhe', 'liuhe'].includes(cat);

      let rowClass = 'bg-black/40';
      let confluence = 'Neutral';
      if (isClash && isCrit) {
        rowClass = 'bg-rose-950/30 border-rose-500 text-rose-200';
        confluence = '⚡ Critical Tension';
      } else if (isAlliance && isPeak) {
        rowClass = 'bg-emerald-950/30 border-emerald-500 text-emerald-200';
        confluence = '✦ Fortunate Peak';
      } else if (isCrit) {
        rowClass = 'bg-amber-950/20 border-amber-500/30';
        confluence = '◈ Trough Window';
      } else if (isAlliance) {
        rowClass = 'bg-indigo-950/20 border-indigo-500/30';
        confluence = '✓ Supported';
      }

      years.push({ year: y, animal: ya, cat, py: pyNum, rowClass, confluence });
    }

    return (
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-primary border-b border-white/5">
              <th className="p-4 text-left">Year</th>
              <th className="p-4 text-left">Sign</th>
              <th className="p-4 text-left">Bond</th>
              <th className="p-4 text-left">PY</th>
              <th className="p-4 text-left">Confluence</th>
            </tr>
          </thead>
          <tbody>
            {years.map((y, i) => (
              <tr 
                key={i} 
                className={`border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5 ${y.rowClass}`}
                onClick={() => {
                  const ba = ANIMAL_ENEMY_DESCRIPTIONS[birthSign];
                  const pi = YEAR_DESCRIPTIONS[y.py];
                  const catTxt = y.cat === 'neutral' ? 'Neutral Year' : catLabel(y.cat);
                  const bodyText = `In ${y.year}, your ${birthSign} nature interacts with the ${y.animal.n} year in a ${catTxt} configuration. This occurs during your Personal Year ${y.py} (${pi?.title}). ${y.confluence.includes('Tension') ? 'This is a period of high pressure requiring disciplined restraint.' : ''}`;
                  // We use a simple logic here to show the popover in the original code's style
                  alert(`${y.year} Analysis:\n\n${bodyText}`);
                }}
              >
                <td className="p-4 font-bold">{y.year}</td>
                <td className="p-4">{y.animal.e} {y.animal.n}</td>
                <td className="p-4"><Badge variant="outline" style={{ borderColor: catColor(y.cat) + '44', color: catColor(y.cat) }}>{catLabel(y.cat).split(' ')[0]}</Badge></td>
                <td className="p-4"><span className={`inline-block w-6 h-6 rounded-full text-center leading-6 text-[10px] font-bold ${y.py === 4 || y.py === 7 ? 'bg-rose-500/20 text-rose-400' : 'bg-primary/20 text-primary'}`}>{y.py}</span></td>
                <td className="p-4 text-[10px] font-bold uppercase tracking-tighter">{y.confluence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderDeepRead = () => {
    const bookSign = (BOOK.animals as any)[birthSign];
    return (
      <div className="space-y-6">
        <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest">Verbatim Reading — {birthSign}</h3>
        {bookSign ? (
          <div className="space-y-4">
            {['self', 'clash', 'harm', 'destroy', 'alliance', 'neutral'].map(key => {
              const content = bookSign[key];
              if (!content) return null;
              return (
                <Accordion key={key} type="single" collapsible>
                  <AccordionItem value={key} className="glass-card px-4 border-0">
                    <AccordionTrigger className="uppercase text-[10px] tracking-widest font-bold">{key} Dynamic</AccordionTrigger>
                    <AccordionContent>
                      <AccordionContentWithPlayer text={content} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            })}
          </div>
        ) : (
          <Card className="p-6 bg-slate-900/40 border border-primary/10 border-l-4 border-l-primary">
            <p className="text-sm text-slate-300 leading-relaxed mb-4 italic">
              Derived analysis from primary source partners.
            </p>
            <div className="space-y-4">
              {Object.entries(RELATIONS[birthSign]).map(([type, name]) => {
                const names = Array.isArray(name) ? name : [name];
                return names.map(targetName => {
                  const partnerBook = (BOOK.animals as any)[targetName];
                  if (!partnerBook || !partnerBook.self) return null;
                  return (
                    <Accordion key={`${type}-${targetName}`} type="single" collapsible>
                      <AccordionItem value={`${type}-${targetName}`} className="glass-card px-4 border-0">
                        <AccordionTrigger className="uppercase text-[10px] tracking-widest font-bold">{type} × {targetName}</AccordionTrigger>
                        <AccordionContent>
                          <AccordionContentWithPlayer text={partnerBook.self} />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                });
              })}
            </div>
          </Card>
        )}
        
        <div className="div h-[1px] bg-white/10 my-8" />
        <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest">Life-Age Recurrence Map</h3>
        <div className="tl-wrap border-l-2 border-primary/20 ml-4 pl-6 space-y-6">
          {Object.entries(LIFESTAGES).map(([age, label]) => {
            const evYr = by + parseInt(age);
            if (evYr < curYear) return null; // Only show future stages
            return (
              <div key={age} className="relative">
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-primary/40 border-2 border-primary" />
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Age {age} · {evYr}</div>
                <div className="text-sm font-serif text-white">{label}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderRef = () => (
    <div className="space-y-8">
      <div className="pymg">
        {YEAR_DESCRIPTIONS && [1,2,3,4,5,6,7,8,9].map(n => {
          const p = YEAR_DESCRIPTIONS[n];
          return (
            <Card key={n} className={`p-4 bg-black/40 border-primary/10 ${n === 4 || n === 7 ? 'border-rose-500/30 bg-rose-950/5' : ''}`}>
              <div className="text-3xl font-bold text-primary mb-1">{n}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{p.title}</div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">{p.desc}</p>
              <div 
                className="text-[9px] uppercase font-bold text-primary cursor-pointer hover:underline"
                onClick={() => setActiveTab('dv')}
              >
                Deep Dive →
              </div>
            </Card>
          );
        })}
      </div>
      
      <div className="div h-[1px] bg-white/10 my-8" />
      
      <section>
        <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest mb-4">Six Categories - Foundation</h3>
        <div className="space-y-4">
          {['ben_ming', 'clash', 'harm', 'destroy', 'alliance', 'neutral'].map(key => (
            <Accordion key={key} type="single" collapsible>
              <AccordionItem value={key} className="glass-card px-4 border-0">
                <AccordionTrigger className="uppercase text-[10px] tracking-widest font-bold">{(BOOK.foundation as any)[key].split('\n')[0]}</AccordionTrigger>
                <AccordionContent>
                  <AccordionContentWithPlayer text={(BOOK.foundation as any)[key]} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </section>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 font-serif max-w-full overflow-x-hidden">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[85px] p-3 rounded-xl transition-all duration-300 border ${
              activeTab === tab.id 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-black/40 text-slate-500 border-white/5 hover:border-primary/20'
            }`}
          >
            <tab.icon className="h-5 w-5 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-tight">{tab.name}</span>
          </button>
        ))}
      </div>

      <ScrollArea className="h-[700px] pr-4">
        {activeTab === 'ov' && (
          <div className="space-y-6 pb-20">
            {renderYearSelector()}
            {renderSynthesis()}
            <div className="div h-[1px] bg-white/10 my-4" />
            <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest">Critical Convergences</h3>
            {renderConvergences()}
          </div>
        )}

        {activeTab === 'dv' && (
          <div className="space-y-6 pb-20">
            {YEAR_DESCRIPTIONS[currentPY] && (
              <div className="year-deep-dive">
                <div className="p-6 bg-gradient-to-br from-primary/20 to-black rounded-2xl border border-primary/20 mb-6">
                  <div className="year-num-big text-6xl font-bold text-primary mb-2">{currentPY}</div>
                  <div className="text-2xl font-bold text-white mb-1">{YEAR_DESCRIPTIONS[currentPY].title}</div>
                  <div className="text-sm italic text-muted-foreground mb-4">{YEAR_DESCRIPTIONS[currentPY].sub}</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{YEAR_DESCRIPTIONS[currentPY].planet}</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => setActiveTab('rf')}>{YEAR_DESCRIPTIONS[currentPY].phase}</Badge>
                    <Badge variant="outline">{YEAR_DESCRIPTIONS[currentPY].chakra}</Badge>
                  </div>
                </div>
                <AccordionContentWithPlayer text={YEAR_DESCRIPTIONS[currentPY].overview} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'wh' && (
          <div className="space-y-6 pb-10">
            <section className="text-center">
              <h3 className="text-primary font-bold text-lg mb-4 font-serif uppercase tracking-widest">Celestial Bond Wheel</h3>
              <ZodiacWheel birthSign={birthSign} />
            </section>
          </div>
        )}

        {activeTab === 'cy' && (
          <div className="space-y-6 pb-10">
            <PersonalYearChart
              birthDay={d}
              birthMonth={m}
              birthYear={by}
              onYearSelect={() => {}}
            />
          </div>
        )}

        {activeTab === 'mp' && (
          <div className="space-y-6 pb-10 px-1">
            <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest">12-Year Fate Map</h3>
            {renderZodiacMap()}
          </div>
        )}

        {activeTab === 'dr' && (
          <div className="space-y-6 pb-10">
            {renderDeepRead()}
          </div>
        )}

        {activeTab === 'co' && (
          <div className="space-y-6 pb-10">
            <div className="codex-grid grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {ANIMALS.map(a => {
                const isDoc = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake'].includes(a.n);
                return (
                  <button
                    key={a.n}
                    onClick={() => isDoc && setSelectedCodex(a.n)}
                    className={`p-3 rounded-xl border transition-all ${selectedCodex === a.n ? 'border-primary bg-primary/10' : 'border-white/5 bg-black/40'} ${!isDoc && 'opacity-40'}`}
                  >
                    <div className="text-2xl mb-1">{a.e}</div>
                    <div className="text-[8px] font-bold uppercase tracking-tight">{a.n}</div>
                  </button>
                );
              })}
            </div>
            {selectedCodex && (
              <Card className="p-6 bg-black/60 border-primary/20">
                <h4 className="text-xl font-bold text-primary mb-4">{selectedCodex} Codex</h4>
                <AccordionContentWithPlayer text={(BOOK.animals as any)[selectedCodex]?.self || 'Documentation pending.'} />
              </Card>
            )}
          </div>
        )}

        {activeTab === 'rf' && (
          <div className="space-y-6 pb-10">
            {renderRef()}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
