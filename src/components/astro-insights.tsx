'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2, Sparkles, Star } from 'lucide-react';
import { getAstroInsightAction } from '@/app/actions';
import type { AstroInsightOutput } from '@/ai/flows/astro-insight-flow';

export function AstroInsights() {
    const { toast } = useToast();
    const [isPending, startTransition] = React.useTransition();
    const [celestialObject, setCelestialObject] = React.useState('');
    const [insight, setInsight] = React.useState<AstroInsightOutput | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!celestialObject) {
            toast({
                variant: 'destructive',
                title: 'No Celestial Object',
                description: 'Please enter the name of a celestial object.',
            });
            return;
        }

        startTransition(async () => {
            const result = await getAstroInsightAction(celestialObject);
            if (result.success && result.insight) {
                setInsight(result.insight);
                 toast({
                    title: 'Success!',
                    description: `Insights for ${result.insight.name} are ready.`,
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
                    <CardTitle className="text-2xl font-bold tracking-tight">1. Enter a Celestial Object</CardTitle>
                    <CardDescription>What would you like to learn about? (e.g., Mars, Andromeda Galaxy)</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="celestial-object">Celestial Object</Label>
                        <Input
                            id="celestial-object"
                            type="text"
                            placeholder="e.g., Jupiter"
                            value={celestialObject}
                            onChange={(e) => setCelestialObject(e.target.value)}
                            disabled={isPending}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-stretch p-6 bg-secondary/30">
                    <Button type="submit" disabled={isPending || !celestialObject} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base py-6 group">
                        {isPending ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-5 w-5" />
                        )}
                        Get Astro Insights
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
                                    <CardTitle className="flex items-center gap-2 text-2xl text-primary"><Sparkles className="w-6 h-6" /> {insight.name} ({insight.type})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap text-base leading-relaxed">{insight.description}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">Interesting Facts</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {insight.facts.map((fact, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                className="flex items-start gap-3"
                                            >
                                                <Star className="w-4 h-4 mt-1 text-accent flex-shrink-0" />
                                                <span className="text-sm leading-relaxed">{fact}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
