
'use client';

import * as React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BookOpen, Leaf, Users, Forward } from "lucide-react";
import type { AstroInsightOutput } from './types';
import { ScrollableTextDisplay } from './scrollable-text-display';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

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


export function AstroDisplay({ insight }: { insight: AstroInsightOutput }) {
  const { zodiacData, sign, element } = insight;
  const { introduction, elements, compatibilities, futures } = zodiacData;

  const signElementData = elements?.[element as keyof typeof elements];

  return (
    <div className="space-y-4">
      <Tabs defaultValue="introduction" className="w-full glass-card p-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto bg-black/20">
          <TabsTrigger value="introduction">Introduction</TabsTrigger>
          <TabsTrigger value="element">Element</TabsTrigger>
          <TabsTrigger value="compatibility">Compatibility</TabsTrigger>
          <TabsTrigger value="future">Future</TabsTrigger>
        </TabsList>
        
        <div className="mt-4 min-h-[250px]">
          <TabsContent value="introduction">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><BookOpen className="h-5 w-5" /> Your Animal Sign: The {sign}</h3>
              <ScrollableTextDisplay text={introduction || "No introduction available."} />
            </div>
          </TabsContent>

          <TabsContent value="element">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Leaf className="h-5 w-5" /> Your Element: The {element}</h3>
              <ScrollableTextDisplay text={signElementData || `No specific data for the ${element} element.`} />
            </div>
          </TabsContent>

          <TabsContent value="compatibility">
             <div className="space-y-4">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Users className="h-5 w-5" /> Compatibility Guide</h3>
              <CompatibilityDisplay compatibilities={compatibilities} />
            </div>
          </TabsContent>

          <TabsContent value="future">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Forward className="h-5 w-5" /> Future Outlook</h3>
              <FutureDisplay futures={futures} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
