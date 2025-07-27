// src/lib/numerology.ts
import type { AstroInsightInput } from '@/lib/astrology';
import { COMPOUND_NUMBER_MEANINGS, KARMIC_FATE_MEANINGS, KUA_ATTRIBUTES, KUA_DIRECTIONS } from './numerology/data';
import { ARROWS_OF_STRENGTH, ARROWS_OF_WEAKNESS } from './numerology/data/arrowMeanings';

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

const reduceOnce = (n: number): number => {
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
  
  if (finalKua === 5 && gender.toLowerCase() === 'male') {
      return 2;
  }
  if (finalKua === 5 && gender.toLowerCase() === 'female') {
      return 8;
  }
  
  return finalKua;
};

export const calculateKarmicFate = (day: number, month: number, year: number): number => {
    const sum = day + month + year;
    return reduceOnce(sum);
}

// --- DATA INTERFACES ---
export interface ArrowData {
    name: string;
    description: string;
    numbers: number[];
}
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
  arrowsOfStrength: ArrowData[];
  arrowsOfWeakness: ArrowData[];
}

// --- MAIN GRID GENERATION FUNCTION ---
export const generateLoShuData = (input: AstroInsightInput): NumerologyData => {
  const { day, month, year, gender } = input;

  const psycheNum = calculatePsyche(day);
  const destinyNum = calculateDestiny(day, month, year);
  const kuaNum = calculateKua(year, gender);

  const birthDigitsForGrid = (String(day) + String(month) + String(year)).split('').map(d => parseInt(d, 10)).filter(d => d !== 0);
  
  const allDigitsForGrid = [
      ...birthDigitsForGrid,
      psycheNum,
      destinyNum,
      kuaNum
  ];

  const numberCounts: { [key: string]: number } = {};
  for (const digit of allDigitsForGrid) {
      if (digit > 0) {
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
  
  const firstReduction = reduceOnce(compoundNum);
  let reducedCompoundNum: number | null = null;
  let reducedCompoundMeaning: string | null = null;

  if (firstReduction >= 10) {
      reducedCompoundNum = firstReduction;
      reducedCompoundMeaning = COMPOUND_NUMBER_MEANINGS[reducedCompoundNum as keyof typeof COMPOUND_NUMBER_MEANINGS] || `No specific meaning for Inner Essence number ${reducedCompoundNum}.`;
  }
  
  const karmicFateNum = calculateKarmicFate(day, month, year);
  const karmicFateMeaning = KARMIC_FATE_MEANINGS[karmicFateNum as keyof typeof KARMIC_FATE_MEANINGS] || null;

  const calculateArrows = (grid: (string | null)[][]) => {
    const strength: ArrowData[] = [];
    const weakness: ArrowData[] = [];

    const presentNumbers = new Set<number>();
    grid.flat().forEach(cell => {
        if(cell) {
            presentNumbers.add(parseInt(cell.charAt(0)));
        }
    });

    for (const arrow of ARROWS_OF_STRENGTH) {
        if (arrow.numbers.every(n => presentNumbers.has(n))) {
            strength.push(arrow);
        }
    }

    for (const arrow of ARROWS_OF_WEAKNESS) {
        if (arrow.numbers.every(n => !presentNumbers.has(n))) {
            weakness.push(arrow);
        }
    }
    return { strength, weakness };
  }

  const arrows = calculateArrows(loShuGrid);

  let kuaAttributes = KUA_ATTRIBUTES[kuaNum];
  if(kuaNum === 5) {
    kuaAttributes = gender.toLowerCase() === 'male' ? KUA_ATTRIBUTES[5].male : KUA_ATTRIBUTES[5].female;
  }
  
  let auspiciousDirections = KUA_DIRECTIONS[kuaNum];
  if(kuaNum === 5) {
    auspiciousDirections = gender.toLowerCase() === 'male' ? KUA_DIRECTIONS[5].male : KUA_DIRECTIONS[5].female;
  }


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
    kuaAttributes: kuaAttributes || {},
    auspiciousDirections: auspiciousDirections || {},
  };
};