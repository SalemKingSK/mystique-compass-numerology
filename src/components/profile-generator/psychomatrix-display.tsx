'use client';

/**
 * MYSTIQUE COMPASS — Alexandrov Psychomatrix / Pythagorean Square
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Flame, Zap, Shield, Eye, Hammer, Star, Heart, Cpu,
  ChevronDown, ChevronUp, Info, Sparkles, GitBranch,
  AlertTriangle, Atom, Wand2
} from 'lucide-react';
import {
  calculatePsychomatrix,
  PSYCHOMATRIX_CELL_MEANINGS,
  SCALE_COLORS,
  type PsychomatrixResult,
  type CellReading,
  type ComplementaryInsight,
} from '@/lib/numerology/data/psychomatrixData';
import {
  PSYCHOMATRIX_LINE_INTERPRETATIONS,
  getLineLevel,
} from '@/lib/numerology/data/psychomatrixLineInterpretations';
import { AccordionContentWithPlayer } from './accordion-content-with-player';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DIGIT_ICONS: Record<number, React.ReactNode> = {
  1: <Flame  className="w-3 h-3" />,
  2: <Zap    className="w-3 h-3" />,
  3: <Brain  className="w-3 h-3" />,
  4: <Shield className="w-3 h-3" />,
  5: <Cpu    className="w-3 h-3" />,
  6: <Hammer className="w-3 h-3" />,
  7: <Star   className="w-3 h-3" />,
  8: <Heart  className="w-3 h-3" />,
  9: <Eye    className="w-3 h-3" />,
};

const SCALE_GLYPH: Record<string, string> = {
  'absent':    '◌',
  'very-weak': '○',
  'norm':      '◉',
  'special':   '✦',
  'strong':    '◆',
  'dominant':  '★',
  'overload':  '⚠',
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
      <h3 className="font-cinzel font-semibold text-[0.68rem] text-amber-500/80 flex items-center gap-2 uppercase tracking-[0.3em]">
        {icon} {title}
      </h3>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
    </div>
  );
}

function Diamond({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rotate-45 bg-amber-600/50 ${className}`}
      aria-hidden
    />
  );
}

function ScalePill({ scale }: { scale: string }) {
  const color = SCALE_COLORS[scale as keyof typeof SCALE_COLORS] || '#9ca3af';
  return (
    <span
      className="inline-flex items-center gap-1 text-[0.6rem] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-sm border"
      style={{ color, borderColor: `${color}44`, background: `${color}22` }}
    >
      <span>{SCALE_GLYPH[scale] || '●'}</span>
      {scale.replace('-', ' ')}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GRID CELL
// ─────────────────────────────────────────────────────────────────────────────

interface GridCellProps {
  digit: number;
  reading: CellReading;
  isSelected: boolean;
  onSelect: (digit: number) => void;
}

function GridCell({ digit, reading, isSelected, onSelect }: GridCellProps) {
  const scaleColor = SCALE_COLORS[reading.scale];
  const isEmpty = reading.count === 0;

  return (
    <motion.button
      onClick={() => onSelect(digit)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative aspect-square flex flex-col items-center justify-between p-2
        rounded-sm border transition-all duration-300 text-left w-full
        backdrop-blur-md
        ${isSelected
          ? 'border-amber-500/60 bg-amber-900/40 shadow-[0_0_18px_rgba(196,154,40,0.25)]'
          : isEmpty
            ? 'border-stone-700/30 bg-black/40 hover:border-stone-600/40'
            : 'border-stone-600/40 bg-black/40 hover:border-amber-700/40'
        }
      `}
      style={isSelected ? { boxShadow: `0 0 16px ${scaleColor}33` } : {}}
    >
      <span className="absolute top-1 left-1 w-1 h-1 rotate-45 opacity-30"
        style={{ background: scaleColor }} />
      <span className="absolute bottom-1 right-1 w-1 h-1 rotate-45 opacity-30"
        style={{ background: scaleColor }} />

      <div className="flex items-center gap-1 self-start">
        <span className="text-[0.55rem] opacity-60" style={{ color: scaleColor }}>
          {DIGIT_ICONS[digit]}
        </span>
        <span className="font-cinzel text-[0.6rem] opacity-70 tracking-widest"
          style={{ color: scaleColor }}>
          {digit}
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {isEmpty ? (
          <span className="font-cinzel text-[1.4rem] text-stone-700/60">—</span>
        ) : (
          <div className="flex flex-wrap justify-center gap-px max-w-[48px]">
            {Array.from({ length: Math.min(reading.count, 6) }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className="font-cinzel font-bold text-[1rem] leading-none"
                style={{ color: scaleColor }}
              >
                {digit}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      <div className="self-end text-right w-full">
        <p className="font-cinzel text-[0.48rem] uppercase tracking-wider opacity-60 leading-tight">
          {PSYCHOMATRIX_CELL_MEANINGS[digit]?.cellName.split('/')[0].trim()}
        </p>
      </div>

      {isSelected && (
        <motion.span
          layoutId="cell-selector"
          className="absolute inset-0 rounded-sm pointer-events-none"
          style={{ border: `1px solid ${scaleColor}`, opacity: 0.6 }}
        />
      )}
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CELL DETAIL PANEL
// ─────────────────────────────────────────────────────────────────────────────

function CellDetailPanel({ reading }: { reading: CellReading }) {
  const scaleColor = SCALE_COLORS[reading.scale];
  const cellDef = PSYCHOMATRIX_CELL_MEANINGS[reading.digit];
  const allLevels = cellDef?.meanings ?? [];

  return (
    <motion.div
      key={reading.digit}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ color: scaleColor }}>{DIGIT_ICONS[reading.digit]}</span>
            <h4 className="font-cinzel text-sm font-bold tracking-wider text-stone-200">
              Number {reading.digit} — {cellDef.cellName}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <ScalePill scale={reading.scale} />
            <span className="text-[0.6rem] text-stone-400 uppercase tracking-widest">
              {reading.count === 0 ? 'Absent' : `${reading.count} ${reading.count === 1 ? 'instance' : 'instances'}`}
            </span>
          </div>
        </div>
        <div
          className="font-cinzel text-3xl font-bold opacity-20 shrink-0"
          style={{ color: scaleColor }}
        >
          {reading.digit}
        </div>
      </div>

      <div className="border-l-2 border-amber-700/50 pl-3 bg-black/40 p-4 rounded-r-lg">
        <p className="text-[0.6rem] font-cinzel uppercase tracking-[0.2em] text-amber-500/60 mb-2">Introduction</p>
        <div className="text-[0.7rem] text-stone-300 leading-relaxed italic">
          <AccordionContentWithPlayer text={cellDef.intro} />
        </div>
      </div>

      <div
        className="border rounded-sm p-4 space-y-3 backdrop-blur-md"
        style={{ borderColor: `${scaleColor}44`, background: `${scaleColor}11` }}
      >
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-xs font-bold uppercase tracking-wider" style={{ color: scaleColor }}>
            {SCALE_GLYPH[reading.scale] || '●'} {reading.label} Activation
          </span>
        </div>

        <div className="text-[0.75rem] text-stone-200 leading-relaxed">
          <AccordionContentWithPlayer text={reading.verbatim} />
        </div>
      </div>

      <div className="space-y-2 pt-4">
        <p className="font-cinzel text-[0.6rem] uppercase tracking-widest text-stone-500">
          ◈ All Expression Levels
        </p>
        <div className="grid grid-cols-1 gap-1.5">
          {allLevels.map(lvl => {
            const isActive = lvl.count === Math.min(reading.count, 6);
            const lvlColor = SCALE_COLORS[lvl.scale];
            return (
              <div
                key={lvl.count}
                className={`flex items-center gap-3 px-3 py-2 rounded-sm border text-[0.62rem] transition-all duration-200 backdrop-blur-sm ${
                  isActive ? 'opacity-100' : 'opacity-25'
                }`}
                style={isActive
                  ? { borderColor: `${lvlColor}66`, background: `${lvlColor}22`, color: lvlColor }
                  : { borderColor: 'transparent', background: 'rgba(255,255,255,0.03)' }
                }
              >
                <span className="w-4 text-center font-mono font-bold text-sm">
                  {lvl.count === 0 ? '—' : lvl.count}
                </span>
                <span className="shrink-0">{SCALE_GLYPH[lvl.scale] || '●'}</span>
                <span className={isActive ? 'font-bold' : 'text-stone-500'}>
                  {lvl.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LINES PANEL
// ─────────────────────────────────────────────────────────────────────────────

function LinesPanel({ result }: { result: PsychomatrixResult }) {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const lineTotal = (digits: number[]) =>
    digits.reduce((s, d) => s + (result.counts[d] || 0), 0);

  return (
    <div className="space-y-2">
      {PSYCHOMATRIX_LINE_INTERPRETATIONS.map(line => {
        const total = lineTotal(line.digits);
        const level = getLineLevel(line.id, total);
        if (!level) return null;

        const isActive = total >= 3;
        const isOpen = expanded === line.id;
        const color = SCALE_COLORS[level.scale];

        return (
          <div key={line.id}
            className={`border rounded-sm overflow-hidden transition-all duration-200 backdrop-blur-md ${
              isActive
                ? 'border-amber-600/50 bg-amber-900/20'
                : 'border-stone-700/30 bg-black/40'
            }`}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : line.id)}
              className="w-full flex items-center justify-between px-3 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`text-[0.52rem] uppercase tracking-widest px-1.5 py-0.5 rounded-sm font-bold ${
                  line.type === 'row' ? 'bg-blue-900/40 text-blue-300' :
                  line.type === 'column' ? 'bg-emerald-900/40 text-emerald-300' :
                  'bg-violet-900/40 text-violet-300'
                }`}>
                  {line.type}
                </span>
                <div className="flex gap-1">
                  {line.digits.map(d => (
                    <span key={d}
                      className={`font-cinzel text-[0.65rem] px-1.5 rounded-sm font-bold ${
                        (result.counts[d] || 0) > 0
                          ? 'bg-amber-500/30 text-amber-300'
                          : 'bg-stone-800/60 text-stone-600'
                      }`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <span className="font-cinzel text-[0.7rem] text-stone-200 tracking-wider font-semibold">
                  {line.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex gap-0.5">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i < total
                          ? isActive ? 'bg-amber-400' : 'bg-amber-700/60'
                          : 'bg-stone-700/40'
                      }`}
                    />
                  ))}
                </div>
                {isOpen ? <ChevronUp className="w-3 h-3 text-stone-400" /> : <ChevronDown className="w-3 h-3 text-stone-400" />}
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-0 space-y-4 border-t border-stone-700/30">
                    <div className="pt-3">
                      <p className="text-[0.6rem] font-cinzel uppercase tracking-[0.2em] text-amber-500/60 mb-2">Alexandrov Definition</p>
                      <div className="text-[0.72rem] text-stone-400 leading-relaxed italic mb-4 bg-black/20 p-3 rounded-sm border-l border-amber-700/30">
                        <AccordionContentWithPlayer text={line.captionNote} />
                      </div>
                    </div>

                    {line.orthodox && (
                      <div className="p-4 rounded-sm border border-blue-500/20 bg-blue-900/5">
                        <p className="text-[0.6rem] font-cinzel font-bold tracking-widest uppercase text-blue-400 mb-2">Orthodox Interpretation</p>
                        <div className="text-[0.75rem] text-stone-200 leading-relaxed">
                          <AccordionContentWithPlayer text={line.orthodox} />
                        </div>
                      </div>
                    )}

                    {line.esoteric && (
                      <div className="p-4 rounded-sm border border-violet-500/30 bg-violet-900/10 backdrop-blur-md">
                        <div className="flex items-center gap-2 mb-2">
                          <Atom className="w-3 h-3 text-violet-400" />
                          <p className="text-[0.6rem] font-cinzel font-bold tracking-widest uppercase text-violet-400">Esoteric Depth</p>
                        </div>
                        <div className="text-[0.75rem] text-violet-100 leading-relaxed">
                          <AccordionContentWithPlayer text={line.esoteric} />
                        </div>
                      </div>
                    )}

                    <div className="p-4 rounded-sm border backdrop-blur-md" style={{ borderColor: `${color}44`, background: `${color}11` }}>
                      <p className="text-[0.65rem] font-bold tracking-widest uppercase mb-2" style={{ color }}>
                        {SCALE_GLYPH[level.scale] || '●'} {level.label} ({total} digits)
                      </p>
                      <div className="text-[0.75rem] text-stone-200 leading-relaxed">
                        <AccordionContentWithPlayer text={level.verbatim} />
                      </div>
                    </div>

                    {line.transmutation && total >= 4 && (
                      <div className="p-4 rounded-sm border border-amber-500/30 bg-amber-900/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Wand2 className="w-3 h-3 text-amber-400" />
                          <p className="text-[0.6rem] font-cinzel font-bold tracking-widest uppercase text-amber-400">Transmutation Logic</p>
                        </div>
                        <div className="text-[0.72rem] text-amber-100 leading-relaxed italic">
                          <AccordionContentWithPlayer text={line.transmutation} />
                        </div>
                      </div>
                    )}

                    {level.scale === 'overload' && (
                      <div className="p-4 rounded-sm border border-rose-500/30 bg-rose-950/20 flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div className="text-[0.7rem] text-rose-200 leading-relaxed">
                          <strong className="block uppercase tracking-widest mb-1 text-rose-400">Overload Warning</strong>
                          An overload of this quality triggers its inversion. The strength has become so dense that it collapses into its shadow form, sacrificing related qualities to feed the obsession.
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SYNERGIES PANEL
// ─────────────────────────────────────────────────────────────────────────────

const SYNERGY_COLORS: Record<ComplementaryInsight['type'], string> = {
  amplify:    '#34d399',
  tension:    '#f59e0b',
  transition: '#a78bfa',
  synergy:    '#60a5fa',
};

function SynergiesPanel({ insights }: { insights: ComplementaryInsight[] }) {
  const [expanded, setExpanded] = React.useState<number | null>(null);

  if (insights.length === 0) {
    return (
      <p className="text-[0.68rem] text-stone-500 italic text-center py-8">
        No inter-digit synergies detected for this configuration.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {insights.map((insight, i) => {
        const color = SYNERGY_COLORS[insight.type];
        const isOpen = expanded === i;
        return (
          <div key={i}
            className="border rounded-sm overflow-hidden backdrop-blur-md"
            style={{ borderColor: `${color}44`, background: `${color}11` }}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-3 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-[0.52rem] uppercase tracking-widest px-1.5 py-0.5 rounded-sm font-bold"
                  style={{ color, background: `${color}22` }}>
                  {insight.type}
                </span>
                <div className="flex gap-1">
                  {insight.digits.map((d, di) => (
                    <span key={di} className="font-cinzel text-[0.7rem] font-black" style={{ color }}>
                      {d}
                    </span>
                  ))}
                </div>
                <span className="font-cinzel text-[0.7rem] text-stone-100 font-bold tracking-wide">
                  {insight.title}
                </span>
              </div>
              {isOpen
                ? <ChevronUp className="w-3 h-3 text-stone-400 shrink-0" />
                : <ChevronDown className="w-3 h-3 text-stone-400 shrink-0" />
              }
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-0 border-t border-stone-700/20">
                    <div className="text-[0.72rem] text-stone-200 leading-relaxed pt-3">
                      <AccordionContentWithPlayer text={insight.insight} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKING NUMBERS PANEL
// ─────────────────────────────────────────────────────────────────────────────

function WorkingNumbersPanel({ result }: { result: PsychomatrixResult }) {
  const nums = [
    {
      n: result.first,
      title: 'First Working Number',
      role: 'Qualities to Develop',
      desc: 'Shows which qualities a person needs to strengthen and develop to achieve the goal set before them.'
    },
    {
      n: result.second,
      title: 'Second Working Number',
      role: 'Leading Quality & Purpose',
      desc: 'Shows the leading quality of a person and the main purpose of their appearance in this world.'
    },
    {
      n: result.third,
      title: 'Third Working Number',
      role: 'Qualities from Birth (I)',
      desc: 'Reflects the inherited energetic and karmic blueprint from the parental line.'
    },
    {
      n: result.fourth,
      title: 'Fourth Working Number',
      role: 'Qualities from Birth (II)',
      desc: 'The sum of digits of the Third Number. Answers for the karmic gift of origin.'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {nums.map(({ n, title, role, desc }) => (
        <div key={title}
          className="border border-stone-700/30 bg-black/40 backdrop-blur-md rounded-sm p-4 space-y-2"
        >
          <div className="flex items-end gap-3">
            <span className="font-cinzel text-3xl font-black text-amber-400 leading-none">
              {n}
            </span>
            <span className="text-[0.52rem] uppercase tracking-widest text-amber-600/70 pb-1 font-bold">
              {title}
            </span>
          </div>
          <p className="font-cinzel text-[0.65rem] text-amber-500 font-bold uppercase tracking-widest">
            {role}
          </p>
          <div className="text-[0.7rem] text-stone-300 leading-relaxed">
            <AccordionContentWithPlayer text={desc} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const TABS = ['Matrix', 'Detail', 'Lines', 'Synthesis', 'Origins'] as const;
type Tab = typeof TABS[number];

interface PsychomatrixDisplayProps {
  day: number;
  month: number;
  year: number;
  name?: string;
}

export function PsychomatrixDisplay({ day, month, year, name }: PsychomatrixDisplayProps) {
  const result = React.useMemo(() =>
    calculatePsychomatrix(day, month, year),
    [day, month, year]
  );

  const [selectedDigit, setSelectedDigit] = React.useState<number>(1);
  const [activeTab, setActiveTab] = React.useState<Tab>('Matrix');

  const selectedReading = result.cellReadings.find(r => r.digit === selectedDigit)!;

  const gridRows = [
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-3">
          <Diamond />
          <h2 className="font-cinzel text-[0.75rem] uppercase tracking-[0.35em] text-amber-500 font-bold">
            Alexandrov&apos;s Psychomatrix
          </h2>
          <Diamond />
        </div>
        <p className="font-cinzel text-[0.58rem] uppercase tracking-[0.25em] text-stone-500 font-medium">
          Pythagorean Square · Digital Analysis
        </p>
        {name && <p className="text-stone-400 text-[0.75rem] italic font-body">for {name}</p>}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: 'I', val: result.first,  sub: 'Develop' },
          { label: 'II', val: result.second, sub: 'Purpose' },
          { label: 'III', val: result.third,  sub: 'Origin I' },
          { label: 'IV', val: result.fourth, sub: 'Origin II' },
        ].map(({ label, val, sub }) => (
          <div key={label}
            className="border border-stone-700/40 rounded-sm bg-black/40 backdrop-blur-md py-3 text-center space-y-1"
          >
            <p className="font-cinzel text-[0.55rem] uppercase tracking-widest text-stone-500 font-bold">{label}</p>
            <p className="font-cinzel text-xl font-black text-amber-400 leading-none">{val}</p>
            <p className="font-cinzel text-[0.5rem] uppercase tracking-wide text-stone-600 font-bold">{sub}</p>
          </div>
        ))}
      </div>

      <div className="flex border-b border-stone-700/30 overflow-x-auto scrollbar-hide bg-black/20 rounded-t-lg gap-2 px-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 min-w-0 px-1 py-3 font-cinzel text-[0.52rem] uppercase tracking-wider
              border-b-2 transition-all duration-300 whitespace-nowrap font-bold
              ${activeTab === tab
                ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-stone-500 hover:text-stone-300 hover:bg-white/5'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="min-h-[300px]"
        >
          {activeTab === 'Matrix' && (
            <div className="space-y-6">
              <div
                className="relative border border-stone-700/40 rounded-sm p-2 backdrop-blur-xl"
                style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(20,15,8,0.7) 100%)' }}
              >
                <div className="border border-stone-700/20 rounded-sm p-2 bg-black/20">
                  <div className="grid grid-cols-3 gap-2">
                    {gridRows.map((row) =>
                      row.map(digit => (
                        <GridCell
                          key={digit}
                          digit={digit}
                          reading={result.cellReadings.find(r => r.digit === digit)!}
                          isSelected={selectedDigit === digit}
                          onSelect={d => { setSelectedDigit(d); setActiveTab('Detail'); }}
                        />
                      ))
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between px-2">
                  <div className="flex gap-3 flex-wrap">
                    {result.activeLines.map(lineId => {
                      const line = PSYCHOMATRIX_LINE_INTERPRETATIONS.find(l => l.id === lineId);
                      if (!line) return null;
                      const typeColor = line.type === 'row' ? '#60a5fa' : line.type === 'column' ? '#34d399' : '#a78bfa';
                      return (
                        <span key={lineId}
                          className="text-[0.58rem] uppercase tracking-widest font-black"
                          style={{ color: typeColor }}
                        >
                          ✦ {line.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <p className="text-center text-[0.65rem] text-stone-500 uppercase tracking-[0.2em] font-bold">
                ↑ Tap a cell to reveal its full interpretation
              </p>
              {result.complementaryInsights.length > 0 && (
                <div className="flex items-center gap-3 border border-amber-700/30 bg-amber-900/20 backdrop-blur-md rounded-sm px-4 py-3">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                  <p className="text-[0.7rem] text-stone-200">
                    <strong>{result.complementaryInsights.length}</strong> inter-digit synerg{result.complementaryInsights.length === 1 ? 'y' : 'ies'} detected.
                    {' '}<button onClick={() => setActiveTab('Synthesis')} className="text-amber-400 font-bold underline underline-offset-4 hover:text-amber-300 transition-colors ml-1">View all →</button>
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Detail' && (
            <div className="space-y-5">
              <div className="flex gap-2 flex-wrap justify-center bg-black/20 p-2 rounded-sm border border-white/5">
                {Array.from({ length: 9 }, (_, i) => i + 1).map(d => {
                  const r = result.cellReadings.find(cr => cr.digit === d)!;
                  const color = SCALE_COLORS[r.scale];
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDigit(d)}
                      className="flex flex-col items-center gap-1 px-2.5 py-2 border rounded-sm transition-all duration-300 min-w-[42px] backdrop-blur-sm"
                      style={selectedDigit === d
                        ? { borderColor: `${color}`, background: `${color}33`, color }
                        : { borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#777' }
                      }
                    >
                      <span className="font-cinzel text-sm font-black">{d}</span>
                      <span className="text-[0.5rem] font-bold">{SCALE_GLYPH[r.scale] || '●'}</span>
                    </button>
                  );
                })}
              </div>
              <AnimatePresence mode="wait">
                {selectedReading && <CellDetailPanel key={selectedDigit} reading={selectedReading} />}
              </AnimatePresence>
            </div>
          )}

          {activeTab === 'Lines' && (
            <div className="space-y-5">
              <SectionHeader icon={<GitBranch className="w-4 h-4" />} title="Rows · Columns · Diagonals" />
              <LinesPanel result={result} />
            </div>
          )}

          {activeTab === 'Synthesis' && (
            <div className="space-y-5">
              <SectionHeader icon={<Sparkles className="w-3 h-3" />} title="Cross-Digit Interactions" />
              <SynergiesPanel insights={result.complementaryInsights} />
            </div>
          )}

          {activeTab === 'Origins' && (
            <div className="space-y-6">
              <SectionHeader icon={<Info className="w-4 h-4" />} title="The Four Working Numbers" />
              <WorkingNumbersPanel result={result} />
              
              <div className="border border-stone-700/40 rounded-sm p-4 bg-black/40 backdrop-blur-md space-y-3">
                <p className="font-cinzel text-[0.65rem] uppercase tracking-widest text-stone-400 font-bold">◈ Calculation Log</p>
                <div className="space-y-2 font-mono text-[0.72rem] text-stone-200">
                  <p className="flex justify-between border-b border-white/5 pb-1"><span className="text-stone-500">Birth date digits: </span><span>{`${day}`.split('').join('+')}+{`${month}`.split('').join('+')}+{`${year}`.split('').join('+')} = <span className="text-amber-400 font-bold">{result.first}</span> <span className="text-stone-600 ml-2">(I)</span></span></p>
                  <p className="flex justify-between border-b border-white/5 pb-1"><span className="text-stone-500">Sum of (I): </span><span>{String(result.first).split('').join('+')} = <span className="text-amber-400 font-bold">{result.second}</span> <span className="text-stone-600 ml-2">(II)</span></span></p>
                  <p className="flex justify-between border-b border-white/5 pb-1"><span className="text-stone-500">(I) − 2×{String(day)[0]}: </span><span>{result.first} − {2 * Number(String(day)[0])} = <span className="text-amber-400 font-bold">{result.third}</span> <span className="text-stone-600 ml-2">(III)</span></span></p>
                  <p className="flex justify-between pb-1"><span className="text-stone-600">Sum of (III): </span><span>{String(result.third).split('').join('+')} = <span className="text-amber-400 font-bold">{result.fourth}</span> <span className="text-stone-600 ml-2">(IV)</span></span></p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="text-center pt-4 border-t border-stone-800/50">
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone-600 font-bold">
          Based on the verbatim teachings of Professor A. Alexandrov
        </p>
      </div>
    </div>
  );
}

export default PsychomatrixDisplay;
