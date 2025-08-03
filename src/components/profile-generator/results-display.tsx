
'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import type { AstroInsightOutput, NumerologyData, NewAstroSignData } from './types';
import { AstroDisplay } from './astro-display';
import { NumerologyDisplay } from './numerology-display';
import { ArrowLeft, History, Briefcase, Heart, Home, Info, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ScrollableTextDisplay } from './scrollable-text-display';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';


function TabButton({ isActive, onClick, children }: { isActive: boolean, onClick: () => void, children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2.5 w-1/3 text-base md:text-lg font-medium transition-colors duration-300
                ${isActive
                    ? 'text-white'
                    : 'text-purple-200/70 hover:text-white'
                }`}
        >
            {children}
        </button>
    )
}

function NewAstroSignDetails({ sign, signData }: { sign: string, signData: NewAstroSignData }) {
  if (!signData || Object.keys(signData).length === 0) {
    return (
      <div className="glass-card p-4 text-center text-slate-400">
        Detailed information for {sign} is not yet available.
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
        <h3 className="text-2xl font-bold text-center text-purple-300 mb-4">
            {sign.replace('/', ' / ')}
        </h3>
        
        <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto sm:h-12 bg-black/20">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="love">Love</TabsTrigger>
            <TabsTrigger value="homeAndFamily">Home & Family</TabsTrigger>
            <TabsTrigger value="profession">Profession</TabsTrigger>
            <TabsTrigger value="compatibilities">Compatibilities</TabsTrigger>
            </TabsList>
            
            <div className="mt-4 min-h-[250px]">
                <TabsContent value="description">
                    <ScrollableTextDisplay text={signData.description || ''} icon={<Info className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />} />
                </TabsContent>

                <TabsContent value="love">
                    <ScrollableTextDisplay text={signData.love || ''} icon={<Heart className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />} />
                </TabsContent>

                <TabsContent value="homeAndFamily">
                    <ScrollableTextDisplay text={signData.homeAndFamily || ''} icon={<Home className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />} />
                </TabsContent>

                <TabsContent value="profession">
                    <ScrollableTextDisplay text={signData.profession || ''} icon={<Briefcase className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />} />
                </TabsContent>

                <TabsContent value="compatibilities">
                    <ScrollableTextDisplay text={signData.compatibilities || ''} icon={<Users className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />} />
                </TabsContent>
            </div>
        </Tabs>
    </div>
  );
}


function ResultsHeader({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center mb-6 p-4 rounded-xl bg-black/20 w-full">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-purple-300 to-pink-400 tracking-wider text-center">
            {name}
        </h1>
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
        <ResultsHeader name={insight.name} />

        <div className="animated-border mb-6">
            <div className='flex justify-center divide-x divide-white/10 bg-background/80 p-1 rounded-lg'>
                 <TabButton isActive={activeTab === 'astro'} onClick={() => setActiveTab('astro')}>Astro Insights</TabButton>
                 <TabButton isActive={activeTab === 'numerology'} onClick={() => setActiveTab('numerology')}>Numerology</TabButton>
                 <TabButton isActive={activeTab === 'new-astro'} onClick={() => setActiveTab('new-astro')}>{insight.new_astrology_sign}</TabButton>
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
