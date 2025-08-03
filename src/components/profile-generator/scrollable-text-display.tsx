// src/components/profile-generator/scrollable-text-display.tsx
'use client';

import * as React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Play, Pause } from "lucide-react";

// Helper to split text into sentences
const splitIntoSentences = (text: string): string[] => {
    if (!text) return [];
    // This regex attempts to split by sentences, respecting common punctuation.
    const sentences = text.match(/([^\.!\?]+[\.!\?\s]*)/g) || [];
    return sentences.map(s => s.trim()).filter(s => s.length > 0);
};

interface ScrollableTextDisplayProps {
  text: string;
}

export function ScrollableTextDisplay({ text }: ScrollableTextDisplayProps) {
    const [sentences, setSentences] = React.useState<string[]>([]);
    const [isSpeaking, setIsSpeaking] = React.useState(false);
    const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(-1);

    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
    const sentenceRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
    const scrollViewportRef = React.useRef<HTMLDivElement>(null);

    // Prepare sentences whenever the text prop changes
    React.useEffect(() => {
        const preparedSentences = splitIntoSentences(text);
        setSentences(preparedSentences);
        sentenceRefs.current = new Array(preparedSentences.length);
        // Stop any active speech if the text content changes
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        resetState();
    }, [text]);

    // Effect to auto-scroll to the highlighted sentence
    React.useEffect(() => {
        if (currentSentenceIndex !== -1 && sentenceRefs.current[currentSentenceIndex]) {
            const sentenceElement = sentenceRefs.current[currentSentenceIndex];
            sentenceElement?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
        }
    }, [currentSentenceIndex]);
    
    // Effect for cleanup on unmount
    React.useEffect(() => {
      const synth = window.speechSynthesis;
      return () => {
        if (synth.speaking) {
          synth.cancel();
        }
      };
    }, []);


    const resetState = () => {
        setIsSpeaking(false);
        setCurrentSentenceIndex(-1);
    };

    const handlePlayPause = (e: React.MouseEvent) => {
        e.stopPropagation();
        const synth = window.speechSynthesis;

        if (isSpeaking) {
            synth.cancel();
            resetState();
            return;
        }

        // Cancel any other speech before starting a new one
        if(synth.speaking){
            synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;
        
        let charIndex = 0;
        const sentenceBoundaries: number[] = sentences.map(s => {
            const start = charIndex;
            charIndex += s.length + 1; // +1 for the space
            return start;
        });


        utterance.onboundary = (event) => {
           if (event.name === 'sentence') {
                const newIndex = sentenceBoundaries.findIndex((start, i) => {
                    const end = (i + 1 < sentenceBoundaries.length) ? sentenceBoundaries[i+1] : text.length;
                    return event.charIndex >= start && event.charIndex < end;
                });

                if (newIndex !== -1) {
                    setCurrentSentenceIndex(newIndex);
                }
            }
        };

        utterance.onend = () => {
            resetState();
        };

        utterance.onerror = (event) => {
            console.error("SpeechSynthesis Error", event);
            resetState();
        };
        
        utterance.onstart = () => {
            setIsSpeaking(true);
            setCurrentSentenceIndex(0); // Start by highlighting the first sentence
        };

        synth.speak(utterance);
    };

    return (
        <div className="relative">
             <div className="absolute top-0 right-0 z-10">
                <Button onClick={handlePlayPause} variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200">
                    {isSpeaking ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    <span className="sr-only">{isSpeaking ? 'Pause' : 'Play'}</span>
                </Button>
            </div>
            <ScrollArea className="h-full w-full" viewportRef={scrollViewportRef}>
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed p-1">
                    {sentences.map((sentence, index) => (
                        <span 
                            key={index} 
                            ref={el => sentenceRefs.current[index] = el}
                            className={`transition-colors duration-300 ${index === currentSentenceIndex ? 'reading' : 'text-slate-300'}`}
                        >
                            {sentence}{' '}
                        </span>
                    ))}
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
        </div>
    );
}