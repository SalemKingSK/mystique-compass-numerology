/**
 * @fileoverview MYSTIQUE COMPASS — Cosmic Synthesis Engine (Field-Strict Version)
 *
 * A fully deterministic profile synthesizer that acts as a literal summary
 * of the definitions provided by the app's internal data libraries.
 *
 * Output: four semantically distinct paragraphs directly summarizing:
 *   P1 — Core Essence (Psyche + Western Sign + Animal Core)
 *   P2 — Shadow & Wounds (Missing Numbers + Psyche Shadow + Animal Wound)
 *   P3 — Gifts & Peak Power (Destiny + Primary Arrow + Animal Gift)
 *   P4 — This Year & Directive (PY Essence + Tai Sui Relation + Kua)
 */

import type { AstroInsightOutput, NumerologyData } from '@/components/profile-generator/types';
import { 
  PSYCHIC_NUMBER_MEANINGS, 
  DESTINY_NUMBER_MEANINGS 
} from './numerology/data';
import { ZOO } from './cosmic-fate/zoo';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function reduce(n: number): number {
  let val = Math.abs(n);
  while (val > 9) val = String(val).split('').reduce((a, d) => a + +d, 0);
  return val || 9;
}

function getCurrentPersonalYear(birthDay: number, birthMonth: number): number {
  const yr = new Date().getFullYear();
  return reduce(
    reduce(birthDay) + reduce(birthMonth) +
    reduce(String(yr).split('').reduce((a, c) => a + +c, 0))
  );
}

function getCurrentPersonalMonth(py: number): number {
  return reduce(py + (new Date().getMonth() + 1));
}

// ─── PHRASE BANKS (STRICT MAPPING) ───────────────────────────────────────────

const WESTERN_SIGN_ESSENCE: Record<string, string> = {
  Aries: 'the pioneer — direct, initiating, and equipped with a courage that acts before the rational mind has fully assessed the odds',
  Taurus: 'the sustainer — patient, sensory, and possessed of an endurance that outlasts most challenges',
  Gemini: 'the connector — quick, curious, and capable of holding multiple perspectives simultaneously',
  Cancer: 'the nurturer — deeply feeling, protectively instinctive, and possessed of an emotional intelligence',
  Leo: 'the illuminator — warm, creative, and possessed of a natural authority that others tend to orient toward',
  Virgo: 'the discerner — precise, analytical, and devoted to the craft of doing things well',
  Libra: 'the balancer — aesthetically gifted, relationally oriented, and perpetually seeking equilibrium',
  Scorpio: 'the transformer — penetrating, depth-seeking, and equipped with an X-ray vision for the unseen',
  Sagittarius: 'the explorer — philosophically driven, directionally bold, and perpetually drawn toward new horizons',
  Capricorn: 'the architect — disciplined, strategically patient, and possessed of a specific, seasoned ambition',
  Aquarius: 'the revolutionary — independent, future-oriented, and constitutionally incapable of accepting stale convention',
  Pisces: 'the mystic — porous, imaginatively rich, and possessed of an empathic depth that touches the soul',
};

const PSYCHE_SHADOW_SNIPPETS: Record<number, string> = {
  1: 'the isolation of the architect who sees the whole map while others see only the road ahead',
  2: 'the exhaustion of absorbing every emotional frequency, which can become a wound without proper boundaries',
  3: 'the scattering of creative gifts across too many surfaces, mistaking enthusiasm for completion',
  4: 'the risk of mistaking the structure for the life it contains — building a cage instead of a sanctuary',
  5: 'the restlessness that can never be entirely satisfied, an always-present whisper that the next horizon is better',
  6: 'the compulsion to fix others at the cost of acknowledging one\'s own internal fractures',
  7: 'the retreat from a world that cannot meet their interior depth, which can lead to self-imposed exile',
  8: 'the loneliness of authority, which often mistakes the person for the role they must perform',
  9: 'the heavy grief of perpetual completion, carrying the weight of endings that cannot be set down',
};

const MISSING_SHADOW_SNIPPETS: Record<number, string> = {
  1: 'the absent 1 suggests a gap between internal clarity and verbal expression',
  2: 'the absent 2 means emotional subtext often passes unregistered by the conscious mind',
  3: 'the absent 3 creates a thin relationship with personal history and ancestral memory',
  4: 'the absent 4 indicates that brilliant visions frequently stall at the implementation stage',
  5: 'the absent 5, at the center, creates a tendency toward sudden energetic polarisations',
  6: 'the absent 6 suggests the capacity for sustained domestic maintenance requires conscious effort',
  7: 'the absent 7 leaves a periodic hollowness that external achievement cannot resolve',
  8: 'the absent 8 creates a complex, sometimes difficult relationship with material power',
  9: 'the absent 9 means the inner ignition for sustained ambitious drive is not automatic',
};

const PERSONAL_YEAR_ESSENCE: Record<number, { e: string; d: string }> = {
  1: { e: 'a threshold year of origins and decisive new beginnings', d: 'identify the primary initiative of the next cycle and take its first step now' },
  2: { e: 'a year of quiet germination requiring patience and cooperation', d: 'deepen one important partnership with genuine attention' },
  3: { e: 'a year of creative flowering and expressive social engagement', d: 'release something creative that summarizes your recent growth' },
  4: { e: 'a consolidation year demanding methodical structural work', d: 'commit to one solid financial or physical discipline for the duration' },
  5: { e: 'a year of liberation and calculated risks', d: 'say yes to one opportunity that would usually feel too uncertain' },
  6: { e: 'a year of creative responsibility and domestic harmony', d: 'complete one lingering home project or deepen a family commitment' },
  7: { e: 'an inward, spiritual year requiring solitude and study', d: 'prioritize reflection and self-audit over external expansion' },
  8: { e: 'a year of material harvest and earned authority', d: 'claim the professional recognition you have genuinely worked for' },
  9: { e: 'a year of completion and the graceful release of the old', d: 'identify what has outgrown its purpose and let it go with gratitude' },
};

// ─── SYNTHESIS FUNCTION ───────────────────────────────────────────────────────

export function buildCosmicProfile(
  insight: AstroInsightOutput,
  numerology: NumerologyData
): string {
  const { name, western_sign, sign: chineseSign, element } = insight;
  const { psycheNum, destinyNum, kuaNum, missingNumbers = [], arrowsOfStrength = [], arrowsOfWeakness = [], compoundNum, birthDay, birthMonth } = numerology;

  // Pull source definitions
  const psycheDef = PSYCHIC_NUMBER_MEANINGS[psycheNum as keyof typeof PSYCHIC_NUMBER_MEANINGS];
  const destinyDef = DESTINY_NUMBER_MEANINGS[destinyNum as keyof typeof DESTINY_NUMBER_MEANINGS];
  const animalDef = ZOO[chineseSign];
  const currentPY = getCurrentPersonalYear(birthDay, birthMonth);
  const pyData = PERSONAL_YEAR_ESSENCE[currentPY];

  // ── PARAGRAPH 1: CORE CHARACTER ──────────────────────────────────────────
  // Summary of: Psyche Number + Western Sign + Animal Core Trait
  const psycheStart = psycheDef?.description.split('.')[0] || `is governed by the number ${psycheNum}`;
  const p1 = `${name} ${psycheStart.charAt(0).toLowerCase() + psycheStart.slice(1)}. This core identity merges with the ${western_sign} archetype — ${WESTERN_SIGN_ESSENCE[western_sign]} — and is anchored by the ${chineseSign}'s native trait of being ${animalDef.trait}. The ${element} element provides the underlying energetic medium, making this person ${element === 'Water' ? 'fluid and depth-seeking' : element === 'Fire' ? 'electrified and transformative' : element === 'Wood' ? 'organically expansive' : element === 'Metal' ? 'precise and principled' : 'stable and grounded'}.`;

  // ── PARAGRAPH 2: SHADOW & WOUNDS ─────────────────────────────────────────
  // Summary of: Missing Numbers + Psyche Shadow + Animal Wound/Health
  const missingPart = missingNumbers.length > 0 
    ? `The Lo Shu Grid reveals specific developmental frontiers: ${missingNumbers.map(n => MISSING_SHADOW_SNIPPETS[n]).join(', and ')}.`
    : `The Lo Shu Grid is remarkably balanced, distributing challenges evenly across the life.`;
  const p2 = `${missingPart} Internally, the shadow of the Psyche ${psycheNum} manifests as ${PSYCHE_SHADOW_SNIPPETS[psycheNum]}. This is compounded by the ${chineseSign}'s characteristic vulnerability to ${animalDef.wound.split(' — ')[0]}, often reflected physically in the ${animalDef.organ}. Every setback serves as a corrective lesson in ${chineseSign === 'Rat' ? 'trust' : chineseSign === 'Tiger' ? 'temperance' : 'balance'}.`;

  // ── PARAGRAPH 3: GIFTS & PEAK POWER ──────────────────────────────────────
  // Summary of: Destiny Number + Primary Arrow Strength + Animal Gift
  const destinyCore = destinyDef?.description.split('.')[0] || `is oriented toward the number ${destinyNum}`;
  const strengthArrow = arrowsOfStrength.find(a => a.category === 'Primary Plane');
  const arrowPart = strengthArrow 
    ? ` This path is empowered by the ${strengthArrow.name}, marking ${name} as someone whose ${strengthArrow.description.split(':')[0].toLowerCase()}.`
    : ` This path relies on the individual's ability to activate the dormant potential of their grid.`;
  const p3 = `Regarding the higher purpose, ${name} ${destinyCore.charAt(0).toLowerCase() + destinyCore.slice(1)}.${arrowPart} The ${chineseSign}'s unique gift of ${animalDef.gift.split(' — ')[0]} provides a strategic advantage, especially during the peak years of maturity when the ${destinyNum} vibration reaches its fullest material expression.`;

  // ── PARAGRAPH 4: THIS YEAR & FORECAST ────────────────────────────────────
  // Summary of: Personal Year + Personal Month + Relation to Year Animal
  const p4 = `In the current cycle, ${name} is navigating a Personal Year ${currentPY} — ${pyData.e}. The present focus points toward ${PERSONAL_MONTH_FOCUS[getCurrentPersonalMonth(currentPY)]}. The broader environmental energy, as the ${chineseSign} encounters the year's ruling animal, suggests ${animalDef.clashDesc.includes('clash') && currentPY % 3 === 1 ? 'a period of high elemental friction' : 'a window where outcomes reflect genuine personal effort'}. The immediate directive from the cosmos is to ${pyData.d}.`;

  return [p1, p2, p3, p4].join('\n\n');
}
