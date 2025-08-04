// src/components/profile-generator/numerology-display.tsx
'use client';

import * as React from 'react';
import LoShuGrid from '@/components/lo-shu-grid';
import type { NumerologyData, ArrowData } from './types';
import { Wand2, BrainCircuit, Sparkles, Grid, Layers, Compass, Skull, BookUser, Star } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { SpeechPlayer } from './speech-player';
import { ScrollableTextDisplay } from './scrollable-text-display';


const InfoCard = ({ title, value, icon, onClick }: { title: string, value: string | number, icon: React.ReactNode, onClick?: () => void }) => (
    <div 
        className={`glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center aspect-square ${onClick ? 'transition-all duration-300 hover:bg-purple-500/20 cursor-pointer' : ''}`}
        onClick={onClick}
    >
        <div className="flex items-center gap-2 text-purple-300/80">
            {icon}
            <p className="text-base font-medium">{title}</p>
        </div>
        <p className="text-5xl font-bold text-yellow-300 mt-2">{value}</p>
    </div>
);

const AccordionContentWithPlayer = ({ text }: { text: string }) => {
    const [activeSentenceIndex, setActiveSentenceIndex] = React.useState(-1);
    const sentences = React.useMemo(() => text.match(/[^.!?\n]+[.!?\n]+/g) || [text], [text]);
    return (
        <div className="space-y-4">
            <SpeechPlayer 
                text={text} 
                sentences={sentences}
                onBoundary={setActiveSentenceIndex}
                onEnd={() => setActiveSentenceIndex(-1)}
            />
            <ScrollableTextDisplay 
                text={text}
                sentences={sentences}
                activeSentenceIndex={activeSentenceIndex}
            />
        </div>
    )
}

const FateDisplay = React.forwardRef<HTMLDivElement, { title: string, meaning: string | null, open: boolean, onToggle: () => void }>(
  ({ title, meaning, open, onToggle }, ref) => {
    if (!meaning) return null;
    return (
        <div ref={ref}>
            <Accordion type="single" collapsible className="w-full" value={open ? "item-1" : ""} onValueChange={onToggle}>
                <AccordionItem value="item-1" className="glass-card px-4">
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

const KuaDisplay = React.forwardRef<HTMLDivElement, { kuaAttributes: any, auspiciousDirections: any, open: boolean, onToggle: () => void }>(
    ({ kuaAttributes, auspiciousDirections, open, onToggle }, ref) => {
        return (
             <div ref={ref}>
                <Accordion type="single" collapsible value={open ? 'kua-section' : ''} onValueChange={onToggle}>
                    <AccordionItem value="kua-section" className="border-none">
                        <AccordionContent>
                            {kuaAttributes && (
                                <div className="glass-card p-4 space-y-2">
                                    <h3 className="font-semibold text-lg text-primary">Kua Attributes</h3>
                                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                        <div><p className="text-purple-200/70 text-xs">Element</p><p>{kuaAttributes.element}</p></div>
                                        <div><p className="text-purple-200/70 text-xs">Colors</p><p>{kuaAttributes.colors}</p></div>
                                        <div><p className="text-purple-200/70 text-xs">Season</p><p>{kuaAttributes.season}</p></div>
                                    </div>
                                </div>
                            )}
                            {auspiciousDirections && (
                                <div className="glass-card p-4 space-y-2 mt-4">
                                    <h3 className="font-semibold text-lg text-primary">Auspicious Directions</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
                                        <div><p className="text-purple-200/70 text-xs">Success</p><p>{auspiciousDirections.Success}</p></div>
                                        <div><p className="text-purple-200/70 text-xs">Health</p><p>{auspiciousDirections.Health}</p></div>
                                        <div><p className="text-purple-200/70 text-xs">Family</p><p>{auspiciousDirections.Family}</p></div>
                                        <div><p className="text-purple-200/70 text-xs">Personal Growth</p><p>{auspiciousDirections['Personal-Growth']}</p></div>
                                    </div>
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        )
    }
);
KuaDisplay.displayName = 'KuaDisplay';


export function NumerologyDisplay({ numerology }: { numerology: NumerologyData }) {
    const [openSections, setOpenSections] = React.useState<string[]>([]);
    
    const psychicRef = React.useRef<HTMLDivElement>(null);
    const destinyRef = React.useRef<HTMLDivElement>(null);
    const compoundRef = React.useRef<HTMLDivElement>(null);
    const kuaRef = React.useRef<HTMLDivElement>(null);
    const repetitionRef = React.useRef<HTMLDivElement>(null);
    const arrowsRef = React.useRef<HTMLDivElement>(null);

    const handleToggle = (section: string) => {
        setOpenSections(prev => 
            prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
        );
    };
    
    const handleToggleMultiple = (sections: string[]) => {
        setOpenSections(sections);
    }
    
    const handleScrollAndOpen = (ref: React.RefObject<HTMLDivElement>, sectionId: string) => {
        // Use a functional update to ensure we have the latest state
        setOpenSections(prev => {
            if (prev.includes(sectionId)) {
                 // To allow re-clicking to scroll again, we can't just return prev.
                 // But for this simple case, we assume user won't re-click to scroll to the same spot.
                 // If it's already open, do nothing to the state.
                return prev;
            }
            return [...prev, sectionId]; // Add the new section to be opened
        });

        // The scroll needs to happen after the state update has rendered
        setTimeout(() => {
            ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };
    
    const handleScrollAndOpenMultiple = (ref: React.RefObject<HTMLDivElement>, sectionId: string) => {
        setOpenSections(prev => {
            const alreadyOpen = prev.includes(sectionId);
            if (alreadyOpen) {
                // If you want clicking an open item to do nothing, return prev.
                // If you want it to close, use filter. For now, let's just ensure it's open.
                return prev;
            }
            return [...prev, sectionId];
        });

        setTimeout(() => {
            ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };


    const handleGridNumberClick = (number: string) => {
        const sectionId = `number-${number}`;
        handleScrollAndOpenMultiple(repetitionRef, sectionId);
    };

    const handleArrowClick = (arrowName: string) => {
        handleScrollAndOpenMultiple(arrowsRef, arrowName);
    }

    const {
        psycheNum,
        destinyNum,
        kuaNum,
        loShuGrid,
        arrowsOfStrength,
        arrowsOfWeakness,
        kuaAttributes,
        auspiciousDirections,
        compoundNum,
        compoundMeaning,
        reducedCompoundNum,
        reducedCompoundMeaning,
        karmicFateNum,
        karmicFateMeaning,
        numberCounts,
        repeatedNumberMeanings,
        psychicMeaning,
        destinyMeaning,
    } = numerology;

    const psychicId = `psychic-${psycheNum}`;
    const destinyId = `destiny-${destinyNum}`;
    const compoundId = `compound-fate`;
    const kuaId = 'kua-section';


  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard title="Psyche Number" value={psycheNum} icon={<BrainCircuit className="h-6 w-6" />} onClick={() => handleScrollAndOpen(psychicRef, psychicId)} />
        <InfoCard title="Destiny Number" value={destinyNum} icon={<Sparkles className="h-6 w-6" />} onClick={() => handleScrollAndOpen(destinyRef, destinyId)} />
        <InfoCard title="Kua Number" value={kuaNum} icon={<Compass className="h-6 w-6" />} onClick={() => handleScrollAndOpen(kuaRef, kuaId)} />
        <InfoCard title="Compound Number" value={compoundNum} icon={<Skull className="h-6 w-6" />} onClick={() => handleScrollAndOpen(compoundRef, compoundId)}/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoShuGrid 
            gridData={loShuGrid} 
            arrows={[...arrowsOfStrength.map(a => ({ ...a, type: 'strength' as const})), ...arrowsOfWeakness.map(a => ({ ...a, type: 'weakness' as const}))]} 
            onNumberClick={handleGridNumberClick} 
            onArrowClick={handleArrowClick}
        />
        <div className="space-y-4">
           {compoundMeaning && <FateDisplay ref={compoundRef} title={`Compound Fate: ${compoundNum}`} meaning={compoundMeaning} open={openSections.includes(compoundId)} onToggle={() => handleToggle(compoundId)}/>}
           {reducedCompoundMeaning && <FateDisplay title={`Inherent Fate: ${reducedCompoundNum}`} meaning={reducedCompoundMeaning} open={false} onToggle={() => {}}/>}
           {karmicFateMeaning && <FateDisplay title={`Karmic Fate: ${karmicFateNum}`} meaning={karmicFateMeaning} open={false} onToggle={() => {}} />}
        </div>
      </div>
      
      {psychicMeaning && <PsychicMeaningDisplay ref={psychicRef} number={psycheNum} title={psychicMeaning.title} meaning={psychicMeaning.description} open={openSections.includes(psychicId)} onToggle={() => handleToggle(psychicId)} />}

      {destinyMeaning && <DestinyMeaningDisplay ref={destinyRef} number={destinyNum} title={destinyMeaning.title} meaning={destinyMeaning.description} open={openSections.includes(destinyId)} onToggle={() => handleToggle(destinyId)} />}
      
      <RepetitionMeaningsDisplay ref={repetitionRef} numberCounts={numberCounts} meanings={repeatedNumberMeanings} openItems={openSections} onToggle={handleToggleMultiple}/>

      <ArrowsDisplay ref={arrowsRef} arrowsOfStrength={arrowsOfStrength} arrowsOfWeakness={arrowsOfWeakness} openItems={openSections} onToggle={handleToggleMultiple} />
      
      <div ref={kuaRef}>
          <KuaDisplay kuaAttributes={kuaAttributes} auspiciousDirections={auspiciousDirections} open={openSections.includes(kuaId)} onToggle={() => handleToggle(kuaId)} />
      </div>

    </div>
  );
}
