'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles, BookOpen, Star, Users, Calendar, Compass, Grid3x3, Gem, Hash, ChevronsUpDown, History, UserCheck, Volume2, StopCircle, Skull, Info, Swords } from 'lucide-react';
import { getAstroInsightAction } from '@/app/actions';
import type { AstroInsightInput } from '@/ai/flows/astro-insight-flow';
import type { AstroInsightOutput } from '@/ai/flows/astro-insight-flow';
import type { NumerologyData } from '@/lib/numerology';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { NUMBER_MEANINGS, REPEATED_NUMBER_MEANINGS } from '@/lib/numerology';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from '@/lib/utils';


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

function NumerologyDisplay({ numerology }: { numerology: NumerologyData }) {

    const numberEntries = Object.entries(numerology.numberCounts)
        .map(([digit, count]) => ({ digit: parseInt(digit), count }))
        .filter(item => item.count > 0)
        .sort((a, b) => a.digit - b.digit);
        
    const kuaAttributesText = `Your Kua Attributes are: Element is ${numerology.kuaAttributes.element}. Lucky colors are ${numerology.kuaAttributes.colors}. Auspicious season is ${numerology.kuaAttributes.season}.`;
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="glass-card p-4">
                    <h3 className="font-semibold text-primary">Psyche Number</h3>
                    <p className="text-5xl font-bold text-secondary">{numerology.psycheNum}</p>
                </div>
                <div className="glass-card p-4">
                    <h3 className="font-semibold text-primary">Destiny Number</h3>
                    <p className="text-5xl font-bold text-secondary">{numerology.destinyNum}</p>
                </div>
                <div className="glass-card p-4">
                    <h3 className="font-semibold text-primary">Kua Number</h3>
                    <p className="text-5xl font-bold text-secondary">{numerology.kuaNum}</p>
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                         <div className="glass-card p-4 cursor-pointer hover:bg-[rgba(40,40,40,0.7)] transition-colors">
                            <h3 className="font-semibold text-primary flex items-center justify-center gap-1">
                                Fate Number <Info className="h-4 w-4"/>
                            </h3>
                            <p className="text-5xl font-bold text-secondary">{numerology.compoundNum}</p>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 glass-card p-0 border-0" side="bottom" align="center">
                        <p>This is test</p>
                    </PopoverContent>
                </Popover>
            </div>
            
        </div>
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
  const [activeAstroTab, setActiveAstroTab] = React.useState('introduction');
  
  const compatibilitySigns = Object.keys(insight.signData.compatibilities);
  const elementKey = insight.element as keyof typeof insight.signData.elements;
  const elementText = insight.signData.elements[elementKey] || `No specific element text found for ${insight.element}.`;

  const futureYears = Object.entries(insight.signData.futures)
    .filter(([year]) => parseInt(year) >= new Date().getFullYear())
    .sort(([yearA], [yearB]) => parseInt(yearA) - parseInt(yearB));


  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
    >
        <header className="text-center mb-6">
            <h1 
                className="text-4xl font-bold relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-400 to-yellow-400"
            >
                {insight.name}
            </h1>
            <p className="text-lg text-gray-400 mt-1">{insight.new_astrology_sign}</p>
        </header>

        <nav className="flex gap-2 mb-6">
            <TabButton id="astro" activeTab={activeTab} setActiveTab={setActiveTab}>Astro Insights</TabButton>
            {numerology && <TabButton id="numerology" activeTab={activeTab} setActiveTab={setActiveTab}>Numerology</TabButton>}
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
                    <div className="space-y-4">
                        <div className="glass-card p-4">
                            <h3 className="font-semibold text-lg text-primary mb-2">Your Animal Sign: The {insight.sign}</h3>
                             <SpeechPlayer text={insight.signData.introduction} elementId="intro-speech" />
                        </div>
                        <div className="glass-card p-4">
                            <h3 className="font-semibold text-lg text-primary mb-2">The Influence of the {insight.element} Element</h3>
                            <SpeechPlayer text={elementText} elementId="element-speech"/>
                        </div>
                        <Accordion type="single" collapsible className="w-full glass-card p-4">
                            <AccordionItem value="compat" className="border-b-0">
                                <AccordionTrigger className="font-semibold text-lg text-primary hover:no-underline">Compatibility</AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-2 mt-2">
                                    {compatibilitySigns.map((sign, index) => (
                                        <Accordion key={sign} type="single" collapsible className="w-full">
                                            <AccordionItem value={sign} className="border-b border-gray-700/50 last:border-b-0">
                                                <AccordionTrigger className="text-base text-gray-300 hover:text-white hover:no-underline">With the {sign}</AccordionTrigger>
                                                <AccordionContent>
                                                    <SpeechPlayer text={insight.signData.compatibilities[sign as keyof typeof insight.signData.compatibilities]} elementId={`compat-speech-${index}`} />
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <Accordion type="single" collapsible className="w-full glass-card p-4">
                            <AccordionItem value="future" className="border-b-0">
                                <AccordionTrigger className="font-semibold text-lg text-primary hover:no-underline">Future Years</AccordionTrigger>
                                <AccordionContent>
                                     <div className="space-y-2 mt-2">
                                        {futureYears.map(([year, futureData], index) => (
                                             <Accordion key={year} type="single" collapsible className="w-full">
                                                <AccordionItem value={year} className="border-b border-gray-700/50 last:border-b-0">
                                                    <AccordionTrigger className="text-base text-gray-300 hover:text-white hover:no-underline">{year} - The {futureData.element} {futureData.year}</AccordionTrigger>
                                                    <AccordionContent>
                                                        <SpeechPlayer text={futureData.prediction} elementId={`future-speech-${index}`} />
                                                    </AccordionContent>
                                                </AccordionItem>
                                             </Accordion>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
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
                "flex-1 p-3 font-semibold text-gray-400 bg-[rgba(30,30,30,0.6)] border border-[rgba(255,255,255,0.1)] rounded-xl cursor-pointer transition-colors relative overflow-hidden",
                "hover:text-white",
                { 'text-white': isActive }
            )}
        >
            {children}
            {isActive && (
                <motion.div
                    className="absolute inset-0 border-2 border-transparent rounded-xl"
                    style={{
                        background: 'conic-gradient(from 180deg at 50% 50%, #8AB4F8, #E583A8, #FDD663, #A1C298, #8AB4F8)',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        animation: 'spin 4s linear infinite',
                        zIndex: 0
                    }}
                    layoutId="active-tab-border"
                />
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
