'use client';

import * as React from 'react';
import { SpeechPlayer } from './speech-player';

type Sentence = {
  text: string;
  start: number;
  end: number;
};

export function ScrollableTextDisplay({ text }: { text: string }) {
  const [sentences, setSentences] = React.useState<Sentence[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = React.useState(-1);
  const sentenceRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

  React.useEffect(() => {
    // Break the text into sentences
    const sentenceEndings = /(?<=[.!?])\s+/;
    const parts = text.split(sentenceEndings);
    let currentPos = 0;
    const result: Sentence[] = [];

    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) {
        const sentenceText = parts[i];
        result.push({
          text: sentenceText.trim(),
          start: currentPos,
          end: currentPos + sentenceText.length,
        });
        currentPos += sentenceText.length;
      }
    }
    setSentences(result.filter(s => s.text.length > 0));
    sentenceRefs.current = new Array(result.length);
  }, [text]);

  React.useEffect(() => {
    if (currentSentenceIndex > -1 && sentenceRefs.current[currentSentenceIndex]) {
      sentenceRefs.current[currentSentenceIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [currentSentenceIndex]);

  const handleBoundary = (event: SpeechSynthesisEvent) => {
    const charIndex = event.charIndex;
    const sentenceIdx = sentences.findIndex(s => charIndex >= s.start && charIndex < s.end);
    if (sentenceIdx !== -1) {
      setCurrentSentenceIndex(sentenceIdx);
    }
  };

  const handleEnd = () => {
    setCurrentSentenceIndex(-1);
  };

  if (!text || typeof text !== 'string') {
    return <p className="text-slate-400">No information available.</p>;
  }

  return (
    <div className="space-y-4">
      <SpeechPlayer
        text={text}
        onBoundary={handleBoundary}
        onEnd={handleEnd}
      />
      <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
        {sentences.map((sentence, index) => (
          <span
            key={index}
            ref={(el) => (sentenceRefs.current[index] = el)}
            className={index === currentSentenceIndex ? 'reading' : ''}
          >
            {sentence.text}{' '}
          </span>
        ))}
      </div>
    </div>
  );
}
