
'use client';

import * as React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const splitIntoSentences = (text: string): string[] => {
    if (!text) return [];
    // Improved regex to handle more sentence-ending punctuation and newlines
    const sentences = text.match(/([^\.!\?\n\r]+[\.!\?\n\r]*)/g) || [];
    return sentences.map(s => s.trim()).filter(s => s.length > 0);
};

interface ScrollableTextDisplayProps {
  text: string;
  renderPlayer: (onBoundary: (e: SpeechSynthesisEvent) => void, onEnd: () => void) => React.ReactNode;
}

export function ScrollableTextDisplay({ text, renderPlayer }: ScrollableTextDisplayProps) {
    const [sentences, setSentences] = React.useState<string[]>([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(-1);
    const sentenceRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
    const scrollViewportRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        setSentences(splitIntoSentences(text));
        sentenceRefs.current = [];
        setCurrentSentenceIndex(-1);
    }, [text]);

    const handleBoundary = React.useCallback((event: SpeechSynthesisEvent) => {
        if (event.name === 'sentence') {
            let charIndex = event.charIndex;
            let currentLength = 0;
            for (let i = 0; i < sentences.length; i++) {
                const sentenceLength = sentences[i].length;
                if (charIndex >= currentLength && charIndex < currentLength + sentenceLength) {
                    setCurrentSentenceIndex(i);
                    return;
                }
                currentLength += sentenceLength + 1; // +1 for the space
            }
        }
    }, [sentences]);

    const handleEnd = React.useCallback(() => {
        setCurrentSentenceIndex(-1);
    }, []);

    React.useEffect(() => {
        if (currentSentenceIndex !== -1 && sentenceRefs.current[currentSentenceIndex]) {
            const sentenceElement = sentenceRefs.current[currentSentenceIndex];
            const viewportElement = scrollViewportRef.current;
            if (sentenceElement && viewportElement) {
                const sentenceTop = sentenceElement.offsetTop;
                const sentenceHeight = sentenceElement.offsetHeight;
                const viewportHeight = viewportElement.clientHeight;
                const viewportScrollTop = viewportElement.scrollTop;

                // Check if the sentence is not fully visible
                if (sentenceTop < viewportScrollTop || (sentenceTop + sentenceHeight) > (viewportScrollTop + viewportHeight)) {
                    // Scroll to the center of the viewport
                    viewportElement.scrollTo({
                        top: sentenceTop - (viewportHeight / 2) + (sentenceHeight / 2),
                        behavior: 'smooth',
                    });
                }
            }
        }
    }, [currentSentenceIndex]);
    
    return (
        <div className="relative">
             {renderPlayer(handleBoundary, handleEnd)}
            <ScrollArea className="h-60 w-full" viewportRef={scrollViewportRef}>
                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed p-1">
                    {sentences.map((sentence, index) => (
                        <span 
                            key={index} 
                            ref={el => sentenceRefs.current[index] = el}
                            className={`transition-colors duration-300 ${index === currentSentenceIndex ? 'bg-purple-500/30 text-white rounded-md' : 'text-slate-300'}`}
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
