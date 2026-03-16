/**
 * @fileOverview Detects which arrows are full, empty, or partial for a given birth date.
 */

import {
  FULL_ARROW_DEFINITIONS,
  EMPTY_ARROW_DEFINITIONS,
  type ArrowDefinition,
} from "./arrow-definitions";

function getGridCounts(birthDate: string): Record<number, number> {
  const counts: Record<number, number> = {};
  birthDate
    .replace(/\D/g, "")
    .split("")
    .forEach((d) => {
      const n = parseInt(d, 10);
      if (n >= 1 && n <= 9) counts[n] = (counts[n] || 0) + 1;
    });
  return counts;
}

export interface ArrowStatus {
  definition: ArrowDefinition;
  isActive: boolean;   
  presentNumbers: number[];
  missingNumbers: number[];
}

export function getArrowStatus(
  arrow: ArrowDefinition,
  birthDate: string
): ArrowStatus {
  const counts = getGridCounts(birthDate);
  const presentNumbers = arrow.numbers.filter((n) => (counts[n] ?? 0) > 0);
  const missingNumbers = arrow.numbers.filter((n) => !(counts[n] ?? 0));

  const isActive =
    arrow.state === "full"
      ? presentNumbers.length === 3           
      : missingNumbers.length === 3;          

  return { definition: arrow, isActive, presentNumbers, missingNumbers };
}

export function getActiveArrows(birthDate: string): ArrowStatus[] {
  const all = [...FULL_ARROW_DEFINITIONS, ...EMPTY_ARROW_DEFINITIONS];
  return all
    .map((a) => getArrowStatus(a, birthDate))
    .filter((s) => s.isActive);
}
