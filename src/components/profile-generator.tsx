

'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { getAstroInsightAction } from '@/app/actions';
import type { AstroInsightOutput } from '@/ai/flows/astro-insight-flow';

function ResultsDisplay({ insight, onReset }: { insight: AstroInsightOutput, onReset: () => void }) {
    return (
        <div className="p-6">
            <header className="text-center mb-10 pb-6 border-b">
                <h1 className="font-headline text-5xl text-gray-800">{insight.name}</h1>
                <h2 className="text-2xl text-primary font-bold mt-2">{insight.new_astrology_sign}</h2>
                <p className="text-muted-foreground text-lg mt-1">(A {insight.western_sign} born in the year of the {insight.element} {insight.sign})</p>
            </header>

            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle className="font-headline text-2xl border-b pb-3">Your Combined Sign: {insight.new_astrology_sign}</CardTitle></CardHeader>
                    <CardContent className="pt-4"><p className="whitespace-pre-wrap leading-relaxed">{insight.new_astrology_desc}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="font-headline text-2xl border-b pb-3">AI Generated Reading</CardTitle></CardHeader>
                    <CardContent className="pt-4">
                        <p className="whitespace-pre-wrap leading-relaxed">{insight.reading}</p>
                        <div className="flex justify-around mt-4 text-center">
                            <div><span className="text-muted-foreground">Lucky Number</span><br/><span className="font-bold text-primary text-xl">{insight.luckyNumber}</span></div>
                            <div><span className="text-muted-foreground">Lucky Color</span><br/><span className="font-bold text-primary text-xl">{insight.luckyColor}</span></div>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
            const insightResult = await getAstroInsightAction({
                name,
                day: parseInt(day),
                month: parseInt(month),
                year: parseInt(year),
                gender,
            });
            
            if (insightResult.success && insightResult.insight) {
                setInsight(insightResult.insight);
            } else {
                setInsight(null);
                setError(insightResult.error || 'An unexpected error occurred.');
                toast({
                  variant: 'destructive',
                  title: 'Error Generating Profile',
                  description: insightResult.error || 'An unexpected error occurred while fetching insights. Please try again.',
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
                        <ResultsDisplay insight={insight} onReset={handleReset} />
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
