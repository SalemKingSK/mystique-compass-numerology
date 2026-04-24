'use server';
/**
 * MYSTIQUE COMPASS — Transition Advisory Service
 * Redirects the high-depth prompt to the working Gemini AI service.
 */

import { generateTransitionAdvisoryAI } from '@/lib/ai-service';
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
  return missing.map(n => `  • Missing ${n}: [${SECTION_DESCRIPTIONS[n]}] — this absence creates a karmic blind spot and a structural weakness in the matrix.`).join('\n');
}

function urgencyLabel(u: DetectedTransition['urgency']): string {
  return { critical: 'CRITICAL — IMMEDIATE ACTION REQUIRED', high: 'HIGH PRIORITY', moderate: 'ACTIVE ADVISORY', latent: 'LATENT WATCH' }[u];
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
— Every section must directly reference the subject's specific numbers. Generic statements are forbidden.
— You must name specific numbers from the matrix and explain their precise role.
— Maintain an uncompromising, analytical, and authoritative tone throughout.
— Do not use introductory fluff. Do not write a preamble. Begin immediately with Section 1.

═══════════════════════════════════════════════════════
SUBJECT'S COMPLETE PSYCHOMATRIX
═══════════════════════════════════════════════════════
Present Numbers:
${matrixStr}

Absent Numbers (Karmic Blind Spots):
${missingStr}

Overloaded Numbers (Shadow Risk Zones): ${overloadStr}
Active Matrix Arrows: ${arrowStr}
Personal Year (Current Cycle): Year ${state.personalYear}
Gender: ${state.gender}

═══════════════════════════════════════════════════════
TRANSITION UNDER ANALYSIS
═══════════════════════════════════════════════════════
Transition: ${transition.name} — from ${transition.from} into ${transition.to}
Subtitle: ${transition.subtitle}
Direction: ${transition.direction.toUpperCase()}
Urgency Level: ${urgencyLabel(transition.urgency)}
Prerequisite Status: ${transition.prerequisitesMet}
Core Conflict: ${transition.coreConflict}
Current Year Warning: ${transition.warningActive ? `YES — Personal Year ${state.personalYear} AMPLIFIES the risk and pressure of this transition.` : `No — current year is neutral relative to this transition.`}

═══════════════════════════════════════════════════════
GENERATE THE ADVISORY IN EXACTLY THESE 7 SECTIONS
═══════════════════════════════════════════════════════

### SECTION 1: THE ANATOMY OF THE TRANSITION
Describe the exact psychomechanics of what this transition represents for THIS subject. 
Define with granularity what they are giving up (the ${transition.from}) and what they are attempting to acquire (the ${transition.to}).
You MUST address:
  (a) How each of their present numbers (${Object.entries(state.counts).filter(([,v])=>v>0).map(([k,v])=>`${String(k).repeat(v)}`).join(', ')}) specifically shapes the starting position of this transition.
  (b) What this transition feels like from the inside — the psychological texture of living in the '${transition.from}' before the shift.
  (c) Why this specific subject — with their exact matrix configuration — is being called to this transition now.
Do not be brief. This section should be the most detailed of all.

### SECTION 2: THE MECHANICS OF EXECUTION
Provide step-by-step, actionable, sophisticated psychological instructions for forcing this transition to materialize.
You MUST address:
  (a) The exact internal mental shifts required — not vague advice, but specific cognitive restructuring protocols.
  (b) How their ${transition.overloadedNumbers.length > 0 ? `overloaded numbers (${transition.overloadedNumbers.join(', ')})` : 'dominant numbers'} must be consciously harnessed or suppressed during execution.
  (c) How their missing numbers (${transition.missingNumbers.slice(0,4).join(', ') || 'none'}) create specific execution gaps — and exactly how to compensate for each gap.
  (d) The role of their active arrows (${arrowStr}) in accelerating or decelerating the transition.
  (e) What physical-world actions must accompany the internal shifts. Be specific.
  (f) How long this transition typically takes for someone with this exact matrix density, and what the early, middle, and late phases look like.

### SECTION 3: ENVIRONMENTAL RESISTANCE & ACTIVE SABOTAGE
Alexandrov is explicit: transitions trigger external interference. Detail the resistance for THIS subject.
You MUST address:
  (a) The exact personality profiles of the people who will attempt to sabotage this transition — based on what numbers they likely carry. Be specific: who are they in the subject's life? Partners? Parents? Colleagues?
  (b) The precise psychological tactics those people will use — guilt, victimhood, anger, withdrawal, financial pressure? Detail each tactic.
  (c) How the subject's own ${transition.from} energy will turn against them internally as resistance — the self-sabotage dimension.
  (d) The specific temptations this subject will face given their ${Object.entries(state.counts).filter(([,v])=>v>=3).map(([k])=>k).join(', ') || 'dominant'} number(s) that will pull them back to the old state.
  (e) Exact counter-strategies to neutralize each form of resistance. Do not be general — prescribe specific psychological maneuvers.

### SECTION 4: THE TIMING ORACLE — WHEN TO EXECUTE
Using the subject's Personal Year ${state.personalYear} and this transition's mathematical timing, provide a detailed reading.
You MUST address:
  (a) Whether Personal Year ${state.personalYear} is auspicious, neutral, or hazardous for initiating this transition — and why in precise terms.
  (b) The exact Personal Year cycle(s) that represent the optimal launch window for this transition.
  (c) The Personal Year cycles where attempting this transition would be catastrophic — and what happens if they try anyway.
  (d) Month-level guidance: which months within the current year carry the most power for each phase of this transition.
  (e) A specific timing prescription: "Begin Phase 1 of this transition in Personal Year X, during Month Y, because..."

### SECTION 5: ANCESTRAL & KARMIC WEIGHT
This transition does not exist in isolation — it intersects with generational karmic programming.
You MUST address:
  (a) What the ${transition.from} energy represents as an ancestral program — where it was likely installed (family system, childhood conditioning, karmic inheritance).
  (b) Specifically, how the subject's missing numbers (${missingStr.substring(0,200)}...) represent karmic blind spots that the ancestors never resolved — and how those blind spots manifest as unconscious resistance to this transition.
  (c) The generational pattern this transition would break, if completed. What lineage wound would close?
  (d) Any karmic contracts embedded in the ${transition.from} → ${transition.to} dynamic — obligations, debts, or gifts from past existences that are relevant.
  (e) The moment the transition completes: what karmic signature does the subject leave for their descendants?

### SECTION 6: THE SHADOW STATES — WHAT FAILURE LOOKS LIKE
Alexandrov is explicit that incomplete or collapsed transitions are more dangerous than never attempting them.
You MUST address:
  (a) The precise symptoms that indicate the transition is failing or stalling — psychological, behavioral, and physical signs.
  (b) The specific shadow manifestation of an incomplete ${transition.from} → ${transition.to} transition for someone with THIS matrix — what does the stuck version of this person look like?
  (c) The crisis events that this specific matrix configuration is most likely to generate if the transition collapses: financial, relational, health-based — be specific.
  (d) The point of no return: how to recognize when a failed transition has permanently damaged the matrix, and what can be done to salvage the situation.
  (e) Emergency stabilization protocols — if the subject recognizes they are in free fall, what exact steps prevent full collapse?

### SECTION 7: THE ULTIMATE SYNTHESIS — THE NEW HUMAN
Describe the completed state. The subject has executed the transition. They now carry a functional ${transition.to} alongside their existing matrix.
You MUST address:
  (a) How the new ${transition.to} energy harmonizes or creates tension with each of their other present numbers — go through every number in their matrix (${Object.entries(state.counts).filter(([,v])=>v>0).map(([k,v])=>`${String(k).repeat(v)}`).join(', ')}) individually.
  (b) The specific gifts, protections, and capabilities that become available after the transition — tailored to this exact matrix, not generic.
  (c) What their daily experience of life will feel qualitatively different — sensory, emotional, social — once the transition completes.
  (d) The new vulnerabilities introduced by carrying ${transition.to} energy — what must be guarded against now.
  (e) A final, direct address to the subject: a philosophical synthesis that ties their entire matrix story — past, present, and post-transition — into a single coherent narrative of who they are becoming.

Begin immediately with Section 1. Do not write any preamble.
`.trim();

  try {
    return await generateTransitionAdvisoryAI(prompt);
  } catch (error) {
    console.error('Advisory failed', error);
    return "Failed to generate advisory. Please check connection and try again.";
  }
}
