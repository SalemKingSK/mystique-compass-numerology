
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

// Combined ScrollableTextDisplay logic into SpeechPlayer
const ScrollableTextDisplay = ({ text, activeSentenceIndex }: { text: string; activeSentenceIndex: number; }) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const containerRef = useRef<HTMLDivElement>(null);
  const sentenceRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const activeEl = sentenceRefs.current[activeSentenceIndex];
    if (activeEl && containerRef.current) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeSentenceIndex]);

  return (
    <div className="scroll-container" ref={containerRef}>
      {sentences.map((sentence, idx) => (
        <span
          key={idx}
          ref={(el) => (sentenceRefs.current[idx] = el)}
          className={idx === activeSentenceIndex ? 'reading' : ''}
        >
          {sentence}{' '}
        </span>
      ))}
    </div>
  );
};


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
    sentencesRef.current = text.match(/[^.!?]+[.!?]+/g) || [text];
    // Cleanup on text change or unmount
    return () => {
      window.speechSynthesis.cancel();
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

    if (synth.speaking && !isPaused) { // Is playing, so pause
      synth.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (synth.speaking && isPaused) { // Is paused, so resume
      synth.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else { // Is stopped, so play
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
  }, [text, lang, toast, isPaused]);
  
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
