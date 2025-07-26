// src/lib/numerology.ts
import type { AstroInsightInput } from '@/lib/astrology';

// --- HELPER FUNCTIONS ---

const reduceToSingleDigit = (n: number): number => {
  let num = n;
  while (num > 9) {
    num = String(num)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
};

const reduceToCompound = (n: number): number => {
    let numStr = String(n);
    let sum = n;
    while (sum > 9) {
      sum = numStr
        .split('')
        .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
      numStr = String(sum);
    }
    return sum;
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

  const birthDigits = (String(day) + String(month) + String(year)).split('').map(Number).filter(d => d !== 0);
  
  const allDigitsForGrid = [
    ...birthDigits,
    psycheNum,
    destinyNum,
    kuaNum,
  ];

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

  // Tier 1: Compound Fate
  const compoundNum = (String(day) + String(month) + String(year)).split('').map(Number).reduce((a, b) => a + b, 0);
  const compoundMeaning = COMPOUND_NUMBER_MEANINGS[compoundNum as keyof typeof COMPOUND_NUMBER_MEANINGS] || "No specific meaning for this compound number.";

  // Tier 2: Inner Essence
  let reducedCompoundNum: number | null = null;
  let reducedCompoundMeaning: string | null = null;
  if (compoundNum > 9) {
      const reducedSum = String(compoundNum).split('').map(Number).reduce((a, b) => a + b, 0);
      if (reducedSum > 9 || [11, 22, 33].includes(reducedSum)) { // Only if it results in a compound/master number
          reducedCompoundNum = reducedSum;
          reducedCompoundMeaning = COMPOUND_NUMBER_MEANINGS[reducedSum as keyof typeof COMPOUND_NUMBER_MEANINGS] || null;
      }
  }

  // Tier 3: Karmic Fate
  const karmicInitialSum = day + month + year;
  const karmicFateNum = reduceToCompound(karmicInitialSum);
  const karmicFateMeaning = KARMIC_FATE_MEANINGS[karmicFateNum as keyof typeof KARMIC_FATE_MEANINGS] || null;

  const calculateArrows = (counts: { [key: number]: number }) => {
    const strength = [];
    const weakness = [];
    const hasNum = (n: number) => counts[n] > 0;

    const arrowDefs = {
        "Arrow of Determination": { present: [4,5,6], absent: [4,5,6], desc: "You are determined, persistent, and stubborn. You never give up on your goals." },
        "Arrow of Procrastination": { present: [], absent: [4,5,6], desc: "You have a tendency to put things off and lack the follow-through to see projects to completion." },
        "Arrow of Intellect": { present: [4,3,8], absent: [4,3,8], desc: "You have a sharp, logical, and methodical mind. You are an excellent planner and thinker." },
        "Arrow of Poor Memory": { present: [], absent: [4,3,8], desc: "You may struggle with memory and details, preferring to think in broad strokes rather than getting bogged down in specifics." },
        "Arrow of Practicality": { present: [8,1,6], absent: [8,1,6], desc: "You are grounded, practical, and have a talent for managing finances and material resources." },
        "Arrow of Disorder": { present: [], absent: [8,1,6], desc: "You may struggle with organization and financial matters, finding it hard to manage the practical details of life." },
        "Arrow of Action": { present: [9,5,1], absent: [9,5,1], desc: "You are dynamic, energetic, and always ready to take action. You are a doer, not just a dreamer." },
        "Arrow of Apathy": { present: [], absent: [9,5,1], desc: "You may lack drive and enthusiasm, often feeling passive or indifferent to the events around you." },
        "Arrow of Spirituality": { present: [2,5,8], absent: [2,5,8], desc: "You are intuitive, sensitive, and have a deep connection to the spiritual or metaphysical realms." },
        "Arrow of Scepticism": { present: [], absent: [2,5,8], desc: "You are an inquirer, often questioning and doubting things that cannot be proven by logic or science." },
        "Arrow of Emotional Balance": { present: [2,7,6], absent: [2,7,6], desc: "You have a high degree of emotional intelligence, empathy, and compassion for others." },
        "Arrow of Hypersensitivity": { present: [], absent: [2,7,6], desc: "You are extremely sensitive and easily hurt by the words and actions of others, often taking things too personally." },
        "Arrow of Willpower": { present: [4,9,2], absent: [4,9,2], desc: "With a strong mind, ideals, and intuition, you have the willpower to see your ambitious plans through." },
        "Arrow of Frustration": { present: [], absent: [4,9,2], desc: "You may feel easily frustrated when your high ideals clash with the practical realities of the world." },
        "Arrow of Compassion": { present: [3,5,7], absent: [3,5,7], desc: "You have a deep love for humanity and a strong desire to serve others." },
        "Arrow of Enquirer": { present: [], absent: [3,5,7], desc: "You are a seeker of truth, always asking questions and delving deep into the mysteries of life." }
    };

    for (const [name, def] of Object.entries(arrowDefs)) {
        if (def.present.length > 0 && def.present.every(hasNum)) {
            strength.push({ name, description: def.desc });
        }
        if (def.absent.length > 0 && def.absent.every(n => !hasNum(n))) {
            weakness.push({ name, description: def.desc });
        }
    }
    return { strength, weakness };
  }

  const arrows = calculateArrows(numberCounts);

  const kuaAttributes = KUA_ATTRIBUTES[kuaNum] || {};
  const auspiciousDirections = KUA_DIRECTIONS[kuaNum] || {};
  
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
    'Personal-Growth': 'E', 
  },
  4: {
    Success: 'N',
    Health: 'S',
    Family: 'E',
    'Personal Growth': 'SE', 
  },
  5: { // Kua 5 is special and splits by gender
    male: { // Defaults to Kua 2
      Success: 'NE',
      Health: 'W',
      Family: 'NW',
      'Personal Growth': 'SW',
    },
    female: { // Defaults to Kua 8
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
  1: { title: "Communication", description: "Represents communication, expression, and the flow of ideas. It's the number of origin and individuality." },
  2: { title: "Intuition & Sensitivity", description: "This number governs intuition, sensitivity, and partnerships. It's a number of cooperation and diplomacy." },
  3: { title: "Action & Intellect", description: "Signifies action, creativity, and intellectual pursuits. It's a dynamic number associated with planning and execution." },
  4: { title: "Intellect & Wisdom", description: "Represents intelligence, order, and practicality. People with this number are often seen as builders and organizers." },
  5: { title: "Emotional Balance", description: "This is the central number, representing emotional balance, freedom, and change. It connects the mind, heart, and body." },
  6: { title: "Home & Family", description: "Governs home, family, and responsibility. It's a number of nurturing, creativity, and domestic harmony." },
  7: { title: "Spirituality & Learning", description: "Relates to spirituality, learning, and analysis. It signifies a quest for deeper meaning and truth." },
  8: { title: "Material Success", description: "Associated with material success, power, and finance. It represents ambition, organization, and worldly achievement." },
  9: { title: "Humanitarianism", description: "The number of humanitarianism, idealism, and completion. It represents a love for all mankind and a global consciousness." },
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

export const COMPOUND_NUMBER_MEANINGS = {
  10: "The Wheel of Fortune. This is a number of honor, of faith and self-confidence, of rise and fall; one's name will be known for good or evil, according to the Karmic debts. 10 is a fortunate number if the person it represents holds to their own convictions and ideals; if not, their life can be one of karmic retribution and failure.",
  11: "A Lion Muzzled or a Clenched Fist. 11 is a number of hidden trials and treachery from others. It represents two members of the same or opposite sex, or two opposing situations. In either case, the proper action is to be a master of the opposing force, and not allow it to master you. It is a number of great spiritual power, but it can also be a number of self-destruction if its power is not used for the good of mankind.",
  12: "The Sacrifice or The Victim. 12 is the number of the disciple, the one who must subordinate the self for the welfare of others. It represents the trained and disciplined mind, the individual who has learned to sacrifice the lesser for the greater. The mind is the weapon of the individual, and 12 is a number of great intellectual capacity.",
  13: "Regeneration or Change. 13 is not an unlucky number, as many people believe. It is a number of upheaval and destruction, but this destruction is necessary for new growth. The old must be destroyed to make way for the new. It represents the death of the old self and the birth of the new, a change in plans, and an unexpected turn of events.",
  14: "Movement, Combination of People and Things. 14 is a number of magnetic communication and movement. It represents travel, speculation, and risk. The person it represents is often a gambler, taking chances with both their own and others' money. It is a number of temporary gains and losses, and warns of danger from natural calamities such as storms, floods, and earthquakes.",
  15: "The Magician. 15 is a number of deep esoteric meaning, the alchemy of which can be used for good or evil. It is a number of eloquence, of music, art, and the drama of life. The person it represents can be a spellbinder, using their charm to get what they want. If the number is associated with a good single number, it is very fortunate; if with a bad one, it will use its power for destructive ends.",
  16: "The Shattered Citadel. 16 is a number of strange fatalities, of unseen dangers, and of accidents. It warns of a fall from power, of the loss of fortune, and of the failure of one's plans. It represents the Tower of Babel, and the person it represents should be careful not to be too proud, for pride goeth before a fall. The only way to avoid the dangers of this number is to live a simple life and to be content with what one has.",
  17: "The Star of the Magi. 17 is a highly spiritual number and is expressed in symbolism as the 8-pointed Star of Venus. It is a number of immortality and is associated with the idea of rising above the trials and difficulties of everyday life. The person it represents will become famous after death and their name will live on for generations. It is a fortunate number, if the person it represents can live up to its high spiritual vibrations.",
  18: "Spiritual-Material Conflict. 18 is a number of strife and discord, of materialism striving to destroy the spiritual side of nature. It is a number of war, of social upheaval, and of revolution. It represents the man who has sold his soul for a mess of pottage. The person it represents will have a difficult life, and will have to fight for everything they get. They will be misunderstood by their family and friends and will have to stand alone against the world.",
  19: "The Prince of Heaven. 19 is a number of the Sun, and is therefore a number of success and happiness. It is a fortunate number and represents the victory of the spiritual over the material. The person it represents will have a happy life and will be successful in all their undertakings. They will be loved by their family and friends and will be a power for good in the world.",
};

export const KARMIC_FATE_MEANINGS = {
    10: "Number 10 is formed by the combination of 1 and 0. The number 1 represents consciousness and the Sun, while 0 signifies infinity (Anant Tattva). The qualities of 1 predominantly shape number 10, as it belongs to the 1 series, granting honor, faith, self-assurance, and recognition—whether positive or negative—that varies according to karmic principles. The number 1 is considered fortunate, whereas 0 is seen as unfortunate. The unfortunate influence of 0 introduces struggles, which foster self-confidence and proper understanding in these psychic individuals, enabling them to stand out. The presence of 0 generates hidden adversaries, but 1 provides the alertness to identify them. Thus, 10 symbolizes success attained through persistent effort. Remaining introspective and vigilant is the only way to overcome the challenges described. Relying on others will lead to difficulties.",
    11: "Number 11 is regarded as a special number, often referred to as the mystic number in various occult traditions. In Hindu tradition, there are eleven forms or incarnations of Rudra, the Lord of Destruction. Because the number 1 appears twice, numerologists attribute to it a stubborn, revolutionary, and authoritative character. Psychic number 2 individuals who possess the 11 compound number are quick to respond, optimistic, and capable of guiding themselves and others through challenging situations. They have strong intuition and are inspired by lofty ideals. A dynamic energy radiates from their personal magnetism, making them masters of most situations.",
    12: "This number combines the Sun (1) and the Moon (2), forming a pair of opposites. This conflicting dynamic creates anxiety for those who possess the 12 compound number. They are caught between the stable, resolute nature of 1s and the fluctuating opinions of 2s. They often make decisions at the last moment, and even then, their choices remain uncertain. They may change their minds even after beginning a task, leaving it incomplete. They achieve success later in life, but leave countless projects and tasks, started with great enthusiasm, unfinished. They possess the strength of 1s and the gentleness of 2s.",
    13: "Number 13 combines the Sun (1) and Jupiter (3). The Sun’s influence disrupts Jupiter, resulting in an easily irritable nature. However, it also imparts the qualities of number 1 individuals. The Sun’s disruption of Jupiter causes events to unfold quickly. If these individuals find supportive friends, they can overcome their sadness, pessimism, and irritability to make a significant impact in life. In numerology, 13 is not deemed unlucky or ominous. It represents practical, alert, and dependable individuals who can delve deeply into matters and excel in scientific research or occult sciences.",
    14: "This number combines the Sun (1) and Rahu (4). Rahu is an adversary of the Sun, and when paired, it seeks to cause affliction by partially eclipsing the Sun’s influence, creating obstacles. Those who possess the 14 compound number experience inner conflict and their lives undergo more frequent changes. They are prone to taking greater risks, which may lead to financial losses. They repeatedly face challenges due to incorrect predictions about the future. They are advised to be cautious with associates and colleagues and to remain calm to achieve their goals.",
    15: "Number 15 combines the Sun (1) and Mercury (5). Both planets are associated with intellect and sharp wit, and are drawn to modernity, material success, and popularity. Those with the 15 compound number have a strong preference for luxury and material prosperity, as well as a keen interest in literature, fine arts, and music. The Sun brings them popularity, while Mercury encourages frequent travel. Venus (as the ruler of 6) draws them to comfortable, costly, and luxurious environments. They are tender, emotional, attractive, and appear younger than their peers.",
    16: "Number 16 combines two opposing forces—the Sun (1) and Venus (6). This combination creates challenges. As psychic number 7, ruled by Ketu, they struggle with decision-making, leading to uncertainties and anxieties. The Sun imparts idealism, while Venus fosters a love for pleasure, making them idealistic dreamers. Ketu’s influence reduces their interest in worldly desires. They experience multiple rises and falls, suffer from setbacks, but persist in their own way. They should be cautious of accidents and mishaps.",
    17: "This number combines the Sun (1) and Ketu (7). As a psychic number 8, it is ruled by Saturn and represents struggle, obstacles, and difficulties. The Sun and Ketu are enemies, creating inner conflict. However, this conflict fosters genuine understanding, making them more aware, compassionate, and spiritual. They develop resilience, overcoming obstacles without losing hope. They become peaceful and bring peace to those around them. They leave a distinctive mark on history, and Saturn ensures success in the latter part of their lives.",
    18: "This number combines the Sun (1) and Saturn (8) and is ruled by Mars (9). Those with the 18 compound number face strong opposition, inner conflict, and obstacles. However, their martial nature makes them resilient fighters. They grow accustomed to facing challenges and adverse situations caused by grudges and enmity from family members. They lack peace in their personal and family lives, and struggle with poor marital bonds. They may earn money through unethical means. If they adopt disciplined lives and embrace non-violence, they can prosper and leave a significant mark on history.",
    19: "This number combines the Sun (1) and Mars (9) and is ruled by the Sun (1). Those who possess the 19 compound number are fortunate. The Sun and Mars are allies, making them enthusiastic, joyful, and successful. The Sun’s influence makes them wise, while Mars enables them to confront difficult situations. Their hard work leads to success, but their stubborn and short-tempered nature can cause issues in their marital lives. They enjoy high status, honor, and material prosperity, and are helpful and generous.",
    20: "This is The Awakening. This number represents a new life and a new sense of purpose. It can indicate a spiritual awakening, but just as often, it can signify that a person is about to have a major breakthrough in their career or their most important relationship. It is an extremely fortunate number, but only if the person’s goals are not entirely selfish. If the goals are for the good of many, then this is a karmic reward number. If the goals are selfish, then the karmic reward will turn into a karmic lesson. There will be many delays and obstacles in this person’s path."
};
