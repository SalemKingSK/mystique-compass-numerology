
'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { getAstroInsightAction } from '@/app/actions';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';

import type { AstroInsightInput, AstroInsightOutput, NumerologyData } from './types';
import { ProfileForm } from './profile-form';
import { ResultsDisplay } from './results-display';

const HISTORY_KEY = 'mystiqueCompassHistory';
const MAX_HISTORY_SIZE = 21;

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
  
  const handleReset = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, gender: value }));
  };

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
          >
            <ProfileForm 
              formData={formData}
              isPending={isPending}
              onSubmit={handleSubmit}
              onHistoryOpen={() => setIsHistoryOpen(true)}
              onSelectChange={handleSelectChange}
              onFieldChange={handleChange}
            />
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
