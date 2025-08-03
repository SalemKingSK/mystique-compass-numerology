
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ScrollableTextDisplay } from './scrollable-text-display';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface Props {
  text: string;
  lang?: string;
}

export const SpeechPlayer: React.FC<Props> = ({ text, lang = 'en-US' }) => {
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sentencesRef = useRef<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const handleVoicesChanged = () => {
        // Voices loaded
    };
    
    // Split text into sentences and store in ref
    sentencesRef.current = text.match(/[^.!?]+[.!?]+/g) || [text];

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    
    // Cleanup on unmount
    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, [text]);

  const handlePlayPause = useCallback(() => {
    const synth = window.speechSynthesis;
    if (!synth) {
      toast({
        variant: "destructive",
        title: "Speech Synthesis not supported",
        description: "Your browser does not support the Web Speech API.",
      });
      return;
    }

    if (synth.speaking && !synth.paused) {
      synth.pause();
      setIsPlaying(false);
      setIsPaused(true);
    } else if (synth.paused) {
      synth.resume();
      setIsPlaying(true);
      setIsPaused(false);
    } else {
      // Create and configure a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      
      utterance.onboundary = (event) => {
        const charIndex = event.charIndex;
        let cumulativeLength = 0;
        const sentenceIndex = sentencesRef.current.findIndex(sentence => {
          cumulativeLength += sentence.length;
          return charIndex < cumulativeLength;
        });
        if (sentenceIndex !== -1) {
          setActiveSentenceIndex(sentenceIndex);
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setActiveSentenceIndex(-1);
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        if (event.error !== 'canceled') {
          console.error("SpeechSynthesis Error", event);
           toast({
            variant: 'destructive',
            title: 'Speech Error',
            description: 'An unexpected error occurred during speech synthesis.',
          });
        }
        setIsPlaying(false);
        setIsPaused(false);
        setActiveSentenceIndex(-1);
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      synth.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  }, [text, lang, toast]);
  
  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setActiveSentenceIndex(-1);
    utteranceRef.current = null;
  }, []);

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-2">
            <Button onClick={handlePlayPause} variant="outline" size="sm">
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? 'Pause' : (isPaused ? 'Resume' : 'Play')}
            </Button>
            <Button onClick={handleStop} variant="outline" size="sm" disabled={!isPlaying && !isPaused}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Stop
            </Button>
        </div>
      <ScrollableTextDisplay text={text} activeSentenceIndex={activeSentenceIndex} />
    </div>
  );
};
