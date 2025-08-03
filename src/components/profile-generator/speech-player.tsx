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
    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

    const handlePlayPause = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation(); // Stop click from propagating to parent (like AccordionTrigger)
        
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        const synth = window.speechSynthesis;

        if (synth.speaking && utteranceRef.current) {
            synth.cancel(); // This will trigger the 'end' event
            return;
        }

        // If something else is speaking (from another component instance), cancel it.
        if (synth.speaking) {
            synth.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;
        
        utterance.onstart = () => {
            setIsPlaying(true);
        };

        utterance.onend = (event) => {
            setIsPlaying(false);
            utteranceRef.current = null;
            if (onEnd) onEnd(event);
        };
        
        utterance.onerror = (event) => {
            console.error("SpeechSynthesis Error", event);
            setIsPlaying(false);
            utteranceRef.current = null;
            if (onEnd) onEnd(event);
        };
        
        if (onBoundary) {
            utterance.addEventListener('boundary', onBoundary);
        }
        
        synth.speak(utterance);

    }, [text, onBoundary, onEnd]);

    // Effect to clean up speech synthesis on component unmount
    React.useEffect(() => {
        const synth = window.speechSynthesis;
        return () => {
            if (utteranceRef.current) {
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
