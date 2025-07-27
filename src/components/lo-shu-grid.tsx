// src/components/lo-shu-grid.tsx
'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import type { ArrowData } from '@/lib/numerology';

const ARROW_PATHS: { [key: string]: string } = {
    // Rows
    "2-4-9": "M50 50 L150 50 L250 50",
    "3-5-7": "M50 150 L150 150 L250 150",
    "1-6-8": "M50 250 L150 250 L250 250",
    // Columns
    "3-4-8": "M50 50 L50 150 L50 250",
    "1-5-9": "M150 50 L150 150 L150 250",
    "2-6-7": "M250 50 L250 150 L250 250",
    // Diagonals
    "2-5-8": "M50 250 L150 150 L250 50",
    "4-5-6": "M50 50 L150 150 L250 250",
};

const PulsatingArrow = ({ path, delay, id }: { path: string, delay: number, id: string }) => {
    return (
        <svg className="absolute top-0 left-0 w-full h-full overflow-visible" viewBox="0 0 300 300">
             <defs>
                <marker id={`arrowhead-${id}`} markerWidth="10" markerHeight="7" 
                refX="0" refY="3.5" orient="auto" markerUnits="strokeWidth">
                    <polygon points="0 0, 10 3.5, 0 7" fill={`url(#gradient-${id})`} />
                </marker>
                <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(45)">
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
                markerEnd={`url(#arrowhead-${id})`}
                style={{
                    filter: 'drop-shadow(0 0 3px hsl(var(--color-primary-hsl)))',
                    strokeDasharray: 450,
                    strokeDashoffset: 450,
                    animation: `arrow-flow 2s ease-out forwards ${delay}s, arrow-pulse 4s linear infinite ${delay + 2}s`
                }}
            />
        </svg>
    );
};


export function LoShuGrid({ grid, arrows }: { grid: (string | null)[][], arrows: ArrowData[] }) {
    
    const loShuMap = [
        ['4', '9', '2'],
        ['3', '5', '7'],
        ['8', '1', '6']
    ];

    return (
        <div className="glass-card p-4 relative aspect-square">
            <h3 className="font-semibold text-lg text-primary mb-2">
                Lo Shu Grid
            </h3>
            <div className="grid grid-cols-3 gap-2 aspect-square relative z-10">
                {loShuMap.flat().map((num, index) => {
                    const row = Math.floor(index / 3);
                    const col = index % 3;
                    const cellContent = grid[row][col];
                    return (
                        <div key={index} className="flex items-center justify-center text-3xl font-bold bg-black/20 rounded-lg h-full">
                            {cellContent || <span className="opacity-20">{loShuMap[row][col]}</span>}
                        </div>
                    );
                })}
            </div>
            <div className="absolute inset-0 p-0 z-0">
                <div className="relative w-full h-full">
                    {arrows.map((arrow, index) => {
                        const sortedKey = [...arrow.numbers].sort((a,b) => a - b).join('-');
                        const pathKey = Object.keys(ARROW_PATHS).find(k => k === sortedKey);

                        if (!pathKey) return null;
                        
                        const path = ARROW_PATHS[pathKey];
                        const uniqueId = `${pathKey.replace(/[^a-zA-Z0-9]/g, '')}-${index}`;

                        return <PulsatingArrow key={uniqueId} id={uniqueId} path={path} delay={index * 0.5} />;
                    })}
                </div>
            </div>
        </div>
    );
}
