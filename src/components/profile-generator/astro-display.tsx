'use client';

import * as React from 'react';
import { BookOpen, Leaf, Users, Forward } from "lucide-react";
import { cva } from "class-variance-authority";

import type { AstroInsightOutput } from './types';
import { ScrollableTextDisplay } from './scrollable-text-display';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';

// --- SUB-COMPONENTS ---

const arcItemVariants = cva(
  "cursor-pointer font-medium text-sm transition-all",
  {
    variants: {
      variant: {
        selected: "bg-[hsl(var(--arc-selected-bg))] text-[hsl(var(--arc-selected-fg))] font-bold py-2 px-4 rounded-2xl",
        unselected: "text-[hsl(var(--arc-unselected-fg))]",
      },
    },
    defaultVariants: {
      variant: "unselected",
    },
  }
);

function CelestialArcNav({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  const tabs = ["Introduction", "Element", "Compatibility", "Future"];
  
  return (
    <div className="flex justify-center items-center gap-6 my-8">
      {tabs.map((tab, index) => {
        const isSelected = activeTab === tab.toLowerCase();
        const isOffset = index === 1 || index === 2;
        return (
          <div
            key={tab}
            className={cn(
              arcItemVariants({ variant: isSelected ? 'selected' : 'unselected' }),
              isOffset && 'transform translateY(8px)'
            )}
            style={{ transform: isOffset ? 'translateY(8px)' : 'none' }}
            onClick={() => setActiveTab(tab.toLowerCase())}
          >
            {tab}
          </div>
        )
      })}
    </div>
  )
}

function CompatibilityDisplay({ compatibilities }: { compatibilities: any }) {
    if (!compatibilities || Object.keys(compatibilities).length === 0) {
        return <p className="text-slate-400">No compatibility information available.</p>;
    }

    return (
        <Accordion type="multiple" className="w-full space-y-1">
            {Object.entries(compatibilities).map(([sign, text]) => (
                <AccordionItem value={sign} key={sign}>
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
                <AccordionItem value={year} key={year}>
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
            <ScrollableTextDisplay text={introduction || "No introduction available."} />
          </div>
        );
      case 'element':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Leaf className="h-5 w-5" /> Your Element: The {element}</h3>
            <ScrollableTextDisplay text={signElementData || `No specific data for the ${element} element.`} />
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
      <div className="mt-4 min-h-[250px]">
        {renderContent()}
      </div>
    </div>
  );
}
