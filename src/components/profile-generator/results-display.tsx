'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { AstroInsightOutput, NumerologyData } from './types';
import { AstroDisplay } from './astro-display';
import { NumerologyDisplay } from './numerology-display';
import { ArrowLeft, History, BookUser, Heart, Home, Users, Briefcase } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SpeechPlayer } from './speech-player';


// --- SUB-COMPONENTS ---

type ArcCategory = {
  name: string;
  key: keyof AstroInsightOutput['signData'];
  icon: React.ElementType;
};

const NEW_ASTRO_TABS: ArcCategory[] = [
    { name: "Description", key: "description", icon: BookUser },
    { name: "Love", key: "love", icon: Heart },
    { name: "Family", key: "homeAndFamily", icon: Home },
    { name: "Compatibilities", key: "compatibilities", icon: Users },
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


function NewAstroSignDetails({ sign, signData }: { sign: string, signData: AstroInsightOutput['signData'] }) {
    const [api, setApi] = React.useState<any>(null);
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        if (!api) return;
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);
    
    const scrollTo = (index: number) => {
        api?.scrollTo(index);
    }

    return (
        <div className="glass-card p-4">
             <div className="py-2 text-center text-sm text-muted-foreground">
                <div className="flex justify-center gap-1 md:gap-2">
                    {NEW_ASTRO_TABS.map((tab, index) => (
                        <Button
                            key={tab.key}
                            variant={current === index ? 'default' : 'outline'}
                            size="sm"
                            className="h-auto py-1 px-2 text-xs md:h-9 md:px-3 md:text-sm"
                            onClick={() => scrollTo(index)}
                        >
                            {tab.name}
                        </Button>
                    ))}
                </div>
            </div>
            <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                    {NEW_ASTRO_TABS.map((tab) => {
                         const text = signData[tab.key] || `No data for ${tab.name}.`;
                         return (
                            <CarouselItem key={tab.key}>
                                <div className="p-1 h-96">
                                    <ScrollArea className="h-full w-full rounded-md p-4 bg-black/20">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                                <tab.icon className="h-6 w-6" /> {tab.name}
                                            </h3>
                                        </div>
                                        <SpeechPlayer text={String(text)} />
                                    </ScrollArea>
                                </div>
                            </CarouselItem>
                         )
                    })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}

function ResultsHeader({ name, newAstroSign, onTabClick, activeTab }: { name: string, newAstroSign: string, onTabClick: (tab: string) => void, activeTab: string }) {
  return (
    <div className="flex flex-col items-center justify-center mb-6 p-4 rounded-xl w-full">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-purple-300 to-pink-400 tracking-wider text-center">
            {name}
        </h1>
        <div className='relative flex flex-col justify-center items-center w-full max-w-lg mx-auto mt-6 space-y-4'>
             <AnimatedTab isActive={activeTab === 'new-astro'} onClick={() => onTabClick('new-astro')}>
                {newAstroSign}
             </AnimatedTab>
            <div className="flex justify-between w-full">
                <div className="w-2/5">
                    <AnimatedTab isActive={activeTab === 'astro'} onClick={() => onTabClick('astro')}>Astro Insights</AnimatedTab>
                </div>
                <div className="w-2/5">
                    <AnimatedTab isActive={activeTab === 'numerology'} onClick={() => onTabClick('numerology')}>Numerology Report</AnimatedTab>
                </div>
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

  // Stop any speaking when the component unmounts or the tab changes
  React.useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeTab]);

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
