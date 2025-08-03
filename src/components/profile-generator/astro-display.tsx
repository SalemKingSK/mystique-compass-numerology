
'use client';

import * as React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Leaf, Users, Forward } from "lucide-react";
import type { AstroInsightOutput, ZodiacData } from './types';
import { SpeechPlayer } from './speech-player';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Sub-component for displaying a single element's data
function ElementDisplay({ elementName, elementData }: { elementName: string, elementData: any }) {
    if (!elementData) return null;
    return (
        <div className="space-y-2 mt-4">
            <h4 className="font-semibold text-md text-purple-200">{elementName} Element</h4>
            <p className="text-sm text-white/80 leading-relaxed">{elementData}</p>
        </div>
    );
}

// Sub-component for displaying future predictions
function FutureDisplay({ futures }: { futures: any }) {
    if (!futures || Object.keys(futures).length === 0) return <p className="text-slate-400">No future predictions available.</p>;

    const sortedYears = Object.keys(futures).sort((a, b) => parseInt(a) - parseInt(b));
    
    return (
      <Accordion type="single" collapsible className="w-full">
        {sortedYears.map(year => (
          <AccordionItem value={year} key={year}>
            <AccordionTrigger className="text-purple-200 font-semibold">{year} - Year of the {futures[year].year}</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-white/80 leading-relaxed">{futures[year].prediction}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
}

// Sub-component for compatibilities
function CompatibilityDisplay({ compatibilities }: { compatibilities: any }) {
    if (!compatibilities || Object.keys(compatibilities).length === 0) {
        return <p className="text-slate-400">No compatibility information available.</p>;
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            {Object.entries(compatibilities).map(([sign, text]) => (
                 <AccordionItem value={sign} key={sign}>
                    <AccordionTrigger className="text-purple-200 font-semibold">{sign}</AccordionTrigger>
                    <AccordionContent>
                    <p className="text-sm text-white/80 leading-relaxed">{text as string}</p>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

export function AstroDisplay({ insight }: { insight: AstroInsightOutput }) {
  const { sign, name, western_sign, zodiacData } = insight;
  const { introduction, elements, compatibilities, futures } = zodiacData;

  // Find the element data for the user's specific sign element
  const signElementData = elements?.[insight.element as keyof typeof elements];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">{name}</h2>
        <p className="text-lg text-purple-100/80">{western_sign} / {sign}</p>
      </div>

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
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><BookOpen className="h-5 w-5" /> Your Animal Sign: The {sign}</h3>
                <SpeechPlayer text={introduction || ''} />
              </div>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{introduction || "No introduction available."}</p>
            </div>
          </TabsContent>

          <TabsContent value="element">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Leaf className="h-5 w-5" /> Your Element: The {insight.element}</h3>
                  <SpeechPlayer text={signElementData || ''} />
              </div>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{signElementData || `No specific data for the ${insight.element} element.`}</p>
            </div>
          </TabsContent>

          <TabsContent value="compatibility">
             <div className="space-y-4">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Users className="h-5 w-5" /> Compatibility Guide</h3>
               <ScrollArea className="h-60">
                 <CompatibilityDisplay compatibilities={compatibilities} />
               </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="future">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Forward className="h-5 w-5" /> Future Outlook</h3>
              <ScrollArea className="h-60">
                 <FutureDisplay futures={futures} />
              </ScrollArea>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
