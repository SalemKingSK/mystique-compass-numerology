'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface SpeechPlayerProps {
  text: string;
  onBoundary: (event: SpeechSynthesisEvent) => void;
  onEnd: () => void;
}

export function SpeechPlayer({ text, onBoundary, onEnd }: SpeechPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const { toast } = useToast();

  const handlePlayPause = React.useCallback(() => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;

    if (synth.speaking) {
      if (synth.paused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
      setIsPlaying(true);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onboundary = onBoundary;
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      onEnd();
    };
    utterance.onerror = (event) => {
        if (event.error !== 'canceled') {
          console.error("SpeechSynthesis Error", event);
          toast({
            variant: 'destructive',
            title: 'Speech Error',
            description: 'Could not generate audio. Please try again.',
          });
        }
      setIsPlaying(false);
      setIsPaused(false);
      onEnd();
    };

    synth.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  }, [text, onBoundary, onEnd, toast]);

  const handleStop = React.useCallback(() => {
     if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
     window.speechSynthesis.cancel();
     setIsPlaying(false);
     setIsPaused(false);
     onEnd();
  }, [onEnd]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
       if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
           window.speechSynthesis.cancel();
       }
    };
  }, []);

  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return null; // Don't render the player if the API is not supported.
  }

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button onClick={handlePlayPause} variant="outline" size="sm">
        {isPlaying && !isPaused ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
        {isPlaying && !isPaused ? 'Pause' : 'Play'}
      </Button>
      <Button onClick={handleStop} variant="outline" size="sm" disabled={!isPlaying}>
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>
  );
}
