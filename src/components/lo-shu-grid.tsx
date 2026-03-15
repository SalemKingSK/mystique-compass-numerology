// src/components/lo-shu-grid.tsx
'use client';
import React from 'react';
import type { ArrowData } from '@/lib/numerology';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Layers, X } from 'lucide-react';
import LoshuNumberDetailPanel from '@/components/LoshuNumberDetailPanel';
import * as PopoverPrimitive from "@radix-ui/react-popover";

// Props for the LoShuGrid component
interface LoShuGridProps {
  gridData: (string | null)[][];
  arrows: (ArrowData & { type: 'strength' | 'weakness' | 'shadow' })[];
  numberCounts: { [key: string]: number };
  repeatedNumberMeanings: { [key: string]: string };
  onArrowClick?: (arrowName: string) => void;
  title: string;
  birthDate: string;
}

const PLANETARY_LABELS: { [key: number]: string } = {
  4: 'Rahu (Wood)',
  9: 'Mars (Fire)',
  2: 'Moon (Earth)',
  3: 'Jupiter (Wood)',
  5: 'Mercury (Earth)',
  7: 'Ketu (Metal)',
  8: 'Saturn (Earth)',
  1: 'Sun (Water)',
  6: 'Venus (Metal)',
};


// Central repository for all possible arrow path coordinates (start, end)
// These percentages correspond to the center of each grid cell.
const ARROW_PATHS: { [key: string]: { x1: string; y1: string; x2: string; y2: string } } = {
  // Horizontal Arrows
  '4-9-2': { x1: '16.67%', y1: '16.67%', x2: '83.33%', y2: '16.67%' },
  '3-5-7': { x1: '16.67%', y1: '50%',   x2: '83.33%', y2: '50%' },
  '8-1-6': { x1: '16.67%', y1: '83.33%', x2: '83.33%', y2: '83.33%' },
  // Vertical Arrows
  '4-3-8': { x1: '16.67%', y1: '16.67%', x2: '16.67%', y2: '83.33%' },
  '9-5-1': { x1: '50%',    y1: '16.67%', x2: '50%',    y2: '83.33%' },
  '2-7-6': { x1: '83.33%', y1: '16.67%', x2: '83.33%', y2: '83.33%' },
  // Diagonal Arrows
  '4-5-6': { x1: '16.67%', y1: '16.67%', x2: '83.33%', y2: '83.33%' },
  '2-5-8': { x1: '83.33%', y1: '16.67%', x2: '16.67%', y2: '83.33%' },
};


export default function LoShuGrid({ gridData, arrows = [], onArrowClick, title, numberCounts, repeatedNumberMeanings, birthDate }: LoShuGridProps) {
  if (!gridData || gridData.length !== 3) {
    return <p className="font-body">Grid data is not available.</p>;
  }
  
  const getPathKeyForArrow = (arrow: ArrowData) => {
    // Only return path keys for straight lines defined in ARROW_PATHS
    const directMatch = Object.keys(ARROW_PATHS).find(key => {
        const keyNumbers = new Set(key.split('-').map(Number));
        const arrowNumbers = new Set(arrow.numbers);
        if (keyNumbers.size !== arrowNumbers.size) return false;
        for (let num of arrowNumbers) {
            if (!keyNumbers.has(num)) return false;
        }
        return true;
    });
    return directMatch || null;
  }

  const gridOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];

  const renderCell = (gridNum: number, index: number) => {
    const cell = gridData.flat().find(c => c?.startsWith(String(gridNum)));
    const count = numberCounts[String(gridNum)] || 0;
    const meaning = repeatedNumberMeanings[`${gridNum}_${Math.min(count || 1, 5)}`];

    const cellContent = (
      <div
        className={`flex flex-col items-center justify-center bg-black/20 rounded-lg text-white/90 p-2 aspect-square cursor-pointer transition-all duration-300 hover:bg-purple-500/20`}
      >
        <div className="flex-grow flex items-center justify-center">
            {cell ? (
            <span className="truncate font-decorative text-2xl">{cell}</span>
            ) : (
            <span className="opacity-20 font-decorative text-2xl">{gridNum}</span>
            )}
        </div>
        <div className="text-[0.45rem] font-cinzel h-4 font-normal text-purple-300/50 mt-1 uppercase tracking-wider text-center">
            {PLANETARY_LABELS[gridNum]}
        </div>
      </div>
    );

    return (
      <Popover key={index}>
        <PopoverTrigger asChild>{cellContent}</PopoverTrigger>
        <PopoverContent className="w-80 max-h-[80vh] overflow-y-auto relative">
          <PopoverPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-primary">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </PopoverPrimitive.Close>
          <div className="space-y-4">
            <h4 className="font-cinzel font-semibold text-[0.8rem] text-primary mb-2 flex items-center gap-2 uppercase tracking-widest pr-8">
              <Layers className="h-5 w-5" /> Number {gridNum} ({count} time{count !== 1 ? 's' : ''})
            </h4>
            
            <LoshuNumberDetailPanel
              number={gridNum}
              count={count}
              existingMeaning={meaning || `Number {gridNum} represents foundational ${PLANETARY_LABELS[gridNum]} energy.`}
              birthDate={birthDate}
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  }


  return (
    <div className="relative aspect-square w-full max-w-[400px] mx-auto glass-card p-4">
        <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <h3 className="font-cinzel font-semibold text-[0.7rem] text-primary flex items-center gap-2 uppercase tracking-[0.25em] text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 3v18h18" /><path d="M7 16v-4h4" /><path d="m15.5 15.5-8-8" /></svg>
                {title}
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-2">
        {gridOrder.map((gridNum, index) => renderCell(gridNum, index))}
      </div>

      <svg
        className="absolute top-0 left-0 w-full h-full p-4 pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {arrows.map((arrow, index) => {
            const pathKey = getPathKeyForArrow(arrow);
            if (!pathKey) return null;
            const pathInfo = ARROW_PATHS[pathKey];
            
            const uniqueId = `${arrow.name.replace(/\s+/g, '-')}-${index}`;
            const gradientId = `gradient-${uniqueId}`;
            const markerId = `marker-${uniqueId}`;

            return (
              <React.Fragment key={uniqueId}>
                <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={pathInfo.x1} y1={pathInfo.y1} x2={pathInfo.x2} y2={pathInfo.y2}>
                  <stop offset="0%" stopColor="#ff00ff" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
                <marker
                  id={markerId}
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={`url(#${gradientId})`} />
                </marker>
              </React.Fragment>
            );
          })}
        </defs>

        {arrows.map((arrow, index) => {
          const pathKey = getPathKeyForArrow(arrow);
          if (!pathKey) return null;
          const pathInfo = ARROW_PATHS[pathKey];

          const isStrength = arrow.type === 'strength';
          const uniqueId = `${arrow.name.replace(/\s+/g, '-')}-${index}`;
          const gradientId = `gradient-${uniqueId}`;
          const markerId = `marker-${uniqueId}`;
          const isClickable = !!onArrowClick;
          
          return (
             <g key={uniqueId} onClick={isClickable ? () => onArrowClick!(arrow.name) : undefined} className={`${isClickable ? "cursor-pointer" : ""} pointer-events-auto`}>
                <line
                    x1={pathInfo.x1} y1={pathInfo.y1}
                    x2={pathInfo.x2} y2={pathInfo.y2}
                    stroke="transparent"
                    strokeWidth="8"
                />
                <line
                    x1={pathInfo.x1} y1={pathInfo.y1}
                    x2={pathInfo.x2} y2={pathInfo.y2}
                    stroke={`url(#${gradientId})`}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    markerEnd={`url(#${markerId})`}
                    style={{
                        animation: `arrow-pulse 4s infinite ${index * 0.3}s ease-in-out`,
                        strokeDasharray: isStrength ? 'none' : '3 3'
                    }}
                />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
