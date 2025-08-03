
'use client';

import * as React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Leaf, Users, Forward, Info, Heart, Home, Briefcase, Mic } from "lucide-react";
import type { AstroInsightOutput, NewAstroSignData } from './types';
import { SpeechPlayer } from './speech-player';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';

function ElementDisplay({ elementName, elementData }: { elementName: string, elementData: any }) {
    if (!elementData) return null;
    return (
        <div className="space-y-2 mt-4">
            <h4 className="font-semibold text-md text-purple-200">{elementName} Element</h4>
            <p className="text-sm text-white/80 leading-relaxed">{elementData}</p>
        </div>
    );
}

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


function NewAstroSignDetails({ sign, signData }: { sign: string, signData: NewAstroSignData }) {
  if (!signData || Object.keys(signData).length === 0) {
    return (
      <DialogContent className="max-w-4xl bg-background/80 backdrop-blur-sm text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center text-purple-300">
            {sign.replace('/', ' / ')}
          </DialogTitle>
          <div className="pt-8 text-center text-slate-400">
            Detailed information for {sign} is not yet available.
          </div>
        </DialogHeader>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="max-w-4xl bg-background/80 backdrop-blur-sm text-white border-slate-700">
      <DialogHeader>
        <DialogTitle className="text-3xl font-bold text-center text-purple-300">
            {sign.replace('/', ' / ')}
        </DialogTitle>
        <DialogDescription className="text-center text-slate-400">
          A detailed look into the combined traits of your unique astrological sign.
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto sm:h-12">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="love">Love</TabsTrigger>
          <TabsTrigger value="homeAndFamily">Home & Family</TabsTrigger>
          <TabsTrigger value="profession">Profession</TabsTrigger>
          <TabsTrigger value="compatibilities">Compatibilities</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-72 w-full p-4">
          <TabsContent value="description">
            <div className="flex items-start space-x-4">
              <Info className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />
              <p className="text-slate-300 whitespace-pre-wrap">{signData.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="love">
            <div className="flex items-start space-x-4">
              <Heart className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />
              <p className="text-slate-300 whitespace-pre-wrap">{signData.love}</p>
            </div>
          </TabsContent>

          <TabsContent value="homeAndFamily">
            <div className="flex items-start space-x-4">
              <Home className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />
              <p className="text-slate-300 whitespace-pre-wrap">{signData.homeAndFamily}</p>
            </div>
          </TabsContent>

          <TabsContent value="profession">
            <div className="flex items-start space-x-4">
              <Briefcase className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />
              <p className="text-slate-300 whitespace-pre-wrap">{signData.profession}</p>
            </div>
          </TabsContent>

          <TabsContent value="compatibilities">
            <div className="flex items-start space-x-4">
              <Users className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />
              <p className="text-slate-300 whitespace-pre-wrap">{signData.compatibilities}</p>
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </DialogContent>
  );
}


export function AstroDisplay({ insight }: { insight: AstroInsightOutput }) {
  const { zodiacData, sign, element } = insight;
  const { introduction, elements, compatibilities, futures } = zodiacData;

  const signElementData = elements?.[element as keyof typeof elements];

  return (
    <div className="space-y-4">
      <Dialog>
        <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-wide">{insight.name}</h2>
             <DialogTrigger asChild>
                <Button variant="ghost" className="text-lg text-purple-300/80 hover:bg-purple-500/10 hover:text-purple-200">
                    {insight.new_astrology_sign}
                </Button>
            </DialogTrigger>
        </div>
         <NewAstroSignDetails sign={insight.new_astrology_sign} signData={insight.signData} />
      </Dialog>
      
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
                  <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Leaf className="h-5 w-5" /> Your Element: The {element}</h3>
                  <SpeechPlayer text={signElementData || ''} />
              </div>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{signElementData || `No specific data for the ${element} element.`}</p>
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
