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
        if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onboundary = (event) => onBoundary?.(event);
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = (event) => {
            setIsPlaying(false);
            onEnd?.(event);
        };
        utterance.onerror = (event) => {
            console.error("SpeechSynthesis Error", event);
            setIsPlaying(false);
        };

        utteranceRef.current = utterance;

        // Cleanup on unmount
        return () => {
            synth.cancel();
        };
    }, [text, onBoundary, onEnd]);


    const handlePlayPause = React.useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        const synth = window.speechSynthesis;
        const utterance = utteranceRef.current;

        if (!utterance) return;
        
        if (synth.speaking) {
            // If it's speaking, always cancel, which will trigger onend and reset state
            synth.cancel();
        } else {
            // If not speaking, start speaking this utterance
            synth.speak(utterance);
        }

    }, []);

    return (
        <Button onClick={handlePlayPause} variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>
    );
}
