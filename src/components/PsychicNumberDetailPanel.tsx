"use client";

import React, { useState } from "react";
import { cheiroPsychicNumbers } from "@/lib/numerology/cheiro-psychic-numbers";
import { AccordionContentWithPlayer } from "./profile-generator/accordion-content-with-player";
import { BookText, Sparkles, Gem, Calendar } from "lucide-react";

interface PsychicNumberDetailPanelProps {
  number: number;
  johariMeaning: string;
}

export default function PsychicNumberDetailPanel({
  number,
  johariMeaning,
}: PsychicNumberDetailPanelProps) {
  const [openLayer, setOpenLayer] = useState<number | null>(null);

  const cheiroData = cheiroPsychicNumbers[number];
  if (!cheiroData) return <AccordionContentWithPlayer text={johariMeaning} />;

  const toggleLayer = (layer: number) => {
    setOpenLayer(openLayer === layer ? null : layer);
  };

  return (
    <div className="flex flex-col gap-0">
      {/* --- Chamber 1: Johari (Current) --- */}
      <div className="py-2 mb-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <BookText className="h-4 w-4 text-primary" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-primary/80">
            Layer 1: The Psychic Essence (Johari)
          </span>
        </div>
        <div className="text-sm leading-relaxed text-white/70">
           <AccordionContentWithPlayer text={johariMeaning} />
        </div>
      </div>

      {/* --- Chamber 2: Cheiro Character --- */}
      <div className="border-t border-white/10">
        <button
          className="w-full flex items-center justify-between py-4 group"
          onClick={() => toggleLayer(2)}
        >
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-cinzel">
              Layer 2
            </span>
            <span className="font-cinzel text-[13px] font-semibold text-amber-200 group-hover:text-amber-400 transition-colors">
              The Chronicler's View (Cheiro)
            </span>
          </div>
          <span className={`text-amber-500/40 transition-transform ${openLayer === 2 ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {openLayer === 2 && (
          <div className="pb-6 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="p-4 rounded-xl bg-amber-950/10 border-l-2 border-amber-500/40 text-sm leading-relaxed text-stone-300">
               <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-[10px] font-bold uppercase text-amber-400/80 tracking-tighter">Verbatim Character Analysis</span>
               </div>
               <AccordionContentWithPlayer text={cheiroData.description} />
             </div>
          </div>
        )}
      </div>

      {/* --- Chamber 3: Lucky Alignments --- */}
      <div className="border-t border-white/10">
        <button
          className="w-full flex items-center justify-between py-4 group"
          onClick={() => toggleLayer(3)}
        >
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-cinzel">
              Layer 3
            </span>
            <span className="font-cinzel text-[13px] font-semibold text-emerald-200 group-hover:text-emerald-400 transition-colors">
              Celestial Alignments
            </span>
          </div>
          <span className={`text-emerald-500/40 transition-transform ${openLayer === 3 ? 'rotate-180' : ''}`}>▾</span>
        </button>
        {openLayer === 3 && (
          <div className="pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="p-4 rounded-xl bg-emerald-950/10 border-l-2 border-emerald-500/40">
               <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase text-emerald-400/80 tracking-tighter">Lucky Days & Periods</span>
               </div>
               <div className="space-y-4 text-sm leading-relaxed text-stone-300">
                 <p className="font-bold text-emerald-200/90">{cheiroData.strongPeriods.join('; ')}</p>
                 <AccordionContentWithPlayer text={cheiroData.luckyDays.fullDescription} />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-purple-950/10 border border-purple-500/20">
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-[10px] font-bold uppercase text-purple-400 tracking-widest">Colors</span>
                   </div>
                   <p className="text-[11px] text-stone-400 italic">{cheiroData.luckyColors}</p>
                </div>
                <div className="p-4 rounded-xl bg-yellow-950/10 border border-yellow-500/20">
                   <div className="flex items-center gap-2 mb-2">
                      <Gem className="h-3.5 w-3.5 text-yellow-400" />
                      <span className="text-[10px] font-bold uppercase text-yellow-400 tracking-widest">Jewels</span>
                   </div>
                   <p className="text-[11px] text-stone-400 italic">{cheiroData.luckyJewels}</p>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
