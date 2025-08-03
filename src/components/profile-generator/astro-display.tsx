
'use client';

import * as React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Leaf, Users, Forward, Info, Heart, Home, Briefcase } from "lucide-react";
import type { AstroInsightOutput, NewAstroSignData } from './types';
import { SpeechPlayer } from './speech-player';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { ScrollableTextDisplay } from './scrollable-text-display';

function CompatibilityDisplay({ compatibilities }: { compatibilities: any }) {
    if (!compatibilities || Object.keys(compatibilities).length === 0) return <p className="text-slate-400">No compatibility information available.</p>;

    const compatibilityText = Object.entries(compatibilities).map(([sign, text]) => `${sign}:\n${text}`).join('\n\n');
    
    return (
        <ScrollableTextDisplay text={compatibilityText} />
    );
}

function FutureDisplay({ futures }: { futures: any }) {
    if (!futures || Object.keys(futures).length === 0) return <p className="text-slate-400">No future predictions available.</p>;

    const sortedYears = Object.keys(futures).sort((a, b) => parseInt(a) - parseInt(b));
    const futureText = sortedYears.map(year => `*${year} - Year of the ${futures[year].year}*\n${futures[year].prediction}`).join('\n\n');
    
    return (
      <ScrollableTextDisplay text={futureText} />
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
        
        <div className="h-72 w-full pt-4">
          <TabsContent value="description">
             <ScrollableTextDisplay text={signData.description || ''} icon={<Info className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />} />
          </TabsContent>

          <TabsContent value="love">
             <ScrollableTextDisplay text={signData.love || ''} icon={<Heart className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />} />
          </TabsContent>

          <TabsContent value="homeAndFamily">
             <ScrollableTextDisplay text={signData.homeAndFamily || ''} icon={<Home className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />} />
          </TabsContent>

          <TabsContent value="profession">
            <ScrollableTextDisplay text={signData.profession || ''} icon={<Briefcase className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />} />
          </TabsContent>

          <TabsContent value="compatibilities">
            <ScrollableTextDisplay text={signData.compatibilities || ''} icon={<Users className="h-5 w-5 mt-1 text-purple-300 flex-shrink-0" />} />
          </TabsContent>
        </div>
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
      <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-wide">{insight.name}</h2>
            <Dialog>
                 <DialogTrigger asChild>
                    <Button variant="ghost" className="text-lg text-purple-300/80 hover:bg-purple-500/10 hover:text-purple-200">
                        {insight.new_astrology_sign}
                    </Button>
                </DialogTrigger>
                <NewAstroSignDetails sign={insight.new_astrology_sign} signData={insight.signData} />
            </Dialog>
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
