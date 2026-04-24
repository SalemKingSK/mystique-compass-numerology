'use server';
/**
 * MYSTIQUE COMPASS — Transition Advisory Service
 */

import type { DetectedTransition, MatrixState } from './engine';

const SECTION_DESCRIPTIONS: Record<number, string> = {
  1:'Will / Self-assertion / Ego / Personal power',
  2:'Biology / Sexuality / Environment / Physical sensitivity',
  3:'Interest / Habit / Curiosity / Addiction potential',
  4:'Health / Physical vitality / Stability / Discipline',
  5:'Logic / Intuition / Freedom / Spiritual sensing',
  6:'Physical work / Routine / Earthly skill / Self-destructive tendency',
  7:'Divine luck / Talent / Spiritual protection / Karmic gifts',
  8:'Duty / Tolerance / Obligation / Karmic debt to others',
  9:'Intellect / Wisdom / Memory / Philosophical capacity',
};

function buildMatrixNarrative(counts: Record<number, number>): string {
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => {
      const num = Number(k);
      const repeated = String(num).repeat(v);
      const meaning = SECTION_DESCRIPTIONS[num] || '';
      const overload = v >= 4 ? ' [OVERLOADED — shadow risk active]' : v >= 3 ? ' [STRONG — dominant force]' : '';
      return `  • ${repeated} (${v}× the number ${num}: ${meaning})${overload}`;
    })
    .join('\n');
}

function buildMissingNarrative(missing: number[]): string {
  if (missing.length === 0) return 'None — the subject has a complete psychomatrix.';
  return missing.map(n => `  • Missing ${n}: [${SECTION_DESCRIPTIONS[n]}] — this absence creates a karmic blind spot.`).join('\n');
}

function urgencyLabel(u: DetectedTransition['urgency']): string {
  return { critical: 'CRITICAL', high: 'HIGH PRIORITY', moderate: 'ACTIVE ADVISORY', latent: 'LATENT WATCH' }[u];
}

export async function generateTransitionAdvisory(
  transition: DetectedTransition,
  state: MatrixState
): Promise<string> {

  const matrixStr = buildMatrixNarrative(state.counts);
  const missingStr = buildMissingNarrative(transition.missingNumbers);
  const overloadStr = transition.overloadedNumbers.length > 0
    ? transition.overloadedNumbers.map(n => `${String(n).repeat(state.counts[n])} (${SECTION_DESCRIPTIONS[n]})`).join(', ')
    : 'None';
  const arrowStr = transition.arrowsActive.length > 0 ? transition.arrowsActive.join(', ') : 'None detected';

  const prompt = `
You are the world's foremost analyst of Alexandrov's Psychomatrix system. You are writing a comprehensive, exhaustive, and razor-tailored advisory for a specific numerological life transition.

ABSOLUTE RULES:
— Do NOT summarize. Do NOT be economical. Write as much as the subject requires.
— Every section must directly reference the subject's specific numbers.
— Maintain an uncompromising, analytical, and authoritative tone throughout.
— Begin immediately with Section 1.

SUBJECT'S COMPLETE PSYCHOMATRIX
Present Numbers:
${matrixStr}

Absent Numbers (Karmic Blind Spots):
${missingStr}

Overloaded Numbers (Shadow Risk Zones): ${overloadStr}
Active Matrix Arrows: ${arrowStr}
Personal Year: Year ${state.personalYear}

TRANSITION UNDER ANALYSIS
Transition: ${transition.name} — from ${transition.from} into ${transition.to}
Subtitle: ${transition.subtitle}
Direction: ${transition.direction.toUpperCase()}
Urgency Level: ${urgencyLabel(transition.urgency)}
Core Conflict: ${transition.coreConflict}

GENERATE THE ADVISORY IN EXACTLY THESE 7 SECTIONS:
### SECTION 1: THE ANATOMY OF THE TRANSITION
### SECTION 2: THE MECHANICS OF EXECUTION
### SECTION 3: ENVIRONMENTAL RESISTANCE & ACTIVE SABOTAGE
### SECTION 4: THE TIMING ORACLE — WHEN TO EXECUTE
### SECTION 5: ANCESTRAL & KARMIC WEIGHT
### SECTION 6: THE SHADOW STATES — WHAT FAILURE LOOKS LIKE
### SECTION 7: THE ULTIMATE SYNTHESIS — THE NEW HUMAN
`.trim();

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) throw new Error('GEMINI_API_KEY missing');

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 4000, temperature: 0.8 },
      }),
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No AI response');
    return text;
  } catch (e) {
    console.error('Advisory failed', e);
    return "Failed to generate advisory. Please check connection and try again.";
  }
}
