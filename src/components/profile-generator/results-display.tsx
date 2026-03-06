
'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { AstroInsightOutput, NumerologyData } from './types';
import { AstroDisplay } from './astro-display';
import { NumerologyDisplay } from './numerology-display';
import { CosmicFateDisplay } from './cosmic-fate-display';
import { ArrowLeft, History, BookUser, Heart, Home, Users, Briefcase } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AccordionContentWithPlayer } from './accordion-content-with-player';
import InstallButton from '../InstallButton';


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

    React.useEffect(() => {
        if (!api) return;
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
                            className="h-auto py-2 px-3 flex flex-col items-center justify-center text-xs md:text-sm"
                            onClick={() => scrollTo(index)}
                        >
                            <tab.icon className="h-4 w-4 mb-1" />
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
                                        <AccordionContentWithPlayer text={String(text)} />
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

function ResultsHeader({
  name,
  newAstroSign,
  birthDate,
  onTabClick,
  activeTab
}: {
  name: string,
  newAstroSign: string,
  birthDate: string,
  onTabClick: (tab: string) => void,
  activeTab: string
}) {
  return (
    <div className="flex flex-col items-center justify-center mb-6 p-4 rounded-xl w-full">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-purple-300 to-pink-400 tracking-wider text-center">
            {name}
        </h1>
        <p className="text-sm text-white/50 mt-1">{birthDate}</p>
        <div className='relative flex flex-col justify-center items-center w-full max-w-lg mx-auto mt-6 space-y-4 px-4'>
             <AnimatedTab isActive={activeTab === 'new-astro'} onClick={() => onTabClick('new-astro')}>
                {newAstroSign}
             </AnimatedTab>
            <div className="grid grid-cols-3 gap-2 w-full">
                <AnimatedTab isActive={activeTab === 'astro'} onClick={() => onTabClick('astro')}>Astro</AnimatedTab>
                <AnimatedTab isActive={activeTab === 'numerology'} onClick={() => onTabClick('numerology')}>Numbers</AnimatedTab>
                <AnimatedTab isActive={activeTab === 'cosmic'} onClick={() => onTabClick('cosmic')}>Cosmic</AnimatedTab>
            </div>
        </div>
    </div>
  );
}

function ResultsFooter() {
    return (
        <div className="flex flex-col items-center justify-center mt-8 pb-24 w-full max-w-4xl mx-auto px-4">
             <footer className="text-center p-4 text-white/50 text-xs whitespace-pre-line">
                {"He who knows others is learned;\nHe who knows himself is wise.\nLao Tzu, Dao De Jing"}
            </footer>
        </div>
    );
}

function FloatingNavigation({ onReset, onHistoryOpen }: { onReset: () => void; onHistoryOpen: () => void; }) {
  return (
    <>
      <div className="fixed bottom-6 left-6 z-50 pointer-events-auto">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onReset} 
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
        </Button>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <InstallButton minimal />
      </div>

      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onHistoryOpen} 
          className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
            <History className="h-5 w-5" />
            <span className="sr-only">History</span>
        </Button>
      </div>
    </>
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

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  };

  const formatDate = () => {
    const { birthDay } = numerology;
    const { month, year } = insight;
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
      
    const dayWithSuffix = `${birthDay}${getOrdinalSuffix(birthDay)}`;
    return `Born ${dayWithSuffix} ${monthNames[month - 1]} ${year}`;
  };

  return (
    <>
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
              birthDate={formatDate()}
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
                {activeTab === 'cosmic' && <CosmicFateDisplay insight={insight} numerology={numerology} />}
              </motion.div>
          </AnimatePresence>

        </div>
         <ResultsFooter />
      </motion.div>
      <FloatingNavigation onReset={onReset} onHistoryOpen={onHistoryOpen} />
    </>
  );
}
