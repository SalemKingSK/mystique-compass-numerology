// src/components/profile-generator/speech-player.tsx
'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Loader } from "lucide-react";
import { getSpeechAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

interface SpeechPlayerProps {
    text: string;
}

export function SpeechPlayer({ text }: SpeechPlayerProps) {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isFetching, setIsFetching] = React.useState(false);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const { toast } = useToast();

    React.useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const onEnded = () => setIsPlaying(false);
            audio.addEventListener('ended', onEnded);
            return () => {
                audio.removeEventListener('ended', onEnded);
            };
        }
    }, [audioRef.current]);

    const handlePlayPause = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isFetching) return;
        
        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            return;
        }
        
        if (audioRef.current && audioRef.current.src && !isPlaying) {
             audioRef.current.play();
             setIsPlaying(true);
             return;
        }

        setIsFetching(true);
        const result = await getSpeechAction(text);
        setIsFetching(false);

        if (result.success && result.audioUrl) {
            const audio = new Audio(result.audioUrl);
            audioRef.current = audio;
            audio.play();
            setIsPlaying(true);
        } else {
            toast({
                variant: 'destructive',
                title: 'Speech Error',
                description: result.error || 'Could not generate audio.',
            });
            setIsPlaying(false);
        }
    };
    
    let buttonIcon = <Play className="h-5 w-5" />;
    if (isFetching) {
        buttonIcon = <Loader className="h-5 w-5 animate-spin" />;
    } else if (isPlaying) {
        buttonIcon = <Pause className="h-5 w-5" />;
    }

    return (
        <Button onClick={handlePlayPause} variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200" disabled={isFetching}>
            {buttonIcon}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>
    );
}
