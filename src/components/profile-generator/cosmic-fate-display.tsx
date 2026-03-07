'use client';

import React, { useState, useMemo } from 'react';
import { AstroInsightOutput, NumerologyData } from './types';
import { ANIMALS, RELATIONS, CAT_META, TAISUI } from '@/lib/cosmic-fate/constants';
import { YEAR_DESCRIPTIONS, PINNACLE_MEANINGS, CHALLENGE_MEANINGS } from '@/lib/cosmic-fate/oracle-data';
import { BOOK } from '@/lib/cosmic-fate/book';
import { ZodiacWheel } from './cosmic-fate/zodiac-wheel';
import { PersonalYearChart } from './personal-year-chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { SpeechPlayer } from './speech-player';
import { Info, Sparkles, MapIcon, Star, Activity, BookOpen, Clock, CalendarDays, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TABS = [
  { id: 'ov', name: 'Overview', icon: Sparkles },
  { id: 'wh', name: 'Wheel', icon: Star },
  { id: 'cy', name: 'Cycles', icon: Activity },
  { id: 'mp', name: 'Map', icon: MapIcon },
  { id: 'dr', name: 'Deep Read', icon: BookOpen },
  { id: 'co', name: 'Codex', icon: Clock },
  { id: 'rf', name: 'Ref', icon: Info },
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
      'destruction': 'Destruction Year 💀',
      'alliance': 'Alliance Year ✅',
      'neutral': 'Neutral Year ◦'
    };
    return labels[c] || 'Neutral Year ◦';
  };

  const catColor = (c: string) => {
    const colors: Record<string, string> = {
      'self': 'var(--primary)',
      'clash': 'var(--destructive)',
      'harm': '#d08028',
      'destruction': '#9858b8',
      'alliance': '#34d399',
      'neutral': 'var(--muted-foreground)'
    };
    return colors[c] || 'var(--foreground)';
  };

  // --- DERIVED NUMEROLOGY ---
  const LP = useMemo(() => reduce(reduce(m) + reduce(d) + reduce(by)), [d, m, by]);
  const BN = useMemo(() => reduce(d), [d]);
  const currentPY = useMemo(() => getPY(d, m, readYear), [d, m, readYear]);
  const currentUY = useMemo(() => reduce(readYear), [readYear]);
  
  const pmNames = ['', 'New Beginnings', 'Cooperation', 'Creativity', 'Foundation', 'Freedom', 'Harmony', 'Reflection', 'Power', 'Completion'];
  const today = new Date();
  const currentMonth = readYear === today.getFullYear() ? today.getMonth() + 1 : 1;
  const PM = useMemo(() => reduce(currentPY + currentMonth), [currentPY, currentMonth]);

  const lpName = (n: number) => ['', 'The Initiator', 'The Cooperative', 'The Creative', 'The Builder', 'The Freedom Seeker', 'The Harmonizer', 'The Seeker', 'The Achiever', 'The Humanitarian'][n] || '';

  // Pinnacles
  const p1 = reduce(reduce(m) + reduce(d));
  const p2 = reduce(reduce(d) + reduce(by));
  const p3 = reduce(p1 + p2);
  const p4 = reduce(reduce(m) + reduce(by));
  const p1end = 36 - LP;
  const p2end = p1end + 9;
  const p3end = p2end + 9;
  const currentAge = readYear - by;

  let activePinnacleNum, pinnacleIdx;
  if(currentAge <= p1end) { activePinnacleNum = p1; pinnacleIdx = 1; }
  else if(currentAge <= p2end) { activePinnacleNum = p2; pinnacleIdx = 2; }
  else if(currentAge <= p3end) { activePinnacleNum = p3; pinnacleIdx = 3; }
  else { activePinnacleNum = p4; pinnacleIdx = 4; }

  // Challenges
  const ch1 = Math.abs(reduce(m) - reduce(d));
  const ch2 = Math.abs(reduce(d) - reduce(by));
  const ch3 = Math.abs(ch1 - ch2);
  const ch4 = Math.abs(reduce(m) - reduce(by));
  let activeChallenge;
  if(currentAge <= p1end) activeChallenge = ch1;
  else if(currentAge <= p2end) activeChallenge = ch2;
  else if(currentAge <= p3end) activeChallenge = ch3;
  else activeChallenge = ch4;

  // --- RENDERERS ---
  const renderYearSelector = () => (
    <Collapsible
      open={isYearSelectorOpen}
      onOpenChange={setIsYearSelectorOpen}
      className="w-full glass-card p-4 border-primary/20 mb-6"
    >
      <CollapsibleTrigger asChild>
        <button className="flex items-center justify-between w-full text-primary font-bold uppercase tracking-widest text-sm">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Temporal Focus: {readYear}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isYearSelectorOpen ? 'rotate-180' : ''}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="read-year" className="text-[10px] uppercase tracking-wider text-muted-foreground">Select Year to Read</Label>
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
              Today
            </button>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground italic">
          Casting your fate map for {readYear}. This will update the Oracle Synthesis and all annual calculations.
        </p>
      </CollapsibleContent>
    </Collapsible>
  );

  const renderSynthesis = () => {
    const yr = YEAR_DESCRIPTIONS[currentPY];
    const yearAnimal = getSign(readYear);
    const cat = getRel(yearAnimal.n);
    const catLabelStr = catLabel(cat);
    
    const tension = (currentPY===4 && (LP===5||LP===3)) || (currentPY===7 && (LP===1||LP===6));
    const harmony = (currentPY===LP) || (currentPY===currentUY) || (currentPY===BN);

    const animalLine = `Your ${birthSign} nature meets a ${yearAnimal.n} year (${catLabelStr}) — ${ 
      cat==='clash'?'an environment of maximum elemental friction calling for proactive adaptation rather than resistance': 
      cat==='harm'?'a year of concealed pressures requiring extra vigilance in trust and documentation': 
      cat==='destruction'?'a year when outdated structures may fracture, clearing ground for what genuinely serves you': 
      cat==='self'?'your identity year, when all your characteristic patterns amplify to their fullest expression': 
      cat==='alliance'?'an environmentally supported year where the collective field actively favours your initiatives': 
      'a neutral year where outcomes reflect pure personal effort rather than exceptional external forces'
    }.`;

    const convergeLine = tension
      ? `Your Life Path ${LP} (${lpName(LP)}) creates notable friction with Personal Year ${currentPY}'s demands — a soul-level tension with specific lessons detailed below.`
      : harmony
      ? `A significant harmonic: your Personal Year ${currentPY} resonates with another core number in your chart — an amplification point for ${yr?.title.toLowerCase()} themes.`
      : `Your Life Path ${LP} and Personal Year ${currentPY} are in productive dialogue, allowing this year's work to proceed through genuine effort.`;

    const synthText = `In ${readYear}, you are in a <strong>Personal Year ${currentPY} — ${yr?.title}</strong>, riding the ${yr?.phase.toLowerCase()} phase of your nine-year cycle. The Universal Year ${currentUY} (${YEAR_DESCRIPTIONS[currentUY]?.title}) sets the collective backdrop. Your current Personal Month is <strong>${PM} (${pmNames[PM]})</strong>. ${animalLine} ${convergeLine} Your active Pinnacle is <strong>${activePinnacleNum}</strong>, while your active Challenge number is <strong>${activeChallenge === 0 ? '0 (The Master Test)' : activeChallenge + ' (' + lpName(activeChallenge) + ')'}</strong>.`;

    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-black/60 border border-primary/20 shadow-xl relative overflow-hidden mb-6">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
        <h4 className="font-serif text-[0.65rem] tracking-[0.3em] uppercase text-primary/80 mb-4">✦ Oracle Synthesis</h4>
        <div id="synth-text" className="text-lg leading-relaxed text-slate-200" dangerouslySetInnerHTML={{ __html: synthText }} />
        <div className="mt-4">
          <SpeechPlayer 
            text={synthText.replace(/<[^>]+>/g, '')} 
            sentences={[synthText.replace(/<[^>]+>/g, '')]} 
            onBoundary={()=>{}} 
            onEnd={()=>{}} 
          />
        </div>
      </div>
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
      { id: 'pr', label: 'Practices', content: null },
    ];

    return (
      <div className="rounded-2xl border border-primary/20 bg-slate-900/60 overflow-hidden mb-10">
        <div className="p-8 bg-gradient-to-br from-primary/20 to-slate-900/80 border-b border-primary/10">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
            <div className="font-serif text-7xl font-bold text-primary drop-shadow-glow leading-none">{currentPY}</div>
            <div>
              <div className="text-2xl font-serif font-semibold text-white mb-1">{yr.title}</div>
              <div className="italic text-slate-400">{yr.sub}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary uppercase tracking-wider text-[0.6rem] py-1">{yr.planet}</Badge>
            <Badge variant="outline" className="border-green-500/30 text-green-400 uppercase tracking-wider text-[0.6rem] py-1">{yr.phase}</Badge>
            <Badge variant="outline" className="border-purple-500/30 text-purple-400 uppercase tracking-wider text-[0.6rem] py-1">{yr.chakra}</Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 bg-black/40 px-6 py-2 border-y border-primary/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2 text-[0.6rem] uppercase tracking-widest font-serif transition-all rounded-md ${activeSubTab === tab.id ? 'bg-primary/20 text-primary border border-primary/30' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeSubTab === 'pr' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {yr.pr.map((p: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-black/40 border border-primary/10 flex gap-4">
                      <div className="text-2xl">{p.i}</div>
                      <div>
                        <div className="font-serif text-[0.65rem] tracking-widest uppercase text-primary mb-1">{p.n}</div>
                        <div className="text-sm text-slate-400">{p.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div id={`tab-content-${activeSubTab}`}>
                  {tabs.find(t => t.id === activeSubTab)?.content?.split('\n\n').map((p: string, i: number) => (
                    <p key={i} className="mb-4 text-slate-300 leading-relaxed text-lg last:mb-0">{p}</p>
                  ))}
                  <div className="mt-6">
                    <SpeechPlayer 
                      text={tabs.find(t => t.id === activeSubTab)?.content || ''} 
                      sentences={tabs.find(t => t.id === activeSubTab)?.content?.split('.') || []} 
                      onBoundary={()=>{}} 
                      onEnd={()=>{}} 
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
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
      const isEnemy = ['clash', 'harm', 'destruction'].includes(cat);
      let dangerLevel = 0;
      if (isEnemy && isCrit) dangerLevel = 4;
      else if (cat === 'self' && isCrit) dangerLevel = 3;
      else if (isEnemy) dangerLevel = 2;
      else if (isCrit) dangerLevel = 1;

      years.push({ year: y, animal: ya, cat, pyNum, dangerLevel });
    }

    return (
      <div className="mb-16">
        <h3 className="text-center font-serif text-primary uppercase tracking-[0.3em] text-xs mb-8 flex items-center justify-center gap-4">
          <div className="w-12 h-[1px] bg-primary/30" />
          Your 12-Year Cycle Map
          <div className="w-12 h-[1px] bg-primary/30" />
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {years.map((y, i) => (
            <div 
              key={i}
              className={`p-4 rounded-xl text-center border-2 transition-all hover:scale-105 ${
                y.dangerLevel === 4 ? 'border-rose-500 bg-rose-950/20 shadow-rose-500/20' :
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
                  {y.dangerLevel === 4 ? '⚠ Max Danger' : y.dangerLevel === 3 ? '⚠ High Risk' : '◈ Critical'}
                </Badge>
              )}
            </div>
          ))}
        </div>
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
            className={`flex flex-col items-center justify-center min-w-[70px] p-2 rounded-xl transition-all duration-300 border ${
              activeTab === tab.id 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-black/40 text-slate-500 border-white/5 hover:border-primary/20'
            }`}
          >
            <tab.icon className="h-4 w-4 mb-1" />
            <span className="text-[9px] font-bold uppercase tracking-tight">{tab.name}</span>
          </button>
        ))}
      </div>

      <ScrollArea className="h-[700px] pr-4">
        {activeTab === 'ov' && (
          <div className="space-y-10 pb-20">
            {renderYearSelector()}
            {renderSynthesis()}
            {renderYearDive()}
            {renderZodiacGrid()}
          </div>
        )}

        {activeTab === 'wh' && (
          <div className="space-y-6 pb-10">
            <section className="text-center">
              <h3 className="text-primary font-bold text-lg mb-4 font-serif uppercase tracking-widest">Celestial Relationship Wheel</h3>
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
              onYearSelect={setSelectedYearData}
            />
            <AnimatePresence>
              {selectedYearData && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                  <Card className="p-8 bg-gradient-to-br from-slate-900 to-black border-l-4 border-primary shadow-2xl">
                    <h4 className="font-serif text-3xl text-primary mb-4 flex items-center gap-3">
                      <Star className="h-6 w-6" /> Personal Year {selectedYearData.pyn} — {selectedYearData.year}
                    </h4>
                    <div className="text-lg leading-relaxed text-slate-200">
                      {selectedYearData.meaning}
                    </div>
                    <div className="mt-6">
                      <SpeechPlayer 
                        text={selectedYearData.meaning} 
                        sentences={selectedYearData.meaning.split('.')} 
                        onBoundary={()=>{}} 
                        onEnd={()=>{}} 
                      />
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {activeTab === 'mp' && (
          <div className="space-y-4 pb-10">
            <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest">Year-by-Year Fate Projection</h3>
            <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
              <Table>
                <TableHeader className="bg-slate-900/80">
                  <TableRow>
                    <TableHead className="text-[10px] uppercase font-black">Year</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Animal</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">PY</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Bond</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Theme</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 20 }, (_, i) => {
                    const year = curYear + i;
                    const pyNum = getPY(d, m, year);
                    const ya = getSign(year);
                    const cat = getRel(ya.n);
                    const isT = pyNum === 4 || pyNum === 7;
                    
                    return (
                      <TableRow key={year} className="border-white/5 hover:bg-white/5">
                        <TableCell className={`font-black text-sm ${year === readYear ? 'text-primary' : 'text-white'}`}>{year}</TableCell>
                        <TableCell className="text-xs">{ya.e} {ya.n}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black border ${isT ? 'border-primary bg-primary/10 text-primary' : 'border-white/10 text-white/60'}`}>{pyNum}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" style={{ color: catColor(cat), borderColor: catColor(cat) + '44' }}>{catLabel(cat)}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-400">{YEAR_DESCRIPTIONS[pyNum]?.title}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {activeTab === 'dr' && (
          <div className="space-y-6 pb-10">
            <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest">Deep Reading — {birthSign}</h3>
            {['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake'].includes(birthSign) ? (
              <div className="space-y-6">
                {['self', 'clash', 'harm', 'destroy', 'alliance', 'neutral'].map(key => {
                  const content = (BOOK.animals as any)[birthSign]?.[key];
                  if (!content) return null;
                  return (
                    <Card key={key} className="p-6 bg-slate-900/40 border border-primary/10">
                      <div className="font-serif text-lg text-primary mb-4 uppercase tracking-widest">{key.replace('_', ' ')}</div>
                      <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">{content}</p>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="p-6 bg-slate-900/40 border border-primary/10 border-l-4 border-l-primary">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Derived Analysis using partners' chapters for {birthSign}.
                  </p>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === 'co' && (
          <div className="space-y-6 pb-10">
            <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest">Sign Codex</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
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
              <div className="mt-8 space-y-4 animate-in fade-in zoom-in-95">
                <Card className="p-8 bg-black/60 border border-primary/20 shadow-2xl">
                  <div className="text-4xl mb-4 text-primary font-serif">{selectedCodex} Encyclopedia</div>
                  <div className="space-y-6">
                    {['self', 'clash', 'harm', 'destroy', 'alliance', 'neutral'].map(key => {
                      const content = (BOOK.animals as any)[selectedCodex]?.[key];
                      if (!content) return null;
                      return (
                        <div key={key}>
                          <div className="text-primary uppercase tracking-[0.2em] text-[0.6rem] mb-2 border-b border-primary/10 pb-1">{key.replace('_', ' ')}</div>
                          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{content}</p>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === 'rf' && (
          <div className="space-y-10 pb-20">
            <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest">Reference Library</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(YEAR_DESCRIPTIONS).map(([key, val]) => (
                <Card key={key} className="p-6 bg-slate-900/40 border border-primary/10 hover:border-primary/30 transition-all">
                  <div className="text-3xl font-serif text-primary mb-2">{key}</div>
                  <div className="font-serif text-sm text-white mb-2">{val.title}</div>
                  <p className="text-xs text-slate-400 line-clamp-3 italic">"{val.desc}"</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
