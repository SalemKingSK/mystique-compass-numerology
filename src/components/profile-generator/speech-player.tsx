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

    // Effect for cleaning up when the component unmounts
    React.useEffect(() => {
        const synth = window.speechSynthesis;
        return () => {
            if (synth.speaking && utteranceRef.current && utteranceRef.current.text === text) {
                synth.cancel();
            }
        };
    }, [text]);


    const handlePlayPause = React.useCallback((e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        
        const synth = window.speechSynthesis;

        if (isPlaying) {
            synth.cancel();
            setIsPlaying(false);
            utteranceRef.current = null;
            return;
        }
        
        if (!text || text.trim() === '') {
             console.log("No text to speak.");
             return;
        }
        
        // Cancel any other playing speech before starting a new one
        if(synth.speaking) {
            synth.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;
        
        if(onBoundary) {
            utterance.onboundary = onBoundary;
        }

        utterance.onend = () => {
            setIsPlaying(false);
            if(onEnd) onEnd(new SpeechSynthesisEvent('end'));
            utteranceRef.current = null;
        };

        utterance.onerror = (event) => {
            // This is a common browser behavior. When we call synth.cancel(),
            // it sometimes triggers `onerror` with "canceled". We don't want to log this as an error.
            if (event.error !== 'canceled') {
              console.error("SpeechSynthesis Error", event);
            }
            setIsPlaying(false);
            if(onEnd) onEnd(new SpeechSynthesisEvent('end')); // also treat as end
            utteranceRef.current = null;
        };
        
        utterance.onstart = () => {
            setIsPlaying(true);
        }

        synth.speak(utterance);

    }, [text, onBoundary, onEnd, isPlaying]);

    return (
        <Button onClick={handlePlayPause} variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>
    );
}
