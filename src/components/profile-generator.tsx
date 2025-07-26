
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles, BookOpen, Star, Users, Calendar, Compass, Grid3x3, Gem, Hash, ChevronsUpDown, History, UserCheck, Volume2, StopCircle, Skull, Info, Swords, Sun, Moon, Zap, Hand, Heart, Link2, BrainCircuit, ShieldHalf, Anchor, Eye, Telescope, Lightbulb, Handshake, Shield, Hourglass, BarChart, FileText } from 'lucide-react';
import { getAstroInsightAction } from '@/app/actions';
import type { AstroInsightInput, AstroInsightOutput } from '@/lib/astrology';
import type { NumerologyData } from '@/lib/numerology';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { REPEATED_NUMBER_MEANINGS, NUMBER_MEANINGS } from '@/lib/numerology';
import { Separator } from '@/components/ui/separator';


function SpeechPlayer({ text, elementId }: { text: string; elementId: string }) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [sentences, setSentences] = React.useState<string[]>([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(-1);
    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
    const sentenceElementsRef = React.useRef<(HTMLSpanElement | null)[]>([]);
    const wasManuallyStopped = React.useRef(false);

    React.useEffect(() => {
        const textSentences = text ? text.match(/[^.!?]+[.!?]+\s*|[^.!?]+$/g) || [text] : [];
        setSentences(textSentences);
        sentenceElementsRef.current = new Array(textSentences.length).fill(null);
    }, [text]);

    React.useEffect(() => {
        return () => {
            if (window.speechSynthesis?.speaking) {
                wasManuallyStopped.current = true;
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

    const handleListen = () => {
        if (typeof window === 'undefined' || !window.speechSynthesis) {
            console.error("Speech Synthesis not supported.");
            return;
        }

        wasManuallyStopped.current = false;
        setIsPlaying(true);
        let sentenceIndex = 0;

        const speakSentences = () => {
            if (wasManuallyStopped.current || sentenceIndex >= sentences.length) {
                setIsPlaying(false);
                setCurrentSentenceIndex(-1);
                if (utteranceRef.current) {
                   utteranceRef.current.onend = null;
                   utteranceRef.current.onerror = null;
                   utteranceRef.current.onboundary = null;
                }
                return;
            }
            
            const utterance = new SpeechSynthesisUtterance(sentences[sentenceIndex]);
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
                sentenceIndex++;
                speakSentences();
            };
            
            utterance.onerror = (event) => {
                if (event.error !== 'cancelled' && event.error !== 'interrupted') {
                     // console.error("SpeechSynthesisUtterance.onerror", event);
                }
                setIsPlaying(false);
                setCurrentSentenceIndex(-1);
            };

            window.speechSynthesis.speak(utterance);
        };
        
        if (window.speechSynthesis.getVoices().length === 0) {
             window.speechSynthesis.onvoiceschanged = speakSentences;
        } else {
            speakSentences();
        }
    };
    
    const handleStop = () => {
        wasManuallyStopped.current = true;
        if (window.speechSynthesis) {
             window.speechSynthesis.cancel();
        }
        setIsPlaying(false);
        setCurrentSentenceIndex(-1);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            handleStop();
        } else {
            handleListen();
        }
    };

    return (
        <div className="flex items-start gap-2">
             <Button onClick={handlePlayPause} size="icon" variant="ghost" className="shrink-0 text-gray-400 hover:text-white" disabled={!text}>
                {isPlaying ? <StopCircle className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                <span className="sr-only">{isPlaying ? 'Stop' : 'Listen'}</span>
            </Button>
            <div className="whitespace-pre-wrap leading-relaxed flex-1 text-gray-300">
                {sentences.map((sentence, index) => (
                    <span
                        key={`${elementId}-${index}`}
                        ref={el => sentenceElementsRef.current[index] = el}
                        className={currentSentenceIndex === index ? "bg-primary/20 rounded-md transition-all duration-300" : ""}
                    >
                        {sentence}
                    </span>
                ))}
            </div>
        </div>
    );
}

const InfoCard = ({ title, value, icon, popoverContent }: { title: string, value: string | number, icon: React.ReactNode, popoverContent?: React.ReactNode }) => {
    const cardContent = (
      <div className="glass-card p-4 text-center h-full flex flex-col justify-center items-center">
        <h3 className="font-semibold text-primary flex items-center justify-center gap-1">
          {icon} {title}
        </h3>
        <p className="text-5xl font-bold text-secondary">{value}</p>
      </div>
    );
  
    if (popoverContent) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <div className="cursor-pointer hover:bg-[rgba(40,40,40,0.7)] transition-colors rounded-2xl">
              {cardContent}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-96 max-h-[80vh] overflow-y-auto p-0" side="bottom" align="center">
            <ScrollArea className="h-full">
              <div className="p-4">{popoverContent}</div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      );
    }
  
    return cardContent;
};

function FatePopoverContent({ numerology }: { numerology: NumerologyData }) {
    return (
        <div className="space-y-4">
            <div>
                <h4 className="font-bold text-lg mb-2 text-secondary flex items-center gap-2"><Skull className="h-5 w-5" /> Compound Fate: {numerology.compoundNum}</h4>
                <SpeechPlayer text={numerology.compoundMeaning} elementId="fate-tier1-speech" />
            </div>

            {numerology.reducedCompoundNum && (
                <>
                    <Separator />
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-secondary flex items-center gap-2"><Gem className="h-5 w-5" /> Inner Essence: {numerology.reducedCompoundNum}</h4>
                        <SpeechPlayer text={numerology.reducedCompoundMeaning} elementId="fate-tier2-speech" />
                    </div>
                </>
            )}
            
            {numerology.karmicFateNum && (
                <>
                    <Separator />
                    <div>
                        <h4 className="font-bold text-lg mb-2 text-secondary flex items-center gap-2"><Swords className="h-5 w-5" /> Karmic Fate: {numerology.karmicFateNum}</h4>
                        <SpeechPlayer text={numerology.karmicFateMeaning} elementId="fate-tier3-speech" />
                    </div>
                </>
            )}
        </div>
    );
}


function NumerologyDisplay({ numerology }: { numerology: NumerologyData }) {
    const numberEntries = Object.entries(numerology.numberCounts)
        .map(([digit, count]) => ({ digit: parseInt(digit), count }))
        .sort((a, b) => a.digit - b.digit);

    return (
        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="grid">Lo Shu Grid</TabsTrigger>
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 mt-4">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <InfoCard title="Psyche Number" value={numerology.psycheNum} icon={<BrainCircuit className="h-4 w-4"/>} />
                     <InfoCard title="Destiny Number" value={numerology.destinyNum} icon={<Anchor className="h-4 w-4"/>} />
                     <InfoCard title="Kua Number" value={numerology.kuaNum} icon={<Compass className="h-4 w-4"/>} />
                     <InfoCard title="Fate Number" value={numerology.compoundNum} icon={<Skull className="h-4 w-4"/>} popoverContent={<FatePopoverContent numerology={numerology} />} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-card p-4">
                        <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><Zap/> Arrows of Strength</h3>
                        {numerology.arrowsOfStrength.length > 0 ? (
                            <ul className="space-y-2 text-gray-300">
                              {numerology.arrowsOfStrength.map(arrow => <li key={arrow.name}><strong>{arrow.name}:</strong> {arrow.description}</li>)}
                            </ul>
                        ) : <p className="text-gray-400">No Arrows of Strength found.</p>}
                    </div>
                    <div className="glass-card p-4">
                        <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><ShieldHalf/> Arrows of Weakness</h3>
                         {numerology.arrowsOfWeakness.length > 0 ? (
                            <ul className="space-y-2 text-gray-300">
                              {numerology.arrowsOfWeakness.map(arrow => <li key={arrow.name}><strong>{arrow.name}:</strong> {arrow.description}</li>)}
                            </ul>
                        ) : <p className="text-gray-400">No Arrows of Weakness found.</p>}
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="grid" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="glass-card p-4">
                        <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><Grid3x3/> Lo Shu Grid</h3>
                        <div className="grid grid-cols-3 gap-2 aspect-square">
                            {(numerology.loShuGrid as (string|null)[][]).flat().map((num, index) => (
                                <div key={index} className="flex items-center justify-center text-3xl font-bold bg-black/20 rounded-lg">
                                    {num || ''}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-4">
                        <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><Eye/> Number Insights</h3>
                        <ScrollArea className="h-48">
                          <Accordion type="single" collapsible className="w-full">
                              {numberEntries.map(({ digit, count }) => {
                                  let meaning = "No specific meaning found.";
                                  if (count > 1) {
                                      meaning = REPEATED_NUMBER_MEANINGS[digit as keyof typeof REPEATED_NUMBER_MEANINGS]?.[count] || `No specific meaning for ${count} appearances.`;
                                  } else {
                                      meaning = NUMBER_MEANINGS[digit as keyof typeof NUMBER_MEANINGS]?.description || "No specific meaning for this number.";
                                  }
                                  
                                  const title = count > 1 ? `Number ${digit} (appears ${count} times)` : `Number ${digit} (appears 1 time)`;

                                  return (
                                      <AccordionItem value={`item-${digit}`} key={digit}>
                                          <AccordionTrigger>{title}</AccordionTrigger>
                                          <AccordionContent>
                                              <SpeechPlayer text={meaning} elementId={`insight-${digit}-speech`} />
                                          </AccordionContent>
                                      </AccordionItem>
                                  );
                              })}
                              {numberEntries.length === 0 && <p className="text-gray-400">No numbers found in your birth date.</p>}
                          </Accordion>
                        </ScrollArea>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="attributes" className="space-y-4 mt-4">
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
        <TabsContent value="introduction" className="mt-4">
          <div className="glass-card p-4">
            <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><BookOpen /> Your Animal Sign: The {insight.sign}</h3>
            <SpeechPlayer text={insight.signData.introduction} elementId="intro-speech" />
          </div>
        </TabsContent>
        <TabsContent value="element" className="mt-4">
          <div className="glass-card p-4">
            <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><Zap /> The Influence of the {insight.element} Element</h3>
            <SpeechPlayer text={elementText} elementId="element-speech"/>
          </div>
        </TabsContent>
        <TabsContent value="compatibility" className="mt-4">
          <div className="glass-card p-4">
            <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><Users /> Compatibility</h3>
            <ScrollArea className="h-72">
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
        <TabsContent value="future" className="mt-4">
           <div className="glass-card p-4">
            <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2"><Telescope/> Future Years</h3>
            <ScrollArea className="h-72">
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

function ResultsDisplay({
  insight,
  numerology,
  onReset,
}: {
  insight: AstroInsightOutput;
  numerology: NumerologyData | null;
  onReset: () => void;
}) {
  
  const [activeTab, setActiveTab] = React.useState<'astro' | 'numerology'>('astro');

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
    >
        <header className="text-center mb-6">
            <h1 
                className="text-4xl font-bold relative bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--color-primary-hsl))] via-[hsl(var(--color-quaternary-hsl))] to-[hsl(var(--color-secondary-hsl))]"
            >
                {insight.name}
            </h1>
            <p className="text-lg text-gray-400 mt-1">{insight.new_astrology_sign}</p>
        </header>

        <nav className="flex justify-center gap-2 mb-6">
            <TabButton id="astro" activeTab={activeTab} setActiveTab={setActiveTab}>Astro Insights</TabButton>
            {numerology && <TabButton id="numerology" activeTab={activeTab} setActiveTab={setActiveTab}>Numerology Report</TabButton>}
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
            <Button onClick={onReset} variant="link" className="text-primary text-lg">
              ← Create a New Profile
            </Button>
      </footer>
    </motion.div>
  );
}

const TabButton = ({ id, activeTab, setActiveTab, children } : { id: 'astro' | 'numerology', activeTab: string, setActiveTab: (id: 'astro' | 'numerology') => void, children: React.ReactNode }) => {
    const isActive = activeTab === id;
    return (
        <button
            onClick={() => setActiveTab(id)}
            className={cn(
                "flex-1 p-3 max-w-xs font-semibold text-gray-400 bg-[rgba(30,30,30,0.6)] border border-[rgba(255,255,255,0.1)] rounded-xl cursor-pointer transition-all relative overflow-hidden",
                "hover:text-white",
                { 'text-white': isActive }
            )}
        >
            {isActive && (
                <motion.div className="absolute inset-0 rounded-xl" style={{animation: 'pulse-border 4s linear infinite'}}/>
            )}
            <span className="relative z-10">{children}</span>
        </button>
    );
};


export function ProfileGenerator() {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const [formData, setFormData] = React.useState({ name: '', day: '', month: '', year: '', gender: '' });
  const [insight, setInsight] = React.useState<AstroInsightOutput | null>(null);
  const [numerology, setNumerology] = React.useState<NumerologyData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  
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
    setFormData({ name: '', day: '', month: '', year: '', gender: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { name, day, month, year, gender } = formData;
    if (!name || !day || !month || !year || !gender) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all the fields.',
      });
      return;
    }
    
    startTransition(async () => {
        const data = {
            name,
            day: parseInt(day),
            month: parseInt(month),
            year: parseInt(year),
            gender,
        };
        const result = await getAstroInsightAction(data);
        
        if (result.success && result.insight && result.numerology) {
            setInsight(result.insight);
            setNumerology(result.numerology);
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
  };

  return (
      <AnimatePresence mode="wait">
        {insight && numerology ? (
            <motion.div key="results">
                 <ResultsDisplay
                    insight={insight}
                    numerology={numerology}
                    onReset={handleReset}
                 />
            </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6"
          >
            <form onSubmit={handleSubmit}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">Mystique Compass</h2>
                <p className="text-gray-400">Astrology & Numerology</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" placeholder="e.g., Jane Doe" required value={formData.name} onChange={handleChange} disabled={isPending} />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input type="number" name="day" min="1" max="31" placeholder="Day" required value={formData.day} onChange={handleChange} disabled={isPending} />
                    <Input type="number" name="month" min="1" max="12" placeholder="Month" required value={formData.month} onChange={handleChange} disabled={isPending} />
                    <Input type="number" name="year" min="1900" max={new Date().getFullYear()} placeholder="Year" required value={formData.year} onChange={handleChange} disabled={isPending} />
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
                    <p className="text-xs text-gray-500">&copy; {new Date().getFullYear()} Mystique Compass. All Rights Reserved.</p>
               </footer>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
  );
}
