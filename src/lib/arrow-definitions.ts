/**
 * @fileOverview Verbatim shadow meanings for all 16 Lo Shu arrows.
 * Full arrows (8) = Shadow of Presence. Empty arrows (8) = Shadow of Absence.
 */

export type ArrowState = "full" | "empty";

export interface ArrowDefinition {
  id: string;
  name: string;
  numbers: number[];      // the three grid numbers that form this arrow
  type: "horizontal" | "vertical" | "diagonal";
  state: ArrowState;
  coreTrait: string;      
  shadowTitle: string;    
  shadowBody: string;     
}

export const FULL_ARROW_DEFINITIONS: ArrowDefinition[] = [
  {
    id: "thought",
    name: "Arrow of Thought",
    numbers: [4, 9, 2],
    type: "horizontal",
    state: "full",
    coreTrait: "Sharp, rapid-fire intellect and mental clarity.",
    shadowTitle: "Intellectual Arrogance",
    shadowBody: 'When this horizontal mental plane is full, the individual possesses a sharp, rapid-fire intellect. The shadow manifests as a "God Complex" of the mind. They may become so detached from the physical world that they treat people as data points or chess pieces. The shadow side is a cold, clinical superiority where the person values logic over empathy, often leading to social isolation because they cannot tolerate "intellectual inferiority" in others.',
  },
  {
    id: "spirituality",
    name: "Arrow of Spirituality",
    numbers: [3, 5, 7],
    type: "horizontal",
    state: "full",
    coreTrait: "Deep intuition and soulful awareness.",
    shadowTitle: "The Martyr Complex",
    shadowBody: 'This soul plane provides deep intuition, but its shadow is the "Wounded Healer" who cannot heal themselves. This person may become addicted to emotional drama or spiritual "highs," losing touch with practical reality. They often suffer from a martyr complex, subconsciously seeking out suffering or "broken" people to fix, which leads to chronic emotional exhaustion and a loss of personal identity.',
  },
  {
    id: "practicality",
    name: "Arrow of Practicality",
    numbers: [8, 1, 6],
    type: "horizontal",
    state: "full",
    coreTrait: "Builder energy — grounded, capable, and dependable.",
    shadowTitle: "Materialistic Myopia",
    shadowBody: 'This physical plane is the mark of the builder, but its shadow is a soul-crushing obsession with the tangible. The individual may define their entire worth — and the worth of others — by bank accounts, titles, and possessions. They risk becoming a "cog in the machine," unable to appreciate anything that cannot be measured, weighed, or sold. This shadow manifests as a deep, underlying anxiety about poverty, even when they are wealthy.',
  },
  {
    id: "planning",
    name: "Arrow of Planning",
    numbers: [4, 3, 8],
    type: "vertical",
    state: "full",
    coreTrait: "Structural order, methodical thinking, and reliable execution.",
    shadowTitle: "Analysis Paralysis",
    shadowBody: 'This vertical line provides structural order, but its shadow is a paralyzing need for perfection. The person becomes so focused on the blueprint that they never start the construction. They can become pedantic, obsessing over minor details while the "big picture" fades away. In a team setting, this shadow creates a micromanager who stifles creativity in the name of "the right way."',
  },
  {
    id: "willpower",
    name: "Arrow of Willpower",
    numbers: [9, 5, 1],
    type: "vertical",
    state: "full",
    coreTrait: "The ultimate engine of drive, ambition, and follow-through.",
    shadowTitle: "The Steamroller",
    shadowBody: 'This central vertical line is the ultimate engine of drive, but its shadow is a ruthless disregard for the obstacles in its path — including other people. The willpower becomes so intense that it turns into tyranny. The person may find it impossible to pivot or admit a mistake, driving a failing project or a broken relationship into the ground simply because they refuse to "lose."',
  },
  {
    id: "action",
    name: "Arrow of Action",
    numbers: [2, 7, 6],
    type: "vertical",
    state: "full",
    coreTrait: "Remarkable ability to execute, manifest, and get things done.",
    shadowTitle: "Chaotic Busywork",
    shadowBody: 'This vertical line indicates the ability to execute, but its shadow is "movement without progress." The person feels a constant, itchy need to be doing something. They may burn through physical energy on low-value tasks just to avoid the discomfort of stillness or self-reflection. This shadow often leads to burnout and a life that looks productive on the outside but feels hollow on the inside.',
  },
  {
    id: "determination",
    name: "Arrow of Determination",
    numbers: [1, 5, 9],
    type: "diagonal",
    state: "full",
    coreTrait: "Extreme focus, unstoppable momentum, and visionary pursuit.",
    shadowTitle: "Obsessive Tunnel Vision",
    shadowBody: 'The diagonal arrow of determination is a mark of extreme focus. Its shadow is the "Captain Ahab" effect: a pursuit so singular that the individual neglects their health, family, and ethics to reach the goal. They become immune to feedback and may trample over the very people they intended to help, blinded by the light of their own ambition.',
  },
  {
    id: "compassion",
    name: "Arrow of Compassion",
    numbers: [3, 5, 7],
    type: "diagonal",
    state: "full",
    coreTrait: "Heart-centered awareness and empathic depth.",
    shadowTitle: "Emotional Enmeshment",
    shadowBody: 'While similar to the spiritual plane, this diagonal focuses on the "heart-center." Its shadow is the inability to maintain a boundary. The person "leaks" emotionally, absorbing the pain of the world until they are paralyzed by it. They may use their sensitivity as a shield to avoid responsibility, claiming they are "too sensitive" for the harsh realities of life.',
  },
];

export const EMPTY_ARROW_DEFINITIONS: ArrowDefinition[] = [
  {
    id: "frustration",
    name: "Arrow of Frustration",
    numbers: [4, 5, 6],
    type: "horizontal",
    state: "empty",
    coreTrait: "When present: balance, contentment, and a stable center.",
    shadowTitle: "Chronic Dissatisfaction",
    shadowBody: 'When the central horizontal line is missing, the person feels a deep, soul-level "itch" that they cannot scratch. No matter what they achieve, it feels insufficient. The shadow manifests as a tendency to blame the "universe" or "luck" for their unhappiness. They often feel like an outsider looking in, convinced that everyone else has the "secret key" to happiness that they lack.',
  },
  {
    id: "indecision",
    name: "Arrow of Indecision",
    numbers: [1, 5, 9],
    type: "diagonal",
    state: "empty",
    coreTrait: "When present: decisive will and clear directional purpose.",
    shadowTitle: "The Eternal Procrastinator",
    shadowBody: 'The absence of this diagonal creates a "vacuum of will." The shadow side is a life lived in the waiting room. The person waits for the perfect sign, the perfect mood, or the perfect partner before they act. They may become "professional students," constantly collecting information but never applying it, leading to a profound sense of wasted potential.',
  },
  {
    id: "scepticism",
    name: "Arrow of Scepticism",
    numbers: [3, 5, 7],
    type: "horizontal",
    state: "empty",
    coreTrait: "When present: spiritual trust, intuition, and faith.",
    shadowTitle: "The Cynical Fortress",
    shadowBody: 'Without the soul plane, the person struggles to trust anything they cannot see or touch. The shadow is a bitter cynicism. They may view love as a biological transaction and spirituality as a scam. This creates a "fortress of one," where the individual is safe from being fooled but is also entirely alone, unable to experience the "magic" of the irrational or the unseen.',
  },
  {
    id: "hesitation",
    name: "Arrow of Hesitation",
    numbers: [7, 8, 9],
    type: "horizontal",
    state: "empty",
    coreTrait: "When present: follow-through, completion, and harvesting results.",
    shadowTitle: "Fear of the Finish Line",
    shadowBody: 'When the bottom row (or vertical action line in some systems) is missing, the person starts with fire but ends with a whimper. The shadow is the "90% completion" curse. They abandon projects, relationships, and goals just as they are about to bear fruit. This is often a subconscious defense mechanism — if they never finish, they can never be judged as a failure.',
  },
  {
    id: "impracticality",
    name: "Arrow of Impracticality",
    numbers: [1, 4, 7],
    type: "vertical",
    state: "empty",
    coreTrait: "When present: physical grounding and material competence.",
    shadowTitle: "The Starving Artist",
    shadowBody: 'Without the physical foundation, the person lives entirely in the "clouds." The shadow is a total inability to navigate the material world. They may be brilliant philosophers but cannot pay a utility bill on time. This leads to a life of dependency on others, which eventually turns into resentment, as they feel the "world" doesn\'t appreciate their genius enough to take care of their mundane needs.',
  },
  {
    id: "emotional-instability",
    name: "Arrow of Emotional Instability",
    numbers: [2, 5, 8],
    type: "vertical",
    state: "empty",
    coreTrait: "When present: inner anchor, emotional steadiness, and self-knowledge.",
    shadowTitle: "The Reactive Mirror",
    shadowBody: 'Without the central vertical emotional column, there is no "inner anchor." The shadow is a person who is a slave to their environment. If the room is happy, they are happy; if the room is tense, they have a panic attack. They lack a stable sense of self, often "shape-shifting" their personality to match whoever they are with, leading to a fragmented and exhausting existence.',
  },
  {
    id: "mental-fatigue",
    name: "Arrow of Mental Fatigue",
    numbers: [3, 6, 9],
    type: "horizontal",
    state: "empty",
    coreTrait: "When present: intellectual drive, curiosity, and critical thinking.",
    shadowTitle: "Cognitive Avoidance",
    shadowBody: 'When the top mental plane is empty, the person finds intellectual exertion painful or boring. The shadow side is a retreat into "low-vibration" distractions. They may become addicted to mindless entertainment, scrolling, or gossip to avoid the "heavy lifting" of critical thinking. This leads to a life of being easily manipulated by others\' opinions because they haven\'t developed their own.',
  },
  {
    id: "poor-memory",
    name: "Arrow of Poor Memory",
    numbers: [3, 5, 7],
    type: "diagonal",
    state: "empty",
    coreTrait: "When present: coherent life narrative and retention of wisdom.",
    shadowTitle: "The Disconnected Narrative",
    shadowBody: 'In systems where this indicates a lack of mental retention, the shadow is a "fractured life." The person fails to learn from their mistakes because the "lesson" doesn\'t stick. They find themselves repeating the same toxic cycles every few years, genuinely surprised each time the same result occurs. The shadow is a life that feels like a series of disconnected episodes rather than a coherent journey of growth.',
  },
];

export const ALL_ARROW_DEFINITIONS: ArrowDefinition[] = [
  ...FULL_ARROW_DEFINITIONS,
  ...EMPTY_ARROW_DEFINITIONS,
];

export const SHADOW_PRESENCE_INTRO = "When these lines are completed, the energy is powerful but can become a \"runaway train\" if not balanced by other numbers.";
export const SHADOW_ABSENCE_INTRO = "These are the \"Karmic Potholes\" where the energy is missing, creating a void that the individual must consciously learn to bridge.";
