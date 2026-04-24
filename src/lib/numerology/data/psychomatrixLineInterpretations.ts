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
  deepDive: string;
  scale: LineScaleLevel;
}

export interface PsychomatrixLineInterpretation {
  id: string;
  type: 'row' | 'column' | 'diagonal';
  digits: number[];
  name: string;
  quality: string;
  introduction: string;
  alexandrovNote: string;
  levels: LineCountInterpretation[];
  transmutation?: string;
}

/**
 * Returns the interpretation for a specific digit count.
 */
export function getLineLevel(
  lineId: string,
  totalDigits: number
): LineCountInterpretation | undefined {
  const lineDef = PSYCHOMATRIX_LINE_INTERPRETATIONS.find(l => l.id === lineId);
  if (!lineDef) return undefined;

  // Find exact match or closest higher for overload
  let level = lineDef.levels.find(l => l.count === totalDigits);
  if (!level && totalDigits >= 6) {
    level = lineDef.levels.find(l => l.count === 6);
  }
  return level;
}

export const PSYCHOMATRIX_LINE_INTERPRETATIONS: PsychomatrixLineInterpretation[] = [
  {
    id: 'row_1',
    type: 'row',
    digits: [1, 4, 7],
    name: 'Purpose & Will',
    quality: 'Purposefulness — Goal Achievement',
    introduction: `Meaning of the First Row of the Psychomatrix
The first row (1, 4, 7) governs the following qualities:
▸ a person's sense of purpose and determination;
▸ the ability to stand up for one's views;
▸ the ability to set goals and objectives for oneself.
Let us analyze the meanings associated with the first row.`,
    alexandrovNote: `Please pay close attention to the following key points:
1. The significance of the first row is particularly strongly influenced by the number 2 (representing energy) and the first column (comprising the numbers 1, 2, and 3—representing self-esteem), as the successful attainment of any goal requires both energy and a desire to assert oneself.
2. Before you attempt to conduct a comprehensive analysis encompassing all the characteristics of the psychomatrix, you must first master the thorough examination of each individual quality in isolation; only then should you proceed to analyze the interplay and mutual influence of these qualities upon one another.`,
    transmutation: 'Row 1 (1, 4, 7) is the engine of achievement. If there is a 1 and 7 but no 4, the person has the will and luck but lacks the health/body stamina to carry it out. They are a "Visionary in a Broken Car."',
    levels: [
      { count: 0, label: 'No Digits', scale: 'absent', verbatim: 'No digits present.', deepDive: 'The person does not set goals or objectives for themselves, relying instead on chance or on other people; they are quite easily persuaded to change their mind and can be made to abandon their plans.' },
      { count: 1, label: 'Single Digit', scale: 'very-weak', verbatim: 'One digit present.', deepDive: 'Weak—or, more accurately, ostentatious—determination. The person may engage in an argument, but this does not imply a genuine desire to achieve a concrete result; typically, it is merely an urge to defeat the other person in the debate or to assert their presence in the discussion, following the principle: "Look, everyone—see how much I love to argue!"' },
      { count: 2, label: 'Double Digits', scale: 'norm', verbatim: 'Two digits present.', deepDive: 'Normal determination. One could say that this person "gathers momentum" in life slowly but surely. They first assess their capabilities and only after doing so do they begin to set worthy goals for themselves.' },
      { count: 3, label: 'Triple Digits', scale: 'special', verbatim: 'Three digits present.', deepDive: 'The person may change their goals in a completely unpredictable manner (abruptly, suddenly, or without warning). Their choices are often entirely unjustified and inexplicable. It is advisable for such individuals to define their goals based on the "strong" digits found elsewhere in their psychomatrix.' },
      { count: 4, label: 'Quadruple Digits', scale: 'strong', verbatim: 'Four digits present.', deepDive: 'Strong determination. The person sets a goal first, and only then do they begin to weigh their capabilities against their actual interest in the goal itself. Very often, they end up achieving goals that do not align with their true interests or capabilities. It is essential to carefully study the entire psychomatrix in such cases; once the right direction has been chosen, one should not set one\'s sights too low.' },
      { count: 5, label: 'Quintuple Digits', scale: 'dominant', verbatim: 'Five digits present.', deepDive: 'Very strong determination. This signifies that once the person has set a goal for themselves, they may become so focused that they completely lose sight of the people around them—including their loved ones, family, and friends. As a result of their stubbornness in pursuing a goal, such a person may stand to lose far more than they gain; yet, they will ultimately achieve the objective—even if that objective has, by then, become completely obsolete. Both self-control and a sense of proportion are essential when striving to accomplish a set task.' },
      { count: 6, label: 'Overload', scale: 'overload', verbatim: 'Six or more digits present.', deepDive: 'Six or more digits: an overload of the quality. The individual sets goals for themselves that appear—at least in their own estimation—to be lofty, perhaps even excessively ambitious, or attempts to pursue multiple goals simultaneously. However, they fail to recognize the obvious reality: that the goal is, in truth, merely a fabrication—one unworthy of their true potential—and that by scattering their efforts across various objectives, they only hinder their own forward progress.' }
    ]
  },
  {
    id: 'row_2',
    type: 'row',
    digits: [2, 5, 8],
    name: 'Family & Attachment',
    quality: 'Family Orientation — Attachment',
    introduction: `The second row (2, 5, 8) governs the following qualities:
▸ the qualities of a family-oriented person;
▸ the desire to have a family;
▸ the need to be surrounded by relatives and close loved ones.
This trait can, however, degenerate into the "social activist" archetype—a state in which one's job and work colleagues effectively replace one's family, while friends take the place of blood relatives.`,
    alexandrovNote: `While the intensity of the second line should certainly be taken into account when establishing a family, under no circumstances should one attempt to assess the overall compatibility between two individuals based solely on this specific characteristic. The fact is that compatibility is influenced by a vast multitude of factors and personal qualities. We can state that if a family has already been established, the individual within it possesses the specific qualities of a family person indicated by the numbers in the second row.
However, we cannot make any assertions regarding the stability of that family; to do so, it is necessary to analyze all the numbers, lines, and diagrams associated with the psychomatrix. Only then is it possible to determine the true extent of a given couple's compatibility.
If you are conducting a psychoanalysis of a family and observe that the individuals are incompatible across many characteristics, never recommend that they separate before you have exhausted every opportunity to strengthen the family bond and ensure its stability. It was precisely for these purposes that the concept of "number transitions" was discovered and that many of the recommendations found in this book were formulated. Remember: you will not impress people by simply pointing out their problems; rather, you will deal a devastating blow to an already fragile family unit. Offer assistance—do not cause harm.`,
    levels: [
      { count: 0, label: 'Not Family Oriented', scale: 'absent', verbatim: 'No digits present.', deepDive: 'The individual is not family-oriented. This implies that family matters occupy the very last place on their list of priorities. As a rule, such people are in no hurry to start a family (being far more interested in their work, career, friends, and other pursuits).' },
      { count: 1, label: 'Reluctant Partner', scale: 'very-weak', verbatim: 'One digit present.', deepDive: 'The individual acknowledges the necessity of starting a family but makes no particular effort in that direction. They may, however, feign activity—creating the illusion that they are actively searching for a partner with whom to build a family life.' },
      { count: 2, label: 'Balanced Seeker', scale: 'norm', verbatim: 'Two digits present.', deepDive: 'Two digits — the individual waits for the right moment when everything falls into place naturally; the effort they expend is commensurate with their actual capabilities. If a proposal comes their way, they will not refuse it, yet they will not actively push for it themselves. However, should they encounter their "other half," they may decide to take active steps toward starting a family.' },
      { count: 3, label: 'The Conflictual Heart', scale: 'special', verbatim: 'Three digits present.', deepDive: 'Three digits — the individual is torn between an intense desire to start a family at any cost and a complete reluctance to do so. If such a person does decide to marry, they must seize the opportunity immediately; otherwise, the matter will be postponed for a very long time.' },
      { count: 4, label: 'Family Pillar', scale: 'strong', verbatim: 'Four digits present.', deepDive: 'Four digits — the individual wishes to start a family and proceeds to do so without delay. As a rule, they are rarely the cause of a family\'s dissolution, as they strive to preserve it. This very trait, however, may lead to the formation of an unhappy family unit, simply because having a family is a vital necessity for them—something they cannot easily live without.' },
      { count: 5, label: 'The Idealist', scale: 'dominant', verbatim: 'Five digits present.', deepDive: 'Five digits — an exceptionally strong inclination toward family life. Such individuals attempt to mold their family into their own personal ideal; this tendency may lead them to place excessively high demands upon their loved ones. Their only saving grace is that they hold themselves to those very same exacting standards. They simply cannot exist without a family.' },
      { count: 6, label: 'Overloaded Archetype', scale: 'overload', verbatim: 'Six or more digits present.', deepDive: 'Six or more digits — the "family-oriented" trait is overloaded, which paradoxically results in its attenuation. The explanation is simple: they spend an inordinate amount of time searching for their ideal partner or family model, a quest that ultimately delays—or even prevents—the actual formation of a family.' }
    ]
  },
  {
    id: 'row_3',
    type: 'row',
    digits: [3, 6, 9],
    name: 'Stability & Habits',
    quality: 'Stability of Character — Daily Habits',
    introduction: `The third row (3, 6, 9) governs the following qualities:
▸ an individual's stability and daily habits;
▸ their emotional attachments;
▸ a tendency toward domesticity (being a "homebody");
▸ a fear of—or aversion to—change.
If this line is weak (i.e., it contains no numbers, or only one, two, or three numbers), it manifests as a "revolutionary" spirit—a desire for change, travel, adventure, and a change of scenery.`,
    alexandrovNote: `How should one evaluate the quality of stability—as a positive or negative attribute?
Let us assume that an individual possesses a very high degree of stability. This implies that they find it extremely difficult to relinquish their attachments and habits—a resistance that ultimately hinders their progress toward the new, as the "old" acts as a drag, holding them back.
Is it likely that a highly stable individual would immerse themselves completely in the contemplation of new ideas, tasks, or plans? It is highly improbable; they remain too firmly bound by their habits—habits that constantly demand their attention and energy.
It could be argued that for the sake of family life, or for employment (particularly in roles requiring one to execute the will of others), this quality of stability is indeed highly desirable. However, if our goal is to foster the development of an individual's unique personality and innate talents, then cultivating a multitude of habits—which inevitably consume both time and energy in their maintenance—is generally inadvisable.

As for the spirit of "revolution" or radical change: it is precisely these individuals—those who, by their very nature, generate a multitude of challenges around themselves—who ultimately drive humanity forward (even if, at times, this progress entails a temporary regression to the ways of the past). If you have low stability, change your surroundings more frequently: visit friends, go to museums, or embark on trips. If you have high stability, do not let your habits hold you back. It is best to find a consistent hobby, an area of ​​interest, or a subject for contemplation (such as great mysteries or problems that remain insoluble to science or humanity).`,
    levels: [
      { count: 0, label: 'The Revolutionary', scale: 'absent', verbatim: 'Empty or weak line.', deepDive: 'The individual is a revolutionary at heart. They strive to alter everything around them, frequently changing their social circle and workplace; they challenge almost every convention, love to travel, and are always ready to pick up and go. They lack stability in their habits and emotional attachments. They may spontaneously initiate a multitude of habits and attachments, thereby creating an illusion of stability; yet, just as easily, they may abandon them without any apparent reason. After some time, they may revive these forgotten attachments—but only as a means of renewing their lives. All of this occurs quite unexpectedly. They are inclined toward refreshing their domestic environment and undertaking home renovations.' },
      { count: 1, label: 'The Revolutionary', scale: 'very-weak', verbatim: 'One digit present.', deepDive: 'The individual is a revolutionary at heart. They strive to alter everything around them, frequently changing their social circle and workplace; they challenge almost every convention, love to travel, and are always ready to pick up and go. They lack stability in their habits and emotional attachments. They may spontaneously initiate a multitude of habits and attachments, thereby creating an illusion of stability; yet, just as easily, they may abandon them without any apparent reason. After some time, they may revive these forgotten attachments—but only as a means of renewing their lives. All of this occurs quite unexpectedly. They are inclined toward refreshing their domestic environment and undertaking home renovations.' },
      { count: 2, label: 'The Revolutionary', scale: 'norm', verbatim: 'Two digits present.', deepDive: 'The individual is a revolutionary at heart. They strive to alter everything around them, frequently changing their social circle and workplace; they challenge almost every convention, love to travel, and are always ready to pick up and go. They lack stability in their habits and emotional attachments. They may spontaneously initiate a multitude of habits and attachments, thereby creating an illusion of stability; yet, just as easily, they may abandon them without any apparent reason. After some time, they may revive these forgotten attachments—but only as a means of renewing their lives. All of this occurs quite unexpectedly. They are inclined toward refreshing their domestic environment and undertaking home renovations.' },
      { count: 3, label: 'The Revolutionary', scale: 'special', verbatim: 'Three digits present.', deepDive: 'The individual is a revolutionary at heart. They strive to alter everything around them, frequently changing their social circle and workplace; they challenge almost every convention, love to travel, and are always ready to pick up and go. They lack stability in their habits and emotional attachments. They may spontaneously initiate a multitude of habits and attachments, thereby creating an illusion of stability; yet, just as easily, they may abandon them without any apparent reason. After some time, they may revive these forgotten attachments—but only as a means of renewing their lives. All of this occurs quite unexpectedly. They are inclined toward refreshing their domestic environment and undertaking home renovations.' },
      { count: 4, label: 'The Stable Soul', scale: 'strong', verbatim: 'Four or five digits.', deepDive: 'Four or five digits: These are highly stable individuals. They surround themselves with various attachments and habits, thereby establishing a stable environment. They can, at times, be somewhat rigid or tedious in their adherence to these attachments. They find change extremely difficult to embrace, have little inclination for long-distance travel, and are true homebodies. Even within their own homes, they tend to resist any alterations to their immediate surroundings. For them, home renovation is nothing short of a tragedy.' },
      { count: 5, label: 'The Stable Soul', scale: 'dominant', verbatim: 'Five digits present.', deepDive: 'Four or five digits: These are highly stable individuals. They surround themselves with various attachments and habits, thereby establishing a stable environment. They can, at times, be somewhat rigid or tedious in their adherence to these attachments. They find change extremely difficult to embrace, have little inclination for long-distance travel, and are true homebodies. Even within their own homes, they tend to resist any alterations to their immediate surroundings. For them, home renovation is nothing short of a tragedy.' },
      { count: 6, label: 'Stability Overload', scale: 'overload', verbatim: 'Six or more digits present.', deepDive: 'Here, we once again encounter an "overload" of the quality in question. The individual strives to surround themselves with such an abundance of habits that they eventually begin to discard them—precisely because these habits have become hindrances. One could say that they are engaged in a perpetual struggle against the very stability they themselves have created—a struggle manifested through the constant renewal of old habits.' }
    ]
  },
  {
    id: 'col_1',
    type: 'column',
    digits: [1, 2, 3],
    name: 'Self-Esteem',
    quality: 'Self-Esteem — Individuality',
    introduction: `The total number of digits in the first column (1, 2, 3) determines the strength of a person's self-esteem.
Embedded within this quality is the desire to stand out from the crowd—to appear as a more vibrant and distinctive personality (manifesting through intellect, conversation, clothing, cosmetics, etc.).
Very often in numerological literature, the first column is attributed the quality of "selfishness." I believe this is a misinterpretation, as a person's self-esteem has nothing in common with selfishness—especially since a different characteristic within the psychomatrix is ​​responsible for a person's egoism (to jump ahead slightly, I will mention that this is the number 1, or more precisely, one of its variations).
It is essential to understand that no talented, intelligent, or gifted individual can truly fulfill their potential without a sufficiently high level of self-esteem.
If, however, someone simply cannot resist labeling this quality as "selfishness," I suggest adding a clarifying modifier: healthy (or normal) selfishness. Let us now analyze how the nature of self-esteem changes based on the number of digits present.`,
    alexandrovNote: `When assessing the strength of the "first column" (representing self-esteem), it is crucial to remember that you should not immediately confront a person with a direct statement regarding their actual level of self-worth.
Instead, by referencing their psychomatrix, you can speak of a predisposition toward a certain type of self-esteem.
You will observe the true reality of the situation only when you correlate the potential a person was endowed with at birth against what they have actually achieved (or are striving to achieve).

▸ If a person was endowed with far greater potential than they have actually utilized, it indicates that they are underestimating their own capabilities.
▸ If a person has actively worked on their self-development and achieved significant results, it suggests that their self-esteem has risen to an appropriate level.
▸ If you encounter someone who talks incessantly about their capabilities and talents but, in practice, cannot point to a single tangible accomplishment, their self-esteem is clearly inflated; they are overestimating themselves.

Tips for Adjusting Self-Esteem
The fundamental advice is quite simple: you must learn to evaluate yourself and your actions realistically. To do this, you need to fully understand the capabilities and natural inclinations with which you were endowed at birth.
Clearly, a comprehensive analysis of your personal psychomatrix is ​​an indispensable step in this process.
✓ If, after conducting such a psychoanalysis, you discover that you (or your child) possess exceptional talent, intellect, or logical aptitude, do not squander these innate gifts. You must elevate your personal goals to a level commensurate with your potential.
✓ Beware of becoming consumed by the mundane grind of daily life or by the relentless pursuit of material wealth; such pursuits will be valued by no one—neither by Nature itself, nor by your children and grandchildren.
✓ You must learn to set ambitious, global-scale goals—objectives that extend beyond your own personal interests to benefit humanity and the natural world as a whole.
✓ Conversely, if fate has endowed you with a high sense of self-worth but has not gifted you with corresponding levels of talent, memory, or logical ability, you must either temper your self-esteem to a more realistic level or commit yourself to self-development until your actual capabilities align with your aspirations.

Isn't it ironic? How often do we set unrealistic goals for ourselves—not because we lack talent, but because we lack self-knowledge? How many people strive desperately for power, unaware of their true talents as artists, poets, scientists, and the like?
✓ If you undertake a task and find yourself making no headway, do not rush to expend every ounce of your mental and physical energy in an attempt to force the outcome. It may simply be that you are not meant to express yourself in that particular field of human endeavor.
✓ First, you must know where you are going; only then should you set out on the journey.
✓ Nature has embedded within every human being a unique, innate knowledge of their own true self! This alone should suffice to prevent us from comparing the metrics of one talent against another. It is a human imperative to fully realize one's potential, lest one hinder the progress of future generations.
We often feel sorrow for talented individuals who passed away prematurely—figures such as Vladimir Vysotsky or Andrei Mironov. Yet, if you truly reflect on it, can you honestly imagine Andrei Mironov as a frail, infirm old man? Or Vysotsky, reaching retirement age and sitting down to pen his memoirs? It is an absurdity.
These individuals realized their full potential—brilliantly and swiftly—before moving on to new destinies. Their new physical forms are already among us, and we will once again witness their talent, albeit through different faces.
This is not a discourse on the transmigration of souls; rather, we are speaking to the truth that "nature abhors a vacuum." A talented individual, having fully expended their potential, vacates that space to make room for another talent to emerge.
What truly hinders a person is not their self-esteem or a lack of talent, but rather their destructive habits: alcoholism, sloth, drug addiction, the lust for power, and hubris. One must wage a battle against these vices; only then will issues regarding one's self-worth cease to exist.`,
    levels: [
      { count: 0, label: 'Low Self-Esteem', scale: 'absent', verbatim: 'Up to three digits.', deepDive: 'It can be said that the individual suffers from low self-esteem and underestimates their own capabilities. With exactly three digits, they may occasionally experience moments of "insight" regarding their worth, but far more often, they remain "lacking in self-confidence."' },
      { count: 1, label: 'Low Self-Esteem', scale: 'very-weak', verbatim: 'Up to three digits.', deepDive: 'It can be said that the individual suffers from low self-esteem and underestimates their own capabilities. With exactly three digits, they may occasionally experience moments of "insight" regarding their worth, but far more often, they remain "lacking in self-confidence."' },
      { count: 2, label: 'Low Self-Esteem', scale: 'norm', verbatim: 'Up to three digits.', deepDive: 'It can be said that the individual suffers from low self-esteem and underestimates their own capabilities. With exactly three digits, they may occasionally experience moments of "insight" regarding their worth, but far more often, they remain "lacking in self-confidence."' },
      { count: 3, label: 'Occasional Insight', scale: 'special', verbatim: 'Up to three digits.', deepDive: 'It can be said that the individual suffers from low self-esteem and underestimates their own capabilities. With exactly three digits, they may occasionally experience moments of "insight" regarding their worth, but far more often, they remain "lacking in self-confidence."' },
      { count: 4, label: 'Good Self-Esteem', scale: 'strong', verbatim: 'Four digits.', deepDive: 'Good self-esteem. The individual strives to stand out from the general crowd and invests significant effort into doing so.' },
      { count: 5, label: 'Very Strong / Inflated', scale: 'dominant', verbatim: 'Five digits.', deepDive: 'Very strong self-esteem. This can sometimes become inflated—specifically when the individual, without continuing to improve themselves, begins to evaluate their worth solely based on the maximum inherent strength of this particular quality.' },
      { count: 6, label: 'Covert Leader', scale: 'overload', verbatim: 'Six or more digits.', deepDive: 'An overload of the self-esteem quality leads the individual to conceal their true abilities—often to the point of forgetting about them entirely—whenever they "step out into the public eye." As a rule, such individuals fail to achieve the goals they set for themselves, as they possess courage only in proud solitude, when no one is there to evaluate their capabilities. These are hidden, covert leaders—individuals who appear modest to the outside world but place a very high value on their own abilities when no one else is around.' }
    ]
  },
  {
    id: 'col_2',
    type: 'column',
    digits: [4, 5, 6],
    name: 'Labor & Gains',
    quality: 'Independence — Provision',
    introduction: `The second column (4, 5, 6) comprises complex and active numbers:
▸ 4 – physical health;
▸ 5 – logic and intuition;
▸ 6 – an aptitude for physical labor and craftsmanship.
All these numbers require a significant expenditure of willpower to fully manifest. Just try forcing yourself to stick to a health-boosting diet, to formulate a realistic long-term action plan, or to perform physical labor—you will quickly realize the effort involved.
Since the individual numbers constituting this line demand an act of will, the line as a whole cannot function without it.
The combination of these three qualities defines the core characteristic of the second column: a person's drive toward material independence, the establishment of a comfortable domestic life, and the material provision for their family.`,
    alexandrovNote: `Can one truly reproach a person for being unable to adequately provide for their family? This question should be directed at those who determine the fate of the world.
As long as individuals continue to pursue what society demands of them—rather than what they are naturally inclined toward—idleness, unemployment, and the attendant consequences of these ills will persist. It is essential to learn how to harness the innate talents embedded within each person, rather than attempting to impose an external will upon them.`,
    levels: [
      { count: 0, label: 'The Dependent', scale: 'absent', verbatim: 'No numbers or only one number.', deepDive: 'The individual has no desire to be self-supporting and may feel entitled to "live off" someone else (parents, a spouse, etc.). For women, a weak manifestation of this line poses no particular threat, as the primary responsibility for providing for the family traditionally rests upon the husband.' },
      { count: 1, label: 'The Dependent', scale: 'very-weak', verbatim: 'No numbers or only one number.', deepDive: 'The individual has no desire to be self-supporting and may feel entitled to "live off" someone else (parents, a spouse, etc.). For women, a weak manifestation of this line poses no particular threat, as the primary responsibility for providing for the family traditionally rests upon the husband.' },
      { count: 2, label: 'Fear-Driven Provider', scale: 'norm', verbatim: 'Two numbers.', deepDive: 'The individual is conscious of the need to provide for their family; driven by a fear of future financial insecurity, they begin seeking a profession based primarily on the salary offered. Consequently, such a person may sacrifice their personal dreams for the sake of a stable income; however, should an opportunity arise to avoid doing so, they will not put up much resistance, as they lack a deep-seated drive to provide for themselves and their family.' },
      { count: 3, label: 'Impulsive Worker', scale: 'special', verbatim: 'Three numbers.', deepDive: 'These individuals tend to work in an impulsive, intermittent manner. Their guiding principle is to work intensely for a short period—just long enough to cover their needs for a certain duration—and then to take a break until the need to work arises again.' },
      { count: 4, label: 'Life-Provider', scale: 'strong', verbatim: 'Four or five numbers.', deepDive: 'These individuals devote an immense amount of time and energy to providing for their families. Very often, this becomes their sole objective in life.' },
      { count: 5, label: 'Life-Provider', scale: 'dominant', verbatim: 'Four or five numbers.', deepDive: 'These individuals devote an immense amount of time and energy to providing for their families. Very often, this becomes their sole objective in life.' },
      { count: 6, label: 'Overloaded Labor', scale: 'overload', verbatim: 'Six or more digits.', deepDive: 'Six or more digits signify an "overload of quality": when such an individual begins to work intensively, they quickly burn themselves out and eventually withdraw completely from labor (having overexerted themselves); they undertake many different tasks, scattering their energy and thereby creating a complete illusion of actual work.' }
    ]
  },
  {
    id: 'col_3',
    type: 'column',
    digits: [7, 8, 9],
    name: 'Talents',
    quality: 'Talent — Genius Potential',
    introduction: `The third column (7, 8, 9) of the psychomatrix governs a person's talent.`,
    alexandrovNote: `The greater the number of digits, the stronger the talent. However, this does not mean that if this line is particularly strong (containing, say, five digits—a number that avoids "overload"), the individual will inevitably become talented.
Remember: the realization of talent is influenced by many digits and lines within the psychomatrix—including character, energy levels, self-esteem, determination, health, luck, and others. It is precisely the combination of numerous personal characteristics, coupled with the individual's own force of will, that leads to the achievement of one's goals.

It is crucial to identify the specific sphere in which a person’s efforts should be directed. Do not simply drift along with the current of life. There exists a whole list of "fashionable" professions: lawyer, banker, corporate president, economist... Yet, the choice of these professions is driven not by an individual's talent, but rather by the desire to provide for oneself and one's loved ones—or, even more frequently, by personal connections.
Before you advise your child to choose a "lucrative" profession, give some thought to their future. It requires little effort to recall a few historical facts. Who was the wealthiest landowner in Russia during the era of A.S. Pushkin? Who was the wealthiest person in the USSR at the time the film The Red Snowball Tree was being made?
I believe these questions suffice to make one realize that an era is defined not by a person's official position, but by their talent.
Nurture your child's talent, and they will be grateful to you for it—provided, of course, that you do not instill in them the notion that possessing talent is a secondary matter, and that the only thing that truly counts is to "bury" oneself in money and material possessions.

There is a vast number of talented people in the world whose potential remains untapped. We would not be far off the mark if we estimated this figure to be roughly 95–99% of the planet's population. Before you stifle the development of your child's interests, take a look at your own numbers and ask yourself: have you managed to unlock your own potential and innate capabilities? If not, then have mercy on yourself and your child; grant him the opportunity to take his place in the History of the Earth, and grant yourself the opportunity to help him do so.
Do not try to cast me as some starry-eyed dreamer with his head in the clouds. Simply ask yourselves: why is it that, to this day, we continue to seek out—for our children—schools, kindergartens, doctors, and educators that are at least "decent," if not better?
The reality is that the most gifted individuals gravitate toward where the money is; yet, the money isn't there because there is no return on investment—a true vicious circle. We must begin with the return itself; only then will we cultivate strong financiers and administrators, and only then will the machinery of government—along with countless other institutions—be staffed by individuals who are both responsible and truly know how to get things done. At that point, the dilemma of "where best to go" will cease to exist. Everyone will naturally gravitate toward the places where their unique talents can be fully realized.
It is imperative to understand that every human being is unique and stands accountable before Nature itself. We are all answerable—both for ourselves and for our children—to the generations yet to come.
Every unrealized talent inevitably drags down with it an entire chain of other "unrealized" individuals; this will ultimately plunge humanity back into an era of barbarism, war, terror, mutual hatred, and a desperate urge to turn back the clock—reverting to a state of savagery.
Learn to take responsibility for yourselves!`,
    levels: [
      { count: 0, label: 'Latent Potential', scale: 'absent', verbatim: 'Strength proportional to digits.', deepDive: 'Talent requires activation. Without digits in this line, the potential remains latent and must be developed through other strong parts of the matrix.' },
      { count: 1, label: 'Single Gift', scale: 'very-weak', verbatim: 'Strength proportional to digits.', deepDive: 'A single spark of talent is present, requiring focus and character (1) to be brought into reality.' },
      { count: 2, label: 'Average Talent', scale: 'norm', verbatim: 'Strength proportional to digits.', deepDive: 'Standard level of creative ability, often expressed through professional skills or hobbies.' },
      { count: 3, label: 'Significant Ability', scale: 'special', verbatim: 'Strength proportional to digits.', deepDive: 'A clear and distinct talent that can become a defining life path if chosen consciously.' },
      { count: 4, label: 'Strong Talent', scale: 'strong', verbatim: 'Strength proportional to digits.', deepDive: 'High level of creative or scientific potential. The person is distinctly gifted.' },
      { count: 5, label: 'Vibrant Talent', scale: 'dominant', verbatim: 'Strength proportional to digits.', deepDive: 'Maximum intensity of talent before overload. This is the mark of an exceptionally gifted individual.' },
      { count: 6, label: 'Overloaded Genius', scale: 'overload', verbatim: 'Strength proportional to digits.', deepDive: 'When this line is overloaded, the talent can become a burden. The person may struggle to choose a direction because they perceive too many possibilities.' }
    ]
  },
  {
    id: 'diag_spirit',
    type: 'diagonal',
    digits: [1, 5, 9],
    name: 'Spirituality',
    quality: 'Spirituality — Faith',
    introduction: `The diagonal containing the numbers 1, 5, and 9 (the descending diagonal) governs:
▸ a person's spirituality;
▹ their aspiration toward spiritual intimacy and a Higher Principle—whether God, a Higher Intelligence, abstract ideas, or fanaticism.
A person's level of spirituality increases in direct proportion to the number of digits present in this specific line.
It can be said that up to five digits, a person's spirituality gradually intensifies—evolving from a state of non-spirituality (when no digits are present) to a maximum intensity (when five digits are present).`,
    alexandrovNote: `When analyzing a psychomatrix, it is essential to pay close attention to the interplay between the two diagonals: the "carnal" (material) and the "spiritual." It is precisely this relationship that plays the pivotal role in determining the relative strength of each line.

By assessing the strength of each line, we can determine which aspect holds greater importance for an individual within a future family context: their interest in a partner's spiritual nature, or the material aspect (the "carnal" side, including the sexual sphere).
Ideally, both lines should be represented with equal strength. In a perfect scenario, the quantitative characteristics of one partner's diagonals should precisely match those of the other partner.

EXAMPLE: If a wife's "carnal" diagonal contains 5 digits and her "spiritual" diagonal contains 4 digits, their ratio can be expressed as 5:4. Let us assume that the husband possesses the following diagonal ratio: the physical diagonal consists of 5 digits, while the spiritual diagonal consists of 2 digits; thus, the diagonal ratio is 5/2.
A comparison reveals that the husband is more interested in his wife as a physical woman than as a distinct personality; consequently, he will fail to devote adequate attention to preparing his wife for intimacy, as his interest lies more in the body than in the soul. In such a situation, the wife may harbor resentment toward her husband due to his lack of attentiveness.
▸ When analyzing psychomatrices, it is essential to bear in mind that, ideally, the diagonal ratios should either match exactly or differ only minimally (by no more than one digit).
▸ If the physical diagonal predominates in the husband's chart, then the wife's chart should likewise show a predominance of the physical diagonal over the spiritual one.
▸ Do not attempt to conduct experiments with relationships where one partner's excessive physical drive is expected to be tempered by the other's strong spirituality—such spouses are incompatible.
One should not form a couple where one partner needs to "talk" while the other needs to "feel." In such an intimate dynamic, both partners suffer.`,
    levels: [
      { count: 0, label: 'Non-Spiritual', scale: 'absent', verbatim: 'From non-spirituality to five.', deepDive: 'At zero digits, the individual focuses exclusively on material and tangible reality, with little interest in abstract or higher principles.' },
      { count: 1, label: 'Awakening Seeker', scale: 'very-weak', verbatim: 'From non-spirituality to five.', deepDive: 'Spirituality is beginning to awaken. The person occasionally looks for higher meaning in life events.' },
      { count: 2, label: 'Average Faith', scale: 'norm', verbatim: 'From non-spirituality to five.', deepDive: 'A balanced level of interest in spiritual matters, neither obsessive nor absent.' },
      { count: 3, label: 'Balanced Believer', scale: 'special', verbatim: 'From non-spirituality to five.', deepDive: 'A stable level of spirituality where the aspiration toward a Higher Principle becomes a noticeable part of the internal life.' },
      { count: 4, label: 'The Devotee', scale: 'strong', verbatim: 'From non-spirituality to five.', deepDive: 'High level of spiritual intensity and a strong commitment to their chosen ideals or faith.' },
      { count: 5, label: 'The Awakened Soul', scale: 'dominant', verbatim: 'From non-spirituality to five.', deepDive: 'Maximum intensity of spirituality—a state where the aspiration toward a Higher Principle is a defining trait of the personality.' },
      { count: 6, label: 'The Fanatic', scale: 'overload', verbatim: 'Six digits or more indicate "Fanaticism."', deepDive: 'If this line contains six or more digits, it indicates an "overload" of this quality. Most often, this leads to fanaticism, idolatry, or sectarianism, wherein all standard human norms become distorted beyond recognition. By transforming into its complete opposite, spirituality degenerates into absolute non-spirituality. Faith in God morphs into a "witch hunt," where the commandment "Thou shalt not kill" is utterly disregarded in the zeal to prove one\'s faith. Fanaticism, in its most extreme stages, is invariably devoid of spirituality, as it tolerates no viewpoints other than its own.' }
    ]
  },
  {
    id: 'diag_carnal',
    type: 'diagonal',
    digits: [3, 5, 7],
    name: 'Temperament',
    quality: 'Carnal Interests — Intimacy',
    introduction: `The ascending diagonal (3, 5, 7) defines a person's carnal interests:
▸ temperament in their intimate life;
▸ the desire to dress stylishly and eat well.
However, the primary significance of this line lies in a person's intimate life—their temperament and their need for closeness.
This aspect is one of the most critical within a family unit. Most often, it is a lack of temperamental compatibility that leads to the dissolution of a family.
Before we proceed to a quantitative assessment of the "carnal diagonal," let us attempt to understand the specific nature of this quality. It is essential to recognize that this refers to how well a person understands the dynamics of intimacy—specifically, how important it is for them to truly understand their partner and to achieve a state of maximum union that results in mutual and complete satisfaction.`,
    alexandrovNote: `Sexual relations serve as the foundation upon which a family is built; however, over time, they often recede into the background, displaced by the demands of raising children, managing domestic life, work obligations, and so forth. It is at this juncture that a crisis in the couple's sexual relationship typically emerges: while one partner may find this decline in intimacy perfectly acceptable, the other may perceive it as a catastrophe—a profound crisis signifying the loss of the very meaning of family life. For this very reason, it is highly advisable to select a partner whose "carnal diagonal" is of equal strength to one's own. A discrepancy of no more than a single digit is permissible—though ideally, the man's carnal diagonal should be the slightly stronger of the two.`,
    levels: [
      { count: 0, label: 'The Ascetic', scale: 'absent', verbatim: 'Spiritual closeness is priority.', deepDive: 'This indicates that sexual relations do not occupy a particularly significant place in the person\'s life. For them, the priority is spiritual closeness and mutual understanding, rather than physical intimacy itself. On the other hand, a person with an "empty carnal diagonal" adapts easily to their partner, accommodating their needs during intimate moments; this flexibility helps prevent serious issues in the couple\'s intimate life.' },
      { count: 1, label: 'Lukewarm', scale: 'very-weak', verbatim: 'Lacks deep understanding.', deepDive: 'This suggests that the person lacks a deep understanding of sexual relations. In women, this often manifests as emotional coldness or indifference when choosing a partner. Men with this configuration tend to prioritize quantity over quality in their intimate encounters—seeking multiple partners rather than deep connection—which frequently leads to infidelity on their part. One could say that, for them, it makes little difference "with whom or how" the act takes place. For them, each sexual encounter represents an attempt to prove their "virility"—to validate their sexual prowess and masculine strength.' },
      { count: 2, label: 'Normal Temperament', scale: 'norm', verbatim: 'Intimacy as integral part.', deepDive: 'A normal temperament. The individual views intimacy as an integral part of their life; however, should intimacy become temporarily impossible, they handle this hiatus with relative composure.' },
      { count: 3, label: 'Normal Temperament', scale: 'special', verbatim: 'Intimacy as integral part.', deepDive: 'A normal temperament. The individual views intimacy as an integral part of their life; however, should intimacy become temporarily impossible, they handle this hiatus with relative composure.' },
      { count: 4, label: 'Strong Temperament', scale: 'strong', verbatim: 'Need for closeness.', deepDive: 'A strong temperament; the individual has a distinct need for intimacy. They are discerning when choosing partners, generally preferring a single, steady companion. While their intimate life is not the most critical aspect of their existence, neither is it a matter of indifference to them.' },
      { count: 5, label: 'Maximum Intensity', scale: 'dominant', verbatim: 'Cannot function without active sex life.', deepDive: 'The strongest possible temperament regarding intimate life. The individual cannot function without an active sex life; furthermore, the quality of the experience—and who it is shared with—is of paramount importance to them. They require a steady—one might even say ideal—partner. The mere "fulfillment of marital duty" is unacceptable to them; they require mutual understanding and a state of absolute harmony. Such an individual regards intimacy as an art form.' },
      { count: 6, label: 'Satiation / Overload', scale: 'overload', verbatim: 'Crave excessive variety.', deepDive: 'An "overload" state. The individual begins to crave variety so intensely that they lose all sense of proportion and meaning in the pursuit, which paradoxically leads to emotional coldness stemming from a deep-seated dissatisfaction with intimacy itself. A frequent turnover of partners becomes the norm for them—provided, of course, that past connections can be maintained and occasionally reactivated.' }
    ]
  }
];
