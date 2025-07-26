
// src/lib/numerology.ts
import type { AstroInsightInput } from '@/lib/astrology';

// --- HELPER FUNCTIONS ---

const reduceToSingleDigit = (n: number): number => {
  let num = n;
  while (num > 9) {
    if ([11, 22, 33].includes(num)) break;
    num = String(num)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
};

// --- CORE NUMBER CALCULATIONS ---

export const calculatePsyche = (day: number): number => {
  return reduceToSingleDigit(day);
};

export const calculateDestiny = (day: number, month: number, year: number): number => {
  const fullDateStr = String(day) + String(month) + String(year);
  const sum = fullDateStr
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return reduceToSingleDigit(sum);
};

export const calculateKua = (year: number, gender: string): number => {
  const yearSum = String(year)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  const reducedYearSum = reduceToSingleDigit(yearSum);
  
  let kuaResult: number;

  if (year < 2000) {
    kuaResult = gender.toLowerCase() === 'male' ? 11 - reducedYearSum : reducedYearSum + 4;
  } else {
    kuaResult = gender.toLowerCase() === 'male' ? 9 - reducedYearSum : reducedYearSum + 6;
  }

  let finalKua = reduceToSingleDigit(kuaResult);
  
  if (finalKua === 5) {
    return gender.toLowerCase() === 'male' ? 2 : 8;
  }
  
  return finalKua;
};

// --- DATA INTERFACES ---

export interface NumerologyData {
  psycheNum: number;
  destinyNum: number;
  compoundNum: number;
  compoundMeaning: string;
  reducedCompoundNum: number | null;
  reducedCompoundMeaning: string | null;
  karmicFateNum: number | null;
  karmicFateMeaning: string | null;
  kuaNum: number;
  kuaAttributes: {
    element: string;
    colors: string;
    season: string;
  };
  auspiciousDirections: { [key: string]: string };
  loShuGrid: (string | null)[][];
  numberCounts: { [key: number]: number };
  arrowsOfStrength: { name: string; description: string }[];
  arrowsOfWeakness: { name: string; description: string }[];
}

// --- MAIN GRID GENERATION FUNCTION ---

export const generateLoShuData = (input: AstroInsightInput): NumerologyData => {
  const { day, month, year, gender } = input;

  const psycheNum = calculatePsyche(day);
  const destinyNum = calculateDestiny(day, month, year);
  const kuaNum = calculateKua(year, gender);

  const birthDigitsRaw = (String(day) + String(month) + String(year)).split('').map(Number);
  
  const allDigitsForGrid = [
    ...String(day).split('').map(Number),
    ...String(month).split('').map(Number),
    ...String(year).split('').map(Number),
    psycheNum,
    destinyNum,
    kuaNum,
  ].filter(d => d !== 0);

  const numberCounts: { [key: number]: number } = {};
  for (const digit of allDigitsForGrid) {
      numberCounts[digit] = (numberCounts[digit] || 0) + 1;
  }
  
  const gridContent: { [key: string]: string } = {};
  for (let i = 1; i <= 9; i++) {
    const digitStr = String(i);
    if (numberCounts[i]) {
      gridContent[digitStr] = digitStr.repeat(numberCounts[i]);
    }
  }

  const loShuGrid = [
    [gridContent['4'] || null, gridContent['9'] || null, gridContent['2'] || null],
    [gridContent['3'] || null, gridContent['5'] || null, gridContent['7'] || null],
    [gridContent['8'] || null, gridContent['1'] || null, gridContent['6'] || null],
  ];

  const compoundNum = birthDigitsRaw.reduce((a, b) => a + b, 0);
  const compoundMeaning = COMPOUND_NUMBER_MEANINGS[compoundNum as keyof typeof COMPOUND_NUMBER_MEANINGS] || `No specific meaning for this compound number (${compoundNum}).`;

  let reducedCompoundNum: number | null = null;
  let reducedCompoundMeaning: string | null = null;
  if (compoundNum >= 10) {
      const reducedSum = String(compoundNum).split('').map(Number).reduce((a, b) => a + b, 0);
      if(reducedSum >=10){
        reducedCompoundNum = reducedSum;
        reducedCompoundMeaning = COMPOUND_NUMBER_MEANINGS[reducedSum as keyof typeof COMPOUND_NUMBER_MEANINGS] || `No specific meaning for Inner Essence number ${reducedSum}.`;
      }
  }

  const karmicInitialSum = day + month + year;
  const karmicFateNum = reduceToSingleDigit(karmicInitialSum);
  const karmicFateMeaning = KARMIC_FATE_MEANINGS[karmicFateNum as keyof typeof KARMIC_FATE_MEANINGS] || COMPOUND_NUMBER_MEANINGS[karmicFateNum as keyof typeof COMPOUND_NUMBER_MEANINGS] || null;

  const calculateArrows = (grid: (string | null)[][]) => {
    const strength = [];
    const weakness = [];
    
    const has = (num: number) => grid.flat().some(cell => cell?.includes(String(num)) ?? false);

    const arrowDefs = {
        strength: [
            { name: "Arrow of Planning", line: [4, 3, 8], description: "This indicates the Arrow of Planning & Proper Execution. It gives you shrewdness, cunningness, and intelligence. Your nature can be unethical, like a 'Dirty Player' who doesn't go by the rules. You possess a high degree of intelligence and can be a politician." },
            { name: "Arrow of Willpower", line: [9, 5, 1], description: "This is the Arrow of Success. You exhibit stubbornness & persistence in your behavior. This behavior leads you towards being victorious in life. You possess a high level of determination and are not hesitant in expressing your opinion about everything." },
            { name: "Arrow of Action / Outlook", line: [2, 7, 6], description: "This signifies a life of activity and a particular outlook on the world. You are a person of practical engagement and action." },
            { name: "Arrow of Intellect", line: [4, 9, 2], description: "Also known as the Brain / Mental plane. You are a thinker with a powerful intellect, an orderly and tidy mind, and excellent memory. You are not easily fooled and are considered a very brainy person." },
            { name: "Arrow of Spirituality", line: [3, 5, 7], description: "The Arrow of Emotional Harmony, Spiritual Ethics & Values. It leads to contentment, calmness & inner peace after 30-40 years of age. You may come to the field of spirituality after seeing too much trouble in life." },
            { name: "Arrow of Prosperity", line: [8, 1, 6], description: "The Action / Practical plane. It indicates materialistic or commercial success and prosperity with practicality. You are always interested in superficial life & success and are never inclined towards a higher purpose." },
            { name: "Arrow of Emotional Balance", line: [4, 5, 6], description: "You are humanitarian, helping & compassionate by nature. You are psychic, intuitive, sensitive, and caring. You easily understand the demands of people around you and are quite gentle and generous." },
            { name: "Arrow of Determination", line: [2, 5, 8], description: "This arrow signifies a strong will and determination. It represents your resolve and powerful drive to see things through to the end." },
        ],
        weakness: [
            { name: "Arrow of Confusion", line: [4, 9, 2], description: "Without numbers on the mental plane, you may struggle with mental clarity, be slow to grasp concepts, and need to work harder on intellectual tasks." },
            { name: "Arrow of Scepticism", line: [3, 5, 7], description: "You are a born skeptic, demanding proof for everything and not inclined towards faith or intuition. You can be insensitive to the feelings of others." },
            { name: "Arrow of Frustration", line: [8, 1, 6], description: "You may have many great ideas but lack the practical ability to bring them to fruition, leading to a sense of frustration." },
            { name: "Arrow of Indecision", line: [4, 3, 8], description: "You may lack the ability to think things through methodically, leading to a tendency to hesitate and be indecisive when faced with important choices." },
            { name: "Arrow of Suspicion / Poor Memory", line: [9, 5, 1], description: "You may lack determination and willpower, and you might also have a tendency to be forgetful or to doubt the intentions of others." },
            { name: "Arrow of Apathy", line: [2, 7, 6], description: "You may lack the physical drive to put plans into action, preferring to remain passive rather than actively engaging with the world." },
            { name: "Arrow of Disappointment", line: [4, 5, 6], description: "You may experience frequent setbacks and feel that life often lets you down, fostering a pessimistic outlook." },
            { name: "Arrow of Doubt", line: [2, 5, 8], description: "You may suffer from a lack of self-belief and constantly question your own abilities and decisions, which can hold you back." },
        ]
    };
    
    for (const arrow of arrowDefs.strength) {
        if (arrow.line.every(n => has(n))) {
            strength.push({ name: arrow.name, description: arrow.description });
        }
    }
    
    for (const arrow of arrowDefs.weakness) {
        if (arrow.line.every(n => !has(n))) {
            weakness.push({ name: arrow.name, description: arrow.description });
        }
    }

    return { strength, weakness };
  }

  const arrows = calculateArrows(loShuGrid);

  const kuaAttributes = KUA_ATTRIBUTES[kuaNum] || (gender.toLowerCase() === 'male' ? KUA_ATTRIBUTES[5].male : KUA_ATTRIBUTES[5].female) || {};
  const auspiciousDirections = KUA_DIRECTIONS[kuaNum] || (gender.toLowerCase() === 'male' ? KUA_DIRECTIONS[5].male : KUA_DIRECTIONS[5].female) || {};
  
  return {
    psycheNum,
    destinyNum,
    kuaNum,
    loShuGrid,
    numberCounts,
    compoundNum,
    compoundMeaning,
    reducedCompoundNum,
    reducedCompoundMeaning,
    karmicFateNum,
    karmicFateMeaning,
    arrowsOfStrength: arrows.strength,
    arrowsOfWeakness: arrows.weakness,
    kuaAttributes,
    auspiciousDirections,
  };
};


export const KUA_DIRECTIONS: { [key: number]: any } = {
  1: {
    Success: 'SE',
    Health: 'E',
    Family: 'S',
    'Personal Growth': 'N',
  },
  2: {
    Success: 'NE',
    Health: 'W',
    Family: 'NW',
    'Personal Growth': 'SW',
  },
  3: {
    Success: 'S',
    Health: 'N',
    Family: 'SE',
    'Personal Growth': 'E', 
  },
  4: {
    Success: 'N',
    Health: 'S',
    Family: 'E',
    'Personal Growth': 'SE', 
  },
  5: {
    male: { 
      Success: 'NE',
      Health: 'W',
      Family: 'NW',
      'Personal Growth': 'SW',
    },
    female: { 
      Success: 'SW',
      Health: 'NW',
      Family: 'W',
      'Personal Growth': 'NE',
    },
  },
  6: {
    Success: 'W', 
    Health: 'SW',
    Family: 'NE',
    'Personal Growth': 'NW',
  },
  7: {
    Success: 'NW',
    Health: 'SW',
    Family: 'NE',
    'Personal Growth': 'W',
  },
  8: {
    Success: 'SW',
    Health: 'NW',
    Family: 'W',
    'Personal Growth': 'NE',
  },
  9: {
    Success: 'E',
    Health: 'SE',
    Family: 'N',
    'Personal Growth': 'S',
  },
};

export const KUA_ATTRIBUTES: { [key: number]: any } = {
  1: { element: 'Water', colors: 'Blue, Black, Grey', season: 'Winter' },
  2: { element: 'Earth', colors: 'Red, Pink, Maroon', season: 'Late Summer' },
  3: { element: 'Wood', colors: 'Green, Brown', season: 'Spring' },
  4: { element: 'Wood', colors: 'Green, Brown', season: 'Spring' },
  5: { 
      male: { element: 'Earth', colors: 'Red, Pink, Maroon', season: 'Late Summer' },
      female: { element: 'Earth', colors: 'Yellow, Beige, Brown', season: 'Late Summer' }
  },
  6: { element: 'Metal', colors: 'White, Gold, Silver', season: 'Autumn' },
  7: { element: 'Metal', colors: 'White, Gold, Silver', season: 'Autumn' },
  8: { element: 'Earth', colors: 'Yellow, Beige, Brown', season: 'Late Summer' },
  9: { element: 'Fire', colors: 'Red, Purple, Orange', season: 'Summer' },
};

export const NUMBER_MEANINGS: { [key: number]: { title: string; description: string } } = {
    1: { title: "Leadership & Individuality", description: "You face difficulty in communication & expression (verbal). You can communicate by other means, like art or writing, but you never fully soak yourself into anything, touching the crust but not the core. You find it hard to understand others' points of view but have a good financial level if 6 & 8 are present." },
    2: { title: "Intuition & Partnership", description: "You are caring & intelligent by nature and are easily hurt by others. You easily understand & gauge people just by looking at them. With only a single 2, you have an average mindset, but if other numbers on the mental plane (4 and 9) are present, you have high intellect. You do well in philosophical, judicial, and literary fields." },
    3: { title: "Creativity & Expression", description: "You experience STRESS & HURT with only one 3. You have a good creative brain with an excellent memory. You are down-to-earth with a positive mindset, inspiring others with your honesty. You are totally focused on your growth but find it DIFFICULT TO DEAL WITH COMPETITIONS." },
    4: { title: "Structure & Stability", description: "You are good at physical hard work and are an intelligent person with a logical & rational mind. You perform well in tasks done by hand and are a good organizer of others. You are imaginative but also impatient by nature. You connect deeply with music and the arts and are very careful in your decisions." },
    5: { title: "Freedom & Change", description: "You have well-balanced emotional sensitivity. You are concerned, supportive, and kind-hearted, often motivating and inspiring others. If your chart is supported by the numbers 3 & 7, it makes you wise in your decision-making." },
    6: { title: "Harmony & Home", description: "You show love, regard, and care for your family and loved ones. You are a decent parent and enjoy your home duties. You can be insecure and worried about being left alone in life. You are a lucky person, though sometimes with narrow-mindedness, and are family-oriented." },
    7: { title: "Spirituality & Analysis", description: "You learn the lessons of your life through relational loss, loss of belongings, or at the cost of your health. These losses incline you towards the spiritual field. If supported by 3 & 5, you start a quest for the ultimate reality of life. Your career can be in a spiritual or humanitarian field." },
    8: { title: "Ambition & Material Success", description: "You are systematic, reliable, and good with finer details. You are a good task initiator but a bad task completer. Your constantly active mind leads to restlessness and a daring, mystery-resolving attitude. With the support of 1 & 6, you can have good materialistic success." },
    9: { title: "Humanitarianism & Compassion", description: "You are ambitious, determined, and have a very strong wish for self-improvement. If your chart is supported by the numbers 4 & 2, you can be humorous, intellectual, affluent, prosperous, and spiritual. If there is no support from 4 & 2, there will be a tussle in all areas of your life." },
};

export const REPEATED_NUMBER_MEANINGS: { [key: number]: { [key: number]: string } } = {
    1: {
        2: "You are good in Expression & Communication. You have an impartial & balanced outlook towards everyone in life. Your way of living life is very neutral. You understand others' point of view as well as your own. You are good in financial matters. This is a perfect placement of this pair in a chart.",
        3: "You are good in Expression, very sensitive & caring. This can indicate a number of extra-marital relations (the concept of 'Pati, Patni & Wo'). Sometimes you are too much talkative and never stop talking, but at other times you can be very quiet & introvert, as you have both extremes in your behavior. You keep on changing your behavior according to time & situations. You will have materialistic growth if other two numbers are supporting. Generally, you are happy and a good entertainer in life. You love going out of the house.",
        4: "You have a blockage at the Vishuddha or Throat chakra, hence it is extremely difficult for you to open your heart out verbally. You are very sensitive & caring by nature but are mostly misunderstood. You are always on your toes, anxious, and overly energetic, taking rest or getting relaxed very rarely; you are always hyperactive. Only materialistic desires will be found & you have more focus on wealth accumulation than anything else in your life.",
        5: "You face too many difficulties in expressing your emotions out verbally. You are a very much misunderstood personality. You direct your energy of expression into other forms, like writing, painting, dancing, art, sculpture, and creativity. You may have a tendency to over-indulge in alcoholism, drugs, food, many relationships, or any other types of addictions.",
    },
    2: {
        2: "You are high in Intelligence, Sensitivity & have a double Intuition Level (as 2 appears 2 times). You have an innate ability to get into someone's Mind & Soul. You can easily scan the Mind & Soul of someone & find out about their feelings, motive & purpose. If you only have two 2s in the plane without 4 & 9, it makes you highly skeptical & very negative. This also makes you deprived of positive energy and enthusiasm; the level of Chi or Life Driving Force in you is very weak, which will eventually affect both your physical & mental health. If 4 & 9 are present along with 2, then you will be good at memorizing things & highly intellectual.",
        3: "Having more 2s in your chart makes you more intuitive & sensitive. But sensitivity & intuitiveness are good up to a limit; after a point, these two properties can make a person maniacal. You become too vulnerable or defenseless & are hence easily hurt & affected by others. As a result, you prefer to be alone & aloof, away from the public, to protect yourself from being hurt. You lock yourself in your own mental world as you don't find the people around you in the physical world capable enough to understand you. You become an introvert regardless of your basic behavior and tendencies.",
        4: "Your patience level is very low. You have a tendency to overreact over issues which are irrelevant & meaningless. Extreme behavioral sensitivity is seen which can lead to self-hurting behavior.",
        5: "This is a rarely found set in a grid. If you have 5, 6, or more 2s with no support from 4 & 9, then the condition will be unfortunate, making your life very difficult to live and adjust to. Too much arrogance in your behavior is seen, along with sarcasm & rudeness. Self-doubt & lack of confidence are also seen. In this century, people can have six 2s in their chart (e.g., 22 Feb 2022).",
    },
    3: {
        2: "Intelligence, sensitiveness & intuitiveness are the qualities associated with you. You have a balanced mentality & strong personality. You have good compatibility & an adjusting nature, hence you emerge as a good friend. You can easily sense the motive of other people around you. You develop a concept of life & evolve spiritually with faith & devotion when there is support of 5 & 7. You have an active, imaginative & very creative brain. You enjoy breaking rules or contracts & are strange or unconventional in nature. You can emerge as a path breaker or trend maker. Your power of creativity makes you a trendsetter. You know very well how to control your innovative mind and have the power of projecting expression through words, so you excel professionally as a writer, artist, actor, etc.",
        3: "You live in an IMAGINARY BUBBLE OR DAYDREAMING STATE. You often find it hard to relate with others and are not a good listener. You can appear self-engaged & isolated. You have brilliant mental ability, but you spend your life in the world of dreams. You can be quarrelsome & unimportant at times. You have potential for clairvoyance & spiritualism.",
        4: "You can be unrealistic, fearful & over-imaginative (an illusionist). These qualities make it hard for you to function well in everyday life. This combination is rare to find in charts. You are sensitive, imaginative & intuitive in nature, a daydreamer who loves to stick in that world. High intelligence, high intellect, high spirituality & high intuitive abilities are seen if 3 is supported by 5 & 7 in this plane. You can also be intolerant, irresponsible & thoughtless. Other supportive numbers are not of much help in the case of too many 3s."
    },
    4: {
        2: "You have a tendency for OVERINDULGENCE in physical & materialistic actions at the cost of other deeds. You have good organizing skills. You are a good task initiator & fantastic as a completer. You are reliable, precise & organized. You are good in art & craft by hand. You can also be rigid, stubborn, have low tolerance power, and be judgmental & inflexible. You possess a high level of intelligence, pride because of that intelligence, and a superiority complex.",
        3: "You are extremely stubborn & rigid, and find it hard to connect with spiritual or philosophical people. You have a non-adjusting nature & behavior, and are hard to get along with. You have a complete attention deficit & are majorly governed by or involved in physical activities. You are planned, self-restrained, hard-working & thorough. You are easily predictable, so your capabilities are evident to others. You can be unaware of your inborn talents & have a non-accepting attitude towards them, which can lead to a wastage of time in the wrong profession or career.",
        4: "You are extremely stubborn & rigid, and find it hard to connect with spiritual or philosophical people. You have a non-adjusting nature & behavior, and are hard to get along with. You have a complete attention deficit & are majorly governed by or involved in physical activities. You are planned, self-restrained, hard-working & thorough. You are easily predictable, so your capabilities are evident to others. You can be unaware of your inborn talents & have a non-accepting attitude towards them, which can lead to a wastage of time in the wrong profession or career."
    },
    5: {
        2: "You can be uncontrollable, and governing & dealing with you is challenging. You are passionate, strong-minded, lively, impatient & flexible. You are a risk-taker, adventurous, self-confident, determined & a show-off. You are filled with a high level of determination & eagerness. You can have frequent emotional outbursts which later lead to repentance. You can be a problem creator at work & home. You also show laziness in behavior & are sensual by nature.",
        3: "You can be bossy, uncontrollable, and tough to deal with. You may engage in brainless talking which in turn can hurt you & your family members. You are filled with too much energy & joy, but you need to have control over it. You have too much of a desire for enjoyment, exploration, enthusiasm, and a persistent want for change, and you take avoidable risks. Four or five 5s is a very dangerous, accidental combination. You need to slow down in your approach & lifestyle; you should talk through your head, not your hat. Brainless talking can hurt others, willingly or unwillingly.",
        4: "You can be bossy, uncontrollable, and tough to deal with. You may engage in brainless talking which in turn can hurt you & your family members. You are filled with too much energy & joy, but you need to have control over it. You have too much of a desire for enjoyment, exploration, enthusiasm, and a persistent want for change, and you take avoidable risks. Four or five 5s is a very dangerous, accidental combination. You need to slow down in your approach & lifestyle; you should talk through your head, not your hat. Brainless talking can hurt others, willingly or unwillingly.",
        5: "You can be bossy, uncontrollable, and tough to deal with. You may engage in brainless talking which in turn can hurt you & your family members. You are filled with too much energy & joy, but you need to have control over it. You have too much of a desire for enjoyment, exploration, enthusiasm, and a persistent want for change, and you take avoidable risks. Four or five 5s is a very dangerous, accidental combination. You need to slow down in your approach & lifestyle; you should talk through your head, not your hat. Brainless talking can hurt others, willingly or unwillingly."
    },
    6: {
        2: "You are highly creative, but lack self-confidence & believe less in your work & your abilities. You take unnecessary tension for your family & family members, which makes your energy drained/exhausted & hence you feel tired most of the time. You are too stressed all the time because of your thinking style. You are overprotective by nature, hence you keep interfering in the lives of your family members (especially towards your kids). You can provide an obstruction to your children in becoming self-dependent. Your life is filled with creativity, activeness & beauty. You require constant support & encouragement from your family & friends.",
        3: "You exhibit possession & overly protective behavior for your progeny, friends, family & relatives. You are artistic & creative, which helps vent your frustrations, expression & emotions. You need constant encouragement & a push as you are more prone towards the stressful & negative aspects of life. More 6s make you creative, but energy channelization is difficult for you (especially in the early phase of your life). You are very touchy & over-sensitive, hence escapism can be seen in your behavior. Financial prosperity is seen when accompanied by 8 & 1 (and less stress is seen).",
        4: "You exhibit possession & overly protective behavior for your progeny, friends, family & relatives. You are artistic & creative, which helps vent your frustrations, expression & emotions. You need constant encouragement & a push as you are more prone towards the stressful & negative aspects of life. More 6s make you creative, but energy channelization is difficult for you (especially in the early phase of your life). You are very touchy & over-sensitive, hence escapism can be seen in your behavior. Financial prosperity is seen when accompanied by 8 & 1 (and less stress is seen).",
        5: "You exhibit possession & overly protective behavior for your progeny, friends, family & relatives. You are artistic & creative, which helps vent your frustrations, expression & emotions. You need constant encouragement & a push as you are more prone towards the stressful & negative aspects of life. More 6s make you creative, but energy channelization is difficult for you (especially in the early phase of your life). You are very touchy & over-sensitive, hence escapism can be seen in your behavior. Financial prosperity is seen when accompanied by 8 & 1 (and less stress is seen)."
    },
    7: {
        2: "You gain your knowledge & wisdom at the cost of your loved ones, your health, or your monetary losses. This push will eventually take you to the path of occultism, spirituality & meditation. You have a technical (IT & Computers) & analytical (Mathematical & Reasoning) brain. You are good at minute, odd & baseless criticism. You are spiritual but have a tendency for show-off & bragging by nature. You have the potential to bring finance & prosperity into your life.",
        3: "Your life is filled with disappointments, setbacks & sadness. Your love life, well-being, along with finance & prosperity are affected. These affects & complications make you a stronger human & help you in your growth & development. You can be a fortunate, ideal citizen of a state & work hard in goal accomplishment. If 4, 5 & 6 are missing in your chart then you can be unfortunate & disheartened due to the name, fame & beliefs you have earned in your life.",
        4: "Your life is filled with disappointments, setbacks & sadness. Your love life, well-being, along with finance & prosperity are affected. These affects & complications make you a stronger human & help you in your growth & development. You can be a fortunate, ideal citizen of a state & work hard in goal accomplishment. If 4, 5 & 6 are missing in your chart then you can be unfortunate & disheartened due to the name, fame & beliefs you have earned in your life.",
        5: "Your life is filled with disappointments, setbacks & sadness. Your love life, well-being, along with finance & prosperity are affected. These affects & complications make you a stronger human & help you in your growth & development. You can be a fortunate, ideal citizen of a state & work hard in goal accomplishment. If 4, 5 & 6 are missing in your chart then you can be unfortunate & disheartened due to the name, fame & beliefs you have earned in your life."
    },
    8: {
        2: "You are good in business & financial matters. You are entertaining, intellectual, clever & shrewd. You are good in analysis, evaluation & taking advantage of any opportunity. You have keen observation & are thorough in your approach. You love to have experiences by yourself and never count upon others' stories. You are very rigid & inflexible in your approach & the decisions you make.",
        3: "You are hardworking, inflexible, harsh & agitated all the time. You bring variety, change & variable thinking into your life. Your progress is slow or you see no progress in your young life; real progress takes place by the age of 40. Your complete inclination is towards materialism, but you should understand the priorities of life & the definition of real happiness. If you want something, you desire to occupy that thing, and until then, you roam around pointless, directionless & aimless.",
        4: "You are hardworking, inflexible, harsh & agitated all the time. You bring variety, change & variable thinking into your life. Your progress is slow or you see no progress in your young life; real progress takes place by the age of 40. Your complete inclination is towards materialism, but you should understand the priorities of life & the definition of real happiness. If you want something, you desire to occupy that thing, and until then, you roam around pointless, directionless & aimless.",
        5: "You are hardworking, inflexible, harsh & agitated all the time. You bring variety, change & variable thinking into your life. Your progress is slow or you see no progress in your young life; real progress takes place by the age of 40. Your complete inclination is towards materialism, but you should understand the priorities of life & the definition of real happiness. If you want something, you desire to occupy that thing, and until then, you roam around pointless, directionless & aimless."
    },
    9: {
        2: "You have a 'Master Number' impact, but the Master Number activation is required. You are idealistic & brainy in your life. You love to learn about everything around you. You can do too much criticism of others. You have a sympathetic attitude & you love to work in fields in which much use of the brain is required. It is necessary for you to get along with people of all levels of society.",
        3: "You are idealistic, smart, & intellectual in your life & can do well in education, but multiple 9s make your survival in the world difficult. You can have arrogance & a bad temper. Multiple 9s give you the power of escapism & life in your own fairytale world. You have a tendency to stretch unrequired topics (तित का ताइ करना), and you need to control this nature of yourself. You are joyful & progressive when you handle your life & nature with care. You have an inclination for becoming unsatisfied & unhappy. You can do good for the world if you understand the power you are blessed with & learn how to channelize that too.",
        4: "You are idealistic, smart, & intellectual in your life & can do well in education, but multiple 9s make your survival in the world difficult. You can have arrogance & a bad temper. Multiple 9s give you the power of escapism & life in your own fairytale world. You have a tendency to stretch unrequired topics (तित का ताइ करना), and you need to control this nature of yourself. You are joyful & progressive when you handle their life & nature with care. You have an inclination for becoming unsatisfied & unhappy. You can do good for the world if you understand the power you are blessed with & learn how to channelize that too.",
        5: "You are idealistic, smart, & intellectual in your life & can do well in education, but multiple 9s make your survival in the world difficult. You can have arrogance & a bad temper. Multiple 9s give you the power of escapism & life in your own fairytale world. You have a tendency to stretch unrequired topics (तित का ताइ करना), and you need to control this nature of yourself. You are joyful & progressive when you handle their life & nature with care. You have an inclination for becoming unsatisfied & unhappy. You can do good for the world if you understand the power you are blessed with & learn how to channelize that too."
    }
};

export const COMPOUND_NUMBER_MEANINGS: { [key: number]: string } = {
  10: `Number 10 is symbolized by Isis and Osiris, representing a cycle of rise and fall determined by personal choices. The name associated with this number will gain recognition, either for positive or negative reasons, depending on the actions taken. It evokes extreme responses—love or hate, respect or fear—with no middle ground between honor and dishonor. Every outcome is self-determined. Number 10 embodies Love and Light, enabling the creation of all that can be imagined, with the principle: 'Image it, and it shall be. Ordain it, and it will materialize.' The power to manifest creative concepts is inherent, but it must be wielded wisely, as it also holds the potential for destruction. Self-discipline and infinite compassion are essential to avoid the tragedy of misuse. Discipline must precede dominion. Some individuals with the 10 compound number fail to recognize their potential, leading to feelings of frustration and unfulfillment. This may cause them to adopt a proud or arrogant demeanor to mask unwarranted feelings of inferiority.`,
  11: `Number 11 is depicted as "A Lion Muzzled — A Clenched Fist," symbolizing hidden trials and treachery from others. It represents two individuals, either of the same or opposite sex, or two opposing situations, where compatibility is lacking, and a third force creates interference. This interference, whether a person or an idea, must be overcome to avoid frustration from unachieved goals. The illusion of separation fuels these difficulties, requiring the unification of divided objectives. The third force may manifest as a refusal to see another’s perspective, acting as a barrier to harmony. Identifying the source of this separation and seeking compromise is essential. Sometimes, internal conflicting desires are reflected as in a mirror, standing apart but needing to unite for fulfillment while retaining individuality. Those who possess the 11 compound number have strong intuition and are inspired by lofty ideals. A dynamic energy radiates from their personal magnetism, making them masters of most situations. Their executive abilities are prominent, and their minds are creative, original, and alert. They strive to protect those they love and enjoy the role of provider. They are modest and prefer not to flaunt their talents and abilities. They are drawn to the subtler aspects of life. They enjoy detective stories and mystical philosophy. They possess a strong magnetism that attracts others, but they are cautious about sharing their affections. Through mental and verbal influence, they can persuade others to act in ways that align with their desires. They have significant latent psychic abilities, which they can develop to express clairvoyance, trance, mediumship, or psychometry, thanks to the Moon’s influence. They should learn to engage in lighter mental and spiritual pleasures to relax. Excessive focus can lead to depression, which they must strive to avoid. They are typically successful in life and love, achieving honor, position, and authority. They are loyal to their friends and exhibit a noble disposition. They should remain vigilant against secret enemies.`,
  12: `Number 12 is known as "The Sacrifice — The Victim," indicating a tendency to be sacrificed for the plans or intrigues of others. It warns of the need to stay alert in every situation and to be cautious of false flattery from those seeking personal gain. Those with this number should be wary of offers of high positions and carefully examine the motives behind them. While duplicity is not always present, being forewarned is wise. This number brings mental anxiety due to the necessity of sacrificing personal goals for the ambitions of others. A secondary interpretation views the number 1 as the teacher (whether a person or life itself) and the number 2 as the submissive student. Severe emotional stress or mental anguish can lead to amnesia or forgetfulness of past lessons. Number 12 represents the educational process on all levels, requiring the submission of will and sacrifices to achieve knowledge and wisdom, both spiritually and intellectually. When the intellect is surrendered to feelings, the mind finds illumination and answers. Looking within for solutions and prioritizing education will end suffering and lead to success.`,
  13: `Number 13 is associated with "Regeneration — Change" and is not considered unlucky, despite common beliefs. The ancients believed that understanding the use of 13 grants power and dominion. Symbolized as a skeleton with a scythe reaping men in a field of new grass, with young faces emerging from the ground, it represents upheaval to break new ground. It is linked to power, which, if used selfishly, brings self-destruction. There is a warning of the unknown and unexpected. Adapting gracefully to change harnesses the strength of the 13 vibration, reducing its potential for negativity. It is associated with genius, exploration, breaking orthodox norms, and new discoveries. Those with the 13 compound number can delve deeply into matters and excel in scientific research or occult sciences like Tantra. Their interests in religion and philosophy can lead to great successes and supernatural powers (siddhis).`,
  14: `Number 14, known as "Movement… Challenge," is linked to magnetic communication with the public through writing, publishing, and media-related endeavors. Periodic changes in business and partnerships are often beneficial. Engaging in speculative matters brings luck, as does movement and travel involving diverse groups and nations. However, gains and losses may be temporary due to constant currents of change. Number 14 warns of dangers from natural elements such as fire, floods, earthquakes, tornadoes, hurricanes, and tempests, advising caution without implying inevitability. There is risk in relying on the word of those who misrepresent situations, and depending on others is a mistake. Those with this number should trust their intuition and inner voice. The "luck" of 14 includes success in money dealings and speculative projects, but there is a danger of loss due to misguided advice or overconfidence.`,
  15: `Number 15, dubbed "The Magician," carries deep esoteric significance, embodying the alchemy through which magic is manifested. It is extremely fortunate, radiating enchantment and charm. Associated with eloquent speech, it bestows gifts in music, art, and drama. Those with the 15 compound number possess a dramatic temperament and compelling charisma, making them highly appealing to others’ altruistic nature. This number is particularly lucky for attracting money, gifts, and favors. However, when linked to single numbers 4 or 8, it can incline toward the lower levels of occultism, such as black magic, hypnosis, or mental suggestion, either used by or against the individual. If the birth date is the 15th and the name number is 4, 13, 22, or 31, the name should be changed to a compound number reducing to 1 (e.g., 10 or 19). If the birth date is the 15th and the name number is 8, 17, or 26, or if the name number is 15 and the birth date is the 4th, 13th, 22nd, 31st, 8th, 17th, or 26th, the name should be changed to equal 6 or 24. Otherwise, 15 is highly fortunate, enabling those with this number to bring happiness to others and shine light into darkness, provided they avoid using its magic for selfish purposes.`,
  16: `Number 16, known as "The Shattered Citadel," is depicted by the ancient Chaldeans as a tower struck by lightning, with a crowned man falling. It warns of a strange fatality, danger of accidents, and potential defeat of plans. If the name equals 16, changing its spelling is advisable to avoid this vibration. For those born on the 16th, the challenges must be met carefully to dilute its effect. Anticipating and circumventing failure through meticulous planning is crucial. The 16 brings the obligation of the single number 7 to heed the inner voice, which warns of danger through dreams or intuition. Ignoring this voice risks calamity, as illustrated by Abraham Lincoln, whose name equaled 16 and who ignored repeated warnings of assassination. To mitigate the negative aspects, those with the 16 compound number should avoid seeking fame or leadership and focus on a quieter life.`,
  17: `Number 17, "The Star of the Magi," is a highly spiritual number, symbolized by the ancient Chaldeans as the 8-pointed Star of Venus. It represents love and peace, promising that the individual or entity will rise above early trials and difficulties in relationships and career. Known as "the number of Immortality," it suggests that the person’s name will endure posthumously. This is a highly fortunate number, though it reduces to the single number 8, requiring careful attention to its challenges. Those with the 17 compound number become beneficent, contributing to humanity in ways that earn them lasting recognition. They develop resilience, overcoming obstacles without losing hope, and bring peace to those around them. Despite struggles in personal and family life, they achieve wealth, prosperity, and respect. Faith in spiritual practices can lead to miraculous resolutions of their problems. They are advised to choose friends cautiously and remain vigilant in seeking help.`,
  18: `Number 18, termed "Spiritual-Material Conflict," is one of the most challenging compound numbers to interpret. The ancients symbolize it as a rayed moon with falling drops of blood, caught by a wolf and a hungry dog, with a crab hastening to join them. It represents materialism striving to undermine spirituality, often leading to family quarrels, wars, social upheaval, or revolution. It may involve gaining money or position through divisive tactics or conflict. This number warns of treachery, deception from friends and enemies, and dangers from natural elements like fire, floods, earthquakes, or lightning. If the name equals 18, it should be changed to a more fortunate number. For those born on the 18th, extreme caution is needed to navigate its challenges. The negative aspects can be mitigated by consistently responding to deception and hatred with generosity, love, and forgiveness, turning the other cheek, and returning good for evil. This approach can transform the 18 into a vibration of illumination and success. Changing the name to a compound number reducing to 6 (e.g., 6 or 24) and planning important activities on the 3rd or 6th day of the month can further dilute its challenges. Emphasizing the number 6 in addresses, phone numbers, and other aspects of life enhances this transformation.`,
  19: `Number 19, known as "The Prince of Heaven," is one of the most fortunate compound numbers. Symbolized as the Sun, it promises victory over temporal failure and disappointment. It carries the power of the 10 compound number without its inherent risks of abuse. Those with the 19 compound number enjoy happiness, fulfillment, and success in all ventures, including personal life. While other numbers in a full numerological analysis may introduce challenges, the 19 significantly mitigates their impact, smoothing the path to success.`,
  20: `Number 20, called "The Awakening" or "The Judgment," is symbolized by a winged angel sounding a trumpet, with a man, woman, and child rising from a tomb in prayer. It signifies a powerful awakening at some point in life, bringing new purpose, plans, and ambitions for a great cause or ideal. Occasional delays and obstacles may arise, but these can be overcome through patience, the key challenge of the 20. Cultivating faith in one’s transformative abilities is essential. This number grants vivid precognitive dreams and the ability to manifest positive ones while negating negative ones. As a non-material number, financial success is uncertain, and those with the 20 compound number may need to adjust their name to a more materialistic number if wealth is a priority. However, those aligned with the 20 vibration often prioritize ideals over money, finding fulfillment in simpler necessities.`,
  21: `Number 21, known as "The Crown of the Magi" or "The Universe," is a highly fortunate number promising general success, advancement, honors, and elevation in life and career. It represents victory after long struggles, soul testing, and determination. Those with the 21 compound number can be confident of overcoming all odds and opposition, reaping the rewards of their perseverance. This is a number of karmic reward, ensuring a triumphant outcome.`,
  22: `Number 22, termed "Submission — and Caution," is symbolized as a good person, blinded by others’ folly, carrying a knapsack of errors and defenseless against a ferocious tiger. It warns of illusion, delusion, and misplaced trust in untrustworthy individuals. As a birth number, it cannot be changed, so those with the 22 compound number must exercise caution in career and personal matters. The karmic obligation is to overcome spiritual laziness, develop alertness, and cultivate spiritual aggressiveness to ordain success. By recognizing and mastering personal responsibility, they can control events, avoid being blinded by others, and realize their dreams. Those with the 22 compound number possess strong organizational skills and the ability to hold positions of authority. They exhibit a sense of pride and dignity, making it relatively easy to gain recognition for their abilities. The years between 40 and 60 mark the peak of their career. They often feel lonely because others struggle to match their level of thought and understanding. The first half of their life is challenging, but the second half can bring the fulfillment of earlier ambitions and desires. They may tend to be overly cautious when implementing inspirational initiatives. Doubts rarely trouble them due to their strong confidence. In life, they have much to offer and achieve, so they should move forward and build. They are typically tall with striking eyes. They often hold prominent positions, though these come with limited responsibility. They are generally easygoing but can be inconsistent in nature. Their actions can sometimes be erratic. Overall, they are fortunate in their endeavors and benefit from relationships with the opposite sex. They are content with their family life but also enjoy companionship. Their social circle is limited, with few close friends. They avoid disputes. They tend to be reserved in expressing their emotions.`,
  23: `Number 23, "The Royal Star of the Lion," is a karmic reward number. It promises success in personal and career endeavors, with help from superiors and protection from those in high places. This highly fortunate number blesses the individual or entity with abundant grace. While other numbers in a numerological analysis may pose challenges, the 23’s strength ensures that no number can overpower it during difficult times.`,
  24: `Number 24, associated with "Love — Money — Creativity," is a highly fortunate karmic reward number, especially as a birth number. It promises assistance from those in power and close ties with individuals of high rank. It enhances financial success and the ability to find happiness in love, often through romance, law, or the arts. Its magnetism is highly attractive to the opposite sex. The only caution is to avoid self-indulgence or arrogance in love, finance, or career, as everything comes effortlessly. Abusing the 24’s blessings could lead to a challenging birth number in a future life. Those with this number must appreciate their good fortune and avoid selfishness or disregard for spiritual values, as well as tendencies toward promiscuity or overindulgence.`,
  25: `Number 25, known as "Discrimination and Analysis," bestows spiritual wisdom gained through careful observation and worldly success through learning from experience. Its strength lies in overcoming early disappointments and learning from past mistakes. The judgment of those with the 25 compound number is excellent, but it is not a material number, so substantial financial gains depend on other numbers in the numerological analysis.`,
  26: `Number 26, termed "Partnerships," vibrates with a unique power rooted in compassion and unselfishness, enabling the ability to help others, though not always the self. It is full of contradictions, warning of dangers, disappointments, and failures, particularly in ambitions, due to bad advice, poor associations, or unhappy partnerships. If 26 is the name number, changing it is advisable. As a birth number, individuals should avoid partnerships, ignore others’ advice, and follow their own carefully examined intuition. They should stabilize their income, save money, avoid extravagance, and refrain from investing in others’ ideas. Instead, they should invest in their own future while being generous to those in need, building a solid foundation for themselves.`,
  27: `Number 27, "The Sceptre," is an excellent, harmonious, and fortunate number of courage, power, and enchantment. It promises authority and command, ensuring great rewards from productive labors, intellect, and imagination. The creative faculties of those with the 27 compound number sow good seeds, guaranteeing a rich harvest. They should pursue their original ideas and plans without being swayed by others’ opinions or opposition, as this number represents karmic reward earned across multiple incarnations.`,
  28: `Number 28, "The Trusting Lamb," is a number of contradictions, symbolizing great promise, potential genius, and the capacity for impressive success. However, without careful planning, everything achieved may be lost. It warns of losses through misplaced trust, opposition from enemies or competitors, legal setbacks, and the need to restart the life path repeatedly. If 28 is the name number, changing its spelling is advisable. As a birth number, individuals must practice prudence, caution, and well-laid plans to dilute its negative aspects. The key is to look before leaping to ensure a stable future.`,
  29: `Number 29, "Grace Under Pressure," carries the heaviest karmic burden, testing spiritual strength through trials akin to the story of Job. It brings uncertainties, treachery, deception, unreliable friends, unexpected dangers, and significant grief, often caused by the opposite sex. If 29 is the name number, changing its spelling is essential to lift this burden. As a birth number, conscious efforts must be made to neutralize its effects, such as adopting a strongly positive name number. Developing absolute faith in goodness and cultivating optimism act as powerful remedies. By following Job’s example of accepting responsibility and avoiding blame or revenge, those with the 29 compound number can overcome their challenges and achieve happiness. The combination of the Moon (2) and Mars (9) energies makes 29 also a number associated with fundamental insecurity and uncertainty in life. Since 29 is the sum of 2 and 9, which totals 2, it is a 2 and thus strongly influenced by the Moon. On the material level, those who possess the 29 compound number achieve success and rise to high positions. However, their personal lives, particularly their marital lives, are often unsatisfactory. The changeable nature of number 2 and the sentimentality of number 9 dominate their lives. With a favorable destiny number and a harmonious name number, those with the 29 compound number can choose suitable partners in business and life. With their support and cooperation, these individuals can make progress. However, if the destiny or name number is not in harmony, they become involved in misguided activities and lead unethical or immoral lives. Although those with the 29 compound number attain high positions in their fields, they feel insecure and lonely. The influence of Mars makes them restless and doubtful. Men who possess this number should be cautious in choosing life partners, as women are the primary source of problems and sorrows in their lives. Women who possess this number should fast on Mondays or Thursdays if they seek a harmonious husband. They should strive to understand their partners’ feelings and not focus solely on their own emotional highs and lows. Generally, all psychic individuals who possess the 29 compound number are loving and warm-hearted. They attract individuals with refined aesthetic sensibilities and are favored by those in authority. They are advised to avoid irritability and short-temperedness and to adopt spiritual practices and develop genuine faith in God. They should work to create a supportive family environment. Men with this number should become friendlier and more tolerant with family members and relatives, as they need their support and cooperation. They should not delay marriage plans and should marry early, as late marriages bring unhappiness and mental challenges.`,
  30: `Number 30, "The Loner — Meditation," is associated with retrospection, thoughtful deduction, and mental superiority. It belongs to the mental plane, and those with this number often prioritize intellectual pursuits over material concerns, not out of necessity but by choice. Its fortune depends entirely on the individual’s desires, making it neither inherently lucky nor unlucky. Those with the 30 compound number have few friends, prefer solitude, and are often taciturn loners who avoid social gatherings. They find fulfillment in retreating from the chaos of the world to develop ideas that benefit humanity, such as through writing or nurturing personal talents like art. Their life pattern is often lonely but rewarding.`,
  31: `Number 31, "The Recluse — The Hermit," is similar to the 30 compound number but with a stronger tendency toward self-containment, self-sufficiency, loneliness, and isolation. Those with this number often exhibit genius or high intelligence. At some point, they may reject worldly temptations for the peace of nature or a degree of societal retreat. They can be opinionated, advocating for political change while remaining fixed in personal habits. Even in crowds, those with the 31 compound number often feel isolated and lonely.`,
  32: `Number 32, associated with "Communication," possesses a remarkable ability to influence large groups, similar to the 14 compound number. It also attracts support from those in high positions, much like the 23 compound number. Combined with a natural talent for captivating others through magnetic speech, it’s evident why 32 is sometimes referred to as “the politician’s vibration.” Fields such as advertising, writing, publishing, radio, and television are often easily navigable for those with the 32 compound number, though not always. They tend to thrive under pressure. However, a cautionary note accompanies this seemingly positive influence. The 32 compound number is highly fortunate if the individual remains steadfast in their own opinions and judgments, whether in artistic, intangible, or material matters. If they waver, their plans risk being undermined by the stubbornness or folly of others.`,
  33: `Number 33 does not have a distinct individual meaning but carries the same vibration as the 24 compound number, with amplified effects. This combination of the Moon (2) and Rahu (4) is considered fortunate because 2 and 4 yield 6, a lucky number. Number 6 is ruled by Venus, and when derived from the combination of 2 and 4, the individual is influenced by both 2 and 4 while exhibiting the traits of a 6. This specific number 6 is also fortunate due to the harmonious relationship between 2 and 4. Although those who possess the 33 compound number share all the qualities of psychic number 6 individuals and are considered 6s, they differ from those who possess the 6 or 15 compound numbers. The number 4 represents difficulty and change, and 2 also signifies change. Thus, the lives of those who possess the 33 compound number are marked by frequent changes. The influence of 2 makes them helpful and sincere, while 4 makes them strong and persistent. They are secretive and capable of keeping others’ confidences. They benefit from relationships with the opposite sex but also face failures due to betrayal. They are gentle and supportive. If their destiny and name numbers align with their psychic number, they can enjoy stable family lives. The magic of love, the depth of originality and creativity, and the promise of eventual financial success are intensified due to the double 3. Individuals whose name equals 33 are more fortunate in all aspects when engaged in a harmonious partnership with the opposite sex, whether in their career, romantic, or marital relationships. This number represents a well-deserved karmic reward. Those with the 33 compound number are advised not to misuse the extraordinary luck that will come to them at some point in their lives by succumbing to laziness, overconfidence, or a sense of superiority. When paired with a sense of humor and genuine humility, the 33 vibration becomes a highly fortunate number.`,
  34: `Number 34 has the same meaning as the number 25. Number 34, known as "Discrimination and Analysis," bestows spiritual wisdom gained through careful observation and worldly success through learning from experience. Its strength lies in overcoming early disappointments and learning from past mistakes. The judgment of those with the 34 compound number is excellent, but it is not a material number, so substantial financial gains depend on other numbers in the numerological analysis.`,
  35: `Number 35 has the same meaning as the number 26. Number 35, termed "Partnerships," vibrates with a unique power rooted in compassion and unselfishness, enabling the ability to help others, though not always the self. It is full of contradictions, warning of dangers, disappointments, and failures, particularly in ambitions, due to bad advice, poor associations, or unhappy partnerships. If 35 is the name number, changing it is advisable. As a birth number, individuals should avoid partnerships, ignore others’ advice, and follow their own carefully examined intuition. They should stabilize their income, save money, avoid extravagance, and refrain from investing in others’ ideas. Instead, they should invest in their own future while being generous to those in need, building a solid foundation for themselves.`,
  36: `Number 36 has the same meaning as the number 27. Number 36, "The Sceptre," is an excellent, harmonious, and fortunate number of courage, power, and enchantment. It promises authority and command, ensuring great rewards from productive labors, intellect, and imagination. The creative faculties of those with the 36 compound number sow good seeds, guaranteeing a rich harvest. They should pursue their original ideas and plans without being swayed by others’ opinions or opposition, as this number represents karmic reward earned across multiple incarnations.`,
  37: `Number 37 carries a unique potency of its own. It is associated with a highly sensitive nature, fostering strong and fortunate friendships. Those with this number possess a magnetic appeal to the public, often in the realm of the arts. They form productive partnerships of various kinds. The number places a strong emphasis on love and romance, sometimes with an excessive focus on sexuality. Their attitudes toward sex may be unconventional, though this trait is not always present. There is a significant need for harmony in relationships. Happiness and success are more readily achieved when working in partnership with others rather than operating alone as an individual.`,
  38: `Number 38 has the same meaning as the numbers 11 and 29. Number 38 is depicted as "A Lion Muzzled — A Clenched Fist," symbolizing hidden trials and treachery from others. It represents two individuals, either of the same or opposite sex, or two opposing situations, where compatibility is lacking, and a third force creates interference. This interference, whether a person or an idea, must be overcome to avoid frustration from unachieved goals. The illusion of separation fuels these difficulties, requiring the unification of divided objectives. The third force may manifest as a refusal to see another’s perspective, acting as a barrier to harmony. Identifying the source of this separation and seeking compromise is essential. Sometimes, internal conflicting desires are reflected as in a mirror, standing apart but needing to unite for fulfillment while retaining individuality. Those who possess the 38 compound number have strong intuition and are inspired by lofty ideals. A dynamic energy radiates from their personal magnetism, making them masters of most situations. Their executive abilities are prominent, and their minds are creative, original, and alert. They strive to protect those they love and enjoy the role of provider. They are modest and prefer not to flaunt their talents and abilities. They are drawn to the subtler aspects of life. They enjoy detective stories and mystical philosophy. They possess a strong magnetism that attracts others, but they are cautious about sharing their affections. Through mental and verbal influence, they can persuade others to act in ways that align with their desires. They have significant latent psychic abilities, which they can develop to express clairvoyance, trance, mediumship, or psychometry, thanks to the Moon’s influence. They should learn to engage in lighter mental and spiritual pleasures to relax. Excessive focus can lead to depression, which they must strive to avoid. They are typically successful in life and love, achieving honor, position, and authority. They are loyal to their friends and exhibit a noble disposition. They should remain vigilant against secret enemies. The combination of the Moon (2) and Mars (9) energies makes 38 also a number associated with fundamental insecurity and uncertainty in life. Since 38 is the sum of 2 and 9, which totals 2, it is a 2 and thus strongly influenced by the Moon. On the material level, those who possess the 38 compound number achieve success and rise to high positions. However, their personal lives, particularly their marital lives, are often unsatisfactory. The changeable nature of number 2 and the sentimentality of number 9 dominate their lives. With a favorable destiny number and a harmonious name number, those with the 38 compound number can choose suitable partners in business and life. With their support and cooperation, these individuals can make progress. However, if the destiny or name number is not in harmony, they become involved in misguided activities and lead unethical or immoral lives. Although those with the 38 compound number attain high positions in their fields, they feel insecure and lonely. The influence of Mars makes them restless and doubtful. Men who possess this number should be cautious in choosing life partners, as women are the primary source of problems and sorrows in their lives. Women who possess this number should fast on Mondays or Thursdays if they seek a harmonious husband. They should strive to understand their partners’ feelings and not focus solely on their own emotional highs and lows. Generally, all psychic individuals who possess the 38 compound number are loving and warm-hearted. They attract individuals with refined aesthetic sensibilities and are favored by those in authority. They are advised to avoid irritability and short-temperedness and to adopt spiritual practices and develop genuine faith in God. They should work to create a supportive family environment. Men with this number should become friendlier and more tolerant with family members and relatives, as they need their support and cooperation. They should not delay marriage plans and should marry early, as late marriages bring unhappiness and mental challenges.`,
  39: `Number 39 has the same meaning as the number 30. Number 39, "The Loner — Meditation," is associated with retrospection, thoughtful deduction, and mental superiority. It belongs to the mental plane, and those with this number often prioritize intellectual pursuits over material concerns, not out of necessity but by choice. Its fortune depends entirely on the individual’s desires, making it neither inherently lucky nor unlucky. Those with the 39 compound number have few friends, prefer solitude, and are often taciturn loners who avoid social gatherings. They find fulfillment in retreating from the chaos of the world to develop ideas that benefit humanity, such as through writing or nurturing personal talents like art. Their life pattern is often lonely but rewarding.`,
  40: `Number 40 has the same meaning as the number 31. Number 40, "The Recluse — The Hermit," is similar to the 30 compound number but with a stronger tendency toward self-containment, self-sufficiency, loneliness, and isolation. Those with this number often exhibit genius or high intelligence. At some point, they may reject worldly temptations for the peace of nature or a degree of societal retreat. They can be opinionated, advocating for political change while remaining fixed in personal habits. Even in crowds, those with the 40 compound number often feel isolated and lonely.`,
  41: `Number 41 has the same meaning as the number 32. Number 41, associated with "Communication," possesses a remarkable ability to influence large groups, similar to the 14 compound number. It also attracts support from those in high positions, much like the 23 compound number. Combined with a natural talent for captivating others through magnetic speech, it’s evident why 41 is sometimes referred to as “the politician’s vibration.” Fields such as advertising, writing, publishing, radio, and television are often easily navigable for those with the 41 compound number, though not always. They tend to thrive under pressure. However, a cautionary note accompanies this seemingly positive influence. The 41 compound number is highly fortunate if the individual remains steadfast in their own opinions and judgments, whether in artistic, intangible, or material matters. If they waver, their plans risk being undermined by the stubbornness or folly of others.`,
  42: `Number 42 has the same meaning as the number 24. Number 42, associated with "Love — Money — Creativity," is a highly fortunate karmic reward number, especially as a birth number. It promises assistance from those in power and close ties with individuals of high rank. It enhances financial success and the ability to find happiness in love, often through romance, law, or the arts. Its magnetism is highly attractive to the opposite sex. The only caution is to avoid self-indulgence or arrogance in love, finance, or career, as everything comes effortlessly. Abusing the 42’s blessings could lead to a challenging birth number in a future life. Those with this number must appreciate their good fortune and avoid selfishness or disregard for spiritual values, as well as tendencies toward promiscuity or overindulgence.`,
  43: `Number 43 is considered an unfortunate number by ancient traditions. If a name equals 43, it should be changed to a more fortunate compound number. It is symbolized by tendencies toward revolution, upheaval, strife, conflict, and war, carrying a vibration of repeated disappointment and failure.`,
  44: `Number 44 has the same meaning as the number 26. Number 44, termed "Partnerships," vibrates with a unique power rooted in compassion and unselfishness, enabling the ability to help others, though not always the self. It is full of contradictions, warning of dangers, disappointments, and failures, particularly in ambitions, due to bad advice, poor associations, or unhappy partnerships. If 44 is the name number, changing it is advisable. As a birth number, individuals should avoid partnerships, ignore others’ advice, and follow their own carefully examined intuition. They should stabilize their income, save money, avoid extravagance, and refrain from investing in others’ ideas. Instead, they should invest in their own future while being generous to those in need, building a solid foundation for themselves.`,
  45: `Number 45 has the same meaning as the number 27. Number 45, "The Sceptre," is an excellent, harmonious, and fortunate number of courage, power, and enchantment. It promises authority and command, ensuring great rewards from productive labors, intellect, and imagination. The creative faculties of those with the 45 compound number sow good seeds, guaranteeing a rich harvest. They should pursue their original ideas and plans without being swayed by others’ opinions or opposition, as this number represents karmic reward earned across multiple incarnations.`,
  46: `Number 46 has the same meaning as the number 37. Number 46 carries a unique potency of its own. It is associated with a highly sensitive nature, fostering strong and fortunate friendships. Those with this number possess a magnetic appeal to the public, often in the realm of the arts. They form productive partnerships of various kinds. The number places a strong emphasis on love and romance, sometimes with an excessive focus on sexuality. Their attitudes toward sex may be unconventional, though this trait is not always present. There is a significant need for harmony in relationships. Happiness and success are more readily achieved when working in partnership with others rather than operating alone as an individual.`,
  47: `Number 47 has the same meaning as the number 29. Number 47, "Grace Under Pressure," carries the heaviest karmic burden, testing spiritual strength through trials akin to the story of Job. It brings uncertainties, treachery, deception, unreliable friends, unexpected dangers, and significant grief, often caused by the opposite sex. If 47 is the name number, changing its spelling is essential to lift this burden. As a birth number, conscious efforts must be made to neutralize its effects, such as adopting a strongly positive name number. Developing absolute faith in goodness and cultivating optimism act as powerful remedies. By following Job’s example of accepting responsibility and avoiding blame or revenge, those with the 47 compound number can overcome their challenges and achieve happiness. The combination of the Moon (2) and Mars (9) energies makes 47 also a number associated with fundamental insecurity and uncertainty in life. Since 47 is the sum of 2 and 9, which totals 2, it is a 2 and thus strongly influenced by the Moon. On the material level, those who possess the 47 compound number achieve success and rise to high positions. However, their personal lives, particularly their marital lives, are often unsatisfactory. The changeable nature of number 2 and the sentimentality of number 9 dominate their lives. With a favorable destiny number and a harmonious name number, those with the 47 compound number can choose suitable partners in business and life. With their support and cooperation, these individuals can make progress. However, if the destiny or name number is not in harmony, they become involved in misguided activities and lead unethical or immoral lives. Although those with the 47 compound number attain high positions in their fields, they feel insecure and lonely. The influence of Mars makes them restless and doubtful. Men who possess this number should be cautious in choosing life partners, as women are the primary source of problems and sorrows in their lives. Women who possess this number should fast on Mondays or Thursdays if they seek a harmonious husband. They should strive to understand their partners’ feelings and not focus solely on their own emotional highs and lows. Generally, all psychic individuals who possess the 47 compound number are loving and warm-hearted. They attract individuals with refined aesthetic sensibilities and are favored by those in authority. They are advised to avoid irritability and short-temperedness and to adopt spiritual practices and develop genuine faith in God. They should work to create a supportive family environment. Men with this number should become friendlier and more tolerant with family members and relatives, as they need their support and cooperation. They should not delay marriage plans and should marry early, as late marriages bring unhappiness and mental challenges.`,
  48: `Number 48 has the same meaning as the number 30. Number 48, "The Loner — Meditation," is associated with retrospection, thoughtful deduction, and mental superiority. It belongs to the mental plane, and those with this number often prioritize intellectual pursuits over material concerns, not out of necessity but by choice. Its fortune depends entirely on the individual’s desires, making it neither inherently lucky nor unlucky. Those with the 48 compound number have few friends, prefer solitude, and are often taciturn loners who avoid social gatherings. They find fulfillment in retreating from the chaos of the world to develop ideas that benefit humanity, such as through writing or nurturing personal talents like art. Their life pattern is often lonely but rewarding.`,
  49: `Number 49 has the same meaning as the number 31. Number 49, "The Recluse — The Hermit," is similar to the 30 compound number but with a stronger tendency toward self-containment, self-sufficiency, loneliness, and isolation. Those with this number often exhibit genius or high intelligence. At some point, they may reject worldly temptations for the peace of nature or a degree of societal retreat. They can be opinionated, advocating for political change while remaining fixed in personal habits. Even in crowds, those with the 49 compound number often feel isolated and lonely.`,
  50: `Number 50 has the same meaning as the number 32. Number 50, associated with "Communication," possesses a remarkable ability to influence large groups, similar to the 14 compound number. It also attracts support from those in high positions, much like the 23 compound number. Combined with a natural talent for captivating others through magnetic speech, it’s evident why 50 is sometimes referred to as “the politician’s vibration.” Fields such as advertising, writing, publishing, radio, and television are often easily navigable for those with the 50 compound number, though not always. They tend to thrive under pressure. However, a cautionary note accompanies this seemingly positive influence. The 50 compound number is highly fortunate if the individual remains steadfast in their own opinions and judgments, whether in artistic, intangible, or material matters. If they waver, their plans risk being undermined by the stubbornness or folly of others.`,
  51: `Number 51 possesses a distinct and powerful potency of its own. It is associated with the nature of a warrior, promising rapid advancement in any endeavor undertaken. It is particularly favorable for those requiring protection in military or naval careers, as well as for leaders of any cause unrelated to war. However, it also carries the risk of dangerous enemies and the potential for assassination attempts. Therefore, if an individual’s name equals 51, it is wise to change the spelling to align with a safer compound number, forgoing the allure of glory.`,
  52: `Number 52 has the same meaning as the number 43. Number 52 is considered an unfortunate number by ancient traditions. If a name equals 52, it should be changed to a more fortunate compound number. It is symbolized by tendencies toward revolution, upheaval, strife, conflict, and war, carrying a vibration of repeated disappointment and failure.`
}; And for the Karmic fate numbers, here's their special meanings;

### The Karmic Fate Meanings

This is the latter list of meanings, to be used exclusively for the **Karmic Fate** number.

### Karmic Debt Number 10

A karmic number 10 signifies that you were likely a person of privilege in a past life who misused your power and authority. Instead of leading with compassion, you acted with laziness and selfishness, failing to develop your talents while causing suffering to others.
The lesson in this lifetime is to reclaim your leadership potential for the good of others. You will face numerous challenges that require you to tap into your courage and compassion. Success and happiness will come only when you learn to serve others rather than yourself. This is a path of rediscovering your inner strength through positive action.

### Karmic Debt Number 13

A karmic number 13 indicates that in a previous life, you took the easy way out. You were likely lazy, undisciplined, and relied on others to do your work, blaming them when things went wrong. You indulged in pleasure without contributing effort, leaving a trail of unfinished tasks and broken promises.
The lesson in this lifetime is to learn the value of hard work and discipline. You will encounter many obstacles that seem to block your progress, forcing you to persevere and remain focused. Success will not come easily; it must be earned through consistent effort and by taking responsibility for your actions. This is a path of building character through dedication.

### Karmic Debt Number 14

A karmic number 14 suggests that in a past life, you misused your freedom at the expense of others. You may have been a person of power who dominated or enslaved others, or you may have lived a life of excessive indulgence in physical pleasures (such as drugs, alcohol, or sex) without regard for the consequences.
The lesson in this lifetime is to find balance and moderation. You will face constant, unexpected changes and a chaotic flow of circumstances that challenge your stability. You must learn to remain committed and grounded amidst the turmoil. This is a path of learning self-control and using your freedom responsibly.

### Karmic Debt Number 16

A karmic number 16 indicates that in a past life, you were involved in illicit or forbidden love affairs that caused great pain to others. Your actions were driven by ego and a disregard for the sacredness of love and commitment, leading to the downfall of relationships.
The lesson in this lifetime is to learn humility and to rebuild from the ground up, often through repeated cycles of destruction and rebirth. You will experience sudden, shocking events that tear down your ego and old structures, forcing you to find a higher, more spiritual path. This is a path of overcoming the ego and finding true spiritual connection.

### Karmic Debt Number 19

A karmic number 19 signifies that in a past life, you abused your power. You were likely in a position of great authority but acted with selfishness and greed, caring only for your own needs while ignoring the suffering of those you ruled.
The lesson in this lifetime is to learn to stand on your own two feet and connect with others on a human level. You will often find yourself alone and forced to learn independence. The challenges you face are designed to teach you that you are part of a greater whole and that true power comes from serving others, not dominating them. This is a path of learning empathy and mutual respect.
### Summary

By comprehending the significance of compound numbers from 11 to 31, numerologists can gain clearer insights into the character of psychic individuals who possess these compound numbers on any date of any month.  
The purpose of numerology is to provide general insights about human beings who, despite similar physical compositions, perceive the world differently.  
Their complex behaviors can be understood through their astrological configurations and the interplay of their psychic, destiny, and name numbers.  
Numerology seeks to educate individuals about their strengths and weaknesses, offering guidance on avoiding habits that cause problems in their lives.  
It leads them out of the ignorance stemming from a lack of understanding of planetary influences on their lives.  
It provides a method for working with these influences through the use of colors and gemstones.  
It also offers advice on maintaining general mental and physical health, identifying potential ailments they may face, and suggesting ways to prevent those conditions.