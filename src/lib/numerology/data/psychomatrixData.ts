'use client';

/**
 * @fileoverview ALEXANDROV'S PSYCHOMATRIX — Complete Verbatim Reference Data
 */

import {
  PSYCHOMATRIX_LINE_INTERPRETATIONS,
  getLineLevel,
  computeLineTotal,
  type LineScaleLevel,
} from './psychomatrixLineInterpretations';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface PsychomatrixCellMeaning {
  count: number;
  label: string;
  verbatim: string;
  scale: 'absent' | 'very-weak' | 'norm' | 'special' | 'strong' | 'dominant' | 'overload';
}

export interface PsychomatrixCellData {
  digit: number;
  cellName: string;
  intro: string;
  lineContext: string;
  meanings: PsychomatrixCellMeaning[];
}

export interface PsychomatrixResult {
  day: number;
  month: number;
  year: number;
  first: number;
  second: number;
  third: number;
  fourth: number;
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
// DATA & LOGIC
// ─────────────────────────────────────────────────────────────────────────────

export const PSYCHOMATRIX_CELL_MEANINGS: Record<number, PsychomatrixCellData> = {
  1: {
    digit: 1,
    cellName: 'Character / Will',
    intro: 'Digit 1 in the psychomatrix answers for the character of a person, his willful qualities, strength of striving for power, ability to defend his own views.',
    lineContext: 'Row 1 (1, 4, 7) — Purposefulness. Column 1 (1, 2, 3) — Self-esteem. Spiritual diagonal (1, 5, 9) — Spiritual life.',
    meanings: [
      { count: 0, label: 'Character Absent', verbatim: 'No digit 1 is present. The quality of character and will is absent or profoundly undeveloped.', scale: 'absent' },
      { count: 1, label: 'Will-less, Egoistic', verbatim: 'Will-less, egoistic. One can say this is one of the most difficult characters. They are possessed by people contradictory in their nature. Having a will-less character, they avoid making any decisions, trying to shift them onto another person\'s shoulders. Running away from making a decision, they desperately imitate activity and vigorously show their willful qualities. That is why they always enter into an argument on any issue. As surprising as it may be, the subject of the argument is absolutely indifferent to them, as in the argument itself they are only interested in victory, they acutely need success, striving to show everyone the strength of character. Often become egoistic, achieving victory, they do not notice other people with their requests and troubles. Such people never make hasty decisions, give complex answers that can be understood differently, which gives them the opportunity to renounce their words, or even better — not make any decisions. Don\'t you dare accuse them of will-lessness. You will offend them, and they simply won\'t believe you, again showing their quality of a quarreler.', scale: 'very-weak' },
      { count: 2, label: 'Soft Character, Praise-Seeking', verbatim: 'People having two units in the psychomatrix differ by a soft character, very love praise and earn it in every way. That is why they help others a lot, easily enter any company, are noticeable in it, as they strive to attract attention to themselves, to subsequently receive gratitude for a pleasant meeting. They know how to listen to another, if he does not try to pressure them. Very rarely use pressure on another person. They often lack firmness in defending their views, and they strive for a profession independent of anyone, however, the desire to receive praise pushes them into the field of doctor, teacher. Often they do not have purposefulness and self-esteem, which becomes a reason for underestimation of their goals. If they are lucky and in the Pythagoras Square there are \'22\' or \'2222 or more\', their initiative becomes more active.', scale: 'norm' },
      { count: 3, label: 'Golden Mean', verbatim: 'Golden mean. Such people can find common language with any person. They can, if necessary, yield in an argument to anyone (even \'1\'). The main thing to know — one cannot pressure such a person, as defending himself, he will defeat anyone, even a despot. A person with the character \'golden mean\' makes a natural transition to a new character: \'1 and 8\' (we consider that digit 8 is absent). It corresponds to a soft and tolerant character. This external, deceptive softness pushes lovers of commanding others to test their power on those who have the character \'111\', which turns into an unexpected explosion of emotions, and this leads to conflict and suppression of the despot. If parents from childhood years have been suppressing a child with this type of character, then it can be said for sure that this child will grow up with little sense of duty towards his parents. Remember: everything in life goes in a circle. If one forgets about his duty towards his parents, then he himself should give birth to a child who will lose his sense of duty towards him.', scale: 'special' },
      { count: 4, label: 'Strong, Volitional Character', verbatim: 'This is a volitional and strong character. These people know how to set goals before themselves. If they have energy (22 and more) — they are ready to enter into an argument and strive for victory. However, they always know the measure and do not cross certain boundaries, as they do not possess despotism. They always remember their interlocutor, not striving to offend him. Such people can make a decision immediately and rarely refuse it. If you have the character \'1111\', you need to learn to stop yourself if necessary. However, even more important — to learn to refuse a previously made decision if necessary. This character is a true gift of fate for any person, as it allows setting and achieving very high goals in any branch of human knowledge. Most importantly, this character helps reveal the talent of the person himself. For men, such character is better suited for parenthood or the military. Never forget, that this is the character of the leader who wishes to be better than others. Do not try to humiliate those with \'1111\'; it will lead to a great repulse.', scale: 'strong' },
      { count: 5, label: 'Maximally Expressed Power & Leadership (Despot)', verbatim: 'Maximally expressed character of power and leadership. A person moves toward his goal, not paying attention to people standing nearby, even if the psychomatrix of this person has digits 8. Even tolerance (digits 8) cannot guaranteedly restrain the power-hungriness. Such people are rightly called despots. Unlimited power — or no power at all. Rarely can any of them stop, there is no limit to their power aspirations. It is this pursuit of power that creates a hostile environment around them. One can say for sure — the outcome of any despot is known, he himself begets his successor, who will also \'step on\' him himself. The only way to preserve oneself — is departure from power, as it has no boundaries. One despot will beget another, and there will be no end to this. Tolerance and the search for your own talent can be alternative realizations of this character. Such a person can become an unsurpassed artist, poet, dancer, or actor — all these are ways of realizing character \'11111\' when there is leadership, but no victims of despotism.', scale: 'dominant' },
      { count: 6, label: 'Overload — Hidden Authority', verbatim: 'When the quantity of 1\'s has exceeded five figures, it is possible to speak about \'overload\' of the despot — that means sudden changes of one\'s character. The person starts to be afraid of his own latent character of aspiration to authority. By his own inquiries about authority, he clearly understands that he can never have it (tsar, the president). If it is not the highest authority, the goal has no value. Comprehension of the impossibility to receive full authority leads to his full refusal of it. Such people can open their latent plans only during moments of strong intoxication. They are very tolerant, quiet; explosions of emotions occur only after long accumulation of insults. When such a moment comes, one word is enough for the emission of the huge collected energy. It is necessary for close people to know about this and to try to liberate the stored insults at smaller quantities. The choice of work is defined not by interest, but by that degree of freedom which it gives: to not depend on the chief and to not depend on anybody at all.', scale: 'overload' }
    ]
  },
  2: {
    digit: 2,
    cellName: 'Energy',
    intro: 'The Pythagorean number 2 represents human energy. It is necessary to understand that energy in this case is a person\'s behavior in the family, at work and in society. We call a person \'energetic\' if he can visualize a goal, find ways to achieve it and move forward to achieve it according to his own plan.',
    lineContext: 'Row 2 (2, 5, 8) — Family orientation. Column 1 (1, 2, 3) — Self-esteem.',
    meanings: [
      { count: 0, label: 'Very Weak Energy, Vampire', verbatim: 'Absence of \'2\' in the Pythagorean Square is a reflection of very weak energy. Such people can be named vampires, but don\'t be afraid of this word. Any person (even the donor) begins \'vampiring\' energy from another when there is strong deficiency of it (stress, quarrel, illness, a fright, mountain). The people who possess weak energy or don\'t have any are lazy, excessive in physical mobility, fussy and are afraid of any conflicts. They always try to avoid any quarrels, but do like to witness ones. It is difficult enough for them to take opportunities and find their own abilities because of their laziness. They usually underestimate the purposes. Love dogs very much and don\'t like cats, because dogs are donors, and cats are vampires.', scale: 'absent' },
      { count: 1, label: 'Energy Deficiency', verbatim: 'A presence of one \'2\' in the Pythagorean Square shows person\'s energy deficiency. By the way, presence of Numbers 4 will strengthen it a little, but the qualities usual for weakened energy won\'t change. Such people possess all qualities of those who have none: laziness, mobility, fussiness. The only difference is that all these qualities are temporary, wavy: the person suddenly becomes the fidget, is lazy selectively, choosing \'zones of laziness\' where he is able to relax and have a rest. These people also avoid conflicts as do not like to spend energy. They do something good usually for the main purpose of returning spent energy through a praise, even more, with some desert. Praise, compliments, leadership, difference from others — all these are usual qualities of such people. Alcohol or drugs can be a problem for them. In conversation with other people they prefer to speak about themselves or about themes interesting to them, trying softly to change \'another\'s\' themes. Manual labour is not for them, as it requires energy.', scale: 'very-weak' },
      { count: 2, label: 'Norm, Good Energy', verbatim: 'If in your psychomatrix there are two twos, one can say you are lucky. This is the norm necessary for every person. Energy favorable for contact with people and for work. You have your own opinion on everything, no idols, you are independent in views. You are communicative, easily enter into contact with other people. People with energy \'22\' are good storytellers, lecturers, orators, doctors, teachers, preachers, clergy. You can set fairly significant goals before yourself, you can achieve them, as your energy allows doing this. People with good energy are not inclined to laziness. If a person with \'22\' is lazy, the reasons are not in power — it is a low self-estimation, weak purposefulness, or other reasons.', scale: 'norm' },
      { count: 3, label: 'Extrasensory, Psychic Sign', verbatim: 'If in your psychomatrix there is \'222\', this means you possess the sign of an extrasensory from birth, or simply put — you are an extrasensory. An extrasensory is one who possesses energy \'222\', which gives a person unusual abilities, manifesting depending on extraordinary circumstances. Yes, it is unexpected circumstances that lead a person with such a sign to extrasensory. In other cases, he differs little from one who has one two in the psychomatrix, that is, one can put an equal sign between \'2\' and \'222\' if there is no special situation. All characteristics of \'2-none\' and \'one 2\' are inherent to the extrasensory: laziness, mobility, fussiness. Additionally, new qualities appeared: closeness, unwillingness to share their problems, explosion of emotions under pressure from outside, ability to help another person if necessary. For these reasons many psychics try to become the center of attention as they intensively absorb energy from others and, only \'having completely charged\', can give it to others if they consider it necessary.', scale: 'special' },
      { count: 4, label: 'Donor, Energy Overload', verbatim: 'If in your psychomatrix there are four or more twos, this means you are a donor, a person who has an excess of energy and can afford to spend it at his discretion. You will be surprised, but a donor has a problem with how to properly spend the available energy. Such people can spend energy on watching any TV programs, while doing nothing for their development. This can be called laziness, but already from excess of energy, from inertia. Sometimes excessive calmness may appear, bordering on indifference to everything. Donors, as a rule, are very slow, sluggish. They are inclined to sit, lie, but not run and fuss. The best for you is to try yourself in sports, medicine, teaching or manual labour — all these cause big losses of energy and are good for donors. If they will not spend the energy there can be a need for the conflict which will \'unload\' the donor. Superfluous energy is consumed well by cats.', scale: 'strong' }
    ]
  },
  3: {
    digit: 3,
    cellName: 'Interests / Sciences',
    intro: 'The number 3 in the square of Pythagoras is responsible for interest in the sciences and, above all, in the exact sciences or technology. To decide what this interest consists of, it is necessary to determine what line owns the 3s at the moment.',
    lineContext: 'Row 3 (3, 6, 9) — Stability. Column 1 (1, 2, 3) — Self-esteem. Ascending diagonal (3, 5, 7) — Carnal/temperament.',
    meanings: [
      { count: 0, label: 'Propensity to Humanities & Art', verbatim: 'Absence of Number 3 in Pythagoras Square means propensity of the person to humanities and art. When we speak about interests of the child, especially the boy, there is a problem. Most daddies think humanities and even more so arts, doesn\'t correspond to man\'s interests in any way and as consequence — such interests are in every possible way extinguished in the childhood by \'assiduous\' fathers who try to impart to the son man\'s interest to technics. It is not absolutely clever, because Nature forms the child and defines its applicability in its life. If your child has no 3s in Pythagoras Square you should allow it to complete its task for mankind: it\'s born to create new aspects of philosophy, art and culture. It perceives technics externally — by the principle of its grace and beauty.', scale: 'absent' },
      { count: 1, label: 'Very Weakly Developed Interest', verbatim: 'You have one 3 in your Pythagoras Square. All depends on you only. If you choose the purpose to develop your talent, then you are definitely lucky as you can be engaged in any science, but the expert in exact sciences is not you yet. It is possible to find an optimum variant and choose science that is between these branches of knowledge: natural sciences, economy, legal practice, etc. You should choose a direction where you can\'t harm yourself by multiplicity of your interests. Multiplicity is the negative side of \'3\' as it does not fix interest, but sprays it, leading to what even people who are strong in sciences can\'t define the interest. If it won\'t be clearly defined, you can surely say that the person does not have interest in any field of knowledge, especially if he has weak energy (2-not present, 2, 222).', scale: 'very-weak' },
      { count: 2, label: 'Interest Given in Norm', verbatim: 'Your Pythagoras Square has 33, it means, that you have interest in exact science and engineering, but it doesn\'t mean you can easily be engaged in these sciences. It is necessary to define how you can open similar interest. If, having 33, your Pythagoras Square contains 55 (or more), 22, 6 — these figures show that you possess strong logic, good energy and you are a man of moods who can sometimes do manual labor for pleasure. The same numbers tell us that you could become the good engineer or the designer as you can understand any technological process.', scale: 'norm' },
      { count: 3, label: 'Special Sign, Saturated Interest', verbatim: 'The most optimal can be considered those branches of knowledge that use exact sciences (mathematics, physics, technique), consequently, the area of application of one\'s knowledge should be sought at the junction of sciences: mathematical linguistics, computer technique, bionics, etc. The main feature of interest \'333\' — is saturation with a concrete interest. As soon as a person understands that he has figured out a concrete branch of knowledge, he loses interest in this topic. And one more thing. Having \'333\', he will never abandon the topic of his research until he gets to its essence. A person with interest \'333\' must periodically change it, but he must always remain in science, changing directions and topics. Very interesting results can be received from synthesis of various own interests into one theory. The only thing that can prevent one\'s personality realization is disbelief, laziness, worship for \'authorities\' which always denies everything new, for it threatens their prestige.', scale: 'special' },
      { count: 4, label: 'Born Inventor / Constructor', verbatim: 'A fairly rare sign in our time, but sometimes encountered. It means strong interest in science and technique, inventing and constructing. A person is born an inventor and constructor. If in his psychomatrix there are active \'55 and more\', he must engage in technical sciences, work in research institutes, design bureaus, laboratories. If 5 and 9 are expressed poorly, there is a simple but reliable way — write the fantastic novel where your ideas will have a life. Who can condemn the writer for all his ideas being unreal? Fiction is a direction of literature where a person is free to express his ideas.', scale: 'strong' }
    ]
  },
  4: {
    digit: 4,
    cellName: 'Health / Body',
    intro: 'Digit 4 in the psychomatrix answers for the health of a person. By the presence of digit 4 in the psychomatrix, one can assume how he looks, how attractive he is, how physically strong.',
    lineContext: 'Row 1 (1, 4, 7) — Purposefulness. Column 2 (4, 5, 6) — Labor efficiency.',
    meanings: [
      { count: 0, label: 'No Health Given from Birth', verbatim: 'If in your psychomatrix there are no digits 4, this means you were not given health from birth and it is necessary to strengthen and take care of it. A strong body is quite difficult to grow, as it requires spending a lot of energy on this. Professional sports are not recommended, because exhausting of an organism from trainings is going to exceed the energy the person receives from a mobile way of life; after such overloads the person starts to hurt. People who don\'t have any \'4\'s are not good for performing manual labor as they don\'t have the health for it. If the person works physically he will search for sources of energy — alcohol, drugs, quarrels and family conflicts. It is necessary to strengthen the health through ancient improving systems: chi kung, yoga and others. Strengthening the health will make you able to target higher goals. It is possible to strengthen through transition: \'11\' transforms into \'8\' with additional \'4\', or \'6\' transforms into \'7\' with additional \'4\'. For this purpose it is necessary to become more tolerant or to make art a part of your life.', scale: 'absent' },
      { count: 1, label: 'Very Weak Health', verbatim: 'Your Pythagoras Square has only one \'4\'. It speaks that you have health from birth, but it is insufficiently strong to say that prophylactics is not required. If you have \'2222 and more\' then you can try yourself in sports or manual labor. As when there is no \'4\', having only one the person starts to avoid conflicts as they lose health and energy through them. All recommendations for strengthening energy given for \'4-none\' will be useful here too. If you have poor health do not hurry with trying yourself in places where you will have authority above people. If you have good energy \'22\' or \'2222 and more\' and strong character with tolerance — 111 and 8, 1111 and 8, 11111 and 8 — it is possible to try yourself as \'the person of authority\'. If you do not have strong character (11, 1) you will quickly lose your health on the way to your dream (transition 8 to 11 with loss of 4 or 22). House affairs such as kitchen or garden also lead to loss of health, as transition of Number 7 to 6 causes loss of 4 or 22.', scale: 'very-weak' },
      { count: 2, label: 'Health Given in Norm', verbatim: 'Health given in norm. A beautiful, strong body is given from birth. It is possible to try sports safely, even professionally, provided other numbers are also favorable (e.g., Number 6 for interest in manual labor).', scale: 'norm' },
      { count: 3, label: 'Strong Health', verbatim: 'Your Pythagoras Square has \'44\' or more — it means strong health is given from birth and also a beautiful, strong body. It is possible to try yourself in sports safely, even professionally. Manual labor is also possible. Together with health you have sufficient purposefulness which allows you to target goals and reach them. At such strong numbers it is hard for the person to catch illness; if this happens (serious diseases) it is necessary to find the reason of illness. The basic problem — and it will inevitably arise before you — is a physical strength which is given to you from birth and which is often applied as the last \'argument\' in a dispute. Try to avoid using it in this case. The confidence in physical strength pushes to fisticuffs, especially those ones who have three fours (444). Possessing a strong body, they often lose health because of its undermining, not knowing any limits in work or sports.', scale: 'special' },
      { count: 4, label: 'Exceptional Physical Strength & Vitality', verbatim: 'Very good health and virtually unlimited physical possibilities. Both men and women are naturally very strong physically. Men especially so — usually they find consolation not in women, but in alcohol, as strong health allows taking alcohol in almost unlimited quantities. This combination personifies a healthy person with an active lifestyle and high sexual potential.', scale: 'strong' }
    ]
  },
  5: {
    digit: 5,
    cellName: 'Logic / Intuition',
    intro: 'Digit 5 in the psychomatrix answers for human logic and intuition, which, in turn, determines a person\'s ability to make plans and analyze situations, understand exact sciences and technique.',
    lineContext: '2nd column (4,5,6) — maintenance of family; 2nd row (2,5,8) — quality of family man; carnal diagonal (3,5,7) — carnal interests; spiritual diagonal (1,5,9) — spiritual life.',
    meanings: [
      { count: 0, label: 'No Logic; Dreamer', verbatim: 'Absence of Number 5 in Pythagoras Square means that the person doesn\'t use logic; he can be named a dreamer who constantly goes woolgathering. This is why it is not necessary to make far-reaching plans. The person doesn\'t plan, and simply draws up his dreams in the certain sequence, gives out desirable for real. Such people build castles in the air and live in them. It is not necessary to make such a dreamer change his mind; leave him with his dreams. When there is no \'5\' you shouldn\'t be actively engaged in technics and exact sciences; better choose a humanitarian direction or art. It is necessary for people around you to understand that exactly dreamers move forward our civilization, constantly generating utopian dreams in the form of their plans. A good example was V.I. lenin who had no \'5\'s in Pythagoras Square. You shouldn\'t go into details and explain something to the person who doesn\'t have any \'5\'s. Just tell him what he should do, and he will be happy with it. The emotional part is more important for him than a logical explanation.', scale: 'absent' },
      { count: 1, label: 'Very Weak Logic', verbatim: 'If in Pythagoras Square there is one \'5\' it means, that there is logic, but it is very weak and differs a little from quality \'5-not present\'. The person is the same dreamer. The unique difference concerns those people who have many \'3\'s and \'9\'s at the same time (two or more). A large interest in technics and exact sciences pushes people to studying these sciences, and strong memory fills itself with examples of logic that gives good results on its strengthening. In time the person can grow an additional \'5\' (transition: 99 gives additional 5). Before you push your child to exact sciences, look closely at its Pythagoras Square and make sure that it has energy (22, 2222 or more), the part of character for studying sciences (111 or 1111), and availability of strong memory (99 or 9999 or more).', scale: 'very-weak' },
      { count: 2, label: 'Strong Logic', verbatim: 'People having two or more fives in the psychomatrix become a little boring, as they lay out all their reasoning into many steps, which sometimes begin with a lengthy preamble, which is not pleasant at all, especially for those who don\'t have a 5. When choosing a partner for marriage, it is necessary to look at the difference in the number of digit 5, so that it does not exceed one digit, and it will be better if it is in favor of the man. Such people can plan the future. They foresee almost every mistake, but not always can they secure themselves from them, as very often the decision isn\'t dependent on them. Such people cannot be deceived, as they find out the truth by asking various questions, comparing with answers and finding contradictions. If they are soft and tolerant, even knowing that they are being deceived, they\'ll try not to tell about knowing it, but the repeated lie destroys friendship.', scale: 'norm' },
      { count: 3, label: 'Very Strong Logic, Special Sign', verbatim: 'Strong logic, included in four lines: 2nd column (4, 5, 6) — family maintenance, 2nd row (2, 5, 8) — quality of a family man, carnal diagonal (3, 5, 7) — carnal interests, spiritual diagonal (1, 5, 9) — spiritual life. Having \'555\' noticeably weakens logic, doing its occurrence more like an unexpectedness than as a rule. In this case these figures are almost entirely owned by the line of maintenance of family (for men) or a line of family (for women). Sometimes they can make predictions but as the horizon of vision is very large, the person more often doesn\'t trust himself, making his predictions seem unreal. These people understand mathematics and technics well, but as a rule choose a narrow speciality which is carefully mastered. This quality can be named \'laziness of logic.\' If there is \'5555\' (and more) in this case one can be called \'a prophet\'. Such people are almost never mistaken about their predictions. They can predict destinies.', scale: 'special' }
    ]
  },
  6: {
    digit: 6,
    cellName: 'Labor / Manual Skills',
    intro: 'Number 6 is one of the most controversial and difficult numbers in this numerology system. Digit 6 answers for labor, manual skills, and grounding.',
    lineContext: 'Row 3 (3, 6, 9) — Stability. Column 2 (4, 5, 6) — Labor efficiency.',
    meanings: [
      { count: 0, label: 'Not Inclined to Manual Labor', verbatim: 'If in the Pythagorean Square there is no Number 6, this means that the person is not inclined to manual labor, he doesn\'t like it and can be involved in it only by reason of necessity or having it as a duty. These are people of art and science. Don\'t try to accustom them to manual labor; they will never be good workers. Above all they are inclined to art or science as much as their numbers allow. When there is no Number 6 with 2-none, 4 (or more), 9 and 5-none — better try yourself in dancing (ballet), as such people are very mobile and have a strong body.', scale: 'absent' },
      { count: 1, label: 'Very Weak, Mood-Based Labor', verbatim: 'Having one Number 6 means that the person does manual labor based on his mood — when there is a desire. You should never be indifferent to this quality. Performance is not the main thing as a result. One can perform any work, but it is a question of how good results will be and how happy he will be after finishing it. If you try to force one who has only one \'6\' when he doesn\'t feel like working, you\'ll get a lot of problems as a result. You are going to lose a lot of energy forcing him, and if he has agreed, that doesn\'t mean he starts working at once. After such work the person becomes angry, explosive and offended. For this reason it\'s not good when people with this sign are engaged in monotonous work with a strict schedule — this can lead to breakdowns, desire to change activity, alcoholism, illnesses. But if such a person started doing some work, you should never disturb him or give advice. Your offer to help won\'t be good too, because such people don\'t like teamwork.', scale: 'very-weak' },
      { count: 2, label: 'Labor Given in Norm; Master of Any Craft', verbatim: 'The sign \'66\' gives its owner ability to do everything — he is a master of any craft. Very often such people are great architects. The sign \'66\' can be named as sign of grounding. The matter is that people having this sign don\'t really like reading; they better watch telecasts or do anything but not reading. If somehow you managed to control the sign, then reading takes 1st place, and manual labor has the last. Before you decide what to do with your child who has \'66\' (Numbers 7 are absent — and this is very important), it is necessary to find out its opportunities as the future master. For a craftsman it is necessary to have good energy and good health: 22 (or 2222 and more) and 4 or more. In case the child possesses \'7\' (or more), it can become a master only carefully serving a duty to its parents. I would not advise choosing any profession connected with authority as it makes the person strict and indifferent towards others\' lives.', scale: 'norm' },
      { count: 3, label: 'Number of the Beast - Black Knowledge', verbatim: 'The number of the beast. Satan (number 666) is the image of man and belongs to men. The greater number of \'6\' can be named \'number of the sorcerer or a witch\' as this sign is stronger. You should not be prejudiced, for that sign doesn\'t mean anything as the presence of such numbers as 8 and 7 constrain \'6\'. For example, a person has a set of numbers: 666, 7, 8. Then we can delete two numbers 6 and, accordingly, numbers 7 and 8, there will be left only one \'6\' — the man of moods (such deletion is able only when both numbers 7 and 8 haven\'t made transition; otherwise we deal with the person who, having started the conflict with the parents, has received a new quality: 666, 7, 8 transforms into 6666 and 11 with the loss of 4 or 22, that leads to irritability and authoritativeness). If there is \'6666\', being attached to similar ones (they are four in this case), they create a stable line, and the person starts to gather similar people around himself, and they show their hidden abilities: authority, cruelty, aggression. To protect yourself: if somebody tries to involve you into a conflict, the only way is to leave with an emotion of emptiness and indifference. The simplest way is laughter, which doesn\'t support any fright and doesn\'t bring any irritability or aggression. This is the Grand Chinese technique of leaving in emptiness which chi kung masters used when they met an opponent.', scale: 'special' }
    ]
  },
  7: {
    digit: 7,
    cellName: 'Luck / Talent',
    intro: 'The number 7 in the square of Pythagoras indicates nature\'s interest in revealing its talents. Nature protects him in all unexpected situations and accidents, which is interpreted as \'happiness\'.',
    lineContext: 'Row 1 (1, 4, 7) — Purposefulness. Column 3 (7, 8, 9) — Talent potential. Ascending diagonal (3, 5, 7) — Temperament.',
    meanings: [
      { count: 0, label: 'No Special Talent or Luck from Nature', verbatim: 'Absence of Number 7 in Pythagoras Square means no special talent or luck from nature. The person must rely entirely on their own effort, energy, and learned skills. There is no special protective force from nature guiding unexpected situations.', scale: 'absent' },
      { count: 1, label: 'Very Weak Luck/Talent', verbatim: 'Very weak luck/talent. The protection of nature is barely perceptible. The person has a small task assigned by nature, and must work diligently to fulfill it. The quality needs development and improvement.', scale: 'very-weak' },
      { count: 2, label: 'Luck/Talent Given in Norm', verbatim: 'Luck and talent given in norm. Nature provides a reasonable degree of protection and the person carries a meaningful task. The talent is developed and actively used in life. A good balance for a fulfilled life purpose.', scale: 'norm' },
      { count: 3, label: 'Strong Luck, Nature Protects', verbatim: 'Strong luck. Nature protects the person in unexpected situations and accidents. The task assigned by nature is significant. The person includes this quality urgently and spontaneously — the \'3 digits\' special sign rule applies, meaning luck appears suddenly and unexpectedly rather than as a constant background.', scale: 'special' },
      { count: 4, label: 'Sign of Alarm; Angels', verbatim: '7777 is a sign of alarm. The angels — the ones with four sevens — descended to earth and die already in infancy. People with this sign should be very careful. Four or more sevens indicates an extremely high task set by nature — so high that it carries special dangers. The luck is maximally strong, but dominates and may suppress other qualities.', scale: 'strong' }
    ]
  },
  8: {
    digit: 8,
    cellName: 'Duty / Tolerance / Kindness',
    intro: 'The number 8 is responsible for a sense of duty to relatives (parents, family), tolerance and benevolence — qualities that we should show to parents and loved ones.',
    lineContext: 'Row 2 (2, 5, 8) — Family orientation. Column 3 (7, 8, 9) — Talent potential.',
    meanings: [
      { count: 0, label: 'No Sense of Duty to Relatives', verbatim: 'A person who does not have eights should not be relied on if he is entrusted with something — he is in no hurry to give back. There is no innate sense of duty to relatives. Such a person may be unreliable in family commitments. However, this quality can be developed through conscious effort.', scale: 'absent' },
      { count: 1, label: 'Very Weak Sense of Duty', verbatim: 'The presence of one eight in the psychomatrix begins to strongly influence the character of a person, because there is a possibility of transition of 11 to 8 or, vice versa, of 8 to 11, which is more important. For example, if a person has the character 111 and there is one 8, a new chain of transitions emerges: 111 and 8 transitions to 1 and 88 (kind and tolerant), but with pressure this person explodes and his character transitions into 11111, which is the character of a despot, and a new wave of conflict can take on a very extreme form.', scale: 'very-weak' },
      { count: 2, label: 'Duty/Tolerance Given in Norm; Self-Sacrifice', verbatim: 'For those capable of self-sacrifice. Two eights represent duty and tolerance given in normal measure. These people are less likely to break the bonds of marriage, although this is not excluded. The balance between duty to others and personal boundaries is healthy.', scale: 'norm' },
      { count: 3, label: 'Strong Sense of Duty; Truth Finder', verbatim: 'It is necessary to highlight the characteristic of duty for \'888\'. If you remember, three figures always caused instability of the quality. In this case we deal with the person who is kind, tolerant, remembers parents, but thus becomes the truth finder. This aim can be dangerous if it grows to maximum. Truth finders can even kill without any hesitation for what they think is right. So never play with this part of the person. And for those who got this sign — try to lower your unreasonable demands. Active collectivists who owe everything to everyone.', scale: 'special' },
      { count: 4, label: 'Very Rare; Parapsychic Abilities', verbatim: 'A very rare sign. In the current century, this was only possible for those born in 1988. Children born with this sign had developed abilities and a penchant for studying the exact sciences. Such people often have parapsychic or extrasensory abilities. Four eights dominate and may suppress other qualities.', scale: 'strong' }
    ]
  },
  9: {
    digit: 9,
    cellName: 'Memory / Intellect / Clairvoyance',
    intro: 'The number 9 in the square of Pythagoras is responsible for the mind, memory and clairvoyance of a person.',
    lineContext: 'Row 3 (3, 6, 9) — Stability. Column 3 (7, 8, 9) — Talent potential. Spiritual diagonal (1, 5, 9) — Spiritual life.',
    meanings: [
      { count: 0, label: 'No Memory / Intellect', verbatim: 'There are no nines — weak level of mental ability.', scale: 'absent' },
      { count: 1, label: 'Very Weak Memory', verbatim: 'Very weak memory. The channel of communication with the subtle world is essentially closed.', scale: 'very-weak' },
      { count: 2, label: 'Memory / Intellect in Norm', verbatim: 'Having \'99\' in the square of Pythagoras would add another \'5\'.', scale: 'norm' },
      { count: 3, label: 'Strong Memory - Very Smart', verbatim: 'Strong memory, mind; very smart.', scale: 'special' },
      { count: 4, label: 'Erudite but Tough, Merciless', verbatim: 'People are erudite, but tough, merciless. possess what can only be called clairvoyance.', scale: 'strong' }
    ]
  }
};

export const PSYCHOMATRIX_LINE_MEANINGS: Record<string, string> = {
  row_1: 'Determines the presence of purposefulness as a quality of a person\'s character. The value of purposefulness as a personal characteristic is difficult to overestimate, since it is this parameter that depends on the correspondence of our desires and capabilities. After all, it is not a matter of financial well-being, but of the strength of desire, the general mood to achieve the goal.',
  row_2: 'Shows how strong a person\'s desire to create a family is, the desire to build a relationship system based on close interaction with the opposite sex. With a clear understanding of the importance of such a step. After all, the family is not just legalized sexual cohabitation, as one German philosopher exotically described, but a complex system that includes reproductive, economic, psychological, educational, creative functions and a large share of responsibility for loved ones.',
  row_3: 'The indicators of the stability of a person\'s character. That is, they describe the balance between usual habits and certain thinking, on the one hand, and the desire for change, on the other. Thus, the value of personal stability is the answer to the question of the reliability of this person in a particular situation.',
  col_1: 'A numerical indicator of the level of self-esteem. Hardly any other parameter is more important in the context of a person\'s desire to realize his own potential. But if low self-esteem is only indecisiveness, self-doubt, and therefore eternal circling in circles, then unjustifiably overestimated capabilities can lead to fatal mistakes and cruel disappointments.',
  col_2: 'Describe a person\'s physical health, level of endurance, degree of inclination to work and possession of practical skills, as well as the ability to think logically. Thus, the second column serves as an indicator of labor efficiency as a qualitative characteristic of a person\'s ability to achieve a certain social status, to ensure his well-being and the well-being of his family.',
  col_3: 'Contains information about a person\'s talent. However, \'talents should be helped...\', people say, and the vast majority of people live their lives without ever discovering their talent, often without even suspecting its existence. Therefore, we can only talk about potential, the realization of which depends on all other personal qualities: diligence, purposefulness, sense of self-worth, etc.',
  diag_spirit: 'Spiritual diagonal. Indicates the level of a person\'s spirituality. Do not confuse spirituality with religiosity. This quality has nothing to do with religious denominations, and it is completely alien to the exaltation of zealots of faith. The degree of unity of a person with Nature (Nus, God) is determined by firmness of convictions and clarity of perception, balanced principles and willingness to compromise, to accept a different perspective.',
  diag_carnal: 'Carnal diagonal. An indicator of a person\'s temperament in terms of intimate, sexual relationships. And no matter what supporters of unions built on mutual respect and material well-being say, it is the degree of matching of temperaments that often becomes the main factor that determines the duration and quality of a marriage.'
};

export const PSYCHOMATRIX_TRANSITIONS: ComplementaryInsight[] = [
  {
    digits: [1, 8],
    title: 'Character ↔ Duty Transition',
    insight: 'Character (1) and Duty (8) are in constant dialogue. 111 alongside a single 8 can transition to a soft, tolerant mode (1 and 88). But under external pressure, it can instantly reverse into 11111 — the despot.',
    type: 'transition'
  },
  {
    digits: [1, 1],
    title: 'The 11-to-8 Transformation',
    insight: "In times of extreme crisis, a person can 'sacrifice' two 1s (Ego) to create an 8 (Tolerance/Protection). This is how people survive impossible odds—by letting go of 'themselves.'",
    type: 'transition'
  },
  {
    digits: [6, 6, 6],
    title: 'The 666 Warning (Master Craftsman)',
    insight: 'Having three 6s is the "Sign of the Master Craftsman," but it carries the risk of "selling the soul to the craft." You must consciously cultivate 7s (Luck/God) to balance the heavy Earth-vibration of the 6s.',
    type: 'tension'
  },
  {
    digits: [5],
    title: 'The Empty 5 Bridge',
    insight: 'The 5 is the "Heart of the Matrix." If the 5 is empty, the two diagonals (Spirit and Flesh) don\'t communicate. The person lives two lives: one purely intellectual/spiritual and one purely physical, with no bridge between them.',
    type: 'tension'
  },
  {
    digits: [2, 2, 2, 2],
    title: 'The 2222 Mystery (Natural Psychic)',
    insight: 'A person with four 2s is a "Natural Psychic." They don\'t think; they feel the frequency of the room. They must learn to "shield" their energy, or they will take on the physical illnesses of everyone they meet.',
    type: 'synergy'
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
  const fourth = Math.abs(third) < 10 ? Math.abs(third) : String(Math.abs(third)).split('').map(Number).reduce((a, b) => a + b, 0);
  return { first, second, third, fourth };
}

export function calculatePsychomatrix(day: number, month: number, year: number): PsychomatrixResult {
  const { first, second, third, fourth } = calculateWorkingNumbers(day, month, year);
  const birthDigits = `${day}${month}${year}`.split('').map(Number);
  const workingDigits = [...String(first).split('').map(Number), ...String(second).split('').map(Number), ...String(Math.abs(third)).split('').map(Number), ...String(fourth).split('').map(Number)];
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
