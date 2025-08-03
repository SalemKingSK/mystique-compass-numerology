
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
            className={`px-6 py-2 w-1/2 text-lg font-medium rounded-lg transition-all duration-300 ease-in-out transform
                ${isActive
                    ? 'bg-purple-500/30 text-white shadow-lg scale-105 border border-purple-400/50'
                    : 'text-purple-200/70 hover:bg-purple-500/10 hover:text-white'
                }`}
        >
            {children}
        </button>
    )
}

function NewAstroSignDetails({ sign, signData }: { sign: string, signData: NewAstroSignData }) {
  if (!signData || Object.keys(signData).length === 0) {
    return (
      <DialogContent className="max-w-4xl bg-background/80 backdrop-blur-sm text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-purple-300">
            {sign.replace('/', ' / ')}
          </DialogTitle>
          <div className="pt-8 text-center text-slate-400">
            Detailed information for {sign} is not yet available.
          </div>
        </DialogHeader>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="max-w-4xl bg-background/80 backdrop-blur-sm text-white border-slate-700">
      <DialogHeader>
        <DialogTitle className="text-3xl font-bold text-center text-purple-300">
            {sign.replace('/', ' / ')}
        </DialogTitle>
        <DialogDescription className="text-center text-slate-400">
          A detailed look into the combined traits of your unique astrological sign.
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto sm:h-12">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="love">Love</TabsTrigger>
          <TabsTrigger value="homeAndFamily">Home & Family</TabsTrigger>
          <TabsTrigger value="profession">Profession</TabsTrigger>
          <TabsTrigger value="compatibilities">Compatibilities</TabsTrigger>
        </TabsList>
        
        <div className="h-72 w-full pt-4">
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
              <Accordion type="multiple" className="w-full space-y-1">
                <AccordionItem value="compatibilities">
                    <AccordionTrigger>Compatibility Details</AccordionTrigger>
                    <AccordionContent>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{signData.compatibilities}</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
          </TabsContent>
        </div>
      </Tabs>
    </DialogContent>
  );
}


function ResultsHeader({ onReset, onHistoryOpen, name, newAstrologySign, signData }: { onReset: () => void; onHistoryOpen: () => void; name: string; newAstrologySign: string; signData: NewAstroSignData; }) {
  return (
    <div className="flex flex-col items-center justify-between mb-6 p-4 rounded-xl bg-black/20">
      <div className='w-full flex items-center justify-between'>
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

       <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="text-lg text-purple-300/80 hover:bg-purple-500/10 hover:text-purple-200 mt-2 px-6 py-2">
                {newAstrologySign}
            </Button>
          </DialogTrigger>
          <NewAstroSignDetails sign={newAstrologySign} signData={signData} />
      </Dialog>
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
        <ResultsHeader
            onReset={onReset}
            onHistoryOpen={onHistoryOpen}
            name={insight.name}
            newAstrologySign={insight.new_astrology_sign}
            signData={insight.signData}
        />

        <div className="animated-border mb-6">
            <div className='flex justify-center space-x-0 bg-background/80 p-1 rounded-2xl'>
                 <TabButton isActive={activeTab === 'astro'} onClick={() => setActiveTab('astro')}>Astro Insights</TabButton>
                 <TabButton isActive={activeTab === 'numerology'} onClick={() => setActiveTab('numerology')}>Numerology Report</TabButton>
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
              {activeTab === 'astro' ? <AstroDisplay insight={insight} /> : <NumerologyDisplay numerology={numerology} />}
            </motion.div>
        </AnimatePresence>

      </div>
    </motion.div>
  );
}
