// src/components/lo-shu-grid.tsx
import * as React from 'react';
import type { ArrowData } from '@/lib/numerology';

interface LoShuGridProps {
    grid: (string | null)[][];
    arrows: ArrowData[];
}

const ARROW_PATHS: { [key: string]: string } = {
  // Horizontal
  '4-9-2': 'M16.67 16.67 L83.33 16.67',
  '3-5-7': 'M16.67 50 L83.33 50',
  '8-1-6': 'M16.67 83.33 L83.33 83.33',
  // Vertical
  '4-3-8': 'M16.67 16.67 L16.67 83.33',
  '9-5-1': 'M50 16.67 L50 83.33',
  '2-7-6': 'M83.33 16.67 L83.33 83.33',
  // Diagonal
  '4-5-6': 'M16.67 16.67 L83.33 83.33',
  '2-5-8': 'M83.33 16.67 L16.67 83.33',
};


const PulsatingArrow = ({ arrow, delay }: { arrow: ArrowData; delay: number }) => {
    // Create a reliable, sorted key from the arrow's numbers to look up the path.
    const sortedKey = [...arrow.numbers].sort((a, b) => a - b).join('-');
    
    // Find the correct path regardless of the original number order for vertical/horizontal arrows
    const pathKey = Object.keys(ARROW_PATHS).find(key => {
        const keyNumbers = new Set(key.split('-').map(Number));
        return arrow.numbers.every(num => keyNumbers.has(num)) && arrow.numbers.length === keyNumbers.size;
    });

    if (!pathKey) return null;
    const path = ARROW_PATHS[pathKey];

    // Generate a guaranteed unique ID for every arrow to prevent SVG conflicts.
    const uniqueId = `${arrow.name.replace(/\s+/g, '-')}-${delay}`;
    const gradientId = `gradient-${uniqueId}`;
    const arrowheadId = `arrowhead-${uniqueId}`;

    const isStrength = true; // For now, all displayed arrows are strengths. Logic can be added for weaknesses.
    const fromColor = isStrength ? 'hsl(var(--color-primary-hsl))' : 'hsl(var(--color-destructive) / 0.7)';
    const toColor = isStrength ? 'hsl(var(--color-secondary-hsl))' : 'hsl(var(--color-tertiary-hsl) / 0.7)';

    return (
        <React.Fragment>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(45)">
                    <stop offset="0%" stopColor={fromColor} />
                    <stop offset="100%" stopColor={toColor} />
                </linearGradient>
                <marker
                    id={arrowheadId}
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerUnits="strokeWidth"
                    markerWidth="8"
                    markerHeight="8"
                    orient="auto-start-reverse"
                >
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={`url(#${gradientId})`} />
                </marker>
            </defs>
            <path
                d={path}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="2"
                strokeLinecap="round"
                markerEnd={`url(#${arrowheadId})`}
                style={{
                    filter: `drop-shadow(0 0 3px ${fromColor})`,
                    strokeDasharray: 450,
                    strokeDashoffset: 450,
                    animation: `arrow-flow 2s ease-out forwards ${delay}s, arrow-pulse 4s linear infinite ${delay + 2}s`,
                }}
            />
        </React.Fragment>
    );
};


export function LoShuGrid({ grid, arrows }: LoShuGridProps) {
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
                    const cellContent = grid[row] && grid[row][col];
                    return (
                        <div key={index} className="flex items-center justify-center text-2xl font-bold bg-black/20 rounded-lg h-full p-1 aspect-square">
                            <span className="truncate">
                                {cellContent || <span className="opacity-20">{loShuMap[row][col]}</span>}
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="absolute inset-0 p-0 z-0">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {arrows.map((arrow, index) => (
                        <PulsatingArrow key={`${arrow.name}-${index}`} arrow={arrow} delay={index * 0.5} />
                    ))}
                </svg>
            </div>
        </div>
    );
}
