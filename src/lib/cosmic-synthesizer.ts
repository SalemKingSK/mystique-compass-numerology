/**
 * @fileoverview MYSTIQUE COMPASS — Cosmic Synthesis Engine
 *
 * A fully deterministic profile synthesizer. No external API calls.
 * Reads every available data field and composes a 4-paragraph
 * narrative character profile using phrase banks keyed to each
 * number, sign, element, and timing combination.
 */

import type { AstroInsightOutput, NumerologyData } from '@/components/profile-generator/types';
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

const PSYCHE_ESSENCE: Record<number, string> = {
  1: 'carries the solar quality of self-authorisation — an inner conviction that their perspective has inherent worth before external confirmation is offered',
  2: 'processes the world through feeling before thought — a lunar sensitivity that registers emotional truth in a room before words are spoken',
  3: 'channels life through an inexhaustible creative intelligence — ideas arrive already formed, connections between unrelated domains feel obvious, expression is as natural as breath',
  4: 'anchors every experience in the material world — they understand instinctively that a vision unrealised is merely a dream, and that structure is not the enemy of freedom but its prerequisite',
  5: 'orbits perpetually at the edge of the known — their nervous system is tuned to novelty, and the moment anything becomes too familiar it begins to feel like a cage',
  6: 'experiences the world as a web of relationships to be tended — beauty, harmony, and the welfare of those they love are not secondary concerns but the primary vocabulary through which meaning is experienced',
  7: 'moves through the world as a permanent interior pilgrim — solitude is not loneliness but a laboratory, and silence is the medium in which their deepest intelligence operates',
  8: 'relates to power the way a conductor relates to an orchestra — their gift is organisation at scale, the capacity to see which forces must be coordinated to produce something larger than any single part',
  9: 'carries the quiet weight of completion — they have seen enough, felt enough, and failed enough to have developed a bone-deep compassion for the human condition that colours every interaction',
};

const PSYCHE_SHADOW: Record<number, string> = {
  1: 'the isolation of always being the architect, the one who sees the whole map while others see only the road immediately ahead',
  2: 'the exhaustion of absorbing every emotional frequency in a room — their sensitivity can equally become a psychic wound when there is no protected space for recovery',
  3: 'the scattering of gifts across so many surfaces that none reaches its full depth — enthusiasm as a substitute for the harder discipline of completion',
  4: 'the risk of mistaking the structure for the life it was built to contain — of becoming so absorbed in maintaining systems that the warmth they were designed to protect grows cold',
  5: 'the restlessness that can never entirely be satisfied — an always-present whisper that the next horizon holds what this one withheld',
  6: 'the compulsion to fix what is broken in others at the cost of acknowledging what is broken in themselves — love as self-erasure rather than genuine gift',
  7: 'the prolonged solitude that can become self-imposed exile — the retreat from a world that cannot fully meet their interior depth',
  8: 'the isolation of operating at a scale that few others can sustain — the loneliness of authority, which mistakes them for their role',
  9: 'the grief that comes with perpetual completion — each ending genuinely mourned, the weight of accumulated experience that cannot be set down',
};

const DESTINY_MISSION: Record<number, string> = {
  1: 'is oriented toward leadership not as dominance but as origination — their purpose is to initiate what would not otherwise exist',
  2: 'is the work of deep collaboration — their life purpose is realised not in solitary achievement but in the quality of what they create with and for others',
  3: 'unfolds through communication in all its forms — writing, speaking, teaching, performing, the transmission of insight and beauty into the world',
  4: 'is the patient construction of things that last — their life\'s work is to build foundations that outlive the moment of creation',
  5: 'is fundamentally a life of transformation — they are here to be changed by their experiences and to act as a catalyst for change in others',
  6: 'is oriented toward healing and creation — their deepest purpose is fulfilled through service that genuinely improves the conditions of those around them',
  7: 'is the pursuit of genuine understanding — not information, but the direct interior knowledge that changes how one sees everything',
  8: 'is the mastery of material reality in service of larger purpose — their life is a study in how power and resources can be wielded with integrity',
  9: 'is ultimately humanitarian — they are here to distil the wisdom of their experience into service that leaves the world better than they found it',
};

const MISSING_SHADOW: Record<number, string> = {
  1: 'the absent 1 creates a recurring gap between internal clarity and verbal self-expression — the most important things frequently go unsaid',
  2: 'the absent 2 means emotional subtext often passes unregistered — they can appear tonally unaware in moments when feeling is the primary language',
  3: 'the absent 3 creates a thin relationship with personal history — patterns recur because experience is not always converted into embodied wisdom',
  4: 'the absent 4 means brilliant visions stall at the implementation stage — the faculty that connects intention to sustained organised action requires conscious development',
  5: 'the absent 5, at the grid\'s centre, creates a tendency toward polarisation — the connective tissue between different domains is thinner than it might be',
  6: 'the absent 6 means the capacity to find meaning in maintenance and the long ordinary care of things has not yet been fully developed',
  7: 'the absent 7 leaves a periodic hollowness that external accomplishment cannot resolve — the contemplative faculty requires deliberate cultivation',
  8: 'the absent 8 creates a complex relationship with material power — money and authority are navigated with more difficulty than intelligence warrants',
  9: 'the absent 9 means sustained ambitious drive is not automatic — the inner ignition system requires conscious activation',
};

const ARROW_STRENGTH_PHRASE: Record<string, string> = {
  'Arrow of the Mind / Mental Plane': 'The Arrow of the Mind marks them as an intellectual powerhouse: systematic, retentive, and capable of processing complexity with ease',
  'Arrow of the Heart / Spiritual Plane': 'The Arrow of the Heart gives them what functions as a built-in emotional compass — they read the truth of a situation through the body',
  'Arrow of Material Success / Practical Plane': 'The Arrow of Material Success marks them as genuinely equipped for worldly achievement: organised, persistent, and grounded',
  'Arrow of Willpower / Golden Yog': 'The Golden Yog confers a specific variety of tenacity: the capacity to sustain consistent direction across the years',
  'Arrow of the Planner / Thought Plane': 'The Planner\'s Arrow marks them as strategically gifted — capable of designing systems that operate effectively over the long term',
  'Arrow of Determination / Will Plane': 'The Arrow of Determination marks them as genuinely unstoppable when genuine purpose is engaged',
  'Arrow of Execution / Action Plane': 'The Action Arrow marks them as a doer who moves from thought to deed without prolonged hesitation',
};

const WESTERN_SIGN_ESSENCE: Record<string, string> = {
  Aries: 'the pioneer — direct, initiating, and equipped with a courage that acts before the rational mind has fully assessed the odds',
  Taurus: 'the sustainer — patient, sensory, and possessed of an endurance that outlasts most challenges',
  Gemini: 'the connector — quick, curious, and capable of holding multiple perspectives simultaneously',
  Cancer: 'the nurturer — deeply feeling, protectively instinctive, and possessed of an emotional intelligence',
  Leo: 'the illuminator — warm, creative, and possessed of a natural authority',
  Virgo: 'the discerner — precise, analytical, and devoted to the craft of doing things well',
  Libra: 'the balancer — aesthetically gifted, relationally oriented, and seeking equilibrium',
  Scorpio: 'the transformer — penetrating, depth-seeking, and equipped with an X-ray vision for the unseen',
  Sagittarius: 'the explorer — philosophically driven, directionally bold, and drawn toward new horizons',
  Capricorn: 'the architect — disciplined, strategically patient, and possessed of a seasoned ambition',
  Aquarius: 'the revolutionary — independent, future-oriented, and incapable of accepting stale convention',
  Pisces: 'the mystic — porous, imaginatively rich, and possessed of a visceral empathic depth',
};

const CHINESE_SIGN_ESSENCE: Record<string, { core: string; gift: string; wound: string }> = {
  Rat: { core: 'quick-witted resourcefulness', gift: 'strategic adaptability', wound: 'an ambient anxiety about shifting ground' },
  Ox: { core: 'patient methodical endurance', gift: 'an extraordinary capacity for sustained effort', wound: 'a stubbornness that mistakes the plan for the purpose' },
  Tiger: { core: 'bold charismatic initiative', gift: 'an inspirational magnetism', wound: 'an impulsivity that moves before the timing is aligned' },
  Rabbit: { core: 'gentle diplomatic sensitivity', gift: 'an aesthetic intelligence and social grace', wound: 'a conflict avoidance that mistakes peace-keeping for engagement' },
  Dragon: { core: 'imperial transformative vision', gift: 'extraordinary creative power', wound: 'a perfectionism that can become crushing' },
  Snake: { core: 'strategic perceptive patience', gift: 'a penetrating intuition', wound: 'a reserve that can be mistaken for coldness' },
  Horse: { core: 'passionate independent vitality', gift: 'an infectious enthusiasm', wound: 'an impatience with the slow middle of journeys' },
  Goat: { core: 'creative empathic gentleness', gift: 'imaginative richness', wound: 'a dependence on environmental harmony' },
  Monkey: { core: 'brilliant improvisational intelligence', gift: 'extraordinary mental agility', wound: 'a restlessness that moves on too quickly' },
  Rooster: { core: 'precise diligence', gift: 'analytical rigour', wound: 'a critical perfectionism' },
  Dog: { core: 'loyal ethical seriousness', gift: 'a fierce protective instinct', wound: 'an anxiety about the world\'s reliability' },
  Pig: { core: 'generous sincere sensuality', gift: 'an open-hearted material generosity', wound: 'a naivety that leaves them vulnerable' },
};

const ELEMENT_PHRASE: Record<string, string> = {
  Wood: 'Wood element gives this energy a quality of organic growth',
  Fire: 'Fire element electrifies this energy — enthusiastic and transformative',
  Earth: 'Earth element grounds this energy in pragmatic wisdom',
  Metal: 'Metal element refines this energy toward precision and principle',
  Water: 'Water element makes this energy fluid and depth-seeking',
};

const PERSONAL_YEAR_NARRATIVE: Record<number, { essence: string; directive: string }> = {
  1: { essence: 'a threshold year of decisive new beginnings', directive: 'identify the primary initiative of the next nine years and take its first step now' },
  2: { essence: 'a year of quiet germination requiring patience', directive: 'deepen one important partnership with genuine attention' },
  3: { essence: 'a year of creative flowering and expression', directive: 'make something that expresses your produce of the last two years' },
  4: { essence: 'a consolidation year demanding structural work', directive: 'commit to one solid financial or health discipline' },
  5: { essence: 'a year of liberation and calculated risks', directive: 'say yes to one opportunity that would usually feel too uncertain' },
  6: { essence: 'a year of creative responsibility and harmony', directive: 'complete one lingering home project or deepen a family commitment' },
  7: { essence: 'an inward, spiritual year requiring solitude', directive: 'prioritise reflection and self-audit over external expansion' },
  8: { essence: 'a year of material harvest and earned authority', directive: 'claim the professional recognition you have genuinely earned' },
  9: { essence: 'a year of completion and graceful release', directive: 'identify what has outgrown its purpose and let it go with gratitude' },
};

const PERSONAL_MONTH_FOCUS: Record<number, string> = {
  1: 'new initiatives', 2: 'patience', 3: 'expression', 4: 'structure',
  5: 'change', 6: 'responsibility', 7: 'retreat', 8: 'advancement', 9: 'completion'
};

// ─── SYNTHESIS FUNCTION ───────────────────────────────────────────────────────

export function buildCosmicProfile(
  insight: AstroInsightOutput,
  numerology: NumerologyData
): string {
  const { name, western_sign, sign: chineseSign, element } = insight;
  const { psycheNum, destinyNum, kuaNum, missingNumbers = [], arrowsOfStrength = [], birthDay, birthMonth } = numerology;

  const chineseData = CHINESE_SIGN_ESSENCE[chineseSign] || { core: 'intelligence', gift: 'talent', wound: 'vulnerability' };
  const animalDef = ZOO[chineseSign] || { organ: 'vitality' };
  const currentPY = getCurrentPersonalYear(birthDay, birthMonth);
  const currentPM = getCurrentPersonalMonth(currentPY);
  const pyData = PERSONAL_YEAR_NARRATIVE[currentPY] || { essence: 'a period of transition', directive: 'stay present' };

  // P1: CORE
  const para1 = `${name} carries a ${chineseSign} at their core — ${chineseData.core}. This merges with the ${western_sign} archetype — ${WESTERN_SIGN_ESSENCE[western_sign]} — and is anchored by ${ELEMENT_PHRASE[element] || 'a distinctive elemental medium'}. Internally, they ${PSYCHE_ESSENCE[psycheNum] || 'carry a unique inner orientation'}.`;

  // P2: SHADOW
  const missingPart = missingNumbers.length > 0 
    ? `The Lo Shu Grid reveals specific developmental frontiers: ${missingNumbers.map(n => MISSING_SHADOW[n]).join(', and ')}.`
    : `The Lo Shu Grid is remarkably balanced, distributing challenges evenly across the life.`;
  const para2 = `${missingPart} Internally, the shadow of the Psyche ${psycheNum} manifests as ${PSYCHE_SHADOW[psycheNum]}. This is compounded by the ${chineseSign}'s characteristic vulnerability to ${chineseData.wound}, often reflected physically in the ${animalDef.organ}.`;

  // P3: GIFTS
  const strengthArrow = arrowsOfStrength.find(a => ARROW_STRENGTH_PHRASE[a.name]);
  const arrowPart = strengthArrow ? ` This path is empowered by ${ARROW_STRENGTH_PHRASE[strengthArrow.name]}.` : '';
  const para3 = `Regarding purpose, ${name} ${DESTINY_MISSION[destinyNum] || 'unfolds through a specific life mission'}.${arrowPart} The ${chineseSign}'s unique gift of ${chineseData.gift} provides a strategic advantage as the life matures.`;

  // P4: TEMPORAL
  const para4 = `In the current cycle, ${name} is navigating a Personal Year ${currentPY} — ${pyData.essence}. Within this, the focus points toward ${PERSONAL_MONTH_FOCUS[currentPM]}. The Kua ${kuaNum} alignment suggests working with the year's natural support rather than against its resistance. The immediate directive is to ${pyData.directive}.`;

  return [para1, para2, para3, para4].join('\n\n');
}
