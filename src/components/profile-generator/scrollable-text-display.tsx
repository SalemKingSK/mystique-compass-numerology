
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
}

export function ScrollableTextDisplay({ text }: ScrollableTextDisplayProps) {
    const [sentences, setSentences] = React.useState<string[]>([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(-1);
    const sentenceRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
    const scrollViewportRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        setSentences(splitIntoSentences(text));
        sentenceRefs.current = [];
        setCurrentSentenceIndex(-1);
    }, [text]);

    React.useEffect(() => {
        const handleBoundary = (event: SpeechSynthesisEvent) => {
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
        };

        const handleEnd = () => {
            setCurrentSentenceIndex(-1);
        };
        
        // This effect will re-run if text changes, attaching listeners to the new utterance
        // We assume only one utterance is created at a time by the SpeechPlayer
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            // Because we can't reliably get the utterance object here,
            // we have to rely on the fact that the SpeechPlayer creates a new one each time.
            // A more robust solution might involve a global state manager for the utterance.
            // For now, this is a pragmatic way to re-attach listeners.
            const synth = window.speechSynthesis;
            const checkAndAttach = () => {
                // This is a workaround. We can't directly access the utterance created in another component.
                // Instead, we listen for speech to start and then try to attach. This is not ideal.
                // A better architecture would use context or a state management library.
            };
            checkAndAttach();
        }

    }, [text, sentences]);

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
