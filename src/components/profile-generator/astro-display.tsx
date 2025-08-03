'use client';

import * as React from 'react';
import { BookOpen, Leaf, Users, Forward } from "lucide-react";
import type { AstroInsightOutput } from './types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { SpeechPlayer } from './speech-player';


// --- SUB-COMPONENTS ---

const TABS: { name: string; icon: React.ElementType }[] = [
  { name: "Introduction", icon: BookOpen },
  { name: "Element", icon: Leaf },
  { name: "Compatibility", icon: Users },
  { name: "Future", icon: Forward },
];


function CompatibilityDisplay({ compatibilities }: { compatibilities: any }) {
    if (!compatibilities || Object.keys(compatibilities).length === 0) {
        return <p className="text-slate-400">No compatibility information available.</p>;
    }

    return (
        <Accordion type="multiple" className="w-full space-y-1">
            {Object.entries(compatibilities).map(([sign, text]) => (
                <AccordionItem value={sign} key={sign} className="glass-card px-4 bg-black/20">
                    <AccordionTrigger>With the {sign}</AccordionTrigger>
                    <AccordionContent>
                        <SpeechPlayer text={String(text)} />
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
            {sortedYears.map(year => {
                const data = futures[year];
                const text = data.prediction;
                return (
                    <AccordionItem value={year} key={year} className="glass-card px-4 bg-black/20">
                        <AccordionTrigger>{year} - Year of the {data.year}</AccordionTrigger>
                        <AccordionContent>
                          <SpeechPlayer text={text} />
                        </AccordionContent>
                    </AccordionItem>
                )
            })}
        </Accordion>
    );
}

// --- MAIN COMPONENT ---

export function AstroDisplay({ insight }: { insight: AstroInsightOutput }) {
  const [api, setApi] = React.useState<any>(null);
  const [current, setCurrent] = React.useState(0);

  const { zodiacData, sign, element } = insight;
  const { introduction, elements, compatibilities, futures } = zodiacData;

  const signElementData = elements?.[element as keyof typeof elements];

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };
  
  const contentMap = [
    {
      key: 'introduction',
      title: `Your Animal Sign: The ${sign}`,
      component: <SpeechPlayer text={introduction || "No introduction available."} />,
    },
    {
      key: 'element',
      title: `Your Element: The ${element}`,
      component: <SpeechPlayer text={signElementData || `No specific data for the ${element} element.`} />,
    },
    {
      key: 'compatibility',
      title: `Compatibility Guide`,
      component: <CompatibilityDisplay compatibilities={compatibilities} />,
    },
    {
      key: 'future',
      title: `Future Outlook`,
      component: <FutureDisplay futures={futures} />,
    }
  ]


  return (
    <div className="w-full glass-card p-4">
       <div className="py-2 text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-1 md:gap-2 mb-4">
            {TABS.map((tab, index) => (
                <Button
                    key={tab.name}
                    variant={current === index ? 'default' : 'outline'}
                    size="sm"
                    className="h-auto py-1 px-2 text-xs md:h-9 md:px-3 md:text-sm"
                    onClick={() => scrollTo(index)}
                >
                    <tab.icon className="h-4 w-4 mr-1.5" />
                    {tab.name}
                </Button>
            ))}
        </div>
      </div>
      <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
              {contentMap.map((item, index) => {
                   const TabIcon = TABS[index].icon;
                   return (
                      <CarouselItem key={item.key}>
                          <div className="p-1 h-96">
                              <ScrollArea className="h-full w-full rounded-md p-4 bg-black/20">
                                  <div className="flex justify-between items-center mb-2">
                                      <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                          <TabIcon className="h-6 w-6" /> {item.title}
                                      </h3>
                                  </div>
                                  <div>{item.component}</div>
                              </ScrollArea>
                          </div>
                      </CarouselItem>
                   )
              })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
      </Carousel>
    </div>
  );
}
