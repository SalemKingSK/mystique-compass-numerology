// src/components/profile-generator/numerology-display.tsx
'use client';

import * as React from 'react';
import LoShuGrid from '@/components/lo-shu-grid';
import type { NumerologyData, ArrowData, PersonalYearData } from './types';
import { Wand2, BrainCircuit, Sparkles, Grid, Layers, Compass, Skull, BookUser, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { PERSONAL_YEAR_MEANINGS } from './personal-year-chart';
import { motion, AnimatePresence } from 'framer-motion';
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import { PersonalYearChart } from './personal-year-chart';


const InfoCard = ({ title, value, icon, onClick }: { title: string, value: string | number, icon: React.ReactNode, onClick?: () => void }) => (
    <div
        className={`glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center aspect-square ${onClick ? 'transition-all duration-300 hover:bg-purple-500/20 cursor-pointer' : ''}`}
        onClick={onClick}
    >
        <div className="flex items-center gap-2 text-purple-200/80">
            {icon}
            <p className="text-base font-medium">{title}</p>
        </div>
        <p className="text-5xl font-bold text-yellow-300 mt-2">{value || ''}</p>
    </div>
);

const FateDisplay = React.forwardRef<HTMLDivElement, { id: string, title: string, meaning: string | null, open: boolean, onToggle: () => void }>(
  ({ id, title, meaning, open, onToggle }, ref) => {
    if (!meaning) return null;
    return (
        <div ref={ref}>
            <Accordion type="single" collapsible className="w-full" value={open ? id : ""} onValueChange={onToggle}>
                <AccordionItem value={id} className="glass-card px-4">
                    <AccordionTrigger>
                        <span className="font-semibold text-lg text-primary flex items-center gap-2">
                            <Wand2 className="h-5 w-5" /> {title}
                        </span>
                    </AccordionTrigger>
                    <AccordionContent>
                       <AccordionContentWithPlayer text={meaning} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
  }
);
FateDisplay.displayName = 'FateDisplay';


const PsychicMeaningDisplay = React.forwardRef<HTMLDivElement, { number: number, title: string, meaning: string, open: boolean, onToggle: () => void }>(
    ({ number, title, meaning, open, onToggle }, ref) => {
    if (!meaning) return null;
    return (
        <div className="glass-card p-4 space-y-3" ref={ref}>
            <Accordion type="single" collapsible className="w-full" value={open ? `psychic-${number}`: ''} onValueChange={onToggle}>
                <AccordionItem value={`psychic-${number}`} className="border-b-0">
                    <AccordionTrigger>
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
                            <BookUser className="h-5 w-5" /> Psychic Number {number}: {title}
                        </h3>
                    </AccordionTrigger>
                    <AccordionContent>
                        <AccordionContentWithPlayer text={meaning} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
});
PsychicMeaningDisplay.displayName = 'PsychicMeaningDisplay';

const SpecialTraitDisplay = React.forwardRef<HTMLDivElement, { number: number, meaning: string | null, open: boolean, onToggle: () => void }>(
  ({ number, meaning, open, onToggle }, ref) => {
    if (!meaning) return null;
    return (
        <div ref={ref}>
            <Accordion type="single" collapsible className="w-full" value={open ? `special-trait-${number}` : ""} onValueChange={onToggle}>
                <AccordionItem value={`special-trait-${number}`} className="glass-card px-4">
                    <AccordionTrigger>
                        <span className="font-semibold text-lg text-primary flex items-center gap-2">
                            <Star className="h-5 w-5" /> Special Trait of Birth Day {number}
                        </span>
                    </AccordionTrigger>
                    <AccordionContent>
                       <AccordionContentWithPlayer text={meaning} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
  }
);
SpecialTraitDisplay.displayName = 'SpecialTraitDisplay';

const DestinyMeaningDisplay = React.forwardRef<HTMLDivElement, { number: number, title: string, meaning: string, open: boolean, onToggle: () => void }>(
    ({ number, title, meaning, open, onToggle }, ref) => {
    if (!meaning) return null;
    return (
        <div className="glass-card p-4 space-y-3" ref={ref}>
            <Accordion type="single" collapsible className="w-full" value={open ? `destiny-${number}`: ''} onValueChange={onToggle}>
                <AccordionItem value={`destiny-${number}`} className="border-b-0">
                    <AccordionTrigger>
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
                            <Star className="h-5 w-5" /> Destiny Number {number}: {title}
                        </h3>
                    </AccordionTrigger>
                    <AccordionContent>
                        <AccordionContentWithPlayer text={meaning} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
});
DestinyMeaningDisplay.displayName = 'DestinyMeaningDisplay';

const ArrowsDisplay = React.forwardRef<HTMLDivElement, { arrowsOfStrength: ArrowData[], arrowsOfWeakness: ArrowData[], openItems: string[], onToggle: (value: string[]) => void }>(
    ({ arrowsOfStrength, arrowsOfWeakness, openItems, onToggle }, ref) => {
    if (arrowsOfStrength.length === 0 && arrowsOfWeakness.length === 0) return null;

    const ArrowItem = ({ arrow, type }: { arrow: ArrowData, type: 'Strength' | 'Weakness' }) => {
        return (
            <AccordionItem value={arrow.name} key={arrow.name} className="glass-card px-4">
                <AccordionTrigger>
                    <span className="text-left">Arrow of {type}: {arrow.name}</span>
                </AccordionTrigger>
                <AccordionContent>
                   <AccordionContentWithPlayer text={arrow.description} />
                </AccordionContent>
            </AccordionItem>
        );
    }

    return (
        <div className="glass-card p-4 space-y-3" ref={ref}>
             <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                Arrows of Power
            </h3>
            <Accordion type="multiple" className="w-full space-y-1" value={openItems} onValueChange={onToggle}>
                 {arrowsOfStrength.map(arrow => <ArrowItem key={arrow.name} arrow={arrow} type="Strength" />)}
                 {arrowsOfWeakness.map(arrow => <ArrowItem key={arrow.name} arrow={arrow} type="Weakness" />)}
            </Accordion>
        </div>
    );
});
ArrowsDisplay.displayName = 'ArrowsDisplay';

const RepetitionMeaningsDisplay = React.forwardRef<HTMLDivElement, { numberCounts: { [key: string]: number }, meanings: {[key:string]: string}, openItems: string[], onToggle: (value: string[]) => void }>(
    ({ numberCounts, meanings, openItems, onToggle }, ref) => {
  const repetitions = Object.entries(numberCounts)
    .map(([number, count]) => {
      const key = `${number}_${Math.min(count, 5)}`; // Cap count at 5 as per data structure
      const meaning = meanings[key];
      return { number, count, meaning };
    })
    .filter(item => item.meaning)
    .sort((a,b) => parseInt(a.number) - parseInt(b.number));

  if (repetitions.length === 0) return null;
  
  const RepetitionItem = ({ number, count, meaning }: { number: string, count: number, meaning: string }) => {
      const itemValue = `number-${number}`;
      return (
           <AccordionItem value={itemValue} key={number} className="glass-card px-4">
              <AccordionTrigger>
                 <span>Number {number} (appears {count} time{count > 1 ? 's' : ''})</span>
              </AccordionTrigger>
              <AccordionContent>
                   <AccordionContentWithPlayer text={meaning || ''} />
              </AccordionContent>
          </AccordionItem>
      );
  }

  return (
    <div className="glass-card p-4 space-y-3" ref={ref}>
      <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
        <Layers className="h-5 w-5" /> Repetitive Numbers Meanings
      </h3>
       <Accordion type="multiple" className="w-full space-y-1" value={openItems} onValueChange={onToggle}>
            {repetitions.map(({ number, count, meaning }) => (
                 <RepetitionItem key={number} number={number} count={count} meaning={meaning || ''} />
            ))}
        </Accordion>
    </div>
  );
});
RepetitionMeaningsDisplay.displayName = 'RepetitionMeaningsDisplay';

const KuaDisplay = React.forwardRef<HTMLDivElement, { kuaAttributes: any, open: boolean, onToggle: () => void }>(
    ({ kuaAttributes, open, onToggle }, ref) => {
        if (!kuaAttributes || !kuaAttributes.directions) return null;
        
        return (
             <div ref={ref}>
                <Accordion type="single" collapsible value={open ? 'kua-section' : ''} onValueChange={onToggle}>
                    <AccordionItem value="kua-section" className="border-none">
                         <div className="glass-card p-4 space-y-3 mt-4">
                            <h3 className="font-semibold text-lg text-primary mb-2">Feng Shui Compass</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
                                <div><p className="text-purple-200/70 text-xs">Success</p><p>{kuaAttributes.directions.Success}</p></div>
                                <div><p className="text-purple-200/70 text-xs">Health</p><p>{kuaAttributes.directions.Health}</p></div>
                                <div><p className="text-purple-200/70 text-xs">Family</p><p>{kuaAttributes.directions.Family}</p></div>
                                <div><p className="text-purple-200/70 text-xs">Personal Growth</p><p>{kuaAttributes.directions['Personal-Growth']}</p></div>
                            </div>
                             <div className="grid grid-cols-2 gap-2 text-center text-sm pt-2">
                                <div><p className="text-purple-200/70 text-xs">Element</p><p>{kuaAttributes.element}</p></div>
                                <div><p className="text-purple-200/70 text-xs">Lucky Colors</p><p>{kuaAttributes.lucky_colours?.join(', ')}</p></div>
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

    React.useEffect(() => {
        const currentYear = 2026;
        const reduce = (num: number): number => {
            let n = num;
            while (n > 9) {
                n = String(n).split('').reduce((a, b) => a + Number(b), 0);
            }
            return n || 9;
        };
        
        const pyn = reduce(birthMonth + birthDay + currentYear);
        const powerMap: { [key: number]: number } = { 1: 10, 2: 5, 3: 4, 4: 2, 5: 5, 6: 8, 7: 2, 8: 7, 9: 10 };
        const offsetPerCycle = 3;
        const cycleIndex = Math.floor((currentYear - birthYear) / 9);
        const basePower = powerMap[pyn];
        const power = basePower + cycleIndex * offsetPerCycle;

        setSelectedPersonalYear({
          year: currentYear,
          pyn: pyn,
          power: power,
          meaning: PERSONAL_YEAR_MEANINGS[pyn]
        });
    }, [birthDay, birthMonth, birthYear]);

    const handleYearSelect = (data: PersonalYearData | null) => {
        setSelectedPersonalYear(prev => prev && data && prev.year === data.year ? null : data);
    };

    const psychicRef = React.useRef<HTMLDivElement>(null);
    const specialTraitRef = React.useRef<HTMLDivElement>(null);
    const destinyRef = React.useRef<HTMLDivElement>(null);
    const compoundRef = React.useRef<HTMLDivElement>(null);
    const inherentRef = React.useRef<HTMLDivElement>(null);
    const karmicRef = React.useRef<HTMLDivElement>(null);
    const kuaRef = React.useRef<HTMLDivElement>(null);
    const repetitionRef = React.useRef<HTMLDivElement>(null);
    const arrowsRef = React.useRef<HTMLDivElement>(null);

    const handleToggle = (section: string) => {
        setOpenSections(prev =>
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };

    const handleToggleMultiple = (newSections: string[]) => {
        setOpenSections(newSections);
    };

    const handleScrollAndOpen = (ref: React.RefObject<HTMLDivElement>, sectionId: string) => {
        if (!openSections.includes(sectionId)) {
          handleToggle(sectionId);
        }
        setTimeout(() => {
            ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
    };

    const handlePsycheClick = () => {
        if (specialTraitRef.current) {
            handleScrollAndOpen(specialTraitRef, `special-trait-${birthDay}`);
        } else if (psychicRef.current) {
            handleScrollAndOpen(psychicRef, `psychic-${psycheNum}`);
        }
    };

    const handleGridNumberClick = (number: string) => {
        const sectionId = `number-${number}`;
        setOpenSections(prev => {
            const isOpen = prev.includes(sectionId);
            const newOpenSections = isOpen ? prev.filter(s => s !== sectionId) : [...prev, sectionId];
            setTimeout(() => {
                repetitionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
            return newOpenSections;
        });
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

    const psychicId = `psychic-${psycheNum}`;
    const specialTraitId = `special-trait-${birthDay}`;
    const destinyId = `destiny-${destinyNum}`;
    const compoundId = `compound-fate`;
    const inherentId = `inherent-fate`;
    const karmicId = `karmic-fate`;
    const kuaId = 'kua-section';


  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard title="Psyche Number" value={psycheNum} icon={<BrainCircuit className="h-6 w-6" />} onClick={handlePsycheClick} />
        <InfoCard title="Destiny Number" value={destinyNum} icon={<Sparkles className="h-6 w-6" />} onClick={() => handleScrollAndOpen(destinyRef, destinyId)} />
        <InfoCard title="Kua Number" value={kuaNum} icon={<Compass className="h-6 w-6" />} onClick={() => handleScrollAndOpen(kuaRef, kuaId)} />
        <InfoCard title="Compound Number" value={compoundNum} icon={<Skull className="h-6 w-6" />} onClick={() => handleScrollAndOpen(compoundRef, compoundId)}/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoShuGrid
            title="Lo Shu Grid - Numbers"
            gridData={loShuGrid}
            arrows={[]}
            onNumberClick={handleGridNumberClick}
        />
        <LoShuGrid
            title="Lo Shu Grid - Arrows"
            gridData={loShuGrid}
            arrows={[...arrowsOfStrength.map(a => ({ ...a, type: 'strength' as const})), ...arrowsOfWeakness.map(a => ({ ...a, type: 'weakness' as const}))]}
            onArrowClick={handleArrowClick}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mt-10"
      >
        <PersonalYearChart
          birthDay={birthDay}
          birthMonth={birthMonth}
          birthYear={birthYear}
          onYearSelect={handleYearSelect}
          selectedPersonalYear={selectedPersonalYear}
        />
      </motion.div>

      <AnimatePresence>
        {selectedPersonalYear && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <div className="glass-card px-4">
              <Accordion type="single" collapsible defaultValue="personal-year-detail" value={selectedPersonalYear ? "personal-year-detail" : ""}>
                <AccordionItem value="personal-year-detail">
                  <AccordionTrigger>
                    <span className="font-semibold text-lg text-primary flex items-center gap-2">
                      <Star className="h-5 w-5" /> Personal Year {selectedPersonalYear.pyn} - {selectedPersonalYear.year}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <AccordionContentWithPlayer text={selectedPersonalYear.meaning} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
         <FateDisplay ref={compoundRef} id={compoundId} title={`Compound Fate: ${compoundNum}`} meaning={compoundMeaning} open={openSections.includes(compoundId)} onToggle={() => handleToggle(compoundId)}/>
         {reducedCompoundNum && <FateDisplay ref={inherentRef} id={inherentId} title={`Inherent Fate: ${reducedCompoundNum}`} meaning={reducedCompoundMeaning} open={openSections.includes(inherentId)} onToggle={() => handleToggle(inherentId)} />}
         {karmicFateNum && <FateDisplay ref={karmicRef} id={karmicId} title={`Karmic Fate: ${karmicFateNum}`} meaning={karmicFateMeaning} open={openSections.includes(karmicId)} onToggle={() => handleToggle(karmicId)} />}
      </div>

      {psychicMeaning && <PsychicMeaningDisplay ref={psychicRef} number={psycheNum} title={psychicMeaning.title} meaning={psychicMeaning.description} open={openSections.includes(psychicId)} onToggle={() => handleToggle(psychicId)} />}

      {specialTraitMeaning && <SpecialTraitDisplay ref={specialTraitRef} number={birthDay} meaning={specialTraitMeaning} open={openSections.includes(specialTraitId)} onToggle={() => handleToggle(specialTraitId)} />}

      {destinyMeaning && <DestinyMeaningDisplay ref={destinyRef} number={destinyNum} title={destinyMeaning.title} meaning={destinyMeaning.description} open={openSections.includes(destinyId)} onToggle={() => handleToggle(destinyId)} />}

      <RepetitionMeaningsDisplay ref={repetitionRef} numberCounts={numberCounts} meanings={repeatedNumberMeanings} openItems={openSections} onToggle={handleToggleMultiple}/>

      <ArrowsDisplay ref={arrowsRef} arrowsOfStrength={arrowsOfStrength} arrowsOfWeakness={arrowsOfWeakness} openItems={openSections} onToggle={handleToggleMultiple} />

      <div ref={kuaRef}>
          <KuaDisplay kuaAttributes={kuaAttributes} open={openSections.includes(kuaId)} onToggle={() => handleToggle(kuaId)} />
      </div>

    </div>
  );
}
