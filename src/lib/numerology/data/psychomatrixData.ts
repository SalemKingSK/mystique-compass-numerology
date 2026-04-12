// src/lib/numerology/data/psychomatrixData.ts
//
// ALEXANDROV'S PSYCHOMATRIX — Complete Verbatim Reference Data
// Based on the original teachings of Professor A. Alexandrov
// Founder of Digital Analysis & Numerological Psychomatrix
//
// This module drives the Pythagorean Square feature. It contains:
//   1. PSYCHOMATRIX_CELL_MEANINGS   — per-digit, per-count full interpretations
//   2. PSYCHOMATRIX_LINE_MEANINGS   — rows, columns, diagonals
//   3. PSYCHOMATRIX_COMPATIBILITY   — inter-number compatibility commentary
//   4. PSYCHOMATRIX_TRANSITIONS     — digit transition rules
//   5. calculatePsychomatrix()      — full computation from date of birth
//   6. getPsychomatrixCellMeaning() — targeted lookup helper
//   7. getComplementaryPairs()      — returns active cross-cell synergies

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
  // Input
  day: number;
  month: number;
  year: number;
  // Working numbers
  first: number;        // Sum of all birth digits
  second: number;       // Sum of digits of first
  third: number;        // First – (2 × first digit of day)
  fourth: number;       // Sum of digits of third
  // All digits placed
  allDigits: number[];
  // Counts per digit (1–9 only, 0 excluded)
  counts: Record<number, number>;
  // 3×3 grid — Pythagorean layout:
  //  [0] = [1, 4, 7]  (row 1: Character, Health, Luck)
  //  [1] = [2, 5, 8]  (row 2: Energy, Logic, Duty)
  //  [2] = [3, 6, 9]  (row 3: Interests, Labor, Memory)
  grid: Array<Array<string | null>>;
  // Active line states
  activeLines: string[];
  // Cross-digit synergies
  complementaryInsights: ComplementaryInsight[];
  // Current cell meanings
  cellReadings: CellReading[];
}

export interface CellReading {
  digit: number;
  count: number;
  cellName: string;
  label: string;
  verbatim: string;
  scale: PsychomatrixCellMeaning['scale'];
  // Modifiers from other cells
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
        verbatim: 'Golden mean. Such people can find common language with any person. They can, if necessary, yield in an argument to anyone (even \'1\'). The main thing to know — one cannot pressure such a person, as defending himself, he will defeat anyone, even a despot. A person with the character \'golden mean\' makes a natural transition (about digit transitions we will speak separately) to a new character: \'1 and 8\' (we consider that digit 8 is absent). It corresponds to a soft and tolerant character. This external, deceptive softness pushes lovers of commanding others to test their power on those who have the character \'111\', which turns into an unexpected explosion of emotions, and this leads to conflict and suppression of the despot. If parents from childhood years have been suppressing a child with this type of character, then it can be said for sure that this child will grow up with little sense of duty towards his parents. Remember: everything in life goes in a circle. If one forgets about his duty towards his parents, then he himself should give birth to a child who will lose his sense of duty towards him.',
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
    intro: 'The Pythagorean number 2 represents human energy. It is necessary to understand that energy in this case is a person\'s behavior in the family, at work and in society. The energy of Number 2 is not exactly identical to the known energy of your body, which in acupuncture is called the Chi of the meridians. We call a person \'energetic\' if he can visualize a goal, find ways to achieve it and move forward to achieve it according to his own plan. The energy of Number 2 also characterizes compatibility through energy contact. Questions of vampirism and donorship are always about Number 2 energy. In any conversation, one person takes the position of the donor and the other the vampire. The donor is the one who starts speaking about the interests of the other. The one who is in the center of the conversation (or brings up his own interests) becomes the vampire.',
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
        verbatim: 'Five or more 2\'s represents a profound overload of the donor quality. Energy floods outward in ways the person cannot fully contain. Indifference to personal matters increases; the person gives freely but struggles to protect their own reserves. The risk of energy depletion through others\' crises is high. Physical and creative outlets — sport, medicine, hands-on work — are essential safety valves. Without them, the accumulated energy can turn into a desire for conflict as a release mechanism. Cats, paradoxically, help drain surplus energy through their natural vampirism.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Energy Overload Inversion',
        verbatim: 'Six or more 2\'s triggers the overload inversion: the quality begins to transform into its opposite. The person who should be a radiant donor becomes withdrawn, lethargic, and emotionally flat. The energy, having nowhere constructive to go, turns inward and stagnates. Deep fatigue, existential indifference, and a sense of pointlessness characterize this state. Urgent need for intense physical activity, service roles, or creative channels to convert this reservoir into output. Without transformation, it can manifest as depression or inexplicable burnout.',
        scale: 'overload'
      }
    ]
  },

  3: {
    digit: 3,
    cellName: 'Interests / Sciences',
    intro: 'The number 3 in the square of Pythagoras is responsible for interest in the sciences and, above all, in the exact sciences or technology. Never forget that 3 is contained in several rows when you are going to evaluate this number in the Pythagorean square, namely the column (1, 2, 3), the ascending diagonal (3, 5, 7) and the 3rd row (3, 6, 9). The reason is that number 3 is responsible for persons interests in general. To decide what this interest consists of, it is necessary to determine what line owns the 3s at the moment. Column (1,2,3) — Self-appraisal is strongly affected; if 3 is owned by this column, the person\'s self-appraisal becomes overpriced; they think those around them are more foolish. Ascending diagonal (3,5,7) — Carnal, financial, and intimate interests; the person is actively interested in intimate life and money. Row (3,6,9) — Stability; the person acquires habits and rituals that become very important; they demand performance of these habits from others.',
    lineContext: 'Row 3 (3, 6, 9) — Stability. Column 1 (1, 2, 3) — Self-esteem. Ascending diagonal (3, 5, 7) — Carnal/temperament.',
    meanings: [
      {
        count: 0,
        label: 'Propensity to Humanities & Art',
        verbatim: 'Absence of Number 3 in Pythagoras Square means propensity of the person to humanities and art. When we speak about interests of the child, especially the boy, there is a problem. Most daddies think humanities and even more so arts, doesn\'t correspond to man\'s interests in any way and as consequence — such interests are in every possible way extinguished in the childhood by \'assiduous\' fathers who try to impart to the son man\'s interest to technics. It is not absolutely clever, because Nature forms the child and defines its applicability in its life. If your child has no 3s in Pythagoras Square you should allow it to complete its task for mankind: it\'s born to create new aspects of philosophy, art and culture. It perceives technics externally — by the principle of its grace and beauty.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Very Weakly Developed Interest',
        verbatim: 'You have one 3 in your Pythagoras Square. All depends on you only. If you choose the purpose to develop your talent, then you are definitely lucky as you can be engaged in any science, but the expert in exact sciences is not you yet. It is possible to find an optimum variant and choose science that is between these branches of knowledge: natural sciences, economy, legal practice, etc. You should choose a direction where you can\'t harm yourself by multiplicity of your interests. Multiplicity is the negative side of \'3\' as it does not fix interest, but sprays it, leading to what even people who are strong in sciences can\'t define the interest. If it won\'t be clearly defined, you can surely say that the person does not have interest in any field of knowledge, especially if he has weak energy (2-not present, 2, 222).',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Interest Given in Norm',
        verbatim: 'Your Pythagoras Square has 33, it means, that you have interest in exact science and engineering, but it doesn\'t mean you can easily be engaged in these sciences. It is necessary to define how you can open similar interest. If, having 33, your Pythagoras Square contains 55 (or more), 22, 6 — these figures show that you possess strong logic, good energy and you are a man of moods who can sometimes do manual labor for pleasure. The same numbers tell us that you could become the good engineer or the designer as you can understand any technological process.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Special Sign — Saturated Interest',
        verbatim: 'The most optimal can be considered those branches of knowledge that use exact sciences (mathematics, physics, technique), consequently, the area of application of one\'s knowledge should be sought at the junction of sciences: mathematical linguistics, computer technique, bionics, etc. The main feature of interest \'333\' — is saturation with a concrete interest. As soon as a person understands that he has figured out a concrete branch of knowledge, he loses interest in this topic. And one more thing. Having \'333\', he will never abandon the topic of his research until he gets to its essence. A person with interest \'333\' must periodically change it, but he must always remain in science, changing directions and topics. Very interesting results can be received from synthesis of various own interests into one theory. The only thing that can prevent one\'s personality realization is disbelief, laziness, worship for \'authorities\' which always denies everything new, for it threatens their prestige.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Born Inventor / Constructor',
        verbatim: 'A fairly rare sign in our time, but sometimes encountered. It means strong interest in science and technique, inventing and constructing. A person is born an inventor and constructor. If in his psychomatrix there are active \'55 and more\', he must engage in technical sciences, work in research institutes, design bureaus, laboratories. If 5 and 9 are expressed poorly, there is a simple but reliable way — write the fantastic novel where your ideas will have a life. Who can condemn the writer for all his ideas being unreal? Fiction is a direction of literature where a person is free to express his ideas.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Obsessive Technical Focus',
        verbatim: 'Five 3\'s represents an almost total absorption of conscious life by one area of technical or scientific fascination. The person thinks in systems, mechanisms, and patterns. Social interaction, emotional processing, and everyday practicalities feel like intrusions on the real work of the mind. This can produce genius-level output in a narrow domain while leaving relationships and bodily needs neglected. The key challenge is learning to value rest, connection, and the non-logical dimensions of human life without feeling them as a waste of the mind\'s resources.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Interest Overload — Fragmentation',
        verbatim: 'Six or more 3\'s triggers the overload inversion for interests: rather than deep focus, the person becomes fragmented and scattered across too many simultaneous fascinations. Nothing holds for long because everything is equally stimulating and equally abandoned. The mind is hyperactive but cannot settle into mastery. The person may feel uniquely intelligent while producing little of lasting value. Discipline, constraint, and choosing a single primary direction for multi-year investment is the essential corrective. Without it, this energy disperses into restless curiosity that never matures.',
        scale: 'overload'
      }
    ]
  },

  4: {
    digit: 4,
    cellName: 'Health / Body',
    intro: 'Digit 4 in the psychomatrix answers for the health of a person. The assessment of fours in the psychomatrix does not allow evaluating the strength of a specific organ or highlighting those diseases to which a person is prone due to the peculiarities of his energy. Digit 4 answers for the human body, but this characteristic is more interesting than the state of health. By the presence of digit 4 in the psychomatrix, one can (without seeing the person and knowing nothing about him) assume how he looks, how attractive he is, how physically strong. Number 4 is included into following lines: 1st row (1, 4, 7) — purposefulness of the person, and 2nd column (4, 5, 6) — material maintenance of the family.',
    lineContext: 'Row 1 (1, 4, 7) — Purposefulness. Column 2 (4, 5, 6) — Labor efficiency & material capacity.',
    meanings: [
      {
        count: 0,
        label: 'No Health Given from Birth',
        verbatim: 'If in your psychomatrix there are no digits 4, this means you were not given health from birth and it is necessary to strengthen and take care of it. A strong body is quite difficult to grow, as it requires spending a lot of energy on this. Professional sports are not recommended, because exhausting of an organism from trainings is going to exceed the energy the person receives from a mobile way of life; after such overloads the person starts to hurt. People who don\'t have any \'4\'s are not good for performing manual labor as they don\'t have the health for it. If the person works physically he will search for sources of energy — alcohol, drugs, quarrels and family conflicts. It is necessary to strengthen the health through ancient improving systems: chi kung, yoga and others. Strengthening the health will make you able to target higher goals. It is possible to strengthen through transition: \'11\' transforms into \'8\' with additional \'4\', or \'6\' transforms into \'7\' with additional \'4\'. For this purpose it is necessary to become more tolerant or to make art a part of your life.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Very Weak Health',
        verbatim: 'Your Pythagoras Square has only one \'4\'. It speaks that you have health from birth, but it is insufficiently strong to say that prophylactics is not required. If you have \'2222 and more\' then you can try yourself in sports or manual labor. As when there is no \'4\', having only one the person starts to avoid conflicts as they lose health and energy through them. All recommendations for strengthening energy given for \'4-none\' will be useful here too. If you have poor health do not hurry with trying yourself in places where you will have authority above people. If you have good energy \'22\' or \'2222 and more\' and strong character with tolerance — 111 and 8, 1111 and 8, 11111 and 8 — it is possible to try yourself as \'the person of authority\'. If you do not have strong character (11, 1) you will quickly lose your health on the way to your dream (transition 8 to 11 with loss of 4 or 22). House affairs such as kitchen or garden also lead to loss of health, as transition of Number 7 to 6 causes loss of 4 or 22.',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Health Given in Norm',
        verbatim: 'Health given in norm. A beautiful, strong body is given from birth. It is possible to try sports safely, even professionally, provided other numbers are also favorable — for example, Number 6 supports interest in manual labor and physical expression. This person presents well physically and has natural attractiveness. The body, when cared for, becomes an asset and source of personal confidence. Moderate conflict can be handled without significant energy drain. Preventive care is still advisable to preserve what is given.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Strong Health',
        verbatim: 'Your Pythagoras Square has \'444\' or more — it means strong health is given from birth and also a beautiful, strong body. It is possible to try yourself in sports safely, even professionally. Manual labor is also possible. Together with health you have sufficient purposefulness which allows you to target goals and reach them. At such strong numbers it is hard for the person to catch illness; if this happens (serious diseases) it is necessary to find the reason of illness. The basic problem — and it will inevitably arise before you — is a physical strength which is given to you from birth and which is often applied as the last \'argument\' in a dispute. Try to avoid using it in this case. The confidence in physical strength pushes to fisticuffs, especially those ones who have three fours (444). Possessing a strong body, they often lose health because of its undermining, not knowing any limits in work or sports.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Exceptional Physical Strength & Vitality',
        verbatim: 'Very good health and virtually unlimited physical possibilities. Both men and women are naturally very strong physically. Men especially so — usually they find consolation not in women, but in alcohol, as strong health allows taking alcohol in almost unlimited quantities. This combination personifies a healthy person with an active lifestyle and high sexual potential. The risk here is overconfidence in physical invincibility — the person may push the body well beyond safe limits, or use their physical presence to dominate others. The key is channeling this tremendous vitality into constructive physical disciplines.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Physical Dominance',
        verbatim: 'Five 4\'s indicates maximal physical strength and vitality that dominates other qualities. The body becomes the primary mode of engagement with the world — through sport, physical labor, or sexual expression. Mental and spiritual development may be neglected because the physical realm offers such immediate satisfaction. There is a risk of addiction to physical sensation, adrenaline, or substances that the robust constitution can seemingly absorb without consequence — until it cannot. The lesson of this configuration is learning to honor the non-physical dimensions of existence.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Physical Overload — Health Inversion',
        verbatim: 'Six or more 4\'s triggers the health overload inversion. The person who should be a paragon of vitality begins to experience mysterious chronic conditions or constitutional fragility despite an outwardly strong frame. The body\'s excess vitality turns against itself: over-training, auto-immune patterns, or the psychosomatic manifestation of repressed non-physical needs. Paradoxically, this person may need to be encouraged toward rest, introspection, and gentleness with the body — the opposite of what their appearance suggests. Ancient health traditions, particularly those addressing the subtle body, become relevant.',
        scale: 'overload'
      }
    ]
  },

  5: {
    digit: 5,
    cellName: 'Logic / Intuition',
    intro: 'Digit 5 in the psychomatrix answers for human logic and intuition, which, in turn, determines a person\'s ability to make plans and analyze situations, understand exact sciences and technique. Intuition (the ability to foresee steps or events) is almost impossible to strengthen, as it is either given from birth or a person does not use it. By logic we accept a person\'s ability to compose logical (sequential) links of reasoning that will lead to a correct decision. Important digit transitions: \'55 gives 9 and 99 gives 5.\' Very often we attribute logical actions to those people who have no \'5\'s in their Pythagorean Square, but have many \'9\'s (two and more). The matter is that remembering plenty of possible situations, the person with strong memory in similar situations tries to recollect what he already did earlier, and he explains this decision as the most logical one. Number 5 belongs to four lines: 2nd column (4,5,6) — maintenance of family; 2nd row (2,5,8) — quality of family man; carnal diagonal (3,5,7) — carnal interests; spiritual diagonal (1,5,9) — spiritual life.',
    lineContext: 'Row 2 (2, 5, 8) — Family orientation. Column 2 (4, 5, 6) — Labor efficiency. Carnal diagonal (3, 5, 7) — Temperament. Spiritual diagonal (1, 5, 9) — Spiritual life.',
    meanings: [
      {
        count: 0,
        label: 'No Logic — Dreamer',
        verbatim: 'Absence of Number 5 in Pythagoras Square means that the person doesn\'t use logic; he can be named a dreamer who constantly goes woolgathering. This is why it is not necessary to make far-reaching plans. The person doesn\'t plan, and simply draws up his dreams in the certain sequence, gives out desirable for real. Such people build castles in the air and live in them. It is not necessary to make such a dreamer change his mind; leave him with his dreams. When there is no \'5\' you shouldn\'t be actively engaged in technics and exact sciences; better choose a humanitarian direction or art. It is necessary for people around you to understand that exactly dreamers move forward our civilization, constantly generating utopian dreams in the form of their plans. A good example was V.I. Lenin who had no \'5\'s in Pythagoras Square. You shouldn\'t go into details and explain something to the person who doesn\'t have any \'5\'s. Just tell him what he should do, and he will be happy with it. The emotional part is more important for him than a logical explanation.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Very Weak Logic',
        verbatim: 'If in Pythagoras Square there is one \'5\' it means, that there is logic, but it is very weak and differs a little from quality \'5-not present\'. The person is the same dreamer. The unique difference concerns those people who have many \'3\'s and \'9\'s at the same time (two or more). A large interest in technics and exact sciences pushes people to studying these sciences, and strong memory fills itself with examples of logic that gives good results on its strengthening. In time the person can grow an additional \'5\' (transition: 99 gives additional 5). Before you push your child to exact sciences, look closely at its Pythagoras Square and make sure that it has energy (22, 2222 or more), the part of character for studying sciences (111 or 1111), and availability of strong memory (99 or 9999 or more).',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Strong Logic',
        verbatim: 'People having two or more fives in the psychomatrix become a little boring, as they lay out all their reasoning into many steps, which sometimes begin with a lengthy preamble, which is not pleasant at all, especially for those who don\'t have a 5. When choosing a partner for marriage, it is necessary to look at the difference in the number of digit 5, so that it does not exceed one digit, and it will be better if it is in favor of the man. Such people can plan the future. They foresee almost every mistake, but not always can they secure themselves from them, as very often the decision isn\'t dependent on them. Such people cannot be deceived, as they find out the truth by asking various questions, comparing with answers and finding contradictions. If they are soft and tolerant, even knowing that they are being deceived, they\'ll try not to tell about knowing it, but the repeated lie destroys friendship.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Very Strong Logic, Special Sign',
        verbatim: 'Strong logic, included in four lines: 2nd column (4, 5, 6) — family maintenance, 2nd row (2, 5, 8) — quality of a family man, carnal diagonal (3, 5, 7) — carnal interests, spiritual diagonal (1, 5, 9) — spiritual life. Having \'555\' noticeably weakens logic, doing its occurrence more like an unexpectedness than as a rule. In this case these figures are almost entirely owned by the line of maintenance of family (for men) or a line of family (for women). Sometimes they can make predictions but as the horizon of vision is very large, the person more often doesn\'t trust himself, making his predictions seem unreal. These people understand mathematics and technics well, but as a rule choose a narrow speciality which is carefully mastered. This quality can be named \'laziness of logic.\' If there is \'5555\' (and more) in this case one can be called \'a prophet\'. Such people are almost never mistaken about their predictions. They can predict destinies.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Prophetic Logic',
        verbatim: 'Four or more 5\'s: this person can be called a prophet. Such people are almost never mistaken about their predictions. They can predict destinies. The horizon of logical vision is so large that the person naturally perceives patterns across time — not as mysticism but as pattern-recognition elevated to a near-supernatural acuity. The danger is isolation: people around them cannot follow the reasoning, making the prophet feel perpetually misunderstood. The family line fully absorbs this energy; the person\'s greatest prophecies are often about those closest to them, and their greatest burden is knowing outcomes before they arrive.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Logic Dominates All Other Faculties',
        verbatim: 'Five 5\'s represents logic that has overwhelmed all other modes of being. Everything is analyzed; emotion, intuition, and spontaneity are absorbed into the analytical framework. The person is a supreme strategist but may find joy, love, and presence nearly inaccessible because these require suspending analysis. Relationships suffer as the person intellectualizes every interaction. Physical sensation and emotional experience, when they do break through, arrive with overwhelming intensity because they have been dammed so long. Integration work — learning to inhabit the body and heart without the armor of analysis — is the life work of this configuration.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Logic Overload — Paralysis',
        verbatim: 'Six or more 5\'s triggers logic overload: the analytical capacity turns against itself. The person becomes paralyzed by over-analysis, unable to reach a decision because every decision generates an infinite regress of consequences to calculate. What was once prophetic insight becomes catastrophizing. The gift of foresight becomes a burden of anticipated disaster. Practices that bypass the analytical mind — movement, music, embodied prayer, physical labor — become medicinal. The paradox is that this deeply logical mind must learn to act without complete information; to trust process, not just conclusion.',
        scale: 'overload'
      }
    ]
  },

  6: {
    digit: 6,
    cellName: 'Labor / Manual Skills',
    intro: 'Number 6 is one of the most controversial and difficult numbers in this numerology system. If you look closely at the numbers, you can see that the shapes of numbers 6 and 9 are very similar, and this is not an excuse. Number 9 is responsible for a person\'s memory and his mind, which is always aimed at accumulating knowledge that helps a person survive. In this case, number 6 should have kept the main meaning of number 9 (mind, knowledge), but should have \'turned\' its goals, or rather: a person becomes forgetful of his loved ones, his mind works to accumulate knowledge that can help him advance to gaining authority in order to suppress, humiliate and finally destroy another person. The collected knowledge allows him to influence another person, his psyche, health; there are ways to destroy people (up to murder). Such knowledge is called \'black\', and the people who possess it are called \'magicians\'.',
    lineContext: 'Row 3 (3, 6, 9) — Stability. Column 2 (4, 5, 6) — Labor efficiency.',
    meanings: [
      {
        count: 0,
        label: 'Not Inclined to Manual Labor',
        verbatim: 'If in the Pythagorean Square there is no Number 6, this means that the person is not inclined to manual labor, he doesn\'t like it and can be involved in it only by reason of necessity or having it as a duty. These are people of art and science. Don\'t try to accustom them to manual labor; they will never be good workers. Above all they are inclined to art or science as much as their numbers allow. When there is no Number 6 with 2-none, 4 (or more), 9 and 5-none — better try yourself in dancing (ballet), as such people are very mobile and have a strong body.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Very Weak, Mood-Based Labor',
        verbatim: 'Having one Number 6 means that the person does manual labor based on his mood — when there is a desire. You should never be indifferent to this quality. Performance is not the main thing as a result. One can perform any work, but it is a question of how good results will be and how happy he will be after finishing it. If you try to force one who has only one \'6\' when he doesn\'t feel like working, you\'ll get a lot of problems as a result. You are going to lose a lot of energy forcing him, and if he has agreed, that doesn\'t mean he starts working at once. After such work the person becomes angry, explosive and offended. For this reason it\'s not good when people with this sign are engaged in monotonous work with a strict schedule — this can lead to breakdowns, desire to change activity, alcoholism, illnesses. But if such a person started doing some work, you should never disturb him or give advice. Your offer to help won\'t be good too, because such people don\'t like teamwork.',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Labor Given in Norm — Master of Any Craft',
        verbatim: 'The sign \'66\' gives its owner ability to do everything — he is a master of any craft. Very often such people are great architects. The sign \'66\' can be named as sign of grounding. The matter is that people having this sign don\'t really like reading; they better watch telecasts or do anything but not reading. If somehow you managed to control the sign, then reading takes 1st place, and manual labor has the last. Before you decide what to do with your child who has \'66\' (Numbers 7 are absent — and this is very important), it is necessary to find out its opportunities as the future master. For a craftsman it is necessary to have good energy and good health: 22 (or 2222 and more) and 4 or more. In case the child possesses \'7\' (or more), it can become a master only carefully serving a duty to its parents. I would not advise choosing any profession connected with authority as it makes the person strict and indifferent towards others\' lives.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'The Number of the Beast — Black Knowledge',
        verbatim: 'The number of the beast. Satan (number 666) is the image of man and belongs to men. The greater number of \'6\' can be named \'number of the sorcerer or a witch\' as this sign is stronger. You should not be prejudiced, for that sign doesn\'t mean anything as the presence of such numbers as 8 and 7 constrain \'6\'. For example, a person has a set of numbers: 666, 7, 8. Then we can delete two numbers 6 and, accordingly, numbers 7 and 8, there will be left only one \'6\' — the man of moods (such deletion is able only when both numbers 7 and 8 haven\'t made transition; otherwise we deal with the person who, having started the conflict with the parents, has received a new quality: 666, 7, 8 transforms into 6666 and 11 with the loss of 4 or 22, that leads to irritability and authoritativeness). If there is \'6666\', being attached to similar ones (they are four in this case), they create a stable line, and the person starts to gather similar people around himself, and they show their hidden abilities: authority, cruelty, aggression. To protect yourself: if somebody tries to involve you into a conflict, the only way is to leave with an emotion of emptiness and indifference. The simplest way is laughter, which doesn\'t support any fright and doesn\'t bring any irritability or aggression. This is the Grand Chinese technique of leaving in emptiness which chi kung masters used when they met an opponent.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Sorcerer Sign — Dark Accumulation',
        verbatim: 'Four 6\'s is the sorcerer sign in its full expression. The presence of 7 and 8 can neutralize two of the 6\'s, but the remaining excess still exerts powerful influence over the character. The person has an uncanny ability to read and manipulate others\' psychology. Charisma is used as a tool of control. The person attracts followers who mirror their own shadow. Unless consciously redirected, this configuration builds systems of influence that ultimately isolate and corrupt the person at its center. Spiritual discipline, genuine service, and the cultivation of authentic relationships — not transactional ones — are the antidotes.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Black Mastery — Dominant Influence',
        verbatim: 'Five 6\'s represents the peak of the dark labor quality in its dominant form. The accumulation of knowledge for purposes of influence and control becomes a consuming life-focus. Such a person can rise to significant positions of power and may be genuinely gifted at craft, architecture, or strategic manipulation. The danger is complete moral inversion: the person may genuinely believe their destructive impact is a form of service. Extraordinary circumstances are required to break this pattern — profound loss, illness, or a spiritual awakening that reorients the accumulated intelligence toward genuine good. The intelligence itself is not the problem; the direction of its use is everything.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Labor Overload — Self-Destruction',
        verbatim: 'Six or more 6\'s triggers the complete overload inversion of the labor quality. The person burns through their own substance — physically, emotionally, socially. The accumulated desire for control implodes into paranoia, self-sabotage, and the systematic destruction of everything they have built. Where they sought power over others, they now experience powerlessness. Where they gathered followers, they now face isolation. This is the numerological equivalent of the myth of the sorcerer\'s apprentice. The only escape is total surrender of the control agenda and a radical reorientation toward service of something greater than the self.',
        scale: 'overload'
      }
    ]
  },

  7: {
    digit: 7,
    cellName: 'Luck / Talent',
    intro: 'The number 7 in the square of Pythagoras indicates nature\'s interest in revealing its talents. Let\'s imagine that Newton, the creator of the theory of mechanics, was born two hundred years later or earlier. The result would change the history of the Earth, because all physics, mechanics and other technical disciplines are based on these laws. At any moment in history, there is a need to reveal some natural laws. This need can be so necessary that people whose brains have such important current information are marked by Nature with special signs — the numbers 7 and 0. The number 7 means the following: a person received in his brain very important information for this historical period in the exact field of human knowledge. Nature protects him in all unexpected situations and accidents, which is interpreted as \'happiness\'. The bigger the \'7\', the bigger the task a person has to complete. In many ancient cults, number 7 is considered to be the number of the divine. \'Seven stars\', \'seven steps of Buddha\', \'seven days of creation\', and so on. Numerology defines 7 in the Pythagoras square as a mark of fortune, good luck, or Divine Providence.',
    lineContext: 'Row 1 (1, 4, 7) — Purposefulness. Column 3 (7, 8, 9) — Talent potential. Ascending diagonal (3, 5, 7) — Temperament.',
    meanings: [
      {
        count: 0,
        label: 'No Special Talent or Luck from Nature',
        verbatim: 'Absence of Number 7 in Pythagoras Square means no special talent or luck from nature. The person must rely entirely on their own effort, energy, and learned skills. There is no special protective force from nature guiding unexpected situations. This does not mean the person cannot succeed or contribute meaningfully — it means that every achievement will be the direct result of their own sustained effort, character, and application of their other gifts. Success is earned rather than graced, which often builds a depth of character and resilience that naturally-talented individuals may lack.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Very Weak Luck / Talent',
        verbatim: 'Very weak luck and talent. The protection of nature is barely perceptible. The person has a small task assigned by nature, and must work diligently to fulfill it. The quality needs development and improvement. There are glimpses of fortune in specific situations, and a faint sense of being guided in certain moments — but these are subtle and easily missed. The person must actively attend to their developing talent and not dismiss these moments as coincidence. Consistent dedicated effort to develop the specific gift encoded in the chart can strengthen this quality over time.',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Luck / Talent Given in Norm',
        verbatim: 'Luck and talent given in norm. Nature provides a reasonable degree of protection and the person carries a meaningful task. The talent is developed and actively used in life. A good balance for a fulfilled life purpose. Fortune arrives at meaningful junctures — not as constant windfall, but as a reliable companion that supports decisive action. The person tends to land on their feet in genuinely dangerous situations, as though something beyond their planning is at work. Their specific area of talent, whatever it may be according to the rest of the chart, is real, reliable, and capable of sustained development.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Strong Luck — Nature Protects',
        verbatim: 'Strong luck. Nature protects the person in unexpected situations and accidents. The task assigned by nature is significant. The person includes this quality urgently and spontaneously — the \'3 digits\' special sign rule applies, meaning luck appears suddenly and unexpectedly rather than as a constant background. Fortune arrives in flashes, often at pivotal moments, in a way that leaves bystanders astonished. The person may take this protection for granted and place themselves recklessly in harm\'s way. The duty that accompanies this level of luck is to apply the talent generously — nature does not protect those who hoard the gift.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Sign of Alarm — Angels',
        verbatim: '7777 is a sign of alarm. The angels — the ones with four sevens — descended to earth and die already in infancy. People with this sign should be very careful. Four or more sevens indicates an extremely high task set by nature — so high that it carries special dangers. The luck is maximally strong, but dominates and may suppress other qualities. This is an extraordinarily rare configuration, and those who carry it and survive infancy are marked for an unusual life. The protection of nature is overwhelming, yet the person must live with an awareness that this protection comes with a commensurate weight of purpose. Every choice carries profound consequence. The ordinary life is not available to them.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Divine Mark — Exceptional Purpose',
        verbatim: 'Five 7\'s represents the most extreme positive expression of nature\'s intent — a person whose entire existence is saturated with divine assignment. Such a person can barely be understood in ordinary human terms. Their life will be marked by extraordinary events, near-miraculous survivals, and moments of pure inspired creation that seem to arrive from beyond them. The burden is equal to the gift: isolation from ordinary human experience, difficulty with mundane relationships and practical life, and the constant weight of a purpose too large to hold comfortably. They need people around them who can honor both their gift and their humanity.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Luck Overload — Cosmic Burden',
        verbatim: 'Six or more 7\'s represents the overload of divine assignment. The protection of nature becomes a kind of crushing weight. Fortune in external affairs co-exists with profound inner difficulty — as though the cosmic luck has drained all resources from the personal domain. The person may feel trapped by their own destiny, unable to live normally and unable to escape the pull of their assigned purpose. Deep spiritual practice and community with others who understand the mystical dimension of life are essential. This is not a configuration that can be managed by ordinary psychological means; it requires a cosmological framework.',
        scale: 'overload'
      }
    ]
  },

  8: {
    digit: 8,
    cellName: 'Duty / Tolerance / Kindness',
    intro: 'The number 8 is one of the most important numbers that defines the entire Pythagorean square of a person, because its persistence or appearance there will determine many necessary qualities. This number is responsible for a sense of duty to relatives (parents, family), tolerance and benevolence — qualities that we should show to parents and loved ones. Why exactly is \'8\' responsible for this quality? The explanation is very simple. Let\'s write a list of a person\'s closest relatives: father, mother, brother (or sister), wife, son, daughter, your wife\'s father, your wife\'s mother. There are eight people on the list, and you owe them all. Your parents are the most important here; we can\'t choose them, but they gave us life and we should be grateful. Tolerance... We probably talk about this quality every day. Many characterize it as humility and silence, but you should not replace one word with another. Tolerance is the ability to tolerate a person nearby, his habits, views, desires. It is very difficult to cultivate a sense of duty in yourself if your parents did not pay enough attention to their parents.',
    lineContext: 'Row 2 (2, 5, 8) — Family orientation. Column 3 (7, 8, 9) — Talent potential.',
    meanings: [
      {
        count: 0,
        label: 'No Sense of Duty to Relatives',
        verbatim: 'A person who does not have eights should not be relied on if he is entrusted with something — he is in no hurry to give back. There is no innate sense of duty to relatives. Such a person may be unreliable in family commitments. The relationship with parents is thin, and this thinness ripples forward through all significant relationships. However, this quality can be developed through conscious effort. The person must choose, as an act of will rather than feeling, to honor commitments. Understanding why duty matters — not from obligation but from the recognition of interconnection — is the path forward. The absence of this digit represents a specific karmic task for this lifetime.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Very Weak Sense of Duty',
        verbatim: 'The presence of one eight in the psychomatrix begins to strongly influence the character of a person, because there is a possibility of transition of 11 to 8 or, vice versa, of 8 to 11, which is more important. For example, if a person has the character 111 and there is one 8, a new chain of transitions emerges: 111 and 8 transitions to 1 and 88 (kind and tolerant), but with pressure this person explodes and his character transitions into 11111, which is the character of a despot, and a new wave of conflict can take on a very extreme form. This volatile interaction between weakness of duty and softness of character means the person is capable of extraordinary kindness and sudden inexplicable coldness — often in the same relationship.',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Duty / Tolerance Given in Norm — Self-Sacrifice',
        verbatim: 'For those capable of self-sacrifice. Two eights represent duty and tolerance given in normal measure. These people are less likely to break the bonds of marriage, although this is not excluded. The balance between duty to others and personal boundaries is healthy. They genuinely feel their obligations toward family, can sustain long periods of patient endurance, and act from a sense of rightness rather than fear. The quality of self-sacrifice is present but not pathological — they give, but they know when to stop. Kindness toward parents is a source of inner stability, not resentment.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Strong Sense of Duty — Truth Finder',
        verbatim: 'It is necessary to highlight the characteristic of duty for \'888\'. If you remember, three figures always caused instability of the quality. In this case we deal with the person who is kind, tolerant, remembers parents, but thus becomes the truth finder. This aim can be dangerous if it grows to maximum. Truth finders can even kill without any hesitation for what they think is right. So never play with this part of the person. And for those who got this sign — try to lower your unreasonable demands. Active collectivists who owe everything to everyone.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Very Rare — Parapsychic Abilities',
        verbatim: 'A very rare sign. In the current century, this was only possible for those born in 1988. Children born with this sign had developed abilities and a penchant for studying the exact sciences. Such people often have parapsychic or extrasensory abilities. Four eights dominate and may suppress other qualities. The sense of duty is so profound it can become self-abnegating — the person disappears into service, losing individual identity in the process. The parapsychic component means they often feel the needs of others directly, without being told. Boundaries are difficult; saying no feels like a violation of their deepest nature.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Duty Dominates — Martyrdom Risk',
        verbatim: 'Five 8\'s represents the complete dominance of duty over all other qualities. The person becomes defined entirely by their obligations to others, and the self — its desires, its needs, its individual destiny — is perpetually sacrificed. While this can produce genuine saints and remarkable healers, it more commonly produces chronic martyrdom: resentment hidden beneath perpetual giving, exhaustion masked as devotion, and the quiet belief that one\'s own needs do not matter. The lesson is radical self-inclusion: the person who serves everyone except themselves is not genuinely serving — they are avoiding the confrontation with their own desires.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Duty Overload — Moral Rigidity',
        verbatim: 'Six or more 8\'s triggers the overload inversion of duty: the quality becomes its shadow. What was tolerance becomes rigid moralizing; what was kindness becomes controlling care; what was duty becomes guilt-based manipulation — of oneself and others. The person\'s strong sense of obligation becomes a weapon turned inward and outward. They may become tyrannical in the name of protecting what they love. The corrective is the recognition that genuine love does not require the beloved to be small — that duty and freedom are not opposites but complement each other at their highest expression.',
        scale: 'overload'
      }
    ]
  },

  9: {
    digit: 9,
    cellName: 'Memory / Intellect / Clairvoyance',
    intro: 'The number 9 in the square of Pythagoras is responsible for the mind, memory and clairvoyance of a person. Why this number? It follows the number 8, and its characteristic should be related to the value of this number. \'8\' is responsible for duty towards loved ones, especially parents. It is natural that people experience the death of parents, and that\'s when the number 9 comes. After the death of parents, the duty changes to a new quality — they must be remembered, so the number 9 is responsible for memory. When we talk about any person, about his abilities, as a rule, evaluating his memory, we conclude about his intelligence: \'He knows so much, so he is smart.\' By accumulating experience, we can predict situations based on something similar in the past. Therefore, the better your memory, the better you can predict situations.',
    lineContext: 'Row 3 (3, 6, 9) — Stability. Column 3 (7, 8, 9) — Talent potential. Spiritual diagonal (1, 5, 9) — Spiritual life.',
    meanings: [
      {
        count: 0,
        label: 'No Memory / Intellect from Birth',
        verbatim: 'There are no nines — weak level of mental ability. For a person who doesn\'t have either a 5 or a 9, doing science becomes a problematic situation, due to the influence on his interests. The person doesn\'t hear others and has no logic. The behavior model was established from childhood — they won\'t believe it until they try it themselves. When bumps are full, they become too careful. Suspicious. Intuition is confused with fear. Naïve, find problems for themselves. The absence of memory-intellect does not indicate low intelligence — it indicates a specific mode of learning that is purely experiential. This person learns only through doing, failing, and trying again. Abstract teaching and theoretical frameworks are nearly inaccessible to them.',
        scale: 'absent'
      },
      {
        count: 1,
        label: 'Very Weak Memory',
        verbatim: 'Very weak memory. The channel of communication with the subtle world, with the cosmos, is essentially closed at birth. Such a person is constantly busy with calculations, experiments, trying to predict further events. These people make a huge number of mistakes. Everything that is given to them, they pierce through by their head — by direct experience rather than foresight. The person must learn from each mistake individually, unable to carry the lesson into a general principle. This makes life laboriously experiential. Each domain must be entered fresh, without the benefit of transferred wisdom from other areas. The compensating gift is an extraordinary groundedness in concrete reality.',
        scale: 'very-weak'
      },
      {
        count: 2,
        label: 'Memory / Intellect Given in Norm',
        verbatim: 'Having \'99\' in the square of Pythagoras would add another \'5\'. Having accumulated quite a lot of life experience, a person gradually begins to strengthen his logical capabilities at the expense of accumulated situational models, which he can later compare with newly emerged situations. Strengthened this way, the logic cannot, however, provide an intuitive understanding of a problem, and therefore cannot create a fundamentally new idea or solution. A person with two nines improves what already exists. If there are two nines, a person with certain other sets of numbers (55, 777, or 666) may possess the faculty of clairvoyance that will be based on a combination of signs.',
        scale: 'norm'
      },
      {
        count: 3,
        label: 'Strong Memory — Very Smart',
        verbatim: 'Strong memory, mind; very smart. Bored if not interested in what they are doing. Have good eloquence. Often see \'prophetic\' dreams; can predict the course of events; are usually quite good physiognomists. For some minor detail, in general terms, they can describe past or future events. The memory extends beyond the personal — this person carries within them the echoes of many experiences, some of which seem to transcend their own life. The gift of prophecy through dreams is reliable, though the person may initially distrust it. Cultivating relationship with the dream-life and with intuition as a faculty separate from reason is deeply rewarding for this configuration.',
        scale: 'special'
      },
      {
        count: 4,
        label: 'Erudite but Tough, Merciless',
        verbatim: 'People are erudite, but tough, merciless. Everything that is happening around is clear to them. They clearly see the causes and consequences of events. They possess what can only be called clairvoyance. This combination is quite rare. Such people can predict destinies. They would be quite good in control of economies, as the possibility of their mistakes is very small. The danger of this configuration is the coldness it produces: seeing everything clearly can make the world appear as a deterministic mechanism, draining it of wonder and compassion. The person can become ruthless — not through malice but through the icy clarity of total comprehension. Developing genuine empathy, allowing themselves to feel the human cost of what they clearly see, is the essential counterweight.',
        scale: 'strong'
      },
      {
        count: 5,
        label: 'Complete Cosmic Memory',
        verbatim: 'Five 9\'s represents a complete cosmic memory — the person seems to carry within them the full record of everything they have experienced across time, not only in this life but from the deep past of accumulated soul experience. Practically, this manifests as an encyclopedic knowledge base, a gift for pattern recognition across vast time scales, and an ability to forecast events that others find uncanny. The shadow is that this person may be living more in the accumulated past than in the present moment. The intensity of memory can crowd out immediate experience. Learning to be present — to receive the current moment without immediately filing it in the vast archive — is the work.',
        scale: 'dominant'
      },
      {
        count: 6,
        label: 'Memory Overload — Cognitive Burden',
        verbatim: 'Six or more 9\'s triggers the memory overload. The vast archive becomes a prison. The person cannot escape the weight of what they know and remember. Every new experience immediately triggers dozens of associated memories, precedents, and patterns, making the present nearly inaccessible. Sleep may be disrupted by the sheer volume of content moving through the mind. Decision-making paradoxically slows, as every option generates a cascade of remembered consequences. Meditation traditions that cultivate the skill of letting go — not the accumulation of more knowledge, but the release of what is already held — are essential. The gift must learn to empty itself to receive.',
        scale: 'overload'
      }
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LINE MEANINGS
// ─────────────────────────────────────────────────────────────────────────────

export const PSYCHOMATRIX_LINE_MEANINGS: PsychomatrixLineData[] = [
  // ROWS
  {
    id: 'row_1',
    type: 'row',
    digits: [1, 4, 7],
    name: 'First Row — Purposefulness',
    quality: 'Goal Achievement & Direction',
    description: 'Determines the presence of purposefulness as a quality of a person\'s character. The value of purposefulness as a personal characteristic is difficult to overestimate, since it is this parameter that depends on the correspondence of our desires and capabilities. After all, it is not a matter of financial well-being, but of the strength of desire, the general mood to achieve the goal. A strong first row (many digits summed across cells 1, 4, and 7) means the person is highly goal-oriented. Commitment of a leader without any pragmatism or the ability to learn from life is transformed into unreasonable ambition — that is how the line should be read even if the number of ones in the appropriate box is maximized. A weak first row means difficulty setting and maintaining goals over time.'
  },
  {
    id: 'row_2',
    type: 'row',
    digits: [2, 5, 8],
    name: 'Second Row — Family Orientation',
    quality: 'Desire to Build Relationships & Family',
    description: 'Shows how strong a person\'s desire to create a family is, the desire to build a relationship system based on close interaction with the opposite sex. With a clear understanding of the importance of such a step. After all, the family is not just legalized sexual cohabitation, as one German philosopher exotically described, but a complex system that includes reproductive, economic, psychological, educational, creative functions and a large share of responsibility for loved ones. The stronger the second row, the stronger the attachment to family and the family responsibilities that fall on a person\'s shoulders. It is pointless to \'educate\' the qualities of a family man in a person with a weak second row — it will push them away from the family.'
  },
  {
    id: 'row_3',
    type: 'row',
    digits: [3, 6, 9],
    name: 'Third Row — Stability',
    quality: 'Resistance to Change & Habitual Consistency',
    description: 'The indicators of the stability of a person\'s character. That is, they describe the balance between usual habits and certain thinking, on the one hand, and the desire for change, on the other. Thus, the value of personal stability is the answer to the question of the reliability of this person in a particular situation. A strong third row person has very stable habits and rituals, and may demand their performance from others. It is desirable that the number of digits in this line be the same between partners, or differ by not more than 2 digits. A weak third row indicates adaptability but also potential restlessness and inconsistency.'
  },
  // COLUMNS
  {
    id: 'col_1',
    type: 'column',
    digits: [1, 2, 3],
    name: 'First Column — Self-Esteem',
    quality: 'Self-Appraisal & Personal Confidence',
    description: 'A numerical indicator of the level of self-esteem. Hardly any other parameter is more important in the context of a person\'s desire to realize his own potential. But if low self-esteem is only indecisiveness, self-doubt, and therefore eternal circling in circles, then unjustifiably overestimated capabilities can lead to fatal mistakes and cruel disappointments. The first column is the self-appraisal of the person. The stronger the column, the more confident — but potentially overconfident — the person is. People with a very strong first column think those around them are more foolish. Most of the family responsibilities should fall on the shoulders of those who have more digits in the second (family) line.'
  },
  {
    id: 'col_2',
    type: 'column',
    digits: [4, 5, 6],
    name: 'Second Column — Labor Efficiency',
    quality: 'Physical & Practical Capacity for Material Success',
    description: 'Describes a person\'s physical health, level of endurance, degree of inclination to work and possession of practical skills, as well as the ability to think logically. Thus, the second column serves as an indicator of labor efficiency as a qualitative characteristic of a person\'s ability to achieve a certain social status, to ensure his well-being and the well-being of his family. A strong second column means the person is physically capable, practically skilled, and logically sharp — key ingredients for material success. A weak column means difficulty in these areas, requiring extra care and effort to support oneself and one\'s family.'
  },
  {
    id: 'col_3',
    type: 'column',
    digits: [7, 8, 9],
    name: 'Third Column — Talent & Potential',
    quality: 'Natural Gifts & Life Purpose',
    description: 'Contains information about a person\'s talent. However, \'talents should be helped...\', people say, and the vast majority of people live their lives without ever discovering their talent, often without even suspecting its existence. Therefore, we can only talk about potential, the realization of which depends on all other personal qualities: diligence, purposefulness, sense of self-worth, etc. A strong third column means rich natural talent waiting to be developed. A weak column does not mean the person has no purpose — it means their direction is more earthly and practical. The talent potential requires all other qualities (energy, character, purpose) to be realized fully.'
  },
  // DIAGONALS
  {
    id: 'diag_spirit',
    type: 'diagonal',
    digits: [1, 5, 9],
    name: 'Spiritual Diagonal — 1·5·9',
    quality: 'Degree of Inner Unity with Nature / God',
    description: 'Spiritual diagonal. Indicates the level of a person\'s spirituality. Do not confuse spirituality with religiosity. This quality has nothing to do with religious denominations, and it is completely alien to the exaltation of zealots of faith. The degree of unity of a person with Nature (Nus, God) is determined by firmness of convictions and clarity of perception, balanced principles and willingness to compromise, to accept a different perspective. A strong spiritual diagonal means deep inner coherence — the person\'s will (1), logic (5), and memory/mind (9) are well-developed and aligned, producing a spiritually grounded individual. Weakness in this diagonal indicates fragmentation of inner life.'
  },
  {
    id: 'diag_carnal',
    type: 'diagonal',
    digits: [3, 5, 7],
    name: 'Carnal Diagonal — 3·5·7',
    quality: 'Temperament & Sexual Compatibility',
    description: 'Carnal diagonal. An indicator of a person\'s temperament in terms of intimate, sexual relationships. And no matter what supporters of unions built on mutual respect and material well-being say, it is the degree of matching of temperaments that often becomes the main factor that determines the duration and quality of a marriage. When choosing a partner, look at the sensual diagonal of each partner — it allows assessment of temperament. A person may have many \'4\'s, giving them a beautiful body, but if their sensual diagonal is weak, there may be problems of an intimate nature if one person has a stronger libido than the other. Strong hands and broad shoulders do not always mean sexual strength or strong libido. The number 4 has nothing to do with the intimate life of a person; you must look at the carnal diagonal. It is optimal if the man is stronger than the woman by 1 digit, or they have the same number of digits in this diagonal.'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// DIGIT TRANSITION RULES (Cross-Cell Synergies)
// ─────────────────────────────────────────────────────────────────────────────

export const PSYCHOMATRIX_TRANSITIONS: ComplementaryInsight[] = [
  {
    digits: [1, 8],
    title: 'Character ↔ Duty Transition',
    insight: 'Character (1) and Duty (8) are in constant dialogue. When 111 is present alongside a single 8, the character transitions to a soft, tolerant mode (1 and 88). But under external pressure, it can instantly reverse into 11111 — the despot. This is a volatile and powerful combination: extraordinary kindness and sudden explosive authority can emerge from the same person in the same relationship. Awareness of this transition is essential for those close to this person.',
    type: 'transition'
  },
  {
    digits: [2, 4],
    title: 'Energy Amplified by Body',
    insight: 'Physically beautiful, healthy people (strong 4) always draw attention to themselves. Their contact energy (Number 2) comes from their healthy body. If they are not aggressive and are quiet and kind, they can attract others with radiant donor energy even when the 2 count is low. This means a weak or absent 2 can be partially compensated by strong 4 — the body becomes the antenna of social energy.',
    type: 'amplify'
  },
  {
    digits: [5, 9],
    title: 'Logic ↔ Memory Mutual Amplification',
    insight: '\'55 gives 9 and 99 gives 5.\' These two digits continuously amplify each other. Strong logic (55+) generates additional memory depth; strong memory (99+) generates additional logical capacity. When both are present at norm levels or above, they create a self-reinforcing intelligence engine. People who appear highly logical but have no 5s are likely using strong 9s to simulate logic through pattern memory.',
    type: 'transition'
  },
  {
    digits: [1, 1, 8],
    title: '111 + 8 — The Exploding Diplomat',
    insight: 'The combination of three ones (golden mean character) with any 8 (duty/tolerance) creates a deceptively peaceful exterior that conceals a deeply reactive interior. The person appears soft, flexible, and accommodating — but under sustained pressure, the character erupts into full despot mode (11111). Partners and colleagues who mistake the warmth for permanent accommodation eventually trigger this transformation to their shock.',
    type: 'tension'
  },
  {
    digits: [6, 7, 8],
    title: '666 Neutralized by 7 & 8',
    insight: 'When 666 is present alongside both a 7 and an 8, the neutralization formula applies: two of the 6\'s cancel against the 7 and 8, leaving only a single 6 (man of moods). This deletion only works if neither 7 nor 8 has undergone its own transition. If either has transitioned (due to conflict with parents or loss of health/energy), the formula fails and the full weight of 6666 may emerge with new destructive qualities.',
    type: 'synergy'
  },
  {
    digits: [1, 4],
    title: 'Character + Health — The Leader\'s Body',
    insight: 'Strong character (1111+) combined with strong health (444+) creates the natural leader with physical authority. This person commands not only through will but through presence. The danger is the combination of wilfulness and physical strength as the \'final argument\' — the urge to resolve disputes physically rather than diplomatically increases significantly when both these digits are dominant.',
    type: 'tension'
  },
  {
    digits: [7, 9],
    title: 'Luck + Memory — Natural Seer',
    insight: 'The combination of strong luck (77+) with strong memory (99+) in the third column creates a person of genuine prophetic capacity — luck informs them of what is possible; memory tells them what is likely; together they produce foresight that feels supernatural to observers. This combination, when coupled with 55 logic, creates the closest thing this system recognizes to a natural oracle.',
    type: 'synergy'
  },
  {
    digits: [2, 2, 2],
    title: '222 — The Psychic Sign',
    insight: 'Three twos carry the extrasensory mark from birth. In ordinary circumstances this person resembles someone with a single 2 — lazy, mobile, moody, energy-deficient. But under extraordinary circumstances — crisis, loss, unexpected confrontation with the unseen — dormant abilities awaken. Many psychics and energy healers carry this sign. The activation trigger is always circumstantial, never voluntary. This is why many never discover the gift.',
    type: 'special' as ComplementaryInsight['type']
  },
  {
    digits: [3, 5, 7],
    title: 'Carnal Diagonal — Temperament Alignment',
    insight: 'For compatibility, compare the carnal diagonal digit counts between partners. The optimal configuration is equal counts or a difference of one digit in favor of the man. A large discrepancy in carnal diagonal strength predicts intimate incompatibility regardless of how aligned other qualities are. Physical attractiveness (4) is irrelevant to this assessment — only the carnal diagonal determines intimate vitality and libido.',
    type: 'synergy'
  },
  {
    digits: [1, 5, 9],
    title: 'Spiritual Diagonal — Inner Coherence',
    insight: 'When will (1), logic (5), and memory (9) are all well-developed, the spiritual diagonal produces a person of genuine inner alignment — their convictions match their reasoning match their experiential wisdom. This creates rare intellectual and spiritual authority. The partial version — strong in two of the three — always produces a specific imbalance: will without logic becomes fanaticism; logic without will becomes impotence; memory without logic becomes superstition.',
    type: 'synergy'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// CALCULATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculates all four Alexandrov working numbers from a date of birth.
 * @param day   - Birth day (1–31)
 * @param month - Birth month (1–12)
 * @param year  - Birth year (4 digits)
 */
export function calculateWorkingNumbers(day: number, month: number, year: number): {
  first: number; second: number; third: number; fourth: number;
} {
  // First: sum all digits of the full date
  const allDigits = `${day}${month}${year}`.split('').map(Number);
  const first = allDigits.reduce((a, b) => a + b, 0);

  // Second: sum digits of first
  const second = String(first).split('').map(Number).reduce((a, b) => a + b, 0);

  // Third: first – (2 × first digit of the birth day)
  const firstDigitOfDayActual = Number(String(day)[0]);
  const third = first - 2 * firstDigitOfDayActual;

  // Fourth: sum digits of third (if third is single digit, fourth = third)
  const fourth = third < 10
    ? third
    : String(third).split('').map(Number).reduce((a, b) => a + b, 0);

  return { first, second, third, fourth };
}

/**
 * Builds the full Pythagorean Psychomatrix from a date of birth.
 */
export function calculatePsychomatrix(day: number, month: number, year: number): PsychomatrixResult {
  const { first, second, third, fourth } = calculateWorkingNumbers(day, month, year);

  // Collect all digits: birth date digits + 4 working numbers
  const birthDigits = `${day}${month}${year}`.split('').map(Number);
  const workingDigits = [...String(first).split('').map(Number),
                         ...String(second).split('').map(Number),
                         ...String(third).split('').map(Number),
                         ...String(fourth).split('').map(Number)];
  const allDigits = [...birthDigits, ...workingDigits].filter(d => d !== 0);

  // Count occurrences
  const counts: Record<number, number> = {};
  for (const d of allDigits) {
    if (d >= 1 && d <= 9) counts[d] = (counts[d] || 0) + 1;
  }

  // Build 3×3 grid: rows are [1,4,7], [2,5,8], [3,6,9]
  const cell = (n: number) => counts[n] ? String(n).repeat(counts[n]) : null;
  const grid: Array<Array<string | null>> = [
    [cell(1), cell(4), cell(7)],
    [cell(2), cell(5), cell(8)],
    [cell(3), cell(6), cell(9)],
  ];

  // Detect active lines (all 3 cells populated)
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

  const activeLines = Object.entries(lineDigitCounts)
    .filter(([_, total]) => total >= 3)
    .map(([id]) => id);

  // Build cell readings with modifiers
  const cellReadings: CellReading[] = [];
  for (let digit = 1; digit <= 9; digit++) {
    const count = counts[digit] || 0;
    const cellDef = PSYCHOMATRIX_CELL_MEANINGS[digit];
    const meaning = getPsychomatrixCellMeaning(digit, count);
    const modifiers = buildModifiers(digit, count, counts);
    cellReadings.push({
      digit,
      count,
      cellName: cellDef.cellName,
      label: meaning.label,
      verbatim: meaning.verbatim,
      scale: meaning.scale,
      modifiers
    });
  }

  // Gather relevant complementary insights
  const complementaryInsights = getComplementaryPairs(counts);

  return {
    day, month, year,
    first, second, third, fourth,
    allDigits,
    counts,
    grid,
    activeLines,
    complementaryInsights,
    cellReadings
  };
}

/**
 * Looks up the exact meaning for a given digit at a given count.
 * count >= 6 maps to the overload (6) entry.
 */
export function getPsychomatrixCellMeaning(digit: number, count: number): PsychomatrixCellMeaning {
  const cellDef = PSYCHOMATRIX_CELL_MEANINGS[digit];
  if (!cellDef) return { count: 0, label: 'Unknown', verbatim: '', scale: 'absent' };
  const cappedCount = Math.min(count, 6);
  return cellDef.meanings.find(m => m.count === cappedCount)
    || cellDef.meanings[cellDef.meanings.length - 1];
}

/**
 * Builds contextual modifiers for a digit based on its interactions with other present digits.
 */
function buildModifiers(digit: number, count: number, counts: Record<number, number>): string[] {
  const mods: string[] = [];

  if (digit === 1) {
    if ((counts[8] || 0) >= 1 && count === 3) {
      mods.push('111 + 8 transition active: this golden mean character harbors a hidden despot. External softness conceals volatile inner authority.');
    }
    if ((counts[4] || 0) >= 2 && count >= 4) {
      mods.push('Strong character + strong health (44+): the physical dimension may become the \'final argument\' in disputes. Exercise restraint.');
    }
  }

  if (digit === 2) {
    if ((counts[4] || 0) >= 2 && count <= 1) {
      mods.push('44+ compensates for weak 2: body-radiance substitutes as contact energy. Physical presence carries social magnetism even without inherent energy.');
    }
    if (count === 3) {
      mods.push('222 — Psychic sign: extrasensory abilities lie dormant, awaiting activation by extraordinary circumstances. You may not know this gift until the moment it is needed.');
    }
  }

  if (digit === 5) {
    if ((counts[9] || 0) >= 2) {
      mods.push('99 present: memory amplifies logic. Your logical conclusions are bolstered by a vast archive of situational precedents.');
    }
    if (count >= 2) {
      mods.push('55+ generates an additional 9: your analytical depth is actively enriching your memory base in a self-reinforcing cycle.');
    }
  }

  if (digit === 6) {
    if ((counts[7] || 0) >= 1 && (counts[8] || 0) >= 1 && count === 3) {
      mods.push('666 + 7 + 8 present: neutralization formula active. Two 6\'s cancel against 7 and 8 — effective quality reduces to single 6 (man of moods), provided neither 7 nor 8 has undergone transition.');
    }
  }

  if (digit === 9) {
    if ((counts[5] || 0) >= 2) {
      mods.push('55+ present: logic reinforces memory in return. The 5↔9 amplification cycle is active in both directions.');
    }
    if (count >= 2) {
      mods.push('99+ generates an additional 5: accumulated memory patterns are actively deepening your logical frameworks.');
    }
  }

  return mods;
}

/**
 * Returns the most relevant complementary pair insights for a given set of counts.
 */
export function getComplementaryPairs(counts: Record<number, number>): ComplementaryInsight[] {
  return PSYCHOMATRIX_TRANSITIONS.filter(insight => {
    // Count required digits (with duplication)
    const needed = [...insight.digits];
    const available = { ...counts };
    for (const d of needed) {
      if (!available[d] || available[d] <= 0) return false;
      available[d]--;
    }
    return true;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SCALE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const SCALE_LABELS: Record<PsychomatrixCellMeaning['scale'], string> = {
  'absent':    'Absent',
  'very-weak': 'Awakening',
  'norm':      'Balanced',
  'special':   'Special Sign',
  'strong':    'Strong',
  'dominant':  'Dominant',
  'overload':  'Overload'
};

export const SCALE_COLORS: Record<PsychomatrixCellMeaning['scale'], string> = {
  'absent':    '#6b7280',
  'very-weak': '#9ca3af',
  'norm':      '#c49a28',
  'special':   '#a78bfa',
  'strong':    '#34d399',
  'dominant':  '#f59e0b',
  'overload':  '#ef4444'
};

export const CELL_POSITIONS: Record<number, { row: number; col: number }> = {
  1: { row: 0, col: 0 }, 4: { row: 0, col: 1 }, 7: { row: 0, col: 2 },
  2: { row: 1, col: 0 }, 5: { row: 1, col: 1 }, 8: { row: 1, col: 2 },
  3: { row: 2, col: 0 }, 6: { row: 2, col: 1 }, 9: { row: 2, col: 2 },
};
