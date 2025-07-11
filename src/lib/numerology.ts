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

const calculateKua = (year: number, gender: string): number => {
  const yearSum = reduceToSingleDigit(
    String(year)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0)
  );

  let kua;
  if (year < 2000) {
    kua = gender.toLowerCase() === 'male' ? 11 - yearSum : yearSum + 4;
  } else {
    kua = gender.toLowerCase() === 'male' ? 10 - yearSum : yearSum + 5;
  }

  let finalKua = reduceToSingleDigit(kua);

  // The special Kua 5 rule
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
  // 1. Calculate all core numbers
  const psycheNum = calculatePsyche(day);
  const destinyNum = calculateDestiny(day, month, year);
  const kuaNum = calculateKua(year, gender);

  // 2. Aggregate ALL digits for the grid (the corrected logic)
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
