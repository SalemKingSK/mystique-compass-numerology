
'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoShuGrid from '@/components/lo-shu-grid';
import { Button } from '@/components/ui/button';
import type { AstroInsightOutput, NumerologyData } from './types';
import { AstroDisplay } from './astro-display';
import { Home, Grid, Wand2, BrainCircuit, Sparkles, ArrowLeft, History } from "lucide-react";


function NumerologyDisplay({ numerology }: { numerology: NumerologyData }) {
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
    } = numerology;

    const InfoCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => (
        <div className="glass-card p-4 flex items-center space-x-4">
            <div className="text-primary">{icon}</div>
            <div>
                <p className="text-sm text-purple-200/70">{title}</p>
                <p className="text-xl font-bold">{value}</p>
            </div>
        </div>
    );
    
    const FateDisplay = () => {
        if (!karmicFateMeaning) return null;
        return (
            <div className="glass-card p-4 space-y-2">
                <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Wand2 className="h-5 w-5" /> Karmic Fate Number: {karmicFateNum}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{karmicFateMeaning}</p>
            </div>
        );
    }
    
    const ArrowsDisplay = () => {
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
          <FateDisplay />
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
      
      <ArrowsDisplay />

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

function TabButton({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) {
    return (
        <button 
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200
                ${isActive 
                    ? 'bg-purple-500/20 border-b-2 border-purple-400 text-white' 
                    : 'text-purple-200/70 hover:bg-purple-500/10'
                }`}
        >
            {children}
        </button>
    )
}

function ResultsHeader({ onReset, onHistoryOpen }: { onReset: () => void; onHistoryOpen: () => void; }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button variant="ghost" onClick={onReset} className="text-white/80 hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <h1 className="text-2xl font-bold text-center text-white/90">
        Mystique Compass
      </h1>
      <Button variant="ghost" size="icon" onClick={onHistoryOpen} className="text-white/80 hover:text-white">
        <History className="h-5 w-5" />
      </Button>
    </div>
  );
}


export function ResultsDisplay({ insight, numerology, onReset, onHistoryOpen }: { insight: AstroInsightOutput; numerology: NumerologyData, onReset: () => void; onHistoryOpen: () => void; }) {
  const [activeTab, setActiveTab] = React.useState('astro');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="results-background w-full"
    >
      <div className="max-w-4xl mx-auto p-4">
        <ResultsHeader onReset={onReset} onHistoryOpen={onHistoryOpen} />

        <div className="border-b border-white/10 mb-4 flex justify-center">
            <TabButton isActive={activeTab === 'astro'} onClick={() => setActiveTab('astro')}>Astro Insights</TabButton>
            <TabButton isActive={activeTab === 'numerology'} onClick={() => setActiveTab('numerology')}>Numerology Report</TabButton>
        </div>

        <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'astro' ? <AstroDisplay insight={insight} /> : <NumerologyDisplay numerology={numerology} />}
            </motion.div>
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
