
'use client';

import * as React from 'react';
import LoShuGrid from '@/components/lo-shu-grid';
import type { NumerologyData, ArrowData } from './types';
import { Wand2, BrainCircuit, Sparkles, Grid, Layers } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { SpeechPlayer } from './speech-player';
import { ScrollableTextDisplay } from './scrollable-text-display';

const InfoCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
    <div className="glass-card p-4 flex items-center space-x-4">
        <div className="text-primary">{icon}</div>
        <div>
            <p className="text-sm text-purple-200/70">{title}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    </div>
);

const FateDisplay = ({ title, meaning }: { title: string, meaning: string | null }) => {
    if (!meaning) return null;
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="glass-card px-4">
                <div className="flex justify-between items-center w-full">
                    <AccordionTrigger>
                        <span className="font-semibold text-lg text-primary flex items-center gap-2">
                            <Wand2 className="h-5 w-5" /> {title}
                        </span>
                    </AccordionTrigger>
                    <SpeechPlayer text={meaning} />
                </div>
                <AccordionContent>
                    <ScrollableTextDisplay text={meaning} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}

const ArrowsDisplay = ({ arrowsOfStrength, arrowsOfWeakness }: { arrowsOfStrength: ArrowData[], arrowsOfWeakness: ArrowData[] }) => {
    if (arrowsOfStrength.length === 0 && arrowsOfWeakness.length === 0) return null;

    const ArrowItem = ({ arrow, type }: { arrow: ArrowData, type: 'Strength' | 'Weakness' }) => {
        return (
            <AccordionItem value={arrow.name} key={arrow.name} className="glass-card px-4">
                <div className="flex justify-between items-center w-full">
                    <AccordionTrigger>
                        <span className="text-left">Arrow of {type}: {arrow.name}</span>
                    </AccordionTrigger>
                    <SpeechPlayer text={arrow.description} />
                </div>
                <AccordionContent>
                   <ScrollableTextDisplay text={arrow.description}/>
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
              <div className="flex justify-between items-center w-full">
                  <AccordionTrigger>
                     <span>Number {number} (appears {count} time{count > 1 ? 's' : ''})</span>
                  </AccordionTrigger>
                  <SpeechPlayer text={meaning || ''} />
              </div>
              <AccordionContent>
                   <ScrollableTextDisplay text={meaning || ''} />
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
        repeatedNumberMeanings
    } = numerology;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoCard title="Psyche Number" value={psycheNum} icon={<BrainCircuit className="h-8 w-8" />} />
        <InfoCard title="Destiny Number" value={destinyNum} icon={<Sparkles className="h-8 w-8" />} />
        <InfoCard title="Kua Number" value={kuaNum} icon={<Grid className="h-8 w-8" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LoShuGrid gridData={loShuGrid} arrows={[...arrowsOfStrength.map(a => ({ ...a, type: 'strength' as const})), ...arrowsOfWeakness.map(a => ({ ...a, type: 'weakness' as const}))]} />
        <div className="space-y-4">
           {compoundMeaning && <FateDisplay title={`Compound Fate: ${compoundNum}`} meaning={compoundMeaning} />}
           {reducedCompoundMeaning && <FateDisplay title={`Inherent Fate: ${reducedCompoundNum}`} meaning={reducedCompoundMeaning} />}
           {karmicFateMeaning && <FateDisplay title={`Karmic Fate: ${karmicFateNum}`} meaning={karmicFateMeaning} />}
        </div>
      </div>
      
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
