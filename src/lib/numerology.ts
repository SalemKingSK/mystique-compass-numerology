// src/lib/numerology.ts
import type { AstroInsightInput, PersonalYearData } from '@/components/profile-generator/types';
import { 
  COMPOUND_NUMBER_MEANINGS, 
  DESTINY_NUMBER_MEANINGS, 
  KUA_DATA, 
  PSYCHIC_NUMBER_MEANINGS, 
  REPEATED_NUMBER_MEANINGS,
  lindaGoodmanMeanings
} from './numerology/data';
import { 
  PRIMARY_PLANES, 
  SECONDARY_ARROWS, 
  DEFICIENCY_ARROWS, 
  MINOR_ARROWS 
} from './numerology/data/arrowMeanings';

// --- HELPER FUNCTIONS ---
const reduceToSingleDigit = (n: number): number => {
  if (n <= 9) return n;

  const sum = String(n)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
      
  return reduceToSingleDigit(sum);
};

const reduceOnce = (n: number): number => {
    return String(n)
        .split('')
        .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
}


// --- CORE NUMBER CALCULATIONS ---
export const calculatePsyche = (day: number): number => {
    if (day > 9) {
         const sum = String(day).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
         return reduceToSingleDigit(sum);
    }
    return day;
};

export const calculateDestiny = (day: number, month: number, year: number): number => {
  const fullDateStr = String(day) + String(month) + String(year);
  const sum = fullDateStr
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return reduceToSingleDigit(sum);
};

export const calculateKua = (year: number, gender: string): number => {
  const reduceToSingleDigit = (n: number): number => {
    if (n <= 9) return n;
    const sum = n.toString()
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    return reduceToSingleDigit(sum);
  };

  const reducedYear = reduceToSingleDigit(year);
  let initialKua: number;

  if (gender.toLowerCase() === 'male') {
    initialKua = 11 - reducedYear;
  } else {
    initialKua = reducedYear + 4;
  }

  let finalKua = reduceToSingleDigit(initialKua);

  if (finalKua === 5) {
    finalKua = gender.toLowerCase() === 'male' ? 2 : 8;
  }

  return finalKua;
};


// --- DATA INTERFACES ---
export interface ArrowData {
    name: string;
    description: string;
    numbers: number[];
    category?: string;
    type?: 'strength' | 'weakness' | 'shadow';
}

export interface NumerologyData {
  birthDay: number;
  birthMonth: number;
  birthYear: number;
  psycheNum: number;
  destinyNum: number;
  compoundNum: number | null;
  compoundMeaning: string | null;
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
  personalYears?: PersonalYearData[];
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

  const birthDateSum = String(day).split('').reduce((a, b) => a + Number(b), 0) +
                       String(month).split('').reduce((a, b) => a + Number(b), 0) +
                       String(year).split('').reduce((a, b) => a + Number(b), 0);
  
  const compoundNum = (birthDateSum >= 10 && COMPOUND_NUMBER_MEANINGS[birthDateSum as keyof typeof COMPOUND_NUMBER_MEANINGS]) ? birthDateSum : null;
  const compoundMeaning = compoundNum ? COMPOUND_NUMBER_MEANINGS[compoundNum as keyof typeof COMPOUND_NUMBER_MEANINGS] : null;
  
  const firstReduction = reduceOnce(birthDateSum);
  let reducedCompoundNum: number | null = null;
  let reducedCompoundMeaning: string | null = null;

  if (firstReduction >= 10 && firstReduction !== birthDateSum && COMPOUND_NUMBER_MEANINGS[firstReduction as keyof typeof COMPOUND_NUMBER_MEANINGS]) {
      reducedCompoundNum = firstReduction;
      reducedCompoundMeaning = COMPOUND_NUMBER_MEANINGS[firstReduction as keyof typeof COMPOUND_NUMBER_MEANINGS];
  }
  
  const rawKarmicSum = day + month + year;
  const karmicCandidate = String(rawKarmicSum).split('').reduce((a, b) => a + Number(b), 0);
  const karmicFateNum = (karmicCandidate >= 10 && lindaGoodmanMeanings[karmicCandidate]) ? karmicCandidate : null;
  const karmicFateMeaning = karmicFateNum ? lindaGoodmanMeanings[karmicFateNum] : null;


  const calculateArrows = (grid: (string | null)[][]) => {
    const strength: ArrowData[] = [];
    const weakness: ArrowData[] = [];

    const presentNumbers = new Set<number>();
    grid.flat().forEach(cell => {
        if(cell) {
            presentNumbers.add(parseInt(cell.charAt(0)));
        }
    });

    // 1. Primary Planes (Strengths and Shadows)
    for (const arrow of PRIMARY_PLANES) {
        if (arrow.numbers.every(n => presentNumbers.has(n))) {
            strength.push({
                name: arrow.name,
                description: `${arrow.strength}${arrow.additional ? '\n\n' + arrow.additional : ''}`,
                numbers: arrow.numbers,
                category: "Primary Plane",
                type: 'strength'
            });
        } else if (arrow.numbers.every(n => !presentNumbers.has(n))) {
            weakness.push({
                name: arrow.name + " (Shadow Side)",
                description: arrow.shadow || "",
                numbers: arrow.numbers,
                category: "Primary Shadow",
                type: 'shadow'
            });
        }
    }

    // 2. Secondary Arrows
    for (const arrow of SECONDARY_ARROWS) {
        if (arrow.numbers.every(n => presentNumbers.has(n))) {
            strength.push({
                name: arrow.name,
                description: arrow.strength,
                numbers: arrow.numbers,
                category: "Secondary Arrow",
                type: 'strength'
            });
        }
    }

    // 3. Deficiency Arrows
    for (const arrow of DEFICIENCY_ARROWS) {
        if (arrow.numbers.every(n => !presentNumbers.has(n))) {
            weakness.push({
                name: arrow.name,
                description: arrow.desc,
                numbers: arrow.numbers,
                category: "Deficiency",
                type: 'weakness'
            });
        }
    }

    // 4. Minor Arrows
    for (const arrow of MINOR_ARROWS) {
        if (arrow.numbers.every(n => presentNumbers.has(n))) {
            strength.push({
                name: arrow.name,
                description: arrow.desc,
                numbers: arrow.numbers,
                category: "Minor Arrow",
                type: 'strength'
            });
        }
    }

    // 5. Special Configs
    const allNumbers = [1,2,3,4,5,6,7,8,9];
    if (allNumbers.every(n => presentNumbers.has(n))) {
        strength.push({
            name: "The King’s Arrow / Arrow of Perfection",
            description: "Rarely found, this indicates a person who has 'brought everything with them' into this life. They have the mental, emotional, and physical tools to handle any situation. However, this often leads to a very busy, demanding life as they are expected to do everything. The challenge for the King's Arrow is a lack of focus; because they are good at everything, they may struggle to choose one path.",
            numbers: allNumbers,
            category: "Rare Configuration",
            type: 'strength'
        });
    }

    return { strength, weakness };
  }

  const arrows = calculateArrows(loShuGrid);
  
  let kuaLookupKey = String(kuaNum);
  if (kuaNum === 2 && gender.toLowerCase() === 'male' && String(year).split('').reduce((a, b) => a + Number(b), 0) % 9 === 5) {
      kuaLookupKey = '5_male';
  } else if (kuaNum === 8 && gender.toLowerCase() === 'female' && String(year).split('').reduce((a, b) => a + Number(b), 0) % 9 === 5) {
      kuaLookupKey = '5_female';
  }
  
  const kuaAttributes = KUA_DATA[kuaLookupKey] || {};

  const psychicMeaning = PSYCHIC_NUMBER_MEANINGS[psycheNum as keyof typeof PSYCHIC_NUMBER_MEANINGS] || { title: 'Unknown', description: 'No specific meaning available for this psychic number.'};
  const destinyMeaning = DESTINY_NUMBER_MEANINGS[destinyNum as keyof typeof DESTINY_NUMBER_MEANINGS] || { title: 'Unknown', description: 'No specific meaning available for this destiny number.'};
  
  const specialTraitMeaning = (day >= 10 && day <= 31) 
    ? (COMPOUND_NUMBER_MEANINGS[day as keyof typeof COMPOUND_NUMBER_MEANINGS] || null) 
    : null;


  return {
    birthDay: day,
    birthMonth: month,
    birthYear: year,
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
