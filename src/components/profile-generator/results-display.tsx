'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { AstroInsightOutput, NumerologyData, NewAstroSignData } from './types';
import { AstroDisplay } from './astro-display';
import { NumerologyDisplay } from './numerology-display';
import { ArrowLeft, History, Users, Home, Heart, BookUser, Briefcase } from "lucide-react";
import { ScrollableTextDisplay } from './scrollable-text-display';
import { SpeechPlayer } from './speech-player';

// --- SUB-COMPONENTS ---

type ArcCategory = {
  name: string;
  key: keyof NewAstroSignData;
  icon: React.ElementType;
};

const NEW_ASTRO_TABS: ArcCategory[] = [
  { name: "Description", key: "description", icon: BookUser },
  { name: "Love", key: "love", icon: Heart },
  { name: "Compatibilities", key: "compatibilities", icon: Users },
  { name: "Home & Family", key: "homeAndFamily", icon: Home },
  { name: "Profession", key: "profession", icon: Briefcase },
];

function AnimatedTab({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <div className="animated-border">
      <button
          onClick={onClick}
          className={`w-full h-full rounded-lg py-2 px-4 text-sm font-medium cursor-pointer transition-colors duration-300 relative ${
            isActive ? 'text-yellow-300' : 'text-white/70'
          }`}
      >
          {children}
      </button>
    </div>
  )
}

function CelestialArcNav({ activeTab, setActiveTab, tabs }: { activeTab: string, setActiveTab: (tab: string) => void, tabs: ArcCategory[] }) {
  const activeIndex = tabs.findIndex(tab => tab.key === activeTab);

  return (
    <div className="relative w-full h-48 my-8 flex justify-center items-center overflow-hidden">
      {tabs.map((tab, index) => {
        const isActive = activeIndex === index;
        const angle = (index - activeIndex) * 25; // degrees between items

        return (
          <div
            key={tab.name}
            className="absolute transition-all duration-500 ease-in-out"
            style={{
              transform: `rotate(${angle}deg) translateY(-90px) rotate(${-angle}deg)`,
              transformOrigin: 'bottom center',
            }}
          >
            <button
              onClick={() => setActiveTab(tab.key)}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300 group ${
                isActive ? 'text-primary' : 'text-purple-200/60 scale-90 hover:scale-95'
              }`}
            >
              <div
                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                  isActive ? 'bg-primary/10 animate-arrow-pulse' : 'group-hover:bg-primary/5'
                }`}
              >
                <tab.icon className={`h-8 w-8 transition-all duration-300 ${isActive ? 'mb-1' : ''}`} />
                <span className={`transition-all duration-300 text-xl ${isActive ? 'font-bold' : 'font-semibold'}`}>
                  {tab.name}
                </span>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}

function NewAstroSignDetails({ sign, signData }: { sign: string, signData: NewAstroSignData }) {
    const [activeSubTab, setActiveSubTab] = React.useState<keyof NewAstroSignData>('description');

    const renderContent = () => {
        const text = signData[activeSubTab] || `No data for ${activeSubTab}.`;
        
        return (
            <div className="relative mt-4 glass-card p-4">
                 <ScrollableTextDisplay 
                    text={text} 
                    renderPlayer={(onBoundary, onEnd) => (
                        <div className="absolute top-0 right-0 z-10">
                            <SpeechPlayer text={text} onBoundary={onBoundary} onEnd={onEnd} />
                        </div>
                    )}
                />
            </div>
        );
    };

    return (
        <div className="glass-card p-4">
             <h3 className="font-semibold text-lg text-primary text-center mb-2">{sign}</h3>
            <CelestialArcNav activeTab={activeSubTab} setActiveTab={setActiveSubTab as (tab: string) => void} tabs={NEW_ASTRO_TABS} />
            <div className="mt-4 min-h-[250px]">
                {renderContent()}
            </div>
        </div>
    );
}

function ResultsHeader({ name, newAstroSign, onTabClick, activeTab }: { name: string, newAstroSign: string, onTabClick: (tab: string) => void, activeTab: string }) {
  return (
    <div className="flex flex-col items-center justify-center mb-6 p-4 rounded-xl w-full">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-purple-300 to-pink-400 tracking-wider text-center">
            {name}
        </h1>
        <div className='flex justify-between items-center w-full max-w-lg mx-auto mt-6'>
             <div className="w-2/5">
                <AnimatedTab isActive={activeTab === 'astro'} onClick={() => onTabClick('astro')}>Astro Insights</AnimatedTab>
             </div>
              <div className="mt-[-2rem]">
                <AnimatedTab isActive={activeTab === 'new-astro'} onClick={() => onTabClick('new-astro')}>
                        {newAstroSign}
                </AnimatedTab>
              </div>
             <div className="w-2/5">
                <AnimatedTab isActive={activeTab === 'numerology'} onClick={() => onTabClick('numerology')}>Numerology Report</AnimatedTab>
             </div>
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
            onTabClick={setActiveTab}
            activeTab={activeTab}
        />

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
