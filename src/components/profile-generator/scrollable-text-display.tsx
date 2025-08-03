
'use client';

import * as React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Play, Pause } from "lucide-react";

const splitIntoSentences = (text: string): string[] => {
    if (!text) return [];
    // This regex splits text by periods, question marks, and exclamation marks,
    // but tries to avoid splitting on abbreviations like "Mr." or "Dr.".
    // It also handles newlines as sentence breaks.
    const sentences = text.match(/([^\.!\?\n]+[\.!\?\n]*)/g) || [];
    return sentences.map(s => s.trim()).filter(s => s.length > 0);
};

export function ScrollableTextDisplay({ text, icon }: { text: string; icon?: React.ReactNode }) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [sentences, setSentences] = React.useState<string[]>([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(-1);
    const sentenceRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
    const scrollViewportRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        setSentences(splitIntoSentences(text));
        sentenceRefs.current = [];
    }, [text]);

    React.useEffect(() => {
        if (currentSentenceIndex !== -1 && sentenceRefs.current[currentSentenceIndex]) {
            const sentenceElement = sentenceRefs.current[currentSentenceIndex];
            const viewportElement = scrollViewportRef.current;
            if (sentenceElement && viewportElement) {
                const sentenceTop = sentenceElement.offsetTop;
                const sentenceHeight = sentenceElement.offsetHeight;
                const viewportHeight = viewportElement.clientHeight;
                const viewportScrollTop = viewportElement.scrollTop;

                // Check if the sentence is outside the visible area
                if (sentenceTop < viewportScrollTop || (sentenceTop + sentenceHeight) > (viewportScrollTop + viewportHeight)) {
                    viewportElement.scrollTo({
                        top: sentenceTop - (viewportHeight / 2) + (sentenceHeight / 2),
                        behavior: 'smooth',
                    });
                }
            }
        }
    }, [currentSentenceIndex]);


    const handlePlayPause = () => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
            setCurrentSentenceIndex(-1);
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => {
                setIsPlaying(true);
                setCurrentSentenceIndex(0);
            };
            utterance.onend = () => {
                setIsPlaying(false);
                setCurrentSentenceIndex(-1);
            };
            utterance.onerror = () => {
                setIsPlaying(false);
                setCurrentSentenceIndex(-1);
            };
            
            let charIndex = 0;
            utterance.onboundary = (event) => {
                if (event.name === 'sentence') {
                    charIndex = event.charIndex;
                    let sentenceBoundary = 0;
                    for (let i = 0; i < sentences.length; i++) {
                        sentenceBoundary += sentences[i].length + 1; // +1 for space/punctuation
                        if (charIndex < sentenceBoundary) {
                            setCurrentSentenceIndex(i);
                            break;
                        }
                    }
                }
            };
            window.speechSynthesis.speak(utterance);
        }
    };
    
    // Cleanup speech on unmount
    React.useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return (
        <div className="relative h-full flex flex-col">
             <Button 
                onClick={handlePlayPause} 
                variant="ghost" 
                size="icon" 
                className="absolute top-0 right-0 z-10 text-purple-300 hover:text-purple-200"
            >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
            </Button>
            <ScrollArea className="h-60 w-full" viewportRef={scrollViewportRef}>
                <div className="flex items-start space-x-4 p-1">
                    {icon}
                    <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {sentences.map((sentence, index) => (
                            <span 
                                key={index} 
                                ref={el => sentenceRefs.current[index] = el}
                                className={`transition-colors duration-300 ${index === currentSentenceIndex ? 'bg-purple-500/30 text-white rounded-md' : 'text-slate-300'}`}
                            >
                                {sentence}
                            </span>
                        ))}
                    </div>
                </div>
                 <ScrollBar orientation="vertical" />
            </ScrollArea>
        </div>
    );
}

