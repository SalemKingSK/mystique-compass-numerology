
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
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  const handleStop = React.useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    if (synth.speaking || synth.paused) {
      synth.cancel();
    }
    // The onend event will handle resetting the state
  }, []);

  React.useEffect(() => {
    // Cleanup on unmount
    return () => {
      handleStop();
    };
  }, [handleStop]);

  const handlePlayPause = React.useCallback(() => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const synth = window.speechSynthesis;

    if (isPlaying) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
      return;
    }
    
    // Stop any currently playing speech before starting a new one
    if (synth.speaking) {
      synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    utterance.onboundary = onBoundary;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
      if (onEnd) onEnd();
    };
    
    utterance.onerror = (event) => {
        // A "canceled" error is expected when we call synth.cancel(). 
        // We don't need to log this as a real error.
        if (event.error !== 'canceled') {
          console.error("SpeechSynthesis Error", event);
          toast({
            variant: 'destructive',
            title: 'Speech Error',
            description: 'Could not generate audio. Please try again.',
          });
        }
       // The onend event will fire after an error, so state cleanup is handled there.
    };
    
    setIsPlaying(true);
    setIsPaused(false);
    synth.speak(utterance);

  }, [text, onBoundary, onEnd, toast, isPlaying, isPaused]);

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button onClick={handlePlayPause} variant="outline" size="sm">
        {isPlaying && !isPaused ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
        {isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Play'}
      </Button>
      <Button onClick={handleStop} variant="outline" size="sm" disabled={!isPlaying}>
        <RotateCcw className="h-4 w-4 mr-2" />
        Stop
      </Button>
    </div>
  );
}
