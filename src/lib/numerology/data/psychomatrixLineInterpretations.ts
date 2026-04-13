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
  orthodox?: string;
  esoteric?: string;
  transmutation?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: resolve interpretation from a raw line digit-count total
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the correct LineCountInterpretation for a given line total.
 * Rename to getLineLevel to fix UI runtime error.
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
// MAIN DATA — VERBATIM ALEXANDROV + ESOTERIC DEPTH
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
    orthodox: "This line measures a person's ability to defend their views, set life objectives, and see them through. It is the 'internal motor.'",
    esoteric: "This is the Line of the Ego's Sovereignty. It represents the soul's 'interference quota'—how much the universe allows this individual to alter their own fate through sheer willpower.",
    transmutation: "If Row 1 is overactive, the person 'burns' their health digits (4) to keep the engine running. Advise: your greatest weakness is your inability to stop.",
    levels: [
      { count: 0, label: 'Quality Absent (The Void)', scale: 'absent', verbatim: 'This person has no developed sense of purpose. There is a profound absence of direction — not laziness in the ordinary sense, but an inability to crystallize desire into an aim. Often called "The Drifter." Esoterically, these souls are in a "passive" incarnation. They are meant to learn from others rather than lead. Psychologically, they suffer from "imposter syndrome" regarding their own desires; they often wake up at age 40 wondering whose life they are living.' },
      { count: 1, label: 'Very Weak (The Drifter)', scale: 'very-weak', verbatim: 'Purposefulness is very weakly developed. It is actively "advertised" and "imitated" by the person — displayed for show, even if very weakly expressed. Esoterically, these souls are in a "passive" incarnation. They are meant to learn from others rather than lead.' },
      { count: 2, label: 'Norm (Balanced Will)', scale: 'norm', verbatim: 'Purposefulness is given in norm — developed and actively used. The individual can set realistic goals. They have enough "ego-fuel" to get what they want but enough flexibility to abandon a sinking ship.' },
      { count: 3, label: 'Special Sign (Balanced Will)', scale: 'special', verbatim: 'The person includes this quality urgently, accidentally, unexpectedly, spontaneously, or suddenly. Drive arrives in powerful but unpredictable bursts. The individual can set realistic goals.' },
      { count: 4, label: 'Strongly Developed (The Sovereign)', scale: 'strong', verbatim: 'The quality is strongly developed, but does not suppress other qualities. A very high sense of duty to one\'s own vision. These people "dictate" to reality. If they don\'t have a goal, they feel physically ill.' },
      { count: 5, label: 'Dominant (The Sovereign)', scale: 'dominant', verbatim: 'Purposefulness is developed maximally strongly. A very high sense of duty to one\'s own vision. These people "dictate" to reality. If they don\'t have a goal, they feel physically ill.' },
      { count: 6, label: 'Overload (Tyrant)', scale: 'overload', verbatim: 'Overload of purposefulness occurs. It begins to change to the opposite — from strong turns into weak, hidden, or suppressed. Here, the quality flips. The person becomes so obsessed with "The Goal" that they lose the ability to enjoy life. Esoterically, this is a karmic trap where the person may "sacrifice" their health (4) or their luck (7) just to satisfy a bloated Ego (1).' }
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
      { count: 0, label: 'Quality Absent (The Individualist)', scale: 'absent', verbatim: 'The drive toward domestic structures is absent. Esoterically, this is a "Free Agent." They have either finished their family karma in past lives or are here on a mission that requires zero domestic ties. They are often labeled "cold" or "selfish," but their true path is solitary evolution.' },
      { count: 1, label: 'Very Weak (The Individualist)', scale: 'very-weak', verbatim: 'Family orientation is very weakly developed. It is actively "advertised" and "imitated" by the person. Esoterically, this is a "Free Agent." They are here on a mission that requires zero domestic ties.' },
      { count: 2, label: 'Norm (The Social Norm)', scale: 'norm', verbatim: 'Normal family orientation. They want a family but won\'t die for it. They view family as a partnership of equals.' },
      { count: 3, label: 'Special Sign (Social Norm)', scale: 'special', verbatim: 'Spontaneous family commitment. The person includes this quality urgently and unexpectedly. They want a family but won\'t die for it.' },
      { count: 4, label: 'Strongly Developed (Hearth-God/Goddess)', scale: 'strong', verbatim: 'The quality is strongly developed. Family is the only reason for living. They absorb the pain of their relatives. They find it nearly impossible to divorce or leave a toxic family situation because their soul feels "responsible" for the group\'s survival.' },
      { count: 5, label: 'Dominant (Hearth-God/Goddess)', scale: 'dominant', verbatim: 'Family orientation is maximally strong. Family is the only reason for living. They absorb the pain of their relatives. They find it nearly impossible to leave a toxic situation.' },
      { count: 6, label: 'Overload (Karmic Martyr)', scale: 'overload', verbatim: 'Overload occurs. The quality flips. The person is a "garbage collector" for family trauma. They take on the illnesses and financial failures of their parents and children. They must learn the "Uncensored Truth": You cannot save a sinking ship by drowning with it.' }
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
      { count: 0, label: 'Quality Absent (The Revolutionist)', scale: 'absent', verbatim: 'Habitual stability is absent. A "Light Soul." They can move to a new country with one suitcase. They lack "material memory." Esoterically, they are not deeply plugged into the Earth\'s frequency, which makes them great visionaries but poor managers.' },
      { count: 1, label: 'Very Weak (The Revolutionist)', scale: 'very-weak', verbatim: 'Stability is very weakly developed and actively imitated. A "Light Soul." They are not deeply plugged into the Earth\'s frequency.' },
      { count: 2, label: 'Norm (The Foundation)', scale: 'norm', verbatim: 'Stability is given in norm. A healthy respect for routine and tradition.' },
      { count: 3, label: 'Special Sign (The Foundation)', scale: 'special', verbatim: 'Spontaneous stability. A healthy respect for routine and tradition activates suddenly.' },
      { count: 4, label: 'Strongly Stable (Anchored)', scale: 'strong', verbatim: 'Strong habits and rituals. These people are the "guardians of the status quo." Change is terrifying to them because their soul identity is fused with their habits.' },
      { count: 5, label: 'Dominant (Anchored)', scale: 'dominant', verbatim: 'Stability dominates. These people are the "guardians of the status quo." Change is terrifying.' },
      { count: 6, label: 'Overload (Slave to Matter)', scale: 'overload', verbatim: 'Overload triggers inversion. A high risk of becoming a "Biomechanical Robot." Without a strong Spiritual Diagonal (1-5-9), this person lives purely for the maintenance of their physical existence—eating, sleeping, and accumulating.' }
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
    orthodox: "Self-worth, the desire to be noticed, and the courage to manifest one's potential in public.",
    esoteric: "This is the Line of the Social Avatar. It shows how thick the 'Armor of the Ego' is when facing the world.",
    levels: [
      { count: 0, label: 'Absent (Invisible Man)', scale: 'absent', verbatim: 'No innate self-esteem. Even if they are geniuses, they will stand in the back of the room. They lack the "permission" to shine.' },
      { count: 1, label: 'Very Weak (Invisible Man)', scale: 'very-weak', verbatim: 'Self-appraisal is weakly developed and actively imitated. They lack the "permission" to shine.' },
      { count: 2, label: 'Norm (Balanced)', scale: 'norm', verbatim: 'Healthy self-appraisal given in norm.' },
      { count: 3, label: 'Special Sign (Balanced)', scale: 'special', verbatim: 'Spontaneous self-confidence erupts accidentally or unexpectedly.' },
      { count: 4, label: 'Strong (Natural Leader)', scale: 'strong', verbatim: 'Strongly developed self-appraisal. People follow them simply because they look like they know what they are doing.' },
      { count: 5, label: 'Dominant (Natural Leader)', scale: 'dominant', verbatim: 'Self-appraisal is maximally strong. The person thinks those around them are more foolish.' },
      { count: 6, label: 'Overload (Narcissistic Shadow)', scale: 'overload', verbatim: 'Overload triggers inversion. The person spends so much energy (2) and knowledge (3) on maintaining their "image" (1) that they have nothing left for actual growth. They are a "hollow monument."' }
    ],
  },
  {
    id: 'col_2',
    type: 'column',
    digits: [4, 5, 6],
    name: 'Labor',
    quality: 'Labor Efficiency — Practical & Physical Capacity',
    captionNote:
      'Describe a person\'s physical health, level of endurance, degree of inclination to work and possession of practical skills, as well as the ability to think logically. Thus, the second column serves as an indicator of labor efficiency as a qualitative characteristic of a person\'s ability to achieve a certain social status, to ensure his well-being and the well-being of his family.',
    orthodox: "Professionalism, physical health, logical thinking, and the ability to work with the hands.",
    esoteric: "This is the Line of the Craftsman/Alchemist. It measures the efficiency of 'Energy-to-Matter' conversion.",
    levels: [
      { count: 0, label: 'Absent (The Suspended)', scale: 'absent', verbatim: 'No innate material aspiration. These people are "ghosts" in the workplace. They may be brilliant, but they cannot monetize their ideas. They are "unfit" for the market.' },
      { count: 1, label: 'Very Weak (The Suspended)', scale: 'very-weak', verbatim: 'Labor efficiency is weakly expressed. They are "unfit" for the harsh vibrations of the market.' },
      { count: 2, label: 'Norm (Balanced)', scale: 'norm', verbatim: 'Balanced labor orientation given in norm.' },
      { count: 3, label: 'Special Sign (Money Magnet)', scale: 'special', verbatim: 'Spontaneous efficiency. They understand the physical laws of cause and effect.' },
      { count: 4, label: 'Strong (Money Magnet)', scale: 'strong', verbatim: 'Strong practical skills. They understand the physical laws of cause and effect. They build things that last.' },
      { count: 5, label: 'Dominant (Money Magnet)', scale: 'dominant', verbatim: 'Labor efficiency dominates the life. They build things that last.' },
      { count: 6, label: 'Overload (Curse of the Machine)', scale: 'overload', verbatim: 'Overload triggers inversion. Alexandrov warned that an overload of 6s indicates a soul that is "over-grounded." They may become obsessed with technology or "dark" material pursuits, losing their connection to the divine.' }
    ],
  },
  {
    id: 'col_3',
    type: 'column',
    digits: [7, 8, 9],
    name: 'Talents',
    quality: 'Talent Potential — Readiness to Develop Gifts',
    captionNote:
      'Contains information about a person\'s talent. However, \'talents should be helped...\', people say, and the vast majority of people live their lives without ever discovering their talent, often without even suspecting its existence. Therefore, we can only talk about potential, the realization of which depends on all other personal qualities: diligence, purposefulness, sense of self-worth, etc.',
    orthodox: "Luck, sense of duty, memory, and intellectual capacity.",
    esoteric: "This is the Line of the Prophet/Oracle. It represents the 'Direct Channel' to the higher planes of information.",
    levels: [
      { count: 0, label: 'Absent (The Self-Made)', scale: 'absent', verbatim: 'No innate channel for talent. These people don\'t get "lucky breaks." Everything they have, they must earn through Labor (Col 2). The Universe is "quiet" for them.' },
      { count: 1, label: 'Very Weak (The Self-Made)', scale: 'very-weak', verbatim: 'Potential is barely expressed. Everything must be earned through Column 2.' },
      { count: 2, label: 'Norm (Balanced)', scale: 'norm', verbatim: 'Healthy potential for talent given in norm.' },
      { count: 3, label: 'Special Sign (The Lucky)', scale: 'special', verbatim: 'Spontaneous luck. They are "guided." They find the right book or meet the right person at the exact moment of need.' },
      { count: 4, label: 'Strong (The Lucky)', scale: 'strong', verbatim: 'Strong talent potential. They find the right book or person at the exact moment of need.' },
      { count: 5, label: 'Dominant (Divine Burden)', scale: 'dominant', verbatim: 'raw potential is extraordinary. This is not "luck"—it is a Contract. These individuals are "Angelic Servers." If they try to live a normal, selfish life, the Universe will "break" their plans to force them back to service.' },
      { count: 6, label: 'Overload (Divine Burden)', scale: 'overload', verbatim: 'Overload inversion. The Universe will "break" their plans through accidents or sudden losses to force them back onto their path of service.' }
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
    orthodox: "Faith, adherence to high ideals, and spiritual aspiration.",
    esoteric: "This is the Vertical Ascension Path. It measures the soul's 'Exit Velocity' from the mundane.",
    levels: [
      { count: 0, label: 'Absent (Materialist)', scale: 'absent', verbatim: 'No innate pull toward the transcendent. They only believe what they can touch. Their path is to find the "Sacred" within the "Common."' },
      { count: 1, label: 'Very Weak (Materialist)', scale: 'very-weak', verbatim: 'Spiritual aspiration is weakly expressed and imitated. They only believe what they can touch.' },
      { count: 2, label: 'Norm (Balanced)', scale: 'norm', verbatim: 'Balanced spirituality given in norm.' },
      { count: 3, label: 'Special Sign (Balanced)', scale: 'special', verbatim: 'Spontaneous spiritual activation occurs accidentally or unexpectedly.' },
      { count: 4, label: 'Strong (Saint/Seeker)', scale: 'strong', verbatim: 'Strongly developed spirituality. They are naturally pulled toward the mystical.' },
      { count: 5, label: 'Dominant (Saint/Seeker)', scale: 'dominant', verbatim: 'Spirituality dominates the life. They are naturally pulled toward the mystical.' },
      { count: 6, label: 'Overload (Spiritual Parasite)', scale: 'overload', verbatim: 'Overload triggers inversion. The person is a "Spiritual Parasite." They talk about the 5th dimension while their 3D life is in ruins. They use spirituality as an escape from the responsibility of being human.' }
    ],
  },
  {
    id: 'diag_carnal',
    type: 'diagonal',
    digits: [3, 5, 7],
    name: 'Temperament',
    quality: 'Temperament — Carnal Nature & Intimate Life',
    captionNote:
      'Carnal diagonal. An indicator of a person\'s temperament in terms of intimate, sexual relationships. It is the degree of matching of temperaments that often becomes the main factor that determines the duration and quality of a marriage.',
    orthodox: "Sexual energy, charisma, visceral attraction, and 'thirst for life.'",
    esoteric: "This is the Tantric Flow of Creation. It is the raw, 'red' energy of the lower chakras being moved by the heart (5).",
    levels: [
      { count: 0, label: 'Absent (The Cold Soul)', scale: 'absent', verbatim: 'Essentially no innate drive toward physical pleasures. Not necessarily asexual, but "physically detached." They treat sex and food as "maintenance" rather than "pleasure."' },
      { count: 1, label: 'Very Weak (The Cold Soul)', scale: 'very-weak', verbatim: 'Physical life is weakly expressed and imitated. They are here to develop the mind, not the senses.' },
      { count: 2, label: 'Norm (The Human)', scale: 'norm', verbatim: 'Healthy carnal temperament given in norm. Balanced passions.' },
      { count: 3, label: 'Special Sign (The Human)', scale: 'special', verbatim: 'Spontaneous temperament activates unexpectedly. Balanced passions.' },
      { count: 4, label: 'Strong (The Magnet)', scale: 'strong', verbatim: 'Strong carnal drive. Intense charisma. They "leak" energy that others want to consume.' },
      { count: 5, label: 'Dominant (The Magnet)', scale: 'dominant', verbatim: 'Physical drive dominates. Intense charisma. They often attract "energy vampires" who want to bask in their fire.' },
      { count: 6, label: 'Overload (The Black Hole)', scale: 'overload', verbatim: 'Overload inversion. The person is a slave to stimulation. Their "inner fire" burns so hot they need constant external "fuel"—sex, danger, drugs, or extreme emotions—just to feel alive.' }
    ],
  },
];
