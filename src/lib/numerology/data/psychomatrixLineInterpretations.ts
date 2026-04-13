
/**
 * @fileoverview ALEXANDROV'S PSYCHOMATRIX — Complete Line & Column Interpretations
 * Quantitative Scale for All Lines, Columns, and Diagonals
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
  orthodox?: string;
  esoteric?: string;
  transmutation?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: resolve interpretation from a raw line digit-count total
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the correct LineCountInterpretation for a given line total.
 */
export function getLineLevel(
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
    orthodox: "This line measures a person's ability to defend their views, set life objectives, and see them through. It is the 'internal motor.'",
    esoteric: "This is the Line of the Ego's Sovereignty. It represents the soul's 'interference quota'—how much the universe allows this individual to alter their own fate through sheer willpower.",
    transmutation: "If Row 1 is overactive, the person 'burns' their health digits (4) to keep the engine running. Advise: your greatest weakness is your inability to stop.",
    levels: [
      { count: 0, label: 'The Void', scale: 'absent', verbatim: 'This person has no developed sense of purpose. There is a profound absence of direction — not laziness in the ordinary sense, but an inability to crystallize desire into an aim.' },
      { count: 1, label: 'The Void', scale: 'very-weak', verbatim: 'Often called "The Drifter." Esoterically, these souls are in a "passive" incarnation. They are meant to learn from others rather than lead. Psychologically, they suffer from "imposter syndrome" regarding their own desires.' },
      { count: 2, label: 'The Balanced Will', scale: 'norm', verbatim: 'The individual can set realistic goals. They have enough "ego-fuel" to get what they want but enough flexibility to abandon a sinking ship.' },
      { count: 3, label: 'The Balanced Will', scale: 'special', verbatim: 'The individual can set realistic goals. They have enough "ego-fuel" to get what they want but enough flexibility to abandon a sinking ship.' },
      { count: 4, label: 'The Sovereign', scale: 'strong', verbatim: 'A very high sense of duty to one\'s own vision. These people "dictate" to reality. If they don\'t have a goal, they feel physically ill.' },
      { count: 5, label: 'The Sovereign', scale: 'dominant', verbatim: 'A very high sense of duty to one\'s own vision. These people "dictate" to reality. If they don\'t have a goal, they feel physically ill.' },
      { count: 6, label: 'The Overload/Tyrant', scale: 'overload', verbatim: 'Here, the quality flips. The person becomes so obsessed with "The Goal" that they lose the ability to enjoy life. Esoterically, this is a karmic trap where the person may "sacrifice" their health (4) or their luck (7) just to satisfy a bloated Ego (1).' }
    ],
  },
  {
    id: 'row_2',
    type: 'row',
    digits: [2, 5, 8],
    name: 'Family',
    quality: 'Family Orientation — Desire to Build Relationships',
    captionNote:
      'Shows how strong a person\'s desire to create a family is, the desire to build a relationship system based on close interaction with the opposite sex. With a clear understanding of the importance of such a step. After all, the family is not just legalized sexual cohabitation, as one German philosopher exotically described, but a complex system that includes reproductive, economic, psychological, educational, creative functions and a large share of responsibility for loved ones.',
    orthodox: "Interest in family life, the quality of one's role as a spouse or parent, and the inherent 'need' to belong to a group.",
    esoteric: "This is the Line of Ancestral Karma. It shows how deeply the soul is tethered to the 'Bloodline' and the 'Collective Debt.'",
    transmutation: "High Row 2 energy can be converted into 'Public Service' or 'Healing' if the individual does not have a biological family.",
    levels: [
      { count: 0, label: 'The Individualist', scale: 'absent', verbatim: 'Esoterically, this is a "Free Agent." They have either finished their family karma in past lives or are here on a mission that requires zero domestic ties.' },
      { count: 1, label: 'The Individualist', scale: 'very-weak', verbatim: 'Esoterically, this is a "Free Agent." They have either finished their family karma in past lives or are here on a mission that requires zero domestic ties.' },
      { count: 2, label: 'The Social Norm', scale: 'norm', verbatim: 'They want a family but won\'t die for it. They view family as a partnership of equals.' },
      { count: 3, label: 'The Social Norm', scale: 'special', verbatim: 'They want a family but won\'t die for it. They view family as a partnership of equals.' },
      { count: 4, label: 'The Hearth-God/Goddess', scale: 'strong', verbatim: 'Family is the only reason for living. They absorb the pain of their relatives. They find it nearly impossible to divorce or leave a toxic family situation because their soul feels "responsible" for the group\'s survival.' },
      { count: 5, label: 'The Hearth-God/Goddess', scale: 'dominant', verbatim: 'Family is the only reason for living. They absorb the pain of their relatives. They find it nearly impossible to divorce or leave a toxic family situation.' },
      { count: 6, label: 'The Karmic Martyr', scale: 'overload', verbatim: 'The person is a "garbage collector" for family trauma. They take on the illnesses and financial failures of their parents and children. They must learn the "Uncensored Truth": You cannot save a sinking ship by drowning with it.' }
    ],
  },
  {
    id: 'row_3',
    type: 'row',
    digits: [3, 6, 9],
    name: 'Stability',
    quality: 'Stability of Character — Resistance to Change',
    captionNote:
      'The indicators of the stability of a person\'s character. That is, they describe the balance between usual habits and certain thinking, on the one hand, and the desire for change, on the other. Thus, the value of personal stability is the answer to the question of the reliability of this person in a particular situation.',
    orthodox: "Habits, routine, attachment to physical comfort, and the tendency toward 'social inertia.'",
    esoteric: "This is the Line of the Flesh-Prison. It represents how 'grounded' the soul is in the 3D material world (Maya). It is the measure of 'Heaviness.'",
    transmutation: "High 6s (Labor) in this row can lead to 'Dark Alchemy'—manipulating the material world for purely selfish ends.",
    levels: [
      { count: 0, label: 'The Revolutionist', scale: 'absent', verbatim: 'A "Light Soul." They can move to a new country with one suitcase. They lack "material memory."' },
      { count: 1, label: 'The Revolutionist', scale: 'very-weak', verbatim: 'A "Light Soul." They can move to a new country with one suitcase. They lack "material memory."' },
      { count: 2, label: 'The Foundation', scale: 'norm', verbatim: 'A healthy respect for routine and tradition.' },
      { count: 3, label: 'The Foundation', scale: 'special', verbatim: 'A healthy respect for routine and tradition.' },
      { count: 4, label: 'The Anchored/Heavy', scale: 'strong', verbatim: 'These people are the "guardians of the status quo." Change is terrifying to them because their soul identity is fused with their habits and possessions.' },
      { count: 5, label: 'The Anchored/Heavy', scale: 'dominant', verbatim: 'These people are the "guardians of the status quo." Change is terrifying to them.' },
      { count: 6, label: 'The Slave to Matter', scale: 'overload', verbatim: 'A high risk of becoming a "Biomechanical Robot." Without a strong Spiritual Diagonal (1-5-9), this person lives purely for the maintenance of their physical existence—eating, sleeping, and accumulating.' }
    ],
  },
  {
    id: 'col_1',
    type: 'column',
    digits: [1, 2, 3],
    name: 'Self-Esteem',
    quality: 'Self-Esteem — Personal Confidence & Appraisal',
    captionNote:
      'A numerical indicator of the level of self-esteem. Hardly any other parameter is more important in the context of a person\'s desire to realize his own potential. But if low self-esteem is only indecisiveness, self-doubt, and therefore eternal circling in circles, then unjustifiably overestimated capabilities can lead to fatal mistakes and cruel disappointments.',
    levels: [
      { count: 0, label: 'Invisible Man', scale: 'absent', verbatim: 'Even if they are geniuses, they will stand in the back of the room. They lack the "permission" to shine.' },
      { count: 1, label: 'Invisible Man', scale: 'very-weak', verbatim: 'Even if they are geniuses, they will stand in the back of the room. They lack the "permission" to shine.' },
      { count: 2, label: 'Balanced', scale: 'norm', verbatim: 'A healthy self-appraisal given in norm.' },
      { count: 3, label: 'Balanced', scale: 'special', verbatim: 'A healthy self-appraisal given in norm.' },
      { count: 4, label: 'Natural Leader', scale: 'strong', verbatim: 'People follow them simply because they look like they know what they are doing.' },
      { count: 5, label: 'Natural Leader', scale: 'dominant', verbatim: 'People follow them simply because they look like they know what they are doing.' },
      { count: 6, label: 'Narcissistic Shadow', scale: 'overload', verbatim: 'The person spends so much energy (2) and knowledge (3) on maintaining their "image" (1) that they have nothing left for actual growth. They are a "hollow monument."' }
    ],
  },
  {
    id: 'col_2',
    type: 'column',
    digits: [4, 5, 6],
    name: 'Labor',
    quality: 'Labor Efficiency — Physical & Practical Capacity',
    captionNote:
      'Describe a person\'s physical health, level of endurance, degree of inclination to work and possession of practical skills, as well as the ability to think logically. Thus, the second column serves as an indicator of labor efficiency as a qualitative characteristic of a person\'s ability to achieve a certain social status, to ensure his well-being and the well-being of his family.',
    levels: [
      { count: 0, label: 'The Suspended', scale: 'absent', verbatim: 'These people are "ghosts" in the workplace. They may be brilliant, but they cannot monetize their ideas. They are "unfit" for the harsh vibrations of the market.' },
      { count: 1, label: 'The Suspended', scale: 'very-weak', verbatim: 'These people are "ghosts" in the workplace. They may be brilliant, but they cannot monetize their ideas. They are "unfit" for the harsh vibrations of the market.' },
      { count: 2, label: 'Balanced', scale: 'norm', verbatim: 'A healthy labor orientation given in norm.' },
      { count: 3, label: 'Balanced', scale: 'special', verbatim: 'A healthy labor orientation given in norm.' },
      { count: 4, label: 'Money Magnet', scale: 'strong', verbatim: 'They understand the physical laws of cause and effect. They build things that last.' },
      { count: 5, label: 'Money Magnet', scale: 'dominant', verbatim: 'They understand the physical laws of cause and effect. They build things that last.' },
      { count: 6, label: 'Curse of the Machine', scale: 'overload', verbatim: 'Alexandrov warned that an overload of 6s indicates a soul that is "over-grounded." They may become obsessed with technology or "dark" material pursuits, losing their connection to the divine.' }
    ],
  },
  {
    id: 'col_3',
    type: 'column',
    digits: [7, 8, 9],
    name: 'Talents',
    quality: 'Talent Potential — Natural Gifts & Readiness to Develop Them',
    captionNote:
      'Contains information about a person\'s talent. However, \'talents should be helped...\', people say, and the vast majority of people live their lives without ever discovering their talent, often without even suspecting its existence. Therefore, we can only talk about potential, the realization of which depends on all other personal qualities: diligence, purposefulness, sense of self-worth, etc.',
    levels: [
      { count: 0, label: 'The Self-Made', scale: 'absent', verbatim: 'These people don\'t get "lucky breaks." Everything they have, they must earn through Column 2 (Labor). The Universe is "quiet" for them.' },
      { count: 1, label: 'The Self-Made', scale: 'very-weak', verbatim: 'These people don\'t get "lucky breaks." Everything they have, they must earn through Column 2 (Labor).' },
      { count: 2, label: 'Normal Potential', scale: 'norm', verbatim: 'Healthy potential for talent given in norm.' },
      { count: 3, label: 'The Lucky', scale: 'special', verbatim: 'They are "guided." They find the right book or meet the right person at the exact moment of need.' },
      { count: 4, label: 'Strong Potential', scale: 'strong', verbatim: 'Strong talent potential. They find the right book or person at the exact moment of need.' },
      { count: 5, label: 'The Divine Burden', scale: 'dominant', verbatim: 'This is not "luck"—it is a Contract. These individuals are "Angelic Servers." If they try to live a normal, selfish life, the Universe will "break" their plans through accidents or sudden losses to force them back onto their path of service.' },
      { count: 6, label: 'The Divine Burden', scale: 'overload', verbatim: 'This is not "luck"—it is a Contract. The Universe will "break" their plans to force them back onto their path of service.' }
    ],
  },
  {
    id: 'diag_spirit',
    type: 'diagonal',
    digits: [1, 5, 9],
    name: 'Spirituality',
    quality: 'Spirituality — Search for the Divine Principle',
    captionNote:
      'Spiritual diagonal. Indicates the level of a person\'s spirituality. Do not confuse spirituality with religiosity. The degree of unity of a person with Nature (Nus, God) is determined by firmness of convictions and clarity of perception, balanced principles and willingness to compromise, to accept a different perspective.',
    levels: [
      { count: 0, label: 'Materialist', scale: 'absent', verbatim: 'No innate pull toward the transcendent. They only believe what they can touch. Their path is to find the "Sacred" within the "Common."' },
      { count: 1, label: 'Materialist', scale: 'very-weak', verbatim: 'No innate pull toward the transcendent.' },
      { count: 2, label: 'Normal Orientation', scale: 'norm', verbatim: 'Balanced spirituality given in norm.' },
      { count: 3, label: 'Spontaneous Spirit', scale: 'special', verbatim: 'Spontaneous spiritual activation occurs accidentally or unexpectedly.' },
      { count: 4, label: 'Saint/Seeker', scale: 'strong', verbatim: 'Strongly developed spirituality. They are naturally pulled toward the mystical.' },
      { count: 5, label: 'Saint/Seeker', scale: 'dominant', verbatim: 'Spirituality dominates the life. They are naturally pulled toward the mystical.' },
      { count: 6, label: 'Spiritual Parasite', scale: 'overload', verbatim: 'The person is a "Spiritual Parasite." They talk about the 5th dimension while their 3D life is in ruins. They use spirituality as an escape from the responsibility of being human.' }
    ],
  },
  {
    id: 'diag_carnal',
    type: 'diagonal',
    digits: [3, 5, 7],
    name: 'Temperament',
    quality: 'Temperament — Carnal Nature & Intimacy',
    captionNote:
      'Carnal diagonal. An indicator of a person\'s temperament in terms of intimate, sexual relationships. It is the degree of matching of temperaments that often becomes the main factor that determines the duration and quality of a marriage.',
    levels: [
      { count: 0, label: 'The Cold Soul', scale: 'absent', verbatim: 'Not necessarily asexual, but "physically detached." They treat sex and food as "maintenance" rather than "pleasure." Esoterically, they are here to develop the mind, not the senses.' },
      { count: 1, label: 'The Cold Soul', scale: 'very-weak', verbatim: 'Not necessarily asexual, but "physically detached."' },
      { count: 2, label: 'The Human', scale: 'norm', verbatim: 'Healthy carnal temperament given in norm. Balanced passions.' },
      { count: 3, label: 'The Human', scale: 'special', verbatim: 'Healthy carnal temperament given in norm. Balanced passions.' },
      { count: 4, label: 'The Magnet', scale: 'strong', verbatim: 'Intense charisma. They "leak" energy that others want to consume. They often attract "energy vampires" who want to bask in their fire.' },
      { count: 5, label: 'The Magnet', scale: 'dominant', verbatim: 'Intense charisma.' },
      { count: 6, label: 'The Black Hole', scale: 'overload', verbatim: 'The person is a slave to stimulation. Their "inner fire" burns so hot they need constant external "fuel"—sex, danger, drugs, or extreme emotions—just to feel alive.' }
    ],
  },
];
