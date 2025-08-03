
'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { AstroInsightOutput, NumerologyData } from './types';
import { AstroDisplay } from './astro-display';
import { NumerologyDisplay } from './numerology-display';
import { ArrowLeft, History } from "lucide-react";


function TabButton({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) {
    return (
        <button 
            onClick={onClick}
            className={`px-6 py-2 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out transform
                ${isActive 
                    ? 'bg-purple-500/30 text-white shadow-lg scale-105 border border-purple-400/50' 
                    : 'text-purple-200/70 hover:bg-purple-500/10 hover:text-white'
                }`}
        >
            {children}
        </button>
    )
}

function ResultsHeader({ onReset, onHistoryOpen, name, newAstrologySign }: { onReset: () => void; onHistoryOpen: () => void; name: string; newAstrologySign: string; }) {
  return (
    <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-black/20">
      <Button variant="ghost" onClick={onReset} className="text-white/80 hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <div className="text-center">
         <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-purple-300 to-pink-400 tracking-wider">
            {name}
         </h1>
      </div>
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
        <ResultsHeader onReset={onReset} onHistoryOpen={onHistoryOpen} name={insight.name} newAstrologySign={insight.new_astrology_sign} />

        <div className="flex justify-center space-x-4 mb-6">
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
