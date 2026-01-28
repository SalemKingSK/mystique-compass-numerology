import React from 'react';
import { SpeechPlayer } from './speech-player';
import { ScrollableTextDisplay } from './scrollable-text-display';

export function AccordionContentWithPlayer({ text }: { text: string }) {
    const [activeSentenceIndex, setActiveSentenceIndex] = React.useState(-1);
    const sentences = React.useMemo(() => text.match(/[^.!?\n]+[.!?\n]+/g) || [text], [text]);
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
