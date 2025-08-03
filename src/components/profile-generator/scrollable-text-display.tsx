
// src/components/profile-generator/scrollable-text-display.tsx
'use client';

import * as React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

// Helper to split text into sentences
const splitIntoSentences = (text: string): { sentence: string, charStart: number }[] => {
    if (!text) return [];
    // This regex attempts to split by sentences, respecting common punctuation.
    const sentences = text.match(/([^\.!\?]+[\.!\?\s]*)/g) || [];
    let charIndex = 0;
    return sentences.map(s => {
        const sentenceObject = { sentence: s.trim(), charStart: charIndex };
        charIndex += s.length;
        return sentenceObject;
    }).filter(s => s.sentence.length > 0);
};

interface ScrollableTextDisplayProps {
  text: string;
}

export function ScrollableTextDisplay({ text }: ScrollableTextDisplayProps) {
    const [sentences, setSentences] = React.useState<{ sentence: string; charStart: number; }[]>([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(-1);

    const sentenceRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

    // Prepare sentences whenever the text prop changes
    React.useEffect(() => {
        const preparedSentences = splitIntoSentences(text);
        setSentences(preparedSentences);
        sentenceRefs.current = new Array(preparedSentences.length).fill(null);
    }, [text]);

    // Effect to auto-scroll to the highlighted sentence
    React.useEffect(() => {
        if (currentSentenceIndex !== -1 && sentenceRefs.current[currentSentenceIndex]) {
            sentenceRefs.current[currentSentenceIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [currentSentenceIndex]);
    
    // Effect for cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (window.speechSynthesis?.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

    const handlePlayPause = () => {
        const synth = window.speechSynthesis;
        if (synth.speaking) {
            synth.cancel();
            setCurrentSentenceIndex(-1);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;

        utterance.onboundary = (event) => {
            const charIndex = event.charIndex;
             const newIndex = sentences.findIndex(s => charIndex >= s.charStart && charIndex < (s.charStart + s.sentence.length));
             if (newIndex !== -1) {
                setCurrentSentenceIndex(newIndex);
            }
        };

        utterance.onend = () => {
            setCurrentSentenceIndex(-1);
        };
        
        synth.speak(utterance);
    };

    return (
        <ScrollArea className="h-full w-full">
            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed p-1">
                {sentences.map(({ sentence }, index) => (
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
    );
}
