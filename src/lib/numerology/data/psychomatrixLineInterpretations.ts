// src/lib/numerology/data/psychomatrixLineInterpretations.ts
//
// ALEXANDROV'S PSYCHOMATRIX — Complete Line & Column Interpretations
// Quantitative Scale for All Lines, Columns, and Diagonals
// Based on the original teachings of Professor A. Alexandrov

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
// DATA
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
      {
        count: 0,
        label: 'No Sense of Purpose',
        scale: 'absent',
        verbatim:
          'This person has no developed sense of purpose. There is a profound absence of direction — not laziness in the ordinary sense, but an inability to crystallize desire into an aim. They drift through life\'s currents without a rudder, occasionally propelled forward by others or by circumstance, but never by an internal navigator. This person lives reactively: responding, adapting, surviving — but never genuinely choosing. Without external structure provided by others, chaos tends to fill the space that purpose would occupy.',
      },
      {
        count: 1,
        label: 'Imitated Purpose',
        scale: 'very-weak',
        verbatim:
          'A very weakly developed sense of purpose. What is present is not purpose itself but the advertisement of purpose — a vivid performance of goal-directedness that conceals an underlying uncertainty about what is truly wanted. They are motivated primarily by the approval of observers rather than by the pull of the destination itself. Life therefore organizes around appearances of effort rather than its substance.',
      },
      {
        count: 2,
        label: 'Normal Sense of Purpose',
        scale: 'norm',
        verbatim:
          'This person has a normal sense of purpose. We can say that this person needs time to get up to speed in life. He first needs to discover his own capabilities, and only then will he set worthy goals for himself. This is not weakness — it is an honest progression. They may appear to be slow starters, but once the goal is identified and trusted, commitment follows.',
      },
      {
        count: 3,
        label: 'Spontaneous Drive — Special Sign',
        scale: 'special',
        verbatim:
          'Three digits in the purpose line carry the "extra" sign — the quality of spontaneous, unexpected goal activation. Their purposefulness is not a steady flame but a series of sudden ignitions. They can appear directionless for extended periods, then without apparent trigger launch into a phase of extraordinary focused effort, achieving something that astonishes everyone.',
      },
      {
        count: 4,
        label: 'Strong, Consistent Purpose',
        scale: 'strong',
        verbatim:
          'This is a strongly purposeful person. They know how to set goals and have the internal stability to maintain them over time without losing themselves in obsession. They can be goal-directed without becoming ruthless or one-dimensional. When they make a decision, they rarely rescind it without excellent reason.',
      },
      {
        count: 5,
        label: 'Dominant Purpose — Relentless Drive',
        scale: 'dominant',
        verbatim:
          'Five digits in the purpose line produces a person whose entire existence is organized around the goal. Everything is evaluated by a single criterion: does this serve the aim? Relationships, rest, health — all are subordinated. This creates extraordinary effectiveness in the domains the person cares about and extraordinary neglect everywhere else.',
      },
      {
        count: 6,
        label: 'Purpose Overload — Inversion',
        scale: 'overload',
        verbatim:
          'Six or more digits in the purpose line produces the overload inversion. What was clear purpose becomes either obsessive fixation on an unreachable ideal or a complete paralysis of will — an inability to choose any goal because every choice forecloses too many others.',
      },
    ],
  },
  {
    id: 'row_2',
    type: 'row',
    digits: [2, 5, 8],
    name: 'Family',
    quality: 'Family Orientation — Desire for Partnership & Home Life',
    captionNote:
      'Shows how strong a person\'s desire to create a family is, the desire to build a relationship system based on close interaction with the opposite sex. With a clear understanding of the importance of such a step. After all, the family is not just legalized sexual cohabitation, as one German philosopher exotically described, but a complex system that includes reproductive, economic, psychological, educational, creative functions and a large share of responsibility for loved ones.',
    levels: [
      {
        count: 0,
        label: 'No Family Orientation',
        scale: 'absent',
        verbatim:
          'This person has no innate drive toward creating a family. The specific pull toward the domestic structure of family is absent at the core. If they enter into a family arrangement, it is for reasons external to this quality — social pressure or economic necessity.',
      },
      {
        count: 1,
        label: 'Family Drive Imitated',
        scale: 'very-weak',
        verbatim:
          'One digit in the family line produces a person who advertises family readiness more convincingly than they live it. They go through the motions — they are present, they meet basic obligations — but the deep interiority of family life is intermittent.',
      },
      {
        count: 2,
        label: 'Normal Family Drive',
        scale: 'norm',
        verbatim:
          'This person has a normal, healthy orientation toward family. They genuinely want to build a shared life, have a home, and create bonds that last. Two digits here means the quality is active and usable without dominating the entire personality.',
      },
      {
        count: 3,
        label: 'Unexpected Family Commitment',
        scale: 'special',
        verbatim:
          'Three digits in the family line carry the "extra" sign: the quality of family orientation activates suddenly, unexpectedly. This person may go years appearing uninterested, and then apparently overnight decide to build a family with genuine intensity.',
      },
      {
        count: 4,
        label: 'Strong Family Person',
        scale: 'strong',
        verbatim:
          'This person wants to start a family and acts on it without any delay. As a rule, this person rarely becomes the one to blame for a breakup, because they always try to fix the relationship. They are thoughtful in partnership and reliable in care.',
      },
      {
        count: 5,
        label: 'Family Dominates — Deeply Domestic',
        scale: 'dominant',
        verbatim:
          'Five digits in the family line makes family the absolute organizing center of the person\'s life. Everything else is arranged around the domestic sphere. This creates remarkable family members but the person may lose contact with their own individual destiny.',
      },
      {
        count: 6,
        label: 'Family Overload — Inversion',
        scale: 'overload',
        verbatim:
          'Six or more digits triggers the overload inversion. The person may become possessive, controlling, suffocatingly present — love so dense it cannot breathe. Or, they arrive at a point of exhaustion where they can no longer feel the connection.',
      },
    ],
  },
  {
    id: 'row_3',
    type: 'row',
    digits: [3, 6, 9],
    name: 'Stability',
    quality: 'Stability — Resistance to Change & Habitual Consistency',
    captionNote:
      'The indicators of the stability of a person\'s character. That is, they describe the balance between usual habits and certain thinking, on the one hand, and the desire for change, on the other. Thus, the value of personal stability is the answer to the question of the reliability of this person in a particular situation.',
    levels: [
      {
        count: 0,
        label: 'No Stability',
        scale: 'absent',
        verbatim:
          'This person has essentially no foundation of habitual stability. They live in a state of perpetual flux, easily changing direction and values. Agreements drift and commitments are revised. The person genuinely cannot feel the stabilizing pull of habit.',
      },
      {
        count: 1,
        label: 'Stability Imitated',
        scale: 'very-weak',
        verbatim:
          'One digit produces the imitation of reliability. This person presents themselves as consistent, but when actual stability is demanded the performance falters. The quality cannot sustain itself under pressure.',
      },
      {
        count: 2,
        label: 'Normal Stability',
        scale: 'norm',
        verbatim:
          'This person has a normal, healthy level of stability — a genuine balance between habit and openness to change. They have rituals that matter to them without being rigid. This is the most compatible configuration for partnerships.',
      },
      {
        count: 3,
        label: 'Sudden Stability — Special Sign',
        scale: 'special',
        verbatim:
          'Three digits carry the "extra" sign — the quality is present but unstable, erupting suddenly. They can appear chaotic for periods, then lock into a phase of iron stability so complete that it surprises everyone.',
      },
      {
        count: 4,
        label: 'Strongly Stable',
        scale: 'strong',
        verbatim:
          'This is a person of deep and genuine stability. Their habits are their home. They are consistent in their commitments, reliable in their relationships, and able to provide a steady presence.',
      },
      {
        count: 5,
        label: 'Dominant Stability — Rigid Consistency',
        scale: 'dominant',
        verbatim:
          'Five digits produces a person for whom habit has become the supreme organizing value. Disruption of patterns is experienced as violation. Spontaneity is gone and flexibility is resisted.',
      },
      {
        count: 6,
        label: 'Stability Overload — Inversion',
        scale: 'overload',
        verbatim:
          'The person seeks to surround themselves with such an abundance of habits that they begin to abandon them as soon as those habits interfere with their life. They cannot live without structure and cannot live sustainably within it.',
      },
    ],
  },
  {
    id: 'col_1',
    type: 'column',
    digits: [1, 2, 3],
    name: 'Self-Esteem',
    quality: 'Self-Esteem — Personal Confidence & Self-Appraisal',
    captionNote:
      'A numerical indicator of the level of self-esteem. Hardly any other parameter is more important in the context of a person\'s desire to realize his own potential. But if low self-esteem is only indecisiveness, self-doubt, and therefore eternal circling in circles, then unjustifiably overestimated capabilities can lead to fatal mistakes and cruel disappointments.',
    levels: [
      {
        count: 0,
        label: 'No Self-Esteem',
        scale: 'absent',
        verbatim:
          'The absence of self-esteem means the person cannot form a stable valuation of themselves. They are profoundly susceptible to the opinions of others — both flattery and criticism. Without an external mirror, they have no sense of adequacy.',
      },
      {
        count: 1,
        label: 'Low Self-Esteem — Compensated',
        scale: 'very-weak',
        verbatim:
          'One digit produces the classic compensation pattern: the person with weak self-esteem who most vigorously demonstrates confidence. This is the attempt to generate from the outside what the inside cannot produce.',
      },
      {
        count: 2,
        label: 'Balanced Self-Esteem',
        scale: 'norm',
        verbatim:
          'This person has a healthy and realistic relationship with their own value. They can receive criticism without being destroyed by it and can receive praise without becoming dependent on it. Their self-appraisal is genuinely useful.',
      },
      {
        count: 3,
        label: 'Unstable Self-Esteem — Special Sign',
        scale: 'special',
        verbatim:
          'Three digits carry the "extra" sign. Their self-esteem does not operate at a reliable level. They can have periods of grounded confidence and then, without external trigger, collapse into deep self-doubt.',
      },
      {
        count: 4,
        label: 'Strong, Grounded Self-Esteem',
        scale: 'strong',
        verbatim:
          'This person has a well-developed, grounded self-esteem. They know their value without needing to assert it constantly. They can be criticized without becoming destabilized, because their sense of self is internal.',
      },
      {
        count: 5,
        label: 'Dominant Self-Esteem',
        scale: 'dominant',
        verbatim:
          'Five digits produce a person whose confidence has tipped into a form of dominance. The shadow is an inability to integrate criticism. Growth slows because the update signal from external reality is not being received.',
      },
      {
        count: 6,
        label: 'Self-Esteem Overload — Inversion',
        scale: 'overload',
        verbatim:
          'Overestimating one\'s own talents leads to the fact that a person, while busy showing off, forgets about their true abilities and focuses more on superficial things. They spend all their ardor on charming the crowd.',
      },
    ],
  },
  {
    id: 'col_2',
    type: 'column',
    digits: [4, 5, 6],
    name: 'Labor',
    quality: 'Labor Efficiency — Physical & Practical Capacity for Material Success',
    captionNote:
      'Describe a person\'s physical health, level of endurance, degree of inclination to work and possession of practical skills, as well as the ability to think logically. Thus, the second column serves as an indicator of labor efficiency as a qualitative characteristic of a person\'s ability to achieve a certain social status, to ensure his well-being and the well-being of his family.',
    levels: [
      {
        count: 0,
        label: 'No Material Drive',
        scale: 'absent',
        verbatim:
          'The absence of the labor column means this person has no innate drive toward financial independence. Money and physical resources are not organizing concerns. They often depend on others to manage material reality.',
      },
      {
        count: 1,
        label: 'Labor Drive Imitated',
        scale: 'very-weak',
        verbatim:
          'One digit produces a person who speaks the language of material aspiration but does not take sustained practical steps. The internal energy for material effort is simply very low.',
      },
      {
        count: 2,
        label: 'Balanced Labor Orientation',
        scale: 'norm',
        verbatim:
          'This person has a functional relationship with labor and aspiration. They earn adequately for their needs and manage resources with reasonable competence, without being obsessed with acquisition.',
      },
      {
        count: 3,
        label: 'Sudden Labor Drive — Special Sign',
        scale: 'special',
        verbatim:
          'Three digits produces the "extra" sign: the drive toward independence activates in bursts. They may appear indifferent, then enter a phase of intense focused effort that astonishes others.',
      },
      {
        count: 4,
        label: 'Strong Labor Drive',
        scale: 'strong',
        verbatim:
          'This person has a strongly developed, practical orientation toward material success. They are effective earners and reliable providers who tend to take the practical steps that produce actual results.',
      },
      {
        count: 5,
        label: 'Labor Dominates',
        scale: 'dominant',
        verbatim:
          'Five digits produces a person for whom material success is the primary value. They are extraordinarily effective earners but the dominance of this quality suppresses others: relationships are weighed by yield.',
      },
      {
        count: 6,
        label: 'Labor Overload — Inversion',
        scale: 'overload',
        verbatim:
          'Six or more digits triggers the overload inversion. The drive becomes a chronic anxiety about survival that accumulation cannot resolve, or a person who arrives at a point of total indifference to success.',
      },
    ],
  },
  {
    id: 'col_3',
    type: 'column',
    digits: [7, 8, 9],
    name: 'Talent',
    quality: 'Talent Potential — Natural Gifts & Life Purpose',
    captionNote:
      'Contains information about a person\'s talent. However, \'talents should be helped...\', people say, and the vast majority of people live their lives without ever discovering their talent, often without even suspecting its existence. Therefore, we can only talk about potential, the realization of which depends on all other personal qualities: diligence, purposefulness, sense of self-worth, etc.',
    levels: [
      {
        count: 0,
        label: 'No Apparent Talent Signal',
        scale: 'absent',
        verbatim:
          'The absence of digits means the specific configuration that reliably activates and channels talent is not present. The person must work harder than those who have it to achieve comparable results.',
      },
      {
        count: 1,
        label: 'Talent Potential Imitated',
        scale: 'very-weak',
        verbatim:
          'One digit produces the advertisement of talent without full expression. The person has a genuine sensitivity to certain domains but their own practice tends to remain at the level of enthusiastic amateur.',
      },
      {
        count: 2,
        label: 'Normal Talent Potential',
        scale: 'norm',
        verbatim:
          'This person has a normal, genuine talent potential. They have a real capacity to develop meaningful competence in certain domains. With reasonable commitment, they can achieve genuine mastery.',
      },
      {
        count: 3,
        label: 'Sudden Talent Emergence — Special Sign',
        scale: 'special',
        verbatim:
          'Three digits carry the "extra" sign — talent that activates suddenly, unexpectedly. The eruption of talent feels like an interruption from a higher register. The person is often as surprised as the observer.',
      },
      {
        count: 4,
        label: 'Strongly Gifted',
        scale: 'strong',
        verbatim:
          'This person has a strongly developed talent potential. The capacity to develop genuine mastery is clear and sustained. They have the stability to build deep creative work over time.',
      },
      {
        count: 5,
        label: 'Dominant Talent — Extraordinary',
        scale: 'dominant',
        verbatim:
          'Five digits represents the maximum expression of natural gift. The raw potential is extraordinary. When activated by genuine commitment and purpose, the results can be remarkable.',
      },
      {
        count: 6,
        label: 'Talent Overload — Inversion',
        scale: 'overload',
        verbatim:
          'Six or more digits triggers the overload inversion. The person is capable in too many things — each domain opens easily and then becomes insufficiently challenging. Mastery is rarely reached due to diffusion.',
      },
    ],
  },
  {
    id: 'diag_spirit',
    type: 'diagonal',
    digits: [1, 5, 9],
    name: 'Spirituality',
    quality: 'Spiritual Diagonal — Search for the Divine Principle',
    captionNote:
      'Spiritual diagonal. Indicates the level of a person\'s spirituality. Do not confuse spirituality with religiosity. This quality has nothing to do with religious denominations, and it is completely alien to the exaltation of zealots of faith. The degree of unity of a person with Nature (Nus, God) is determined by firmness of convictions and clarity of perception, balanced principles and willingness to compromise, to accept a different perspective.',
    levels: [
      {
        count: 0,
        label: 'No Spiritual Orientation',
        scale: 'absent',
        verbatim:
          'The absence of digits means the person has no innate pull toward the transcendent. They are fully, practically grounded in the visible. Life is managed, not contemplated. The risk is brittleness in the face of suffering.',
      },
      {
        count: 1,
        label: 'Spiritual Aspiration Without Foundation',
        scale: 'very-weak',
        verbatim:
          'One digit produces an advertisement of spiritual depth. The interest is sincere but not yet grounded. They may change traditions with frequency because each fails to deliver permanent grounding.',
      },
      {
        count: 2,
        label: 'Normal Spiritual Orientation',
        scale: 'norm',
        verbatim:
          'This person has a genuine, functional spiritual orientation. They have a relationship with the transcendent that is real rather than performed. This orientation provides resilience in difficulty.',
      },
      {
        count: 3,
        label: 'Sudden Spiritual Activation — Special Sign',
        scale: 'special',
        verbatim:
          'Three digits carry the "extra" sign: spirituality that erupts suddenly, often following a crisis. The awakening is genuine and irreversible, but the circumstances that trigger it are not controllable.',
      },
      {
        count: 4,
        label: 'Strongly Spiritual',
        scale: 'strong',
        verbatim:
          'This person has a strongly developed spiritual orientation that pervades their life without dominating it to the exclusion of practical concerns. Their actions are quietly guided by a sense of rightness.',
      },
      {
        count: 5,
        label: 'Dominant Spirituality',
        scale: 'dominant',
        verbatim:
          'Five digits produce a person for whom the spiritual dimension is the primary framework. The gift is extraordinary depth; the burden is a tendency to spiritualize what might be managed practically.',
      },
      {
        count: 6,
        label: 'Spirituality Overload — Fanaticism',
        scale: 'overload',
        verbatim:
          'If this line contains six or more digits, we can talk about an overload of the quality, which most often leads to fanaticism and idolatry, when all human norms are distorted. This resembles complete godlessness.',
      },
    ],
  },
  {
    id: 'diag_carnal',
    type: 'diagonal',
    digits: [3, 5, 7],
    name: 'Temperament',
    quality: 'Carnal Diagonal — Temperament & Sexual Compatibility',
    captionNote:
      'Carnal diagonal. An indicator of a person\'s temperament in terms of intimate, sexual relationships. And no matter what supporters of unions built on mutual respect and material well-being say, it is the degree of matching of temperaments that often becomes the main factor that determines the duration and quality of a marriage.',
    levels: [
      {
        count: 0,
        label: 'No Carnal Drive',
        scale: 'absent',
        verbatim:
          'The absence of digits means the person has essentially no innate drive toward physical pleasures. Intimate relations are not a strong need. This person lives primarily in an intellectual register.',
      },
      {
        count: 1,
        label: 'Weak Temperament — Imitated',
        scale: 'very-weak',
        verbatim:
          'One digit produces a person who performs engagement with physical pleasures more convincingly than they experience it. The invitation is to discover whether genuine sensory aliveness is available.',
      },
      {
        count: 2,
        label: 'Normal Temperament',
        scale: 'norm',
        verbatim:
          'This person has a normal, healthy carnal temperament. The body\'s pleasures are genuinely pleasurable; intimate relations are a real need without being overwhelming. They neither require nor resent intensity.',
      },
      {
        count: 3,
        label: 'Spontaneous Temperament — Special Sign',
        scale: 'special',
        verbatim:
          'Three digits carry the "extra" sign — the physical dimension of life activates suddenly and with intensity. They can appear controlled and then enter a phase of acute sensory aliveness.',
      },
      {
        count: 4,
        label: 'Strong Temperament',
        scale: 'strong',
        verbatim:
          'This is a strong temperament. This person needs genuinely intimate relations with a partner. They are sensually vital without being defined by it. They appreciate beauty, food, and comfort.',
      },
      {
        count: 5,
        label: 'Dominant Temperament',
        scale: 'dominant',
        verbatim:
          'Five digits produce a person whose physical life is the dominant organizing dimension. The need for intimacy is frequent. The shadow is the suppression of other dimensions of depth.',
      },
      {
        count: 6,
        label: 'Temperament Overload — Inversion',
        scale: 'overload',
        verbatim:
          'Six or more digits triggers the overload inversion. At one pole, the drive becomes compulsive; at the other, it produces a paradoxical shutdown where the body becomes numb from overstimulation.',
      },
    ],
  },
];

export function getLineLevel(lineId: string, totalCount: number): LineCountInterpretation {
  const line = PSYCHOMATRIX_LINE_INTERPRETATIONS.find(l => l.id === lineId);
  if (!line) return { count: 0, label: 'Unknown', verbatim: '', scale: 'absent' };
  const capped = Math.min(totalCount, 6);
  return line.levels.find(lvl => lvl.count === capped) || line.levels[0];
}
