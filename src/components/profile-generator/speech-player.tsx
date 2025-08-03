
// src/components/profile-generator/speech-player.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from "lucide-react";

interface SpeechPlayerProps {
    text: string;
    onBoundary?: (e: SpeechSynthesisEvent) => void;
    onEnd?: (e: SpeechSynthesisEvent) => void;
}

export function SpeechPlayer({ text, onBoundary, onEnd }: SpeechPlayerProps) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

    React.useEffect(() => {
        const synth = window.speechSynthesis;

        const handleSpeakingState = () => {
             const isCurrentlySpeaking = synth.speaking && utteranceRef.current === synth.getUtterances().find(u => u === utteranceRef.current);
             if (isCurrentlySpeaking !== isPlaying) {
                 setIsPlaying(isCurrentlySpeaking);
             }
        };

        const interval = setInterval(handleSpeakingState, 250);
        
        // Cleanup on unmount
        return () => {
            clearInterval(interval);
            if (synth.speaking && utteranceRef.current) {
                synth.cancel();
            }
        };
    }, [isPlaying]);


    const handlePlayPause = React.useCallback((e?: React.MouseEvent) => {
        if(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!text || text.trim() === '' || typeof window === 'undefined' || !window.speechSynthesis) return;
        
        const synth = window.speechSynthesis;

        if (isPlaying) {
            synth.cancel();
            setIsPlaying(false);
            return;
        }

        // Stop any other speech before starting a new one
        if (synth.speaking) {
            synth.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;
        
        utterance.onboundary = (event) => {
            if (onBoundary) onBoundary(event);
        };
        
        utterance.onend = (event) => {
            if (onEnd) onEnd(event);
            setIsPlaying(false);
            utteranceRef.current = null;
        };

        utterance.onerror = (event) => {
            console.error("SpeechSynthesis Error", event);
            setIsPlaying(false);
            utteranceRef.current = null;
        };

        utterance.onstart = () => {
            setIsPlaying(true);
        };
        
        synth.speak(utterance);

    }, [text, onBoundary, onEnd, isPlaying]);

    return (
        <Button onClick={handlePlayPause} variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>
    );
}

