
'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Heart, Users, Home, Briefcase, Mic, Sparkles, Play, Pause } from "lucide-react";
import type { AstroInsightOutput } from './types';
import { Button } from '@/components/ui/button';

function SpeechPlayer({ text }: { text: string }) {
    const [isPlaying, setIsPlaying] = React.useState(false);

    React.useEffect(() => {
        // Stop speech when component unmounts or text changes
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, [text]);

    const handlePlayPause = () => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            if (isPlaying) {
                window.speechSynthesis.cancel();
                setIsPlaying(false);
            } else {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.onend = () => setIsPlaying(false);
                window.speechSynthesis.speak(utterance);
                setIsPlaying(true);
            }
        }
    };

    return (
        <Button onClick={handlePlayPause} variant="ghost" size="icon" className="text-purple-300 hover:text-purple-200">
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>
    );
}

function NewAstroSignDetails({ sign, signData }: { sign: string, signData: any }) {
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
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto sm:h-12 bg-black/20">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="love">Love</TabsTrigger>
          <TabsTrigger value="homeAndFamily">Home & Family</TabsTrigger>
          <TabsTrigger value="profession">Profession</TabsTrigger>
          <TabsTrigger value="compatibilities">Compatibilities</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="h-72 w-full p-4">
            <TabsContent value="description">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Info className="h-5 w-5" /> Description</h3>
                        <SpeechPlayer text={signData.description || ''} />
                    </div>
                    <p className="text-slate-300 leading-relaxed">{signData.description}</p>
                </div>
            </TabsContent>
            <TabsContent value="love">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Heart className="h-5 w-5" /> Love</h3>
                        <SpeechPlayer text={signData.love || ''} />
                    </div>
                    <p className="text-slate-300 leading-relaxed">{signData.love}</p>
                </div>
            </TabsContent>
            <TabsContent value="homeAndFamily">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Home className="h-5 w-5" /> Home & Family</h3>
                        <SpeechPlayer text={signData.homeAndFamily || ''} />
                    </div>
                    <p className="text-slate-300 leading-relaxed">{signData.homeAndFamily}</p>
                </div>
            </TabsContent>
            <TabsContent value="profession">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Briefcase className="h-5 w-5" /> Profession</h3>
                        <SpeechPlayer text={signData.profession || ''} />
                    </div>
                    <p className="text-slate-300 leading-relaxed">{signData.profession}</p>
                </div>
            </TabsContent>
            <TabsContent value="compatibilities">
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Users className="h-5 w-5" /> Compatibilities</h3>
                        <SpeechPlayer text={signData.compatibilities || ''} />
                    </div>
                    <p className="text-slate-300 leading-relaxed">{signData.compatibilities}</p>
                </div>
            </TabsContent>
        </ScrollArea>
      </Tabs>
    </DialogContent>
  );
}


export function AstroDisplay({ insight }: { insight: AstroInsightOutput }) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-purple-300">{insight.name}</h2>
        <p className="text-lg text-purple-100/80">{insight.western_sign} / {insight.sign}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
        <div className="glass-card p-4">
          <p className="text-sm text-purple-200/70">Chinese Zodiac Element</p>
          <p className="text-xl font-semibold">{insight.element}</p>
        </div>
         <div className="glass-card p-4">
            <p className="text-sm text-purple-200/70">New Astrology Sign</p>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="link" className="text-xl font-semibold p-0 h-auto text-white hover:text-purple-300">
                        {insight.new_astrology_sign}
                    </Button>
                </DialogTrigger>
                <NewAstroSignDetails sign={insight.new_astrology_sign} signData={insight.signData} />
            </Dialog>
        </div>
      </div>
      
      <div className="glass-card p-6 space-y-3">
        <h3 className="font-semibold text-lg text-primary flex items-center gap-2"><Sparkles className="h-5 w-5" />Personal Reading</h3>
        <p className="text-white/80 leading-relaxed">{insight.reading}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-purple-200/70">Lucky Number</p>
          <p className="text-2xl font-bold">{insight.luckyNumber}</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-sm text-purple-200/70">Lucky Color</p>
          <p className="text-2xl font-bold">{insight.luckyColor}</p>
        </div>
      </div>
    </div>
  );
}
