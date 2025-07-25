

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { NUMBER_MEANINGS, REPEATED_NUMBER_MEANINGS } from '@/lib/numerology';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from '@/components/ui/separator';

function SpeechPlayer({ text, elementId }: { text: string; elementId: string }) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(-1);
    const [sentences, setSentences] = React.useState<string[]>([]);
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
        <div className="flex items-start gap-4">
            <div className="whitespace-pre-wrap leading-relaxed flex-1">
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
            <Button onClick={handlePlayPause} size="icon" variant="ghost" className="shrink-0" disabled={!text}>
                {isPlaying ? <StopCircle className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                <span className="sr-only">{isPlaying ? 'Stop' : 'Listen'}</span>
            </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <Card>
                    <CardHeader><CardTitle className="font-headline text-xl">Psyche Number</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold text-primary">{numerology.psycheNum}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="font-headline text-xl">Destiny Number</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold text-primary">{numerology.destinyNum}</p></CardContent>
                </Card>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Card className="cursor-pointer hover:bg-secondary/50 transition-colors">
                             <CardHeader>
                                <CardTitle className="font-headline text-xl flex items-center justify-center gap-1">
                                    Fate Number <Info className="h-4 w-4 text-muted-foreground"/>
                                </CardTitle>
                            </CardHeader>
                            <CardContent><p className="text-4xl font-bold text-primary">{numerology.compoundNum}</p></CardContent>
                        </Card>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0">
                        <Tabs defaultValue="compound" className="w-full">
                           <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="compound">Compound</TabsTrigger>
                                {numerology.reducedCompoundNum && <TabsTrigger value="essence">Inner Essence</TabsTrigger>}
                                {numerology.karmicFateNum && <TabsTrigger value="karmic">Karmic</TabsTrigger>}
                            </TabsList>
                            <ScrollArea className="h-96">
                               <div className="p-4">
                                <TabsContent value="compound">
                                    <div className="space-y-4">
                                        <h4 className="font-headline text-lg font-semibold leading-none flex items-center gap-2">
                                            <Skull className="h-5 w-5" /> Compound Fate: {numerology.compoundNum}
                                        </h4>
                                        <div className="mt-2">
                                            <SpeechPlayer text={numerology.compoundMeaning} elementId="compound-meaning-speech" />
                                        </div>
                                    </div>
                                </TabsContent>
                                {numerology.reducedCompoundNum && numerology.reducedCompoundMeaning && (
                                <TabsContent value="essence">
                                    <div className="space-y-4">
                                        <h4 className="font-headline text-lg font-semibold leading-none flex items-center gap-2">
                                            <Gem className="h-5 w-5" /> Inner Essence: {numerology.reducedCompoundNum}
                                        </h4>
                                        <div className="mt-2">
                                            <SpeechPlayer text={numerology.reducedCompoundMeaning} elementId="reduced-compound-meaning-speech" />
                                        </div>
                                    </div>
                                </TabsContent>
                                )}
                                {numerology.karmicFateNum && numerology.karmicFateMeaning && (
                                <TabsContent value="karmic">
                                    <div className="space-y-4">
                                        <h4 className="font-headline text-lg font-semibold leading-none flex items-center gap-2">
                                            <Swords className="h-5 w-5" /> Karmic Fate: {numerology.karmicFateNum}
                                        </h4>
                                        <div className="mt-2">
                                            <SpeechPlayer text={numerology.karmicFateMeaning} elementId="karmic-fate-meaning-speech" />
                                        </div>
                                    </div>
                                </TabsContent>
                                )}
                               </div>
                            </ScrollArea>
                        </Tabs>
                    </PopoverContent>
                </Popover>

                <Card>
                    <CardHeader><CardTitle className="font-headline text-xl">Kua Number</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold text-primary">{numerology.kuaNum}</p></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><Grid3x3 /> Lo Shu Grid</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 justify-center">
                        <div className="relative aspect-square w-full max-w-xs mx-auto">
                            <div className="grid grid-cols-3 gap-2 size-full">
                                {numerology.loShuGrid.flat().map((cell, index) => (
                                    <div key={index} className="flex items-center justify-center bg-secondary/50 rounded-md text-xl font-bold text-foreground aspect-square">
                                        {cell || <span className="text-muted-foreground/20">-</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><Hash /> Number Meanings</CardTitle>
                    <CardDescription>Based on the numbers in your Lo Shu Grid.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" className="w-full">
                        {numberEntries.map(({ digit, count }) => {
                            const meaningKey = digit as keyof typeof NUMBER_MEANINGS;
                            const repetitionKey = digit as keyof typeof REPEATED_NUMBER_MEANINGS;
                            const countKey = Math.min(count, 5) as keyof typeof REPEATED_NUMBER_MEANINGS[typeof repetitionKey];

                            const meaning = NUMBER_MEANINGS[meaningKey];
                            const repetitionMeaning = REPEATED_NUMBER_MEANINGS[repetitionKey]?.[countKey] || "No specific meaning for this count.";
                            
                            return (
                                <AccordionItem value={`item-${digit}`} key={digit}>
                                    <AccordionTrigger>
                                        <div className='flex items-center gap-2'>
                                            <Badge variant="outline" className='text-base'>{digit}</Badge>
                                            <span className='font-semibold text-left'>{meaning.title} (appears {count}x)</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                       <SpeechPlayer text={repetitionMeaning} elementId={`number-meaning-${digit}-speech`} />
                                    </AccordionContent>
                                </AccordionItem>
                            )
                        })}
                    </Accordion>
                </CardContent>
            </Card>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle className="font-headline text-2xl">Arrows of Strength</CardTitle></CardHeader>
                    <CardContent>
                        {numerology.arrowsOfStrength.length > 0 ? (
                            <Accordion type="single" collapsible className="w-full">
                                {numerology.arrowsOfStrength.map((arrow, index) => (
                                    <AccordionItem value={arrow.name} key={arrow.name}>
                                        <AccordionTrigger>{arrow.name}</AccordionTrigger>
                                        <AccordionContent>
                                           <SpeechPlayer text={arrow.description} elementId={`strength-arrow-${index}-speech`} />
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : <p>No arrows of strength present.</p>}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="font-headline text-2xl">Arrows of Weakness</CardTitle></CardHeader>
                     <CardContent>
                        {numerology.arrowsOfWeakness.length > 0 ? (
                           <Accordion type="single" collapsible className="w-full">
                                {numerology.arrowsOfWeakness.map((arrow, index) => (
                                    <AccordionItem value={arrow.name} key={arrow.name}>
                                        <AccordionTrigger>{arrow.name}</AccordionTrigger>
                                        <AccordionContent>
                                            <SpeechPlayer text={arrow.description} elementId={`weakness-arrow-${index}-speech`} />
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : <p>No arrows of weakness present.</p>}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><Compass/> Kua Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <div className="flex items-center">
                            <h4 className="font-bold text-lg flex-1">Your Kua Attributes</h4>
                        </div>
                         <SpeechPlayer text={kuaAttributesText} elementId="kua-attributes-speech" />
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                             <Badge variant="secondary">Element: {numerology.kuaAttributes.element}</Badge>
                             <Badge variant="secondary">Colors: {numerology.kuaAttributes.colors}</Badge>
                             <Badge variant="secondary">Season: {numerology.kuaAttributes.season}</Badge>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-lg">Auspicious Directions</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                            {Object.entries(numerology.auspiciousDirections).map(([key, value]) => (
                                <Badge key={key} variant="outline" className="border-primary/50">{key}: <span className="font-bold ml-1">{value as string}</span></Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}

function ResultsDisplay({
  insight,
  numerology,
  onReset,
  isPending,
  onSubmit,
  history,
  onHistorySelect,
}: {
  insight: AstroInsightOutput;
  numerology: NumerologyData | null;
  onReset: () => void;
  isPending: boolean;
  onSubmit: (data: AstroInsightInput) => void;
  history: AstroInsightInput[];
  onHistorySelect: (data: AstroInsightInput) => void;
}) {
  const [formData, setFormData] = React.useState({ name: '', day: '', month: '', year: '', gender: '' });
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();
  const futureYears = Object.entries(insight.signData.futures)
    .filter(([year]) => parseInt(year) >= currentYear)
    .sort(([yearA], [yearB]) => parseInt(yearA) - parseInt(yearB));
  
  const compatibilitySigns = Object.keys(insight.signData.compatibilities);

  const elementKey = insight.element as keyof typeof insight.signData.elements;
  const elementText = insight.signData.elements[elementKey] || `No specific element text found for ${insight.element}.`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, day, month, year, gender } = formData;
    if (!name || !day || !month || !year || !gender) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all the fields.',
      });
      return;
    }
    onSubmit({
      name,
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year),
      gender,
    });
  };

  return (
    <div className="p-6 bg-secondary/30">
      <header className="text-center mb-6 pb-6 border-b-2 border-primary/20">
        <h1 className="font-headline text-5xl text-gray-800">Mystique Compass</h1>
      </header>
      
      <Collapsible className="mb-6">
        <div className="flex items-center justify-between space-x-4">
            <h4 className="text-lg font-semibold">Check another profile</h4>
            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" disabled={history.length === 0}>
                            <History className="mr-2 h-4 w-4" />
                            History
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                         <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Recent Checks</h4>
                            <p className="text-sm text-muted-foreground">
                              Select a profile to view it again.
                            </p>
                          </div>
                          <div className="grid gap-2">
                            {history.map((item, index) => (
                               <Button key={index} variant="ghost" className="justify-start" onClick={() => onHistorySelect(item)}>
                                 <UserCheck className="mr-2 h-4 w-4" />
                                 {item.name} - {item.day}/{item.month}/{item.year}
                               </Button>
                            ))}
                          </div>
                        </div>
                    </PopoverContent>
                </Popover>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </CollapsibleTrigger>
            </div>
        </div>
        <CollapsibleContent>
             <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded-lg bg-background space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="new-name">Full Name</Label>
                    <Input id="new-name" name="name" placeholder="e.g., John Doe" required value={formData.name} onChange={handleChange} disabled={isPending} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="new-day">Day</Label>
                        <Input id="new-day" type="number" name="day" min="1" max="31" placeholder="Day" required value={formData.day} onChange={handleChange} disabled={isPending} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-month">Month</Label>
                        <Input id="new-month" type="number" name="month" min="1" max="12" placeholder="Month" required value={formData.month} onChange={handleChange} disabled={isPending} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-year">Year</Label>
                        <Input id="new-year" type="number" name="year" min="1900" max={new Date().getFullYear()} placeholder="Year" required value={formData.year} onChange={handleChange} disabled={isPending} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="new-gender">Gender</Label>
                    <Select name="gender" required onValueChange={handleSelectChange} value={formData.gender} disabled={isPending}>
                        <SelectTrigger id="new-gender">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate New Reading
                </Button>
            </form>
        </CollapsibleContent>
      </Collapsible>
      
      <div className="text-center mb-10">
          <h2 className="font-headline text-4xl text-gray-800">{insight.name}</h2>
          <h3 className="text-xl text-primary font-bold mt-1">{insight.new_astrology_sign}</h3>
          <p className="text-muted-foreground text-md mt-1">(A {insight.western_sign} born in the year of the {insight.element} {insight.sign})</p>
      </div>


      <Tabs defaultValue="astro" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto mb-6">
          <TabsTrigger value="astro" className="py-2">
            <Sparkles className="mr-2" />
            Astro Insights
          </TabsTrigger>
          <TabsTrigger value="numerology" className="py-2" disabled={!numerology}>
            <Gem className="mr-2" />
            Numerology Report
          </TabsTrigger>
        </TabsList>
        <TabsContent value="astro">
          <Tabs defaultValue="introduction" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
              <TabsTrigger value="introduction" className="flex items-center gap-2">
                <BookOpen /> Introduction
              </TabsTrigger>
              <TabsTrigger value="element" className="flex items-center gap-2">
                <Star /> Element
              </TabsTrigger>
              <TabsTrigger value="compatibilities" className="flex items-center gap-2">
                <Users /> Compatibility
              </TabsTrigger>
              <TabsTrigger value="future" className="flex items-center gap-2">
                <Calendar /> Future
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[450px] mt-4">
              <div className="pr-4">
                <TabsContent value="introduction">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl flex-1">Your Animal Sign: The {insight.sign}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <SpeechPlayer text={insight.signData.introduction} elementId="intro-speech" />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="element">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl flex-1">The Influence of the {insight.element} Element</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                       <SpeechPlayer text={elementText} elementId="element-speech"/>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="compatibilities">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl">Compatibility with other signs</CardTitle>
                      <CardDescription>Click on a sign to see your compatibility report.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full">
                        {compatibilitySigns.map((sign, index) => (
                          <AccordionItem value={sign} key={sign}>
                            <AccordionTrigger>With the {sign}</AccordionTrigger>
                            <AccordionContent>
                               <SpeechPlayer text={insight.signData.compatibilities[sign as keyof typeof insight.signData.compatibilities]} elementId={`compat-speech-${index}`} />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="future">
                  <Card>
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl">Your Future Years</CardTitle>
                      <CardDescription>Click on a year to see what it holds for you.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <Accordion type="single" collapsible className="w-full">
                        {futureYears.map(([year, futureData], index) => (
                          <AccordionItem value={year} key={year}>
                            <AccordionTrigger>
                              {year} - The {futureData.element} {futureData.year}
                            </AccordionTrigger>
                            <AccordionContent>
                              <SpeechPlayer text={futureData.prediction} elementId={`future-speech-${index}`} />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </TabsContent>
        <TabsContent value="numerology">
          <ScrollArea className="h-[550px]">
            <div className="pr-4">{numerology && <NumerologyDisplay numerology={numerology} />}</div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="text-center mt-12">
        <Button onClick={onReset} variant="link" className="text-primary text-lg">
          ← Create a New Profile
        </Button>
      </div>
    </div>
  );
}


export function ProfileGenerator() {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const [formData, setFormData] = React.useState({ name: '', day: '', month: '', year: '', gender: '' });
  const [insight, setInsight] = React.useState<AstroInsightOutput | null>(null);
  const [numerology, setNumerology] = React.useState<NumerologyData | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [history, setHistory] = React.useState<AstroInsightInput[]>([]);

  React.useEffect(() => {
    try {
        const savedHistory = localStorage.getItem('astroInsightHistory');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    } catch (e) {
        console.error("Could not read history from localStorage", e);
    }
  }, []);

  const addToHistory = (newItem: AstroInsightInput) => {
    setHistory(prevHistory => {
        const newHistory = [newItem, ...prevHistory.filter(item => item.name !== newItem.name)].slice(0, 21);
        try {
            localStorage.setItem('astroInsightHistory', JSON.stringify(newHistory));
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
    setFormData({ name: '', day: '', month: '', year: '', gender: '' });
  };

  const processSubmit = (data: AstroInsightInput) => {
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
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
    processSubmit({
      name,
      day: parseInt(day),
      month: parseInt(month),
      year: parseInt(year),
      gender,
    });
  };
  
  const handleHistorySelect = (data: AstroInsightInput) => {
    processSubmit(data);
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {insight ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ResultsDisplay
              insight={insight}
              numerology={numerology}
              onReset={handleReset}
              isPending={isPending}
              onSubmit={processSubmit}
              history={history}
              onHistorySelect={handleHistorySelect}
            />
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit}>
              <CardHeader className="p-6">
                 <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                        <CardTitle className="font-headline text-3xl">Generate Your Profile</CardTitle>
                        <CardDescription className="text-lg">Enter your details for a personalized reading.</CardDescription>
                    </div>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={history.length === 0}>
                                <History className="h-5 w-5" />
                                <span className="sr-only">View History</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                             <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="font-medium leading-none">Recent Checks</h4>
                                <p className="text-sm text-muted-foreground">
                                  Select a profile to view it again.
                                </p>
                              </div>
                              <div className="grid gap-2">
                                {history.map((item, index) => (
                                   <Button key={index} variant="ghost" className="justify-start" onClick={() => handleHistorySelect(item)}>
                                     <UserCheck className="mr-2 h-4 w-4" />
                                     {item.name} - {item.day}/{item.month}/{item.year}
                                   </Button>
                                ))}
                              </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                 </div>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base">Your Full Name</Label>
                  <Input id="name" name="name" placeholder="e.g., Jane Doe" required value={formData.name} onChange={handleChange} disabled={isPending} />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Date of Birth</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Input type="number" name="day" min="1" max="31" placeholder="Day" required value={formData.day} onChange={handleChange} disabled={isPending} />
                    <Input type="number" name="month" min="1" max="12" placeholder="Month" required value={formData.month} onChange={handleChange} disabled={isPending} />
                    <Input type="number" name="year" min="1900" max={new Date().getFullYear()} placeholder="Year" required value={formData.year} onChange={handleChange} disabled={isPending} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-base">Gender</Label>
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
              </CardContent>
              <CardFooter className="flex-col items-stretch p-6 bg-secondary/30">
                <Button type="submit" disabled={isPending} size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base py-6 group">
                  {isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-5 w-5" />
                  )}
                  Generate My Reading
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
