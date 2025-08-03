// src/components/profile-generator/speech-player.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from "lucide-react";

export function SpeechPlayer({ text }: { text: string }) {
    const [isPlaying, setIsPlaying] = React.useState(false);

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
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);
            window.speechSynthesis.speak(utterance);
        }
    }, [isPlaying, text]);
    
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
            setIsPlaying(window.speechSynthesis.speaking);
        };
        
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.addEventListener('voiceschanged', onSynthStateChange);
            // In some browsers, a timeout is needed to check the initial state
            const timer = setTimeout(() => onSynthStateChange(), 100);

            return () => {
                window.speechSynthesis.removeEventListener('voiceschanged', onSynthStateChange);
                clearTimeout(timer);
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
