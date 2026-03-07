'use client';

import React, { useState, useMemo } from 'react';
import { AstroInsightOutput, NumerologyData } from './types';
import { ANIMALS, RELATIONS, CAT_META } from '@/lib/cosmic-fate/constants';
import { YEAR_DESCRIPTIONS } from '@/lib/cosmic-fate/oracle-data';
import { ANIMAL_ENEMY_DESCRIPTIONS } from '@/lib/cosmic-fate/animal-descriptions';
import { BOOK } from '@/lib/cosmic-fate/book';
import { ZodiacWheel } from './cosmic-fate/zodiac-wheel';
import { PersonalYearChart } from './personal-year-chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { Sparkles, Star, Activity, MapIcon, BookOpen, Clock, CalendarDays, ChevronDown, Info, ShieldAlert, Users, Layers, Compass, Wand2, BookUser } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
    const ba = ANIMAL_ENEMY_DESCRIPTIONS[birthSign];
    
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
            <Badge 
              variant="outline" 
              className="border-green-500/30 text-green-400 uppercase tracking-wider text-[0.6rem] py-1 cursor-pointer hover:bg-green-500/10"
              onClick={() => {
                setActiveTab('lb');
                setTimeout(() => {
                  document.getElementById('cat-ref')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
            >
              {yr.phase}
            </Badge>
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
    const ba = ANIMAL_ENEMY_DESCRIPTIONS[birthSign];
    
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
          {years.map((y, i) => {
            const cm = CAT_META[y.cat] || CAT_META.neutral;
            const pi = YEAR_DESCRIPTIONS[y.pyNum];
            let intersectionText = '';
            
            if (y.pyNum === 4) {
              if (y.cat === 'clash') intersectionText = `This is the most challenging configuration in your personal cycle: Personal Year 4's requirement for disciplined foundation-building coincides with your Direct Clash year — the Chinese zodiac's most disruptive annual energy. Rahu's compulsive building drive collides with ${y.animal.n} year's forced disruption, creating a year when every structure you attempt to build meets maximum environmental resistance. The karmic invitation: use Rahu's building energy not to resist the Clash year's forced movement but to build the internal foundations — psychological resilience, spiritual groundedness, practical contingency systems — that make you genuinely mobile rather than frantically rootless. Do not attempt to build permanent structures this year; build portable ones. Financial reserves over fixed investments. Transferable skills over institutional positioning. Psychological stability over social status. The Clash year will move things regardless; your Year 4 work is to ensure that what moves carries your genuine foundation with it rather than leaving it behind.\n\nSpecific to ${birthSign}/${y.animal.n}: ${ba?.clashDesc || ''}`;
              else if (y.cat === 'harm') intersectionText = `Personal Year 4's systematic foundation-building meets the Harm year's concealed erosion: while Rahu drives you to build structures, the Harm year's hidden adversary dynamics are quietly undermining what you build before it can be completed. This is the configuration where workaholism is most dangerous — the compulsive Year 4 building impulse creating elaborate structures that the Harm year's concealed forces are simultaneously destabilizing. The specific risk: trusted colleagues or business partners with hidden agendas at precisely the moment when you are most invested in collaborative structural projects. Year 4 foundation work should be primarily solo or with your most thoroughly verified relationships during this year. Avoid large structural financial commitments that depend on others' reliability.\n\nSpecific dynamics: ${ba?.harmDesc || ''}`;
              else if (y.cat === 'destroy') intersectionText = `Personal Year 4's foundational discipline meets the Destruction year's structural fragmentation: the very foundations you are working to build are subject to unexpected structural failures from within. This is the year when old structures that have been maintained through inertia rather than genuine viability finally collapse — often at the moment of most inconvenient timing, precisely when Year 4's energy has you most invested in building. The Chaldean 13/4 resonance is strongest in this configuration: regeneration through upheaval, transformation forced by structural collapse. Work with this rather than against it: deliberately review all existing structures (financial, relational, professional, physical) for those that are maintained through inertia rather than genuine value, and release them proactively before the Destruction year's energy collapses them reactively.\n\nSpecific dynamics: ${ba?.destDesc || ''}`;
              else if (y.cat === 'self') intersectionText = `Personal Year 4's foundation-building demand coincides with your Ben Ming Nian — the intensification of your natal sign's energy. This creates a year when your characteristic patterns are simultaneously amplified to maximum expression and subjected to maximum structural pressure. Your ${birthSign} nature's most compulsive tendencies will emerge most strongly precisely in the domains where Year 4 is calling you to build most deliberately. The invitation: use Ben Ming Nian's heightened self-awareness as a diagnostic tool. The patterns that emerge most compulsively this year are exactly the patterns whose sublimation into conscious discipline would produce the strongest foundation. Rahu's building demand and your Ben Ming Nian's amplification combine to produce either the most compulsive year in your cycle or the most consciously productive — the difference is awareness.\n\nSpecific dynamics: ${ba?.benDesc || ''}`;
              else if (y.cat === 'alliance') intersectionText = `Personal Year 4's foundation-building receives the unusual gift of alliance support — the most favorable configuration for Year 4 in your Chinese zodiac cycle. ${y.animal.n} year's harmonious energy reduces the friction that Year 4's structural work typically encounters, making it easier to find reliable collaborators, establish stable institutional relationships, and build foundations that are supported rather than undermined by the environmental energy. This is your optimal Year 4 — the year when foundation-building produces the most lasting results. Prioritize your most ambitious structural projects for this intersection year: the financial systems, professional credentials, health disciplines, and organizational frameworks you build in a supported Year 4 carry unusual stability and longevity.\n\nAlliance dynamics: ${ba?.allianceDesc || ''}`;
            } else if (y.pyNum === 7) {
              if (y.cat === 'clash') intersectionText = `The most spiritually dissonant configuration in your cycle: Personal Year 7's requirement for interior solitude and contemplative withdrawal coincides with your Direct Clash year's maximum external pressure and forced movement. Ketu's pull toward inner silence confronts ${y.animal.n} year's unavoidable disruption and change. The world is demanding movement and response precisely when your soul requires stillness and inward turning. This combination produces the Year 7 challenge at maximum intensity: the forced recognition that genuine interior work must occur even amid significant external chaos. The invitation is to develop what contemplative traditions call "the eye of the storm" — the capacity for genuine interior stillness that does not require external calm as its precondition. Those who develop this capacity during this configuration emerge from Year 7 with an unusual combination of genuine mystical depth and practical resilience.\n\nSpecific dynamics: ${ba?.clashDesc || ''}`;
              else if (y.cat === 'harm') intersectionText = `Personal Year 7's interior withdrawal coincides with the Harm year's concealed relationship erosion — creating a configuration where the solitude Year 7 genuinely requires is simultaneously being enforced by relationship betrayals and authority miscommunications that make social engagement feel increasingly unsafe. The risk of misinterpreting forced social withdrawal (caused by Harm year's trust violations) as the voluntary spiritual retreat that Year 7 genuinely calls for: both feel similar, but one is reactive and one is chosen. The practice of this intersection year is choosing the interior work that the circumstances are enforcing, transforming reactive isolation into genuine contemplative retreat, and using the Harm year's trust-testing experiences as direct material for the psychological and spiritual clarification that Year 7 is designed to produce.\n\nSpecific dynamics: ${ba?.harmDesc || ''}`;
              else if (y.cat === 'destruction') intersectionText = `Personal Year 7's contemplative dissolution meets the Destruction year's structural fragmentation — creating the most internally turbulent Year 7 possible. The structures that provide the container for contemplative practice (stable living situation, reliable relationships, financial security) may be destabilized by the Destruction year's energy precisely when Year 7's inner work requires external stability as its foundation. The invitation — and it is a genuine spiritual invitation despite its discomfort — is to discover whether your contemplative practice can proceed without the external scaffolding you thought it required. Ketu's deepest teaching often arrives precisely through Destruction year losses: the revelation that the inner ground is genuinely stable independent of outer circumstance.\n\nSpecific dynamics: ${ba?.destDesc || ''}`;
              else if (y.cat === 'ben-ming') intersectionText = `Personal Year 7's mystical inward turn coincides with your Ben Ming Nian — creating a year of maximum identity amplification during precisely the year when Ketu is asking you to release identification with the very identity being amplified. Your ${birthSign} nature's most characteristic patterns are simultaneously at peak intensity and being subjected to Ketu's dissolution. This is either the most confusing year of your cycle or the most profoundly clarifying, depending entirely on your willingness to witness what your amplified nature reveals about what it has been protecting through its characteristic patterns. Year 7's Ketu energy and Ben Ming Nian's amplification together create conditions for genuine identity breakthrough — the recognition of what you are beneath what you characteristically do.\n\nSpecific dynamics: ${ba?.benDesc || ''}`;
              else if (y.cat === 'alliance') intersectionText = `Personal Year 7's contemplative interior work receives the unusual gift of Chinese zodiac alliance support — meaning the environmental energy facilitates rather than disrupts the Year 7 retreat. This is your most supported Year 7, where the external circumstances actually create space and support for the interior work Ketu calls for. The year may bring specific teachers, texts, practices, or communities that provide precisely the framework your Year 7 inner exploration requires. Approach this configuration with deliberate intention: plan the retreat, study program, writing project, or contemplative practice that most represents what you genuinely need to explore during Year 7, and enter this intersection year with that intention clearly set.\n\nAlliance dynamics: ${ba?.allianceDesc || ''}`;
            }

            return (
              <Popover key={i}>
                <PopoverTrigger asChild>
                  <Card 
                    className={`p-4 text-center border-2 cursor-pointer transition-all hover:scale-105 ${
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
                        {y.dangerLevel === 4 ? '⚡ Critical Tension' : y.dangerLevel === 3 ? '⭐ Double Amplification' : '◈ Trough Window'}
                      </Badge>
                    )}
                  </Card>
                </PopoverTrigger>
                <PopoverContent className="w-80 sm:w-96 max-h-[80vh] overflow-y-auto glass-card border-primary/30 p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-primary/20 pb-2">
                      <h4 className="font-serif text-2xl text-primary">{y.year} Analysis</h4>
                      <Badge style={{ backgroundColor: catColor(y.cat) }}>{catLabel(y.cat)}</Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">The Oracle Weaves</p>
                      <AccordionContentWithPlayer text={intersectionText || `In ${y.year}, your ${birthSign} nature interacts with the ${y.animal.n} year in a ${catLabel(y.cat)} bond. This occurs during your Personal Year ${y.pyNum} (${pi?.title || 'Cycle Phase'}). The primary work this year is ${pi?.phase.toLowerCase() || 'transitional'}.`} />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLibrary = () => {
    return (
      <div className="space-y-8">
        <section id="cat-ref">
          <h3 className="text-primary font-bold text-lg font-serif uppercase tracking-widest mb-4">Foundational Principles</h3>
          <div className="space-y-4">
            {Object.entries(BOOK.foundation).map(([key, text]) => (
              <Card key={key} className="p-6 bg-slate-900/40 border border-primary/10">
                <div className="font-serif text-[0.65rem] tracking-widest uppercase text-primary mb-4 font-bold">{key.replace('_', ' ')} Principles</div>
                <AccordionContentWithPlayer text={text as string} />
              </Card>
            ))}
          </div>
        </section>

        <div className="sep h-[1px] bg-white/10 my-10" />

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
              The source text documents six signs in full encyclopaedic detail: Rat, Ox, Tiger, Rabbit, Dragon, and Snake. Your sign ({birthSign}) is fully calculable through the relational system. Below is a derived analysis from your primary source partners.
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
              <Accordion type="multiple" className="w-full space-y-2">
                {Object.entries(RELATIONS[birthSign]).map(([type, name]) => {
                  const names = Array.isArray(name) ? name : [name];
                  return names.map(targetName => {
                    const cm = CAT_META[type] || CAT_META.neutral;
                    const bookSign = (BOOK.animals as any)[birthSign];
                    const bookText = bookSign ? bookSign[type] : (BOOK.foundation as any)[type] || (BOOK.foundation as any).alliance;
                    return (
                      <AccordionItem key={`${type}-${targetName}`} value={`${type}-${targetName}`} className="glass-card px-4 border-0">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex justify-between items-center w-full pr-4">
                            <div className="font-serif text-[0.65rem] text-primary uppercase tracking-widest font-bold">Bond: {type} × {targetName}</div>
                            <Badge variant="outline" style={{ color: catColor(type), borderColor: catColor(type) + '44' }}>{cm.label}</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <AccordionContentWithPlayer text={bookText} />
                        </AccordionContent>
                      </AccordionItem>
                    );
                  });
                })}
              </Accordion>
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
          <div className="space-y-6 pb-10 px-1">
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
