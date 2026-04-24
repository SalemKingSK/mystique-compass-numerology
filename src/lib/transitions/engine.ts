/**
 * MYSTIQUE COMPASS — Alexandrov Psychomatrix Transition Engine
 * Pure deterministic logic. Zero AI calls. Zero fallbacks.
 *
 * Source: Александров А.Ф. «Нумерология. Полный курс», Chapter "Переходы цифр"
 * All four canonical transitions are fully modelled per the author's axioms (5.3, 5.4).
 *
 * Canonical formula set (Axiom 5.3):
 *   4  ⟷ 22   (health ↔ energy — bidirectional, always present)
 *   8  →  11  (−4 or −22) — DESCENT: duty collapses into raw will / power-seeking
 *  11  →   8  (+4 or +22) — ASCENT:  will transforms into tolerance / duty
 *   7  →   6  (−4 or −22) — DESCENT: divine talent collapses into degradation
 *   6  →   7  (+4 or +22) — ASCENT:  earthly labour elevates into divine protection
 */

export interface MatrixState {
  counts: Record<number, number>;
  personalYear: number;
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  gender: 'male' | 'female';
}

export type TransitionDirection = 'ascent' | 'descent' | 'dual';
export type UrgencyLevel = 'critical' | 'high' | 'moderate' | 'latent';

export interface DetectedTransition {
  id: string;
  from: number;
  to: number;
  name: string;
  subtitle: string;
  direction: TransitionDirection;
  urgency: UrgencyLevel;
  energyCost: string;
  prerequisitesMet: string;
  coreConflict: string;
  warningActive: boolean;
  overloadedNumbers: number[];
  missingNumbers: number[];
  arrowsActive: string[];
  countFrom: number;
  countTo: number;
  advisory: TransitionAdvisory;
}

export interface TransitionAdvisory {
  anatomy: string;
  execution: string;
  resistance: string;
  timing: string;
  karma: string;
  shadow: string;
  synthesis: string;
}

const ARROWS: Array<{ name: string; numbers: number[]; type: 'positive' | 'negative' }> = [
  { name: 'Arrow of Will (1-2-3)', numbers: [1, 2, 3], type: 'positive' },
  { name: 'Arrow of Family (4-5-6)', numbers: [4, 5, 6], type: 'positive' },
  { name: 'Arrow of Spirit (7-8-9)', numbers: [7, 8, 9], type: 'positive' },
  { name: 'Arrow of Pythagoras (1-4-7)', numbers: [1, 4, 7], type: 'positive' },
  { name: 'Arrow of Femininity (2-5-8)', numbers: [2, 5, 8], type: 'positive' },
  { name: 'Arrow of Talent (3-6-9)', numbers: [3, 6, 9], type: 'positive' },
  { name: 'Arrow of Intellect (1-5-9)', numbers: [1, 5, 9], type: 'positive' },
  { name: 'Arrow of Grounding (3-5-7)', numbers: [3, 5, 7], type: 'positive' },
  { name: 'Absence of Goal (no 1-2-3)', numbers: [1, 2, 3], type: 'negative' },
  { name: 'Absence of Will (no 4-5-6)', numbers: [4, 5, 6], type: 'negative' },
  { name: 'Absence of Spiritual (no 7-8-9)', numbers: [7, 8, 9], type: 'negative' },
];

function getActiveArrows(counts: Record<number, number>): string[] {
  return ARROWS
    .filter(a => {
      const allPresent = a.numbers.every(n => (counts[n] ?? 0) > 0);
      const allAbsent = a.numbers.every(n => (counts[n] ?? 0) === 0);
      return a.type === 'positive' ? allPresent : allAbsent;
    })
    .map(a => a.name);
}

function getOverloaded(counts: Record<number, number>): number[] {
  return Object.entries(counts).filter(([, v]) => v >= 4).map(([k]) => Number(k));
}

function getMissing(counts: Record<number, number>): number[] {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !counts[n] || counts[n] === 0);
}

function energyReserve(counts: Record<number, number>): string {
  const twos = counts[2] ?? 0;
  const fours = counts[4] ?? 0;
  if (fours >= 2 && twos >= 2) return 'abundant (strong 4 and 22 reserves)';
  if (fours >= 1 && twos >= 2) return 'sufficient (4 + 22 both present)';
  if (fours >= 1) return 'limited — relying primarily on 4 (health reserves)';
  if (twos >= 2) return 'limited — relying on 22 (vital energy) with no 4 backup';
  return 'CRITICALLY LOW — neither 4 nor sufficient 2s found; transition carries extreme risk';
}

function c(counts: Record<number, number>, n: number): number {
  return counts[n] ?? 0;
}

function repeat(n: number, count: number): string {
  return String(n).repeat(count);
}

function advisory_11_to_8(state: MatrixState): TransitionAdvisory {
  const { counts, personalYear } = state;
  const ones = c(counts, 1);
  const eights = c(counts, 8);
  const reserve = energyReserve(counts);

  return {
    anatomy: `Alexandrov's second canonical transition: two Ones (${repeat(1, ones)}) voluntarily collapsing into an Eight. The One represents the force of Will, self-assertion, and ego. The Eight represents tolerance, duty, and kindness. By Alexandrov's formulation, this transition activates whenever a person with two or more Ones chooses NOT to dominate.`,
    execution: `The transition requires a concrete human confrontation. Step 1: Identify the pressure moment. Step 2: Suppress both dominance impulses (suppressing others and dictating your own will). Step 3: Replace the impulse with genuine tolerance. Step 4: Monitor health and energy reserves. Step 5: Repeat until the Eight crystallises.`,
    resistance: `Resistance comes from two sources. External: people accustomed to your dominance may interpret the shift as weakness. Internal: your own ego will manufacture justifications for why this specific situation deserves a power-based exception.`,
    timing: `Personal Year ${personalYear} analysis. ${[1, 10, 19].includes(personalYear) ? 'Personal Year matches the number being converted: stakes are at their highest.' : 'A stable window for building tolerance habits.'}`,
    karma: `A high count of Ones typically encodes a lineage where survival required dominance. The Eight represents the resolution of this split: the capacity to hold authority without weaponising it.`,
    shadow: `An incomplete transition leads to righteous aggression—anger masked as principle. It results in energy drain and eventual hardening of character back into dominance patterns.`,
    synthesis: `The completed transition produces a matrix where tolerance is the operating mode. Will becomes purposeful and directed at genuine goals rather than interpersonal control.`
  };
}

function advisory_8_to_11(state: MatrixState): TransitionAdvisory {
  const { counts, personalYear } = state;
  const eights = c(counts, 8);
  return {
    anatomy: `Alexandrov's formula 8 → 11 (−4 or −22). This describes the moment duty is consumed to fuel raw willpower and acts of domination. It is a collapse of the soul's protective container.`,
    execution: `This happens when power-seeking overrides duty. Phase 1: Triggering opportunity. Phase 2: Rationalisation sequence. Phase 3: Concrete act of manipulation. Phase 4: The cascade of negative matrix shifts.`,
    resistance: `This descent is often reinforced by the environment. People who benefit from your power will celebrate your "decisiveness," making it harder to return to tolerance.`,
    timing: `Personal Year ${personalYear} warning. This year's energy might be pushing you toward self-assertion at the cost of your existing sense of duty.`,
    karma: `The Eight is an ancestral program of endurance. The collapse represents an exhausted caretaker becoming a tyrant, demanding repayment in control for a lifetime of giving.`,
    shadow: `Shadow state includes character hardening to 11111, complete loss of filial duty, and rapid energy depletion causing physical health decline.`,
    synthesis: `This descent has no positive synthesis, but a reversed collapse produces an unusually robust Eight—a tolerance that has been tested and chosen knowingly.`
  };
}

function advisory_6_to_7(state: MatrixState): TransitionAdvisory {
  const { counts, personalYear } = state;
  const sixes = c(counts, 6);
  return {
    anatomy: `The ascent from earthly labour (6) into divine protection (7). 6 → 7 (+4 or +22). The transition gains energy as the subject aligns with Nature's intention.`,
    execution: `Stage 1: Read books (authentic interest). Stage 2: Engage with art and science. Stage 3: Cultivate tolerance. Stage 4: Activate logic-memory synergy. Stage 5: Activate strong lines.`,
    resistance: `Opposition comes from those with strong Sixes who cannot allow you to exit their earthly field. They will manufacture practical crises to keep you grounded.`,
    timing: `Personal Year ${personalYear} analysis. Cycles 7 and 16 are most auspicious for this complex spiritual ascent.`,
    karma: `Ancestral liberation: the first person in a lineage to step from earthly compulsion into genuine talent expression.`,
    shadow: `Shadow states include the "666" vortex—being organised solely around self-interest—and the 677 struggle of inner instability.`,
    synthesis: `The completed transition produces what Alexandrov calls "divine protection." Survival is no longer dependent on physical effort alone.`
  };
}

function advisory_7_to_6(state: MatrixState): TransitionAdvisory {
  const { counts, personalYear } = state;
  const sevens = c(counts, 7);
  return {
    anatomy: `Alexandrov's most urgent warning: 7 → 6 (−4 or −22). Chosen action to harm or undermine others for gain collapses the divine protective field.`,
    execution: `Mechanics of descent: Stage 1: Trigger (deception or harm). Stage 2: Recognition suppression. Stage 3: Internal cascade of health and luck loss.`,
    resistance: `This collapse is reinforced by those who benefit from your earthly power accumulation. Internal rationalisation is the primary danger.`,
    timing: `Personal Year ${personalYear} risk. Year 7 is the most protected and most vulnerable cycle for this specific collapse.`,
    karma: `Squandering a lineage inheritance of integrity. Every act of harm incurs a precise karmic debt that blocks matrix restoration.`,
    shadow: `Shadow symptoms: character hardening, luck disappearance, and a pathological inflation of self-assessment.`,
    synthesis: `The reversal requires the 6→7 counter-transition plus specific acknowledgement of the harm done. The recovered Seven is more consciously held.`
  };
}

export function detectTransitions(state: MatrixState): DetectedTransition[] {
  const { counts, personalYear } = state;
  const results: DetectedTransition[] = [];
  const overloaded = getOverloaded(counts);
  const missing = getMissing(counts);
  const arrows = getActiveArrows(counts);

  const cf = (n: number) => c(counts, n);
  const row3Strength = cf(3) + cf(6) + cf(9);

  if (cf(1) >= 2) {
    results.push({
      id: '11_TO_8', from: 1, to: 8,
      name: 'Will into Duty', subtitle: 'Voluntary Sacrifice of the Ego',
      direction: 'ascent', urgency: cf(1) >= 4 ? 'critical' : cf(8) === 0 ? 'high' : 'moderate',
      energyCost: '+4 or +22', prerequisitesMet: `${cf(1)} Ones present.`,
      coreConflict: 'Choosing tolerance and kindness over assertion in each conflict situation.',
      warningActive: [1, 10, 19, 8, 17, 26].includes(personalYear),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: cf(1), countTo: cf(8), advisory: advisory_11_to_8(state),
    });
  }

  if (cf(8) >= 1) {
    results.push({
      id: '8_TO_11', from: 8, to: 1,
      name: 'Duty into Will', subtitle: 'The Collapse of Tolerance',
      direction: 'descent', urgency: overloaded.includes(8) ? 'critical' : cf(1) >= 3 ? 'high' : 'moderate',
      energyCost: '−4 or −22', prerequisitesMet: `${cf(8)} Eight(s) present.`,
      coreConflict: 'Acts of harm for personal gain trigger this collapse.',
      warningActive: [8, 17, 26, 1, 10, 19].includes(personalYear),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: cf(8), countTo: cf(1), advisory: advisory_8_to_11(state),
    });
  }

  if (cf(6) >= 1 || row3Strength >= 5) {
    results.push({
      id: '6_TO_7', from: 6, to: 7,
      name: 'Routine into Talent', subtitle: 'Liberation from the Earthly',
      direction: 'ascent', urgency: cf(6) >= 3 ? 'critical' : cf(7) === 0 ? 'high' : 'moderate',
      energyCost: '+4 or +22', prerequisitesMet: cf(6) >= 1 ? `${cf(6)} Six(es) present.` : `Row strength is ${row3Strength}.`,
      coreConflict: 'Releasing earthly anchoring through art, books, and knowledge.',
      warningActive: [6, 15, 24, 7, 16, 25].includes(personalYear),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: cf(6), countTo: cf(7), advisory: advisory_6_to_7(state),
    });
  }

  if (cf(7) >= 1) {
    results.push({
      id: '7_TO_6', from: 7, to: 6,
      name: 'Talent into Degradation', subtitle: 'Fall from Protection',
      direction: 'descent', urgency: overloaded.includes(7) ? 'critical' : [7, 16, 25].includes(personalYear) ? 'high' : 'moderate',
      energyCost: '−4 or −22', prerequisitesMet: `${cf(7)} Seven(s) present.`,
      coreConflict: 'Deliberate harm against others for gain triggers this collapse.',
      warningActive: [7, 16, 25, 6, 15, 24].includes(personalYear),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: cf(7), countTo: cf(6), advisory: advisory_7_to_6(state),
    });
  }

  const urgencyOrder: Record<UrgencyLevel, number> = { critical: 0, high: 1, moderate: 2, latent: 3 };
  return results.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
}
