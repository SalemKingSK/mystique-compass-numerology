'use client';

import * as React from 'react';
import LoShuGrid from '@/components/lo-shu-grid';
import type { NumerologyData, ArrowData, PersonalYearData } from './types';
import { Wand2, BrainCircuit, Sparkles, Grid, Layers, Compass, Skull, BookUser, Star, Activity, ChevronRight, CalendarDays, Zap, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { motion, AnimatePresence } from 'framer-motion';
import { PersonalYearChart } from './personal-year-chart';
import { ZodiacSection } from './zodiac-section';
import LoshuArrowDetailPanel from '@/components/LoshuArrowDetailPanel';
import { FateChambers } from './fate-chambers';
import { CoreVibrations } from './core-vibrations';

const InfoCard = ({ title, value, icon, onClick }: { title: string, value: string | number, icon: React.ReactNode, onClick?: () => void }) => (
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

const ArrowsDisplay = React.forwardRef<HTMLDivElement, { arrowsOfStrength: ArrowData[], arrowsOfWeakness: ArrowData[], openItems: string[], onToggle: (value: string[]) => void, birthDate: string, numberCounts: Record<number, number> }>(
    ({ arrowsOfStrength, arrowsOfWeakness, openItems, onToggle, birthDate, numberCounts }, ref) => {
    
    const categories = Array.from(new Set([
        ...arrowsOfStrength.map(a => a.category),
        ...arrowsOfWeakness.map(a => a.category)
    ])).filter(Boolean);

    const renderArrowItem = (arrow: ArrowData) => {
        const isShadow = arrow.type === 'shadow' || arrow.type === 'weakness';
        const numbersString = arrow.numbers.join('-');
        return (
            <AccordionItem value={arrow.name} key={arrow.name} className="glass-card px-4 mb-1 border-l-[3px] border-l-[#c8a84b]/40">
                <AccordionTrigger>
                    <span className={`text-left font-cinzel text-[0.7rem] uppercase tracking-wider flex items-center gap-2 ${isShadow ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {isShadow ? <ChevronRight className="h-3 w-3 rotate-90" /> : <ChevronRight className="h-3 w-3" />}
                        {arrow.name} ({numbersString})
                    </span>
                </AccordionTrigger>
                <AccordionContent className="font-body text-base leading-relaxed">
                   <LoshuArrowDetailPanel 
                      arrowId={arrow.id} 
                      existingMeaning={arrow.description} 
                      birthDate={birthDate} 
                      externalCounts={numberCounts as any}
                   />
                </AccordionContent>
            </AccordionItem>
        );
    }

    return (
        <div className="glass-card p-4 space-y-6" ref={ref}>
             <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <h3 className="font-cinzel font-semibold text-[0.75rem] text-primary flex items-center gap-2 uppercase tracking-[0.3em]">
                    <Activity className="h-4 w-4" /> Arrows of Power
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>

            {categories.map(cat => (
                <div key={cat} className="space-y-2">
                    <h4 className="font-cinzel text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em] mb-2 px-2 border-l border-primary/30">
                        {cat}
                    </h4>
                    <Accordion type="multiple" className="w-full" value={openItems} onValueChange={onToggle}>
                        {[...arrowsOfStrength, ...arrowsOfWeakness]
                            .filter(a => (a.category || (a.type === 'shadow' ? 'Deficiency' : 'Primary Plane')) === cat)
                            .map(renderArrowItem)}
                    </Accordion>
                </div>
            ))}
        </div>
    );
});
ArrowsDisplay.displayName = 'ArrowsDisplay';

const KuaDisplay = React.forwardRef<HTMLDivElement, { kuaAttributes: any, open: boolean, onToggle: () => void }>(
    ({ kuaAttributes, open, onToggle }, ref) => {
        if (!kuaAttributes || !kuaAttributes.directions) return null;
        
        return (
             <div ref={ref}>
                <Accordion type="single" collapsible value={open ? 'kua-section' : ''} onValueChange={onToggle}>
                    <AccordionItem value="kua-section" className="border-none">
                         <div className="glass-card p-4 space-y-3 mt-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                                <h3 className="font-cinzel font-semibold text-[0.75rem] text-primary uppercase tracking-[0.3em]">Feng Shui Compass</h3>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <p className="font-cinzel text-purple-200/70 text-[0.55rem] uppercase tracking-widest mb-1">Success</p>
                                    <p className="font-body text-sm font-bold text-yellow-300">{kuaAttributes.directions.Success}</p>
                                </div>
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <p className="font-cinzel text-purple-200/70 text-[0.55rem] uppercase tracking-widest mb-1">Health</p>
                                    <p className="font-body text-sm font-bold text-yellow-300">{kuaAttributes.directions.Health}</p>
                                </div>
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <p className="font-cinzel text-purple-200/70 text-[0.55rem] uppercase tracking-widest mb-1">Family</p>
                                    <p className="font-body text-sm font-bold text-yellow-300">{kuaAttributes.directions.Family}</p>
                                </div>
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <p className="font-cinzel text-purple-200/70 text-[0.55rem] uppercase tracking-widest mb-1">Growth</p>
                                    <p className="font-body text-sm font-bold text-yellow-300">{kuaAttributes.directions['Personal-Growth']}</p>
                                </div>
                            </div>
                             <div className="grid grid-cols-2 gap-2 text-center text-sm pt-2">
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <p className="font-cinzel text-purple-200/70 text-[0.55rem] uppercase tracking-widest mb-1">Element</p>
                                    <p className="font-body text-sm">{kuaAttributes.element}</p>
                                </div>
                                <div className="p-2 bg-white/5 rounded-lg">
                                    <p className="font-cinzel text-purple-200/70 text-[0.55rem] uppercase tracking-widest mb-1">Lucky Colors</p>
                                    <div className="flex items-center justify-center gap-2 mt-1">
                                        <p className="font-body text-sm">{kuaAttributes.lucky_colours?.join(', ')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>
        )
    }
);
KuaDisplay.displayName = 'KuaDisplay';

export function NumerologyDisplay({ numerology }: { numerology: NumerologyData }) {
    const {
        birthDay,
        birthMonth,
        birthYear,
        psycheNum,
        destinyNum,
        kuaNum,
        loShuGrid,
        arrowsOfStrength,
        arrowsOfWeakness,
        kuaAttributes,
        compoundNum,
        compoundMeaning,
        reducedCompoundNum,
        reducedCompoundMeaning,
        karmicFateNum,
        karmicFateMeaning,
        numberCounts,
        repeatedNumberMeanings,
        psychicMeaning,
        specialTraitMeaning,
        destinyMeaning,
    } = numerology;
    
    const [openSections, setOpenSections] = React.useState<string[]>([]);
    const [selectedPersonalYear, setSelectedPersonalYear] = React.useState<PersonalYearData | null>(null);
    const [personalYearAccordionValue, setPersonalYearAccordionValue] = React.useState<string>("");
    const [activeCoreLayer, setActiveCoreLayer] = React.useState<string | null>(null);
    const [activeFateLayer, setActiveFateLayer] = React.useState<number | null>(null);
    const [openPYLayer, setOpenPYLayer] = React.useState<number | null>(1);

    const coreVibrationsRef = React.useRef<HTMLDivElement>(null);
    const fateChambersRef = React.useRef<HTMLDivElement>(null);
    const arrowsRef = React.useRef<HTMLDivElement>(null);
    const kuaRef = React.useRef<HTMLDivElement>(null);
    const pyDetailRef = React.useRef<HTMLDivElement>(null);

    const handleYearSelect = (data: PersonalYearData | null) => {
        if (data?.year !== selectedPersonalYear?.year) {
            setSelectedPersonalYear(data);
            if (data) {
                setPersonalYearAccordionValue("personal-year-detail");
                setOpenPYLayer(1);
                setTimeout(() => {
                    pyDetailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 150);
            } else {
                setPersonalYearAccordionValue("");
            }
        }
    };

    const handleCoreNavigation = (layerId: string) => {
        setActiveCoreLayer(layerId);
        setTimeout(() => {
            coreVibrationsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
    }

    const handleFateNavigation = (layerNum: number) => {
        setActiveFateLayer(layerNum);
        setTimeout(() => {
            fateChambersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
    }

    const handleToggle = (section: string) => {
        setOpenSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    const handleToggleMultiple = (newSections: string[]) => {
        setOpenSections(newSections);
    };

    const handleArrowClick = (arrowName: string) => {
       setOpenSections(prev => {
            const newOpenSections = prev.includes(arrowName)
                ? prev.filter(s => s !== arrowName)
                : [...prev, arrowName];
            setTimeout(() => {
                arrowsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            return newOpenSections;
        });
    }

    const togglePYLayer = (num: number) => setOpenPYLayer(openPYLayer === num ? null : num);

    const kuaId = 'kua-section';
    const birthDateString = `${birthDay}-${birthMonth}-${birthYear}`;

  return (
    <div className="space-y-4 pb-20">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard title="Psyche Number" value={psycheNum} icon={<BrainCircuit className="h-6 w-6" />} onClick={() => handleCoreNavigation('psyche')} />
        <InfoCard title="Destiny Number" value={destinyNum} icon={<Sparkles className="h-6 w-6" />} onClick={() => handleCoreNavigation('destiny')} />
        <InfoCard title="Kua Number" value={kuaNum} icon={<Compass className="h-6 w-6" />} onClick={() => handleToggle(kuaId)} />
        {compoundNum && <InfoCard title="Compound Number" value={compoundNum} icon={<Skull className="h-6 w-6" />} onClick={() => handleFateNavigation(1)} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoShuGrid
            title="Lo Shu Grid - Numbers"
            gridData={loShuGrid}
            arrows={[]}
            numberCounts={numberCounts}
            repeatedNumberMeanings={repeatedNumberMeanings}
            birthDate={birthDateString}
        />
        <LoShuGrid
            title="Lo Shu Grid - Planes"
            gridData={loShuGrid}
            arrows={[...arrowsOfStrength.map(a => ({ ...a, type: 'strength' as const})), ...arrowsOfWeakness.map(a => ({ ...a, type: 'shadow' as const}))]}
            onArrowClick={handleArrowClick}
            numberCounts={numberCounts}
            repeatedNumberMeanings={repeatedNumberMeanings}
            birthDate={birthDateString}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mt-10"
      >
        <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <h2 className="font-cinzel font-semibold text-[0.75rem] text-primary uppercase tracking-[0.3em]">Personal Year Cycle</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
        <PersonalYearChart
          birthDay={birthDay}
          birthMonth={birthMonth}
          birthYear={birthYear}
          onYearSelect={handleYearSelect}
        />
      </motion.div>

      <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="zodiac-trajectory" className="glass-card px-4 border-l-[3px] border-l-[#c8a84b]/40">
                  <AccordionTrigger className="font-cinzel font-semibold text-[0.8rem] text-primary flex items-center gap-2 uppercase tracking-widest">
                      <span className="flex items-center gap-2">☯ Zodiac Trajectory</span>
                  </AccordionTrigger>
                  <AccordionContent>
                      <ZodiacSection 
                        birthDay={birthDay} 
                        birthMonth={birthMonth} 
                        birthYear={birthYear} 
                      />
                  </AccordionContent>
              </AccordionItem>
          </Accordion>
      </div>

      <AnimatePresence>
        {selectedPersonalYear && (
          <motion.div
            ref={pyDetailRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <div className="glass-card p-4 space-y-4">
                <div className="flex items-center gap-4 mb-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    <h3 className="font-cinzel font-semibold text-[0.75rem] text-primary flex items-center gap-2 uppercase tracking-[0.3em]">
                        <Star className="h-4 w-4" /> Personal Year Oracle
                    </h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                </div>

                <div className="flex flex-col">
                    <div className="py-accordion">
                        <button className="py-acc-header" onClick={() => togglePYLayer(1)}>
                            <div className="py-acc-left">
                                <span className="py-layer-badge" style={{ background: "#9b8ec422", color: "#9b8ec4", borderColor: "#9b8ec455" }}>Layer 1</span>
                                <span className="py-acc-title">Annual Resonance ({selectedPersonalYear.year})</span>
                            </div>
                            <span className="py-acc-arrow" style={{ transform: openPYLayer === 1 ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                        </button>
                        {openPYLayer === 1 && (
                            <div className="py-acc-body">
                                <div className="py-meaning-card" style={{ borderLeftColor: "#9b8ec4" }}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <CalendarDays className="h-4 w-4 text-[#9b8ec4]" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#9b8ec4]">Personal Year {selectedPersonalYear.pyn} Vibration</span>
                                    </div>
                                    <p className="font-body text-base text-slate-200 italic mb-2">Cycle Year {selectedPersonalYear.pyn}: A threshold of significant transition.</p>
                                    <AccordionContentWithPlayer text={`In the year ${selectedPersonalYear.year}, you are navigating the frequency of Personal Year ${selectedPersonalYear.pyn}. This is a period dedicated to ${selectedPersonalYear.meaning.split('.')[0]}.`} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="py-accordion">
                        <button className="py-acc-header" onClick={() => togglePYLayer(2)}>
                            <div className="py-acc-left">
                                <span className="py-layer-badge" style={{ background: "#3a8ee022", color: "#3a8ee0", borderColor: "#3a8ee055" }}>Layer 2</span>
                                <span className="py-acc-title">Celestial Momentum</span>
                            </div>
                            <span className="py-acc-arrow" style={{ transform: openPYLayer === 2 ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                        </button>
                        {openPYLayer === 2 && (
                            <div className="py-acc-body">
                                <div className="py-meaning-card" style={{ borderLeftColor: "#3a8ee0" }}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Zap className="h-4 w-4 text-[#3a8ee0]" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#3a8ee0]">Energy Distribution</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                                            <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Power Quotient</p>
                                            <p className="text-2xl font-decorative text-yellow-300">{selectedPersonalYear.power}/10</p>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-center">
                                            <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">Cycle State</p>
                                            <p className="text-xs font-cinzel text-primary uppercase">{selectedPersonalYear.pyn <= 4 ? 'Ascending' : selectedPersonalYear.pyn <= 7 ? 'Consolidating' : 'Harvesting'}</p>
                                        </div>
                                    </div>
                                    <AccordionContentWithPlayer text={`This year carries a power level of ${selectedPersonalYear.power} out of 10. In the current 9-year cycle, this represents a phase of ${selectedPersonalYear.pyn <= 4 ? 'initial growth and foundational work' : selectedPersonalYear.pyn <= 7 ? 'inner refinement and introspection' : 'peak manifestation and eventual release'}.`} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="py-accordion">
                        <button className="py-acc-header" onClick={() => togglePYLayer(3)}>
                            <div className="py-acc-left">
                                <span className="py-layer-badge" style={{ background: "#e0a83a22", color: "#e0a83a", borderColor: "#e0a83a55" }}>Layer 3</span>
                                <span className="py-acc-title">The Curriculum</span>
                            </div>
                            <span className="py-acc-arrow" style={{ transform: openPYLayer === 3 ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
                        </button>
                        {openPYLayer === 3 && (
                            <div className="py-acc-body">
                                <div className="py-meaning-card" style={{ borderLeftColor: "#e0a83a" }}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Info className="h-4 w-4 text-[#e0a83a]" />
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#e0a83a]">Spiritual Guidance</span>
                                    </div>
                                    <AccordionContentWithPlayer text={selectedPersonalYear.meaning} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style jsx>{`
                .py-accordion { border-top: 1px solid #2a2340; }
                .py-accordion:first-of-type { border-top: none; }
                .py-acc-header { width: 100%; background: transparent; border: none; padding: 14px 0; display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 10px; }
                .py-acc-left { display: flex; align-items: center; gap: 10px; }
                .py-acc-title { font-size: 13.5px; font-weight: 600; letter-spacing: 0.03em; color: #c4b8e8; text-align: left; font-family: 'Cinzel', serif; }
                .py-acc-arrow { font-size: 18px; color: #7a6fa0; transition: transform 0.2s ease; line-height: 1; }
                .py-acc-body { padding: 4px 0 18px; animation: pyFadeIn 0.2s ease; }
                @keyframes pyFadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
                .py-layer-badge { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; padding: 2px 7px; border-radius: 20px; border: 1px solid; white-space: nowrap; font-family: 'Cinzel', serif; }
                .py-meaning-card { background: rgba(255,255,255,0.02); border-left: 3px solid; border-radius: 0 10px 10px 0; padding: 16px; }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={coreVibrationsRef}>
        <CoreVibrations 
          psycheNum={psycheNum}
          psycheMeaning={psychicMeaning}
          destinyNum={destinyNum}
          destinyMeaning={destinyMeaning}
          birthDay={birthDay}
          specialTraitMeaning={specialTraitMeaning}
          activeLayer={activeCoreLayer}
          onLayerToggle={setActiveCoreLayer}
        />
      </div>

      <div ref={fateChambersRef}>
        <FateChambers 
          compoundNum={compoundNum}
          compoundMeaning={compoundMeaning}
          reducedCompoundNum={reducedCompoundNum}
          reducedCompoundMeaning={reducedCompoundMeaning}
          karmicFateNum={karmicFateNum}
          karmicFateMeaning={karmicFateMeaning}
          activeLayer={activeFateLayer}
          onLayerToggle={setActiveFateLayer}
        />
      </div>

      <ArrowsDisplay 
        ref={arrowsRef} 
        arrowsOfStrength={arrowsOfStrength} 
        arrowsOfWeakness={arrowsOfWeakness} 
        openItems={openSections} 
        onToggle={handleToggleMultiple} 
        birthDate={birthDateString}
        numberCounts={numberCounts as any}
      />

      <div ref={kuaRef}>
          <KuaDisplay kuaAttributes={kuaAttributes} open={openSections.includes(kuaId)} onToggle={() => handleToggle(kuaId)} />
      </div>

    </div>
  );
}
