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

    React.useEffect(() => {
        const synth = window.speechSynthesis;

        const handleSpeakingState = () => {
            // Check if the specific utterance is still speaking
             const isCurrentlySpeaking = synth.speaking && utteranceRef.current && utteranceRef.current.text === text;
             if (isCurrentlySpeaking !== isPlaying) {
                 setIsPlaying(isCurrentlySpeaking);
             }
        };

        // Check the state periodically
        const interval = setInterval(handleSpeakingState, 500);

        return () => {
            clearInterval(interval);
            if (synth.speaking && utteranceRef.current && utteranceRef.current.text === text) {
                synth.cancel();
            }
        };
    }, [text, isPlaying]);


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
        
        if (!text || text.trim() === '') {
             console.log("No text to speak.");
             return;
        }
        
        synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utterance;
        
        utterance.onboundary = onBoundary || null;

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

    }, [text, onBoundary, onEnd]);

    return (
        <Button onClick={handlePlayPause} variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>
    );
}
