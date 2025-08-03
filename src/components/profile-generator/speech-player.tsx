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
  const isCancelingRef = React.useRef(false); // Flag to track intentional cancellation
  const { toast } = useToast();

  const handleStop = React.useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      isCancelingRef.current = true;
      window.speechSynthesis.cancel();
      // State updates will be handled by the utterance's onend/onerror handlers
    }
  }, []);

  React.useEffect(() => {
    // Cleanup on unmount
    return () => {
      handleStop();
    };
  }, [handleStop]);

  const handlePlayPause = React.useCallback(() => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
    }

    const synth = window.speechSynthesis;

    if (synth.speaking && !synth.paused) { // Is speaking, so pause
        isCancelingRef.current = false; // It's a pause, not a full cancel
        synth.pause();
        setIsPaused(true);
        setIsPlaying(false);
    } else if (synth.paused) { // Is paused, so resume
        isCancelingRef.current = false;
        synth.resume();
        setIsPaused(false);
        setIsPlaying(true);
    } else { // Not speaking, start new
        if (synth.speaking) { // If something else is speaking, stop it first
            isCancelingRef.current = true;
            synth.cancel();
        }
        
        // Use a timeout to allow the cancel command to process fully
        setTimeout(() => {
            isCancelingRef.current = false;
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
                if (!isCancelingRef.current && event.error !== 'canceled') {
                  console.error("SpeechSynthesis Error", event);
                  toast({
                    variant: 'destructive',
                    title: 'Speech Error',
                    description: 'Could not generate audio. Please try again.',
                  });
                }
                // Always clean up state on error
                setIsPlaying(false);
                setIsPaused(false);
                utteranceRef.current = null;
                if(onEnd) onEnd(); 
            };
            
            setIsPlaying(true);
            setIsPaused(false);
            synth.speak(utterance);
        }, 100); // A small delay is often sufficient
    }
  }, [text, onBoundary, onEnd, toast]);

  return (
    <div className="flex items-center gap-2 mb-4">
      <Button onClick={handlePlayPause} variant="outline" size="sm">
        {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
        {isPlaying ? 'Pause' : (isPaused ? 'Resume' : 'Play')}
      </Button>
      <Button onClick={handleStop} variant="outline" size="sm" disabled={!isPlaying && !isPaused}>
        <RotateCcw className="h-4 w-4 mr-2" />
        Stop
      </Button>
    </div>
  );
}
