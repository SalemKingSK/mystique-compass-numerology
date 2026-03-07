'use client';

import React, { useState, useMemo } from 'react';
import { AstroInsightOutput, NumerologyData } from './types';
import { ANIMALS, RELATIONS, CAT_META } from '@/lib/cosmic-fate/constants';
import { YEAR_DESCRIPTIONS } from '@/lib/cosmic-fate/oracle-data';
import { BOOK } from '@/lib/cosmic-fate/book';
import { ZodiacWheel } from './cosmic-fate/zodiac-wheel';
import { PersonalYearChart } from './personal-year-chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { Sparkles, Star, Activity, MapIcon, BookOpen, Clock, CalendarDays, ChevronDown, Info, ShieldAlert } from 'lucide-react';
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
  { id: 'lb', name: 'Library', icon: BookOpen },
];

export function CosmicFateDisplay({ insight, numerology }: { insight: AstroInsightOutput, numerology: NumerologyData }) {
  const [activeTab, setActiveTab] = useState('ov');
  const [selectedCodex, setSelectedCodex] = useState('Rat');
  const [selectedYearData, setSelectedYearData] = useState<any>(null);
  const [activeSubTab, setActiveSubTab] = useState('ov');
  const [readYear, setReadYear] = useState(new Date().getFullYear());
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
              value={readYear}
              onChange={(e) => setReadYear(parseInt(e.target.value) || curYear)}
              className="bg-black/40 border-white/10"
              min={1900}
              max={2100}
            />
            <button 
              onClick={() => setReadYear(curYear)}
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

  const renderYearDive = () => {
    const yr = YEAR_DESCRIPTIONS[currentPY];
    if (!yr) return null;

    const tabs = [
      { id: 'ov', label: 'Overview', content: yr.overview },
      { id: 'py', label: 'Pythagorean', content: yr.pyth },
      { id: 've', label: 'Vedic', content: yr.vedic },
      { id: 'ch', label: 'Chinese', content: yr.chinese },
      { id: 'ca', label: 'Chaldean', content: yr.chald },
    ];

    return (
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-slate-950 border border-primary/20">
          <div className="flex items-end gap-4 mb-4">
            <div className="font-serif text-6xl font-bold text-primary drop-shadow-glow leading-none">{currentPY}</div>
            <div>
              <div className="text-xl font-serif font-semibold text-white mb-1">{yr.title}</div>
              <div className="italic text-xs text-slate-400">{yr.sub}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-wider text-[0.6rem] py-1">{yr.planet}</Badge>
            <Badge variant="outline" className="border-green-500/30 text-green-400 uppercase tracking-wider text-[0.6rem] py-1">{yr.phase}</Badge>
            <Badge variant="outline" className="border-purple-500/30 text-purple-400 uppercase tracking-wider text-[0.6rem] py-1">{yr.chakra}</Badge>
          </div>
          
          <div className="flex flex-wrap gap-1 bg-black/40 p-1 rounded-lg border border-white/5 mb-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex-1 min-w-[80px] px-2 py-2 text-[0.6rem] uppercase tracking-widest font-serif transition-all rounded-md ${activeSubTab === tab.id ? 'bg-primary text-primary-foreground' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <AccordionContentWithPlayer text={tabs.find(t => t.id === activeSubTab)?.content || ''} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {yr.pr.map((p: any, i: number) => (
            <Card key={i} className="p-4 bg-black/40 border-white/5 flex gap-4">
              <div className="text-2xl">{p.i}</div>
              <div>
                <div className="font-serif text-[0.65rem] tracking-widest uppercase text-primary mb-1">{p.n}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{p.d}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderZodiacGrid = () => {
    const years = [];
    for (let y = curYear; y < curYear + 12; y++) {
      const ya = getSign(y);
      const cat = getRel(ya.n);
      const pyNum = getPY(d, m, y);
      const isCrit = pyNum === 4 || pyNum === 7;
      const isEnemy = ['clash', 'harm', 'destroy'].includes(cat);
      let dangerLevel = 0;
      if (isEnemy && isCrit) dangerLevel = 4;
      else if (cat === 'self' && isCrit) dangerLevel = 3;
      else if (isEnemy) dangerLevel = 2;
      else if (isCrit) dangerLevel = 1;

      years.push({ year: y, animal: ya, cat, pyNum, dangerLevel });
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {years.map((y, i) => (
            <Card 
              key={i}
              className={`p-4 text-center border-2 transition-all ${
                y.dangerLevel === 4 ? 'border-rose-500 bg-rose-950/20' :
                y.dangerLevel === 3 ? 'border-amber-500 bg-amber-950/20' :
                'border-primary/10 bg-slate-900/40'
              }`}
            >
              <div className="text-3xl mb-2">{y.animal.e}</div>
              <div className="font-serif text-lg font-bold text-white">{y.year}</div>
              <div className="font-serif text-xs text-primary mb-1">PY {y.pyNum}</div>
              <div className="text-[0.6rem] uppercase tracking-widest opacity-60 mb-2">{catLabel(y.cat)}</div>
              {y.dangerLevel > 0 && (
                <Badge variant="destructive" className="text-[0.5rem] py-0 px-2 h-4">
                  {y.dangerLevel === 4 ? '⚠ Critical Convergence' : y.dangerLevel === 3 ? '⚠ High Resonance' : '◈ Critical'}
                </Badge>
              )}
            </Card>
          ))}
        </div>

        <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
          <Table>
            <TableHeader className="bg-slate-900/80">
              <TableRow>
                <TableHead className="text-[10px] uppercase font-black">Year</TableHead>
                <TableHead className="text-[10px] uppercase font-black">Animal</TableHead>
                <TableHead className="text-[10px] uppercase font-black">PY</TableHead>
                <TableHead className="text-[10px] uppercase font-black">Bond</TableHead>
                <TableHead className="text-[10px] uppercase font-black">Convergence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {years.map((y) => {
                const isT = y.pyNum === 4 || y.pyNum === 7;
                const isE = ['clash', 'harm', 'destroy', 'self'].includes(y.cat);
                return (
                  <TableRow key={y.year} className="border-white/5 hover:bg-white/5">
                    <TableCell className={`font-black text-sm ${y.year === readYear ? 'text-primary' : 'text-white'}`}>{y.year}</TableCell>
                    <TableCell className="text-xs">{y.animal.e} {y.animal.n}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black border ${isT ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-white/60'}`}>{y.pyNum}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" style={{ color: catColor(y.cat), borderColor: catColor(y.cat) + '44' }}>{catLabel(y.cat).split(' ')[0]}</Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-bold">
                      {isT && isE ? <span className="text-rose-500">⚡ Trough+Hostile</span> : isT ? <span className="text-amber-500">◎ Trough</span> : <span className="text-muted-faint">—</span>}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderLibrary = () => {
    return (
      <div className="space-y-8">
        <section>
          <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest mb-4">Sign Encyclopedia</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {ANIMALS.map(a => {
              const isDoc = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake'].includes(a.n);
              return (
                <button
                  key={a.n}
                  onClick={() => isDoc && setSelectedCodex(a.n)}
                  className={`p-4 rounded-xl border-2 transition-all ${selectedCodex === a.n ? 'border-primary bg-primary/10' : 'border-primary/10 bg-slate-900/40'} ${!isDoc && 'opacity-40 cursor-default'}`}
                >
                  <div className="text-3xl mb-1">{a.e}</div>
                  <div className="text-[0.6rem] uppercase tracking-widest text-white">{a.n}</div>
                  {!isDoc && <Clock className="h-3 w-3 mx-auto mt-1 opacity-50" />}
                </button>
              );
            })}
          </div>
          {selectedCodex && (
            <Card className="p-6 bg-black/60 border border-primary/20 shadow-2xl">
              <div className="text-3xl mb-6 text-primary font-serif">{selectedCodex} Chapter</div>
              <div className="space-y-6">
                {['self', 'clash', 'harm', 'destroy', 'alliance', 'neutral'].map(key => {
                  const content = (BOOK.animals as any)[selectedCodex]?.[key];
                  if (!content) return null;
                  return (
                    <div key={key}>
                      <div className="text-primary uppercase tracking-[0.2em] text-[0.65rem] mb-2 border-b border-primary/10 pb-1 font-bold">{key.replace('_', ' ')}</div>
                      <AccordionContentWithPlayer text={content} />
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </section>

        <div className="sep h-[1px] bg-white/10 my-10" />

        <section>
          <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest mb-4">The Six Categories — Foundation</h3>
          <div className="space-y-4">
            {Object.entries(BOOK.foundation).map(([key, text]) => (
              <Card key={key} className="p-6 bg-slate-900/40 border border-primary/10">
                <div className="font-serif text-[0.65rem] tracking-widest uppercase text-primary mb-4 font-bold">{key.replace('_', ' ')} Principles</div>
                <AccordionContentWithPlayer text={text as string} />
              </Card>
            ))}
          </div>
        </section>
      </div>
    );
  };

  const renderDeepRead = () => {
    const bookSign = (BOOK.animals as any)[birthSign];
    return (
      <div className="space-y-6">
        <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest">Verbatim Reading — {birthSign}</h3>
        {bookSign ? (
          <div className="space-y-6">
            {['self', 'clash', 'harm', 'destroy', 'alliance', 'neutral'].map(key => {
              const content = bookSign[key];
              if (!content) return null;
              return (
                <Card key={key} className="p-6 bg-slate-900/40 border border-primary/10">
                  <div className="font-serif text-[0.65rem] text-primary mb-4 uppercase tracking-widest font-bold">{key.replace('_', ' ')} Year Dynamics</div>
                  <AccordionContentWithPlayer text={content} />
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-6 bg-slate-900/40 border border-primary/10 border-l-4 border-l-primary">
            <p className="text-sm text-slate-300 leading-relaxed mb-4 italic">
              Your sign ({birthSign}) is fully calculable through the relational system. Below is a derived analysis from your primary source partners.
            </p>
            <div className="space-y-8">
              {Object.entries(RELATIONS[birthSign]).map(([type, name]) => {
                const names = Array.isArray(name) ? name : [name];
                return names.map(targetName => {
                  const partnerBook = (BOOK.animals as any)[targetName];
                  if (!partnerBook || !partnerBook.self) return null;
                  return (
                    <div key={`${type}-${targetName}`} className="space-y-2">
                      <div className="text-primary uppercase tracking-[0.2em] text-[0.65rem] font-bold border-b border-white/10 pb-1">
                        Relation: {type} × Partner: {targetName}
                      </div>
                      <AccordionContentWithPlayer text={partnerBook.self} />
                    </div>
                  );
                });
              })}
            </div>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 font-serif">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
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
          </div>
        )}

        {activeTab === 'dv' && (
          <div className="space-y-6 pb-20">
            {renderYearDive()}
          </div>
        )}

        {activeTab === 'wh' && (
          <div className="space-y-6 pb-10">
            <section className="text-center">
              <h3 className="text-primary font-bold text-lg mb-4 font-serif uppercase tracking-widest">Celestial Bond Wheel</h3>
              <ZodiacWheel birthSign={birthSign} />
            </section>
            <div className="space-y-4">
              <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest border-b border-white/10 pb-2">Relation Dynamics</h3>
              {Object.entries(RELATIONS[birthSign]).map(([type, name]) => {
                const names = Array.isArray(name) ? name : [name];
                return names.map(targetName => {
                  const cm = (CAT_META as any)[type] || (CAT_META as any).neutral;
                  const bookSign = (BOOK.animals as any)[birthSign];
                  const bookText = bookSign ? bookSign[type] : (BOOK.foundation as any)[type] || (BOOK.foundation as any).alliance;
                  return (
                    <Card key={`${type}-${targetName}`} className="p-6 bg-slate-900/40 border border-primary/10">
                      <div className="flex justify-between items-center mb-4">
                        <div className="font-serif text-[0.65rem] text-primary uppercase tracking-widest font-bold">Bond: {type} × {targetName}</div>
                        <Badge variant="outline" style={{ color: catColor(type), borderColor: catColor(type) + '44' }}>{cm.label}</Badge>
                      </div>
                      <AccordionContentWithPlayer text={bookText} />
                    </Card>
                  );
                });
              })}
            </div>
          </div>
        )}

        {activeTab === 'cy' && (
          <div className="space-y-6 pb-10">
            <PersonalYearChart
              birthDay={d}
              birthMonth={m}
              birthYear={by}
              onYearSelect={setSelectedYearData}
            />
            <AnimatePresence>
              {selectedYearData && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                  <Card className="p-8 bg-gradient-to-br from-slate-900 to-black border-l-4 border-primary shadow-2xl">
                    <h4 className="font-serif text-2xl text-primary mb-4 flex items-center gap-3">
                      <Star className="h-6 w-6" /> Year {selectedYearData.year} · Personal Year {selectedYearData.pyn}
                    </h4>
                    <AccordionContentWithPlayer text={selectedYearData.meaning} />
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {activeTab === 'mp' && (
          <div className="space-y-6 pb-10">
            {renderZodiacGrid()}
          </div>
        )}

        {activeTab === 'lb' && (
          <div className="space-y-6 pb-10">
            {renderLibrary()}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
