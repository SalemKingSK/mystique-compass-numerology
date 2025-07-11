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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function ResultsDisplay({ insight, onReset }: { insight: AstroInsightOutput, onReset: () => void }) {
    return (
        <div className="p-6 bg-background rounded-lg">
            <div className="text-center mb-6 pb-4 border-b">
                <h1 className="text-3xl font-bold text-primary">{insight.name}</h1>
                <h2 className="text-xl text-accent font-semibold">{insight.new_astrology_sign}</h2>
                <p className="text-muted-foreground">(A {insight.western_sign} born in the year of the {insight.element} {insight.sign})</p>
            </div>

            <Tabs defaultValue="numerology" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="numerology">Numerology</TabsTrigger>
                    <TabsTrigger value="chinese_zodiac">Chinese Zodiac</TabsTrigger>
                    <TabsTrigger value="new_astrology">New Astrology</TabsTrigger>
                </TabsList>

                <TabsContent value="numerology">
                    <div className="grid md:grid-cols-3 gap-6">
                        <aside className="md:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Core Numbers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 text-center gap-4">
                                        <div>
                                            <div className="text-4xl font-bold text-accent">{insight.psyche_num}</div>
                                            <div className="text-xs text-muted-foreground">Psyche</div>
                                        </div>
                                        <div>
                                            <div className="text-4xl font-bold text-accent">{insight.destiny_num}</div>
                                            <div className="text-xs text-muted-foreground">Destiny</div>
                                        </div>
                                        <div>
                                            <div className="text-4xl font-bold text-accent">{insight.kua_num}</div>
                                            <div className="text-xs text-muted-foreground">Kua</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle>Lo Shu Grid</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <table className="w-full border-collapse">
                                        <tbody>
                                            {insight.lo_shu_grid.map((row, i) => (
                                                <tr key={i}>
                                                    {row.map((cell, j) => (
                                                        <td key={j} className="border text-center h-16 w-16 text-2xl font-bold text-primary">
                                                            {cell || ''}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </CardContent>
                            </Card>
                        </aside>
                        <main className="md:col-span-2 space-y-6">
                            {insight.found_arrows?.length > 0 && (
                                <Card>
                                    <CardHeader><CardTitle>Arrows of Strength</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        {insight.found_arrows.map(arrow => (
                                            <div key={arrow.name}>
                                                <h5 className="font-semibold">{arrow.name}</h5>
                                                <p className="text-muted-foreground text-sm">{arrow.description}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                             {insight.number_analysis?.length > 0 && (
                                <Card>
                                    <CardHeader><CardTitle>Number Repetition Analysis</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        {insight.number_analysis.map(item => (
                                            <div key={item.number}>
                                                <h5 className="font-semibold">Number {item.number} ({item.count} appearance/s)</h5>
                                                <p className="text-muted-foreground text-sm">{item.meaning}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </main>
                    </div>
                </TabsContent>
                
                <TabsContent value="chinese_zodiac" className="space-y-6">
                     <Card>
                        <CardHeader><CardTitle>Your Animal Sign: The {insight.sign}</CardTitle></CardHeader>
                        <CardContent><p className="whitespace-pre-wrap">{insight.general_desc}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>The Influence of the {insight.element} Element</CardTitle></CardHeader>
                        <CardContent><p className="whitespace-pre-wrap">{insight.elemental_desc}</p></CardContent>
                    </Card>
                     <Card>
                        <CardHeader><CardTitle>Compatibilities</CardTitle></CardHeader>
                        <CardContent><p className="whitespace-pre-wrap">{insight.compatibilities}</p></CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="new_astrology">
                     <Card>
                        <CardHeader><CardTitle>Your Combined Sign: {insight.new_astrology_sign}</CardTitle></CardHeader>
                        <CardContent><p className="whitespace-pre-wrap">{insight.new_astrology_desc}</p></CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="text-center mt-8">
                 <Button onClick={onReset} variant="outline">← Create a New Profile</Button>
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
            const result = await getAstroInsightAction({
                name,
                day: parseInt(day),
                month: parseInt(month),
                year: parseInt(year),
                gender,
            });
            if (result.success && result.insight) {
                setInsight(result.insight);
            } else {
                setInsight(null);
                setError(result.error || 'An unexpected error occurred.');
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
                            <CardHeader className="p-6">
                                <CardTitle className="text-2xl font-bold tracking-tight">Generate Your Profile</CardTitle>
                                <CardDescription>Enter your details for a personalized reading.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-4">
                                {error && (
                                     <div className="bg-destructive/10 text-destructive border border-destructive/20 p-3 rounded-md text-sm">
                                        <p className="font-bold">Error</p>
                                        <p>{error}</p>
                                    </div>
                                )}
                                <div className="form-group">
                                    <Label htmlFor="name">Your Full Name</Label>
                                    <Input id="name" name="name" placeholder="e.g., Jane Doe" required value={formData.name} onChange={handleChange} disabled={isPending} />
                                </div>
                                 <div className="form-group">
                                    <Label>Date of Birth</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <Input type="number" name="day" min="1" max="31" placeholder="Day" required value={formData.day} onChange={handleChange} disabled={isPending} />
                                        <Input type="number" name="month" min="1" max="12" placeholder="Month" required value={formData.month} onChange={handleChange} disabled={isPending} />
                                        <Input type="number" name="year" min="1900" max={new Date().getFullYear()} placeholder="Year" required value={formData.year} onChange={handleChange} disabled={isPending} />
                                    </div>
                                </div>
                                <div className="form-group">
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
                            </CardContent>
                            <CardFooter className="flex-col items-stretch p-6 bg-secondary/30">
                                <Button type="submit" disabled={isPending} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base py-6 group">
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
