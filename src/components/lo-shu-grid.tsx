// src/components/lo-shu-grid.tsx
'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import type { ArrowData } from '@/lib/numerology';

const ARROW_PATHS: { [key: string]: string } = {
    // Rows
    "4-3-8": "M16.6 16.6 L83.3 16.6 L150 16.6", // Top row (grid numbers 4, 3, 8)
    "9-5-1": "M16.6 50 L83.3 50 L150 50",   // Middle row (grid numbers 9, 5, 1)
    "2-7-6": "M16.6 83.3 L83.3 83.3 L150 83.3", // Bottom row (grid numbers 2, 7, 6)
    // Columns
    "4-9-2": "M16.6 16.6 L16.6 50 L16.6 83.3", // Left col (grid numbers 4, 9, 2)
    "3-5-7": "M83.3 16.6 L83.3 50 L83.3 83.3", // Middle col (grid numbers 3, 5, 7)
    "8-1-6": "M150 16.6 L150 50 L150 83.3",  // Right col (grid numbers 8, 1, 6)
    // Diagonals
    "4-5-6": "M16.6 16.6 L83.3 50 L150 83.3", // Top-left to bottom-right (grid numbers 4, 5, 6)
    "2-5-8": "M16.6 83.3 L83.3 50 L150 16.6",  // Bottom-left to top-right (grid numbers 2, 5, 8)
};

const PulsatingArrow = ({ path, delay }: { path: string, delay: number }) => {
    const id = React.useId();
    return (
        <svg className="absolute top-0 left-0 w-full h-full overflow-visible">
            <defs>
                <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--color-primary-hsl))" />
                    <stop offset="50%" stopColor="hsl(var(--color-quaternary-hsl))" />
                    <stop offset="100%" stopColor="hsl(var(--color-secondary-hsl))" />
                </linearGradient>
            </defs>
            <path
                d={path}
                fill="none"
                stroke={`url(#gradient-${id})`}
                strokeWidth="4"
                strokeLinecap="round"
                className="opacity-80"
                style={{
                    filter: 'drop-shadow(0 0 3px hsl(var(--color-primary-hsl)))',
                    strokeDasharray: 250,
                    strokeDashoffset: 250,
                    animation: `arrow-flow 2s ease-out forwards ${delay}s, arrow-pulse 4s linear infinite ${delay + 2}s`
                }}
            />
        </svg>
    );
};


export function LoShuGrid({ grid, arrows }: { grid: (string | null)[][], arrows: ArrowData[] }) {
    
    // The grid is displayed with visual numbers 1-9, but the logic maps to the Lo Shu positions.
    // Let's create a visual map.
    const loShuMap = [
        ['4', '9', '2'],
        ['3', '5', '7'],
        ['8', '1', '6']
    ];

    return (
        <div className="glass-card p-4 relative aspect-square">
            <h3 className="font-semibold text-lg text-primary mb-2 flex items-center gap-2">
                Lo Shu Grid
            </h3>
            <div className="grid grid-cols-3 gap-2 aspect-square relative z-10">
                {loShuMap.flat().map((num, index) => {
                    const row = Math.floor(index / 3);
                    const col = index % 3;
                    const cellContent = grid[row][col];
                    return (
                        <div key={index} className="flex items-center justify-center text-3xl font-bold bg-black/20 rounded-lg">
                            {cellContent || <span className="opacity-20">{loShuMap[row][col]}</span>}
                        </div>
                    );
                })}
            </div>
            <div className="absolute inset-0 p-4 pt-12 z-0">
                <div className="relative w-full h-full">
                    {arrows.map((arrow, index) => {
                        const pathKey = arrow.numbers.join('-');
                        const path = ARROW_PATHS[pathKey];
                        if (!path) return null;
                        return <PulsatingArrow key={index} path={path} delay={index * 0.5} />;
                    })}
                </div>
            </div>
        </div>
    );
}
