'use client';

import * as React from 'react';
import { BookOpen, Leaf, Users, Forward, Milestone } from "lucide-react";
import type { AstroInsightOutput } from './types';
import { ScrollableTextDisplay } from './scrollable-text-display';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { SpeechPlayer } from './speech-player';

// --- SUB-COMPONENTS ---

type ArcCategory = {
  name: string;
  icon: React.ElementType;
};

const TABS: ArcCategory[] = [
  { name: "Introduction", icon: BookOpen },
  { name: "Element", icon: Leaf },
  { name: "Compatibility", icon: Users },
  { name: "Future", icon: Forward },
];

function CelestialArcNav({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const activeIndex = TABS.findIndex(tab => tab.name.toLowerCase() === activeTab);

  return (
    <div className="relative w-full h-48 my-4 flex justify-center items-center overflow-hidden">
      {TABS.map((tab, index) => {
        const isActive = activeIndex === index;
        const angle = (index - activeIndex) * 25; // 25 degrees between items

        return (
          <div
            key={tab.name}
            className="absolute transition-all duration-500 ease-in-out"
            style={{
              transform: `rotate(${angle}deg) translateY(-120px) rotate(${-angle}deg)`,
              transformOrigin: 'bottom center',
            }}
          >
            <button
              onClick={() => setActiveTab(tab.name.toLowerCase())}
              className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-300 ${
                isActive ? 'text-primary scale-110' : 'text-purple-200/60 scale-90'
              }`}
            >
              <tab.icon className={`h-8 w-8 transition-all duration-300 ${isActive ? 'mb-1' : ''}`} />
              <span className={`transition-all duration-300 text-lg ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.name}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}


function CompatibilityDisplay({ compatibilities }: { compatibilities: any }) {
    if (!compatibilities || Object.keys(compatibilities).length === 0) {
        return <p className="text-slate-400">No compatibility information available.</p>;
    }

    return (
        <Accordion type="multiple" className="w-full space-y-1">
            {Object.entries(compatibilities).map(([sign, text]) => (
                <AccordionItem value={sign} key={sign} className="glass-card px-4">
                    <AccordionTrigger>With the {sign}</AccordionTrigger>
                    <AccordionContent>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{String(text)}</p>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

function FutureDisplay({ futures }: { futures: any }) {
    if (!futures || Object.keys(futures).length === 0) {
        return <p className="text-slate-400">No future predictions available.</p>;
    }

    const sortedYears = Object.keys(futures).sort((a, b) => parseInt(a) - parseInt(b));
    
    return (
        <Accordion type="multiple" className="w-full space-y-1">
            {sortedYears.map(year => (
                <AccordionItem value={year} key={year} className="glass-card px-4">
                    <AccordionTrigger>{year} - Year of the {futures[year].year}</AccordionTrigger>
                    <AccordionContent>
                        <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{futures[year].prediction}</p>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

// --- MAIN COMPONENT ---

export function AstroDisplay({ insight }: { insight: AstroInsightOutput }) {
  const [activeSubTab, setActiveSubTab] = React.useState('introduction');
  const { zodiacData, sign, element } = insight;
  const { introduction, elements, compatibilities, futures } = zodiacData;

  const signElementData = elements?.[element as keyof typeof elements];

  const renderContent = () => {
    switch (activeSubTab) {
      case 'introduction':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><BookOpen className="h-5 w-5" /> Your Animal Sign: The {sign}</h3>
             <ScrollableTextDisplay 
                text={introduction || "No introduction available."} 
                renderPlayer={(onBoundary, onEnd) => (
                    <div className="absolute top-0 right-0 z-10">
                        <SpeechPlayer text={introduction || ''} onBoundary={onBoundary} onEnd={onEnd} />
                    </div>
                )}
             />
          </div>
        );
      case 'element':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Leaf className="h-5 w-5" /> Your Element: The {element}</h3>
            <ScrollableTextDisplay 
                text={signElementData || `No specific data for the ${element} element.`} 
                renderPlayer={(onBoundary, onEnd) => (
                    <div className="absolute top-0 right-0 z-10">
                        <SpeechPlayer text={signElementData || ''} onBoundary={onBoundary} onEnd={onEnd} />
                    </div>
                )}
             />
          </div>
        );
      case 'compatibility':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Users className="h-5 w-5" /> Compatibility Guide</h3>
            <CompatibilityDisplay compatibilities={compatibilities} />
          </div>
        );
      case 'future':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Forward className="h-5 w-5" /> Future Outlook</h3>
            <FutureDisplay futures={futures} />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="w-full glass-card p-4">
      <CelestialArcNav activeTab={activeSubTab} setActiveTab={setActiveSubTab} />
      <div className="mt-4 min-h-[300px]">
        {renderContent()}
      </div>
    </div>
  );
}

export { CelestialArcNav };
