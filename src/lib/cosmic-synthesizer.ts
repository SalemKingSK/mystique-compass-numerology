
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
  2: 'the exhaustion of absorbing every emotional frequency in a room — their sensitivity, which is their greatest gift, can equally become a psychic wound when there is no protected space for recovery',
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
  7: 'is the pursuit of genuine understanding — not information, not credentials, but the direct interior knowledge that changes how one sees everything',
  8: 'is the mastery of material reality in service of larger purpose — their life is a study in how power and resources can be wielded with integrity',
  9: 'is ultimately humanitarian — they are here to distil the wisdom of their experience into service that leaves the world better than they found it',
};

const MISSING_SHADOW: Record<number, string> = {
  1: 'the absent 1 creates a recurring gap between internal clarity and verbal self-expression — the most important things frequently go unsaid, and the voice constricts precisely when the stakes are highest',
  2: 'the absent 2 means emotional subtext often passes unregistered — they can appear tonally unaware in moments when feeling is the primary language',
  3: 'the absent 3 creates a thin relationship with personal history — patterns recur because the memory faculty that converts experience into embodied wisdom operates below its potential',
  4: 'the absent 4 means brilliant visions stall at the implementation stage — the faculty that connects intention to sustained organised action requires conscious development',
  5: 'the absent 5, at the grid\'s centre, creates a tendency toward polarisation — the connective tissue between life\'s different domains is thinner than it might be, producing swings rather than integration',
  6: 'the absent 6 means the capacity to find meaning in maintenance, repetition, and the long ordinary care of things has not yet been fully developed',
  7: 'the absent 7 leaves a periodic hollowness that external accomplishment cannot resolve — the contemplative faculty that generates genuine answers to \'why does this matter?\' requires deliberate cultivation',
  8: 'the absent 8 creates a complex relationship with material power — money, authority, and organisational scale are navigated with more difficulty than their genuine intelligence warrants',
  9: 'the absent 9 means sustained ambitious drive is not automatic — the inner ignition system that makes long-term effort feel worth its cost requires conscious activation',
};

const ARROW_STRENGTH_PHRASE: Record<string, string> = {
  'Arrow of the Mind / Mental Plane': 'The Arrow of the Mind — numbers 4, 9, and 2 all present — marks them as an intellectual powerhouse: systematic, retentive, capable of processing complexity with an ease that appears effortless to observers',
  'Arrow of the Heart / Spiritual Plane': 'The Arrow of the Heart draws all three feeling-plane numbers into alignment, giving them what functions as a built-in emotional compass — they read the truth of a situation through the body before the mind confirms it',
  'Arrow of Material Success / Practical Plane': 'The Arrow of Material Success — numbers 8, 1, and 6 all present — marks them as genuinely equipped for worldly achievement: organised, persistent, and grounded in the practical intelligence that converts vision into tangible result',
  'Arrow of Willpower / Golden Yog': 'The Golden Yog — one of the rarest formations in Lo Shu analysis — confers a specific variety of tenacity: the capacity to sustain consistent direction across the years that lesser formations abandon',
  'Arrow of the Planner / Thought Plane': 'The Planner\'s Arrow marks them as strategically gifted — three steps ahead of most situations, capable of designing systems that operate effectively long after the initial design moment',
  'Arrow of Determination / Will Plane': 'The Arrow of Determination — numbers 9, 5, and 1 running through the grid\'s central column — marks them as genuinely unstoppable when genuine purpose is engaged: patient, focused, and capable of returning from setbacks that would discourage most',
  'Arrow of Execution / Action Plane': 'The Action Arrow marks them as a doer in the deepest sense — someone who moves from thought to deed without the prolonged hesitation that paralysed others; they learn through doing, and doing is where their intelligence fully activates',
};

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

const CHINESE_SIGN_ESSENCE: Record<string, { core: string; gift: string; wound: string }> = {
  Rat: { core: 'quick-witted resourcefulness and an instinctive intelligence that finds the exit from any maze', gift: 'strategic adaptability and the capacity to read a shifting situation faster than most', wound: 'an ambient anxiety that the ground underfoot, however solid it appears, might shift' },
  Ox: { core: 'patient, methodical endurance — the power that outlasts through consistency rather than through force', gift: 'an extraordinary capacity for sustained effort that transforms what others abandon as impossible into quiet reality', wound: 'a stubbornness that can mistake the map for the territory, the plan for the purpose it was meant to serve' },
  Tiger: { core: 'bold, charismatic initiative — the energy that enters a room before the person does', gift: 'an inspirational magnetism that mobilises others toward worthwhile action, and a courage that genuinely does not calculate the odds', wound: 'an impulsivity that moves before the timing is fully aligned — the wound of the perpetually early arrival' },
  Rabbit: { core: 'gentle, diplomatic sensitivity — a creature of nuance who navigates the emotional weather of every situation with exquisite antennae', gift: 'an aesthetic intelligence and social grace that creates harmony where there was friction, and beauty where there was plainness', wound: 'a conflict avoidance that can mistake peace-keeping for honest engagement, silencing the truth to protect the atmosphere' },
  Dragon: { core: 'imperial, transformative vision — the force that does not merely participate in the world but reorders it according to an inner image', gift: 'an extraordinary creative power and natural authority that others instinctively follow when the direction is genuinely clear', wound: 'a perfectionism and enormity of self-expectation that can become crushing — the Dragon who cannot rest because the vision is never fully achieved' },
  Snake: { core: 'strategic, perceptive patience — the wisdom that waits for the right moment and sees the outcome before the action has fully begun', gift: 'a penetrating intuition that reads the hidden architecture of situations, and a strategic intelligence that plans several moves ahead', wound: 'a reserve that can be mistaken for coldness, and a desire for control that sometimes holds on when release would serve better' },
  Horse: { core: 'passionate, independent vitality — an energy that belongs to the open road rather than the stable', gift: 'an infectious enthusiasm and a genuine freedom of spirit that refuses to be entirely domesticated by circumstance', wound: 'an impatience with the slow middle of any journey — the Horse who has already reached the destination in imagination before the road has been walked' },
  Goat: { core: 'creative, empathic gentleness — a sensitivity that experiences beauty and suffering with equal intensity', gift: 'an imaginative richness and emotional intelligence that produces art, insight, and a quality of care that genuine creativity requires', wound: 'a dependence on environmental harmony that can make chaos feel existentially threatening rather than merely inconvenient' },
  Monkey: { core: 'brilliant, improvisational intelligence — the mind that delights in complexity for its own sake', gift: 'an extraordinary mental agility that solves problems others cannot even properly formulate, and a wit that makes difficulty feel temporarily lighter', wound: 'a restlessness that moves to the next interesting problem before the current one has been fully resolved' },
  Rooster: { core: 'precise, diligent, and deeply committed to standards that others would find exhausting to maintain', gift: 'an analytical rigour and a capacity for honest assessment that, at its best, improves everything it touches', wound: 'a critical perfectionism that sets standards for the self that would exhaust a saint, and for others that can feel like perpetual disappointment' },
  Dog: { core: 'loyal, just, and possessed of an ethical seriousness that holds the world to account', gift: 'a fierce protective instinct for those they love, and an honesty that will not be compromised even when compromise would be comfortable', wound: 'an anxiety about the world\'s reliability that can tip into pessimism — the Dog who expects abandonment even when surrounded by genuine loyalty' },
  Pig: { core: 'generous, sensual, and possessed of an innocent trust in the goodness of experience', gift: 'an open-heartedness and material generosity that creates abundance in those around them, and a capacity for pure enjoyment that others find genuinely infectious', wound: 'a naivety that can persist past the age at which it serves protection, leaving them vulnerable to those who mistake their generosity for weakness' },
};

const ELEMENT_PHRASE: Record<string, string> = {
  Wood: 'Wood element gives this energy a quality of organic growth — patient expansion that works with natural timing rather than against it, bending without breaking',
  Fire: 'Fire element electrifies this energy — enthusiastic, illuminating, consuming, and capable of transformation through intensity',
  Earth: 'Earth element grounds this energy in pragmatic wisdom — stable, containing, and oriented toward the tangible results that abstractions must eventually become',
  Metal: 'Metal element refines this energy toward precision and principle — cutting away the inessential to reveal the essential, holding to standards with an elegant inflexibility',
  Water: 'Water element makes this energy fluid and depth-seeking — adaptable on the surface, profoundly moving underneath, and possessed of a wisdom that comes from continuous contact with what is',
};

const PERSONAL_YEAR_NARRATIVE: Record<number, { essence: string; directive: string }> = {
  1: { essence: 'a threshold year — the cycle resets, and whatever is initiated now carries the genetic blueprint of the entire next nine-year arc. The energy rewards decisive new beginnings and penalises passive waiting', directive: 'identify the single most important initiative of the next nine years and take its first concrete step before this calendar year closes' },
  2: { essence: 'a year of quiet germination — the seed planted in Year 1 requires patience, cooperation, and the specific intelligence of receptivity. Nothing significant should be forced; everything should be prepared', directive: 'deepen one important partnership — romantic, professional, or creative — with genuine attention rather than strategic purpose' },
  3: { essence: 'a year of creative flowering — the two previous years of invisible cultivation break into visible bloom. Communication, expression, and joyful engagement with life\'s creative dimension are specifically rewarded', directive: 'make something — write, speak, build, or perform something that expresses what the previous two years of growth has produced' },
  4: { essence: 'a consolidation year — the harvest of the upcoming peak requires foundations that can bear the weight. This year rewards methodical, unglamorous structural work and punishes impatient overreach', directive: 'choose one primary foundation — financial, health, creative, or relational — and commit to it with complete consistency for the remainder of this year' },
  5: { essence: 'a year of liberation — the foundations laid in Year 4 now provide the stable platform from which genuine freedom of movement becomes possible. Change, travel, and expanding the range of experience are specifically supported', directive: 'say yes to one opportunity that in any other year would feel too uncertain — the Year 5 energy specifically rewards calculated risk' },
  6: { essence: 'a year of creative responsibility — relationships, home, and long-term creative projects receive the year\'s strongest support. New commitments formed now tend to have real staying power', directive: 'complete one creative project or deepen one committed relationship that has been waiting for genuine attention' },
  7: { essence: 'an inward year — the most spiritually demanding of the cycle, requiring retreat, study, and the specific courage of sitting with uncertainty. Major external changes initiated now tend to create more disruption than progress', directive: 'schedule regular periods of genuine solitude — not passive rest but active interior investigation — and use them to clarify what is actually essential in the life' },
  8: { essence: 'a year of material harvest — what has been genuinely built in the previous seven years is now available for recognition, expansion, and elevated authority. This year rewards competence and punishes performance without substance', directive: 'ask for what has been genuinely earned — a raise, a promotion, a commitment, a recognition that has been withheld out of diffidence rather than absence of merit' },
  9: { essence: 'a year of completion — the nine-year cycle reaches its culmination, and what has outgrown its purpose is releasing itself whether or not it is consciously released. The energy rewards graceful endings and punishes clinging', directive: 'identify the single most important thing that is completing itself this year — a relationship, a project, a phase of identity — and honour its ending with full consciousness rather than avoidance' },
};

const PERSONAL_MONTH_FOCUS: Record<number, string> = {
  1: 'new initiatives and fresh perspectives deserve immediate attention this month',
  2: 'cooperation, patience, and emotional attunement are the month\'s primary currencies',
  3: 'creative expression and communication deserve priority',
  4: 'practical organisation and structural consolidation are the month\'s specific rewards',
  5: 'unexpected opportunity and necessary change are the month\'s defining features',
  6: 'relational commitments and creative responsibilities demand honest attention',
  7: 'interior work, study, and strategic withdrawal serve better than aggressive engagement',
  8: 'material and professional advancement are specifically supported',
  9: 'completion and release are the month\'s defining movements',
};

// ─── SYNTHESIS FUNCTION ───────────────────────────────────────────────────────

export function buildCosmicProfile(
  insight: AstroInsightOutput,
  numerology: NumerologyData
): string {
  const { name, western_sign, sign: chineseSign, element } = insight;
  const { psycheNum, destinyNum, missingNumbers = [], arrowsOfStrength = [], birthDay, birthMonth } = numerology;

  const chineseData = CHINESE_SIGN_ESSENCE[chineseSign] || { core: 'intelligence', gift: 'talent', wound: 'vulnerability' };
  const currentPY = getCurrentPersonalYear(birthDay, birthMonth);
  const currentPM = getCurrentPersonalMonth(currentPY);
  const pyData = PERSONAL_YEAR_NARRATIVE[currentPY] || { essence: 'a period of transition', directive: 'stay present' };

  // P1: CORE
  const para1 = `${name} carries a ${chineseSign} at their core — ${chineseData.core}. This merges with the ${western_sign} archetype — ${WESTERN_SIGN_ESSENCE[western_sign]} — and is anchored by ${ELEMENT_PHRASE[element] || 'a distinctive elemental medium'}. Internally, they ${PSYCHE_ESSENCE[psycheNum] || 'carry a unique inner orientation'}.`;

  // P2: SHADOW
  const missingPart = missingNumbers.length > 0 
    ? `The Lo Shu Grid reveals specific developmental frontiers: ${missingNumbers.map(n => MISSING_SHADOW[n]).join(', and ')}.`
    : `The Lo Shu Grid is remarkably balanced, distributing challenges evenly across the life.`;
  const para2 = `${missingPart} Internally, the shadow of the Psyche ${psycheNum} manifests as ${PSYCHE_SHADOW[psycheNum]}. This is compounded by the ${chineseSign}'s characteristic vulnerability to ${chineseData.wound}.`;

  // P3: GIFTS
  const strengthArrow = arrowsOfStrength.find(a => ARROW_STRENGTH_PHRASE[a.name]);
  const arrowPart = strengthArrow ? ` This path is empowered by ${ARROW_STRENGTH_PHRASE[strengthArrow.name]}.` : '';
  const para3 = `Regarding purpose, ${name} ${DESTINY_MISSION[destinyNum] || 'unfolds through a specific life mission'}.${arrowPart} The ${chineseSign}'s unique gift of ${chineseData.gift} provides a strategic advantage as the life matures.`;

  // P4: TEMPORAL
  const para4 = `In the current cycle, ${name} is navigating a Personal Year ${currentPY} — ${pyData.essence}. Within this, the focus points toward ${PERSONAL_MONTH_FOCUS[currentPM]}. The immediate directive is to ${pyData.directive}.`;

  return [para1, para2, para3, para4].join('\n\n');
}
