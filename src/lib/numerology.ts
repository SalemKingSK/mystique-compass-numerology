// src/lib/numerology.ts
import type { AstroInsightInput } from '@/components/profile-generator/types';
import { COMPOUND_NUMBER_MEANINGS, DESTINY_NUMBER_MEANINGS, KARMIC_FATE_MEANINGS, KUA_DATA, PSYCHIC_NUMBER_MEANINGS, REPEATED_NUMBER_MEANINGS } from './numerology/data';
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
  const reducedYear = reduceToSingleDigit(
    String(year).split('').reduce((acc, digit) => acc + parseInt(digit), 0)
  );

  let initialKua: number;
  
  if (gender.toLowerCase() === 'male') {
    initialKua = 11 - reducedYear;
  } else {
    initialKua = reducedYear + 4;
  }

  let finalKua = reduceToSingleDigit(initialKua);

  // Handle the special case for Kua number 5
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
export interface ArrowData {
    name: string;
    description: string;
    numbers: number[];
}
export interface NumerologyData {
  birthDay: number;
  psycheNum: number;
  destinyNum: number;
  compoundNum: number;
  compoundMeaning: string;
  reducedCompoundNum: number | null;
  reducedCompoundMeaning: string | null;
  karmicFateNum: number | null;
  karmicFateMeaning: string | null;
  psychicMeaning: { title: string; description: string; };
  specialTraitMeaning: string | null;
  destinyMeaning: { title: string; description: string; };
  kuaNum: number;
  kuaAttributes: {
    element: string;
    group: string;
    trigram: string;
    lucky_colours: string[];
    directions: { [key: string]: string };
  };
  loShuGrid: (string | null)[][];
  numberCounts: { [key: string]: number };
  repeatedNumberMeanings: { [key: string]: string };
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

  const birthDigitsRaw = (String(day || 0) + String(month || 0) + String(year || 0)).split('').map(Number);
  const compoundNum = birthDigitsRaw.reduce((a, b) => a + b, 0);
  const compoundMeaning = COMPOUND_NUMBER_MEANINGS[compoundNum as keyof typeof COMPOUND_NUMBER_MEANINGS] || `No specific meaning for this compound number (${compoundNum}).`;
  
  const firstReduction = reduceOnce(compoundNum);
  let reducedCompoundNum: number | null = null;
  let reducedCompoundMeaning: string | null = null;

  if (firstReduction >= 10 && firstReduction !== compoundNum) {
      reducedCompoundNum = firstReduction;
      reducedCompoundMeaning = COMPOUND_NUMBER_MEANINGS[reducedCompoundNum as keyof typeof COMPOUND_NUMBER_MEANINGS] || `No specific meaning for Inherent Fate number ${reducedCompoundNum}.`;
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
  
  const originalKua = reduceToSingleDigit(gender.toLowerCase() === 'male' ? 11 - reduceToSingleDigit(year) : reduceToSingleDigit(year) + 4);
  let kuaLookupKey = originalKua.toString();
  if (originalKua === 5) {
      kuaLookupKey = gender.toLowerCase() === 'male' ? '5_male' : '5_female';
  }
  const kuaAttributes = KUA_DATA[kuaLookupKey] || {};

  const psychicMeaning = PSYCHIC_NUMBER_MEANINGS[psycheNum as keyof typeof PSYCHIC_NUMBER_MEANINGS] || { title: 'Unknown', description: 'No specific meaning available for this psychic number.'};
  const destinyMeaning = DESTINY_NUMBER_MEANINGS[destinyNum as keyof typeof DESTINY_NUMBER_MEANINGS] || { title: 'Unknown', description: 'No specific meaning available for this destiny number.'};
  
  const specialTraitMeaning = (day >= 10 && day <= 31) 
    ? (COMPOUND_NUMBER_MEANINGS[day as keyof typeof COMPOUND_NUMBER_MEANINGS] || null) 
    : null;


  return {
    birthDay: day,
    psycheNum,
    destinyNum,
    kuaNum,
    loShuGrid,
    numberCounts,
    repeatedNumberMeanings: REPEATED_NUMBER_MEANINGS,
    compoundNum,
    compoundMeaning,
    reducedCompoundNum,
    reducedCompoundMeaning,
    karmicFateNum,
    karmicFateMeaning,
    psychicMeaning,
    specialTraitMeaning,
    destinyMeaning,
    arrowsOfStrength: arrows.strength,
    arrowsOfWeakness: arrows.weakness,
    kuaAttributes: kuaAttributes || { directions: {} }
  };
};
