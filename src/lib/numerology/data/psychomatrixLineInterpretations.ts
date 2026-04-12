'use client';

/**
 * @fileoverview ALEXANDROV'S PSYCHOMATRIX — Complete Line & Column Interpretations
 * Quantitative Scale for All Lines, Columns, and Diagonals
 * Based on the original teachings of Professor A. Alexandrov
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

export interface LineReading {
  id: string;
  name: string;
  quality: string;
  type: 'row' | 'column' | 'diagonal';
  digits: number[];
  totalDigits: number;
  captionNote: string;
  label: string;
  verbatim: string;
  scale: LineScaleLevel;
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

/**
 * Wrapper for legacy/compatibility with display components
 */
export function getLineLevel(lineId: string, totalCount: number): LineCountInterpretation {
  return getLineInterpretation(lineId, totalCount) || { 
    count: 0, 
    label: 'Unknown', 
    verbatim: 'No data available for this level.', 
    scale: 'absent' 
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DATA
// ─────────────────────────────────────────────────────────────────────────────

export const PSYCHOMATRIX_LINE_INTERPRETATIONS: PsychomatrixLineInterpretation[] = [
  {
    id: 'row_1',
    type: 'row',
    digits: [1, 4, 7],
    name: 'Purpose',
    quality: 'Purposefulness — Goal Setting & Achievement',
    captionNote:
      'The value of the first line of the psychomatrix (1, 4, 7) is responsible for the sense of purpose of a person, the ability to defend their views, to set goals and objectives.',
    levels: [
      { count: 0, label: 'No Sense of Purpose', scale: 'absent', verbatim: 'This person has no developed sense of purpose. There is a profound absence of direction — not laziness in the ordinary sense, but an inability to crystallize desire into an aim. They drift through life\'s currents without a rudder.' },
      { count: 1, label: 'Imitated Purpose', scale: 'very-weak', verbatim: 'A very weakly developed sense of purpose. What is present is not purpose itself but the advertisement of purpose — a vivid performance of goal-directedness that conceals an underlying uncertainty about what is truly wanted.' },
      { count: 2, label: 'Normal Sense of Purpose', scale: 'norm', verbatim: 'This person has a normal sense of purpose. We can say that this person needs time to get up to speed in life. He first needs to discover his own capabilities, and only then will he set worthy goals for himself.' },
      { count: 3, label: 'Spontaneous Drive — Special Sign', scale: 'special', verbatim: 'Three digits carry the "extra" sign — the quality of spontaneous, unexpected goal activation. Their purposefulness is not a steady flame but a series of sudden ignitions.' },
      { count: 4, label: 'Strong, Consistent Purpose', scale: 'strong', verbatim: 'This is a strongly purposeful person. They know how to set goals and have the internal stability to maintain them over time without losing themselves in obsession.' },
      { count: 5, label: 'Dominant Purpose — Relentless Drive', scale: 'dominant', verbatim: 'Five digits in the purpose line produces a person whose entire existence is organized around the goal. Everything is evaluated by a single criterion: does this serve the aim?' },
      { count: 6, label: 'Purpose Overload — Inversion', scale: 'overload', verbatim: 'Six or more digits produce the overload inversion. What was clear purpose becomes either obsessive fixation on an unreachable ideal or a complete paralysis of will.' }
    ],
  },
  {
    id: 'row_2',
    type: 'row',
    digits: [2, 5, 8],
    name: 'Family',
    quality: 'Family Orientation — Desire for Partnership & Home Life',
    captionNote:
      'The value of the second line of psychomatrix (2, 5, 8) is responsible for the person\'s suitability to be a family person, the desire to have a family, to be among his loved ones.',
    levels: [
      { count: 0, label: 'No Family Orientation', scale: 'absent', verbatim: 'This person has no innate drive toward creating a family. The specific pull toward the domestic structure of family is absent at the core.' },
      { count: 1, label: 'Family Drive Imitated', scale: 'very-weak', verbatim: 'One digit in the family line produces a person who advertises family readiness more convincingly than they live it.' },
      { count: 2, label: 'Normal Family Drive', scale: 'norm', verbatim: 'This person has a normal, healthy orientation toward family. They genuinely want to build a shared life, have a home, and create bonds that last.' },
      { count: 3, label: 'Unexpected Family Commitment', scale: 'special', verbatim: 'Three digits carry the "extra" sign: the quality of family orientation activates suddenly, unexpectedly.' },
      { count: 4, label: 'Strong Family Person', scale: 'strong', verbatim: 'This person wants to start a family and acts on it without any delay. As a rule, this person rarely becomes the one to blame for a breakup.' },
      { count: 5, label: 'Family Dominates — Deeply Domestic', scale: 'dominant', verbatim: 'Five digits makes family the absolute organizing center of the life. Everything else is arranged around the domestic sphere.' },
      { count: 6, label: 'Family Overload — Inversion', scale: 'overload', verbatim: 'Six or more digits triggers the overload inversion. The person may become possessive, controlling, suffocatingly present.' }
    ],
  },
  {
    id: 'row_3',
    type: 'row',
    digits: [3, 6, 9],
    name: 'Stability',
    quality: 'Stability — Resistance to Change & Habitual Consistency',
    captionNote:
      'The value of the third line of the psychomatrix (3, 6, 9) indicates the level of stability of a person — habits, affections, fear and unwillingness to change.',
    levels: [
      { count: 0, label: 'No Stability', scale: 'absent', verbatim: 'This person has essentially no foundation of habitual stability. They live in a state of perpetual flux.' },
      { count: 1, label: 'Stability Imitated', scale: 'very-weak', verbatim: 'One digit produces the imitation of reliability. This person presents themselves as consistent, but when actual stability is demanded the performance falters.' },
      { count: 2, label: 'Normal Stability', scale: 'norm', verbatim: 'This person has a normal, healthy level of stability — a genuine balance between habit and openness to change.' },
      { count: 3, label: 'Sudden Stability — Special Sign', scale: 'special', verbatim: 'Three digits carry the "extra" sign — the quality is present but unstable, erupting suddenly.' },
      { count: 4, label: 'Strongly Stable', scale: 'strong', verbatim: 'This is a person of deep and genuine stability. Their habits are their home. They are consistent in their commitments.' },
      { count: 5, label: 'Dominant Stability — Rigid Consistency', scale: 'dominant', verbatim: 'Five digits produces a person for whom habit has become the supreme organizing value.' },
      { count: 6, label: 'Stability Overload — Inversion', scale: 'overload', verbatim: 'The person seeks to surround themselves with such an abundance of habits that they begin to abandon them as soon as those habits interfere with their life.' }
    ],
  },
  {
    id: 'col_1',
    type: 'column',
    digits: [1, 2, 3],
    name: 'Self-Esteem',
    quality: 'Self-Esteem — Personal Confidence & Self-Appraisal',
    captionNote:
      'The value of the first column (1, 2, 3) determines the level of self-esteem of a person. Low self-esteem is indecisiveness; overestimated self-esteem can lead to fatal mistakes and cruel disappointments.',
    levels: [
      { count: 0, label: 'No Self-Esteem', scale: 'absent', verbatim: 'The absence of self-esteem means the person cannot form a stable valuation of themselves.' },
      { count: 1, label: 'Low Self-Esteem — Compensated', scale: 'very-weak', verbatim: 'One digit produces the classic compensation pattern: the person with weak self-esteem who most vigorously demonstrates confidence.' },
      { count: 2, label: 'Balanced Self-Esteem', scale: 'norm', verbatim: 'This person has a healthy and realistic relationship with their own value.' },
      { count: 3, label: 'Unstable Self-Esteem — Special Sign', scale: 'special', verbatim: 'Three digits carry the "extra" sign. Their self-esteem does not operate at a reliable level.' },
      { count: 4, label: 'Strong, Grounded Self-Esteem', scale: 'strong', verbatim: 'This person has a well-developed, grounded self-esteem. They know their value without needing to assert it constantly.' },
      { count: 5, label: 'Dominant Self-Esteem', scale: 'dominant', verbatim: 'Five digits produce a person whose confidence has tipped into a form of dominance.' },
      { count: 6, label: 'Self-Esteem Overload — Inversion', scale: 'overload', verbatim: 'Overestimating one\'s own talents leads to the fact that a person, while busy showing off, forgets about their true abilities.' }
    ],
  },
  {
    id: 'col_2',
    type: 'column',
    digits: [4, 5, 6],
    name: 'Labor',
    quality: 'Labor Efficiency — Physical & Practical Capacity for Material Success',
    captionNote:
      'The value of the second column (4, 5, 6) is the person\'s aspiration towards financial independence, making his life more comfortable, providing for a family.',
    levels: [
      { count: 0, label: 'No Material Drive', scale: 'absent', verbatim: 'The absence of the labor column means this person has no innate drive toward financial independence.' },
      { count: 1, label: 'Labor Drive Imitated', scale: 'very-weak', verbatim: 'One digit produces a person who speaks the language of material aspiration but does not take sustained practical steps.' },
      { count: 2, label: 'Balanced Labor Orientation', scale: 'norm', verbatim: 'This person has a functional relationship with labor and aspiration.' },
      { count: 3, label: 'Sudden Labor Drive — Special Sign', scale: 'special', verbatim: 'Three digits produces the "extra" sign: the drive toward independence activates in bursts.' },
      { count: 4, label: 'Strong Labor Drive', scale: 'strong', verbatim: 'This person has a strongly developed, practical orientation toward material success.' },
      { count: 5, label: 'Labor Dominates', scale: 'dominant', verbatim: 'Five digits produces a person for whom material success is the primary value.' },
      { count: 6, label: 'Labor Overload — Inversion', scale: 'overload', verbatim: 'Six or more digits triggers the overload inversion.' }
    ],
  },
  {
    id: 'col_3',
    type: 'column',
    digits: [7, 8, 9],
    name: 'Talent',
    quality: 'Talent Potential — Natural Gifts & Life Purpose',
    captionNote:
      'The value of the third column (7, 8, 9) indicates the potential talent of a person. The more digits — the stronger the talent.',
    levels: [
      { count: 0, label: 'No Apparent Talent Signal', scale: 'absent', verbatim: 'The absence of digits means the specific configuration that reliably activates and channels talent is not present.' },
      { count: 1, label: 'Talent Potential Imitated', scale: 'very-weak', verbatim: 'One digit produces the advertisement of talent without its full expression.' },
      { count: 2, label: 'Normal Talent Potential', scale: 'norm', verbatim: 'This person has a normal, genuine talent potential. They have a real capacity to develop meaningful competence.' },
      { count: 3, label: 'Sudden Talent Emergence — Special Sign', scale: 'special', verbatim: 'Three digits carry the "extra" sign — talent that activates suddenly, unexpectedly.' },
      { count: 4, label: 'Strongly Gifted', scale: 'strong', verbatim: 'This person has a strongly developed talent potential. The capacity to develop genuine mastery is clear.' },
      { count: 5, label: 'Dominant Talent — Extraordinary', scale: 'dominant', verbatim: 'Five digits represents the maximum expression of natural gift.' },
      { count: 6, label: 'Talent Overload — Inversion', scale: 'overload', verbatim: 'Six or more digits triggers the overload inversion. The person is capable in too many things.' }
    ],
  },
  {
    id: 'diag_spirit',
    type: 'diagonal',
    digits: [1, 5, 9],
    name: 'Spirituality',
    quality: 'Spiritual Diagonal — Search for the Divine Principle',
    captionNote:
      'The value of the descending diagonal (1, 5, 9) is responsible for a person\'s spirituality, his search for spiritual closeness and the Divine Principle.',
    levels: [
      { count: 0, label: 'No Spiritual Orientation', scale: 'absent', verbatim: 'The absence of digits means the person has no innate pull toward the transcendent.' },
      { count: 1, label: 'Spiritual Aspiration Without Foundation', scale: 'very-weak', verbatim: 'One digit produces an advertisement of spiritual depth. The interest is sincere but not yet grounded.' },
      { count: 2, label: 'Normal Spiritual Orientation', scale: 'norm', verbatim: 'This person has a genuine, functional spiritual orientation.' },
      { count: 3, label: 'Sudden Spiritual Activation — Special Sign', scale: 'special', verbatim: 'Three digits carry the "extra" sign: spirituality that erupts suddenly.' },
      { count: 4, label: 'Strongly Spiritual', scale: 'strong', verbatim: 'This person has a strongly developed spiritual orientation that pervades their life.' },
      { count: 5, label: 'Dominant Spirituality', scale: 'dominant', verbatim: 'Five digits produce a person for whom the spiritual dimension is the primary framework.' },
      { count: 6, label: 'Spirituality Overload — Fanaticism', scale: 'overload', verbatim: 'If this line contains six or more digits, we can talk about an overload of the quality.' }
    ],
  },
  {
    id: 'diag_carnal',
    type: 'diagonal',
    digits: [3, 5, 7],
    name: 'Temperament',
    quality: 'Carnal Diagonal — Temperament & Sexual Compatibility',
    captionNote:
      'The value of the ascending diagonal (3, 5, 7) determines the person\'s carnal interests: sexual temperament, penchant to dress beautifully and eat delicious food.',
    levels: [
      { count: 0, label: 'No Carnal Drive', scale: 'absent', verbatim: 'The absence of digits means the person has essentially no innate drive toward physical pleasures.' },
      { count: 1, label: 'Weak Temperament — Imitated', scale: 'very-weak', verbatim: 'One digit produces a person who performs engagement with physical pleasures more convincingly than they experience it.' },
      { count: 2, label: 'Normal Temperament', scale: 'norm', verbatim: 'This person has a normal, healthy carnal temperament.' },
      { count: 3, label: 'Spontaneous Temperament — Special Sign', scale: 'special', verbatim: 'Three digits carry the "extra" sign — the physical dimension of life activates suddenly.' },
      { count: 4, label: 'Strong Temperament', scale: 'strong', verbatim: 'This is a strong temperament. This person needs genuinely intimate relations.' },
      { count: 5, label: 'Dominant Temperament', scale: 'dominant', verbatim: 'Five digits produce a person whose physical life is the dominant organizing dimension.' },
      { count: 6, label: 'Temperament Overload — Inversion', scale: 'overload', verbatim: 'Six or more digits triggers the overload inversion.' }
    ],
  },
];

export function buildAllLineReadings(
  counts: Record<number, number>
): LineReading[] {
  return PSYCHOMATRIX_LINE_INTERPRETATIONS.map(line => {
    const total = computeLineTotal(line.digits, counts);
    const level = getLineInterpretation(line.id, total)!;
    return {
      id: line.id,
      name: line.name,
      quality: line.quality,
      type: line.type,
      digits: line.digits,
      totalDigits: total,
      captionNote: line.captionNote,
      label: level.label,
      verbatim: level.verbatim,
      scale: level.scale,
    };
  });
}

export const LINE_SCALE_LABELS: Record<LineScaleLevel, string> = {
  absent:    'Absent',
  'very-weak': 'Awakening',
  norm:      'Balanced',
  special:   'Special Sign',
  strong:    'Strong',
  dominant:  'Dominant',
  overload:  'Overload',
};

export const LINE_SCALE_COLORS: Record<LineScaleLevel, string> = {
  absent:    '#6b7280',
  'very-weak': '#9ca3af',
  norm:      '#c49a28',
  special:   '#a78bfa',
  strong:    '#34d399',
  dominant:  '#f59e0b',
  overload:  '#ef4444',
};

export interface DiagonalCompatibilityResult {
  person1Spiritual: number;
  person1Carnal: number;
  person2Spiritual: number;
  person2Carnal: number;
  spiritualDiff: number;
  carnalDiff: number;
  assessment: string;
  risk: 'low' | 'moderate' | 'high';
}

export function assessDiagonalCompatibility(
  counts1: Record<number, number>,
  counts2: Record<number, number>
): DiagonalCompatibilityResult {
  const s1 = computeLineTotal([1, 5, 9], counts1);
  const c1 = computeLineTotal([3, 5, 7], counts1);
  const s2 = computeLineTotal([1, 5, 9], counts2);
  const c2 = computeLineTotal([3, 5, 7], counts2);

  const spiritualDiff = Math.abs(s1 - s2);
  const carnalDiff = Math.abs(c1 - c2);

  let risk: 'low' | 'moderate' | 'high' = 'low';
  let assessment = 'The diagonals are closely matched.';

  if (carnalDiff >= 3) risk = 'high';
  else if (carnalDiff >= 2) risk = 'moderate';

  return {
    person1Spiritual: s1,
    person1Carnal: c1,
    person2Spiritual: s2,
    person2Carnal: c2,
    spiritualDiff,
    carnalDiff,
    assessment,
    risk,
  };
}
