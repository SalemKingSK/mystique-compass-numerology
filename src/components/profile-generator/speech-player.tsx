// src/components/profile-generator/speech-player.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from "lucide-react";

interface SpeechPlayerProps {
    text: string;
    onBoundary?: (event: SpeechSynthesisEvent) => void;
    onEnd?: (event: SpeechSynthesisEvent) => void;
}

export function SpeechPlayer({ text, onBoundary, onEnd }: SpeechPlayerProps) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    // utteranceRef is not strictly necessary anymore but can be useful for debugging
    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

    const handlePlayPause = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation(); // Stop click from propagating to parent (like AccordionTrigger)
        
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        const synth = window.speechSynthesis;

        if (isPlaying) {
            synth.cancel(); // This will trigger the 'end' event
        } else {
            // If anything else is speaking, cancel it
            if (synth.speaking) {
                synth.cancel();
            }
            
            const utterance = new SpeechSynthesisUtterance(text);
            
            utterance.onstart = () => {
                setIsPlaying(true);
            };

            // The 'end' event fires for both completion and cancellation
            utterance.onend = (event) => {
                setIsPlaying(false);
                if (onEnd) onEnd(event);
            };
            
            utterance.onerror = (event) => {
                console.error("SpeechSynthesis Error", event);
                setIsPlaying(false);
                if (onEnd) onEnd(event);
            };
            
            if (onBoundary) {
                utterance.addEventListener('boundary', onBoundary);
            }
            
            utteranceRef.current = utterance;
            synth.speak(utterance);
        }
    }, [isPlaying, text, onBoundary, onEnd]);
    
    React.useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);
    
    return (
        <Button onClick={handlePlayPause} variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>
    );
}
