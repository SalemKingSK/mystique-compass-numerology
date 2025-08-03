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

    // Effect to check speaking state globally
    React.useEffect(() => {
        const synth = window.speechSynthesis;
        const interval = setInterval(() => {
            if (utteranceRef.current && !synth.speaking && isPlaying) {
                setIsPlaying(false);
            }
        }, 250);

        return () => clearInterval(interval);
    }, [isPlaying]);

    const handlePlayPause = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation(); 
        
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        const synth = window.speechSynthesis;

        if (synth.speaking && utteranceRef.current) {
            synth.cancel();
            setIsPlaying(false);
            utteranceRef.current = null;
            return;
        }
        
        if (synth.speaking) {
            synth.cancel();
        }
        
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

    }, [text]);

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
