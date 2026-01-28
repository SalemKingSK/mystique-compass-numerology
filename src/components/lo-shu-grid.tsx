// src/components/lo-shu-grid.tsx
'use client';
import React from 'react';
import type { ArrowData } from '@/lib/numerology';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Layers } from 'lucide-react';
import { AccordionContentWithPlayer } from '@/components/profile-generator/accordion-content-with-player';

// Props for the LoShuGrid component
interface LoShuGridProps {
  gridData: (string | null)[][];
  arrows: (ArrowData & { type: 'strength' | 'weakness' })[];
  numberCounts: { [key: string]: number };
  repeatedNumberMeanings: { [key: string]: string };
  onArrowClick?: (arrowName: string) => void;
  title: string;
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


export default function LoShuGrid({ gridData, arrows = [], onArrowClick, title, numberCounts, repeatedNumberMeanings }: LoShuGridProps) {
  if (!gridData || gridData.length !== 3) {
    return <p>Grid data is not available.</p>;
  }
  
  const getPathKeyForArrow = (arrow: ArrowData) => {
    // Sort numbers to create a consistent key (e.g., 8-1-6 becomes 1-6-8)
    const sortedNumbers = [...arrow.numbers].sort((a, b) => a - b).join('-');
    // Find a key in ARROW_PATHS that contains the same numbers
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
    const count = numberCounts[String(gridNum)];
    const meaningKey = count ? `${gridNum}_${Math.min(count, 5)}` : null;
    const meaning = meaningKey ? repeatedNumberMeanings[meaningKey] : null;
    const isClickable = !!cell && !!meaning;

    const cellContent = (
      <div
        className={`flex flex-col items-center justify-center bg-black/20 rounded-lg text-2xl font-bold text-white/90 p-2 aspect-square ${isClickable ? 'cursor-pointer transition-all duration-300 hover:bg-purple-500/20' : ''}`}
      >
        <div className="flex-grow flex items-center justify-center">
            {cell ? (
            <span className="truncate">{cell}</span>
            ) : (
            <span className="opacity-20">{gridNum}</span>
            )}
        </div>
        <div className="text-[10px] h-4 font-normal text-purple-300/50 mt-1">
            {PLANETARY_LABELS[gridNum]}
        </div>
      </div>
    );

    if (isClickable) {
      return (
        <Popover key={index}>
          <PopoverTrigger asChild>{cellContent}</PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
                <Layers className="h-5 w-5" /> Number {gridNum} ({count} time{count > 1 ? 's' : ''})
              </h4>
              <AccordionContentWithPlayer text={meaning!} />
            </div>
          </PopoverContent>
        </Popover>
      );
    }

    return <div key={index}>{cellContent}</div>;
  }


  return (
    // The main container that establishes the coordinate system for the overlay
    <div className="relative aspect-square w-full max-w-[400px] mx-auto glass-card p-4">
        <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M3 3v18h18" /><path d="M7 16v-4h4" /><path d="m15.5 15.5-8-8" /></svg>
            {title}
        </h3>
      
      {/* 1. The Grid of Numbers (the base layer) */}
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-2">
        {gridOrder.map((gridNum, index) => renderCell(gridNum, index))}
      </div>

      {/* 2. The SVG Overlay for drawing arrows (sits on top of the grid) */}
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
                  <stop offset="0%" stopColor="hsl(var(--color-quaternary-hsl))" />
                  <stop offset="33%" stopColor="hsl(var(--color-primary-hsl))" />
                  <stop offset="66%" stopColor="hsl(var(--color-secondary-hsl))" />
                  <stop offset="100%" stopColor="hsl(var(--color-tertiary-hsl))" />
                </linearGradient>
                <marker
                  id={markerId}
                  viewBox="0 0 10 10"
                  refX="5" // Center the arrowhead on the line end
                  refY="5"
                  markerWidth="5" // Smaller arrowhead
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill={`url(#${gradientId})`} />
                </marker>
              </React.Fragment>
            );
          })}
        </defs>

        {/* Render the unified, animated lines */}
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
                    strokeWidth="1.5" // Thinner line
                    strokeLinecap="round"
                    markerEnd={`url(#${markerId})`}
                    style={{
                        animation: `arrow-pulse 4s infinite ${index * 0.3}s ease-in-out`,
                        strokeDasharray: isStrength ? 'none' : '3 3' // More subtle dash for weakness
                    }}
                />
            </g>
          );
        })}
      </svg>
    </div>
  );
}