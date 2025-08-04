// src/components/profile-generator/numerology-display.tsx
'use client';

import * as React from 'react';
import LoShuGrid from '@/components/lo-shu-grid';
import type { NumerologyData, ArrowData } from './types';
import { Wand2, BrainCircuit, Sparkles, Grid, Layers, Compass, Skull, BookUser } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { SpeechPlayer } from './speech-player';


const InfoCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
    <div className="glass-card p-4 rounded-xl flex flex-col items-center justify-center text-center aspect-square">
        <div className="flex items-center gap-2 text-purple-300/80">
            {icon}
            <p className="text-base font-medium">{title}</p>
        </div>
        <p className="text-5xl font-bold text-yellow-300 mt-2">{value}</p>
    </div>
);


const FateDisplay = ({ title, meaning }: { title: string, meaning: string | null }) => {
    if (!meaning) return null;
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="glass-card px-4">
                <AccordionTrigger>
                    <span className="font-semibold text-lg text-primary flex items-center gap-2">
                        <Wand2 className="h-5 w-5" /> {title}
                    </span>
                </AccordionTrigger>
                <AccordionContent>
                   <SpeechPlayer text={meaning} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

const PsychicMeaningDisplay = ({ number, title, meaning }: { number: number, title: string, meaning: string }) => {
    if (!meaning) return null;
    return (
        <div className="glass-card p-4 space-y-3">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`psychic-${number}`} className="border-b-0">
                    <AccordionTrigger>
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2">
                            <BookUser className="h-5 w-5" /> Psychic Number {number}: {title}
                        </h3>
                    </AccordionTrigger>
                    <AccordionContent>
                        <SpeechPlayer text={meaning} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

const ArrowsDisplay = ({ arrowsOfStrength, arrowsOfWeakness }: { arrowsOfStrength: ArrowData[], arrowsOfWeakness: ArrowData[] }) => {
    if (arrowsOfStrength.length === 0 && arrowsOfWeakness.length === 0) return null;

    const ArrowItem = ({ arrow, type }: { arrow: ArrowData, type: 'Strength' | 'Weakness' }) => {
        return (
            <AccordionItem value={arrow.name} key={arrow.name} className="glass-card px-4">
                <AccordionTrigger>
                    <span className="text-left">Arrow of {type}: {arrow.name}</span>
                </AccordionTrigger>
                <AccordionContent>
                   <SpeechPlayer text={arrow.description} />
                </AccordionContent>
            </AccordionItem>
        );
    }

    return (
        <div className="glass-card p-4 space-y-3">
             <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                Arrows of Power
            </h3>
            <Accordion type="multiple" className="w-full space-y-1">
                 {arrowsOfStrength.map(arrow => <ArrowItem key={arrow.name} arrow={arrow} type="Strength" />)}
                 {arrowsOfWeakness.map(arrow => <ArrowItem key={arrow.name} arrow={arrow} type="Weakness" />)}
            </Accordion>
        </div>
    );
};

const RepetitionMeaningsDisplay = ({ numberCounts, meanings }: { numberCounts: { [key: string]: number }, meanings: {[key:string]: string} }) => {
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
      return (
           <AccordionItem value={`number-${number}`} key={number} className="glass-card px-4">
              <AccordionTrigger>
                 <span>Number {number} (appears {count} time{count > 1 ? 's' : ''})</span>
              </AccordionTrigger>
              <AccordionContent>
                   <SpeechPlayer text={meaning || ''} />
              </AccordionContent>
          </AccordionItem>
      );
  }

  return (
    <div className="glass-card p-4 space-y-3">
      <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
        <Layers className="h-5 w-5" /> Repetitive Numbers Meanings
      </h3>
       <Accordion type="multiple" className="w-full space-y-1">
            {repetitions.map(({ number, count, meaning }) => (
                 <RepetitionItem key={number} number={number} count={count} meaning={meaning || ''} />
            ))}
        </Accordion>
    </div>
  );
};


export function NumerologyDisplay({ numerology }: { numerology: NumerologyData }) {
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
        psychicMeaning
    } = numerology;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard title="Psyche Number" value={psycheNum} icon={<BrainCircuit className="h-6 w-6" />} />
        <InfoCard title="Destiny Number" value={destinyNum} icon={<Sparkles className="h-6 w-6" />} />
        <InfoCard title="Kua Number" value={kuaNum} icon={<Compass className="h-6 w-6" />} />
        <InfoCard title="Fate Number" value={compoundNum} icon={<Skull className="h-6 w-6" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoShuGrid gridData={loShuGrid} arrows={[...arrowsOfStrength.map(a => ({ ...a, type: 'strength' as const})), ...arrowsOfWeakness.map(a => ({ ...a, type: 'weakness' as const}))]} />
        <div className="space-y-4">
           {compoundMeaning && <FateDisplay title={`Compound Fate: ${compoundNum}`} meaning={compoundMeaning} />}
           {reducedCompoundMeaning && <FateDisplay title={`Inherent Fate: ${reducedCompoundNum}`} meaning={reducedCompoundMeaning} />}
           {karmicFateMeaning && <FateDisplay title={`Karmic Fate: ${karmicFateNum}`} meaning={karmicFateMeaning} />}
        </div>
      </div>
      
      {psychicMeaning && <PsychicMeaningDisplay number={psycheNum} title={psychicMeaning.title} meaning={psychicMeaning.description} />}
      
      <RepetitionMeaningsDisplay numberCounts={numberCounts} meanings={repeatedNumberMeanings}/>

      <ArrowsDisplay arrowsOfStrength={arrowsOfStrength} arrowsOfWeakness={arrowsOfWeakness} />

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
          <div className="glass-card p-4 space-y-2">
            <h3 className="font-semibold text-lg text-primary">Auspicious Directions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-sm">
                <div><p className="text-purple-200/70 text-xs">Success</p><p>{auspiciousDirections.Success}</p></div>
                <div><p className="text-purple-200/70 text-xs">Health</p><p>{auspiciousDirections.Health}</p></div>
                <div><p className="text-purple-200/70 text-xs">Family</p><p>{auspiciousDirections.Family}</p></div>
                <div><p className="text-purple-200/70 text-xs">Personal Growth</p><p>{auspiciousDirections['Personal-Growth']}</p></div>
            </div>
          </div>
      )}
    </div>
  );
}
