import React from 'react';
import { SpeechPlayer } from './speech-player';
import { ScrollableTextDisplay } from './scrollable-text-display';

export function AccordionContentWithPlayer({ text = "" }: { text?: string }) {
    const [activeSentenceIndex, setActiveSentenceIndex] = React.useState(-1);
    
    // Safety check: ensure text is a string before matching
    const sentences = React.useMemo(() => {
        if (!text) return [""];
        return text.match(/[^.!?\n]+[.!?\n]+/g) || [text];
    }, [text]);

    if (!text) return null;

    return (
        <div className="space-y-4">
            <SpeechPlayer
                text={text}
                sentences={sentences}
                onBoundary={setActiveSentenceIndex}
                onEnd={() => setActiveSentenceIndex(-1)}
            />
            <ScrollableTextDisplay
                text={text}
                sentences={sentences}
                activeSentenceIndex={activeSentenceIndex}
            />
        </div>
    )
}
