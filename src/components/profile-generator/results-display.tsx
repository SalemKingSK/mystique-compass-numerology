
'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { AstroInsightOutput, NumerologyData } from './types';
import { AstroDisplay } from './astro-display';
import { NumerologyDisplay } from './numerology-display';
import { Home, Grid, Wand2, BrainCircuit, Sparkles, ArrowLeft, History } from "lucide-react";


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
