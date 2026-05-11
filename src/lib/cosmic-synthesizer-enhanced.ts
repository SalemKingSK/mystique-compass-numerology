/**
 * @fileoverview MYSTIQUE COMPASS — Enhanced Cosmic Synthesis Engine
 *
 * This engine provides a deeply integrated, multi-layered narrative character profile
 * by synthesizing insights from Numerology, Chinese Zodiac, Western Astrology,
 * Psychomatrix, Lo Shu Grid, Pinnacles, and Challenges.
 *
 * Output: A comprehensive, multi-paragraph narrative structured to provide
 * specific, actionable insights across various life dimensions.
 */

import type { AstroInsightOutput, NumerologyData } from '@/components/profile-generator/types';
import { PsychomatrixResult, getPsychomatrixCellMeaning, calculatePsychomatrix } from './numerology/data/psychomatrixData';
import type { PsychomatrixLineInterpretation } from './numerology/data/psychomatrixLineInterpretations';
import { PSYCHOMATRIX_LINE_INTERPRETATIONS } from './numerology/data/psychomatrixLineInterpretations';
import { PINNACLE_DESC, CHALLENGE_DESC } from './cosmic-fate/pinnacles';
import { KUA_DATA } from './numerology/data';

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

// ─── PHRASE BANKS (Expanded and Integrated) ───────────────────────────────────

// Existing phrase banks from cosmic-synthesizer.ts will be imported or recreated here.
// For brevity, I'll assume these are available or will be integrated.
// Example: PSYCHE_ESSENCE, PSYCHE_SHADOW, DESTINY_MISSION, etc.

// New phrase banks or expanded existing ones will be added here based on Psychomatrix and other data.

// Placeholder for existing phrase banks (will be replaced with actual imports/definitions)
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

const EXPRESSION_GIFT: Record<number, string> = {
  1: 'a natural originator whose presence inaugurates new directions — others tend to begin things in their wake',
  2: 'a natural diplomat whose gifts include the rare capacity to hold two opposing perspectives simultaneously without needing to resolve the tension prematurely',
  3: 'a natural communicator whose gifts include a wit, charm, and creative fluency that make complex things feel accessible',
  4: 'a natural architect whose gifts include the systematic intelligence to convert abstract vision into concrete reality through sustained methodical effort',
  5: 'a natural catalyst whose gifts include an adaptability and curiosity that allows them to move fluidly across domains others treat as separate',
  6: 'a natural nurturer whose gifts include an aesthetic intelligence and relational warmth that creates beauty and safety wherever they settle',
  7: 'a natural researcher whose gifts include a penetrating analytical depth that cuts to the essential where others remain at the surface',
  8: 'a natural executive whose gifts include an organisational intelligence and material competence that produces tangible results from complex systems',
  9: 'a natural synthesiser whose gifts include an integrative wisdom that recognises the unifying thread running through apparently different experiences',
};

const SOUL_URGE_DRIVE: Record<number, string> = {
  1: 'beneath every choice lies the drive toward authentic self-determination — to live on terms genuinely their own rather than inherited',
  2: 'the deepest motivational current is toward genuine connection — to be truly known by another, and to truly know in return',
  3: 'what drives them most deeply is the need for authentic self-expression — the sense of aliveness that arrives when something genuinely true has been said or made',
  4: 'the underlying drive is toward security built on one\'s own terms — not inherited stability but genuinely earned ground',
  5: 'the deepest hunger is for freedom — not merely the absence of constraint, but the lived expansion of what is possible',
  6: 'the motivational core is love — not the romantic idea but the sustained, daily, unglamorous practice of caring for what has been entrusted to them',
  7: 'the deepest drive is toward understanding — the need to penetrate surface appearances and encounter what is genuinely real',
  8: 'the motivational centre is mastery — the deep satisfaction that comes from genuine competence operating at scale',
  9: 'the fundamental drive is toward meaning that transcends the personal — the need to be part of something larger than individual achievement',
};

const PERSONALITY_MASK: Record<number, string> = {
  1: 'projects a quality of decisive confidence that others find either reassuring or confronting depending on their own relationship with authority',
  2: 'appears to others as a deeply considerate listener — they are often sought as a confidant before they have consciously offered themselves in that role',
  3: 'appears socially gifted — charming, animated, easy in company — in a way that can inadvertently obscure the depth operating beneath the surface',
  4: 'appears reliable and grounded in a way that others instinctively lean on — they become the structural support in rooms they simply intended to pass through',
  5: 'appears energetic, adventurous, and somewhat unpredictable — others sense immediately that they are not easily contained',
  6: 'appears warm, responsible, and genuinely concerned with others\' welfare — they attract those who need care before they have offered it',
  7: 'appears reserved, thoughtful, and slightly unreachable — projecting an interior life that others sense but cannot easily access',
  8: 'appears authoritative and capable in a way that commands immediate attention — whether they intend it or not, they read as someone in charge',
  9: 'appears wise and emotionally spacious in a way that draws people who carry things they have never said aloud to anyone',
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
  'Arrow of Material Success / Practical Plane': 'The Arrow of Material Success — numbers 3, 6, and 9 all present — marks them as a natural builder: someone who converts abstract vision into tangible reality with a consistent, methodical application of effort',
  'Arrow of the Planner / Thought Plane': 'The Planner\'s Arrow marks them as strategically gifted — three steps ahead of most situations, capable of designing systems that operate effectively long after the initial design moment',
  'Arrow of Determination / Will Plane': 'The Arrow of Determination — numbers 9, 5, and 1 running through the grid\'s central column — marks them as genuinely unstoppable when genuine purpose is engaged: patient, focused, and capable of returning from setbacks that would discourage most',
  'Arrow of Execution / Action Plane': 'The Action Arrow marks them as a doer in the deepest sense — someone who moves from thought to deed without the prolonged hesitation that paralysed others; they learn through doing, and doing is where their intelligence fully activates',
};

const ARROW_WEAKNESS_PHRASE: Record<string, string> = {
  'Arrow of the Mind / Mental Plane': 'The absent Mental Arrow marks a genuine challenge with sustained analytical organisation — impulsivity before full deliberation, and a tendency to act on instinct in situations that genuinely reward systematic thought',
  'Arrow of the Heart / Spiritual Plane': 'The absent Heart Arrow means emotional data arrives less immediately than for others — they can appear calmly rational in moments when genuine feeling is the appropriate response, not from coldness but from a gap in the perceptual apparatus',
  'Arrow of Material Success / Practical Plane': 'The absent Material Arrow means brilliant conception regularly stalls before completion — the specific faculty that makes abstract vision practically executable has not yet reached its full development',
  'Arrow of Willpower / Golden Yog': 'Without the Golden Yog, consistency across time requires deliberate effort — the automatic inner drive that sustains others through the long middle of any venture must here be consciously maintained',
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

const COMPOUND_PHRASE: Record<number, string> = {
  10: 'the Compound 10 — Isis and Osiris, the Wheel in motion — marks a life where the self-determined choices carry unusual force: the principle at work here is that this person\'s will specifically shapes their circumstances to an above-average degree',
  11: 'the Compound 11 — The Master Illuminator — marks a life where the individual is a natural channel for higher insight, often experiencing flashes of intuition or moments of profound clarity that bypass linear thought',
  12: 'the Compound 12 — The Sacrificial Lamb — marks a life where the individual is prone to taking on the burdens of others, often at the expense of their own well-being, and must learn to discern genuine service from self-sabotage',
  13: 'the Compound 13 — The Death and Rebirth — marks a life of profound transformation, where endings are often abrupt and painful, but always lead to a more authentic and powerful beginning',
  14: 'the Compound 14 — The Alchemist — marks a life of constant adaptation and change, where the individual learns to transmute difficult experiences into wisdom and growth, often through travel or varied experiences',
  15: 'the Compound 15 — The Magician — marks a life where the individual possesses a natural magnetism and charm, capable of influencing others and manifesting desires, but must guard against manipulation or superficiality',
  16: 'the Compound 16 — The Fallen Tower — marks a life where the individual experiences sudden and often public breakdowns of established structures, forcing them to rebuild on a more authentic foundation',
  17: 'the Compound 17 — The Star — marks a life of hope, inspiration, and healing, where the individual serves as a beacon for others, often through creative expression or spiritual guidance',
  18: 'the Compound 18 — The Moon — marks a life of deep intuition, psychic sensitivity, and connection to the subconscious, but also prone to illusion, self-deception, and emotional turbulence',
  19: 'the Compound 19 — The Sun — marks a life of radiant energy, success, and leadership, where the individual naturally attracts attention and opportunity, but must learn humility and generosity',
  22: 'the Compound 22 — The Master Builder — marks a life of immense potential for large-scale creation and manifestation, capable of bringing grand visions into concrete reality, but requires discipline and groundedness',
  33: 'the Compound 33 — The Master Healer — marks a life dedicated to service and healing on a global scale, embodying unconditional love and compassion, but must learn to protect their own energy and avoid martyrdom',
};

const KUA_ATTRIBUTES_PHRASE: Record<string, string> = {
  Wood: 'Their Kua number aligns with the Wood element, suggesting a personality that thrives on growth, expansion, and a natural ability to initiate new projects. They are often flexible and persistent, like a tree bending in the wind.',
  Fire: 'Influenced by the Fire element, their Kua number indicates a dynamic, passionate, and often charismatic individual. They are natural leaders, full of enthusiasm, but must be mindful of burnout or impulsiveness.',
  Earth: 'With an Earth element Kua, they possess a grounded, stable, and practical nature. They are reliable, nurturing, and build strong foundations, but can sometimes be resistant to change or overly cautious.',
  Metal: 'The Metal element in their Kua number points to a personality that values precision, structure, and justice. They are often decisive and principled, but may need to soften their approach to avoid rigidity.',
  Water: 'A Water element Kua suggests a fluid, adaptable, and deeply intuitive individual. They are perceptive and empathetic, capable of navigating complex emotional landscapes, but must guard against being overly passive or easily influenced.',
  East: 'Their Kua number places them in the East Group, indicating a natural affinity for personal growth, health, and harmonious relationships. They tend to be more introspective and seek inner balance.',
  West: 'Belonging to the West Group Kua, they are often more outwardly focused, driven by ambition, and seek material success and recognition. They are typically strong-willed and goal-oriented.',
};

// ─── PSYCHOMATRIX SPECIFIC PHRASE BANKS ───────────────────────────────────────

const PSYCHOMATRIX_ZERO_ANALYSIS_PHRASE: Record<string, string> = {
  hasAnyZero: 'The presence of zeros in their Psychomatrix suggests a unique karmic lesson related to emptiness, loss, or the potential for profound truth. These individuals often encounter situations that challenge their perceptions of reality, forcing them to confront the void and find meaning within it.',
  hasZeroInDate: 'A zero within their birth date itself indicates a predisposition towards professions that uphold laws or structures, such as law enforcement, civil engineering, or design. They are often tasked with bringing order to chaos.',
  hasZeroInFirstOrSecond: 'Zeros in the first or second working numbers point to a life path where they must actively discover universal laws and comprehend deeper truths. This journey may involve periods of intense self-discovery and a need to avoid escaping from knowledge.',
  hasZeroInThirdOrFourth: 'The presence of zeros in the third or fourth working numbers suggests that fundamental laws or truths underpin all their actions. This often leads them towards careers in science, legislative activities, or roles of significant influence and judgment.',
};

const PSYCHOMATRIX_LINE_QUALITY_PHRASE: Record<string, string> = {
  row_1: 'Row 1 (1, 4, 7) — **Purpose & Will**: This line signifies their drive, determination, and ability to set and achieve goals. A strong presence here indicates a powerful will to manifest their desires, while an absence may suggest a reliance on others for direction.',
  row_2: 'Row 2 (2, 5, 8) — **Family & Attachment**: This line reveals their orientation towards family, relationships, and emotional bonds. A strong emphasis here suggests a nurturing and connected individual, while a weaker presence might indicate challenges in forming deep attachments.',
  row_3: 'Row 3 (3, 6, 9) — **Habits & Stability**: This line reflects their daily routines, habits, and overall stability. A balanced line suggests consistent effort and a structured life, whereas an imbalance can point to erratic behavior or a struggle with discipline.',
  col_1: 'Column 1 (1, 2, 3) — **Self-Esteem**: This column indicates their self-perception, confidence, and ability to assert themselves. A strong column suggests high self-worth and leadership qualities, while a weaker one may point to self-doubt or a need for external validation.',
  col_2: 'Column 2 (4, 5, 6) — **Talent & Work**: This column highlights their practical talents, work ethic, and ability to create. A strong column signifies a skilled and diligent individual, while a weaker one might suggest challenges in practical application or finding their true calling.',
  col_3: 'Column 3 (7, 8, 9) — **Temperament & Stability**: This column reveals their temperament, emotional stability, and spiritual connection. A strong column indicates a balanced and resilient individual, while a weaker one may suggest emotional volatility or a search for deeper meaning.',
  diag_spirit: 'Diagonal (1, 5, 9) — **Spiritual Line**: This diagonal represents their spiritual aspirations, intuition, and connection to higher consciousness. A strong line suggests a profound inner life and spiritual awareness, while a weaker one may indicate a more materialistic focus.',
  diag_carnal: 'Diagonal (3, 5, 7) — **Carnal Line**: This diagonal reflects their connection to the material world, physical desires, and practical manifestation. A strong line indicates a grounded and resourceful individual, while a weaker one may suggest a detachment from worldly concerns or practical challenges.',
};

// ─── MAIN SYNTHESIS FUNCTION ──────────────────────────────────────────────────

export function buildCosmicProfile(name: string, astroInsight: AstroInsightOutput, numerologyData: NumerologyData): string {
  const { birthDay, birthMonth, birthYear, gender } = astroInsight.input;
  const { western_sign, sign: chineseSign, element: chineseElement, new_astrology_sign } = astroInsight;
  const { psycheNum, destinyNum, compoundNum, reducedCompoundNum, karmicFateNum, numberCounts, arrowsOfStrength, arrowsOfWeakness, kuaNum, kuaAttributes } = numerologyData;

  const currentPY = getCurrentPersonalYear(birthDay, birthMonth);
  const currentPM = getCurrentPersonalMonth(currentPY);

  // Calculate Psychomatrix data
  const psychomatrixResult = calculatePsychomatrix(birthDay, birthMonth, birthYear);
  const { cellReadings, activeLines, zeroAnalysis } = psychomatrixResult;

  // ── PARAGRAPH 1: CORE ESSENCE & ARCHETYPE ────────────────────────────────────
  let para1 = `**Core Essence & Archetype:**\n\n`;
  const chineseData = CHINESE_SIGN_ESSENCE[chineseSign];
  para1 += `${name} embodies the **${chineseSign}** archetype, characterized by ${chineseData.core}.\n`;
  para1 += `This is further nuanced by the **${western_sign}** influence, which brings forth ${WESTERN_SIGN_ESSENCE[western_sign]}.\n`;
  if (chineseElement) {
    para1 += `${ELEMENT_PHRASE[chineseElement]}.\n`;
  }
  para1 += `At their deepest psychological level, they ${PSYCHE_ESSENCE[psycheNum]}.\n`;
  para1 += `Their outward persona often ${PERSONALITY_MASK[psycheNum]}.\n`;

  // ── PARAGRAPH 2: INNER DRIVES & LIFE MISSION ─────────────────────────────────
  let para2 = `\n\n**Inner Drives & Life Mission:**\n\n`;
  para2 += `A fundamental drive for them is ${SOUL_URGE_DRIVE[psycheNum]}.\n`;
  para2 += `Their life\'s mission, guided by their Destiny Number **${destinyNum}**, ${DESTINY_MISSION[destinyNum]}.\n`;
  para2 += `They are a natural ${EXPRESSION_GIFT[psycheNum]}.\n`;
  if (compoundNum) {
    para2 += `The Compound Number **${compoundNum}** further elaborates: ${COMPOUND_PHRASE[compoundNum]}.\n`;
  } else if (reducedCompoundNum) {
    para2 += `Their Reduced Compound Number **${reducedCompoundNum}** suggests: ${COMPOUND_PHRASE[reducedCompoundNum]}.\n`;
  }
  if (karmicFateNum) {
    para2 += `A significant karmic influence is indicated by the Karmic Fate Number **${karmicFateNum}**, suggesting a pattern arriving from previous cycles of experience.\n`;
  }

  // ── PARAGRAPH 3: STRENGTHS, CHALLENGES & PSYCHOMATRIX INSIGHTS ───────────────
  let para3 = `\n\n**Strengths, Challenges & Psychomatrix Insights:**\n\n`;
  if (arrowsOfStrength.length > 0) {
    para3 += `Their inherent strengths include: ${arrowsOfStrength.map(a => `==${a.name}== (${ARROW_STRENGTH_PHRASE[a.name]})`).join(', ')}.\n`;
  }
  if (arrowsOfWeakness.length > 0) {
    para3 += `Conversely, areas requiring conscious development are: ${arrowsOfWeakness.map(a => `==${a.name}== (${ARROW_WEAKNESS_PHRASE[a.name]})`).join(', ')}.\n`;
  }

  // Psychomatrix Line Analysis
  if (activeLines.length > 0) {
    para3 += `The Psychomatrix reveals active energetic lines: ${activeLines.map(lineId => {
      const lineDef = PSYCHOMATRIX_LINE_INTERPRETATIONS.find(l => l.id === lineId);
      return lineDef ? `**${lineDef.name}** (${PSYCHOMATRIX_LINE_QUALITY_PHRASE[lineId]})` : '';
    }).filter(Boolean).join(', ')}.\n`;
  }

  // Psychomatrix Cell Readings (example for a few key cells)
  const psycheCell = cellReadings.find(c => c.digit === psycheNum);
  if (psycheCell && psycheCell.count > 0) {
    para3 += `Their Psychic Number **${psycheNum}** manifests with a **${psycheCell.label}** intensity in the Psychomatrix, indicating: ${psycheCell.verbatim}.\n`;
  }
  const destinyCell = cellReadings.find(c => c.digit === destinyNum);
  if (destinyCell && destinyCell.count > 0) {
    para3 += `The Destiny Number **${destinyNum}** shows a **${destinyCell.label}** presence, reflecting: ${destinyCell.verbatim}.\n`;
  }

  // Zero Analysis
  if (zeroAnalysis.hasAnyZero) {
    para3 += `The presence of zeros in their Psychomatrix carries a profound meaning: ${PSYCHOMATRIX_ZERO_ANALYSIS_PHRASE.hasAnyZero}.\n`;
    zeroAnalysis.interpretations.forEach(interp => {
      if (interp.includes('date of birth itself')) para3 += `${PSYCHOMATRIX_ZERO_ANALYSIS_PHRASE.hasZeroInDate}.\n`;
      else if (interp.includes('first or second additional number')) para3 += `${PSYCHOMATRIX_ZERO_ANALYSIS_PHRASE.hasZeroInFirstOrSecond}.\n`;
      else if (interp.includes('third or fourth additional number')) para3 += `${PSYCHOMATRIX_ZERO_ANALYSIS_PHRASE.hasZeroInThirdOrFourth}.\n`;
    });
  }

  // ── PARAGRAPH 4: CURRENT TIMING & DIRECTIVE ──────────────────────────────────
  let para4 = `\n\n**Current Timing & Directive:**\n\n`;
  const pyData = PERSONAL_YEAR_NARRATIVE[currentPY];
  const pmFocus = PERSONAL_MONTH_FOCUS[currentPM];

  if (pyData) {
    para4 += `Currently, they are in a Personal Year **${currentPY}** — ${pyData.essence}.\n`;
    para4 += `The primary directive for this year is to: ${pyData.directive}.\n`;
  }
  if (pmFocus) {
    para4 += `This month, the focus narrows to Personal Month **${currentPM}**, where ${pmFocus}.\n`;
  }

  // Pinnacles and Challenges for current age
  const age = new Date().getFullYear() - birthYear;
  let activePinnacleNum: number | undefined;
  let activeChallengeNum: number | undefined;

  // Logic to determine active Pinnacle and Challenge based on age (simplified for example)
  // This would ideally come from numerologyData or a dedicated function
  if (age <= 30) { activePinnacleNum = 1; activeChallengeNum = 1; } // Example
  else if (age <= 39) { activePinnacleNum = 2; activeChallengeNum = 2; } // Example
  else if (age <= 48) { activePinnacleNum = 3; activeChallengeNum = 3; } // Example
  else { activePinnacleNum = 4; activeChallengeNum = 4; } // Example

  if (activePinnacleNum && PINNACLE_DESC[activePinnacleNum]) {
    para4 += `Their current life stage is shaped by Pinnacle **${activePinnacleNum}**: ${PINNACLE_DESC[activePinnacleNum]}.\n`;
  }
  if (activeChallengeNum && CHALLENGE_DESC[activeChallengeNum]) {
    para4 += `The prevailing Challenge is **${activeChallengeNum}**: ${CHALLENGE_DESC[activeChallengeNum]}.\n`;
  }

  // Kua Number insights
  if (kuaNum && kuaAttributes.element) {
    para4 += `Their Kua Number **${kuaNum}** aligns with the ${kuaAttributes.element} element, suggesting: ${KUA_ATTRIBUTES_PHRASE[kuaAttributes.element]}.\n`;
    if (kuaAttributes.group) {
      para4 += `Belonging to the ${kuaAttributes.group} Group, they are often ${KUA_ATTRIBUTES_PHRASE[kuaAttributes.group]}.\n`;
    }
  }

  return [para1, para2, para3, para4].join('');
}
