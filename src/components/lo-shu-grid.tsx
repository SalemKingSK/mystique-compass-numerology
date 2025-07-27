// src/components/lo-shu-grid.tsx
'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import type { ArrowData } from '@/lib/numerology';

// This is a robust lookup for SVG path data.
// It uses a sorted key to handle any number order (e.g., 8-1-6 becomes 1-6-8).
const ARROW_PATHS: { [key: string]: string } = {
  // Horizontal
  '2-4-9': 'M50 50 L250 50', // Corresponds to Arrow of Intellect
  '3-5-7': 'M50 150 L250 150', // Corresponds to Arrow of Spirituality
  '1-6-8': 'M50 250 L250 250', // Corresponds to Arrow of Prosperity
  // Vertical
  '3-4-8': 'M50 50 L50 250', // Corresponds to Arrow of Planning
  '1-5-9': 'M150 50 L150 250', // Corresponds to Arrow of Willpower
  '2-6-7': 'M250 50 L250 250', // Corresponds to Arrow of Action
  // Diagonal
  '2-5-8': 'M250 50 L50 250', // Corresponds to Arrow of Determination
  '4-5-6': 'M50 50 L250 250', // Corresponds to Arrow of Emotional Balance
};


const PulsatingArrow = ({ arrow, type, delay }: { arrow: ArrowData; type: 'strength' | 'weakness', delay: number }) => {
  // Create a reliable, sorted key from the arrow's numbers to look up the path.
  const sortedKey = [...arrow.numbers].sort((a, b) => a - b).join('-');
  const path = ARROW_PATHS[sortedKey as keyof typeof ARROW_PATHS];
  if (!path) return null;

  // Generate a guaranteed unique ID for every arrow to prevent SVG conflicts.
  const uniqueId = `${type}-${sortedKey}-${delay}`;
  const gradientId = `gradient-${uniqueId}`;
  const arrowheadId = `arrowhead-${uniqueId}`;

  const isStrength = type === 'strength';
  const fromColor = isStrength ? 'hsl(var(--color-primary-hsl))' : 'hsl(var(--color-destructive) / 0.7)';
  const toColor = isStrength ? 'hsl(var(--color-secondary-hsl))' : 'hsl(var(--color-tertiary-hsl) / 0.7)';

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(45)">
          <stop offset="0%" stopColor={fromColor} />
          <stop offset="100%" stopColor={toColor} />
        </linearGradient>
        <marker
          id={arrowheadId}
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={`url(#${gradientId})`} />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="4"
        strokeLinecap="round"
        className={cn('opacity-80', { 'stroke-dashed': !isStrength })}
        strokeDasharray={isStrength ? 'none' : '8, 8'}
        markerEnd={`url(#${arrowheadId})`}
        style={{
          filter: `drop-shadow(0 0 3px ${fromColor})`,
          strokeDasharray: 450,
          strokeDashoffset: 450,
          animation: `arrow-flow 2s ease-out forwards ${delay}s, arrow-pulse 4s linear infinite ${delay + 2}s`,
        }}
      />
    </>
  );
};

export function LoShuGrid({ grid, arrows }: { grid: (string | null)[][]; arrows: ArrowData[] }) {
  const loShuMap = [
    ['4', '9', '2'],
    ['3', '5', '7'],
    ['8', '1', '6'],
  ];

  return (
    <div className="glass-card p-4 relative aspect-square">
      <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M3 3v18h18" /><path d="M7 16v-4h4" /><path d="m15.5 15.5-8-8" /></svg>
        Lo Shu Grid
      </h3>
      <div className="grid grid-cols-3 gap-2 aspect-square relative z-10">
        {loShuMap.flat().map((num, index) => {
          const row = Math.floor(index / 3);
          const col = index % 3;
          const cellContent = grid[row][col];
          return (
            <div key={index} className="flex items-center justify-center text-2xl font-bold bg-black/20 rounded-lg h-full p-1 aspect-square">
              <span className="truncate"> {cellContent || <span className="opacity-20">{loShuMap[row][col]}</span>}</span>
            </div>
          );
        })}
      </div>
      <div className="absolute inset-0 p-0 z-0">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 300 300">
          {arrows.map((arrow, index) => (
            <PulsatingArrow key={index} arrow={arrow} type={'strength'} delay={index * 0.5} />
          ))}
        </svg>
      </div>
    </div>
  );
}
