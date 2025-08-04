'use client';
import React, { useEffect, useRef } from 'react';

interface Props {
  text: string;
  activeSentenceIndex: number;
  sentences: string[];
}

export const ScrollableTextDisplay: React.FC<Props> = ({ text, activeSentenceIndex, sentences }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sentenceRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    // Reset refs array when sentences change
    sentenceRefs.current = sentenceRefs.current.slice(0, sentences.length);
  }, [sentences]);

  useEffect(() => {
    if (activeSentenceIndex >= 0 && sentenceRefs.current[activeSentenceIndex]) {
      sentenceRefs.current[activeSentenceIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeSentenceIndex]);

  if (!text) {
    return null;
  }

  return (
    <div className="scroll-container" ref={containerRef}>
      {sentences.map((sentence, idx) => (
        <span
          key={idx}
          ref={(el) => {
            sentenceRefs.current[idx] = el;
          }}
          className={idx === activeSentenceIndex ? 'reading' : ''}
        >
          {sentence}
        </span>
      ))}
    </div>
  );
};
