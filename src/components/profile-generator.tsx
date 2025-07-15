
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles, BookOpen, Star, Users, Calendar, Compass, Grid3x3, Gem, Hash } from 'lucide-react';
import { getAstroInsightAction } from '@/app/actions';
import type { AstroInsightOutput } from '@/ai/flows/astro-insight-flow';
import type { NumerologyData } from '@/lib/numerology';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { NUMBER_MEANINGS, REPEATED_NUMBER_MEANINGS } from '@/lib/numerology';


function NumerologyDisplay({ numerology }: { numerology: NumerologyData }) {

    const numberEntries = Object.entries(numerology.numberCounts)
        .map(([digit, count]) => ({ digit: parseInt(digit), count }))
        .filter(item => item.count > 0)
        .sort((a, b) => a.digit - b.digit);
        
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <Card>
                    <CardHeader><CardTitle className="font-headline text-xl">Psyche Number</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold text-primary">{numerology.psycheNum}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="font-headline text-xl">Destiny Number</CardTitle></CardHeader>
                    <CardContent><p className="text-4xl font-bold text-primary">{numerology.destinyNum}</p></CardContent>
                </Card>
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
                                       <p className="whitespace-pre-wrap leading-relaxed">{repetitionMeaning}</p>
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
                                {numerology.arrowsOfStrength.map(arrow => (
                                    <AccordionItem value={arrow.name} key={arrow.name}>
                                        <AccordionTrigger>{arrow.name}</AccordionTrigger>
                                        <AccordionContent>
                                           <p className="italic text-muted-foreground text-sm">{arrow.description}</p>
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
                                {numerology.arrowsOfWeakness.map(arrow => (
                                    <AccordionItem value={arrow.name} key={arrow.name}>
                                        <AccordionTrigger>{arrow.name}</AccordionTrigger>
                                        <AccordionContent>
                                            <p className="italic text-muted-foreground">{arrow.description}</p>
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
                        <h4 className="font-bold text-lg">Your Kua Attributes</h4>
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


function ResultsDisplay({ insight, numerology, onReset }: { insight: AstroInsightOutput, numerology: NumerologyData | null, onReset: () => void }) {
    const currentYear = new Date().getFullYear();
    const futureYears = Object.entries(insight.signData.futures)
      .filter(([year]) => parseInt(year) >= currentYear)
      .sort(([yearA], [yearB]) => parseInt(yearA) - parseInt(yearB));
      
    const compatibilitySigns = Object.keys(insight.signData.compatibilities);

    return (
        <div className="p-6 bg-secondary/30">
            <header className="text-center mb-10 pb-6 border-b-2 border-primary/20">
                <h1 className="font-headline text-5xl text-gray-800">{insight.name}</h1>
                <h2 className="text-2xl text-primary font-bold mt-2">{insight.new_astrology_sign}</h2>
                <p className="text-muted-foreground text-lg mt-1">(A {insight.western_sign} born in the year of the {insight.element} {insight.sign})</p>
            </header>

            <Tabs defaultValue="astro" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-auto mb-6">
                    <TabsTrigger value="astro" className="py-2"><Sparkles className="mr-2" />Astro Insights</TabsTrigger>
                    <TabsTrigger value="numerology" className="py-2" disabled={!numerology}><Gem className="mr-2" />Numerology Report</TabsTrigger>
                </TabsList>
                <TabsContent value="astro">
                     <Tabs defaultValue="introduction" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                            <TabsTrigger value="introduction" className="flex items-center gap-2"><BookOpen /> Introduction</TabsTrigger>
                            <TabsTrigger value="element" className="flex items-center gap-2"><Star /> Element</TabsTrigger>
                            <TabsTrigger value="compatibilities" className="flex items-center gap-2"><Users /> Compatibility</TabsTrigger>
                            <TabsTrigger value="future" className="flex items-center gap-2"><Calendar /> Future</TabsTrigger>
                        </TabsList>
                        
                        <ScrollArea className="h-[450px] mt-4">
                            <div className="pr-4">
                                <TabsContent value="introduction">
                                    <Card>
                                        <CardHeader><CardTitle className="font-headline text-2xl">Your Animal Sign: The {insight.sign}</CardTitle></CardHeader>
                                        <CardContent className="pt-4"><p className="whitespace-pre-wrap leading-relaxed">{insight.signData.introduction}</p></CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="element">
                                    <Card>
                                        <CardHeader><CardTitle className="font-headline text-2xl">The Influence of the {insight.element} Element</CardTitle></CardHeader>
                                        <CardContent className="pt-4"><p className="whitespace-pre-wrap leading-relaxed">{insight.signData.elements[insight.element as keyof typeof insight.signData.elements]}</p></CardContent>
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
                                                {compatibilitySigns.map(sign => (
                                                    <AccordionItem value={sign} key={sign}>
                                                        <AccordionTrigger>With the {sign}</AccordionTrigger>
                                                        <AccordionContent>
                                                            <p className="whitespace-pre-wrap leading-relaxed">{insight.signData.compatibilities[sign as keyof typeof insight.signData.compatibilities]}</p>
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
                                                {futureYears.map(([year, futureData]) => (
                                                    <AccordionItem value={year} key={year}>
                                                        <AccordionTrigger>
                                                            {year} - The {futureData.element} {futureData.year}
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <p className="whitespace-pre-wrap leading-relaxed">{futureData.prediction}</p>
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
                        <div className="pr-4">
                            {numerology && <NumerologyDisplay numerology={numerology} />}
                        </div>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
            
            <div className="text-center mt-12">
                 <Button onClick={onReset} variant="link" className="text-primary text-lg">← Create a New Profile</Button>
            </div>
        </div>
    );
}

export function ProfileGenerator() {
    const { toast } = useToast();
    const [isPending, startTransition] = React.useTransition();
    const [formData, setFormData] = React.useState({
        name: '',
        day: '',
        month: '',
        year: '',
        gender: ''
    });
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
        setInsight(null);
        setNumerology(null);
        setError(null);
        setFormData({ name: '', day: '', month: '', year: '', gender: '' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
            const result = await getAstroInsightAction({
                name,
                day: parseInt(day),
                month: parseInt(month),
                year: parseInt(year),
                gender,
            });
            
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
                        <ResultsDisplay insight={insight} numerology={numerology} onReset={handleReset} />
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
                            <CardHeader className="p-6 text-center">
                                <CardTitle className="font-headline text-3xl">Generate Your Profile</CardTitle>
                                <CardDescription className="text-lg">Enter your details for a personalized reading.</CardDescription>
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
