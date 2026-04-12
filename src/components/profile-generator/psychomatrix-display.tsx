'use client';

/**
 * MYSTIQUE COMPASS — Alexandrov Psychomatrix / Pythagorean Square
 * Premium display component mirroring Lo Shu Grid architecture.
 */

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Flame, Zap, Shield, Eye, Hammer, Star, Heart, Cpu,
  ChevronDown, ChevronUp, Info, ArrowRight, Sparkles, GitBranch
} from 'lucide-react';
import {
  calculatePsychomatrix,
  PSYCHOMATRIX_CELL_MEANINGS,
  PSYCHOMATRIX_LINE_MEANINGS,
  SCALE_LABELS,
  SCALE_COLORS,
  type PsychomatrixResult,
  type CellReading,
  type ComplementaryInsight,
  type PsychomatrixCellMeaning,
} from '@/lib/numerology/data/psychomatrixData';

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

const SCALE_GLYPH: Record<PsychomatrixCellMeaning['scale'], string> = {
  'absent':    '◌',
  'very-weak': '○',
  'norm':      '◉',
  'special':   '✦',
  'strong':    '◆',
  'dominant':  '★',
  'overload':  '⚠',
};

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface PsychomatrixDisplayProps {
  day: number;
  month: number;
  year: number;
  name?: string;
}

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

function ScalePill({ scale }: { scale: PsychomatrixCellMeaning['scale'] }) {
  const color = SCALE_COLORS[scale];
  return (
    <span
      className="inline-flex items-center gap-1 text-[0.6rem] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-sm border"
      style={{ color, borderColor: `${color}44`, background: `${color}11` }}
    >
      <span>{SCALE_GLYPH[scale]}</span>
      {SCALE_LABELS[scale]}
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
        ${isSelected
          ? 'border-amber-500/60 bg-amber-900/20 shadow-[0_0_18px_rgba(196,154,40,0.15)]'
          : isEmpty
            ? 'border-stone-700/30 bg-stone-900/20 hover:border-stone-600/40'
            : 'border-stone-600/40 bg-stone-900/30 hover:border-amber-700/40'
        }
      `}
      style={isSelected ? { boxShadow: `0 0 16px ${scaleColor}22` } : {}}
    >
      <span className="absolute top-1 left-1 w-1 h-1 rotate-45 opacity-30"
        style={{ background: scaleColor }} />
      <span className="absolute bottom-1 right-1 w-1 h-1 rotate-45 opacity-30"
        style={{ background: scaleColor }} />

      <div className="flex items-center gap-1 self-start">
        <span className="text-[0.55rem] opacity-40" style={{ color: scaleColor }}>
          {DIGIT_ICONS[digit]}
        </span>
        <span className="font-cinzel text-[0.6rem] opacity-50 tracking-widest"
          style={{ color: scaleColor }}>
          {digit}
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {isEmpty ? (
          <span className="font-cinzel text-[1.4rem] text-stone-700/40">—</span>
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
            {reading.count > 6 && (
              <span className="text-[0.6rem] self-end mb-0.5" style={{ color: scaleColor }}>
                +{reading.count - 6}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="self-end text-right w-full">
        <p className="font-cinzel text-[0.48rem] uppercase tracking-wider opacity-40 leading-tight">
          {PSYCHOMATRIX_CELL_MEANINGS[digit]?.cellName.split('/')[0].trim()}
        </p>
      </div>

      {isSelected && (
        <motion.span
          layoutId="cell-selector"
          className="absolute inset-0 rounded-sm pointer-events-none"
          style={{ border: `1px solid ${scaleColor}`, opacity: 0.4 }}
        />
      )}
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CELL DETAIL PANEL
// ─────────────────────────────────────────────────────────────────────────────

function CellDetailPanel({ reading }: { reading: CellReading }) {
  const [showFull, setShowFull] = React.useState(false);
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
            <span className="text-[0.6rem] text-stone-500 uppercase tracking-widest">
              {reading.count === 0 ? 'Absent' : `${reading.count} ${reading.count === 1 ? 'instance' : 'instances'}`}
            </span>
          </div>
        </div>
        <div
          className="font-cinzel text-3xl font-bold opacity-15 shrink-0"
          style={{ color: scaleColor }}
        >
          {reading.digit}
        </div>
      </div>

      <div className="text-[0.7rem] text-stone-400/80 leading-relaxed border-l-2 border-amber-700/30 pl-3 italic">
        {cellDef.intro}
      </div>

      <div className="text-[0.65rem] text-stone-500 leading-relaxed">
        <span className="text-amber-600/70 uppercase tracking-widest font-semibold not-italic">Lines: </span>
        {cellDef.lineContext}
      </div>

      <div
        className="border rounded-sm p-3 space-y-2"
        style={{ borderColor: `${scaleColor}33`, background: `${scaleColor}08` }}
      >
        <div className="flex items-center gap-2">
          <span className="font-cinzel text-xs font-bold" style={{ color: scaleColor }}>
            {SCALE_GLYPH[reading.scale]} {reading.label}
          </span>
        </div>

        <p className="text-[0.72rem] text-stone-300 leading-relaxed">
          {showFull
            ? reading.verbatim
            : reading.verbatim.slice(0, 320) + (reading.verbatim.length > 320 ? '…' : '')}
        </p>

        {reading.verbatim.length > 320 && (
          <button
            onClick={() => setShowFull(f => !f)}
            className="flex items-center gap-1 text-[0.62rem] uppercase tracking-widest"
            style={{ color: scaleColor }}
          >
            {showFull ? <><ChevronUp className="w-3 h-3" /> Show less</> : <><ChevronDown className="w-3 h-3" /> Read full interpretation</>}
          </button>
        )}
      </div>

      {reading.modifiers.length > 0 && (
        <div className="space-y-2">
          <p className="font-cinzel text-[0.6rem] uppercase tracking-widest text-amber-600/60">
            ✦ Cross-Digit Interactions
          </p>
          {reading.modifiers.map((mod, i) => (
            <div key={i} className="flex gap-2 text-[0.68rem] text-amber-400/70 leading-relaxed border-l border-amber-700/30 pl-2">
              <ArrowRight className="w-3 h-3 mt-0.5 shrink-0 text-amber-600/50" />
              <span>{mod}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-1">
        <p className="font-cinzel text-[0.6rem] uppercase tracking-widest text-stone-600">
          ◈ All Expression Levels
        </p>
        <div className="grid grid-cols-1 gap-1">
          {allLevels.map(lvl => {
            const isActive = lvl.count === Math.min(reading.count, 6);
            const lvlColor = SCALE_COLORS[lvl.scale];
            return (
              <div
                key={lvl.count}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-sm border text-[0.62rem] transition-all duration-200 ${
                  isActive ? 'opacity-100' : 'opacity-30'
                }`}
                style={isActive
                  ? { borderColor: `${lvlColor}44`, background: `${lvlColor}11`, color: lvlColor }
                  : { borderColor: 'transparent' }
                }
              >
                <span className="w-4 text-center font-mono font-bold">
                  {lvl.count === 0 ? '—' : lvl.count}
                </span>
                <span className="shrink-0">{SCALE_GLYPH[lvl.scale]}</span>
                <span className={isActive ? 'font-semibold' : 'text-stone-600'}>
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
      {PSYCHOMATRIX_LINE_MEANINGS.map(line => {
        const total = lineTotal(line.digits);
        const isActive = result.activeLines.includes(line.id);
        const isOpen = expanded === line.id;

        return (
          <div key={line.id}
            className={`border rounded-sm overflow-hidden transition-all duration-200 ${
              isActive
                ? 'border-amber-600/40 bg-amber-900/10'
                : 'border-stone-700/30 bg-stone-900/10'
            }`}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : line.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left"
            >
              <div className="flex items-center gap-3">
                <span className={`text-[0.52rem] uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${
                  line.type === 'row' ? 'bg-blue-900/30 text-blue-400/70' :
                  line.type === 'column' ? 'bg-emerald-900/30 text-emerald-400/70' :
                  'bg-violet-900/30 text-violet-400/70'
                }`}>
                  {line.type}
                </span>
                <div className="flex gap-1">
                  {line.digits.map(d => (
                    <span key={d}
                      className={`font-cinzel text-[0.6rem] px-1 rounded-sm ${
                        (result.counts[d] || 0) > 0
                          ? 'bg-amber-900/30 text-amber-400'
                          : 'bg-stone-800/40 text-stone-600'
                      }`}
                    >
                      {d}
                    </span>
                  ))}
                </div>
                <span className="font-cinzel text-[0.65rem] text-stone-300 tracking-wider">
                  {line.name}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex gap-0.5">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i < total
                          ? isActive ? 'bg-amber-500' : 'bg-amber-700/50'
                          : 'bg-stone-700/30'
                      }`}
                    />
                  ))}
                </div>
                {isOpen ? <ChevronUp className="w-3 h-3 text-stone-500" /> : <ChevronDown className="w-3 h-3 text-stone-500" />}
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
                  <div className="px-3 pb-3 pt-0 space-y-2 border-t border-stone-700/20">
                    <p className="text-[0.65rem] text-amber-400/70 font-semibold tracking-wider pt-2">
                      {line.quality}
                    </p>
                    <p className="text-[0.7rem] text-stone-400 leading-relaxed">
                      {line.description}
                    </p>
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
      <p className="text-[0.68rem] text-stone-600 italic text-center py-4">
        No inter-digit synergies detected for this configuration.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {insights.map((insight, i) => {
        const color = SYNERGY_COLORS[insight.type];
        const isOpen = expanded === i;
        return (
          <div key={i}
            className="border rounded-sm overflow-hidden"
            style={{ borderColor: `${color}33`, background: `${color}06` }}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-[0.52rem] uppercase tracking-widest px-1.5 py-0.5 rounded-sm font-semibold"
                  style={{ color, background: `${color}18` }}>
                  {insight.type}
                </span>
                <div className="flex gap-1">
                  {insight.digits.map((d, di) => (
                    <span key={di} className="font-cinzel text-[0.62rem] font-bold" style={{ color }}>
                      {d}
                    </span>
                  ))}
                </div>
                <span className="font-cinzel text-[0.65rem] text-stone-300">
                  {insight.title}
                </span>
              </div>
              {isOpen
                ? <ChevronUp className="w-3 h-3 text-stone-500 shrink-0" />
                : <ChevronDown className="w-3 h-3 text-stone-500 shrink-0" />
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
                  <div className="px-3 pb-3 pt-0 border-t border-stone-700/20">
                    <p className="text-[0.7rem] text-stone-300 leading-relaxed pt-2">
                      {insight.insight}
                    </p>
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
    <div className="grid grid-cols-2 gap-3">
      {nums.map(({ n, title, role, desc }) => (
        <div key={title}
          className="border border-stone-700/30 bg-stone-900/20 rounded-sm p-3 space-y-1.5"
        >
          <div className="flex items-end gap-2">
            <span className="font-cinzel text-2xl font-bold text-amber-500/80 leading-none">
              {n}
            </span>
            <span className="text-[0.52rem] uppercase tracking-widest text-amber-600/50 pb-0.5">
              {title}
            </span>
          </div>
          <p className="font-cinzel text-[0.62rem] text-amber-400/60 uppercase tracking-wide">
            {role}
          </p>
          <p className="text-[0.67rem] text-stone-400 leading-relaxed">
            {desc}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const TABS = ['Matrix', 'Detail', 'Lines', 'Synergies', 'Origins'] as const;
type Tab = typeof TABS[number];

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
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <div className="flex items-center justify-center gap-3">
          <Diamond />
          <h2 className="font-cinzel text-[0.75rem] uppercase tracking-[0.35em] text-amber-500/70">
            Alexandrov&apos;s Psychomatrix
          </h2>
          <Diamond />
        </div>
        <p className="font-cinzel text-[0.58rem] uppercase tracking-[0.25em] text-stone-600">
          Pythagorean Square · Digital Analysis
        </p>
        {name && <p className="text-stone-500 text-[0.7rem] italic">for {name}</p>}
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {[
          { label: 'I', val: result.first,  sub: 'Develop' },
          { label: 'II', val: result.second, sub: 'Purpose' },
          { label: 'III', val: result.third,  sub: 'Origin I' },
          { label: 'IV', val: result.fourth, sub: 'Origin II' },
        ].map(({ label, val, sub }) => (
          <div key={label}
            className="border border-stone-700/30 rounded-sm bg-stone-900/30 py-2 text-center space-y-0.5"
          >
            <p className="font-cinzel text-[0.5rem] uppercase tracking-widest text-stone-600">{label}</p>
            <p className="font-cinzel text-lg font-bold text-amber-500/70 leading-none">{val}</p>
            <p className="font-cinzel text-[0.48rem] uppercase tracking-wide text-stone-600">{sub}</p>
          </div>
        ))}
      </div>

      <div className="flex border-b border-stone-700/30 overflow-x-auto scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              flex-1 min-w-0 px-2 py-2 font-cinzel text-[0.58rem] uppercase tracking-widest
              border-b-2 transition-all duration-200 whitespace-nowrap
              ${activeTab === tab
                ? 'border-amber-500/60 text-amber-400'
                : 'border-transparent text-stone-600 hover:text-stone-400'
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
          className="min-h-[200px]"
        >
          {activeTab === 'Matrix' && (
            <div className="space-y-5">
              <div
                className="relative border border-stone-700/30 rounded-sm p-1.5"
                style={{ background: 'linear-gradient(135deg, rgba(10,8,6,0.8) 0%, rgba(20,15,8,0.9) 100%)' }}
              >
                <div className="border border-stone-700/20 rounded-sm p-1.5">
                  <div className="grid grid-cols-3 gap-1.5">
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
                <div className="mt-2 flex items-center justify-between px-1">
                  <div className="flex gap-3 flex-wrap">
                    {result.activeLines.map(lineId => {
                      const line = PSYCHOMATRIX_LINE_MEANINGS.find(l => l.id === lineId);
                      if (!line) return null;
                      const typeColor = line.type === 'row' ? '#60a5fa' : line.type === 'column' ? '#34d399' : '#a78bfa';
                      return (
                        <span key={lineId}
                          className="text-[0.55rem] uppercase tracking-wider font-semibold"
                          style={{ color: typeColor }}
                        >
                          ✦ {line.quality.split('&')[0].trim()}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <p className="text-center text-[0.62rem] text-stone-600 uppercase tracking-widest">
                ↑ Tap a cell to reveal its full interpretation
              </p>
              {result.complementaryInsights.length > 0 && (
                <div className="flex items-center gap-2 border border-amber-700/20 bg-amber-900/10 rounded-sm px-3 py-2">
                  <Sparkles className="w-3 h-3 text-amber-500/60 shrink-0" />
                  <p className="text-[0.65rem] text-amber-400/70">
                    <strong>{result.complementaryInsights.length}</strong> inter-digit synerg{result.complementaryInsights.length === 1 ? 'y' : 'ies'} detected.
                    {' '}<button onClick={() => setActiveTab('Synergies')} className="underline underline-offset-2 hover:text-amber-300 transition-colors">View all →</button>
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Detail' && (
            <div className="space-y-4">
              <div className="flex gap-1.5 flex-wrap">
                {Array.from({ length: 9 }, (_, i) => i + 1).map(d => {
                  const r = result.cellReadings.find(cr => cr.digit === d)!;
                  const color = SCALE_COLORS[r.scale];
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDigit(d)}
                      className="flex flex-col items-center gap-0.5 px-2 py-1.5 border rounded-sm transition-all duration-200 min-w-[38px]"
                      style={selectedDigit === d
                        ? { borderColor: `${color}66`, background: `${color}15`, color }
                        : { borderColor: 'rgba(68,68,68,0.3)', color: '#555' }
                      }
                    >
                      <span className="font-cinzel text-sm font-bold">{d}</span>
                      <span className="text-[0.48rem]">{SCALE_GLYPH[r.scale]}</span>
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
            <div className="space-y-4">
              <SectionHeader icon={<GitBranch className="w-3 h-3" />} title="Rows · Columns · Diagonals" />
              <LinesPanel result={result} />
            </div>
          )}

          {activeTab === 'Synergies' && (
            <div className="space-y-4">
              <SectionHeader icon={<Sparkles className="w-3 h-3" />} title="Cross-Digit Interactions" />
              <SynergiesPanel insights={result.complementaryInsights} />
            </div>
          )}

          {activeTab === 'Origins' && (
            <div className="space-y-5">
              <SectionHeader icon={<Info className="w-3 h-3" />} title="The Four Working Numbers" />
              <WorkingNumbersPanel result={result} />
              <div className="border border-stone-700/20 rounded-sm p-3 bg-stone-900/20 space-y-2">
                <p className="font-cinzel text-[0.6rem] uppercase tracking-widest text-stone-500">◈ Calculation Log</p>
                <div className="space-y-1 font-mono text-[0.65rem] text-stone-400">
                  <p><span className="text-stone-600">Birth date digits: </span>{`${day}`.split('').join('+')}+{`${month}`.split('').join('+')}+{`${year}`.split('').join('+')} = <span className="text-amber-400">{result.first}</span> <span className="text-stone-600 ml-2">(I)</span></p>
                  <p><span className="text-stone-600">Sum of {result.first}: </span>{String(result.first).split('').join('+')} = <span className="text-amber-400">{result.second}</span> <span className="text-stone-600 ml-2">(II)</span></p>
                  <p><span className="text-stone-600">{result.first} − 2×{String(day)[0]}: </span>{result.first} − {2 * Number(String(day)[0])} = <span className="text-amber-400">{result.third}</span> <span className="text-stone-600 ml-2">(III)</span></p>
                  <p><span className="text-stone-600">Sum of {result.third}: </span>{String(result.third).split('').join('+')} = <span className="text-amber-400">{result.fourth}</span> <span className="text-stone-600 ml-2">(IV)</span></p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="text-center pt-2 border-t border-stone-800/50">
        <p className="text-[0.55rem] uppercase tracking-[0.3em] text-stone-700">
          Based on the verbatim teachings of Professor A. Alexandrov
        </p>
      </div>
    </div>
  );
}
