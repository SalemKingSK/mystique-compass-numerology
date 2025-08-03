
'use client';

import * as React from 'react';
import LoShuGrid from '@/components/lo-shu-grid';
import type { NumerologyData, ArrowData } from './types';
import { Wand2, BrainCircuit, Sparkles, Grid, Layers } from "lucide-react";
import { REPEATED_NUMBER_MEANINGS } from '@/lib/numerology/data/repetitionMeanings';


const InfoCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
    <div className="glass-card p-4 flex items-center space-x-4">
        <div className="text-primary">{icon}</div>
        <div>
            <p className="text-sm text-purple-200/70">{title}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    </div>
);

const FateDisplay = ({ karmicFateNum, karmicFateMeaning }: { karmicFateNum: number | null, karmicFateMeaning: string | null }) => {
    if (!karmicFateMeaning) return null;
    return (
        <div className="glass-card p-4 space-y-2">
            <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Wand2 className="h-5 w-5" /> Karmic Fate Number: {karmicFateNum}</h3>
            <p className="text-white/80 text-sm leading-relaxed">{karmicFateMeaning}</p>
        </div>
    );
}

const ArrowsDisplay = ({ arrowsOfStrength, arrowsOfWeakness }: { arrowsOfStrength: ArrowData[], arrowsOfWeakness: ArrowData[] }) => {
    const allArrows = [
        ...arrowsOfStrength.map(a => ({ ...a, type: 'strength' as 'strength' | 'weakness' })),
        ...arrowsOfWeakness.map(a => ({ ...a, type: 'weakness' as 'strength' | 'weakness' })),
    ];

    if (allArrows.length === 0) return null;

    return (
        <div className="glass-card p-4 space-y-3">
             <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                Arrows of Power
            </h3>
            <div className="space-y-2">
                {allArrows.map((arrow, index) => (
                    <div key={index} className={`p-2 rounded-md ${arrow.type === 'strength' ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                        <p className={`font-semibold ${arrow.type === 'strength' ? 'text-green-300' : 'text-red-300'}`}>{arrow.name}</p>
                        <p className="text-xs text-white/70">{arrow.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const RepetitionMeaningsDisplay = ({ numberCounts }: { numberCounts: { [key: string]: number } }) => {
  const repetitions = Object.entries(numberCounts)
    .map(([number, count]) => {
      const key = `${number}_${Math.min(count, 5)}`; // Cap count at 5 as per data structure
      const meaning = REPEATED_NUMBER_MEANINGS[key];
      return { number, count, meaning };
    })
    .filter(item => item.meaning)
    .sort((a,b) => parseInt(a.number) - parseInt(b.number));

  if (repetitions.length === 0) return null;

  return (
    <div className="glass-card p-4 space-y-3">
      <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
        <Layers className="h-5 w-5" /> Repetitive Numbers Meanings
      </h3>
      <div className="space-y-3">
        {repetitions.map(({ number, count, meaning }) => (
          <div key={number} className="p-2 rounded-md bg-black/20">
            <p className="font-semibold text-purple-200">
              Number {number} (appears {count} time{count > 1 ? 's' : ''})
            </p>
            <p className="text-xs text-white/70">{meaning}</p>
          </div>
        ))}
      </div>
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
          <FateDisplay karmicFateNum={karmicFateNum} karmicFateMeaning={karmicFateMeaning} />
          <div className="glass-card p-4 space-y-2">
            <h3 className="font-semibold text-lg text-primary">Compound Number: {compoundNum}</h3>
            <p className="text-white/80 text-sm">{compoundMeaning}</p>
            {reducedCompoundNum && (
                <>
                    <h4 className="font-semibold pt-2 text-primary/80">Inner Essence: {reducedCompoundNum}</h4>
                    <p className="text-white/70 text-xs">{reducedCompoundMeaning}</p>
                </>
            )}
          </div>
        </div>
      </div>
      
      <RepetitionMeaningsDisplay numberCounts={numberCounts} />

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
