'use client';

/**
 * @fileoverview ALEXANDROV'S PSYCHOMATRIX — Complete Line & Column Interpretations
 * Quantitative Scale for All Lines, Columns, and Diagonals
 *
 * Based on the original teachings of Professor A. Alexandrov
 * Expanded with full per-count scale descriptions (0 through 6+)
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type LineScaleLevel =
  | 'absent'     // 0 digits
  | 'very-weak'  // 1 digit
  | 'norm'       // 2 digits
  | 'special'    // 3 digits
  | 'strong'     // 4 digits
  | 'dominant'   // 5 digits
  | 'overload';  // 6+ digits

export interface LineCountInterpretation {
  count: number;
  label: string;
  verbatim: string;
  scale: LineScaleLevel;
}

export interface PsychomatrixLineInterpretation {
  id: string;
  type: 'row' | 'column' | 'diagonal';
  digits: number[];
  name: string;
  quality: string;
  captionNote: string;
  levels: LineCountInterpretation[];
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: resolve interpretation from a raw line digit-count total
// ─────────────────────────────────────────────────────────────────────────────

export function getLineInterpretation(
  lineId: string,
  totalDigits: number
): LineCountInterpretation | undefined {
  const lineDef = PSYCHOMATRIX_LINE_INTERPRETATIONS.find(l => l.id === lineId);
  if (!lineDef) return undefined;
  const capped = Math.min(totalDigits, 6);
  return (
    lineDef.levels.find(l => l.count === capped) ??
    lineDef.levels[lineDef.levels.length - 1]
  );
}

export function computeLineTotal(
  lineDigits: number[],
  counts: Record<number, number>
): number {
  return lineDigits.reduce((sum, d) => sum + (counts[d] || 0), 0);
}

export function getLineLevel(lineId: string, totalCount: number): LineCountInterpretation {
  return getLineInterpretation(lineId, totalCount) || { 
    count: 0, 
    label: 'Unknown', 
    verbatim: 'No data available for this level.', 
    scale: 'absent' 
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DATA — VERBATIM ALEXANDROV
// ─────────────────────────────────────────────────────────────────────────────

export const PSYCHOMATRIX_LINE_INTERPRETATIONS: PsychomatrixLineInterpretation[] = [
  {
    id: 'row_1',
    type: 'row',
    digits: [1, 4, 7],
    name: 'Purpose',
    quality: 'Purposefulness — Goal Setting & Achievement',
    captionNote:
      'Determines the presence of purposefulness as a quality of a person\'s character. The value of purposefulness as a personal characteristic is difficult to overestimate, since it is this parameter that depends on the correspondence of our desires and capabilities. After all, it is not a matter of financial well-being, but of the strength of desire, the general mood to achieve the goal.',
    levels: [
      { count: 0, label: 'Quality Absent', scale: 'absent', verbatim: 'Purposefulness is absent, poorly developed, or not used by the person. There is extreme difficulty in setting and maintaining goals. The person drifts through life without a rudder.' },
      { count: 1, label: 'Very Weak (Imitated)', scale: 'very-weak', verbatim: 'Purposefulness is very weakly developed. It is actively "advertised" and "imitated" for show, but the internal drive dissipates quickly under pressure.' },
      { count: 2, label: 'Norm (Balanced)', scale: 'norm', verbatim: 'Purposefulness is given in norm — developed and actively used. The person needs time to discover their capabilities before setting worthy goals.' },
      { count: 3, label: 'Special Sign "Extra"', scale: 'special', verbatim: 'The person includes this quality urgently, accidentally, unexpectedly, spontaneously, or suddenly. Drive arrives in powerful but unpredictable bursts.' },
      { count: 4, label: 'Strongly Developed', scale: 'strong', verbatim: 'The quality is strongly developed, but does not suppress other qualities. This is a robust engine for achievement that respects the human context.' },
      { count: 5, label: 'Dominant (Relentless)', scale: 'dominant', verbatim: 'Purposefulness is developed maximally strongly. it dominates over other qualities, often suppressing them. Commitment of a leader without pragmatism becomes unreasonable ambition.' },
      { count: 6, label: 'Overload (Inversion)', scale: 'overload', verbatim: 'Overload of purposefulness occurs. It begins to change to the opposite — from strong turns into weak, hidden, or suppressed. Ambition consumes the ability to act.' }
    ],
  },
  {
    id: 'row_2',
    type: 'row',
    digits: [2, 5, 8],
    name: 'Family',
    quality: 'Family Orientation — Desire to Build Relationships',
    captionNote:
      'Shows how strong a person\'s desire to create a family is, the desire to build a relationship system based on close interaction with the opposite sex. The family is a complex system that includes reproductive, economic, psychological, and creative functions.',
    levels: [
      { count: 0, label: 'Quality Absent', scale: 'absent', verbatim: 'The specific drive toward family structures is absent. It is pointless to "educate" these qualities in this person; pressure will only push them further away.' },
      { count: 1, label: 'Very Weak (Imitated)', scale: 'very-weak', verbatim: 'Family orientation is very weakly developed. The person may "advertise" a desire for a home life for social approval, while internally remaining unattached.' },
      { count: 2, label: 'Norm (Balanced)', scale: 'norm', verbatim: 'Normal family orientation. The person values domestic ties and relationships, using them as a stable foundation for their life.' },
      { count: 3, label: 'Special Sign "Extra"', scale: 'special', verbatim: 'Spontaneous family commitment. The person may suddenly pivot from isolation to deep domestic involvement without warning.' },
      { count: 4, label: 'Strongly Developed', scale: 'strong', verbatim: 'A strong attachment to family and family responsibilities falls on this person\'s shoulders. They are a pillar of the domestic sphere.' },
      { count: 5, label: 'Dominant (Suffocating)', scale: 'dominant', verbatim: 'Family orientation is maximally strong. It dominates other life domains, potentially leading to over-involvement or relational enmeshment.' },
      { count: 6, label: 'Overload (Inversion)', scale: 'overload', verbatim: 'Overload occurs. The desire for family collapses into its opposite, leading to a hidden or suppressed relationship with domesticity.' }
    ],
  },
  {
    id: 'row_3',
    type: 'row',
    digits: [3, 6, 9],
    name: 'Stability',
    quality: 'Stability of Character — Resistance to Change',
    captionNote:
      'The indicators of the stability of a person\'s character. They describe the balance between usual habits and certain thinking, on the one hand, and the desire for change, on the other. This is the measure of reliability.',
    levels: [
      { count: 0, label: 'Quality Absent', scale: 'absent', verbatim: 'Total lack of habitual stability. The person is in a state of perpetual flux, which can be experienced as groundlessness by those around them.' },
      { count: 1, label: 'Very Weak (Imitated)', scale: 'very-weak', verbatim: 'Stability is weakly developed. The person imitates consistency to appear reliable, but agreements often drift when the audience leaves.' },
      { count: 2, label: 'Norm (Balanced)', scale: 'norm', verbatim: 'Healthy stability. The person has reliable habits and preferences but remains open to necessary change. Ideally, partners should differ by no more than 2 digits here.' },
      { count: 3, label: 'Special Sign "Extra"', scale: 'special', verbatim: 'Unexpected stability. Iron-clad habits may erupt suddenly after a period of total chaos, or a long-standing structure may be released without warning.' },
      { count: 4, label: 'Strongly Stable', scale: 'strong', verbatim: 'Very stable habits and rituals. The person finds deep comfort in routine and provides a steady, consistent presence for others.' },
      { count: 5, label: 'Dominant (Rigid)', scale: 'dominant', verbatim: 'Stability dominates the personality. Habit becomes a supreme organizing value, potentially leading to resistance against even beneficial change.' },
      { count: 6, label: 'Overload (Inversion)', scale: 'overload', verbatim: 'The person seeks to surround themselves with so many habits that they begin to abandon them as soon as they interfere with life. Sudden rebellion against one\'s own structures.' }
    ],
  },
  {
    id: 'col_1',
    type: 'column',
    digits: [1, 2, 3],
    name: 'Self-Esteem',
    quality: 'Self-Esteem — Personal Confidence & Appraisal',
    captionNote:
      'A numerical indicator of the level of self-esteem. Hardly any other parameter is more important in the context of a person\'s desire to realize his own potential. It determines the courage to act.',
    levels: [
      { count: 0, label: 'Quality Absent', scale: 'absent', verbatim: 'Absence of self-esteem means no internal anchor for self-valuation. The person is entirely dependent on the fluctuating opinions of others.' },
      { count: 1, label: 'Very Weak (Compensated)', scale: 'very-weak', verbatim: 'Low self-esteem is compensated by outward display. The person vigorously advertises their worth to generate the confidence they lack within.' },
      { count: 2, label: 'Norm (Balanced)', scale: 'norm', verbatim: 'Healthy self-appraisal. The person knows their strengths and shortcomings and can hold both without shame or inflation.' },
      { count: 3, label: 'Special Sign "Extra"', scale: 'special', verbatim: 'Spontaneous self-esteem. Confidence arrives in flashes of brilliance, alternating with periods of profound, unearned self-doubt.' },
      { count: 4, label: 'Strongly Developed', scale: 'strong', verbatim: 'Grounded and strong self-esteem. The person moves through the world from a secure position, untroubled by the disagreement of others.' },
      { count: 5, label: 'Dominant (Overconfident)', scale: 'dominant', verbatim: 'Self-appraisal is maximally strong. The person may think those around them are more foolish, leading to fatal mistakes and cruel disappointments.' },
      { count: 6, label: 'Overload (Inversion)', scale: 'overload', verbatim: 'Overload leads to a situation where the person, while busy showing off their "greatness," forgets to actually develop their true abilities.' }
    ],
  },
  {
    id: 'col_2',
    type: 'column',
    digits: [4, 5, 6],
    name: 'Labor',
    quality: 'Labor Efficiency — Practical & Physical Capacity',
    captionNote:
      'Describe a person\'s physical health, level of endurance, degree of inclination to work and possession of practical skills, as well as the ability to think logically. It is the qualitative characteristic of social status potential.',
    levels: [
      { count: 0, label: 'Quality Absent', scale: 'absent', verbatim: 'The labor column is absent. The person has no innate drive toward financial independence through physical or practical toil. Indifference to material outcomes.' },
      { count: 1, label: 'Very Weak (Imitated)', scale: 'very-weak', verbatim: 'Material aspiration is weakly expressed. The person speaks of independence but does not take the sustained practical steps to produce it.' },
      { count: 2, label: 'Norm (Balanced)', scale: 'norm', verbatim: 'Balanced labor orientation. The person earns adequately, manages resources competently, and provides for the family effectively.' },
      { count: 3, label: 'Special Sign "Extra"', scale: 'special', verbatim: 'Spontaneous material drive. Extraordinary practical effectiveness activates in bursts, often surprising the person themselves.' },
      { count: 4, label: 'Strong Labor Drive', scale: 'strong', verbatim: 'Physically capable, practically skilled, and logically sharp. These are the key ingredients for consistent material success.' },
      { count: 5, label: 'Dominant (Materialistic)', scale: 'dominant', verbatim: 'Labor and material success dominate the life. Efficiency is the primary value, potentially crowding out spiritual or relational depth.' },
      { count: 6, label: 'Overload (Inversion)', scale: 'overload', verbatim: 'Overload triggers inversion. The drive becomes a chronic anxiety about survival, or a total, exhausted indifference to resources.' }
    ],
  },
  {
    id: 'col_3',
    type: 'column',
    digits: [7, 8, 9],
    name: 'Talents',
    quality: 'Talent Potential — Readiness to Develop Gifts',
    captionNote:
      'Contains information about a person\'s talent. "Talents should be helped..." The vast majority of people never discover their talent. Realization depends on other qualities like diligence and purposefulness.',
    levels: [
      { count: 0, label: 'Quality Absent', scale: 'absent', verbatim: 'No innate "channel" for talent is present. Direction is more earthly and practical. Discovery must come through conscious elimination and trial.' },
      { count: 1, label: 'Very Weak (Imitated)', scale: 'very-weak', verbatim: 'Potential without a channel. The person perceives quality and excellence in others but struggles to develop their own deep practice.' },
      { count: 2, label: 'Norm (Balanced)', scale: 'norm', verbatim: 'Genuine talent potential. Development happens with a naturalness that rewards consistent effort. A solid base for meaningful competence.' },
      { count: 3, label: 'Special Sign "Extra"', scale: 'special', verbatim: 'Spontaneous talent. A "higher register" activates suddenly, producing results that neither the person nor others anticipated.' },
      { count: 4, label: 'Strongly Gifted', scale: 'strong', verbatim: 'Rich natural talent waiting to be developed. The capacity for deep mastery is clear, requiring only the correct area of application.' },
      { count: 5, label: 'Dominant Talent', scale: 'dominant', verbatim: 'Raw potential is extraordinary. When activated by purpose and discipline, the results can be truly remarkable by any standard.' },
      { count: 6, label: 'Talent Overload (Diffusion)', scale: 'overload', verbatim: 'Inversion occurs. The person is capable in too many things, moving from field to field without ever reaching the depth of mastery.' }
    ],
  },
  {
    id: 'diag_spirit',
    type: 'diagonal',
    digits: [1, 5, 9],
    name: 'Spirituality',
    quality: 'Spirituality — Search for the Divine Principle',
    captionNote:
      'Indicates the level of a person\'s spirituality. Do not confuse spirituality with religiosity. The degree of unity with Nature (Nus, God) is determined by firmness of convictions and clarity of perception.',
    levels: [
      { count: 0, label: 'Quality Absent', scale: 'absent', verbatim: 'No innate pull toward the transcendent. The person is practically and materially grounded, focused on the measurable and immediate.' },
      { count: 1, label: 'Very Weak (Imitated)', scale: 'very-weak', verbatim: 'Spiritual aspiration without foundation. The interest is sincere but the search remains at the surface of many traditions.' },
      { count: 2, label: 'Norm (Balanced)', scale: 'norm', verbatim: 'Balanced inner coherence. The person\'s will, logic, and mind are aligned, producing a spiritually grounded individual.' },
      { count: 3, label: 'Special Sign "Extra"', scale: 'special', verbatim: 'Spontaneous activation. Spirituality erupts suddenly, often following a crisis that shatters the ordinary framework of interpretation.' },
      { count: 4, label: 'Strongly Spiritual', scale: 'strong', verbatim: 'Deep inner coherence. Firmness of convictions and clarity of perception guide actions quietly from within.' },
      { count: 5, label: 'Dominant Spirituality', scale: 'dominant', verbatim: 'The spiritual dimension is the primary framework. Inner life is extraordinarily deep, providing sustenance in all difficulties.' },
      { count: 6, label: 'Spirituality Overload (Fanaticism)', scale: 'overload', verbatim: 'Overload leads to fanaticism and idolatry. Human norms are distorted beyond recognition. This resembles godlessness more than divinity.' }
    ],
  },
  {
    id: 'diag_carnal',
    type: 'diagonal',
    digits: [3, 5, 7],
    name: 'Temperament',
    quality: 'Temperament — Carnal Nature & Intimate Life',
    captionNote:
      'An indicator of a person\'s temperament in terms of intimate, sexual relationships. It is the degree of matching of temperaments that often determines the duration and quality of a marriage.',
    levels: [
      { count: 0, label: 'Quality Absent', scale: 'absent', verbatim: 'Essentially no innate drive toward physical pleasures. The carnal plane is simply not where the energy is concentrated. Constitutional absence.' },
      { count: 1, label: 'Very Weak (Imitated)', scale: 'very-weak', verbatim: 'Weak temperament. The person may perform engagement with sensory life for social reasons, but the internal visceral pull is thin.' },
      { count: 2, label: 'Norm (Balanced)', scale: 'norm', verbatim: 'Normal temperament. Physical pleasures are genuinely pleasurable and intimate relations are a real, sustaining need. median baseline.' },
      { count: 3, label: 'Special Sign "Extra"', scale: 'special', verbatim: 'Spontaneous temperament. Sudden phases of acute sensory and intimate aliveness that surprise both the person and those close to them.' },
      { count: 4, label: 'Strong Temperament', scale: 'strong', verbatim: 'Strong carnal drive. The body is alive and insistent, requiring a partner who matches this register of physical rhythm.' },
      { count: 5, label: 'Dominant Temperament', scale: 'dominant', verbatim: 'Physical life is the dominant organizing dimension. High libido and acute need for sensory beauty and aesthetic standard.' },
      { count: 6, label: 'Temperament Overload (Inversion)', scale: 'overload', verbatim: 'Overload inversion. The drive becomes compulsive and impossible to satisfy, or the body becomes paradoxically numb from overstimulation.' }
    ],
  },
];
