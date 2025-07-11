// --- Helper Functions ---

/**
 * Reduces a number to a single digit by summing its digits repeatedly.
 * Handles master numbers (11, 22, 33) by not reducing them.
 * @param n - The number to reduce.
 * @returns The single-digit number or a master number.
 */
const reduceToSingleDigit = (n: number): number => {
  let num = n;
  while (num > 9) {
    if (num === 11 || num === 22 || num === 33) {
      return num;
    }
    num = String(num)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
};


// --- Core Number Calculations ---

/**
 * Calculates the Psyche Number from the day of birth.
 * @param {number} day - The day of birth (1-31).
 * @returns {number} The Psyche Number.
 */
const calculatePsyche = (day: number): number => {
  return reduceToSingleDigit(day);
};

/**
 * Calculates the Destiny (Life Path) Number from the full date of birth.
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @returns {number} The Destiny Number.
 */
const calculateDestiny = (day: number, month: number, year: number): number => {
  const fullDateStr = String(day) + String(month) + String(year);
  const sum = fullDateStr
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return reduceToSingleDigit(sum);
};

/**
 * Calculates the Kua Number based on year and gender.
 * @param year - The four-digit year of birth.
 * @param gender - 'male' or 'female'.
 * @returns The Kua Number.
 */
export const calculateKua = (year: number, gender: string): number => {
  // 1. Sum the four digits of the birth year.
  const yearSum = String(year)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  
  // 2. Reduce that sum to a single digit.
  const reducedYearSum = reduceToSingleDigit(yearSum);
  
  let kuaResult: number;

  // 3. Apply the correct formula based on the user's birth century and gender.
  if (year < 2000) {
    if (gender.toLowerCase() === 'male') {
      kuaResult = 11 - reducedYearSum;
    } else { // female
      kuaResult = reducedYearSum + 4;
    }
  } else { // For years 2000 and after
    if (gender.toLowerCase() === 'male') {
      kuaResult = 10 - reducedYearSum;
    } else { // female
      kuaResult = reducedYearSum + 5;
    }
  }

  // 4. Reduce the result of the formula to a final single digit.
  const finalKua = reduceToSingleDigit(kuaResult);
  
  // 5. Apply the special rule for Kua 5.
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

/**
 * Generates all numerology data including the Lo Shu Grid.
 * @param {object} userData - An object with day, month, year, gender.
 * @returns {object} An object containing all calculated results.
 */
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
  };
};