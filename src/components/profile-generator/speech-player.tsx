
// src/components/profile-generator/speech-player.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from "lucide-react";

interface SpeechPlayerProps {
    text: string;
}

export function SpeechPlayer({ text }: SpeechPlayerProps) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

    // Effect to clean up speech synthesis on component unmount
    React.useEffect(() => {
        const synth = window.speechSynthesis;
        return () => {
            if (utteranceRef.current) {
                utteranceRef.current.onend = null;
                utteranceRef.current.onerror = null;
            }
            synth.cancel();
        };
    }, []);

    const handlePlayPause = React.useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        
        const synth = window.speechSynthesis;

        if (isPlaying) {
            synth.cancel(); // This will trigger the onend event
            return;
        }
        
        if (!text || text.trim() === '') {
             console.log("No text to speak.");
             return;
        }
        
        // Ensure any previous speech is stopped before starting a new one.
        // This prevents overlapping event listeners.
        synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;
        
        utterance.onstart = () => {
            setIsPlaying(true);
        };

        utterance.onend = () => {
            setIsPlaying(false);
            utteranceRef.current = null;
        };

        utterance.onerror = (event) => {
            console.error("SpeechSynthesis Error", event);
            setIsPlaying(false);
            utteranceRef.current = null;
        };

        synth.speak(utterance);

    }, [text, isPlaying]);

    return (
        <Button onClick={handlePlayPause} variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>
    );
}
