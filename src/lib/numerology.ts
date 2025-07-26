// src/lib/numerology.ts
import type { AstroInsightInput } from '@/lib/astrology';
import { COMPOUND_NUMBER_MEANINGS, KARMIC_FATE_MEANINGS, KUA_ATTRIBUTES, KUA_DIRECTIONS } from './numerology/data';

// --- HELPER FUNCTIONS ---
const reduceToSingleDigit = (n: number): number => {
  let num = n;
  while (num > 9) {
    if ([11, 22, 33].includes(num) && num !== n) { 
        // This logic is simplified for now; we reduce all to a single digit for core numbers.
    }
    num = String(num)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
};

const reduceOnce = (n: number): number => {
    if (n < 10) return n;
    return String(n)
        .split('')
        .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
}


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

export const calculateKarmicFate = (day: number, month: number, year: number): number => {
    const sum = day + month + year;
    return reduceOnce(sum);
}

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
  numberCounts: { [key: string]: number };
  arrowsOfStrength: { name: string; description: string }[];
  arrowsOfWeakness: { name: string; description: string }[];
}

// --- MAIN GRID GENERATION FUNCTION ---
export const generateLoShuData = (input: AstroInsightInput): NumerologyData => {
  const { day, month, year, gender } = input;

  const psycheNum = calculatePsyche(day);
  const destinyNum = calculateDestiny(day, month, year);
  const kuaNum = calculateKua(year, gender);

  const birthDigits = (String(day) + String(month) + String(year)).split('').filter(d => d !== '0');
  const allDigitsForGrid = [
      ...birthDigits.map(d => parseInt(d)),
      psycheNum,
      destinyNum,
  ];

  const numberCounts: { [key: string]: number } = {};
  for (const digit of allDigitsForGrid) {
      if (digit > 0) { // Ensure we don't count 0
          numberCounts[digit] = (numberCounts[digit] || 0) + 1;
      }
  }

  const gridContent: { [key: string]: string } = {};
  for (let i = 1; i <= 9; i++) {
    const digitStr = String(i);
    if (numberCounts[digitStr]) {
      gridContent[digitStr] = digitStr.repeat(numberCounts[digitStr]);
    }
  }

  const loShuGrid = [
    [gridContent['4'] || null, gridContent['9'] || null, gridContent['2'] || null],
    [gridContent['3'] || null, gridContent['5'] || null, gridContent['7'] || null],
    [gridContent['8'] || null, gridContent['1'] || null, gridContent['6'] || null],
  ];

  const birthDigitsRaw = (String(day) + String(month) + String(year)).split('').map(Number);
  const compoundNum = birthDigitsRaw.reduce((a, b) => a + b, 0);
  const compoundMeaning = COMPOUND_NUMBER_MEANINGS[compoundNum as keyof typeof COMPOUND_NUMBER_MEANINGS] || `No specific meaning for this compound number (${compoundNum}).`;

  let reducedCompoundNum: number | null = null;
  let reducedCompoundMeaning: string | null = null;
  if (compoundNum >= 10 && compoundNum <= 52) {
      const reducedSum = reduceToSingleDigit(compoundNum);
      reducedCompoundNum = reducedSum;
      reducedCompoundMeaning = COMPOUND_NUMBER_MEANINGS[reducedSum as keyof typeof COMPOUND_NUMBER_MEANINGS] || `No specific meaning for Inner Essence number ${reducedSum}.`;
  }
  
  const karmicFateNum = calculateKarmicFate(day, month, year);
  const karmicFateMeaning = KARMIC_FATE_MEANINGS[karmicFateNum as keyof typeof KARMIC_FATE_MEANINGS] || null;

  const calculateArrows = (grid: (string | null)[][]) => {
    const strength: { name: string; description: string }[] = [];
    const weakness: { name: string; description: string }[] = [];

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