'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cpu, Database, Loader2, Server, Sparkles } from 'lucide-react';
import { Checklist } from './checklist';
import { getGuidanceAction } from '@/app/actions';

const features = [
  { id: 'firestore', label: 'Firestore', icon: Database, description: 'Flexible, scalable NoSQL cloud database.' },
  { id: 'functions', label: 'Cloud Functions', icon: Cpu, description: 'Run backend code without managing servers.' },
  { id: 'hosting', label: 'Hosting', icon: Server, description: 'Fast and secure web hosting.' },
];

const generateChecklist = (features: Set<string>): string[] => {
    const items: string[] = [];
    items.push('Run `firebase login` to authenticate with your Google account.');
    items.push('Run `firebase init` in your project directory.');
    if (features.has('firestore')) {
        items.push('Select Firestore in the `firebase init` features list.');
        items.push('Set up Firestore security rules in `firestore.rules`.');
        items.push('Initialize the Firebase SDK in your application to start using Firestore.');
    }
    if (features.has('functions')) {
        items.push('Select Functions in the `firebase init` features list.');
        items.push('Choose a language (e.g., TypeScript) for your functions.');
        items.push('Install dependencies with `npm install` inside the `functions` directory.');
        items.push('Deploy your first function with `firebase deploy --only functions`.');
    }
    if (features.has('hosting')) {
        items.push('Select Hosting in the `firebase init` features list.');
        items.push('Configure `firebase.json` to set your public directory (e.g., `build` or `public`).');
        items.push('Deploy your site with `firebase deploy --only hosting`.');
    }
    return items;
};

export function FirebaseSetupWizard() {
    const { toast } = useToast();
    const [isPending, startTransition] = React.useTransition();
    const [selectedFeatures, setSelectedFeatures] = React.useState<Set<string>>(new Set());
    const [guidance, setGuidance] = React.useState<string | null>(null);
    const [checklistItems, setChecklistItems] = React.useState<string[]>([]);

    const handleFeatureToggle = (featureId: string) => {
        setSelectedFeatures(prev => {
            const newSet = new Set(prev);
            if (newSet.has(featureId)) {
                newSet.delete(featureId);
            } else {
                newSet.add(featureId);
            }
            return newSet;
        });
    };

    const handleSubmit = () => {
        if (selectedFeatures.size === 0) {
            toast({
                variant: 'destructive',
                title: 'No Features Selected',
                description: 'Please select at least one Firebase feature to get guidance.',
            });
            return;
        }

        startTransition(async () => {
            const selections = Array.from(selectedFeatures).join(', ');
            const result = await getGuidanceAction(selections);
            if (result.success && result.guidance) {
                setGuidance(result.guidance);
                setChecklistItems(generateChecklist(selectedFeatures));
                 toast({
                    title: 'Success!',
                    description: 'Your personalized guidance is ready.',
                });
            } else {
                setGuidance(null);
                setChecklistItems([]);
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
            <CardHeader className="p-6">
                <CardTitle className="text-2xl font-bold tracking-tight">1. Select Firebase Features</CardTitle>
                <CardDescription>Choose the services you plan to use. We'll tailor the setup steps for you.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {features.map((feature) => {
                        const isSelected = selectedFeatures.has(feature.id);
                        return (
                            <div
                                key={feature.id}
                                onClick={() => handleFeatureToggle(feature.id)}
                                className={cn(
                                    "rounded-lg border-2 p-4 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.03]",
                                    isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <feature.icon className={cn("w-6 h-6", isSelected ? 'text-primary' : 'text-muted-foreground')} />
                                        <Label htmlFor={feature.id} className="font-semibold text-base cursor-pointer">{feature.label}</Label>
                                    </div>
                                    <Checkbox
                                        id={feature.id}
                                        checked={isSelected}
                                        onCheckedChange={() => handleFeatureToggle(feature.id)}
                                        className="w-5 h-5"
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch p-6 bg-secondary/30">
                <Button onClick={handleSubmit} disabled={isPending || selectedFeatures.size === 0} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-base py-6 group">
                    {isPending ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-5 w-5" />
                    )}
                    Get Setup Guidance
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
            </CardFooter>

            <AnimatePresence>
                {guidance && (
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
                                    <CardTitle className="flex items-center gap-2 text-2xl text-primary"><Sparkles className="w-6 h-6" /> Your Personalized Guidance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap text-base leading-relaxed">{guidance}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">2. Initialization Checklist</CardTitle>
                                    <CardDescription>Follow these steps to get your project running.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Checklist items={checklistItems} />
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
