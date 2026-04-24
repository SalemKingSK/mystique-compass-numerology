/**
 * MYSTIQUE COMPASS — Alexandrov Psychomatrix Transition Engine
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

export interface DetectedTransition {
  id: string;
  from: number;
  to: number;
  name: string;
  subtitle: string;
  direction: TransitionDirection;
  urgency: 'critical' | 'high' | 'moderate' | 'latent';
  prerequisitesMet: string;
  coreConflict: string;
  warningActive: boolean;
  overloadedNumbers: number[];
  missingNumbers: number[];
  arrowsActive: string[];
  countFrom: number;
  countTo: number;
}

const ARROWS: Array<{ name: string; numbers: number[]; strength: 'positive' | 'negative' }> = [
  { name: 'Arrow of Pythagoras',   numbers: [1,5,9], strength: 'positive' },
  { name: 'Arrow of Intelligence', numbers: [3,5,7], strength: 'positive' },
  { name: 'Arrow of Will',         numbers: [1,2,3], strength: 'positive' },
  { name: 'Arrow of Fame',         numbers: [1,4,7], strength: 'positive' },
  { name: 'Arrow of Health',       numbers: [4,5,6], strength: 'positive' },
  { name: 'Arrow of Finance',      numbers: [2,5,8], strength: 'positive' },
  { name: 'Arrow of Talent',       numbers: [3,6,9], strength: 'positive' },
  { name: 'Arrow of Family',       numbers: [7,8,9], strength: 'positive' },
  { name: 'Absence of Goal',       numbers: [1,2,3], strength: 'negative' },
  { name: 'Absence of Will',       numbers: [4,5,6], strength: 'negative' },
  { name: 'Absence of Stability',  numbers: [7,8,9], strength: 'negative' },
  { name: 'Absence of Spirit',     numbers: [1,4,7], strength: 'negative' },
  { name: 'Absence of Energy',     numbers: [2,5,8], strength: 'negative' },
  { name: 'Absence of Fate',       numbers: [3,6,9], strength: 'negative' },
];

function getActiveArrows(counts: Record<number, number>): string[] {
  return ARROWS
    .filter(a => {
      const allPresent = a.numbers.every(n => (counts[n] ?? 0) > 0);
      const allAbsent  = a.numbers.every(n => (counts[n] ?? 0) === 0);
      return a.strength === 'positive' ? allPresent : allAbsent;
    })
    .map(a => a.name);
}

function getOverloaded(counts: Record<number, number>): number[] {
  return Object.entries(counts).filter(([,v]) => v >= 4).map(([k]) => Number(k));
}

function getMissing(counts: Record<number, number>): number[] {
  return [1,2,3,4,5,6,7,8,9].filter(n => !counts[n] || counts[n] === 0);
}

function urgencyFromYear(py: number, dangerYears: number[]): boolean {
  return dangerYears.includes(py);
}

export function detectTransitions(state: MatrixState): DetectedTransition[] {
  const { counts, personalYear } = state;
  const results: DetectedTransition[] = [];
  const overloaded = getOverloaded(counts);
  const missing    = getMissing(counts);
  const arrows     = getActiveArrows(counts);

  const c = (n: number) => counts[n] ?? 0;

  // 1. WILL → DUTY
  if (c(1) >= 2) {
    results.push({
      id: '11_TO_8', from: 1, to: 8,
      name: 'Will into Duty', subtitle: 'The Sacrifice of the Ego', direction: 'dual',
      urgency: c(1) >= 4 ? 'critical' : c(8) === 0 ? 'high' : 'moderate',
      prerequisitesMet: `You hold ${c(1)} Ones (Will). Double-1 is the minimum gate.`,
      coreConflict: 'Voluntarily dismantling personal dominance to develop radical tolerance and service.',
      warningActive: urgencyFromYear(personalYear, [1, 10, 19]),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: c(1), countTo: c(8),
    });
  }

  // 2. DUTY → WILL
  if (c(8) >= 1) {
    results.push({
      id: '8_TO_11', from: 8, to: 1,
      name: 'Duty into Will', subtitle: 'The Reclamation of Power', direction: 'ascent',
      urgency: c(8) >= 2 && c(1) === 0 ? 'critical' : 'high',
      prerequisitesMet: `You carry ${c(8)} Eight(s). Duty has been your operating system.`,
      coreConflict: 'Shedding the weight of external obligation to reclaim absolute personal authority.',
      warningActive: urgencyFromYear(personalYear, [8, 17, 26]),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: c(8), countTo: c(1),
    });
  }

  // 3. ROUTINE → TALENT
  const canGen6 = (c(3) + c(6) + c(9)) >= 5;
  if (c(6) >= 1 || canGen6) {
    results.push({
      id: '6_TO_7', from: 6, to: 7,
      name: 'Routine into Divine Talent', subtitle: 'The Elevation of the Mundane', direction: 'ascent',
      urgency: c(6) >= 3 ? 'critical' : 'moderate',
      prerequisitesMet: c(6) >= 1 ? `Native 6 detected.` : `Row strength facilitates dynamic 6.`,
      coreConflict: 'Converting heavy physical routines into divine protection and luck.',
      warningActive: urgencyFromYear(personalYear, [6, 7, 15, 16]),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: c(6), countTo: c(7),
    });
  }

  // 4. TALENT → DEGRADATION
  if (c(7) >= 1) {
    results.push({
      id: '7_TO_6', from: 7, to: 6,
      name: 'Talent into Degradation', subtitle: 'The Fall from Divine Protection', direction: 'descent',
      urgency: overloaded.includes(7) ? 'critical' : 'moderate',
      prerequisitesMet: `You have ${c(7)} Seven(s). Warning: transition risk detected.`,
      coreConflict: 'Loss of divine luck, regressing into mundane struggle or mechanical routine.',
      warningActive: urgencyFromYear(personalYear, [7, 16, 25]),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: c(7), countTo: c(6),
    });
  }

  // 5. BIOLOGY → FREEDOM
  if (c(2) >= 2) {
    results.push({
      id: '2_TO_5', from: 2, to: 5,
      name: 'Biology into Freedom', subtitle: 'The Liberation from the Flesh', direction: 'ascent',
      urgency: c(2) >= 3 && c(5) === 0 ? 'critical' : 'high',
      prerequisitesMet: `You hold ${c(2)} Twos. Biological anchors dominate your field.`,
      coreConflict: 'Breaking free from biological compulsions to achieve true spiritual freedom.',
      warningActive: urgencyFromYear(personalYear, [2, 5, 14, 23]),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: c(2), countTo: c(5),
    });
  }

  // 6. FREEDOM → BIOLOGY
  if (c(5) >= 1 && (overloaded.includes(5) || [2, 5].includes(personalYear))) {
    results.push({
      id: '5_TO_2', from: 5, to: 2,
      name: 'Freedom into Biology', subtitle: 'The Return to the Flesh', direction: 'descent',
      urgency: overloaded.includes(5) ? 'critical' : 'moderate',
      prerequisitesMet: `Five(s) carry risk of recklessness leading to biological chaos.`,
      coreConflict: 'Uncontrolled freedom devolving into physical disorder and addiction.',
      warningActive: urgencyFromYear(personalYear, [2, 5, 14, 23]),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: c(5), countTo: c(2),
    });
  }

  // 7. HABIT → INTELLECT
  if (c(3) >= 2) {
    results.push({
      id: '3_TO_9', from: 3, to: 9,
      name: 'Habit into Intellect', subtitle: 'The Transmutation of Interest', direction: 'ascent',
      urgency: c(3) >= 3 && c(9) === 0 ? 'critical' : 'moderate',
      prerequisitesMet: `Threes dominate cognitive bandwidth. 9-intellect is dormant.`,
      coreConflict: 'Converting addictive habitual loops into profound intellectual mastery.',
      warningActive: urgencyFromYear(personalYear, [3, 9, 12, 21]),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: c(3), countTo: c(9),
    });
  }

  // 8. INTELLECT → HABIT
  if (c(9) >= 1 && (overloaded.includes(9) || personalYear === 3)) {
    results.push({
      id: '9_TO_3', from: 9, to: 3,
      name: 'Intellect into Habit', subtitle: 'The Collapse of Wisdom', direction: 'descent',
      urgency: overloaded.includes(9) ? 'critical' : 'latent',
      prerequisitesMet: `Intellectual capacity risks collapse into compulsive habit.`,
      coreConflict: 'The regression of wisdom back into mindless repetition and burnout.',
      warningActive: urgencyFromYear(personalYear, [3, 9, 12, 21]),
      overloadedNumbers: overloaded, missingNumbers: missing, arrowsActive: arrows,
      countFrom: c(9), countTo: c(3),
    });
  }

  const urgencyOrder = { critical: 0, high: 1, moderate: 2, latent: 3 };
  return results.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
}
