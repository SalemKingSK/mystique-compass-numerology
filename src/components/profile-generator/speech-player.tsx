// src/components/profile-generator/speech-player.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from "lucide-react";

export function SpeechPlayer({ text }: { text: string }) {
    const [isPlaying, setIsPlaying] = React.useState(false);

    React.useEffect(() => {
        // Stop speech when component unmounts or text changes
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, [text]);

    const handlePlayPause = () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            if (isPlaying) {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
            } else {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.onend = () => setIsPlaying(false);
                window.speechSynthesis.speak(utterance);
                setIsPlaying(true);
            }
        }
    };

    return (
        <Button onClick={handlePlayPause} variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>
    );
}
