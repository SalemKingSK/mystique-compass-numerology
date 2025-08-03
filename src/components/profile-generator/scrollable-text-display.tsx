
'use client';

import React, { useEffect, useRef } from 'react';

interface Props {
  text: string;
  activeSentenceIndex: number;
}

export const ScrollableTextDisplay: React.FC<Props> = ({ text, activeSentenceIndex }) => {
  // Regex to split text into sentences, keeping the punctuation.
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const containerRef = useRef<HTMLDivElement>(null);
  const sentenceRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    const activeEl = sentenceRefs.current[activeSentenceIndex];
    if (activeEl && containerRef.current) {
      // Scroll the active sentence into the center of the container.
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
          {sentence}
        </span>
      ))}
    </div>
  );
};
