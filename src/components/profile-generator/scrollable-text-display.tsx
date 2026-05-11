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

  const renderContent = (content: string) => {
    // Support for bold: **text**
    // Support for highlight: ==text==
    const parts = content.split(/(\*\*.*?\*\*|==.*?==)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('==') && part.endsWith('==')) {
        return <mark key={i} className="bg-primary/30 text-primary-foreground px-1 rounded">{part.slice(2, -2)}</mark>;
      }
      return part;
    });
  };

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
          {renderContent(sentence)}
        </span>
      ))}
    </div>
  );
};
