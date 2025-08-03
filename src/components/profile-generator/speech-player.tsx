// src/components/profile-generator/speech-player.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from "lucide-react";

interface SpeechPlayerProps {
    text: string;
    onBoundary: (event: SpeechSynthesisEvent) => void;
    onEnd: () => void;
}

export function SpeechPlayer({ text, onBoundary, onEnd }: SpeechPlayerProps) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

    const handlePlayPause = React.useCallback(() => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        if (isPlaying) {
            window.speechSynthesis.cancel();
            setIsPlaying(false);
        } else {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setIsPlaying(true);
            utterance.onend = () => {
                setIsPlaying(false);
                onEnd();
            };
            utterance.onerror = () => setIsPlaying(false);
            utterance.addEventListener('boundary', onBoundary);
            
            utteranceRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        }
    }, [isPlaying, text, onBoundary, onEnd]);
    
    // Cleanup speech on unmount
    React.useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    // Effect to track external speech synthesis state
    React.useEffect(() => {
        const onSynthStateChange = () => {
             if (typeof window !== 'undefined' && window.speechSynthesis) {
                setIsPlaying(window.speechSynthesis.speaking);
             }
        };
        
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            const synth = window.speechSynthesis;
            // Use a simple interval to check speaking state, as events can be unreliable
            const intervalId = setInterval(onSynthStateChange, 250);

            return () => {
                clearInterval(intervalId);
            }
        }
    }, []);


    return (
        <Button onClick={handlePlayPause} variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>
    );
}
