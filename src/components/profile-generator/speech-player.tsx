
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface Props {
  text: string;
  lang?: string;
}

export const SpeechPlayer: React.FC<Props> = ({ text, lang = 'en-US' }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [activeSentenceIndex, setActiveSentenceIndex] = useState(-1);

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const sentencesRef = useRef<string[]>([]);
    const sentenceRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const userInitiatedStop = useRef(false);

    const { toast } = useToast();

    // Splitting text into sentences
    useEffect(() => {
        sentencesRef.current = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
        setActiveSentenceIndex(-1); // Reset on new text
        setIsPlaying(false);
        setIsPaused(false);

        // Cleanup on unmount or text change
        return () => {
            if (window.speechSynthesis?.speaking) {
                userInitiatedStop.current = true;
                window.speechSynthesis.cancel();
            }
        };
    }, [text]);

    // Effect for scrolling the active sentence into view
    useEffect(() => {
        if(activeSentenceIndex === -1) return;
        const activeEl = sentenceRefs.current[activeSentenceIndex];
        if (activeEl && containerRef.current) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [activeSentenceIndex]);

    const handlePlayPause = useCallback(() => {
        const synth = window.speechSynthesis;
        if (!synth) {
            toast({ variant: "destructive", title: "Speech Synthesis not supported" });
            return;
        }

        if (isPlaying) { // Is playing, so pause
            userInitiatedStop.current = true;
            synth.pause();
            setIsPlaying(false);
            setIsPaused(true);
        } else if (isPaused) { // Is paused, so resume
            userInitiatedStop.current = false;
            synth.resume();
            setIsPlaying(true);
            setIsPaused(false);
        } else { // Is stopped, so play
            userInitiatedStop.current = false;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            
            utterance.onboundary = (event) => {
                if (event.name === 'sentence' || event.name === 'word') {
                    const charIndex = event.charIndex;
                    let cumulativeLength = 0;
                    const sentenceIndex = sentencesRef.current.findIndex(sentence => {
                        cumulativeLength += sentence.length;
                        return charIndex < cumulativeLength;
                    });
                    if (sentenceIndex !== -1) {
                        setActiveSentenceIndex(sentenceIndex);
                    }
                }
            };

            utterance.onend = () => {
                setIsPlaying(false);
                setIsPaused(false);
                setActiveSentenceIndex(-1);
                utteranceRef.current = null;
            };

            utterance.onerror = (event) => {
                // This flag distinguishes user cancellation from genuine errors.
                if (userInitiatedStop.current && (event.error === 'canceled' || event.error === 'interrupted')) {
                    userInitiatedStop.current = false; // Reset flag
                    return;
                }
                
                if (event.error !== 'canceled') {
                  console.error("SpeechSynthesis Error", event);
                  toast({
                    variant: 'destructive',
                    title: 'Speech Error',
                    description: 'An unexpected error occurred during speech synthesis.',
                  });
                }
                
                setIsPlaying(false);
                setIsPaused(false);
                setActiveSentenceIndex(-1);
                utteranceRef.current = null;
            };

            utteranceRef.current = utterance;
            synth.speak(utterance);
            setIsPlaying(true);
            setIsPaused(false);
            setActiveSentenceIndex(0); // Start highlighting from the first sentence
        }
    }, [text, lang, toast, isPlaying, isPaused]);

    const handleStop = useCallback(() => {
        userInitiatedStop.current = true;
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setActiveSentenceIndex(-1);
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Button onClick={handlePlayPause} variant="outline" size="sm">
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? 'Pause' : (isPaused ? 'Resume' : 'Play')}
                </Button>
                <Button onClick={handleStop} variant="outline" size="sm" disabled={!isPlaying && !isPaused}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Stop
                </Button>
            </div>
            <div className="scroll-container" ref={containerRef}>
              {sentencesRef.current.map((sentence, idx) => (
                <span
                  key={idx}
                  ref={(el) => { if(el) sentenceRefs.current[idx] = el; }}
                  className={idx === activeSentenceIndex ? 'reading' : ''}
                >
                  {sentence + ' '}
                </span>
              ))}
            </div>
        </div>
    );
};
