
'use client';

import * as React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const splitIntoSentences = (text: string): string[] => {
    if (!text) return [];
    const sentences = text.match(/([^\.!\?\n]+[\.!\?\n]*)/g) || [];
    return sentences.map(s => s.trim()).filter(s => s.length > 0);
};

export function ScrollableTextDisplay({ text }: { text: string; }) {
    const [sentences, setSentences] = React.useState<string[]>([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(-1);
    const sentenceRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
    const scrollViewportRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
        setSentences(splitIntoSentences(text));
        sentenceRefs.current = [];
        setCurrentSentenceIndex(-1); // Reset highlight on new text
    }, [text]);

    React.useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            const handleBoundary = (event: SpeechSynthesisEvent) => {
                 if (event.name === 'sentence') {
                    let charIndex = event.charIndex;
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
            const handleEnd = () => {
                setCurrentSentenceIndex(-1);
            }
            window.speechSynthesis.getUtterances().forEach(utterance => {
                utterance.addEventListener('boundary', handleBoundary);
                utterance.addEventListener('end', handleEnd);
            });

            return () => {
                 window.speechSynthesis.getUtterances().forEach(utterance => {
                    utterance.removeEventListener('boundary', handleBoundary);
                    utterance.removeEventListener('end', handleEnd);
                });
            }
        }
    }, [sentences]);

    React.useEffect(() => {
        if (currentSentenceIndex !== -1 && sentenceRefs.current[currentSentenceIndex]) {
            const sentenceElement = sentenceRefs.current[currentSentenceIndex];
            const viewportElement = scrollViewportRef.current;
            if (sentenceElement && viewportElement) {
                const sentenceTop = sentenceElement.offsetTop;
                const sentenceHeight = sentenceElement.offsetHeight;
                const viewportHeight = viewportElement.clientHeight;
                const viewportScrollTop = viewportElement.scrollTop;

                if (sentenceTop < viewportScrollTop || (sentenceTop + sentenceHeight) > (viewportScrollTop + viewportHeight)) {
                    viewportElement.scrollTo({
                        top: sentenceTop - (viewportHeight / 2) + (sentenceHeight / 2),
                        behavior: 'smooth',
                    });
                }
            }
        }
    }, [currentSentenceIndex]);
    
    return (
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
    );
}
