/**
 * @fileOverview Refactored Cosmic Fate Display mirroring provided code structure & verbatim logic.
 */

'use client';

import React, { useState, useMemo } from 'react';
import { AstroInsightOutput, NumerologyData } from './types';
import { ANIMALS, RELATIONS, CAT_META, LIFESTAGES } from '@/lib/cosmic-fate/constants';
import { YEAR_DESCRIPTIONS } from '@/lib/cosmic-fate/oracle-data';
import { BOOK } from '@/lib/cosmic-fate/book';
import { ZodiacWheel } from './cosmic-fate/zodiac-wheel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Sparkles, Star, MapIcon, Info, CalendarDays, 
  ChevronDown, Layers, BookUser, Activity
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PersonalYearChart } from './personal-year-chart';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AccordionContentWithPlayer } from './accordion-content-with-player';

const TABS = [
  { id: 'ov', name: 'Oracle', icon: Sparkles },
  { id: 'dv', name: 'Year Dive', icon: Info },
  { id: 'wh', name: 'Wheel', icon: Star },
  { id: 'cy', name: 'Cycles', icon: Activity },
  { id: 'mp', name: 'Fate Map', icon: MapIcon },
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
      'self': '#60a5fa',
      'clash': '#f87171',
      'harm': '#fbbf24',
      'destroy': '#a78bfa',
      'sanhe': '#34d399',
      'liuhe': '#e040fb',
      'neutral': '#9ca3af'
    };
    return colors[c] || 'var(--foreground)';
  };

  const LP = useMemo(() => reduce(reduce(m) + reduce(d) + reduce(by)), [d, m, by]);
  const currentPY = useMemo(() => getPY(d, m, readYear), [d, m, readYear]);
  const currentUY = useMemo(() => reduce(readYear), [readYear]);
  const pmNames = ['', 'New Beginnings', 'Cooperation', 'Creativity', 'Foundation', 'Freedom', 'Harmony', 'Reflection', 'Power', 'Completion'];
  const today = new Date();
  const currentMonth = readYear === today.getFullYear() ? today.getMonth() + 1 : 1;
  const PM = useMemo(() => reduce(currentPY + currentMonth), [currentPY, currentMonth]);
  const lpName = (n: number) => ['', 'The Initiator', 'The Cooperative', 'The Creative', 'The Builder', 'The Freedom Seeker', 'The Harmonizer', 'The Seeker', 'The Achiever', 'The Humanitarian'][n] || '';

  const getIntersectionNarrative = (pyNum: number, cat: string, yearAnimalName: string) => {
    const ba = BOOK.animals[birthSign] as any;
    if (pyNum === 4) {
      if (cat === 'clash') return `This is the most challenging configuration in your personal cycle: Personal Year 4's requirement for disciplined foundation-building coincides with your Direct Clash year — the Chinese zodiac's most disruptive annual energy. Rahu's compulsive building drive collides with ${yearAnimalName} year's forced disruption, creating a year when every structure you attempt to build meets maximum environmental resistance. The karmic invitation: use Rahu's building energy not to resist the Clash year's forced movement but to build the internal foundations — psychological resilience, spiritual groundedness, practical contingency systems — that make you genuinely mobile rather than frantically rootless. Do not attempt to build permanent structures this year; build portable ones. Financial reserves over fixed investments. Transferable skills over institutional positioning. Psychological stability over social status. The Clash year will move things regardless; your Year 4 work is to ensure that what moves carries your genuine foundation with it rather than leaving it behind.\n\nSpecific to ${birthSign}/${yearAnimalName}: ${ba?.clash || ''}`;
      if (cat === 'harm') return `Personal Year 4's systematic foundation-building meets the Harm year's concealed erosion: while Rahu drives you to build structures, the Harm year's hidden adversary dynamics are quietly undermining what you build before it can be completed. This is the configuration where workaholism is most dangerous — the compulsive Year 4 building impulse creating elaborate structures that the Harm year's concealed forces are simultaneously destabilizing. The specific risk: trusted colleagues or business partners with hidden agendas at precisely the moment when you are most invested in collaborative structural projects. Year 4 foundation work should be primarily solo or with your most thoroughly verified relationships during this year. Avoid large structural financial commitments that depend on others' reliability.\n\nSpecific dynamics: ${ba?.harm || ''}`;
      if (cat === 'destroy') return `Personal Year 4's foundational discipline meets the Destruction year's structural fragmentation: the very foundations you are working to build are subject to unexpected structural failures from within. This is the year when old structures that have been maintained through inertia rather than genuine viability finally collapse — often at the moment of most inconvenient timing, precisely when Year 4's energy has you most invested in building. The Chaldean 13/4 resonance is strongest in this configuration: regeneration through upheaval, transformation forced by structural collapse. Work with this rather than against it: deliberately review all existing structures (financial, relational, professional, physical) for those that are maintained through inertia rather than genuine value, and release them proactively before the Destruction year's energy collapses them reactively.\n\nSpecific dynamics: ${ba?.destroy || ''}`;
      if (cat === 'self') return `Personal Year 4's foundation-building demand coincides with your Ben Ming Nian — the intensification of your natal sign's energy. This creates a year when your characteristic patterns are simultaneously amplified to maximum expression and subjected to maximum structural pressure. Your ${birthSign} nature's most compulsive tendencies will emerge most strongly precisely in the domains where Year 4 is calling you to build most deliberately. The invitation: use Ben Ming Nian's heightened self-awareness as a diagnostic tool. The patterns that emerge most compulsively this year are exactly the patterns whose sublimation into conscious discipline would produce the strongest foundation.\n\nSpecific dynamics: ${ba?.self || ''}`;
      if (cat === 'alliance') return `Personal Year 4's foundation-building receives the unusual gift of alliance support — the most favorable configuration for Year 4 in your Chinese zodiac cycle. ${yearAnimalName} year's harmonious energy reduces the friction that Year 4's structural work typically encounters, making it easier to find reliable collaborators, establish stable institutional relationships, and build foundations that are supported rather than undermined by the environmental energy.\n\nAlliance dynamics: ${ba?.alliance || ''}`;
      return `Personal Year 4's foundation-building discipline proceeds in a ${yearAnimalName} Neutral year — neither amplified by alliance support nor undermined by conflict energy. This allows Year 4's structural work to proceed primarily through your own effort and discernment rather than through environmental support or resistance. The advantage: your Year 4 foundations this year reflect your genuine capacity rather than exceptional circumstances in either direction.`;
    }
    if (pyNum === 7) {
      if (cat === 'clash') return `The most spiritually dissonant configuration in your cycle: Personal Year 7's requirement for interior solitude and contemplative withdrawal coincides with your Direct Clash year's maximum external pressure and forced movement. Ketu's pull toward inner silence confronts ${yearAnimalName} year's unavoidable disruption and change. The world is demanding movement and response precisely when your soul requires stillness and inward turning.\n\nSpecific dynamics: ${ba?.clash || ''}`;
      if (cat === 'harm') return `Personal Year 7's interior withdrawal coincides with the Harm year's concealed relationship erosion — creating a configuration where the solitude Year 7 genuinely requires is simultaneously being enforced by relationship betrayals and authority miscommunications that make social engagement feel increasingly unsafe. The practice of this intersection year is choosing the interior work that the circumstances are enforcing, transforming reactive isolation into genuine contemplative retreat.\n\nSpecific dynamics: ${ba?.harm || ''}`;
      if (cat === 'destroy') return `Personal Year 7's contemplative dissolution meets the Destruction year's structural fragmentation — creating the most internally turbulent Year 7 possible. The structures that provide the container for contemplative practice (stable living situation, reliable relationships, financial security) may be destabilized by the Destruction year's energy precisely when Year 7's inner work requires external stability as its foundation.\n\nSpecific dynamics: ${ba?.destroy || ''}`;
      if (cat === 'self') return `Personal Year 7's mystical inward turn coincides with your Ben Ming Nian — creating a year of maximum identity amplification during precisely the year when Ketu is asking you to release identification with the very identity being amplified.\n\nSpecific dynamics: ${ba?.self || ''}`;
      if (cat === 'alliance') return `Personal Year 7's contemplative interior work receives the unusual gift of Chinese zodiac alliance support — meaning the environmental energy facilitates rather than disrupts the Year 7 retreat. This is your most supported Year 7, where the external circumstances actually create space and support for the interior work Ketu calls for.\n\nAlliance dynamics: ${ba?.alliance || ''}`;
      return `Personal Year 7's contemplative withdrawal proceeds in a ${yearAnimalName} Neutral year — neither supported nor undermined by exceptional Chinese zodiac energy. The interior work this Year 7 calls for is primarily between you and the depth that Ketu is activating.`;
    }
    return `In ${readYear}, your ${birthSign} nature interacts with the ${yearAnimalName} year in a ${catLabel(cat)} configuration. This occurs during your Personal Year ${pyNum} (${YEAR_DESCRIPTIONS[pyNum]?.title}). This window favors steady progress through ${cat === 'alliance' ? 'supported collaboration' : 'individual initiative'}.`;
  };

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
            Temporal Focus: {readYear}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isYearSelectorOpen ? 'rotate-180' : ''}`} />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="read-year" className="text-[10px] uppercase tracking-wider text-muted-foreground">Select Year to Forecast</Label>
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
              Reset
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
      <Card className="p-6 bg-slate-900/60 border border-primary/20 relative">
        <div className="flex flex-col gap-2">
          <h4 className="font-serif text-[0.65rem] tracking-[0.3em] uppercase text-primary/80 mb-2">✦ Oracle Synthesis</h4>
          <AccordionContentWithPlayer text={synthText} />
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hits.map((h, i) => {
          const cm = CAT_META[h.rt];
          const pi = YEAR_DESCRIPTIONS[h.p];
          const narrative = getIntersectionNarrative(h.p, h.rt, h.ys.n);

          return (
            <Card key={i} className={`p-6 border-l-4 ${h.rt === 'clash' || h.rt === 'self' ? 'border-rose-500 bg-rose-950/10' : 'border-amber-500 bg-amber-950/10'} w-full overflow-hidden`}>
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
    const startYear = readYear;
    for (let y = startYear; y < startYear + 12; y++) {
      const ya = getSign(y);
      const cat = getRel(ya.n);
      const pyNum = getPY(d, m, y);
      const isCrit = pyNum === 4 || pyNum === 7;
      const isPeak = pyNum === 1 || pyNum === 9;
      const isClash = cat === 'clash';
      const isAlliance = ['sanhe', 'liuhe'].includes(cat);

      let rowClass = 'bg-black/40 border-white/5';
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-full">
        {years.map((y, i) => (
          <Popover key={i}>
            <PopoverTrigger asChild>
              <div 
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${y.rowClass} flex flex-col items-center text-center overflow-hidden h-40`}
              >
                <div className="text-3xl mb-1">{y.animal.e}</div>
                <div className="font-bold text-xl text-white">{y.year}</div>
                <div className="text-[10px] uppercase font-bold text-primary mb-1 truncate w-full">{catLabel(y.cat)}</div>
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${y.py === 4 || y.py === 7 ? 'bg-rose-500/20 text-rose-400' : 'bg-primary/20 text-primary'}`}>
                    {y.py}
                  </span>
                  <span className="text-[9px] uppercase tracking-tighter text-muted-foreground">{y.confluence}</span>
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 glass-card border-primary/20">
              <div className="space-y-3">
                <h4 className="font-bold text-primary flex items-center gap-2">
                  {y.animal.e} Year {y.year} Analysis
                </h4>
                <div className="text-xs uppercase text-muted-foreground tracking-widest mb-2">
                  Personal Year {y.py} • {catLabel(y.cat)}
                </div>
                <AccordionContentWithPlayer 
                  text={getIntersectionNarrative(y.py, y.cat, y.animal.n)} 
                />
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    );
  };

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
                    <Badge 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary/10 border-primary/40 text-primary"
                      onClick={() => setActiveTab('rf')}
                    >
                      {YEAR_DESCRIPTIONS[currentPY].phase}
                    </Badge>
                    <Badge variant="outline">{YEAR_DESCRIPTIONS[currentPY].chakra}</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <AccordionContentWithPlayer text={YEAR_DESCRIPTIONS[currentPY].overview} />
                </div>
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
              <Card className="p-6 bg-black/60 border-primary/20 mt-4">
                <h4 className="text-xl font-bold text-primary mb-4">{selectedCodex} Codex</h4>
                <div className="space-y-4">
                  <Accordion type="single" collapsible className="space-y-2">
                    {['self', 'clash', 'harm', 'destroy', 'alliance', 'neutral'].map(key => {
                      const txt = (BOOK.animals as any)[selectedCodex]?.[key];
                      if (!txt) return null;
                      return (
                        <AccordionItem key={key} value={key} className="glass-card px-4 border-0">
                          <AccordionTrigger className="uppercase text-[10px] tracking-widest font-bold">{key}</AccordionTrigger>
                          <AccordionContent>
                            <AccordionContentWithPlayer text={txt} />
                          </AccordionContent>
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'rf' && (
          <div className="space-y-6 pb-10">
            <div className="space-y-8">
              <div className="pymg grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1,2,3,4,5,6,7,8,9].map(n => {
                  const p = YEAR_DESCRIPTIONS[n];
                  return (
                    <Card key={n} className={`p-4 bg-black/40 border-primary/10 ${n === 4 || n === 7 ? 'border-rose-500/30 bg-rose-950/5' : ''}`}>
                      <div className="text-3xl font-bold text-primary mb-1">{n}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">{p.title}</div>
                      <div className="text-[9px] uppercase font-bold text-primary mb-2">{p.phase}</div>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{p.desc}</p>
                    </Card>
                  );
                })}
              </div>
              <div className="div h-[1px] bg-white/10 my-8" />
              <section>
                <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest mb-4">Six Categories - Foundation</h3>
                <Accordion type="single" collapsible className="space-y-2">
                  {['ben_ming', 'clash', 'harm', 'destroy', 'alliance', 'neutral'].map(key => (
                    <AccordionItem key={key} value={key} className="glass-card px-4 border-0">
                      <AccordionTrigger className="uppercase text-[10px] tracking-widest font-bold">
                        {key === 'ben_ming' ? 'Ben Ming Nian' : key === 'clash' ? 'Direct Clash' : key === 'harm' ? 'Harm' : key === 'destroy' ? 'Destruction' : key === 'alliance' ? 'Alliance' : 'Neutral'}
                      </AccordionTrigger>
                      <AccordionContent>
                        <AccordionContentWithPlayer text={(BOOK.foundation as any)[key]} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
