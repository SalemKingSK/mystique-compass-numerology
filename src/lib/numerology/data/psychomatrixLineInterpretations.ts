
/**
 * @fileoverview ALEXANDROV'S PSYCHOMATRIX — Complete Line & Column Interpretations
 * VERBATIM SOURCE DATA — DO NOT SUMMARIZE OR TRUNCATE.
 */

export type LineScaleLevel =
  | 'absent'
  | 'very-weak'
  | 'norm'
  | 'special'
  | 'strong'
  | 'dominant'
  | 'overload';

export interface LineCountInterpretation {
  count: number;
  label: string;
  verbatim: string;
  overloadVerbatim?: string;
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

export function getLineLevel(
  lineId: string,
  totalDigits: number
): LineCountInterpretation | undefined {
  const lineDef = PSYCHOMATRIX_LINE_INTERPRETATIONS.find(l => l.id === lineId);
  if (!lineDef) return undefined;

  let level = lineDef.levels.find(l => l.count === totalDigits);
  
  if (!level) {
    level = lineDef.levels.find(l => l.count >= totalDigits) || lineDef.levels[lineDef.levels.length - 1];
  }

  if (totalDigits >= 6) {
    const dominantLevel = lineDef.levels.find(l => l.count === 5);
    const overloadLevel = lineDef.levels.find(l => l.count === 6);
    if (dominantLevel && overloadLevel) {
      return {
        ...overloadLevel,
        verbatim: dominantLevel.verbatim,
        overloadVerbatim: overloadLevel.verbatim
      };
    }
  }

  return level;
}

export const PSYCHOMATRIX_LINE_INTERPRETATIONS: PsychomatrixLineInterpretation[] = [
  {
    id: 'row_1',
    type: 'row',
    digits: [1, 4, 7],
    name: 'Purpose',
    quality: 'Purposefulness — Goal Achievement',
    captionNote: 'In the Alexandrov Psychomatrix, Row 1 serves as the primary "Motor" of human existence. It is the energetic bridge between the Ego (1), the Physical Temple (4), and Divine Interference (7). This line determines how a soul projects its intent into the future. When we look at this row, we aren\'t just looking at "ambition"; we are looking at the soul’s interference quota—the degree to which an individual is permitted by the Universe to rewrite their own destiny through sheer force of will.',
    orthodox: 'This line measures a person\'s ability to defend their views, set life objectives, and see them through. It is the "internal motor."',
    esoteric: 'This is the Line of the Ego\'s Sovereignty. It represents the soul\'s "interference quota"—how much the universe allows this individual to alter their own fate through sheer willpower.',
    transmutation: 'The flow of Row 1 is a closed circuit. If you have a high Ego (1) but no Health (4), you are a "Visionary in a Broken Car"—great plans, but no engine to move them. If you have high Health (4) but no Ego (1), you are a "Worker without a Compass," possessing immense power but waiting for a master to give you direction. The most mystical element is the "7" (Luck/Divine). If the row is weak but contains a 7, the person shouldn\'t "work" for their goals; they should "state intent" and wait for coincidences. Conversely, those with many 1s and 7s but a weak Row 2 often become "False Prophets," believing their personal ego-desires are the literal commands of God, leading to a dangerous form of spiritual megalomania.',
    levels: [
      { count: 0, label: 'The Passenger of Fate', scale: 'absent', verbatim: 'The Passenger of Fate: When Row 1 is entirely empty, we find a soul in "Neutral Gear." This is often a rest incarnation for a spirit that has either exhausted its will in previous lives or acted as a tyrant and must now learn the humility of passivity. In the material world, this manifests as a complete absence of personal initiative. These individuals are "goal vampires"; they subconsciously provoke those around them to set their direction because they lack an internal spark. Without a master or a strong partner to provide a "compass," they often drift into a state of profound stagnation or addictive escapism, as the weight of making a single choice feels like moving a mountain. They are here to be vessels for the goals of others, a role that requires a total surrender of the ego.' },
      { count: 1, label: 'The Flickering Flame', scale: 'very-weak', verbatim: 'The Flickering Flame: With a single digit in Row 1, the will is present but remains un-stabilized in the physical body. This is the profile of "Monday starts"—the person who begins a diet, a business, or a spiritual practice with immense excitement on Monday only to have the flame extinguished by Wednesday. Their persistence is tied entirely to their chemical mood rather than a disciplined spirit. Esoterically, the will is like a flickering candle in a windstorm; it lacks the "wax" (energy) to stay lit when life gets difficult. They are highly susceptible to the gravity of Row 3 (Habits), often retreating into comfortable, mindless routines because they lack the "thrust" required to break the atmosphere of their own inertia.' },
      { count: 2, label: 'The Cautious Realist', scale: 'norm', verbatim: 'The Cautious Realist: Two digits represent the "Minimum Effort" profile. This is a soul testing the waters of the material world with extreme skepticism. They only set goals when they see a 100% guarantee of success, effectively avoiding any risk that might lead to soul-growth. Psychologically, they hide a lack of ambition behind the mask of "common sense." They will do exactly what is required to survive and maintain comfort, but never an inch more. Esoterically, they are "conservative" spirits who refuse to spend their karmic energy on anything that doesn\'t offer an immediate, tangible return.' },
      { count: 3, label: 'The Golden Mean of Ambition', scale: 'special', verbatim: 'The Golden Mean of Ambition: Three digits mark the "Social Norm" and the ideal balance for a functional life in modern society. Here, the soul has achieved a rare harmony between the Ego (1) and the Universe (7). They possess enough drive to achieve significant success but enough flexibility to abandon a goal if it becomes toxic or irrelevant. This is the "Successful Human" vibration—they are reliable, steady, and capable. However, the uncensored truth is that they often lack the "divine madness" required for true genius or world-changing impact. They are the masters of the middle path, safe from both the paralysis of the weak and the self-destruction of the obsessive.' },
      { count: 4, label: 'The Bulldog of Intent', scale: 'strong', verbatim: 'The Bulldog of Intent: At four digits, we enter the "Warrior" vibration. This person doesn\'t just set goals; they lock onto them with a bulldog’s grip. The word "No" is interpreted as a temporary glitch in the matrix rather than a final answer. This soul has come to conquer a specific territory of reality, and they will use every ounce of their physical foundation (4) to manifest the ego\'s desires (1). The danger here is "Goal-Blindness." They frequently stop perceiving the people in their life as human beings with feelings, instead viewing them as either "tools" to be used or "obstacles" to be cleared. Their persistence is a formidable weapon, but it often leaves a trail of burnt bridges in its wake.' },
      { count: 5, label: 'The Obsessive Sovereign', scale: 'dominant', verbatim: 'The Obsessive Sovereign: Five digits represent the "Magician’s Will." For these individuals, goal-setting is not a choice; it is a physiological necessity, as vital as breathing. If they do not have a mountain to climb, their internal energy turns inward and begins to "self-destruct" through friction, leading to severe neurosis. They demand total submission from their environment to their vision. Esoterically, their intent is so hot it "dries up" their health (4) and "exhausts" their luck (7). They are perpetually on the verge of "Internal Burn," where the ego consumes the very life-force meant to sustain the body. Living with them is exhausting, as they expect everyone to vibrate at their obsessive frequency.' },
      { count: 6, label: 'The Overloaded Martyr', scale: 'overload', verbatim: 'The Overloaded Martyr: When Row 1 exceeds six digits, the quality "inverts" into a karmic trap. The ego has become so heavy that it is now a prison. These individuals often set so many high-stakes goals simultaneously that they become paralyzed by the sheer weight of their own ambition, or they focus on one single goal with an intensity that crosses into mental illness. The Universe often intervenes through "Sudden Collapse"—a major accident, a total physical breakdown, or a sudden loss of "Luck" (7). This is a forced shutdown by the Higher Self to prevent the ego from completely shattering the soul’s vessel. They must learn that their "will" has become a weapon against their own evolution.' }
    ]
  },
  {
    id: 'row_2',
    type: 'row',
    digits: [2, 5, 8],
    name: 'Family',
    quality: 'Family Orientation — Ancestral Karma',
    captionNote: 'In the Alexandrov system, Row 2 is the "Line of the Heart and the Blood." It functions as the energetic bridge between Energy (2), Logic/Intuition (5), and Duty/Justice (8). While Row 1 defines what a person wants for themselves, Row 2 defines what they owe to others. It is the primary measure of "Social Gravity"—the force that pulls an individual into the lives of their parents, spouses, and children. Esoterically, this is the Ancestral Debt Line, revealing how much of this incarnation’s energy is "pre-allocated" to resolving family trauma and bloodline obligations.',
    orthodox: 'Interest in family life, the quality of one\'s role as a spouse or parent, and the inherent "need" to belong to a group.',
    esoteric: 'This is the Line of Ancestral Karma. It shows how deeply the soul is tethered to the "Bloodline" and the "Collective Debt."',
    transmutation: 'The flow of Row 2 is driven by the interaction of Energy (2), Logic (5), and Duty (8). The Energy of Duty: If there are many 8s but no 2s, the person feels a crushing weight of responsibility but lacks the physical energy to fulfill it, leading to chronic fatigue and resentment. The Logic of the Heart: If there is a 5 in the center, the person can use "Intuition" to navigate family traps. Without a 5, the person is "blindly" dutiful, following family traditions even when they are destructive. The Sacrifice of the 8: Esoterically, an 8 can be "shattered" to create two 2s. This means a person with a high sense of duty can literally "generate" physical energy out of their commitment to others. Conversely, if they abandon their duty, their energy (2) and health (4) often collapse shortly after.',
    levels: [
      { count: 0, label: 'The Individualist / The Free Agent', scale: 'absent', verbatim: 'The Individualist / The Free Agent: When Row 2 is empty, we encounter a soul that has achieved "Karmic Independence." In past lives, this spirit may have already settled its family debts or is here on a mission so specialized that domestic ties would only serve as a distraction. In the material world, these people are often labeled "cold," "indifferent," or "selfish" because they lack the biological "need" to belong to a group. They view family as an option, not an obligation. The uncensored reality is that they are "Lone Wolves" who can walk away from toxic relatives without a single glance backward. They do not feel the "pull" of the hearth, and while this makes them emotionally resilient, it can lead to a profound sense of isolation where they are technically "unconnected" to the human social grid.' },
      { count: 1, label: 'The Reluctant Partner', scale: 'very-weak', verbatim: 'The Reluctant Partner: With one digit, the person possesses a minimal interest in creating a "nest." They view domestic life as a utility—a place to sleep or a means to an end—rather than a source of spiritual fulfillment. Their patience for family drama is razor-thin; they will engage in family duties only if it is logical or convenient. Esoterically, the soul is "testing" the waters of connection but remains guarded. They are often "guests" in their own homes, emotionally checking out the moment the conversation turns to mundane chores or emotional maintenance. They are highly susceptible to "domestic flight," preferring work or hobbies to the heavy vibration of a shared household.' },
      { count: 2, label: 'The Balanced Socialite', scale: 'norm', verbatim: 'The Balanced Socialite: Two digits represent the "Contractual" approach to family. These individuals value partnership and will fulfill their roles as parents or children, but they maintain a fierce "private zone." They believe in a 50/50 split of energy; they will give to the family as long as the family gives back. Esoterically, this is a soul that acknowledges its lineage but refuses to be consumed by it. Psychologically, they are the "Modern Spouses" who manage family life like a well-run project. They are safe from martyr complexes but may lack the "deep warmth" required to sustain others during an irrational crisis.' },
      { count: 3, label: 'The Family Pillar (The Norm)', scale: 'special', verbatim: 'The Family Pillar (The Norm): Three digits mark the "Social Standard" for a family person. These individuals find their primary identity through their relationships—as a "father," a "daughter," or a "wife." They possess a natural warmth and a sense of responsibility that acts as the glue for their social circle. The uncensored truth, however, is that they often struggle with a "Guilt-Compass." Their internal peace is entirely dependent on the happiness of their relatives. If a child is failing or a parent is angry, this person’s own life grinds to a halt. They are the "Hearth Keepers" who keep the ancestral fires burning, often at the cost of their own individual Row 1 goals.' },
      { count: 4, label: 'The Guardian of the Bloodline', scale: 'strong', verbatim: 'The Guardian of the Bloodline: At four digits, the quality becomes intense and protective. This person doesn\'t just "love" their family; they "own" the responsibility for it. They are the matriarchs and patriarchs who manage everyone’s lives. Esoterically, this soul has taken on a significant "Clean-up" role for the family tree. They are the ones who show up for every funeral, pay every debt, and solve every crisis. The danger here is "Suffocation." Their love is often a heavy, controlling force. They find it nearly impossible to let their children go, as their own sense of purpose is entirely derived from being "needed."' },
      { count: 5, label: 'The Tribal Soul', scale: 'dominant', verbatim: 'The Tribal Soul: Five digits represent an obsessive level of attachment. These individuals do not see a boundary between themselves and their kin. They "vibrate" with the pain of their relatives; if a family member is sick, they may manifest physical symptoms themselves. Esoterically, this is a soul that is "Tethered to the Tree." They have virtually no individual life—everything is a "family affair." They are the ultimate "Karmic Sponges," soaking up the trauma of three generations. Living with them is a high-pressure experience, as they expect total transparency and absolute loyalty, viewing any attempt at privacy as a betrayal of the blood.' },
      { count: 6, label: 'The Karmic Martyr / The Sin-Eater', scale: 'overload', verbatim: 'The Karmic Martyr / The Sin-Eater: When Row 2 exceeds six digits, the quality "mutates" into a state of total self-sacrifice. These are the "Sin-Eaters" of the Psychomatrix. They often attract broken partners and dysfunctional family situations because their soul is programmed to "fix" and "redeem" the group. The uncensored reality is that they are often "vampirized" by their own relatives. They spend their lives paying for the mistakes of their ancestors, often staying in abusive or soul-crushing marriages because they believe "Duty" (8) is a higher law than "Survival." They must learn the harsh esoteric truth: You cannot redeem a lineage by allowing yourself to be destroyed by it.' }
    ]
  },
  {
    id: 'row_3',
    type: 'row',
    digits: [3, 6, 9],
    name: 'Stability',
    quality: 'Stability of Character — Material Matrix',
    captionNote: 'In the Alexandrov system, Row 3 is the "Base of the Pyramid." It represents the energetic synthesis of Knowledge/Interest (3), Labor/Grounding (6), and Memory/Intellectual Experience (9). While Row 1 is the spirit’s push and Row 2 is the heart’s pull, Row 3 is the gravity of the physical world. It measures how "heavy" a person is—their attachment to routine, their fear of change, and their ability to function within the dense vibrations of the 3D matrix (Maya). This is the Line of Survival and Inertia, revealing how deeply the soul is "plugged in" to the maintenance of its physical existence.',
    orthodox: 'Habits, routine, attachment to physical comfort, and the tendency toward "social inertia."',
    esoteric: 'This is the Line of the Flesh-Prison. It represents how "grounded" the soul is in the 3D material world (Maya). It is the measure of "Heaviness."',
    transmutation: 'Row 3 is the interplay between Curiosity (3), Grounding/Labor (6), and Wisdom (9). The "Golden Hands": If there are many 6s and 9s, the person is a genius of the material world—they can fix anything and understand complex mechanical or financial systems instinctively. The "Eternal Student": If there are many 3s but no 6s, the person collects "junk" knowledge and "junk" objects but never does anything with them. They are a "Library in a Basement"—full of information but gathering dust. The "666" Transition: Alexandrov warned that an overload of 6s in this row (specifically three 6s) creates a "vortex of grounding." This person can manifest extreme wealth or physical power, but they risk "selling their soul" to the machine of work, becoming so efficient that they forget how to be human.',
    levels: [
      { count: 0, label: 'The Nomad of the Void', scale: 'absent', verbatim: 'The Nomad of the Void: An empty Row 3 indicates a soul that is "unzipped" from reality. In the material world, these individuals are revolutionaries, nomads, or social ghosts. They lack "material memory"; they can lose their home, their job, and their possessions today and wake up tomorrow feeling completely unburdened. Psychologically, they suffer from a total lack of discipline and routine, making them nearly impossible to manage in a traditional work environment. The uncensored reality is that they are "Light Souls" who haven\'t quite learned how to inhabit a body. They often forget to eat, pay bills, or clean their surroundings. While they are free from greed, they are also prone to a dangerous form of irresponsibility that forces others to carry their physical weight.' },
      { count: 1, label: 'The Reformer / The Wanderer', scale: 'very-weak', verbatim: 'The Reformer / The Wanderer: With one digit, the individual possesses a "flickering" attachment to the world. They may develop a habit only to abandon it the moment it feels like a cage. They are "eternal students" of life who prefer the theory of living to the labor of it. Esoterically, the soul is a traveler who refuses to unpack its bags. They find routine physically painful and will often subconsciously sabotage a stable situation just to feel the "rush" of change. They are prone to a scattered existence, where they have bits of knowledge (3) or logic (6) but lack the "glue" to turn them into a stable foundation.' },
      { count: 2, label: 'The Adaptive Survivor', scale: 'norm', verbatim: 'The Adaptive Survivor: Two digits represent a healthy, flexible relationship with the material world. These people have core habits that keep them sane, but they can pivot if life demands it. They aren\'t "heavy" enough to be stuck in a rut, nor "light" enough to blow away. Esoterically, this is a soul that uses the material world as a tool rather than a home. Psychologically, they are the most "modern" profile—capable of moving cities or changing careers with minimal trauma. They respect the physical world but do not worship it.' },
      { count: 3, label: 'The Stable Foundation (The Norm)', scale: 'special', verbatim: 'The Stable Foundation (The Norm): Three digits mark the "Standard of Reliability." These individuals are the "bricks" of society. They find comfort in routine, tradition, and the known. Their identity is reinforced by their habits—the time they wake up, the route they drive, the brands they buy. The uncensored truth is that their "Stability" is often a mask for a deep-seated fear of the unknown. They are difficult to move and even more difficult to convince of a new idea. They provide the necessary friction that prevents society from spinning into chaos, but esoterically, they are beginning to grow "heavy" with material attachment.' },
      { count: 4, label: 'The Guardian of the Status Quo', scale: 'strong', verbatim: 'The Guardian of the Status Quo: At four digits, stability becomes "Inertia." This person doesn\'t just like routine; they are a prisoner of it. Any disruption to their habits feels like a physical assault. Psychologically, they are incredibly reliable but also incredibly stubborn. They "hoard" everything—objects, grudges, and outdated beliefs. Esoterically, the soul is becoming "encrusted" in matter. They view their possessions and their "nest" as extensions of their own body. They are the ultimate "conservatives," not necessarily in politics, but in the preservation of their own micro-universe.' },
      { count: 5, label: 'The Material Anchor', scale: 'dominant', verbatim: 'The Material Anchor: Five digits represent a state of total "Physical Gravitas." These people are immovable. They find the idea of change so terrifying that they will stay in soul-crushing jobs or toxic environments simply because the "known" is safer than the "new." The uncensored reality is that they are the "Anchors of the Matrix." They possess a terrifying level of stubbornness. Esoterically, their vibration is so dense that it is hard for them to perceive higher spiritual truths; they "believe only what they can touch." They are the ultimate managers of the 3D world, but they often lose their "wings" in the process.' },
      { count: 6, label: 'The Slave to Maya / The Biomechanical Robot', scale: 'overload', verbatim: 'The Slave to Maya / The Biomechanical Robot: When Row 3 exceeds six digits, the quality "mutates" into a state of mechanical existence. These individuals can become so obsessed with the maintenance of their physical reality (cleaning, working, accumulating) that the "spirit" is effectively squeezed out. They live by a rigid, algorithmic code. The uncensored reality is that they often become "hoarders of energy." They are terrified of loss and spend their entire life building walls to prevent it. They must learn the harsh truth: The more you try to secure your physical life, the more you become a prisoner of the things you own.' }
    ]
  },
  {
    id: 'col_1',
    type: 'column',
    digits: [1, 2, 3],
    name: 'Self-Esteem',
    quality: 'Self-Esteem — Social Manifestation',
    captionNote: 'In the Alexandrov system, Column 1 is the "Vertical of the Ego." It is the energetic synthesis of the Self (1), Vital Energy (2), and Interest/Knowledge (3). While the rows describe how we live, Column 1 describes how we "show up." It is the measure of the "Social Mask"—the interface between the private soul and the public world. Esoterically, this is the Line of Individual Manifestation, revealing how much "space" a soul feels entitled to occupy in the collective reality. It is the gauge of the "I AM" presence, determining whether a person walks through life as a master or a ghost.',
    orthodox: 'Self-worth, the desire to be noticed, and the courage to manifest one\'s potential in public.',
    esoteric: 'This is the Line of the Social Avatar. It shows how thick the "Armor of the Ego" is when facing the world.',
    transmutation: 'Column 1 is the interaction between the Will (1), Vitality (2), and Curiosity (3). The "Brilliant Recluse": If there is a 1 and a 3 but no 2, the person has the ideas and the ego but lacks the "battery" to project them. They are like a powerful radio station with no electricity—nothing is transmitted. The "Empty Vessel": If there are many 2s but no 1s or 3s, the person is a "battery" for others. They have immense social energy but no personal direction or "content." They are the ultimate "fan" or "follower." The "Sovereign Transition": Alexandrov taught that if Column 1 is strong, it can "pull" energy from Column 2 (Labor). This means a person with high self-esteem can often "talk" their way into wealth or status without actually doing the manual work (6), essentially using their "Mask" to hack the material matrix.',
    levels: [
      { count: 0, label: 'The Invisible Man', scale: 'absent', verbatim: 'The "Invisible Man." Even if they are geniuses, they will stand in the back of the room. They lack the "permission" to shine.' },
      { count: 1, label: 'The Invisible Man', scale: 'very-weak', verbatim: 'The "Invisible Man." Even if they are geniuses, they will stand in the back of the room. They lack the "permission" to shine.' },
      { count: 2, label: 'The Modest Observer', scale: 'norm', verbatim: 'The Modest Observer: Two digits represent the "Backseat" profile. These individuals know their own value but possess a deep-seated reluctance to push for the spotlight. They wait to be invited, recognized, or discovered. If no one calls their name, they remain in the shadows, often harboring a quiet resentment that their "obvious" merits aren\'t being rewarded. Esoterically, the soul is cautious, fearing that any bold manifestation will lead to karmic retribution. They are the "reliable supporters" who provide the energy (2) and knowledge (3) for others to shine, often neglecting their own Character (1) in the process.' },
      { count: 3, label: 'The Balanced Ego (The Norm)', scale: 'special', verbatim: 'The Balanced Ego (The Norm): Three digits mark the "Healthy Interface." This is the social ideal where the individual feels neither superior nor inferior to the collective. They possess enough self-worth to lead when necessary and enough humility to follow when appropriate. The uncensored truth, however, is that their self-esteem is often "conditional"—it depends on the feedback of the environment. If the world praises them, they expand; if the world ignores them, they contract. They are safe from the delusions of grandeur but lack the "monumental ego" required to break the status quo or stand alone against a crowd.' },
      { count: 4, label: 'The Natural Leader', scale: 'strong', verbatim: 'The "Natural Leader." People follow them simply because they look like they know what they are doing.' },
      { count: 5, label: 'The Natural Leader', scale: 'dominant', verbatim: 'The "Natural Leader." People follow them simply because they look like they know what they are doing.' },
      { count: 6, label: 'The Narcissistic Shadow / The Hollow Monument', scale: 'overload', verbatim: 'The "Narcissistic Shadow." The person spends so much energy (2) and knowledge (3) on maintaining their "image" (1) that they have nothing left for actual growth. They are a "hollow monument."' }
    ]
  },
  {
    id: 'col_2',
    type: 'column',
    digits: [4, 5, 6],
    name: 'Labor',
    quality: 'Labor Efficiency — Physical & Practical Capacity',
    captionNote: 'In the Alexandrov Psychomatrix, Column 2 is the "Vertical of Maintenance and Alchemy." It represents the energetic synthesis of Physical Health/Endurance (4), Logic/Intuition (5), and Craft/Labor/Grounding (6). While Column 1 dictates how we appear to the world, Column 2 dictates what we can actually build in it. This is the Line of the Alchemist, measuring the soul\'s ability to take the invisible (ideas, will) and convert it into the dense, tangible reality of the 3D matrix (money, structures, physical security). It reveals how "equipped" a spirit is to handle the harsh, mechanical vibrations of the earthly plane.',
    orthodox: 'Professionalism, physical health, logical thinking, and the ability to work with the hands.',
    esoteric: 'This is the Line of the Craftsman/Alchemist. It measures the efficiency of "Energy-to-Matter" conversion.',
    transmutation: 'The flow of Column 2 depends heavily on the presence of the 5, which acts as the "Heart/Logic Bridge" of the entire Psychomatrix. The "Blind Ox": If there are many 4s (Health/Body) and 6s (Labor) but no 5s (Logic), the person possesses immense physical strength and a desire to work, but no internal compass to guide it. They will work themselves to the bone digging a hole in the wrong place. They absolutely require a master to direct them. The "Armchair General": If there are many 5s (Logic) but no 4s or 6s, the person sees exactly how the world works and how money should be made, but they lack the physical endurance or the practical skills to do it themselves. They must become advisors, or their brilliant logic will rot in their own minds. The Transmutation of the 6: Alexandrov taught that a high concentration of 6s (Dark Labor/Manipulation) can only be neutralized by the presence of strong 7s (Divine Protection/Luck) or by consciously choosing to use one\'s material mastery for the spiritual elevation of others, rather than personal hoarding.',
    levels: [
      { count: 0, label: 'The Suspended', scale: 'absent', verbatim: '"The Suspended." These people are "ghosts" in the workplace. They may be brilliant, but they cannot monetize their ideas. They are "unfit" for the harsh vibrations of the market.' },
      { count: 1, label: 'The Suspended', scale: 'very-weak', verbatim: '"The Suspended." These people are "ghosts" in the workplace. They may be brilliant, but they cannot monetize their ideas. They are "unfit" for the harsh vibrations of the market.' },
      { count: 2, label: 'The Reluctant Craftsman', scale: 'norm', verbatim: 'The Reluctant Craftsman: Two digits represent the "Survivalist" approach to material gain. These individuals possess the basic physical and logical tools to work, but they view labor as an unfortunate necessity rather than a source of pride or spiritual fulfillment. They will do exactly what is needed to pay the bills and not a single task more. Esoterically, the soul is doing the bare minimum to maintain its physical vessel in the 3D plane. The uncensored truth is that they are inherently lazy regarding physical exertion unless pushed by a strong Will (Row 1) or a demanding Ego (Column 1). They are the masters of the find the easiest, fastest way to get a job done so they can return to resting.' },
      { count: 3, label: 'The Professional (The Norm)', scale: 'special', verbatim: 'The Professional (The Norm): Three digits mark the "Backbone of the Economy." This is the social ideal of the balanced worker. They understand the fundamental law of earthly exchange: a day’s work for a day’s pay. They possess a healthy respect for logic, physical health, and professional skills. Psychologically, they find a quiet dignity in being capable and self-sufficient. The uncensored reality, however, is that while they will never starve, they rarely build empires. They are reliable but often lack the "cutthroat" edge or obsessive drive required to amass massive wealth. They are safe, predictable, and structurally sound.' },
      { count: 4, label: 'The Money Magnet', scale: 'strong', verbatim: 'The "Money Magnet." They understand the physical laws of cause and effect. They build things that last.' },
      { count: 5, label: 'The Money Magnet', scale: 'dominant', verbatim: 'The "Money Magnet." They understand the physical laws of cause and effect. They build things that last.' },
      { count: 6, label: 'The Curse of the Machine', scale: 'overload', verbatim: 'Alexandrov warned that an overload of 6s indicates a soul that is "over-grounded." They may become obsessed with technology or "dark" material pursuits, losing their connection to the divine.' }
    ]
  },
  {
    id: 'col_3',
    type: 'column',
    digits: [7, 8, 9],
    name: 'Talents',
    quality: 'Talent Potential — Natural Gifts',
    captionNote: 'In the Alexandrov Psychomatrix, Column 3 is the "Vertical of the Unseen." It represents the energetic synthesis of Divine Protection/Luck (7), Cosmic Duty/Justice (8), and Intellect/Akashic Memory (9). While Column 1 is the Ego and Column 2 is the Body, Column 3 is the soul\'s "Direct Line to the Creator." It measures the innate "gifts" a person brought into this life, not just as skills, but as energetic support systems. Esoterically, this is the Line of the Oracle and the Cosmic Contract, revealing how closely the Universe watches, guides, and—when necessary—punishes the individual to keep them on their pre-ordained path.',
    orthodox: 'Luck, sense of duty, memory, and intellectual capacity.',
    esoteric: 'This is the Line of the Prophet/Oracle. It represents the "Direct Channel" to the higher planes of information.',
    transmutation: 'Column 3 is an intricate web of Luck (7), Duty/Justice (8), and Intellect/Memory (9). The "Brilliant Parasite": If a person has many 9s (high intellect and clairvoyance) but zero 8s (duty/tolerance), they are a dangerous force. They possess the mental capacity to see through everyone and everything, but they lack the empathy or moral obligation to care. They use their brilliance purely to manipulate, viewing other humans as intellectually inferior pawns. The "Angelic Marks" (777, 888, 999): Alexandrov taught that these triples are not just "strong traits," but specific "Signs." 777 is the mark of the "Builder"—they must construct systems that elevate others. If they destroy, they lose everything. 888 is the "Sign of the Judge/Servant." They are biologically incapable of lying or cheating without immediate cosmic punishment. They are here to serve truth. 999 is the "Sign of the Prophet." Their mind is so open to the ether that they risk severe mental instability if they do not find a way to ground their visions in reality. They often straddle the line between genius and madness. The "Sacrificial 8": A profound esoteric secret of the matrix is that the energy of Duty (8) can be alchemically converted into Vital Energy (22). A person with strong 8s can literally sustain their physical body and push through exhaustion solely by focusing on their duty to God, their family, or their mission.',
    levels: [
      { count: 0, label: 'The Self-Made', scale: 'absent', verbatim: '"The Self-Made." These people don\'t get "lucky breaks." Everything they have, they must earn through Column 2 (Labor). The Universe is "quiet" for them.' },
      { count: 1, label: 'The Self-Made', scale: 'very-weak', verbatim: '"The Self-Made." These people don\'t get "lucky breaks." Everything they have, they must earn through Column 2 (Labor). The Universe is "quiet" for them.' },
      { count: 2, label: 'The Lucky', scale: 'norm', verbatim: 'They are "guided." They find the right book or meet the right person at the exact moment of need.' },
      { count: 3, label: 'The Lucky', scale: 'special', verbatim: 'They are "guided." They find the right book or meet the right person at the exact moment of need.' },
      { count: 4, label: 'The Divine Burden', scale: 'strong', verbatim: 'This is not "luck"—it is a Contract. These individuals are "Angelic Servers." If they try to live a normal, selfish life, the Universe will "break" their plans through accidents or sudden losses to force them back onto their path of service.' },
      { count: 5, label: 'The Divine Burden', scale: 'dominant', verbatim: 'This is not "luck"—it is a Contract. These individuals are "Angelic Servers." If they try to live a normal, selfish life, the Universe will "break" their plans through accidents or sudden losses to force them back onto their path of service.' },
      { count: 6, label: 'The Divine Burden', scale: 'overload', verbatim: 'This is not "luck"—it is a Contract. These individuals are "Angelic Servers." If they try to live a normal, selfish life, the Universe will "break" their plans through accidents or sudden losses to force them back onto their path of service.' }
    ]
  },
  {
    id: 'diag_spirit',
    type: 'diagonal',
    digits: [1, 5, 9],
    name: 'Spirituality',
    quality: 'Spirituality — Faith & Ascension',
    captionNote: 'In the Alexandrov Psychomatrix, Diagonal 1 (descending from top-left to bottom-right) is the "Axis of the Spirit." It is the energetic synthesis of the Ego/Character (1), Logic/Heart (5), and Intellect/Memory (9). While the rows and columns manage the mechanics of living in society and matter, Diagonal 1 measures the soul\'s "Vertical Velocity"—its innate drive to look upward, seek meaning beyond survival, and connect with higher principles, God, or universal truth. Esoterically, this is the Ascension Path, revealing whether a soul is grounded in the dirt or reaching for the ether.',
    orthodox: 'Faith, adherence to high ideals, and spiritual aspiration.',
    esoteric: 'This is the Vertical Ascension Path. It measures the soul\'s "Exit Velocity" from the mundane.',
    transmutation: 'Diagonal 1 requires the synergy of Ego (1), Logic/Heart (5), and Intellect (9) to function properly. The "Heartless Scholar": If there are strong 1s and 9s but the center 5 is missing, the person\'s spirituality is purely intellectual and egotistical. They know all the holy texts and the theories of the universe, but they have zero empathy or intuition. Their "faith" is a cold equation. The "Blind Believer": If there are many 1s (Ego) and 5s (Heart/Intuition) but no 9s (Intellect/Memory), the person is highly susceptible to cults or false gurus. They have the desire to believe and the passion to follow, but they lack the critical thinking required to distinguish truth from manipulation. The Ultimate Warning: Alexandrov stressed that true spiritual evolution requires the grounding of Row 3. A massive Diagonal 1 without the anchor of the Material Line (3-6-9) results in "Ascension Sickness"—a state where the soul tries to eject from the physical body before its earthly work is done, leading to mental instability and a shattered life.',
    levels: [
      { count: 0, label: 'The Materialist', scale: 'absent', verbatim: 'The "Materialist." They only believe what they can touch. Their path is to find the "Sacred" within the "Common."' },
      { count: 1, label: 'The Materialist', scale: 'very-weak', verbatim: 'The "Materialist." They only believe what they can touch. Their path is to find the "Sacred" within the "Common."' },
      { count: 2, label: 'The Saint/Seeker', scale: 'norm', verbatim: 'The Saint/Seeker. They are naturally pulled toward the mystical.' },
      { count: 3, label: 'The Saint/Seeker', scale: 'special', verbatim: 'The Saint/Seeker. They are naturally pulled toward the mystical.' },
      { count: 4, label: 'The Saint/Seeker', scale: 'strong', verbatim: 'The Saint/Seeker. They are naturally pulled toward the mystical.' },
      { count: 5, label: 'The Saint/Seeker', scale: 'dominant', verbatim: 'The Saint/Seeker. They are naturally pulled toward the mystical.' },
      { count: 6, label: 'The Spiritual Parasite', scale: 'overload', verbatim: 'The Spiritual Parasite: If this line is 6+ but the "Stability Row" (Row 3) is 0, the person is a "Spiritual Parasite." They talk about the 5th dimension while their 3D life is in ruins. They use spirituality as an escape from the responsibility of being human.' }
    ]
  },
  {
    id: 'diag_carnal',
    type: 'diagonal',
    digits: [3, 5, 7],
    name: 'Temperament',
    quality: 'Temperament — Carnality & The Flesh',
    captionNote: 'In the Alexandrov Psychomatrix, Diagonal 2 (ascending from bottom-left to top-right) is the "Axis of the Flesh." It is the energetic synthesis of Earthly Curiosity/Habit (3), Logic/The Heart Center (5), and Divine Spark/Luck (7). While Diagonal 1 represents the soul\'s attempt to escape gravity and reach God, Diagonal 2 represents the soul\'s desire to plunge deeply into the sensory experience of the physical world. This is the Line of Tantric Flow and Charisma. It measures libido, visceral magnetism, and the raw, "red" energy that pulls human beings together. Esoterically, it reveals how effectively the soul can use carnal pleasure and earthly passion as a vehicle for creation.',
    orthodox: 'Sexual energy, charisma, visceral attraction, and "thirst for life."',
    esoteric: 'This is the Tantric Flow of Creation. It is the raw, "red" energy of the lower chakras being moved by the heart (5).',
    transmutation: 'Diagonal 2 requires the perfect alchemy of Earthly Habit (3), the Heart/Logic Bridge (5), and the Divine Spark (7) to flow correctly. The "Mechanical Lover": If a person has strong 3s and 7s but is missing the central 5, their passion is entirely disconnected from their heart. They view intimacy either as a purely physical bodily function (3) or a bizarre, detached fantasy (7), but they cannot synthesize the two into human love. They can mimic passion, but they feel nothing inside. The "Mental Fetishist": If there are many 5s (Logic) and 7s (Fantasy) but no 3s (Grounding/Earth), the person\'s libido exists entirely in their head. They are consumed by intense, complex psychological desires and romantic ideals, but when faced with actual, messy, physical reality, they often freeze or lose interest. Their passion is a ghost. The Secret of the 5: Alexandrov taught that the 5 is the absolute master of the Psychomatrix. Sitting perfectly in the center, it regulates both Diagonals. A strong 5 ensures that the profound spiritual insights of Diagonal 1 are deeply felt and actualized through the passionate, carnal reality of Diagonal 2. Without the 5, the spirit and the flesh are at war.',
    levels: [
      { count: 0, label: 'The Cold Soul', scale: 'absent', verbatim: 'The Cold Soul: Not necessarily asexual, but "physically detached." They treat sex and food as "maintenance" rather than "pleasure." Esoterically, they are here to develop the mind, not the senses.' },
      { count: 1, label: 'The Cold Soul', scale: 'very-weak', verbatim: 'The Cold Soul: Not necessarily asexual, but "physically detached." They treat sex and food as "maintenance" rather than "pleasure." Esoterically, they are here to develop the mind, not the senses.' },
      { count: 2, label: 'The Human', scale: 'norm', verbatim: 'The Human: Balanced passions.' },
      { count: 3, label: 'The Human', scale: 'special', verbatim: 'The Human: Balanced passions.' },
      { count: 4, label: 'The Magnet', scale: 'strong', verbatim: 'The Magnet: Intense charisma. They "leak" energy that others want to consume. They often attract "energy vampires" who want to bask in their fire.' },
      { count: 5, label: 'The Magnet', scale: 'dominant', verbatim: 'The Magnet: Intense charisma. They "leak" energy that others want to consume. They often attract "energy vampires" who want to bask in their fire.' },
      { count: 6, label: 'The Black Hole', scale: 'overload', verbatim: 'The Black Hole: The person is a slave to stimulation. Their "inner fire" burns so hot they need constant external "fuel"—sex, danger, drugs, or extreme emotions—just to feel alive.' }
    ]
  }
];
