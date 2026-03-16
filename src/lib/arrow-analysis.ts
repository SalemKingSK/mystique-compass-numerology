/**
 * @fileOverview Detects which arrows are full, empty, or partial for a given birth date.
 * Optimized to handle external counts from Psyche/Destiny/Kua numbers.
 */

import {
  FULL_ARROW_DEFINITIONS,
  EMPTY_ARROW_DEFINITIONS,
  type ArrowDefinition,
} from "./arrow-definitions";

export interface ArrowStatus {
  definition: ArrowDefinition;
  isActive: boolean;   
  presentNumbers: number[];
  missingNumbers: number[];
}

/**
 * Returns the status for a single arrow given a birth date or a counts object.
 * For FULL arrows: active when all 3 numbers are present.
 * For EMPTY arrows: active when NONE of the 3 numbers are present.
 */
export function getArrowStatus(
  arrow: ArrowDefinition,
  birthDate: string,
  externalCounts?: Record<number, number>
): ArrowStatus {
  const counts: Record<number, number> = externalCounts || {};
  
  if (!externalCounts) {
    birthDate
      .replace(/\D/g, "")
      .split("")
      .forEach((d) => {
        const n = parseInt(d, 10);
        if (n >= 1 && n <= 9) counts[n] = (counts[n] || 0) + 1;
      });
  }

  const presentNumbers = arrow.numbers.filter((n) => (counts[n] ?? 0) > 0);
  const missingNumbers = arrow.numbers.filter((n) => !(counts[n] ?? 0));

  const isActive =
    arrow.state === "full"
      ? presentNumbers.length === 3           
      : missingNumbers.length === 3;          

  return { definition: arrow, isActive, presentNumbers, missingNumbers };
}

export function getActiveArrows(birthDate: string, externalCounts?: Record<number, number>): ArrowStatus[] {
  const all = [...FULL_ARROW_DEFINITIONS, ...EMPTY_ARROW_DEFINITIONS];
  return all
    .map((a) => getArrowStatus(a, birthDate, externalCounts))
    .filter((s) => s.isActive);
}
