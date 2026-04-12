// src/lib/numerology/data/psychomatrixData.ts
//
// ALEXANDROV'S PSYCHOMATRIX — Complete Verbatim Reference Data
// Based on the original teachings of Professor A. Alexandrov
// Founder of Digital Analysis & Numerological Psychomatrix

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface PsychomatrixCellMeaning {
  count: number;         // 0 = absent, 1–6+
  label: string;         // Short title e.g. "Will-less, Egoistic"
  verbatim: string;      // Full Alexandrov verbatim text
  scale: 'absent' | 'very-weak' | 'norm' | 'special' | 'strong' | 'dominant' | 'overload';
}

export interface PsychomatrixCellData {
  digit: number;
  cellName: string;      // e.g. "Character / Will"
  intro: string;         // Alexandrov's intro paragraph for this digit
  lineContext: string;   // Which lines this digit participates in
  meanings: PsychomatrixCellMeaning[];
}

export interface PsychomatrixLineData {
  id: string;
  type: 'row' | 'column' | 'diagonal';
  digits: number[];
  name: string;
  quality: string;
  description: string;
}

export interface PsychomatrixResult {
  day: number;
  month: number;
  year: number;
  first: number;        // Sum of all birth digits
  second: number;       // Sum of digits of first
  third: number;        // First – (2 × first digit of day)
  fourth: number;       // Sum of digits of third
  allDigits: number[];
  counts: Record<number, number>;
  grid: Array<Array<string | null>>;
  activeLines: string[];
  complementaryInsights: ComplementaryInsight[];
  cellReadings: CellReading[];
}

export interface CellReading {
  digit: number;
  count: number;
  cellName: string;
  label: string;
  verbatim: string;
  scale: PsychomatrixCellMeaning['scale'];
  modifiers: string[];
}

export interface ComplementaryInsight {
  digits: number[];
  title: string;
  insight: string;
  type: 'amplify' | 'tension' | 'transition' | 'synergy';
}

// ─────────────────────────────────────────────────────────────────────────────
// CELL MEANINGS — Full verbatim Alexandrov
// ─────────────────────────────────────────────────────────────────────────────

export const PSYCHOMATRIX_CELL_MEANINGS: Record<number, PsychomatrixCellData> = {
  1: {
    digit: 1,
    cellName: 'Character / Will',
    intro: 'Digit 1 in the psychomatrix answers for the character of a person, his willful qualities, strength of striving for power, ability to defend his own views.',
    lineContext: 'Row 1 (1, 4, 7) — Purposefulness. Column 1 (1, 2, 3) — Self-esteem. Spiritual diagonal (1, 5, 9) — Spiritual life.',
    meanings: [
      {
        count: 0,
        label: 'Character Absent',
        verbatim: 'No digit 1 is present. The quality of character and will is absent or profoundly undeveloped. The person avoids assertion entirely, defaulting to accommodation. There is an almost complete lack of independent will-expression. This person relies entirely on others to set the direction of their life. Building character must be a conscious lifelong project.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Will-less, Egoistic',
        verbatim: 'Will-less, egoistic. One can say this is one of the most difficult characters. They are possessed by people contradictory in their nature. Having a will-less character, they avoid making any decisions, trying to shift them onto another person\'s shoulders. Running away from making a decision, they desperately imitate activity and vigorously show their willful qualities. That is why they always enter into an argument on any issue. As surprising as it may be, the subject of the argument is absolutely indifferent to them, as in the argument itself they are only interested in victory, they acutely need success, striving to show everyone the strength of character. Often become egoistic, achieving victory, they do not notice other people with their requests and troubles. Such people never make hasty decisions, give complex answers that can be understood differently, which gives them the opportunity to renounce their words, or even better — not make any decisions. Don\'t you dare accuse them of will-lessness. You will offend them, and they simply won\'t believe you, again showing their quality of a quarreler.',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Soft Character, Praise-Seeking',
        verbatim: 'People having two units in the psychomatrix differ by a soft character, very love praise and earn it in every way. That is why they help others a lot, easily enter any company, are noticeable in it, as they strive to attract attention to themselves, to subsequently receive gratitude for a pleasant meeting. They know how to listen to another, if he does not try to pressure them. Very rarely use pressure on another person. They often lack firmness in defending their views, and they strive for a profession independent of anyone, however, the desire to receive praise pushes them into the field of doctor, teacher. Often they do not have purposefulness and self-esteem, which becomes a reason for underestimation of their goals. If they are lucky and in the Pythagoras Square there are \'22\' or \'2222 or more\', their initiative becomes more active.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Golden Mean',
        verbatim: 'Golden mean. Such people can find common language with any person. They can, if necessary, yield in an argument to anyone (even \'1\'). The main thing to know — one cannot pressure such a person, as defending himself, he will defeat anyone, even a despot. A person with the character \'golden mean\' makes a natural transition to a new character: \'1 and 8\' (we consider that digit 8 is absent). It corresponds to a soft and tolerant character. This external, deceptive softness pushes lovers of commanding others to test their power on those who have the character \'111\', which turns into an unexpected explosion of emotions, and this leads to conflict and suppression of the despot. If parents from childhood years have been suppressing a child with this type of character, then it can be said for sure that this child will grow up with little sense of duty towards his parents. Remember: everything in life goes in a circle. If one forgets about his duty towards his parents, then he himself should give birth to a child who will lose his sense of duty towards him.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Strong, Volitional Character',
        verbatim: 'This is a volitional and strong character. These people know how to set goals before themselves. If they have energy (22 and more) — they are ready to enter into an argument and strive for victory. However, they always know the measure and do not cross certain boundaries, as they do not possess despotism. They always remember their interlocutor, not striving to offend him. Such people can make a decision immediately and rarely refuse it. If you have the character \'1111\', you need to learn to stop yourself if necessary. However, even more important — to learn to refuse a previously made decision if necessary. This character is a true gift of fate for any person, as it allows setting and achieving very high goals in any branch of human knowledge. Most importantly, this character helps reveal the talent of the person himself. For men, such character is better suited for parenthood or the military. Never forget, that this is the character of the leader who wishes to be better than others. Do not try to humiliate those with \'1111\'; it will lead to a great repulse.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Maximally Expressed Power & Leadership (Despot)',
        verbatim: 'Maximally expressed character of power and leadership. A person moves toward his goal, not paying attention to people standing nearby, even if the psychomatrix of this person has digits 8. Even tolerance (digits 8) cannot guaranteedly restrain the power-hungriness. Such people are rightly called despots. Unlimited power — or no power at all. Rarely can any of them stop, there is no limit to their power aspirations. It is this pursuit of power that creates a hostile environment around them. One can say for sure — the outcome of any despot is known, he himself begets his successor, who will also \'step on\' him himself. The only way to preserve oneself — is departure from power, as it has no boundaries. One despot will beget another, and there will be no end to this. Tolerance and the search for your own talent can be alternative realizations of this character. Such a person can become an unsurpassed artist, poet, dancer, or actor — all these are ways of realizing character \'11111\' when there is leadership, but no victims of despotism.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Overload — Hidden Authority',
        verbatim: 'When the quantity of 1\'s has exceeded five figures, it is possible to speak about \'overload\' of the despot — that means sudden changes of one\'s character. The person starts to be afraid of his own latent character of aspiration to authority. By his own inquiries about authority, he clearly understands that he can never have it (tsar, the president). If it is not the highest authority, the goal has no value. Comprehension of the impossibility to receive full authority leads to his full refusal of it. Such people can open their latent plans only during moments of strong intoxication. They are very tolerant, quiet; explosions of emotions occur only after long accumulation of insults. When such a moment comes, one word is enough for the emission of the huge collected energy. It is necessary for close people to know about this and to try to liberate the stored insults at smaller quantities. The choice of work is defined not by interest, but by that degree of freedom which it gives: to not depend on the chief and to not depend on anybody at all.',
        scale: 'overload'
      }
    ]
  },
  2: {
    digit: 2,
    cellName: 'Energy',
    intro: 'The Pythagorean number 2 represents human energy. It is necessary to understand that energy in this case is a person\'s behavior in the family, at work and in society.',
    lineContext: 'Row 2 (2, 5, 8) — Family orientation. Column 1 (1, 2, 3) — Self-esteem.',
    meanings: [
      {
        count: 0,
        label: 'Very Weak Energy, Vampire',
        verbatim: 'Absence of \'2\' in the Pythagorean Square is a reflection of very weak energy. Such people can be named vampires, but don\'t be afraid of this word. Any person (even the donor) begins \'vampiring\' energy from another when there is strong deficiency of it (stress, quarrel, illness, a fright, mountain). The people who possess weak energy or don\'t have any are lazy, excessive in physical mobility, fussy and are afraid of any conflicts. They always try to avoid any quarrels, but do like to witness ones. It is difficult enough for them to take opportunities and find their own abilities because of their laziness. They usually underestimate the purposes. Love dogs very much and don\'t like cats, because dogs are donors, and cats are vampires.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Energy Deficiency',
        verbatim: 'A presence of one \'2\' in the Pythagorean Square shows person\'s energy deficiency. By the way, presence of Numbers 4 will strengthen it a little, but the qualities usual for weakened energy won\'t change. Such people possess all qualities of those who have none: laziness, mobility, fussiness. The only difference is that all these qualities are temporary, wavy: the person suddenly becomes the fidget, is lazy selectively, choosing \'zones of laziness\' where he is able to relax and have a rest. These people also avoid conflicts as do not like to spend energy. They do something good usually for the main purpose of returning spent energy through a praise, even more, with some desert. Praise, compliments, leadership, difference from others — all these are usual qualities of such people. Alcohol or drugs can be a problem for them. In conversation with other people they prefer to speak about themselves or about themes interesting to them, trying softly to change \'another\'s\' themes. Manual labour is not for them, as it requires energy.',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Norm, Good Energy',
        verbatim: 'If in your psychomatrix there are two twos, one can say you are lucky. This is the norm necessary for every person. Energy favorable for contact with people and for work. You have your own opinion on everything, no idols, you are independent in views. You are communicative, easily enter into contact with other people. People with energy \'22\' are good storytellers, lecturers, orators, doctors, teachers, preachers, clergy. You can set fairly significant goals before yourself, you can achieve them, as your energy allows doing this. People with good energy are not inclined to laziness. If a person with \'22\' is lazy, the reasons are not in power — it is a low self-estimation, weak purposefulness, or other reasons.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Extrasensory, Psychic Sign',
        verbatim: 'If in your psychomatrix there is \'222\', this means you possess the sign of an extrasensory from birth, or simply put — you are an extrasensory. An extrasensory is one who possesses energy \'222\', which gives a person unusual abilities, manifesting depending on extraordinary circumstances. Yes, it is unexpected circumstances that lead a person with such a sign to extrasensory. In other cases, he differs little from one who has one two in the psychomatrix, that is, one can put an equal sign between \'2\' and \'222\' if there is no special situation. All characteristics of \'2-none\' and \'one 2\' are inherent to the extrasensory: laziness, mobility, fussiness. Additionally, new qualities appeared: closeness, unwillingness to share their problems, explosion of emotions under pressure from outside, ability to help another person if necessary. For these reasons many psychics try to become the center of attention as they intensively absorb energy from others and, only \'having completely charged\', can give it to others if they consider it necessary.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Donor, Energy Overload',
        verbatim: 'If in your psychomatrix there are four or more twos, this means you are a donor, a person who has an excess of energy and can afford to spend it at his discretion. You will be surprised, but a donor has a problem with how to properly spend the available energy. Such people can spend energy on watching any TV programs, while doing nothing for their development. This can be called laziness, but already from excess of energy, from inertia. Sometimes excessive calmness may appear, bordering on indifference to everything. Donors, as a rule, are very slow, sluggish. They are inclined to sit, lie, but not run and fuss. The best for you is to try yourself in sports, medicine, teaching or manual labour — all these cause big losses of energy and are good for donors. If they will not spend the energy there can be a need for the conflict which will \'unload\' the donor. Superfluous energy is consumed well by cats.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Extreme Donor Overload',
        verbatim: 'Five or more 2\'s represents a profound overload of the donor quality. Energy floods outward in ways the person cannot fully contain. Indifference to personal matters increases; the person gives freely but struggles to protect their own reserves. The risk of energy depletion through others\' crises is high.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Energy Overload Inversion',
        verbatim: 'Six or more 2\'s triggers the overload inversion: the quality begins to transform into its opposite. The person who should be a radiant donor becomes withdrawn, lethargic, and emotionally flat. The energy, having nowhere constructive to go, turns inward and stagnates. Deep fatigue, existential indifference, and a sense of pointlessness characterize this state.',
        scale: 'overload'
      }
    ]
  },
  3: {
    digit: 3,
    cellName: 'Interests / Sciences',
    intro: 'The number 3 in the square of Pythagoras is responsible for interest in the sciences and, above all, in the exact sciences or technology.',
    lineContext: 'Row 3 (3, 6, 9) — Stability. Column 1 (1, 2, 3) — Self-esteem. Ascending diagonal (3, 5, 7) — Carnal/temperament.',
    meanings: [
      {
        count: 0,
        label: 'Humanities & Art',
        verbatim: 'Absence of Number 3 in Pythagoras Square means propensity of the person to humanities and art. If your child has no 3s in Pythagoras Square you should allow it to complete its task for mankind: it\'s born to create new aspects of philosophy, art and culture. It perceives technics externally — by the principle of its grace and beauty.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Weak Developed Interest',
        verbatim: 'You have one 3 in your Pythagoras Square. All depends on you only. If you choose the purpose to develop your talent, then you are definitely lucky as you can be engaged in any science, but the expert in exact sciences is not you yet. It is possible to find an optimum variant and choose science that is between these branches of knowledge: natural sciences, economy, legal practice, etc.',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Interest Given in Norm',
        verbatim: 'Your Pythagoras Square has 33, it means, that you have interest in exact science and engineering, but it doesn\'t mean you can easily be engaged in these sciences. It is necessary to define how you can open similar interest.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Special Sign — Saturated Interest',
        verbatim: 'The most optimal can be considered those branches of knowledge that use exact sciences (mathematics, physics, technique). The main feature of interest \'333\' — is saturation with a concrete interest. As soon as a person understands that he has figured out a concrete branch of knowledge, he loses interest in this topic.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Born Inventor / Constructor',
        verbatim: 'A fairly rare sign in our time, but sometimes encountered. It means strong interest in science and technique, inventing and constructing. A person is born an inventor and constructor. If in his psychomatrix there are active \'55 and more\', he must engage in technical sciences.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Obsessive Technical Focus',
        verbatim: 'Five 3\'s represents an almost total absorption of conscious life by one area of technical or scientific fascination. The person thinks in systems, mechanisms, and patterns. This can produce genius-level output in a narrow domain while leaving relationships and bodily needs neglected.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Interest Overload — Fragmentation',
        verbatim: 'Six or more 3\'s triggers the overload inversion for interests: rather than deep focus, the person becomes fragmented and scattered across too many simultaneous fascinations. Nothing holds for long because everything is equally stimulating and equally abandoned. The mind is hyperactive but cannot settle into mastery.',
        scale: 'overload'
      }
    ]
  },
  4: {
    digit: 4,
    cellName: 'Health / Body',
    intro: 'Digit 4 in the psychomatrix answers for the health of a person. It answers for the human body, but this characteristic is more interesting than the state of health.',
    lineContext: 'Row 1 (1, 4, 7) — Purposefulness. Column 2 (4, 5, 6) — Labor efficiency & material capacity.',
    meanings: [
      {
        count: 0,
        label: 'No Health Given from Birth',
        verbatim: 'If in your psychomatrix there are no digits 4, this means you were not given health from birth and it is necessary to strengthen and take care of it. A strong body is quite difficult to grow, as it requires spending a lot of energy on this. Professional sports are not recommended.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Very Weak Health',
        verbatim: 'Your Pythagoras Square has only one \'4\'. It speaks that you have health from birth, but it is insufficiently strong to say that prophylactics is not required. All recommendations for strengthening energy given for \'4-none\' will be useful here too.',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Health Given in Norm',
        verbatim: 'Health given in norm. A beautiful, strong body is given from birth. It is possible to try sports safely, even professionally, provided other numbers are also favorable. The body, when cared for, becomes an asset and source of personal confidence.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Strong Health',
        verbatim: 'Your Pythagoras Square has \'444\' or more — it means strong health is given from birth and also a beautiful, strong body. At such strong numbers it is hard for the person to catch illness; if this happens it is necessary to find the reason of illness.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Exceptional Physical Strength',
        verbatim: 'Very good health and virtually unlimited physical possibilities. Both men and women are naturally very strong physically. Men especially so. This combination personifies a healthy person with an active lifestyle and high sexual potential.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Physical Dominance',
        verbatim: 'Five 4\'s indicates maximal physical strength and vitality that dominates other qualities. The body becomes the primary mode of engagement with the world. Mental and spiritual development may be neglected because the physical realm offers such immediate satisfaction.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Physical Overload — Health Inversion',
        verbatim: 'Six or more 4\'s triggers the health overload inversion. The person who should be a paragon of vitality begins to experience mysterious chronic conditions or constitutional fragility despite an outwardly strong frame. The body\'s excess vitality turns against itself.',
        scale: 'overload'
      }
    ]
  },
  5: {
    digit: 5,
    cellName: 'Logic / Intuition',
    intro: 'Digit 5 in the psychomatrix answers for human logic and intuition, which, in turn, determines a person\'s ability to make plans and analyze situations.',
    lineContext: 'Row 2 (2, 5, 8) — Family orientation. Column 2 (4, 5, 6) — Labor efficiency. Carnal diagonal (3, 5, 7) — Temperament. Spiritual diagonal (1, 5, 9) — Spiritual life.',
    meanings: [
      {
        count: 0,
        label: 'No Logic — Dreamer',
        verbatim: 'Absence of Number 5 in Pythagoras Square means that the person doesn\'t use logic; he can be named a dreamer who constantly goes woolgathering. Such people build castles in the air and live in them. It is not necessary to make such a dreamer change his mind; leave him with his dreams.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Very Weak Logic',
        verbatim: 'If in Pythagoras Square there is one \'5\' it means, that there is logic, but it is very weak and differs a little from quality \'5-not present\'. The person is the same dreamer. In time the person can grow an additional \'5\' (transition: 99 gives additional 5).',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Strong Logic',
        verbatim: 'People having two or more fives in the psychomatrix become a little boring, as they lay out all their reasoning into many steps. Such people can plan the future. They foresee almost every mistake, but not always can they secure themselves from them.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Very Strong Logic, Special Sign',
        verbatim: 'Strong logic. Having \'555\' noticeably weakens logic, doing its occurrence more like an unexpectedness than as a rule. In this case these figures are almost entirely owned by the line of maintenance of family (for men) or a line of family (for women).',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Prophetic Logic',
        verbatim: 'Four or more 5\'s: this person can be called a prophet. Such people are almost never mistaken about their predictions. They can predict destinies. The horizon of logical vision is so large that the person naturally perceives patterns across time.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Logic Dominates All',
        verbatim: 'Five 5\'s represents logic that has overwhelmed all other modes of being. Everything is analyzed; emotion, intuition, and spontaneity are absorbed into the analytical framework. The person is a supreme strategist but may find joy and presence nearly inaccessible.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Logic Overload — Paralysis',
        verbatim: 'Six or more 5\'s triggers logic overload: the analytical capacity turns against itself. The person becomes paralyzed by over-analysis, unable to reach a decision because every decision generates an infinite regress of consequences to calculate.',
        scale: 'overload'
      }
    ]
  },
  6: {
    digit: 6,
    cellName: 'Labor / Manual Skills',
    intro: 'Number 6 is one of the most controversial numbers. It should have kept the main meaning of number 9 (mind, knowledge), but turned its goals.',
    lineContext: 'Row 3 (3, 6, 9) — Stability. Column 2 (4, 5, 6) — Labor efficiency.',
    meanings: [
      {
        count: 0,
        label: 'Not Inclined to Manual Labor',
        verbatim: 'If in the Pythagorean Square there is no Number 6, this means that the person is not inclined to manual labor, he doesn\'t like it and can be involved in it only by reason of necessity or having it as a duty. These are people of art and science.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Mood-Based Labor',
        verbatim: 'Having one Number 6 means that the person does manual labor based on his mood — when there is a desire. Performance is not the main thing as a result. If you try to force one who has only one \'6\' when he doesn\'t feel like working, you\'ll get a lot of problems as a result.',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Master of Any Craft',
        verbatim: 'The sign \'66\' gives its owner ability to do everything — he is a master of any craft. Very often such people are great architects. The sign \'66\' can be named as sign of grounding. The matter is that people having this sign don\'t really like reading.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Number of the Beast - Black Knowledge',
        verbatim: 'The number of the beast. Satan (number 666) is the image of man and belongs to men. The greater number of \'6\' can be named \'number of the sorcerer or a witch\' as this sign is stronger. You should not be prejudiced, for that sign doesn\'t mean anything as the presence of such numbers as 8 and 7 constrain \'6\'.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Sorcerer Sign - Dark Accumulation',
        verbatim: 'Four 6\'s is the sorcerer sign in its full expression. The person has an uncanny ability to read and manipulate others\' psychology. Charisma is used as a tool of control. The person attracts followers who mirror their own shadow.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Black Mastery',
        verbatim: 'Five 6\'s represents the peak of the dark labor quality in its dominant form. The accumulation of knowledge for purposes of influence and control becomes a consuming life-focus. Such a person can rise to significant positions of power.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Labor Overload - Self-Destruction',
        verbatim: 'Six or more 6\'s triggers the complete overload inversion of the labor quality. The person burns through their own substance. The accumulated desire for control implodes into paranoia, self-sabotage, and the systematic destruction of everything they have built.',
        scale: 'overload'
      }
    ]
  },
  7: {
    digit: 7,
    cellName: 'Luck / Talent',
    intro: 'The number 7 in the square of Pythagoras indicates nature\'s interest in revealing its talents.',
    lineContext: 'Row 1 (1, 4, 7) — Purposefulness. Column 3 (7, 8, 9) — Talent potential. Ascending diagonal (3, 5, 7) — Temperament.',
    meanings: [
      {
        count: 0,
        label: 'No Special Talent or Luck',
        verbatim: 'Absence of Number 7 in Pythagoras Square means no special talent or luck from nature. The person must rely entirely on their own effort, energy, and learned skills. Success is earned rather than graced.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Weak Luck / Talent',
        verbatim: 'Very weak luck and talent. The protection of nature is barely perceptible. The person has a small task assigned by nature, and must work diligently to fulfill it. The quality needs development and improvement.',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Luck / Talent in Norm',
        verbatim: 'Luck and talent given in norm. Nature provides a reasonable degree of protection and the person carries a meaningful task. The talent is developed and actively used in life. A good balance for a fulfilled life purpose.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Strong Luck - Nature Protects',
        verbatim: 'Strong luck. Nature protects the person in unexpected situations and accidents. The task assigned by nature is significant. Fortune arrives in flashes, often at pivotal moments, in a way that leaves bystanders astonished.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Sign of Alarm - Angels',
        verbatim: '7777 is a sign of alarm. The angels — the ones with four sevens — descended to earth. Four or more sevens indicates an extremely high task set by nature — so high that it carries special dangers.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Divine Mark',
        verbatim: 'Five 7\'s represents the most extreme positive expression of nature\'s intent — a person whose entire existence is saturated with divine assignment. Their life will be marked by extraordinary events and near-miraculous survivals.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Luck Overload - Cosmic Burden',
        verbatim: 'Six or more 7\'s represents the overload of divine assignment. The protection of nature becomes a kind of crushing weight. Fortune in external affairs co-exists with profound inner difficulty.',
        scale: 'overload'
      }
    ]
  },
  8: {
    digit: 8,
    cellName: 'Duty / Tolerance / Kindness',
    intro: 'The number 8 is responsible for a sense of duty to relatives (parents, family), tolerance and benevolence.',
    lineContext: 'Row 2 (2, 5, 8) — Family orientation. Column 3 (7, 8, 9) — Talent potential.',
    meanings: [
      {
        count: 0,
        label: 'No Sense of Duty',
        verbatim: 'A person who does not have eights should not be relied on if he is entrusted with something. There is no innate sense of duty to relatives. Such a person may be unreliable in family commitments.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Weak Sense of Duty',
        verbatim: 'The presence of one eight in the psychomatrix begins to strongly influence the character of a person, because there is a possibility of transition of 11 to 8 or, vice versa, of 8 to 11.',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Duty / Tolerance in Norm',
        verbatim: 'For those capable of self-sacrifice. Two eights represent duty and tolerance given in normal measure. These people are less likely to break the bonds of marriage. The balance between duty to others and personal boundaries is healthy.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Strong Duty - Truth Finder',
        verbatim: 'Characteristic of duty for \'888\'. In this case we deal with the person who is kind, tolerant, remembers parents, but thus becomes the truth finder. This aim can be dangerous if it grows to maximum.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Parapsychic Abilities',
        verbatim: 'A very rare sign. Children born with this sign had developed abilities and a penchant for studying the exact sciences. Such people often have parapsychic or extrasensory abilities.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Duty Dominates - Martyrdom Risk',
        verbatim: 'Five 8\'s represents the complete dominance of duty over all other qualities. The person becomes defined entirely by their obligations to others, and the self is perpetually sacrificed.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Duty Overload - Moral Rigidity',
        verbatim: 'Six or more 8\'s triggers the overload inversion of duty: the quality becomes its shadow. What was tolerance becomes rigid moralizing; what was kindness becomes controlling care.',
        scale: 'overload'
      }
    ]
  },
  9: {
    digit: 9,
    cellName: 'Memory / Intellect / Clairvoyance',
    intro: 'The number 9 in the square of Pythagoras is responsible for the mind, memory and clairvoyance of a person.',
    lineContext: 'Row 3 (3, 6, 9) — Stability. Column 3 (7, 8, 9) — Talent potential. Spiritual diagonal (1, 5, 9) — Spiritual life.',
    meanings: [
      {
        count: 0,
        label: 'No Memory / Intellect',
        verbatim: 'There are no nines — weak level of mental ability. For a person who doesn\'t have either a 5 or a 9, doing science becomes a problematic situation. The person doesn\'t hear others and has no logic.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Weak Memory',
        verbatim: 'Very weak memory. The channel of communication with the subtle world, with the cosmos, is essentially closed at birth. Such a person is constantly busy with calculations, experiments, trying to predict further events.',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Memory / Intellect in Norm',
        verbatim: 'Having \'99\' in the square of Pythagoras would add another \'5\'. Having accumulated quite a lot of life experience, a person gradually begins to strengthen his logical capabilities at the expense of accumulated situational models.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Strong Memory - Very Smart',
        verbatim: 'Strong memory, mind; very smart. Bored if not interested in what they are doing. Have good eloquence. Often see \'prophetic\' dreams; can predict the course of events; are usually quite good physiognomists.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Erudite but Tough, Merciless',
        verbatim: 'People are erudite, but tough, merciless. Everything that is happening around is clear to them. They clearly see the causes and consequences of events. They possess what can only be called clairvoyance.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Complete Cosmic Memory',
        verbatim: 'Five 9\'s represents a complete cosmic memory — the person seems to carry within them the full record of everything they have experienced across time. The shadow is that this person may be living more in the accumulated past than in the present moment.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Memory Overload - Cognitive Burden',
        verbatim: 'Six or more 9\'s triggers the memory overload. The vast archive becomes a prison. The person cannot escape the weight of what they know and remember. Decision-making paradoxically slows.',
        scale: 'overload'
      }
    ]
  }
};

export const PSYCHOMATRIX_LINE_MEANINGS: PsychomatrixLineData[] = [
  {
    id: 'row_1',
    type: 'row',
    digits: [1, 4, 7],
    name: 'First Row — Purposefulness',
    quality: 'Goal Achievement & Direction',
    description: 'Determines the presence of purposefulness as a quality of a person\'s character. A strong first row means the person is highly goal-oriented. A weak first row means difficulty setting and maintaining goals over time.'
  },
  {
    id: 'row_2',
    type: 'row',
    digits: [2, 5, 8],
    name: 'Second Row — Family Orientation',
    quality: 'Desire to Build Relationships & Family',
    description: 'Shows how strong a person\'s desire to create a family is. The stronger the second row, the stronger the attachment to family and the family responsibilities.'
  },
  {
    id: 'row_3',
    type: 'row',
    digits: [3, 6, 9],
    name: 'Third Row — Stability',
    quality: 'Resistance to Change & Habitual Consistency',
    description: 'The indicators of the stability of a person\'s character. A strong third row person has very stable habits and rituals.'
  },
  {
    id: 'col_1',
    type: 'column',
    digits: [1, 2, 3],
    name: 'First Column — Self-Esteem',
    quality: 'Self-Appraisal & Personal Confidence',
    description: 'A numerical indicator of the level of self-esteem. The first column is the self-appraisal of the person. The stronger the column, the more confident the person is.'
  },
  {
    id: 'col_2',
    type: 'column',
    digits: [4, 5, 6],
    name: 'Second Column — Labor Efficiency',
    quality: 'Physical & Practical Capacity for Material Success',
    description: 'Describes a person\'s physical health, level of endurance, degree of inclination to work and possession of practical skills. A strong second column means the person is physically capable and practically skilled.'
  },
  {
    id: 'col_3',
    type: 'column',
    digits: [7, 8, 9],
    name: 'Third Column — Talent & Potential',
    quality: 'Natural Gifts & Life Purpose',
    description: 'Contains information about a person\'s talent. A strong third column means rich natural talent waiting to be developed.'
  },
  {
    id: 'diag_spirit',
    type: 'diagonal',
    digits: [1, 5, 9],
    name: 'Spiritual Diagonal — 1·5·9',
    quality: 'Degree of Inner Unity with Nature / God',
    description: 'Indicates the level of a person\'s spirituality. A strong spiritual diagonal means deep inner coherence.'
  },
  {
    id: 'diag_carnal',
    type: 'diagonal',
    digits: [3, 5, 7],
    name: 'Carnal Diagonal — 3·5·7',
    quality: 'Temperament & Sexual Compatibility',
    description: 'An indicator of a person\'s temperament in terms of intimate, sexual relationships. Determines intimate vitality and libido.'
  }
];

export const PSYCHOMATRIX_TRANSITIONS: ComplementaryInsight[] = [
  {
    digits: [1, 8],
    title: 'Character ↔ Duty Transition',
    insight: 'Character (1) and Duty (8) are in constant dialogue. 111 alongside a single 8 can transition to a soft, tolerant mode (1 and 88). But under external pressure, it can instantly reverse into 11111 — the despot.',
    type: 'transition'
  },
  {
    digits: [2, 4],
    title: 'Energy Amplified by Body',
    insight: 'Physically healthy people (strong 4) draw attention. A weak or absent 2 can be partially compensated by strong 4 — the body becomes the antenna of social energy.',
    type: 'amplify'
  },
  {
    digits: [5, 9],
    title: 'Logic ↔ Memory Mutual Amplification',
    insight: 'Strong logic (55+) generates additional memory depth; strong memory (99+) generates additional logical capacity.',
    type: 'transition'
  }
];

export function calculateWorkingNumbers(day: number, month: number, year: number) {
  const allDigits = `${day}${month}${year}`.split('').map(Number);
  const first = allDigits.reduce((a, b) => a + b, 0);
  const second = String(first).split('').map(Number).reduce((a, b) => a + b, 0);
  const firstDigitOfDayActual = Number(String(day)[0]);
  const third = first - 2 * firstDigitOfDayActual;
  const fourth = third < 10 ? third : String(third).split('').map(Number).reduce((a, b) => a + b, 0);
  return { first, second, third, fourth };
}

export function calculatePsychomatrix(day: number, month: number, year: number): PsychomatrixResult {
  const { first, second, third, fourth } = calculateWorkingNumbers(day, month, year);
  const birthDigits = `${day}${month}${year}`.split('').map(Number);
  const workingDigits = [...String(first).split('').map(Number), ...String(second).split('').map(Number), ...String(third).split('').map(Number), ...String(fourth).split('').map(Number)];
  const allDigits = [...birthDigits, ...workingDigits].filter(d => d !== 0);
  const counts: Record<number, number> = {};
  for (const d of allDigits) { if (d >= 1 && d <= 9) counts[d] = (counts[d] || 0) + 1; }
  const cell = (n: number) => counts[n] ? String(n).repeat(counts[n]) : null;
  const grid: Array<Array<string | null>> = [[cell(1), cell(4), cell(7)], [cell(2), cell(5), cell(8)], [cell(3), cell(6), cell(9)]];
  const lineDigitCounts = {
    row_1: (counts[1] || 0) + (counts[4] || 0) + (counts[7] || 0),
    row_2: (counts[2] || 0) + (counts[5] || 0) + (counts[8] || 0),
    row_3: (counts[3] || 0) + (counts[6] || 0) + (counts[9] || 0),
    col_1: (counts[1] || 0) + (counts[2] || 0) + (counts[3] || 0),
    col_2: (counts[4] || 0) + (counts[5] || 0) + (counts[6] || 0),
    col_3: (counts[7] || 0) + (counts[8] || 0) + (counts[9] || 0),
    diag_spirit: (counts[1] || 0) + (counts[5] || 0) + (counts[9] || 0),
    diag_carnal: (counts[3] || 0) + (counts[5] || 0) + (counts[7] || 0),
  };
  const activeLines = Object.entries(lineDigitCounts).filter(([_, total]) => total >= 3).map(([id]) => id);
  const cellReadings: CellReading[] = [];
  for (let digit = 1; digit <= 9; digit++) {
    const count = counts[digit] || 0;
    const cellDef = PSYCHOMATRIX_CELL_MEANINGS[digit];
    const meaning = getPsychomatrixCellMeaning(digit, count);
    const modifiers: string[] = [];
    cellReadings.push({ digit, count, cellName: cellDef.cellName, label: meaning.label, verbatim: meaning.verbatim, scale: meaning.scale, modifiers });
  }
  const complementaryInsights = getComplementaryPairs(counts);
  return { day, month, year, first, second, third, fourth, allDigits, counts, grid, activeLines, complementaryInsights, cellReadings };
}

export function getPsychomatrixCellMeaning(digit: number, count: number): PsychomatrixCellMeaning {
  const cellDef = PSYCHOMATRIX_CELL_MEANINGS[digit];
  if (!cellDef) return { count: 0, label: 'Unknown', verbatim: '', scale: 'absent' };
  const cappedCount = Math.min(count, 6);
  return cellDef.meanings.find(m => m.count === cappedCount) || cellDef.meanings[cellDef.meanings.length - 1];
}

export function getComplementaryPairs(counts: Record<number, number>): ComplementaryInsight[] {
  return PSYCHOMATRIX_TRANSITIONS.filter(insight => {
    const needed = [...insight.digits];
    const available = { ...counts };
    for (const d of needed) {
      if (!available[d] || available[d] <= 0) return false;
      available[d]--;
    }
    return true;
  });
}

export const SCALE_LABELS: Record<PsychomatrixCellMeaning['scale'], string> = {
  'absent': 'Absent', 'very-weak': 'Awakening', 'norm': 'Balanced', 'special': 'Special Sign', 'strong': 'Strong', 'dominant': 'Dominant', 'overload': 'Overload'
};

export const SCALE_COLORS: Record<PsychomatrixCellMeaning['scale'], string> = {
  'absent': '#6b7280', 'very-weak': '#9ca3af', 'norm': '#c49a28', 'special': '#a78bfa', 'strong': '#34d399', 'dominant': '#f59e0b', 'overload': '#ef4444'
};

export const CELL_POSITIONS: Record<number, { row: number; col: number }> = {
  1: { row: 0, col: 0 }, 4: { row: 0, col: 1 }, 7: { row: 0, col: 2 },
  2: { row: 1, col: 0 }, 5: { row: 1, col: 1 }, 8: { row: 1, col: 2 },
  3: { row: 2, col: 0 }, 6: { row: 2, col: 1 }, 9: { row: 2, col: 2 },
};
