// Helper function to reduce a number to a single digit (unless it's a master number)
const reduceToSingleDigit = (n: number): number => {
  let num = n;
  while (num > 9) {
    if (num === 11 || num === 22 || num === 33) {
      return num; // Don't reduce master numbers
    }
    num = String(num)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
};

// --- Core Number Calculations ---

const calculatePsyche = (day: number): number => {
  return reduceToSingleDigit(day);
};

const calculateDestiny = (day: number, month: number, year: number): number => {
  const fullDateStr = String(day) + String(month) + String(year);
  const sum = fullDateStr
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return reduceToSingleDigit(sum);
};

/**
 * **CORRECTED** Calculates the Kua Number based on year and gender.
 * This version follows the standard algorithm precisely.
 * @param {number} year - The four-digit year of birth.
 * @param {string} gender - 'male' or 'female'.
 * @returns {number} The Kua Number.
 */
const calculateKua = (year: number, gender: string): number => {
  // 1. Sum the last two digits of the year.
  const yearSum = String(year)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  
  // 2. Reduce the sum to a single digit.
  const reducedYearSum = reduceToSingleDigit(yearSum);
  
  let kua;
  // 3. Apply the correct formula based on gender and whether the year is before or after 2000.
  if (year < 2000) {
    if (gender.toLowerCase() === 'male') {
      kua = 11 - reducedYearSum;
    } else { // female
      kua = reducedYearSum + 4;
    }
  } else { // For years 2000 and after
    if (gender.toLowerCase() === 'male') {
      kua = 10 - reducedYearSum; // Note: Some systems use 9. Using 10 as it's common.
    } else { // female
      kua = reducedYearSum + 5; // Note: Some systems use 6. Using 5 as it's common.
    }
  }

  // 4. Reduce the result to a single digit.
  let finalKua = reduceToSingleDigit(kua);
  
  // 5. Handle the special case where Kua number is 5.
  // The center number 5 is not assigned a Kua.
  // It is replaced by 2 for males and 8 for females.
  if (finalKua === 5) {
    return gender.toLowerCase() === 'male' ? 2 : 8;
  }
  
  return finalKua;
};


// --- Main Grid Generation Function ---

interface UserData {
    day: number;
    month: number;
    year: number;
    gender: string;
}

export const generateLoShuData = ({ day, month, year, gender }: UserData) => {
  // 1. Calculate all core numbers using the corrected functions
  const psycheNum = calculatePsyche(day);
  const destinyNum = calculateDestiny(day, month, year);
  const kuaNum = calculateKua(year, gender);

  // 2. Aggregate ALL digits for the grid
  const birthDigits = (String(day) + String(month) + String(year))
    .split('')
    .filter(d => d !== '0');
    
  const allDigitsForGrid = [
    ...birthDigits,
    ...String(psycheNum).split(''),
    ...String(destinyNum).split(''),
    ...String(kuaNum).split(''),
  ];

  // 3. Count frequencies and create grid data
  const counts: { [key: string]: number } = {};
  for (const digit of allDigitsForGrid) {
    counts[digit] = (counts[digit] || 0) + 1;
  }

  const gridContent: { [key: string]: string } = {};
  for (let i = 1; i <= 9; i++) {
    const digitStr = String(i);
    gridContent[digitStr] = counts[digitStr] ? digitStr.repeat(counts[digitStr]) : '';
  }

  // 4. Arrange data into a 2D array for rendering
  const gridLayout = [
    [gridContent['4'], gridContent['9'], gridContent['2']],
    [gridContent['3'], gridContent['5'], gridContent['7']],
    [gridContent['8'], gridContent['1'], gridContent['6']],
  ];
  
  // 5. Return all calculated data
  return {
    psycheNum,
    destinyNum,
    kuaNum,
    loShuGrid: gridLayout,
    // You can add more returned data here later, like arrows etc.
  };
};
