// src/components/lo-shu-grid.tsx

import React from 'react';
import type { ArrowData } from '@/lib/numerology';

// Props for the LoShuGrid component
interface LoShuGridProps {
  gridData: (string | null)[][];
  arrows: (ArrowData & { type: 'strength' | 'weakness' })[];
}

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


const LoShuGrid: React.FC<LoShuGridProps> = ({ gridData, arrows = [] }) => {
  if (!gridData || gridData.length !== 3) {
    return <p>Grid data is not available.</p>;
  }
  
  const getPathKeyForArrow = (arrow: ArrowData) => {
    const sortedNumbers = [...arrow.numbers].sort((a, b) => a - b).join('-');
    const directMatch = Object.keys(ARROW_PATHS).find(key => {
        const keyNumbers = new Set(key.split('-').map(Number));
        return arrow.numbers.every(num => keyNumbers.has(num)) && arrow.numbers.length === keyNumbers.size;
    });
    return directMatch || null;
  }

  return (
    // The main container that establishes the coordinate system for the overlay
    <div className="relative aspect-square w-full max-w-[400px] mx-auto glass-card p-4">
        <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M3 3v18h18" /><path d="M7 16v-4h4" /><path d="m15.5 15.5-8-8" /></svg>
            Lo Shu Grid
        </h3>
      
      {/* 1. The Grid of Numbers (the base layer) */}
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-2">
        {gridData.flat().map((cell, index) => (
          <div
            key={index}
            className="flex items-center justify-center bg-black/20 rounded-lg text-2xl font-bold text-white/90 p-2 aspect-square"
          >
            {cell ? (
              <span className="truncate">{cell}</span>
            ) : (
              <span className="opacity-20">{[ '4', '9', '2', '3', '5', '7', '8', '1', '6' ][index]}</span>
            )}
          </div>
        ))}
      </div>

      {/* 2. The SVG Overlay for drawing arrows (sits on top of the grid) */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none p-4"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {arrows.map((arrow, index) => {
            const pathKey = getPathKeyForArrow(arrow);
            if (!pathKey) return null;
            const pathInfo = ARROW_PATHS[pathKey];

            const isStrength = arrow.type === 'strength';
            // On-theme color palette
            const colorStart = isStrength ? 'hsl(var(--color-primary-hsl))' : 'hsl(var(--color-destructive))';
            const colorEnd = isStrength ? 'hsl(var(--color-secondary-hsl))' : 'hsl(var(--color-quaternary-hsl))';   

            const uniqueId = `${arrow.name.replace(/\s+/g, '-')}-${index}`;
            const gradientId = `gradient-${uniqueId}`;
            const markerId = `marker-${uniqueId}`;

            return (
              <React.Fragment key={uniqueId}>
                <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={pathInfo.x1} y1={pathInfo.y1} x2={pathInfo.x2} y2={pathInfo.y2}>
                  <stop offset="0%" stopColor={colorStart} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={colorEnd} stopOpacity="0.8" />
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
          
          return (
             <line
                key={uniqueId}
                x1={pathInfo.x1} y1={pathInfo.y1}
                x2={pathInfo.x2} y2={pathInfo.y2}
                stroke={`url(#${gradientId})`}
                strokeWidth="1.5" // Thinner line
                strokeLinecap="round"
                markerEnd={`url(#${markerId})`}
                style={{
                    animation: `glow 3s infinite ${index * 0.3}s ease-in-out`,
                    strokeDasharray: isStrength ? 'none' : '3 3' // More subtle dash for weakness
                }}
              />
          );
        })}
      </svg>
      
      {/* New, more subtle animation */}
      <style>{`
        @keyframes glow {
          0%, 100% { 
            opacity: 0.6;
            filter: drop-shadow(0 0 1.5px hsla(0, 0%, 100%, 0.3));
          }
          50% { 
            opacity: 1;
            filter: drop-shadow(0 0 4px hsla(0, 0%, 100%, 0.6));
          }
        }
      `}</style>
    </div>
  );
};

export default LoShuGrid;
