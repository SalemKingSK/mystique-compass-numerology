// src/components/profile-generator/speech-player.tsx
'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface Props {
  text: string;
  sentences: string[];
  onBoundary: (index: number) => void;
  onEnd: () => void;
  lang?: string;
}

export const SpeechPlayer: React.FC<Props> = ({ text, sentences, onBoundary, onEnd, lang = 'en-US' }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const currentSentenceIndexRef = useRef(0);
    const userInitiatedStop = useRef(false);
    const { toast } = useToast();

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            userInitiatedStop.current = true;
            window.speechSynthesis.cancel();
        };
    }, []);

    const speakSentence = useCallback((index: number) => {
        if (userInitiatedStop.current || index >= sentences.length) {
            setIsPlaying(false);
            setIsPaused(false);
            onEnd();
            currentSentenceIndexRef.current = 0;
            userInitiatedStop.current = false;
            return;
        }

        onBoundary(index);
        currentSentenceIndexRef.current = index;

        const utterance = new SpeechSynthesisUtterance(sentences[index]);
        utterance.lang = lang;

        utterance.onend = () => {
            if (!userInitiatedStop.current) {
                speakSentence(index + 1);
            }
        };

        utterance.onerror = (event) => {
            // These errors are often triggered by non-critical interruptions (e.g., navigation)
            // and don't need to be logged as errors.
            if (event.error === 'canceled' || event.error === 'interrupted') {
                return; 
            }
            console.error("SpeechSynthesis Error:", event);
            toast({
                variant: 'destructive',
                title: 'Speech Error',
                description: `An error occurred: ${event.error}`,
            });
            setIsPlaying(false);
            setIsPaused(false);
            onEnd();
            currentSentenceIndexRef.current = 0;
        };
        
        window.speechSynthesis.speak(utterance);
    }, [lang, sentences, onBoundary, onEnd, toast]);

    const handlePlayPause = useCallback(() => {
        const synth = window.speechSynthesis;
        
        if (synth.speaking && !isPaused) { // Is playing, so pause
            userInitiatedStop.current = true; // Pausing is a user-initiated stop
            synth.pause();
            setIsPlaying(false);
            setIsPaused(true);
        } else if (synth.paused && isPaused) { // Is paused, so resume
            userInitiatedStop.current = false;
            synth.resume();
            setIsPlaying(true);
            setIsPaused(false);
        } else { // Is stopped, so play from the beginning (or where it was stopped)
            userInitiatedStop.current = false;
            if (synth.speaking) { // If it was speaking and got interrupted, cancel first
               synth.cancel();
            }
            setIsPlaying(true);
            setIsPaused(false);
            speakSentence(currentSentenceIndexRef.current);
        }
    }, [isPaused, speakSentence]);

    const handleStop = useCallback(() => {
        userInitiatedStop.current = true;
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        onEnd();
        currentSentenceIndexRef.current = 0;
    }, [onEnd]);

    return (
        <div className="flex items-center gap-2">
            <Button onClick={handlePlayPause} variant="outline" size="sm">
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? 'Pause' : (isPaused ? 'Resume' : 'Play')}
            </Button>
            <Button onClick={handleStop} variant="outline" size="sm" disabled={!isPlaying && !isPaused}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
            </Button>
        </div>
    );
};
