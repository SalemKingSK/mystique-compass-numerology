
'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { AstroInsightOutput, NumerologyData, NewAstroSignData } from './types';
import { AstroDisplay, CelestialArcNav } from './astro-display';
import { NumerologyDisplay } from './numerology-display';
import { ArrowLeft, History } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from '@/lib/utils';
import { ScrollableTextDisplay } from './scrollable-text-display';
import { SpeechPlayer } from './speech-player';

const mainTabVariants = cva(
    "py-2 px-4 text-sm font-medium cursor-pointer transition-colors duration-300 text-white relative",
    {
        variants: {
            variant: {
                selected: "text-yellow-300",
                unselected: "text-white/70"
            }
        },
        defaultVariants: {
            variant: "unselected"
        }
    }
);

function AnimatedTab({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <div className="animated-border">
      <button
          onClick={onClick}
          className={cn(mainTabVariants({ variant: isActive ? 'selected' : 'unselected' }), "w-full h-full rounded-lg")}
      >
          {children}
          {isActive && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-300" layoutId="underline" />}
      </button>
    </div>
  )
}


function NewAstroSignDetails({ sign, signData }: { sign: string, signData: NewAstroSignData }) {
    const [activeSubTab, setActiveSubTab] = React.useState('description');
    const TABS = ["Description", "Love", "Compatibilities", "Home & Family", "Profession"];

    const renderContent = () => {
        const text = signData[activeSubTab as keyof NewAstroSignData] || `No data for ${activeSubTab}.`;
        return (
            <div className="relative mt-4">
                <div className="absolute top-0 right-0 z-10"><SpeechPlayer text={text} /></div>
                <ScrollableTextDisplay text={text} />
            </div>
        );
    };

    return (
        <div className="glass-card p-4">
            <CelestialArcNav activeTab={activeSubTab} setActiveTab={setActiveSubTab} tabs={TABS} />
            <div className="mt-4 min-h-[250px]">
                {renderContent()}
            </div>
        </div>
    );
}

function ResultsHeader({ name, newAstroSign, onNewAstroClick }: { name: string, newAstroSign: string, onNewAstroClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center mb-6 p-4 rounded-xl w-full">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-purple-300 to-pink-400 tracking-wider text-center">
            {name}
        </h1>
        <div className="mt-4">
           <AnimatedTab isActive={false} onClick={onNewAstroClick}>
                {newAstroSign}
            </AnimatedTab>
        </div>
    </div>
  );
}

function ResultsFooter({ onReset, onHistoryOpen }: { onReset: () => void; onHistoryOpen: () => void; }) {
    return (
        <div className="flex items-center justify-between mt-8 w-full max-w-4xl mx-auto px-4">
            <Button variant="ghost" onClick={onReset} className="text-white/80 hover:text-white">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button variant="ghost" onClick={onHistoryOpen} className="text-white/80 hover:text-white">
                <History className="mr-2 h-5 w-5" /> History
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
      className="results-background w-full min-h-screen flex flex-col p-4"
    >
      <div className="w-full max-w-4xl mx-auto flex-grow">
        <ResultsHeader 
            name={insight.name} 
            newAstroSign={insight.new_astrology_sign}
            onNewAstroClick={() => setActiveTab('new-astro')}
        />
        
        <div className='flex justify-between items-center w-full max-w-md mx-auto mb-6'>
             <div className="w-2/5">
                <AnimatedTab isActive={activeTab === 'astro'} onClick={() => setActiveTab('astro')}>Astro Insights</AnimatedTab>
             </div>
             <div className="w-2/5">
                <AnimatedTab isActive={activeTab === 'numerology'} onClick={() => setActiveTab('numerology')}>Numerology Report</AnimatedTab>
             </div>
        </div>

        <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'astro' && <AstroDisplay insight={insight} />}
              {activeTab === 'numerology' && <NumerologyDisplay numerology={numerology} />}
              {activeTab === 'new-astro' && <NewAstroSignDetails sign={insight.new_astrology_sign} signData={insight.signData} />}
            </motion.div>
        </AnimatePresence>

      </div>
       <ResultsFooter onReset={onReset} onHistoryOpen={onHistoryOpen} />
    </motion.div>
  );
}
