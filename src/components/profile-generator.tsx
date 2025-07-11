'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles, Star } from 'lucide-react';
import { getAstroInsightAction } from '@/app/actions';
import type { AstroInsightOutput } from '@/ai/flows/astro-insight-flow';

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, gender: value }));
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
                 toast({
                    title: 'Success!',
                    description: `Your reading for ${result.insight.name} is ready.`,
                });
            } else {
                setInsight(null);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: result.error,
                });
            }
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <CardHeader className="p-6">
                    <CardTitle className="text-2xl font-bold tracking-tight">Generate Your Profile</CardTitle>
                    <CardDescription>Enter your details for a personalized reading.</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
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
                        <Select name="gender" required onValueChange={handleSelectChange} disabled={isPending}>
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

            <AnimatePresence>
                {insight && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-2xl text-primary"><Sparkles className="w-6 h-6" /> Reading for {insight.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap text-base leading-relaxed">{insight.reading}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Your Cosmic Numbers & Colors</CardTitle>
                                </CardHeader>
                                <CardContent className="flex items-center gap-8">
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Lucky Number</p>
                                        <p className="text-4xl font-bold text-accent">{insight.luckyNumber}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">Lucky Color</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: insight.luckyColor.toLowerCase() }} />
                                            <p className="text-2xl font-bold">{insight.luckyColor}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
