"use client";

import React, { useState } from "react";
import { getArrowStatus } from "@/lib/arrow-analysis";
import {
  ALL_ARROW_DEFINITIONS,
  SHADOW_PRESENCE_INTRO,
  SHADOW_ABSENCE_INTRO,
} from "@/lib/arrow-definitions";
import { AccordionContentWithPlayer } from "./profile-generator/accordion-content-with-player";

const TYPE_META: Record<string, { icon: string; label: string; color: string }> = {
  horizontal: { icon: "↔", label: "Horizontal Plane",  color: "#3a8ee0" },
  vertical:   { icon: "↕", label: "Vertical Column",   color: "#4caf7d" },
  diagonal:   { icon: "⤢", label: "Diagonal Axis",     color: "#e0a83a" },
};

const STATE_META: Record<string, { icon: string; label: string; color: string; bg: string }> = {
  full:  { icon: "◉", label: "Arrow of Presence", color: "#9b8ec4", bg: "rgba(155,142,196,0.08)" },
  empty: { icon: "○", label: "Arrow of Absence",  color: "#e05c3a", bg: "rgba(224,92,58,0.08)"  },
};

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="arr-divider">
      <span className="arr-divider-label">{label}</span>
    </div>
  );
}

interface LoshuArrowDetailPanelProps {
  arrowId: string;
  existingMeaning: string;
  birthDate: string;
}

export default function LoshuArrowDetailPanel({
  arrowId,
  existingMeaning,
  birthDate,
}: LoshuArrowDetailPanelProps) {
  const [openLayer, setOpenLayer] = useState<2 | 3 | null>(null);

  const definition = ALL_ARROW_DEFINITIONS.find((a) => a.id === arrowId);
  if (!definition) return null;

  const status   = getArrowStatus(definition, birthDate);
  const typeMeta = TYPE_META[definition.type];
  const stateMeta = STATE_META[definition.state];
  const isPresence = definition.state === "full";
  const shadowIntro = isPresence ? SHADOW_PRESENCE_INTRO : SHADOW_ABSENCE_INTRO;

  function toggle(layer: 2 | 3) {
    setOpenLayer((p) => (p === layer ? null : layer));
  }

  return (
    <div className="arr-root">
      {/* LAYER 1: Existing Meaning */}
      <div className="arr-layer1">
        <AccordionContentWithPlayer text={existingMeaning} />
      </div>

      {/* LAYER 2: Arrow Anatomy */}
      <div className="arr-accordion">
        <button className="arr-acc-header" onClick={() => toggle(2)}>
          <div className="arr-acc-left">
            <span className="arr-layer-badge" style={{ background: "#3a8ee022", color: "#3a8ee0", borderColor: "#3a8ee055" }}>
              Layer 2
            </span>
            <span className="arr-acc-title">Arrow Anatomy</span>
          </div>
          <span className="arr-acc-arrow" style={{ transform: openLayer === 2 ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
        </button>

        {openLayer === 2 && (
          <div className="arr-acc-body">
            <div className="arr-state-pill" style={{ background: stateMeta.bg, borderColor: stateMeta.color + "44", color: stateMeta.color }}>
              <span>{stateMeta.icon}</span>
              <span>{stateMeta.label}</span>
            </div>

            <div className="arr-meta-row">
              <div className="arr-meta-box" style={{ borderColor: typeMeta.color + "44" }}>
                <span className="arr-meta-label">Type</span>
                <span className="arr-meta-icon" style={{ color: typeMeta.color }}>{typeMeta.icon}</span>
                <span className="arr-meta-value" style={{ color: typeMeta.color }}>{typeMeta.label}</span>
              </div>
              <div className="arr-meta-box" style={{ borderColor: "#4a3f6b" }}>
                <span className="arr-meta-label">Numbers</span>
                <div className="arr-number-pips">
                  {definition.numbers.map((n) => {
                    const present = status.presentNumbers.includes(n);
                    return (
                      <span key={n} className="arr-pip" style={{ background: present ? "#9b8ec422" : "transparent", borderColor: present ? "#9b8ec4" : "#3d3560", color: present ? "#c4b8e8" : "#4a3f6b" }}>
                        {n}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <SectionDivider label="Core Trait" />
            <div className="arr-core-card">
              <div className="arr-core-text">
                <AccordionContentWithPlayer text={definition.coreTrait} />
              </div>
            </div>

            <div className="arr-status-row" style={{ background: status.isActive ? stateMeta.bg : "rgba(255,255,255,0.02)", borderColor: status.isActive ? stateMeta.color + "44" : "#2a2340" }}>
              <span style={{ color: status.isActive ? stateMeta.color : "#665f7a" }}>
                {status.isActive ? "● Active in your chart" : "◌ Not active in your chart"}
              </span>
              {!status.isActive && definition.state === "full" && (
                <span className="arr-partial-note">{status.presentNumbers.length}/3 numbers present</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* LAYER 3: Shadow */}
      <div className="arr-accordion">
        <button className="arr-acc-header" onClick={() => toggle(3)}>
          <div className="arr-acc-left">
            <span className="arr-layer-badge" style={{ background: "rgba(224,92,58,0.12)", color: "#e05c3a", borderColor: "rgba(224,92,58,0.35)" }}>
              Layer 3
            </span>
            <span className="arr-acc-title">Shadow · {definition.shadowTitle}</span>
          </div>
          <span className="arr-acc-arrow" style={{ transform: openLayer === 3 ? "rotate(180deg)" : "rotate(0)" }}>▾</span>
        </button>

        {openLayer === 3 && (
          <div className="arr-acc-body">
            <div className="arr-shadow-intro-card">
              <span className="arr-shadow-intro-icon">{isPresence ? "🔥" : "🕳"}</span>
              <div className="arr-shadow-intro-text">
                <AccordionContentWithPlayer text={shadowIntro} />
              </div>
            </div>

            <SectionDivider label={isPresence ? "Shadow of Presence" : "Shadow of Absence"} />

            <div className="arr-shadow-main" style={{ borderLeftColor: "#e05c3a" }}>
              <p className="arr-shadow-headline" style={{ color: "#e05c3a" }}>{definition.name} — {definition.shadowTitle}</p>
              <div className="arr-shadow-body">
                <AccordionContentWithPlayer text={definition.shadowBody} />
              </div>
            </div>

            <SectionDivider label="Numbers Involved" />
            <div className="arr-drowned-row">
              {definition.numbers.map((n) => {
                const present = status.presentNumbers.includes(n);
                return (
                  <div key={n} className="arr-drowned-chip" style={{ background: present ? "rgba(155,142,196,0.08)" : "rgba(224,92,58,0.06)", borderColor: present ? "#4a3f6b" : "rgba(224,92,58,0.3)" }}>
                    <span className="arr-drowned-num" style={{ color: present ? "#c4b8e8" : "#e05c3a" }}>{n}</span>
                    <span className="arr-drowned-state">{present ? "present" : "absent"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .arr-root { display: flex; flex-direction: column; gap: 0; }
        .arr-layer1 { padding: 0 0 16px; }
        .arr-accordion { border-top: 1px solid #2a2340; }
        .arr-acc-header { width: 100%; background: transparent; border: none; padding: 14px 0; display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 10px; }
        .arr-acc-left { display: flex; align-items: center; gap: 10px; }
        .arr-acc-title { font-size: 13.5px; font-weight: 600; color: #c4b8e8; text-align: left; }
        .arr-acc-arrow { font-size: 18px; color: #7a6fa0; transition: transform 0.2s ease; line-height: 1; }
        .arr-acc-body { padding: 4px 0 18px; display: flex; flex-direction: column; gap: 12px; }
        .arr-layer-badge { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px; border: 1px solid; }
        .arr-divider { display: flex; align-items: center; gap: 8px; margin: 4px 0 2px; }
        .arr-divider::before, .arr-divider::after { content: ""; flex: 1; height: 1px; background: linear-gradient(to right, transparent, #3d3560, transparent); }
        .arr-divider-label { font-size: 10px; text-transform: uppercase; color: #7a6fa0; }
        .arr-state-pill { display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; border-radius: 20px; border: 1px solid; font-size: 12px; font-weight: 600; align-self: flex-start; }
        .arr-meta-row { display: flex; gap: 10px; }
        .arr-meta-box { flex: 1; background: rgba(255,255,255,0.02); border: 1px solid; border-radius: 10px; padding: 10px 12px; display: flex; flex-direction: column; gap: 4px; align-items: center; }
        .arr-meta-label { font-size: 10px; text-transform: uppercase; color: #7a6fa0; }
        .arr-meta-icon { font-size: 18px; }
        .arr-meta-value { font-size: 12px; font-weight: 600; }
        .arr-number-pips { display: flex; gap: 6px; }
        .arr-pip { width: 28px; height: 28px; border-radius: 8px; border: 1px solid; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; }
        .arr-core-card { background: rgba(255,255,255,0.02); border: 1px solid #2a2340; border-radius: 10px; padding: 12px 14px; }
        .arr-core-text { font-size: 14px; line-height: 1.65; color: #d8cff0; }
        .arr-status-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; border-radius: 8px; border: 1px solid; font-size: 12px; font-weight: 600; }
        .arr-partial-note { font-size: 11px; color: #7a6fa0; }
        .arr-shadow-intro-card { display: flex; gap: 12px; align-items: flex-start; background: rgba(224,92,58,0.04); border: 1px solid rgba(224,92,58,0.15); border-radius: 10px; padding: 12px 14px; }
        .arr-shadow-intro-icon { font-size: 20px; flex-shrink: 0; }
        .arr-shadow-intro-text { font-size: 13px; line-height: 1.65; color: #a89ec4; font-style: italic; }
        .arr-shadow-main { border-left: 3px solid; border-radius: 0 10px 10px 0; padding: 12px 14px; background: rgba(224,92,58,0.04); display: flex; flex-direction: column; gap: 10px; }
        .arr-shadow-headline { font-size: 12px; font-weight: 700; text-transform: uppercase; margin: 0; }
        .arr-shadow-body { font-size: 14px; line-height: 1.7; color: #d8cff0; }
        .arr-drowned-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .arr-drowned-chip { display: flex; flex-direction: column; align-items: center; border: 1px solid; border-radius: 10px; padding: 8px 16px; min-width: 60px; }
        .arr-drowned-num { font-size: 22px; font-weight: 700; }
        .arr-drowned-state { font-size: 10px; color: #7a6fa0; }
      `}</style>
    </div>
  );
}
