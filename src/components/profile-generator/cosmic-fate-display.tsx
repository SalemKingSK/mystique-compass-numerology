'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AstroInsightOutput, NumerologyData } from './types';
import { ANIMALS, RELATIONS, CAT_META, TAISUI, STEMS, SNAMES, LIFESTAGES } from '@/lib/cosmic-fate/constants';
import { YEAR_DESCRIPTIONS, PINNACLE_MEANINGS, CHALLENGE_MEANINGS } from '@/lib/cosmic-fate/oracle-data';
import { ANIMAL_ENEMY_DESCRIPTIONS } from '@/lib/cosmic-fate/animal-descriptions';
import { BOOK } from '@/lib/cosmic-fate/book';
import { ZodiacWheel } from './cosmic-fate/zodiac-wheel';
import { PersonalYearChart } from './personal-year-chart';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { SpeechPlayer } from './speech-player';
import { Info, Sparkles, Zap, MapIcon, Star, History, Users, Search, Activity, BookOpen, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { id: 'ov', name: 'Overview', icon: Sparkles },
  { id: 'wh', name: 'Wheel', icon: Users },
  { id: 'cy', name: 'Cycles', icon: Activity },
  { id: 'mp', name: 'Map', icon: MapIcon },
  { id: 'dr', name: 'Deep Read', icon: BookOpen },
  { id: 'co', name: 'Codex', icon: Search },
  { id: 'rf', name: 'Ref', icon: Info },
];

const EL_CLASS: Record<string, string> = {
  Wood: 'bg-green-500/20 text-green-400 border-green-500/30',
  Fire: 'bg-red-500/20 text-red-400 border-red-500/30',
  Earth: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Metal: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Water: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
};

export function CosmicFateDisplay({ insight, numerology }: { insight: AstroInsightOutput, numerology: NumerologyData }) {
  const [activeTab, setActiveTab] = useState('ov');
  const [selectedCodex, setSelectedCodex] = useState('Rat');
  const [selectedYearData, setSelectedYearData] = useState<any>(null);
  const [activeSubTab, setActiveSubTab] = useState('ov');

  const { birthDay: d, birthMonth: m, birthYear: by } = numerology;
  const ry = insight.year;
  const birthSign = insight.sign;
  const curYear = new Date().getFullYear();

  // --- HELPERS ---
  const reduce = (n: number): number => {
    let s = n;
    while (s > 9) s = String(s).split('').reduce((a, b) => a + parseInt(b), 0);
    return s || 9;
  };

  const getPY = (day: number, mon: number, year: number) => reduce(reduce(day) + reduce(mon) + reduce(year));
  const getLP = (day: number, mon: number, year: number) => reduce(reduce(day) + reduce(mon) + reduce(year));
  
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

  // --- DERIVED NUMEROLOGY ---
  const LP = useMemo(() => getLP(d, m, by), [d, m, by]);
  const BN = useMemo(() => reduce(d), [d]);
  const currentPY = useMemo(() => getPY(d, m, ry), [d, m, ry]);
  const currentUY = useMemo(() => reduce(ry), [ry]);
  
  const pmNames = ['', 'New Beginnings', 'Cooperation', 'Creativity', 'Foundation', 'Freedom', 'Harmony', 'Reflection', 'Power', 'Completion'];
  const currentMonth = ry === new Date().getFullYear() ? new Date().getMonth() + 1 : 1;
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
  const currentAge = ry - by;

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

  // --- INTERSECTION NARRATIVE ---
  const getIntersectionNarrative = (pyNum: number, cat: string, yearAnimal: string) => {
    const ba = ANIMAL_ENEMY_DESCRIPTIONS[birthSign];
    if (pyNum === 4) {
      if (cat === 'clash') return `This is the most challenging configuration in your personal cycle: Personal Year 4's requirement for disciplined foundation-building coincides with your Direct Clash year — the Chinese zodiac's most disruptive annual energy. Rahu's compulsive building drive collides with ${yearAnimal} year's forced disruption, creating a year when every structure you attempt to build meets maximum environmental resistance. The karmic invitation: use Rahu's building energy not to resist the Clash year's forced movement but to build the internal foundations — psychological resilience, spiritual groundedness, practical contingency systems — that make you genuinely mobile rather than frantically rootless. Do not attempt to build permanent structures this year; build portable ones. Financial reserves over fixed investments. Transferable skills over institutional positioning. Psychological stability over social status. The Clash year will move things regardless; your Year 4 work is to ensure that what moves carries your genuine foundation with it rather than leaving it behind.\n\nSpecific to ${birthSign}/${yearAnimal}: ${ba?.clashDesc || ''}`;
      if (cat === 'harm') return `Personal Year 4's systematic foundation-building meets the Harm year's concealed erosion: while Rahu drives you to build structures, the Harm year's hidden adversary dynamics are quietly undermining what you build before it can be completed. This is the configuration where workaholism is most dangerous — the compulsive Year 4 building impulse creating elaborate structures that the Harm year's concealed forces are simultaneously destabilizing. The specific risk: trusted colleagues or business partners with hidden agendas at precisely the moment when you are most invested in collaborative structural projects. Year 4 foundation work should be primarily solo or with your most thoroughly verified relationships during this year. Avoid large structural financial commitments that depend on others' reliability.\n\nSpecific dynamics: ${ba?.harmDesc || ''}`;
      if (cat === 'destruction') return `Personal Year 4's foundational discipline meets the Destruction year's structural fragmentation: the very foundations you are working to build are subject to unexpected structural failures from within. This is the year when old structures that have been maintained through inertia rather than genuine viability finally collapse — often at the moment of most inconvenient timing, precisely when Year 4's energy has you most invested in building. The Chaldean 13/4 resonance is strongest in this configuration: regeneration through upheaval, transformation forced by structural collapse. Work with this rather than against it: deliberately review all existing structures (financial, relational, professional, physical) for those that are maintained through inertia rather than genuine value, and release them proactively before the Destruction year's energy collapses them reactively.\n\nSpecific dynamics: ${ba?.destDesc || ''}`;
      if (cat === 'ben-ming') return `Personal Year 4's foundation-building demand coincides with your Ben Ming Nian — the intensification of your natal sign's energy. This creates a year when your characteristic patterns are simultaneously amplified to maximum expression and subjected to maximum structural pressure. Your ${birthSign} nature's most compulsive tendencies will emerge most strongly precisely in the domains where Year 4 is calling you to build most deliberately. The invitation: use Ben Ming Nian's heightened self-awareness as a diagnostic tool. The patterns that emerge most compulsively this year are exactly the patterns whose sublimation into conscious discipline would produce the strongest foundation. Rahu's building demand and your Ben Ming Nian's amplification combine to produce either the most compulsive year in your cycle or the most consciously productive — the difference is awareness.\n\nSpecific dynamics: ${ba?.benDesc || ''}`;
      if (cat === 'alliance') return `Personal Year 4's foundation-building receives the unusual gift of alliance support — the most favorable configuration for Year 4 in your Chinese zodiac cycle. ${yearAnimal} year's harmonious energy reduces the friction that Year 4's structural work typically encounters, making it easier to find reliable collaborators, establish stable institutional relationships, and build foundations that are supported rather than undermined by the environmental energy. This is your optimal Year 4 — the year when foundation-building produces the most lasting results. Prioritize your most ambitious structural projects for this intersection year: the financial systems, professional credentials, health disciplines, and organizational frameworks you build in a supported Year 4 carry unusual stability and longevity.\n\nAlliance dynamics: ${ba?.allianceDesc || ''}`;
    }
    if (pyNum === 7) {
      if (cat === 'clash') return `The most spiritually dissonant configuration in your cycle: Personal Year 7's requirement for interior solitude and contemplative withdrawal coincides with your Direct Clash year's maximum external pressure and forced movement. Ketu's pull toward inner silence confronts ${yearAnimal} year's unavoidable disruption and change. The world is demanding movement and response precisely when your soul requires stillness and inward turning. This combination produces the Year 7 challenge at maximum intensity: the forced recognition that genuine interior work must occur even amid significant external chaos. The invitation is to develop what contemplative traditions call "the eye of the storm" — the capacity for genuine interior stillness that does not require external calm as its precondition. Those who develop this capacity during this configuration emerge from Year 7 with an unusual combination of genuine mystical depth and practical resilience.\n\nSpecific dynamics: ${ba?.clashDesc || ''}`;
      if (cat === 'harm') return `Personal Year 7's interior withdrawal coincides with the Harm year's concealed relationship erosion — creating a configuration where the solitude Year 7 genuinely requires is simultaneously being enforced by relationship betrayals and authority miscommunications that make social engagement feel increasingly unsafe. The risk of misinterpreting forced social withdrawal (caused by Harm year's trust violations) as the voluntary spiritual retreat that Year 7 genuinely calls for: both feel similar, but one is reactive and one is chosen. The practice of this intersection year is choosing the interior work that the circumstances are enforcing, transforming reactive isolation into genuine contemplative retreat, and using the Harm year's trust-testing experiences as direct material for the psychological and spiritual clarification that Year 7 is designed to produce.\n\nSpecific dynamics: ${ba?.harmDesc || ''}`;
      if (cat === 'destruction') return `Personal Year 7's contemplative dissolution meets the Destruction year's structural fragmentation — creating the most internally turbulent Year 7 possible. The structures that provide the container for contemplative practice (stable living situation, reliable relationships, financial security) may be destabilized by the Destruction year's energy precisely when Year 7's inner work requires external stability as its foundation. The invitation — and it is a genuine spiritual invitation despite its discomfort — is to discover whether your contemplative practice can proceed without the external scaffolding you thought it required. Ketu's deepest teaching often arrives precisely through Destruction year losses: the revelation that the inner ground is genuinely stable independent of outer circumstance.\n\nSpecific dynamics: ${ba?.destDesc || ''}`;
      if (cat === 'ben-ming') return `Personal Year 7's mystical inward turn coincides with your Ben Ming Nian — creating a year of maximum identity amplification during precisely the year when Ketu is asking you to release identification with the very identity being amplified. Your ${birthSign} nature's most characteristic patterns are simultaneously at peak intensity and being subjected to Ketu's dissolution. This is either the most confusing year of your cycle or the most profoundly clarifying, depending entirely on your willingness to witness what your amplified nature reveals about what it has been protecting through its characteristic patterns. Year 7's Ketu energy and Ben Ming Nian's amplification together create conditions for genuine identity breakthrough — the recognition of what you are beneath what you characteristically do.\n\nSpecific dynamics: ${ba?.benDesc || ''}`;
      if (cat === 'alliance') return `Personal Year 7's contemplative interior work receives the unusual gift of Chinese zodiac alliance support — meaning the environmental energy facilitates rather than disrupts the Year 7 retreat. This is your most supported Year 7, where the external circumstances actually create space and support for the interior work Ketu calls for. The year may bring specific teachers, texts, practices, or communities that provide precisely the framework your Year 7 inner exploration requires. Approach this configuration with deliberate intention: plan the retreat, study program, writing project, or contemplative practice that most represents what you genuinely need to explore during Year 7, and enter this intersection year with that intention clearly set.\n\nAlliance dynamics: ${ba?.allianceDesc || ''}`;
    }
    return `Personal Year ${pyNum} proceeds in a ${yearAnimal} Neutral year — neither supported nor undermined by exceptional Chinese zodiac energy. Outcomes reflect your genuine capacity rather than external amplification.`;
  };

  // --- RENDERERS ---
  const renderSynthesis = () => {
    const yr = YEAR_DESCRIPTIONS[currentPY];
    const yearAnimal = getSign(ry);
    const cat = getRel(yearAnimal.n);
    const catLabel = CAT_META[cat]?.label || 'Neutral';
    
    const tension = (currentPY===4 && (LP===5||LP===3)) || (currentPY===7 && (LP===1||LP===6));
    const harmony = (currentPY===LP) || (currentPY===currentUY) || (currentPY===BN);

    const animalLine = `Your ${birthSign} nature meets a ${yearAnimal.n} year (${catLabel}) — ${ 
      cat==='clash'?'an environment of maximum elemental friction calling for proactive adaptation rather than resistance': 
      cat==='harm'?'a year of concealed pressures requiring extra vigilance in trust and documentation': 
      cat==='destruction'?'a year when outdated structures may fracture, clearing ground for what genuinely serves you': 
      cat==='ben-ming'?'your identity year, when all your characteristic patterns amplify to their fullest expression': 
      cat==='alliance'?'an environmentally supported year where the collective field actively favours your initiatives': 
      'a neutral year where outcomes reflect pure personal effort rather than exceptional external forces'
    }.`;

    const convergeLine = tension
      ? `Your Life Path ${LP} (${lpName(LP)}) creates notable friction with Personal Year ${currentPY}'s demands — a soul-level tension with specific lessons detailed below.`
      : harmony
      ? `A significant harmonic: your Personal Year ${currentPY} resonates with another core number in your chart — an amplification point for ${yr?.title.toLowerCase()} themes.`
      : `Your Life Path ${LP} and Personal Year ${currentPY} are in productive dialogue, allowing this year's work to proceed through genuine effort.`;

    const synthText = `In ${ry}, you are in a <strong>Personal Year ${currentPY} — ${yr?.title}</strong>, riding the ${yr?.phase.toLowerCase()} phase of your nine-year cycle. The Universal Year ${currentUY} (${YEAR_DESCRIPTIONS[currentUY]?.title}) sets the collective backdrop. Your current Personal Month is <strong>${PM} (${pmNames[PM]})</strong>. ${animalLine} ${convergeLine} Your active Pinnacle is <strong>${activePinnacleNum}</strong>, while your active Challenge number is <strong>${activeChallenge === 0 ? '0 (The Master Test)' : activeChallenge + ' (' + lpName(activeChallenge) + ')'}</strong>.`;

    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-900/40 to-black/60 border border-gold/20 shadow-xl relative overflow-hidden mb-6">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
        <h4 className="font-serif text-[0.65rem] tracking-[0.3em] uppercase text-gold-dim mb-4">✦ Oracle Synthesis</h4>
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
      <div className="rounded-2xl border border-gold/20 bg-slate-900/60 overflow-hidden mb-10">
        <div className="p-8 bg-gradient-to-br from-blue-900/50 to-slate-900/80 border-bottom border-gold/10">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
            <div className="font-serif text-7xl font-bold text-gold drop-shadow-glow leading-none">{currentPY}</div>
            <div>
              <div className="text-2xl font-serif font-semibold text-white mb-1">{yr.title}</div>
              <div className="italic text-slate-400">{yr.sub}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-gold/30 text-gold uppercase tracking-wider text-[0.6rem] py-1">{yr.planet}</Badge>
            <Badge variant="outline" className="border-green-500/30 text-green-400 uppercase tracking-wider text-[0.6rem] py-1">{yr.phase}</Badge>
            <Badge variant="outline" className="border-purple-500/30 text-purple-400 uppercase tracking-wider text-[0.6rem] py-1">{yr.chakra}</Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 bg-black/40 px-6 py-2 border-y border-gold/10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-4 py-2 text-[0.6rem] uppercase tracking-widest font-serif transition-all rounded-md ${activeSubTab === tab.id ? 'bg-gold/20 text-gold border border-gold/30' : 'text-slate-500 hover:text-slate-300'}`}
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
                    <div key={i} className="p-4 rounded-xl bg-black/40 border border-gold/10 flex gap-4">
                      <div className="text-2xl">{p.i}</div>
                      <div>
                        <div className="font-serif text-[0.65rem] tracking-widest uppercase text-gold mb-1">{p.n}</div>
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

  const renderIntersections = () => {
    // Generate intersection data for the next 18 years
    const intersections = [];
    for (let y = ry; y <= ry + 18; y++) {
      const pyNum = getPY(d, m, y);
      if (pyNum === 4 || pyNum === 7) {
        const yearAnimal = getSign(y);
        const cat = getRel(yearAnimal.n);
        intersections.push({ year: y, pyNum, cat, animalName: yearAnimal.n, animalEmoji: yearAnimal.e });
      }
    }

    if (intersections.length === 0) return null;

    return (
      <div className="space-y-8 mb-16">
        <div className="flex items-center gap-4 text-rose-500 font-serif uppercase tracking-[0.3em] text-xs">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-rose-500/30" />
          🔥 Critical Year Intersections
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-rose-500/30" />
        </div>
        {intersections.map((item, idx) => {
          const catInfo = CAT_META[item.cat] || CAT_META.neutral;
          const narrative = getIntersectionNarrative(item.pyNum, item.cat, item.animalName);
          const isEnemy = ['clash', 'harm', 'destruction'].includes(item.cat);

          return (
            <Card key={idx} className={`bg-gradient-to-br from-slate-900 to-black border-2 ${isEnemy ? 'border-rose-500/40 shadow-rose-900/20' : 'border-gold/20'} overflow-hidden`}>
              <div className="p-6 border-b border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-4xl font-serif font-bold text-white leading-none">{item.year}</div>
                  <Badge className={catInfo.badge}>{catInfo.label}</Badge>
                </div>
                <div className="font-serif text-lg text-slate-200">
                  Personal Year {item.pyNum} · {item.animalEmoji} {item.animalName} Year
                </div>
              </div>
              <div className="p-6">
                <div className="text-slate-300 leading-relaxed italic mb-4 whitespace-pre-line" id={`int-narr-${idx}`}>
                  {narrative}
                </div>
                <SpeechPlayer 
                  text={narrative} 
                  sentences={narrative.split('.')} 
                  onBoundary={()=>{}} 
                  onEnd={()=>{}} 
                />
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderZodiacGrid = () => {
    // Map of the next 12 years
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
        <h3 className="text-center font-serif text-gold uppercase tracking-[0.3em] text-xs mb-8 flex items-center justify-center gap-4">
          <div className="w-12 h-[1px] bg-gold/30" />
          Your 12-Year Cycle Map
          <div className="w-12 h-[1px] bg-gold/30" />
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {years.map((y, i) => {
            const cm = CAT_META[y.cat] || CAT_META.neutral;
            return (
              <div 
                key={i}
                className={`p-4 rounded-xl text-center border-2 transition-all hover:scale-105 ${
                  y.dangerLevel === 4 ? 'border-rose-500 bg-rose-950/20 shadow-rose-500/20' :
                  y.dangerLevel === 3 ? 'border-amber-500 bg-amber-950/20' :
                  'border-gold/10 bg-slate-900/40'
                }`}
              >
                <div className="text-3xl mb-2">{y.animal.e}</div>
                <div className="font-serif text-lg font-bold text-white">{y.year}</div>
                <div className="font-serif text-xs text-gold mb-1">PY {y.pyNum}</div>
                <div className="text-[0.6rem] uppercase tracking-widest opacity-60 mb-2">{cm.label}</div>
                {y.dangerLevel > 0 && (
                  <Badge variant="destructive" className="text-[0.5rem] py-0 px-2 h-4">
                    {y.dangerLevel === 4 ? '⚠ Max Danger' : y.dangerLevel === 3 ? '⚠ High Risk' : '◈ Critical'}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPinnacles = () => {
    const stages = [
      { n: 1, val: p1, ch: ch1, label: `Birth — Age ${p1end}` },
      { n: 2, val: p2, ch: ch2, label: `Age ${p1end + 1} — ${p2end}` },
      { n: 3, val: p3, ch: ch3, label: `Age ${p2end + 1} — ${p3end}` },
      { n: 4, val: p4, ch: ch4, label: `Age ${p3end + 1}+` },
    ];

    return (
      <div className="mb-16">
        <h3 className="section-header">◈ Your Pinnacles & Challenges ◈</h3>
        <p className="text-center text-slate-400 italic mb-8 max-w-2xl mx-auto text-sm">
          Pinnacles are the four long-arc life themes spanning your entire lifespan — the backdrop against which each personal year plays out.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stages.map((s, i) => {
            const isActive = s.n === pinnacleIdx;
            return (
              <Card key={i} className={`p-6 bg-gradient-to-br from-slate-900 to-black border ${isActive ? 'border-green-500/40' : 'border-gold/10'}`}>
                <div className="font-serif text-[0.6rem] tracking-[0.2em] uppercase text-slate-500 mb-4 flex justify-between">
                  <span>Pinnacle {s.n} {isActive && '◈ Active'}</span>
                  <span>{s.label}</span>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="text-center min-w-[60px]">
                    <div className="text-4xl font-serif text-green-400 leading-none mb-1">{s.val}</div>
                    <div className="text-[0.5rem] uppercase tracking-widest text-slate-500">Pinnacle</div>
                  </div>
                  <div className="text-center min-w-[60px]">
                    <div className="text-4xl font-serif text-rose-400 leading-none mb-1">{s.ch}</div>
                    <div className="text-[0.5rem] uppercase tracking-widest text-slate-500">Challenge</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-300 mb-3">{PINNACLE_MEANINGS[s.val]}</p>
                    <p className="text-xs text-rose-300/70 border-t border-white/5 pt-3">
                      <strong>Challenge {s.ch}:</strong> {CHALLENGE_MEANINGS[s.ch]}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 font-serif">
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[70px] p-2 rounded-xl transition-all duration-300 border ${
              activeTab === tab.id 
                ? 'bg-gold text-void border-gold' 
                : 'bg-black/40 text-slate-500 border-white/5 hover:border-gold/20'
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
            {renderSynthesis()}
            {renderYearDive()}
            {renderIntersections()}
            {renderZodiacGrid()}
            {renderPinnacles()}
          </div>
        )}

        {activeTab === 'wh' && (
          <div className="space-y-6 pb-10">
            <section className="text-center">
              <h3 className="text-gold font-bold text-lg mb-4 font-serif uppercase tracking-widest">Celestial Relationship Wheel</h3>
              <ZodiacWheel birthSign={birthSign} />
            </section>
            <section>
              <h3 className="flex items-center gap-2 text-gold font-bold text-lg mb-4 font-serif uppercase tracking-widest"><Users className="h-5 w-5" /> Relationship Details</h3>
              <div className="space-y-2">
                {Object.entries(RELATIONS[birthSign] || {}).map(([type, names]) => {
                  const nameList = Array.isArray(names) ? names : [names];
                  return nameList.map(targetName => {
                    const mappedKey = type === 'sanhe' || type === 'liuhe' ? 'alliance' : type === 'self' ? 'self' : type;
                    const bookData = (BOOK.animals as any)[birthSign];
                    const content = bookData ? bookData[mappedKey] : (BOOK.foundation as any)[mappedKey];
                    const targetAnimal = ANIMALS.find(a => a.n === targetName);
                    
                    return (
                      <Card key={targetName} className="p-6 bg-slate-900/40 border border-gold/10 mb-2">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{targetAnimal?.e}</span>
                            <span className="text-lg font-serif text-white">{targetName}</span>
                          </div>
                          <Badge variant="outline" className={CAT_META[type]?.badge || 'b-neutral'}>
                            {CAT_META[type]?.label || type}
                          </Badge>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">{content}</p>
                      </Card>
                    );
                  });
                })}
              </div>
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
                  <Card className="p-8 bg-gradient-to-br from-slate-900 to-black border-l-4 border-gold shadow-2xl">
                    <h4 className="font-serif text-3xl text-gold mb-4 flex items-center gap-3">
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
            <h3 className="text-gold font-bold text-lg font-serif uppercase tracking-widest">Year-by-Year Fate Projection</h3>
            <div className="rounded-xl border border-white/10 overflow-hidden bg-black/40">
              <Table>
                <TableHeader className="bg-slate-900/80">
                  <TableRow>
                    <TableHead className="text-[10px] uppercase font-black">Year</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Animal</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">PY</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Bond</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Theme</TableHead>
                    <TableHead className="text-[10px] uppercase font-black">Confluence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 20 }, (_, i) => {
                    const year = ry + i;
                    const pyNum = getPY(d, m, year);
                    const ya = getSign(year);
                    const cat = getRel(ya.n);
                    const isT = pyNum === 4 || pyNum === 7;
                    const isE = ['clash', 'harm', 'destruction', 'self'].includes(cat);
                    const isA = ['sanhe', 'liuhe'].includes(cat);
                    
                    let confluence = null;
                    if (isT && isE) confluence = <span className="text-red-400 font-bold">⚡ Trough+Enemy</span>;
                    else if (isT && isA) confluence = <span className="text-gold font-bold">✦ Trough+Ally</span>;
                    else if (isT) confluence = <span className="text-amber-400 font-bold">◎ Trough</span>;
                    
                    return (
                      <TableRow key={year} className="border-white/5 hover:bg-white/5">
                        <TableCell className={`font-black text-sm ${year === ry ? 'text-gold' : 'text-white'}`}>{year}</TableCell>
                        <TableCell className="text-xs">{ya.e} {ya.n}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black border ${isT ? 'border-gold bg-gold/10 text-gold' : 'border-white/10 text-white/60'}`}>{pyNum}</span>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-[9px] ${CAT_META[cat]?.badge || 'b-neutral'}`}>{CAT_META[cat]?.label || 'Neutral'}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-400">{YEAR_DESCRIPTIONS[pyNum]?.title}</TableCell>
                        <TableCell className="text-[10px]">{confluence || <span className="text-muted-foreground opacity-30">—</span>}</TableCell>
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
            <h3 className="text-gold font-bold text-lg font-serif uppercase tracking-widest">Deep Reading — {birthSign}</h3>
            {['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake'].includes(birthSign) ? (
              <div className="space-y-6">
                <div className="info-tag text-[10px] mb-4">📚 Source: The Chinese Zodiac: Six Categories of Years — Verbatim</div>
                {['self', 'clash', 'harm', 'destroy', 'alliance', 'neutral'].map(key => {
                  const content = (BOOK.animals as any)[birthSign]?.[key];
                  if (!content) return null;
                  return (
                    <Card key={key} className="p-6 bg-slate-900/40 border border-gold/10">
                      <div className="font-serif text-lg text-gold mb-4 uppercase tracking-widest">{key.replace('_', ' ')}</div>
                      <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">{content}</p>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="p-6 bg-slate-900/40 border border-gold/10 border-l-4 border-l-gold">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    The source text documents six signs in full detail. As your sign (<strong>{birthSign}</strong>) is not one of the six, we provide a <strong>Derived Analysis</strong> using the verbatim chapters of your primary celestial partners.
                  </p>
                </Card>
                <div className="space-y-4">
                  {RELATIONS[birthSign]?.clash && (
                    <Card className="p-6 bg-slate-900/40 border border-gold/10">
                      <div className="text-gold font-serif mb-2 uppercase tracking-widest">Analysis from Clash Partner: {RELATIONS[birthSign].clash}</div>
                      <p className="text-slate-300 text-sm italic">{(BOOK.animals as any)[RELATIONS[birthSign].clash]?.self || 'N/A'}</p>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'co' && (
          <div className="space-y-6 pb-10">
            <h3 className="text-gold font-bold text-lg font-serif uppercase tracking-widest">Sign Codex</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {ANIMALS.map(a => {
                const isDoc = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake'].includes(a.n);
                return (
                  <button
                    key={a.n}
                    onClick={() => isDoc && setSelectedCodex(a.n)}
                    className={`p-4 rounded-xl border-2 transition-all ${selectedCodex === a.n ? 'border-gold bg-gold/10' : 'border-gold/10 bg-slate-900/40'} ${!isDoc && 'opacity-40 cursor-default'}`}
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
                <Card className="p-8 bg-black/60 border border-gold/20 shadow-2xl">
                  <div className="text-4xl mb-4 text-gold font-serif">{selectedCodex} Encyclopedia</div>
                  <div className="space-y-6">
                    {['self', 'clash', 'harm', 'destroy', 'alliance', 'neutral'].map(key => {
                      const content = (BOOK.animals as any)[selectedCodex]?.[key];
                      if (!content) return null;
                      return (
                        <div key={key}>
                          <div className="text-gold uppercase tracking-[0.2em] text-[0.6rem] mb-2 border-b border-gold/10 pb-1">{key.replace('_', ' ')}</div>
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
            <h3 className="text-gold font-bold text-lg font-serif uppercase tracking-widest">Reference Library</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(YEAR_DESCRIPTIONS).map(([key, val]) => (
                <Card key={key} className="p-6 bg-slate-900/40 border border-gold/10 hover:border-gold/30 transition-all">
                  <div className="text-3xl font-serif text-gold mb-2">{key}</div>
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
