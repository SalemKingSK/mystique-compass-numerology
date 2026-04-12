// src/lib/numerology/data/psychomatrixLineInterpretations.ts
//
// ALEXANDROV'S PSYCHOMATRIX — Complete Line & Column Interpretations
// Quantitative Scale for All Lines, Columns, and Diagonals
//
// Based on the original teachings of Professor A. Alexandrov
// Expanded with full per-count scale descriptions (0 through 6+)

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
          'This person has no developed sense of purpose. There is a profound absence of direction — not laziness in the ordinary sense, but an inability to crystallize desire into an aim. They drift through life\'s currents without a rudder, occasionally propelled forward by others or by circumstance, but never by an internal navigator. This person lives reactively: responding, adapting, surviving — but never genuinely choosing. Without external structure provided by others (a demanding job, a prescriptive culture, a forceful partner), chaos tends to fill the space that purpose would occupy.',
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
          'Three digits in the purpose line carry the "extra" sign — the quality of spontaneous, unexpected goal activation. Their purposefulness is not a steady flame but a series of sudden ignitions. They can appear directionless for extended periods, then launch into a phase of extraordinary focused effort that astonishes everyone who knew them during the dormant phase.',
      },
      {
        count: 4,
        label: 'Strong, Consistent Purpose',
        scale: 'strong',
        verbatim:
          'This is a strongly purposeful person. They know how to set goals and have the internal stability to maintain them over time without losing themselves in obsession. They can be goal-directed without becoming ruthless or one-dimensional. They know the measure. When they make a decision, they rarely rescind it without excellent reason.',
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
          'Six or more digits in the purpose line produces the overload inversion. What was clear purpose becomes either obsessive fixation on an unreachable ideal or a complete paralysis of will — an inability to choose any goal because every choice forecloses too many others. The energy cannot settle on any single trajectory long enough to bring it to fruition.',
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
      'Shows how strong a person\'s desire to create a family is, the desire to build a relationship system based on close interaction with the opposite sex. After all, the family is not just legalized sexual cohabitation, but a complex system that includes reproductive, economic, psychological, educational, creative functions and a large share of responsibility for loved ones.',
    levels: [
      {
        count: 0,
        label: 'No Family Orientation',
        scale: 'absent',
        verbatim:
          'This person has no innate drive toward creating a family. The specific pull toward the domestic structure of family is absent at the core. If they enter into a family arrangement, it is for reasons external to this quality — social pressure, economic necessity, or intellectual interest. Partners who deeply need a home-builder will be chronically disappointed.',
      },
      {
        count: 1,
        label: 'Family Drive Imitated',
        scale: 'very-weak',
        verbatim:
          'One digit in the family line produces a person who advertises family readiness more convincingly than they live it. In courtship they are warm, but once the formal structure is in place, the pull toward genuine domestic investment recedes. They go through the motions but the deep interiority of family life is intermittent.',
      },
      {
        count: 2,
        label: 'Normal Family Drive',
        scale: 'norm',
        verbatim:
          'This person has a normal, healthy orientation toward family. They genuinely want to build a shared life, have a home, and create bonds that last. They are not romantics who idealize partnership beyond recognition, nor are they reluctant participants. Two digits here means the quality is active and usable without dominating the entire personality.',
      },
      {
        count: 3,
        label: 'Unexpected Family Commitment',
        scale: 'special',
        verbatim:
          'Three digits in the family line carry the "extra" sign: the quality of family orientation activates suddenly, unexpectedly. This person may go years appearing uninterested in domestic life, and then apparently overnight decide to build a family with genuine intensity. The quality is eruptive rather than stable.',
      },
      {
        count: 4,
        label: 'Strong Family Person',
        scale: 'strong',
        verbatim:
          'This person wants to start a family and acts on it without any delay. As a rule, this person rarely becomes the one to blame for a breakup, because they always try to fix the relationship. They are thoughtful in partnership, attentive to the partner\'s needs, and willing to invest the sustained effort that a living family requires.',
      },
      {
        count: 5,
        label: 'Family Dominates — Deeply Domestic',
        scale: 'dominant',
        verbatim:
          'Five digits in the family line makes family the absolute organizing center of the person\'s life. Everything else — career, individual freedom — is arranged around the domestic sphere. This creates remarkable family members: loyal, sacrificing, always available. But the person may lose contact with their own individual destiny outside the family.',
      },
      {
        count: 6,
        label: 'Family Overload — Inversion',
        scale: 'overload',
        verbatim:
          'Six or more digits in the family line triggers the overload inversion. The person may become possessive, controlling, suffocatingly present — love so dense it cannot breathe. At the other pole, it produces a paradoxical emotional withdrawal where the person can no longer feel the connection that was supposed to justify all the giving.',
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
          'This person has essentially no foundation of habitual stability. They live in a state of perpetual flux, easily changing direction, relationships, environments, and even values. What looks like freedom is often experienced as groundlessness. Agreements drift. Commitments are revised. The person genuinely cannot feel the stabilizing pull of habit.',
      },
      {
        count: 1,
        label: 'Stability Imitated',
        scale: 'very-weak',
        verbatim:
          'One digit in the stability line produces the imitation of reliability. This person presents themselves as consistent, settled, and dependable. But when actual stability is demanded — when the habit must be maintained through inconvenience — the performance falters. The quality cannot sustain itself under pressure.',
      },
      {
        count: 2,
        label: 'Normal Stability',
        scale: 'norm',
        verbatim:
          'This person has a normal, healthy level of stability — a genuine balance between habit and openness to change. They have rituals that matter to them and that they maintain reliably, without being rigid. When circumstances demand adaptation, they can adapt genuinely. This is the most compatible configuration for intimate partnerships.',
      },
      {
        count: 3,
        label: 'Sudden Stability — Special Sign',
        scale: 'special',
        verbatim:
          'Three digits in the stability line carry the "extra" sign — the quality is present but unstable, erupting suddenly and receding just as abruptly. They can appear chaotic for periods, then lock into a phase of iron stability so sudden and complete that it surprises everyone. Collaborators cannot reliably predict which phase is coming.',
      },
      {
        count: 4,
        label: 'Strongly Stable',
        scale: 'strong',
        verbatim:
          'This is a person of deep and genuine stability. Their habits are their home. Routines are not constraints but nourishment. They are consistent in their commitments, reliable in their relationships, and able to provide the kind of steady presence that allows those around them to develop within a secure environment.',
      },
      {
        count: 5,
        label: 'Dominant Stability — Rigid Consistency',
        scale: 'dominant',
        verbatim:
          'Five digits in the stability line produces a person for whom habit has become the supreme organizing value. They require consistency. Disruption of patterns is experienced not as inconvenience but as violation. Spontaneity is gone. Flexibility is resisted. Change, even beneficial change, is experienced as loss.',
      },
      {
        count: 6,
        label: 'Stability Overload — Inversion',
        scale: 'overload',
        verbatim:
          'The person seeks to surround themselves with such an abundance of habits that they begin to abandon them as soon as those habits interfere with their life. We can say that this person is fighting with their own stability. This cycle — rigidity and sudden rebellion — is the signature of this configuration. They cannot live without structure and cannot live sustainably within it.',
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
          'The absence of self-esteem means the person cannot form a stable valuation of themselves. They are profoundly susceptible to the opinions of others — both flattery, which inflates them temporarily, and criticism, which collapses them immediately. Without the external mirror of others\' approval, they have no clear sense of adequacy.',
      },
      {
        count: 1,
        label: 'Low Self-Esteem — Compensated',
        scale: 'very-weak',
        verbatim:
          'One digit produces the classic compensation pattern: the person with very weak self-esteem who most vigorously demonstrates confidence. They display their accomplishments with a frequency that can exhaust observers. This is the attempt to generate from the outside what the inside cannot produce: a stable sense of worth.',
      },
      {
        count: 2,
        label: 'Healthy, Balanced Self-Esteem',
        scale: 'norm',
        verbatim:
          'This person has a healthy and realistic relationship with their own value. They know what they are good at and where they fall short. They can receive criticism without being destroyed by it and can receive praise without becoming dependent on it. This person\'s self-appraisal is genuinely useful and accurate.',
      },
      {
        count: 3,
        label: 'Unstable Self-Esteem — Special Sign',
        scale: 'special',
        verbatim:
          'Three digits carry the "extra" sign — the quality is present but unstable. Their self-esteem does not operate at a reliable level. They can have periods of grounded confidence and then, without external trigger, collapse into deep self-doubt. The swings arise spontaneously from within.',
      },
      {
        count: 4,
        label: 'Strong, Grounded Self-Esteem',
        scale: 'strong',
        verbatim:
          'This person has a well-developed, grounded self-esteem that allows them to engage with the world from a secure position. They know their value without needing to assert it constantly. They can be disagreed with without becoming destabilized, because their sense of self does not depend on the agreement of others.',
      },
      {
        count: 5,
        label: 'Dominant Self-Esteem',
        scale: 'dominant',
        verbatim:
          'Five digits produce a person whose confidence has tipped into a form of dominance. They are certain about their judgments and reading of situations. The shadow is an inability to integrated criticism. Growth slows because the update signal from external reality is not being received.',
      },
      {
        count: 6,
        label: 'Self-Esteem Overload — Inversion',
        scale: 'overload',
        verbatim:
          'Overestimating one\'s own talents leads to the fact that a person, while busy showing off, forgets about their true abilities and focuses more on superficial things. Such people, typically, never reach their goals, having spent all their ardor on charming the crowd that admires their superficial qualities.',
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
      'Describe a person\'s physical health, level of endurance, degree of inclination to work and possession of practical skills, as well as the ability to think logically. Thus, the second column serves as an indicator of labor efficiency as a qualitative characteristic of a person\'s ability to achieve a certain social status.',
    levels: [
      {
        count: 0,
        label: 'No Material Drive',
        scale: 'absent',
        verbatim:
          'The absence of the labor column means this person has no innate drive toward financial independence or the accumulation of comfort. Money and physical resources are not organizing concerns. They can live with very little or a great deal; neither state is pursued. They often depend on others to manage material reality.',
      },
      {
        count: 1,
        label: 'Labor Drive Imitated',
        scale: 'very-weak',
        verbatim:
          'One digit produces a person who speaks the language of labor and financial independence but who does not take the sustained practical steps that produce actual material results. The aspiration is real in fantasy but does not easily cross into disciplined action. Internal energy for material effort is simply very low.',
      },
      {
        count: 2,
        label: 'Balanced Labor Orientation',
        scale: 'norm',
        verbatim:
          'This person has a normal, functional relationship with labor and material aspiration. They want financial independence, take reasonable steps to pursue it, and can maintain those steps without extreme fluctuations. They earn adequately for their needs and manage resources with reasonable competence.',
      },
      {
        count: 3,
        label: 'Sudden Labor Drive — Special Sign',
        scale: 'special',
        verbatim:
          'Three digits produces the "extra" sign: the drive toward financial independence activates in bursts that are sudden and intense. They may appear indifferent, then enter a phase of intense focused effort that astonishes others. But the energy is not reliably sustainable without locking in structural gains.',
      },
      {
        count: 4,
        label: 'Strong Labor Drive',
        scale: 'strong',
        verbatim:
          'This person has a strongly developed, practical orientation toward labor efficiency and material comfort. They are effective earners and consistent providers. This person can pursue financial goals earnestly while remaining a full human being with relationships that receive genuine attention. They are reliable and competent.',
      },
      {
        count: 5,
        label: 'Labor Dominates',
        scale: 'dominant',
        verbatim:
          'Five digits produces a person for whom material success is the primary value around which all other decisions organize. They are extraordinarily effective earners and shrewd managers. But the dominance of this quality suppresses others: relationships and experiences are often weighed by their economic yield.',
      },
      {
        count: 6,
        label: 'Labor Overload — Inversion',
        scale: 'overload',
        verbatim:
          'Six or more digits triggers the overload inversion. At one pole, the drive becomes a chronic anxiety about survival that perpetual accumulation cannot resolve. At the other, it produces complete exhaustion of the drive: a person who has organized everything around success arrives at a point of total indifference to it.',
      },
    ],
  },
  {
    id: 'col_3',
    type: 'column',
    digits: [7, 8, 9],
    name: 'Talent',
    quality: 'Talent Potential — Natural Gifts & Readiness to Develop Them',
    captionNote:
      'Contains information about a person\'s talent. However, "talents should be helped...", people say, and the vast majority of people live their lives without ever discovering their talent. We can only talk about potential, the realization of which depends on all other personal qualities.',
    levels: [
      {
        count: 0,
        label: 'No Apparent Talent Signal',
        scale: 'absent',
        verbatim:
          'The absence of digits means that the specific configuration that reliably activates and channels talent is not present. Without this signature, the person must work harder than those who have it to achieve comparable results in gifted fields. The development path is discovery through elimination: finding what fits.',
      },
      {
        count: 1,
        label: 'Talent Potential Imitated',
        scale: 'very-weak',
        verbatim:
          'One digit produces the advertisement of talent without its full expression. The person has a genuine sensitivity to certain domains and can speak with insight about mastery, but their own practice tends to remain at the level of enthusiastic amateur. They may be excellent critics or curators of others\' work.',
      },
      {
        count: 2,
        label: 'Normal Talent Potential',
        scale: 'norm',
        verbatim:
          'This person has a normal, genuine talent potential. They have a real capacity to develop meaningful competence in certain domains. Development happens with a naturalness that feels different from mere hard work. With reasonable commitment and in the right domain, they can achieve genuine mastery.',
      },
      {
        count: 3,
        label: 'Sudden Talent Emergence',
        scale: 'special',
        verbatim:
          'Three digits carry the "extra" sign — talent that activates suddenly, unexpectedly, spontaneously. The eruption of talent feels like an interruption from a higher register. The person is often as surprised as the observer. Sustaining the talent requires creating conditions that make the eruptions more frequent.',
      },
      {
        count: 4,
        label: 'Strongly Gifted',
        scale: 'strong',
        verbatim:
          'This person has a strongly developed talent potential. The capacity to develop genuine mastery is clear, sustained, and powerful. They have the capacity for deep creative work and the stability to build it over time. The talent is a quiet, permanent part of the person\'s relationship with their field.',
      },
      {
        count: 5,
        label: 'Dominant Talent — Extraordinary',
        scale: 'dominant',
        verbatim:
          'Five digits represents the maximum expression of natural gift. The raw potential is extraordinary. When this talent is activated by genuine commitment and directed by a strong sense of purpose, the results can be remarkable. The shadow is the talent\'s tendency to dominate and devalue everything else.',
      },
      {
        count: 6,
        label: 'Talent Overload — Inversion',
        scale: 'overload',
        verbatim:
          'Six or more digits triggers the overload inversion. The person is capable in too many things — each domain opens easily and then becomes insufficiently challenging. The result is enormous latent capability and limited actual achievement: perpetually tantalized by the next open door but rarely reaching mastery.',
      },
    ],
  },
  {
    id: 'diag_spirit',
    type: 'diagonal',
    digits: [1, 5, 9],
    name: 'Spirituality',
    quality: 'Spirituality — Search for the Divine Principle',
    captionNote:
      'Indicates the level of a person\'s spirituality. The degree of unity of a person with Nature (Nus, God) is determined by firmness of convictions and clarity of perception, balanced principles and willingness to compromise, to accept a different perspective.',
    levels: [
      {
        count: 0,
        label: 'No Spiritual Orientation',
        scale: 'absent',
        verbatim:
          'The absence of digits means the person has no innate pull toward the transcendent dimension. They are fully, practically grounded in the visible and the measurable. Life is managed, not contemplated. The risk is brittleness in the face of irreducible suffering: the absence of a spiritual framework for interpreting loss.',
      },
      {
        count: 1,
        label: 'Spiritual Aspiration Without Foundation',
        scale: 'very-weak',
        verbatim:
          'One digit produces an advertisement of spiritual depth. The interest is sincere but not yet grounded. They may change traditions and frameworks with frequency, because each one initially answers a need but fails to deliver permanent grounding. The task is to discover what only depth can provide.',
      },
      {
        count: 2,
        label: 'Normal Spiritual Orientation',
        scale: 'norm',
        verbatim:
          'This person has a genuine, functional spiritual orientation. They have a relationship with the transcendent that is real rather than performed. They have a sense of being held by something larger than the individual ego. This orientation provides resilience in difficulty and depth in the good periods.',
      },
      {
        count: 3,
        label: 'Sudden Spiritual Activation',
        scale: 'special',
        verbatim:
          'Three digits carry the "extra" sign: spirituality that erupts suddenly, often following a crisis or a profound encounter. The awakening, once it comes, is genuine and irreversible. But the circumstances that trigger it are not controllable. The person must simply remain open to categories being broken.',
      },
      {
        count: 4,
        label: 'Strongly Spiritual',
        scale: 'strong',
        verbatim:
          'This person has a strongly developed spiritual orientation that pervades their life without dominating it to the exclusion of practical concerns. The spirituality is lived more than declared. Their actions are quietly guided by a sense of rightness. They tend to be sources of stability for others.',
      },
      {
        count: 5,
        label: 'Dominant Spirituality',
        scale: 'dominant',
        verbatim:
          'Five digits produces a person for whom the spiritual dimension is the primary framework through which all of life is interpreted. The gift is an extraordinary depth of inner life. The burden is a tendency to spiritualize what might more productively be managed practically, and a risk of losing contact with reality.',
      },
      {
        count: 6,
        label: 'Spirituality Overload — Fanaticism',
        scale: 'overload',
        verbatim:
          'If this line contains more than five digits (six or more), we can talk about an overload of the quality, which most often leads to fanaticism and idolatry, when all human norms are distorted beyond recognition. This more resembles the complete lack of spirituality rather than the divine principle.',
      },
    ],
  },
  {
    id: 'diag_carnal',
    type: 'diagonal',
    digits: [3, 5, 7],
    name: 'Temperament',
    quality: 'Temperament — Carnal Nature & Sexual Compatibility',
    captionNote:
      'An indicator of a person\'s temperament in terms of intimate, sexual relationships. And no matter what supporters of unions built on mutual respect and material well-being say, it is the degree of matching of temperaments that often becomes the main factor that determines the duration and quality of a marriage.',
    levels: [
      {
        count: 0,
        label: 'No Carnal Drive',
        scale: 'absent',
        verbatim:
          'The absence of digits means the person has essentially no innate drive toward the physical pleasures of life. The body\'s signals do not carry urgency. Intimate relations are not a strong need. This person lives primarily in an intellectual or spiritual register; the carnal plane is not where their energy is concentrated.',
      },
      {
        count: 1,
        label: 'Weak Temperament — Imitated',
        scale: 'very-weak',
        verbatim:
          'One digit produces a person who performs engagement with physical pleasures more convincingly than they experience it. The internal experience is thin. Intimate relations are fulfilling intellectually but lack visceral pull. The invitation is to discover whether genuine sensory aliveness is available beneath the performance.',
      },
      {
        count: 2,
        label: 'Normal Temperament',
        scale: 'norm',
        verbatim:
          'This person has a normal, healthy carnal temperament. The body\'s pleasures are genuinely pleasurable; intimate relations are a real and sustaining need without being overwhelming. They neither require a partner of exceptional physical intensity nor resent one who is somewhat more reserved.',
      },
      {
        count: 3,
        label: 'Spontaneous Temperament — Special Sign',
        scale: 'special',
        verbatim:
          'Three digits carry the "extra" sign — the physical dimension of life activates suddenly and with an intensity disproportionate to circumstances. This person can appear controlled and then enter a phase of acute sensory aliveness that surprises themselves and others. Understanding this cyclical pattern is key.',
      },
      {
        count: 4,
        label: 'Strong Temperament',
        scale: 'strong',
        verbatim:
          'This is a strong temperament. This person needs genuinely intimate relations with a partner. The body is alive and insistent — it communicates its needs clearly. They are sensually vital without being defined entirely by that vitality. They appreciate beauty, food, and physical comfort with genuine enjoyment.',
      },
      {
        count: 5,
        label: 'Dominant Temperament',
        scale: 'dominant',
        verbatim:
          'Five digits produce a person whose physical and sensual life is the dominant organizing dimension. The need for intimacy is frequent; its absence creates background distress. They are often magnetically attractive because their physicality is uninhibited. The shadow is the suppression of other dimensions of depth.',
      },
      {
        count: 6,
        label: 'Temperament Overload — Inversion',
        scale: 'overload',
        verbatim:
          'Six or more digits triggers the overload inversion. At one pole, the drive becomes a compulsive, impossible-to-satisfy hunger. At the other, it produces a paradoxical shutdown: the body, having been overstimulated beyond its integrative capacity, becomes numb. The quality has exceeded its natural container.',
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
