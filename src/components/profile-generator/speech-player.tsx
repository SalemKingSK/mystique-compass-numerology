
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
    
    // We'll manage the utterance directly within the play function
    // to avoid stale references.
    
    const handlePlayPause = React.useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        const synth = window.speechSynthesis;

        if (synth.speaking) {
            synth.cancel(); 
            setIsPlaying(false);
            return;
        }

        if (!text) {
             console.log("No text to speak.");
             return;
        }
        
        // Create a new utterance each time play is clicked
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onstart = () => {
            setIsPlaying(true);
        };

        utterance.onend = (event) => {
            setIsPlaying(false);
            if (onEnd) onEnd(event);
        };

        utterance.onboundary = (event) => {
            if(onBoundary) onBoundary(event);
        };

        utterance.onerror = (event) => {
            console.error("SpeechSynthesis Error", event);
            setIsPlaying(false);
        };

        synth.speak(utterance);

    }, [text, onBoundary, onEnd]);
    
    // Effect to clean up speech synthesis on component unmount
    React.useEffect(() => {
        const synth = window.speechSynthesis;
        return () => {
            if (synth.speaking) {
                synth.cancel();
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
