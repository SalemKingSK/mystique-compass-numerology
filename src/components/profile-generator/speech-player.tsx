
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { ScrollableTextDisplay } from './scrollable-text-display';

interface Props {
  text: string;
  lang?: string;
}

export const SpeechPlayer: React.FC<Props> = ({ text, lang = 'en-US' }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [activeSentenceIndex, setActiveSentenceIndex] = useState(-1);

    const sentencesRef = useRef<string[]>([]);
    const currentSentenceIndexRef = useRef(0);
    const userInitiatedStop = useRef(false);
    const { toast } = useToast();

    useEffect(() => {
        sentencesRef.current = text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
        
        return () => {
            userInitiatedStop.current = true;
            window.speechSynthesis.cancel();
        };
    }, [text]);

    const speakSentence = useCallback((index: number) => {
        if (userInitiatedStop.current || index >= sentencesRef.current.length) {
            setIsPlaying(false);
            setIsPaused(false);
            setActiveSentenceIndex(-1);
            currentSentenceIndexRef.current = 0;
            userInitiatedStop.current = false;
            return;
        }
        
        setActiveSentenceIndex(index);
        currentSentenceIndexRef.current = index;

        const utterance = new SpeechSynthesisUtterance(sentencesRef.current[index]);
        utterance.lang = lang;
        
        utterance.onend = () => {
            speakSentence(index + 1);
        };

        utterance.onerror = (event) => {
            if (userInitiatedStop.current && (event.error === 'canceled' || event.error === 'interrupted')) {
                 return; // This is an expected error from pausing/stopping, so we ignore it.
            }
            console.error("SpeechSynthesis Error", event);
            toast({
                variant: 'destructive',
                title: 'Speech Error',
                description: `An error occurred: ${event.error}`,
            });
            setIsPlaying(false);
            setIsPaused(false);
            setActiveSentenceIndex(-1);
            currentSentenceIndexRef.current = 0;
        };
        
        window.speechSynthesis.speak(utterance);

    }, [lang, toast]);


    const handlePlayPause = useCallback(() => {
        const synth = window.speechSynthesis;
        userInitiatedStop.current = false;

        if (synth.speaking && !isPaused) { // Is playing, so pause
            synth.pause();
            setIsPlaying(false);
            setIsPaused(true);
        } else if (synth.paused && isPaused) { // Is paused, so resume
            synth.resume();
            setIsPlaying(true);
            setIsPaused(false);
        } else { // Is stopped, so play from the beginning (or where it was stopped)
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
        setActiveSentenceIndex(-1);
        currentSentenceIndexRef.current = 0;
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
            <ScrollableTextDisplay 
              text={text} 
              activeSentenceIndex={activeSentenceIndex} 
              sentences={sentencesRef.current}
            />
        </div>
    );
};
