
'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LoShuGrid from '@/components/lo-shu-grid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Heart, Users, Home, Briefcase, Mic, Sparkles, Wand2, Grid, BrainCircuit, Play, Pause, History, ArrowLeft } from "lucide-react";
import type { AstroInsightOutput, NumerologyData } from './types';
import { Button } from '@/components/ui/button';

// --- SUB-COMPONENTS THAT WILL BE MOVED LATER ---

function SpeechPlayer({ text }: { text: string }) {
    const [isPlaying, setIsPlaying] = React.useState(false);

    React.useEffect(() => {
        // Stop speech when component unmounts or text changes
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, [text]);

    const handlePlayPause = () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            if (isPlaying) {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
            } else {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.onend = () => setIsPlaying(false);
                window.speechSynthesis.speak(utterance);
                setIsPlaying(true);
            }
        }
    };

    return (
        <Button onClick={handlePlayPause} variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>
    );
}

function NewAstroSignDetails({ sign, signData }: { sign: string, signData: any }) {
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
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto sm:h-12 bg-black/20">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="love">Love</TabsTrigger>
          <TabsTrigger value="homeAndFamily">Home & Family</TabsTrigger>
          <TabsTrigger value="profession">Profession</TabsTrigger>
          <TabsTrigger value="compatibilities">Compatibilities</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-72 w-full p-4">
            <TabsContent value="description">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Info className="h-5 w-5" /> Description</h3>
                        <SpeechPlayer text={signData.description || ''} />
                    </div>
                    <p className="text-slate-300 leading-relaxed">{signData.description}</p>
                </div>
            </TabsContent>
            <TabsContent value="love">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Heart className="h-5 w-5" /> Love</h3>
                        <SpeechPlayer text={signData.love || ''} />
                    </div>
                    <p className="text-slate-300 leading-relaxed">{signData.love}</p>
                </div>
            </TabsContent>
            <TabsContent value="homeAndFamily">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Home className="h-5 w-5" /> Home & Family</h3>
                        <SpeechPlayer text={signData.homeAndFamily || ''} />
                    </div>
                    <p className="text-slate-300 leading-relaxed">{signData.homeAndFamily}</p>
                </div>
            </TabsContent>
            <TabsContent value="profession">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Briefcase className="h-5 w-5" /> Profession</h3>
                        <SpeechPlayer text={signData.profession || ''} />
                    </div>
                    <p className="text-slate-300 leading-relaxed">{signData.profession}</p>
                </div>
            </TabsContent>
            <TabsContent value="compatibilities">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Users className="h-5 w-5" /> Compatibilities</h3>
                        <SpeechPlayer text={signData.compatibilities || ''} />
                    </div>
                    <p className="text-slate-300 leading-relaxed">{signData.compatibilities}</p>
                </div>
            </TabsContent>
        </ScrollArea>
      </Tabs>
    </DialogContent>
  );
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


function AstroDisplay({ insight }: { insight: AstroInsightOutput }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-300">{insight.name}</h2>
        <p className="text-lg text-purple-100/80">{insight.western_sign} / {insight.sign}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
        <div className="glass-card p-4">
          <p className="text-sm text-purple-200/70">Chinese Zodiac Element</p>
          <p className="text-xl font-semibold">{insight.element}</p>
        </div>
         <div className="glass-card p-4">
            <p className="text-sm text-purple-200/70">New Astrology Sign</p>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="link" className="text-xl font-semibold p-0 h-auto text-white hover:text-purple-300">
                        {insight.new_astrology_sign}
                    </Button>
                </DialogTrigger>
                <NewAstroSignDetails sign={insight.new_astrology_sign} signData={insight.signData} />
            </Dialog>
        </div>
      </div>
      
      <div className="glass-card p-6 space-y-3">
        <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Sparkles className="h-5 w-5" />Personal Reading</h3>
        <p className="text-white/80 leading-relaxed">{insight.reading}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-purple-200/70">Lucky Number</p>
          <p className="text-2xl font-bold">{insight.luckyNumber}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-purple-200/70">Lucky Color</p>
          <p className="text-2xl font-bold">{insight.luckyColor}</p>
        </div>
      </div>
    </div>
  );
}

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

    