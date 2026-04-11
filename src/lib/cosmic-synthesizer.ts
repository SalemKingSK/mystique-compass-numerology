/**
 * @fileoverview MYSTIQUE COMPASS — Cosmic Synthesis Engine
 *
 * A fully deterministic profile synthesizer. No external API calls.
 * Reads every available data field and composes a 4-paragraph
 * narrative character profile using phrase banks keyed to each
 * number, sign, element, and timing combination.
 *
 * Output: four semantically distinct paragraphs:
 *   P1 — Core Essence (who this person is at soul level)
 *   P2 — Shadow & Wounds (karmic patterns, absences, challenges)
 *   P3 — Gifts & Peak Power (purpose, strengths, life arc)
 *   P4 — This Year & Directive (timing, forecast, action)
 */

import type { AstroInsightOutput, NumerologyData } from '@/components/profile-generator/types';
import { PSYCHIC_NUMBER_MEANINGS, DESTINY_NUMBER_MEANINGS } from './numerology/data';
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

// ─── PHRASE BANKS ─────────────────────────────────────────────────────────────

const WESTERN_SIGN_ESSENCE: Record<string, string> = {
  Aries: 'the pioneer — direct, initiating, and equipped with a courage that acts before the rational mind has fully assessed the odds',
  Taurus: 'the sustainer — patient, sensory, and possessed of an endurance that outlasts most challenges simply through the refusal to abandon what has been begun',
  Gemini: 'the connector — quick, curious, and capable of holding multiple perspectives simultaneously in a way that reveals relationships others miss',
  Cancer: 'the nurturer — deeply feeling, protectively instinctive, and possessed of an emotional intelligence that reads what is needed before it is asked',
  Leo: 'the illuminator — warm, creative, and possessed of a natural authority that others tend to orient toward in moments of shared uncertainty',
  Virgo: 'the discerner — precise, analytical, and genuinely devoted to the craft of doing things well rather than merely the appearance of doing so',
  Libra: 'the balancer — aesthetically gifted, relationally oriented, and perpetually engaged in the project of finding a more just and beautiful arrangement of whatever is before them',
  Scorpio: 'the transformer — penetrating, depth-seeking, and equipped with an X-ray vision that sees through surface presentations to what is actually occurring beneath',
  Sagittarius: 'the explorer — philosophically driven, directionally bold, and perpetually drawn toward the horizon where the known world ends',
  Capricorn: 'the architect — disciplined, strategically patient, and possessed of the specific ambition that waits for the right moment rather than forcing it',
  Aquarius: 'the revolutionary — independent, future-oriented, and constitutionally incapable of accepting an inherited arrangement simply because it has always been that way',
  Pisces: 'the mystic — porous, imaginatively rich, and possessed of an empathic depth that experiences others\' inner states with a visceral directness that can be overwhelming',
};

const ELEMENT_PHRASE: Record<string, string> = {
  Wood: 'Wood element gives this energy a quality of organic growth — patient expansion that works with natural timing rather than against it',
  Fire: 'Fire element electrifies this energy — enthusiastic, illuminating, and capable of transformation through intensity',
  Earth: 'Earth element grounds this energy in pragmatic wisdom — stable, containing, and oriented toward tangible results',
  Metal: 'Metal element refines this energy toward precision and principle — cutting away the inessential to reveal the core',
  Water: 'Water element makes this energy fluid and depth-seeking — adaptable on the surface, profoundly moving underneath',
};

const MISSING_SHADOW_SNIPPETS: Record<number, string> = {
  1: 'difficulty with authentic self-assertion and finding a clear individual voice',
  2: 'a tendency to overlook emotional subtext or struggle with genuine partnership',
  3: 'blocks in creative self-expression or a thin relationship with personal history',
  4: 'challenges in building stable foundations and maintaining methodical discipline',
  5: 'difficulty with adaptability or a tendency toward extreme polarisation',
  6: 'a struggle to find meaning in relational maintenance and domestic responsibility',
  7: 'a recurring hollowing out of inner peace that external success cannot fill',
  8: 'a complex, often sabotaging relationship with material power and authority',
  9: 'difficulty with sustained ambitious drive or the courage to complete what was begun',
};

const ARROW_STRENGTH_SNIPPETS: Record<string, string> = {
  'thought': 'the Strategic Planner — strategies are designed with a depth that sees several steps ahead',
  'willpower': 'the Persistent Force — an unstoppable drive that returns from setbacks with renewed clarity',
  'action': 'the Effective Doer — moving from thought to deed with a seamless, kinetic intelligence',
  'heart': 'the Intuitive Compass — reading the emotional truth of a situation before logic confirms it',
  'mind': 'the Intellectual Powerhouse — processing complexity with an analytical ease that appears effortless',
  'practicality': 'the Grounded Architect — converting abstract vision into concrete, tangible prosperity',
};

const PERSONAL_YEAR_DIRECTIVE: Record<number, { essence: string; action: string }> = {
  1: { essence: 'a threshold year of decisive new origins', action: 'claim your authority over a new direction' },
  2: { essence: 'a year of quiet germination and receptive patience', action: 'nurture one primary partnership' },
  3: { essence: 'a year of creative bloom and public expression', action: 'share your authentic voice with the world' },
  4: { essence: 'a consolidation year of structural discipline', action: 'stabilise your foundations with consistency' },
  5: { essence: 'a year of liberation and expanding horizons', action: 'embrace a significant, calculated risk' },
  6: { essence: 'a year of responsibility and relational beauty', action: 'complete a long-standing domestic project' },
  7: { essence: 'an inward year of retreat and self-study', action: 'withdraw into silence to reveal the essential' },
  8: { essence: 'a year of material harvest and earned authority', action: 'ask for the recognition you have earned' },
  9: { essence: 'a year of integrative completion and release', action: 'honour the ending of what has outlived its purpose' },
};

// ─── SYNTHESIS FUNCTION ───────────────────────────────────────────────────────

export function buildCosmicProfile(
  insight: AstroInsightOutput,
  numerology: NumerologyData
): string {
  const { name, western_sign, sign: chineseSign, element } = insight;
  const { psycheNum, destinyNum, missingNumbers = [], arrowsOfStrength = [], birthDay, birthMonth } = numerology;

  const psycheDef = PSYCHIC_NUMBER_MEANINGS[psycheNum]?.description.split('.')[0] || 'carries a unique inner vibration';
  const destinyDef = DESTINY_NUMBER_MEANINGS[destinyNum]?.description.split('.')[0] || 'is oriented toward a specific mission';
  const animalDef = ZOO[chineseSign] || { trait: 'intelligent', gift: 'talent', wound: 'vulnerability', organ: 'energy' };
  
  const currentPY = getCurrentPersonalYear(birthDay, birthMonth);
  const pyData = PERSONAL_YEAR_DIRECTIVE[currentPY] || { essence: 'a period of transition', action: 'stay present' };

  // P1: CORE ESSENCE (Psyche + Western + Animal)
  const para1 = `${name} ${psycheDef}. This core vibration is fused with the ${western_sign} archetype — ${WESTERN_SIGN_ESSENCE[western_sign]} — and is further textured by the ${chineseSign}'s nature: ${animalDef.trait}. The ${element} element ${ELEMENT_PHRASE[element] || 'anchors this expression'}, providing a distinctive medium through which their personality manifests.`;

  // P2: SHADOW & WOUNDS (Missing Nums + Animal Wound)
  const missingPart = missingNumbers.length > 0 
    ? `The Lo Shu Grid reveals specific developmental frontiers through its absences: ${missingNumbers.map(n => MISSING_SHADOW_SNIPPETS[n]).join(', and ')}.`
    : `The Lo Shu Grid is remarkably balanced, distributing challenges evenly across the life path.`;
  const para2 = `${missingPart} Internally, the shadow of the sign manifests as the ${chineseSign}'s characteristic vulnerability to its specific wounds, often reflected physically in the ${animalDef.organ}. Growth requires a conscious integration of these missing frequencies.`;

  // P3: GIFTS & PEAK POWER (Destiny + Arrows + Animal Gift)
  const strengthArrow = arrowsOfStrength[0];
  const arrowPart = strengthArrow ? ` This path is further empowered by the ${ARROW_STRENGTH_SNIPPETS[strengthArrow.id] || 'alignment of core strengths'} in the grid.` : '';
  const para3 = `Regarding mission, ${name} ${destinyDef}.${arrowPart} The ${chineseSign}'s unique gift of ${animalDef.trait} becomes a strategic advantage as the life matures, allowing them to excel in areas that reward their specific type of intelligence.`;

  // P4: TEMPORAL DIRECTION (Personal Year + Directive)
  const para4 = `In the current temporal cycle, ${name} is navigating a Personal Year ${currentPY} — ${pyData.essence}. The immediate cosmic directive is to ${pyData.action}. This period rewards those who align with its specific frequency rather than the habits of previous years.`;

  return [para1, para2, para3, para4].join('\n\n');
}
