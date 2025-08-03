
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles, BookOpen, Star, Users, Calendar, Compass, Gem, Hash, ChevronsUpDown, History, UserCheck, Volume2, StopCircle, Skull, Info, Swords, Sun, Moon, Zap, Hand, Heart, Link2, BrainCircuit, ShieldHalf, Anchor, Eye, Telescope, Lightbulb, Handshake, Shield, Hourglass, BarChart, FileText, Home, Briefcase, HeartHandshake, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAstroInsightAction } from '@/app/actions';
import type { AstroInsightInput, AstroInsightOutput } from '@/lib/astrology';
import type { NumerologyData, ArrowData } from '@/lib/numerology';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { REPEATED_NUMBER_MEANINGS, NUMBER_MEANINGS } from '@/lib/numerology/data';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import LoShuGrid from '@/components/lo-shu-grid';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NEW_ASTROLOGY_DATA } from '@/lib/new-astrology';


function SpeechPlayer({ text, elementId }: { text: string; elementId: string }) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [sentences, setSentences] = React.useState<string[]>([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(-1);
    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
    const sentenceElementsRef = React.useRef<(HTMLSpanElement | null)[]>([]);

    React.useEffect(() => {
        const textSentences = text ? text.match(/[^.!?\n]+(?:[.!?\n]+["']?|$)/g) || [text] : [];
        setSentences(textSentences);
        sentenceElementsRef.current = new Array(textSentences.length).fill(null);
    }, [text]);

    React.useEffect(() => {
        return () => {
            if (window.speechSynthesis?.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    React.useEffect(() => {
        if (isPlaying && currentSentenceIndex >= 0) {
            const element = sentenceElementsRef.current[currentSentenceIndex];
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentSentenceIndex, isPlaying]);
    
    const stopSpeech = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setIsPlaying(false);
        setCurrentSentenceIndex(-1);
    };

    const handleListen = () => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            console.error("Speech Synthesis not supported.");
            return;
        }

        if (window.speechSynthesis.speaking && utteranceRef.current) {
            stopSpeech();
            return;
        }

        setIsPlaying(true);
        let sentenceIndex = 0;
        
        const speakNextSentence = () => {
            if (sentenceIndex >= sentences.length) {
                stopSpeech();
                return;
            }

            const sentenceToSpeak = sentences[sentenceIndex].trim();
            if (!sentenceToSpeak) {
                sentenceIndex++;
                speakNextSentence();
                return;
            }

            const utterance = new SpeechSynthesisUtterance(sentenceToSpeak);
            utteranceRef.current = utterance;
            
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                const preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en')) || voices[0];
                if (preferredVoice) utterance.voice = preferredVoice;
            }

            utterance.onstart = () => {
                setCurrentSentenceIndex(sentenceIndex);
            };

            utterance.onend = () => {
                if (utteranceRef.current === utterance) { // Ensure it's not an old utterance
                    sentenceIndex++;
                    speakNextSentence();
                }
            };

            utterance.onerror = (event) => {
                if (event.error !== 'cancelled' && event.error !== 'interrupted') {
                    console.error("SpeechSynthesisUtterance.onerror", event);
                }
                stopSpeech();
            };

            window.speechSynthesis.speak(utterance);
        };
        
        const startSpeech = () => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
            // A tiny delay to ensure cancel has finished processing
            setTimeout(speakNextSentence, 100);
        };

        if (window.speechSynthesis.getVoices().length === 0) {
             window.speechSynthesis.onvoiceschanged = startSpeech;
        } else {
            startSpeech();
        }
    };

    return (
        <div className="flex items-start gap-2">
             <Button onClick={handleListen} size="icon" variant="ghost" className="shrink-0 text-gray-400 hover:text-white" disabled={!text}>
                {isPlaying ? <StopCircle className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                <span className="sr-only">{isPlaying ? 'Stop' : 'Listen'}</span>
            </Button>
            <div className="whitespace-pre-wrap leading-relaxed flex-1 text-gray-300">
                {sentences.map((sentence, index) => (
                    <span
                        key={`${elementId}-${index}`}
                        ref={el => sentenceElementsRef.current[index] = el}
                        className={cn("transition-all duration-300", currentSentenceIndex === index ? "bg-primary/20 rounded-md" : "")}
                    >
                        {sentence}
                    </span>
                ))}
            </div>
        </div>
    );
}

const InfoCard = ({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) => {
    return (
      <div className="glass-card p-4 text-center h-full flex flex-col justify-center items-center">
        <h3 className="font-semibold text-primary flex items-center justify-center gap-1">
          {icon} {title}
        </h3>
        <p className="text-5xl font-bold text-secondary">{value}</p>
      </div>
    );
};

function FateDisplay({ numerology }: { numerology: NumerologyData }) {
    return (
        <div className="glass-card p-4">
            <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><Skull className="h-5 w-5" /> Fate Interpretations</h3>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="compound">
                    <AccordionTrigger>Compound Fate: {numerology.compoundNum}</AccordionTrigger>
                    <AccordionContent>
                        <ScrollArea className="h-60 pr-3">
                           <SpeechPlayer text={numerology.compoundMeaning} elementId="fate-compound-speech" />
                        </ScrollArea>
                    </AccordionContent>
                </AccordionItem>
                {numerology.reducedCompoundNum && numerology.reducedCompoundMeaning && (
                    <AccordionItem value="essence">
                        <AccordionTrigger>Inner Essence: {numerology.reducedCompoundNum}</AccordionTrigger>
                        <AccordionContent>
                            <ScrollArea className="h-60 pr-3">
                               <SpeechPlayer text={numerology.reducedCompoundMeaning} elementId="fate-essence-speech" />
                            </ScrollArea>
                        </AccordionContent>
                    </AccordionItem>
                )}
                {numerology.karmicFateNum && numerology.karmicFateMeaning && (
                    <AccordionItem value="karmic">
                        <AccordionTrigger>Karmic Fate: {numerology.karmicFateNum}</AccordionTrigger>
                        <AccordionContent>
                            <ScrollArea className="h-60 pr-3">
                                <SpeechPlayer text={numerology.karmicFateMeaning} elementId="fate-karmic-speech" />
                            </ScrollArea>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
        </div>
    );
}

const ArrowsDisplay = ({ arrows, title, icon, idPrefix }: { arrows: ArrowData[], title: string, icon: React.ReactNode, idPrefix: string }) => {
    if (arrows.length === 0) {
        return (
            <div className="glass-card p-4">
                <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">{icon} {title}</h3>
                <p className="text-gray-400">No {title} found.</p>
            </div>
        );
    }

    return (
        <div className="glass-card p-4">
            <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">{icon} {title}</h3>
            <Accordion type="single" collapsible className="w-full">
                {arrows.map((arrow, index) => (
                    <AccordionItem value={`${idPrefix}-${index}`} key={`${idPrefix}-${index}`}>
                        <AccordionTrigger>{arrow.name} ({arrow.numbers.join('-')})</AccordionTrigger>
                        <AccordionContent>
                            <ScrollArea className="h-40 pr-3">
                               <SpeechPlayer text={arrow.description} elementId={`${idPrefix}-speech-${index}`} />
                            </ScrollArea>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

function NumerologyDisplay({ numerology }: { numerology: NumerologyData }) {
    const numberEntries = Object.entries(numerology.numberCounts)
        .map(([digit, count]) => ({ digit: parseInt(digit), count }))
        .sort((a, b) => a.digit - b.digit);
        
    const allArrows = [
        ...numerology.arrowsOfStrength.map(arrow => ({ ...arrow, type: 'strength' as const })),
        ...numerology.arrowsOfWeakness.map(arrow => ({ ...arrow, type: 'weakness' as const })),
    ];
    
    return (
        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="grid">Lo Shu Grid</TabsTrigger>
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <InfoCard title="Psyche Number" value={numerology.psycheNum} icon={<BrainCircuit className="h-4 w-4"/>} />
                        <InfoCard title="Destiny Number" value={numerology.destinyNum} icon={<Anchor className="h-4 w-4"/>} />
                        <InfoCard title="Compound Fate" value={numerology.compoundNum} icon={<Skull className="h-4 w-4"/>} />
                        <InfoCard title="Kua Number" value={numerology.kuaNum} icon={<Compass className="h-4 w-4"/>} />
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        <FateDisplay numerology={numerology} />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="grid">
                 <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <LoShuGrid gridData={numerology.loShuGrid} arrows={allArrows} />
                        <div className="glass-card p-4">
                            <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><Eye className="h-5 w-5"/> Number Insights</h3>
                            <ScrollArea className="h-[21rem] pr-3">
                                <Accordion type="single" collapsible className="w-full">
                                    {numberEntries.map(({ digit, count }) => {
                                        let meaning = "No specific meaning found.";
                                        const key = `${digit}_${Math.min(count, 5)}`;
                                        if (count > 1) {
                                            meaning = REPEATED_NUMBER_MEANINGS[key as keyof typeof REPEATED_NUMBER_MEANINGS] || `No specific meaning for ${count} appearances.`;
                                        } else {
                                            meaning = NUMBER_MEANINGS[digit as keyof typeof NUMBER_MEANINGS]?.description || "No specific meaning for this number.";
                                        }
                                        const title = count > 1 ? `Number ${digit} (appears ${count} times)` : `Number ${digit}`;
                                        return (
                                            <AccordionItem value={`item-${digit}`} key={digit}>
                                                <AccordionTrigger>{title}</AccordionTrigger>
                                                <AccordionContent>
                                                    <ScrollArea className="h-40 pr-3">
                                                        <SpeechPlayer text={meaning} elementId={`insight-${digit}-speech`} />
                                                    </ScrollArea>
                                                </AccordionContent>
                                            </AccordionItem>
                                        );
                                    })}
                                    {numberEntries.length === 0 && <p className="text-gray-400">No numbers found in your birth date.</p>}
                                </Accordion>
                            </ScrollArea>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ArrowsDisplay arrows={numerology.arrowsOfStrength} title="Arrows of Strength" icon={<Zap />} idPrefix="strength" />
                        <ArrowsDisplay arrows={numerology.arrowsOfWeakness} title="Arrows of Weakness" icon={<ShieldHalf />} idPrefix="weakness" />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="attributes">
                <div className="glass-card p-4">
                    <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><Telescope/> Kua Attributes</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        <div><p className="font-semibold text-secondary">Element</p><p>{numerology.kuaAttributes.element}</p></div>
                        <div><p className="font-semibold text-secondary">Colors</p><p>{numerology.kuaAttributes.colors}</p></div>
                        <div><p className="font-semibold text-secondary">Season</p><p>{numerology.kuaAttributes.season}</p></div>
                        <div>
                            <p className="font-semibold text-secondary">Auspicious</p>
                            <p className="text-sm">{Object.entries(numerology.auspiciousDirections).map(([key, val]) => `${key}: ${val}`).join(', ')}</p>
                        </div>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    );
}

function AstroDisplay({ insight }: { insight: AstroInsightOutput }) {
    const compatibilitySigns = Object.keys(insight.signData.compatibilities);
    const elementKey = insight.element as keyof typeof insight.signData.elements;
    const elementText = insight.signData.elements[elementKey] || `No specific element text found for ${insight.element}.`;
    const futureYears = Object.entries(insight.signData.futures)
      .filter(([year]) => parseInt(year) >= new Date().getFullYear())
      .sort(([yearA], [yearB]) => parseInt(yearA) - parseInt(yearB));
  
    return (
      <Tabs defaultValue="introduction" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="introduction">Introduction</TabsTrigger>
          <TabsTrigger value="element">Element</TabsTrigger>
          <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
          <TabsTrigger value="future">Future</TabsTrigger>
        </TabsList>
        <TabsContent value="introduction">
             <div className="glass-card p-4">
                <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><BookOpen /> Your Animal Sign: The {insight.sign}</h3>
                <ScrollArea className="h-72 pr-3">
                    <SpeechPlayer text={insight.signData.introduction} elementId="intro-speech" />
                </ScrollArea>
            </div>
        </TabsContent>
        <TabsContent value="element">
            <div className="glass-card p-4">
                <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><Zap /> The Influence of the {insight.element} Element</h3>
                <ScrollArea className="h-72 pr-3">
                    <SpeechPlayer text={elementText} elementId="element-speech"/>
                </ScrollArea>
            </div>
        </TabsContent>
        <TabsContent value="compatibility">
            <div className="glass-card p-4">
                <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><Users /> Compatibility</h3>
                <ScrollArea className="h-72 pr-3">
                    <Accordion type="single" collapsible className="w-full">
                        {compatibilitySigns.map((sign, index) => (
                            <AccordionItem value={sign} key={sign}>
                                <AccordionTrigger className="text-base text-gray-300 hover:text-white hover:no-underline">With the {sign}</AccordionTrigger>
                                <AccordionContent>
                                    <SpeechPlayer text={insight.signData.compatibilities[sign as keyof typeof insight.signData.compatibilities]} elementId={`compat-speech-${index}`} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </ScrollArea>
            </div>
        </TabsContent>
        <TabsContent value="future">
            <div className="glass-card p-4">
                <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><Telescope/> Future Years</h3>
                <ScrollArea className="h-72 pr-3">
                    <Accordion type="single" collapsible className="w-full">
                        {futureYears.map(([year, futureData], index) => (
                            <AccordionItem value={year} key={year}>
                                <AccordionTrigger className="text-base text-gray-300 hover:text-white hover:no-underline">{year} - The {futureData.element} {futureData.year}</AccordionTrigger>
                                <AccordionContent>
                                    <SpeechPlayer text={futureData.prediction} elementId={`future-speech-${index}`} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </ScrollArea>
            </div>
        </TabsContent>
      </Tabs>
    );
  }

const TabButton = ({
  label,
  isActive,
  onClick,
  className
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}) => (
    <div className={cn("relative p-0.5 overflow-hidden rounded-xl", className)}>
        <Button
            onClick={onClick}
            className={cn(
            "w-full relative z-10 transition-all duration-300 rounded-lg",
            isActive
                ? "bg-primary/10 text-secondary font-bold"
                : "bg-black/20 text-gray-400 hover:bg-black/40 hover:text-white"
            )}
            variant="ghost"
            size="lg"
        >
            {label}
        </Button>
        <AnimatePresence>
            {isActive && (
                 <motion.div
                    className="absolute inset-0 z-0"
                    layoutId="active-tab-border"
                    initial={{ opacity: 0 }}
                    animate={{ 
                        opacity: 1, 
                        '--angle': '360deg',
                        transition: { duration: 8, ease: 'linear', repeat: Infinity } 
                    } as any}
                    style={{
                        background: 'conic-gradient(from var(--angle), var(--gradient-start), var(--gradient-mid1), var(--gradient-mid2), var(--gradient-end), var(--gradient-start))',
                        animation: 'border-flow 8s linear infinite',
                    }}
                  />
            )}
        </AnimatePresence>
    </div>
);

function CelestialArcNav({
  categories,
  onSelectCategory,
  activeCategory,
}: {
  categories: string[];
  onSelectCategory: (category: string) => void;
  activeCategory: string;
}) {
  const activeIndex = categories.indexOf(activeCategory);

  return (
    <div className="relative h-24 w-full flex items-center justify-center mb-4">
      {categories.map((category, index) => {
        const angle = (index - activeIndex) * 30; // Adjust angle for spacing
        const isCenter = index === activeIndex;

        return (
          <motion.div
            key={category}
            onClick={() => onSelectCategory(category)}
            className="absolute cursor-pointer text-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: isCenter ? 1.25 : 0.8,
              rotate: angle,
              transformOrigin: 'bottom center',
              y: -80, // Adjust vertical position of the arc
            }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
            }}
          >
            <span
              className={cn(
                'transition-colors duration-300',
                isCenter ? 'font-bold text-secondary' : 'text-gray-400'
              )}
            >
              {category}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}


function NewAstroSignDetails({ sign, signData }: { sign: string, signData: any }) {
    const [activeTab, setActiveTab] = React.useState("Description");

    const categories = ["Description", "Love", "Compatibilities", "Home & Family", "Profession"];

    const getContentForTab = (tab: string) => {
      switch (tab.toLowerCase()) {
        case 'description': return signData.description;
        case 'love': return signData.love;
        case 'home & family': return signData.homeAndFamily;
        case 'profession': return signData.profession;
        case 'compatibilities': return signData.compatibilities;
        default: return "No content available.";
      }
    };

    if (!signData) {
        return (
             <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--color-primary-hsl))] via-[hsl(var(--color-quaternary-hsl))] to-[hsl(var(--color-secondary-hsl))]">
                        {sign}
                    </DialogTitle>
                </DialogHeader>
                <div className="text-center text-gray-400 py-8">
                    <p>No detailed information available for {sign}.</p>
                    <p>Content is being prepared.</p>
                </div>
            </DialogContent>
        );
    }
    
    return (
        <DialogContent className="max-w-3xl min-h-[500px]">
            <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--color-primary-hsl))] via-[hsl(var(--color-quaternary-hsl))] to-[hsl(var(--color-secondary-hsl))]">
                    {sign}
                </DialogTitle>
                 <DialogDescription className="text-center text-gray-400 !mt-2">
                    A detailed look into the combined traits of your unique astrological sign.
                </DialogDescription>
            </DialogHeader>

            <CelestialArcNav
              categories={categories}
              onSelectCategory={setActiveTab}
              activeCategory={activeTab}
            />

            <div className="mt-8 min-h-[250px] glass-card p-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ScrollArea className="h-72 pr-3">
                           <SpeechPlayer 
                                text={getContentForTab(activeTab)} 
                                elementId={`new-astro-${activeTab.toLowerCase()}-speech`} 
                           />
                        </ScrollArea>
                    </motion.div>
                </AnimatePresence>
            </div>
        </DialogContent>
    );
}

function ResultsHistoryButton({ onHistoryOpen }: { onHistoryOpen: () => void }) {
    return(
    <Button variant="outline" size="icon" className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg text-primary bg-background/70 backdrop-blur-sm" onClick={onHistoryOpen}>
      <History className="h-7 w-7"/>
      <span className="sr-only">Open History</span>
    </Button>
    )
};

function ResultsDisplay({
  insight,
  numerology,
  onReset,
  onHistoryOpen
}: {
  insight: AstroInsightOutput;
  numerology: NumerologyData | null;
  onReset: () => void;
  onHistoryOpen: () => void;
}) {
  const [activeTab, setActiveTab] = React.useState('astro');

  const newAstroSignKey = insight.new_astrology_sign.replace(/ /g, '').replace(/\//g, '');
  const newAstroData = NEW_ASTROLOGY_DATA[newAstroSignKey as keyof typeof NEW_ASTROLOGY_DATA];


  return (
    <motion.div 
        className="results-background"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
    >
        <div className="relative z-10 p-4 sm:p-8">
            <header className="text-center mb-6 relative">
                 <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
                    {insight.name}
                </h1>
                
                <Dialog>
                    <DialogTrigger asChild>
                       <div className="relative p-0.5 overflow-hidden rounded-xl mt-2 inline-block">
                             <div className={cn("animated-border absolute inset-0 z-0")}/>
                             <Button
                                variant="ghost"
                                className="relative z-10 transition-all duration-300 rounded-lg bg-black/20 text-gray-300 hover:bg-black/40 hover:text-white text-lg"
                             >
                                {insight.new_astrology_sign}
                            </Button>
                        </div>
                    </DialogTrigger>
                    {newAstroData && <NewAstroSignDetails sign={insight.new_astrology_sign} signData={newAstroData} />}
                </Dialog>
            </header>

            <nav className="flex justify-center mb-6 gap-2 sm:gap-4">
                <TabButton
                    label="Astro Insights"
                    isActive={activeTab === 'astro'}
                    onClick={() => setActiveTab('astro')}
                    className="flex-1"
                />
                {numerology && (
                    <TabButton
                        label="Numerology Report"
                        isActive={activeTab === 'numerology'}
                        onClick={() => setActiveTab('numerology')}
                        className="flex-1"
                    />
                )}
            </nav>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'astro' && (
                        <AstroDisplay insight={insight} />
                    )}
                    {activeTab === 'numerology' && numerology && (
                        <NumerologyDisplay numerology={numerology} />
                    )}
                </motion.div>
            </AnimatePresence>

            <footer className="text-center mt-8">
                <Button onClick={onReset} variant="outline" className="text-primary text-lg">
                  ← Create a New Profile
                </Button>
          </footer>
        </div>
        <ResultsHistoryButton onHistoryOpen={onHistoryOpen} />
    </motion.div>
  );
}

const HISTORY_KEY = 'mystiqueCompassHistory';
const MAX_HISTORY_SIZE = 21;


function FormHistoryButton({ onHistoryOpen }: { onHistoryOpen: () => void }) {
    return(
    <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={onHistoryOpen}>
        <History className="h-6 w-6"/>
        <span className="sr-only">Open History</span>
    </Button>
    )
};


export function ProfileGenerator() {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const [formData, setFormData] = React.useState<AstroInsightInput>({ name: '', day: 0, month: 0, year: 0, gender: '' });
  const [insight, setInsight] = React.useState<AstroInsightOutput | null>(null);
  const [numerology, setNumerology] = React.useState<NumerologyData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<AstroInsightInput[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(false);


  React.useEffect(() => {
    try {
        const storedHistory = localStorage.getItem(HISTORY_KEY);
        if (storedHistory) {
            setHistory(JSON.parse(storedHistory));
        }
    } catch (e) {
        console.error("Could not read history from localStorage", e)
    }
  }, []);

  const addToHistory = (newItem: AstroInsightInput) => {
    setHistory(prevHistory => {
        const newHistory = [newItem, ...prevHistory.filter(item => item.name !== newItem.name)];
        if (newHistory.length > MAX_HISTORY_SIZE) {
            newHistory.pop();
        }
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
        } catch (e) {
            console.error("Could not save history to localStorage", e);
        }
        return newHistory;
    });
};
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };
  
  const handleReset = () => {
    if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
    }
    setInsight(null);
    setNumerology(null);
    setError(null);
    setFormData({ name: '', day: 0, month: 0, year: 0, gender: '' });
  };
  
  const processRequest = (data: AstroInsightInput) => {
    setError(null);
    if (!data.name || !data.day || !data.month || !data.year || !data.gender) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all the fields.',
      });
      return;
    }
    
    startTransition(async () => {
        const result = await getAstroInsightAction(data);
        
        if (result.success && result.insight && result.numerology) {
            setInsight(result.insight);
            setNumerology(result.numerology);
            addToHistory(data);
        } else {
            setInsight(null);
            setNumerology(null);
            setError(result.error || 'An unexpected error occurred.');
            toast({
              variant: 'destructive',
              title: 'Error Generating Profile',
              description: result.error || 'An unexpected error occurred while fetching insights. Please try again.',
            });
        }
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
        name: formData.name,
        day: parseInt(String(formData.day)),
        month: parseInt(String(formData.month)),
        year: parseInt(String(formData.year)),
        gender: formData.gender,
    };
    processRequest(data);
  };

  const handleHistoryClick = (item: AstroInsightInput) => {
    setIsHistoryOpen(false);
    setFormData(item);
    processRequest(item);
  }

  return (
    <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
      <AnimatePresence mode="wait">
        {insight && numerology ? (
            <motion.div key="results">
                 <ResultsDisplay
                    insight={insight}
                    numerology={numerology}
                    onReset={handleReset}
                    onHistoryOpen={() => setIsHistoryOpen(true)}
                 />
            </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="relative">
              <header className="text-center mb-6">
                 <h2 className="text-2xl font-bold text-white">Mystique Compass</h2>
                 <p className="text-gray-400">Giving your Life a meaning.</p>
              </header>
              <FormHistoryButton onHistoryOpen={() => setIsHistoryOpen(true)} />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="e.g., Jane Doe" required value={formData.name} onChange={handleChange} disabled={isPending} />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input type="number" name="day" min="1" max="31" placeholder="Day" required value={formData.day || ''} onChange={handleChange} disabled={isPending} />
                    <Input type="number" name="month" min="1" max="12" placeholder="Month" required value={formData.month || ''} onChange={handleChange} disabled={isPending} />
                    <Input type="number" name="year" min="1900" max={new Date().getFullYear()} placeholder="Year" required value={formData.year || ''} onChange={handleChange} disabled={isPending} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select name="gender" required onValueChange={handleSelectChange} value={formData.gender} disabled={isPending}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-6">
                <Button type="submit" disabled={isPending} size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base py-6 group">
                  {isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-5 w-5" />
                  )}
                  Generate My Reading
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>

               <footer className="text-center mt-6">
                    <p className="text-xs text-gray-500">"He who knows others is learned; He who knows himself is wise."</p>
                    <p className="text-xs text-gray-500">Lao Tzu, Dao De Jing</p>
               </footer>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <SheetContent>
          <SheetHeader>
              <SheetTitle>Search History</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100%-4rem)]">
              <div className="space-y-2 py-4">
                  {history.length > 0 ? (
                      history.map((item, index) => (
                          <Button key={`${item.name}-${index}`} variant="ghost" className="w-full justify-start" onClick={() => handleHistoryClick(item)}>
                              {item.name}
                          </Button>
                      ))
                  ) : (
                      <p className="text-sm text-center text-gray-400">No history yet.</p>
                  )}
              </div>
          </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

    