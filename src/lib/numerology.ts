// src/lib/numerology.ts

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
  // Kua 5 defaults to 2 for males and 8 for females, which are handled in the generation function.
  6: { element: 'Metal', colors: 'White, Gold, Silver', season: 'Autumn' },
  7: { element: 'Metal', colors: 'White, Gold, Silver', season: 'Autumn' },
  8: { element: 'Earth', colors: 'Yellow, Beige, Brown', season: 'Late Summer' },
  9: { element: 'Fire', colors: 'Red, Purple, Orange', season: 'Summer' },
};


export const NUMBER_MEANINGS = {
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

/**
 * Reduces a number to a single digit by summing its digits repeatedly.
 * @param n - The number to reduce.
 * @returns The single-digit number.
 */
const reduceToSingleDigit = (n: number): number => {
  let num = n;
  while (num > 9) {
    num = String(num)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
};

/**
 * Calculates the Psyche Number from the day of birth.
 * This function does not preserve master numbers.
 * @param day - The day of birth (1-31).
 */
export const calculatePsyche = (day: number): number => {
  return reduceToSingleDigit(day);
};

/**
 * Calculates the Destiny (Life Path) Number from the full date of birth.
 * This function does not preserve master numbers.
 * @param day
 * @param month
 * @param year
 */
export const calculateDestiny = (day: number, month: number, year: number): number => {
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
  const yearSum = String(year)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  const reducedYearSum = reduceToSingleDigit(yearSum);
  
  let kuaResult: number;
  let isCenturyAfter2000 = year >= 2000;

  if (gender.toLowerCase() === 'male') {
      kuaResult = isCenturyAfter2000 ? 9 - reducedYearSum : 11 - reducedYearSum;
  } else { // female
      kuaResult = isCenturyAfter2000 ? reducedYearSum + 6 : reducedYearSum + 4;
  }

  let finalKua = reduceToSingleDigit(kuaResult);
  
  // As per original document, for Kua 5, males default to 2 and females to 8
  if (finalKua === 5) {
      finalKua = gender.toLowerCase() === 'male' ? 2 : 8;
  }
  
  // Kua can be 0, which should be 9
  if (finalKua === 0) {
    finalKua = 9;
  }
  
  return finalKua;
};

export const ARROWS_OF_STRENGTH = [
  {
    name: "Arrow of Planning",
    numbers: [4, 3, 8],
    description: "This is the 1st Vertical Row, indicating the Arrow of Planning & Proper Execution. It gives you shrewdness, cunningness, and intelligence. Your nature can be unethical, like a 'Dirty Player' who doesn't go by the rules. You possess a high degree of intelligence and can be a politician."
  },
  {
    name: "Arrow of Willpower",
    numbers: [9, 5, 1],
    description: "This is the 2nd Vertical Row, indicating the Arrow of Success. You exhibit stubbornness & persistence in your behavior. This behavior leads you towards being victorious in life. You possess a high level of determination and are not hesitant in expressing your opinion about everything."
  },
  {
    name: "Arrow of Action",
    numbers: [2, 7, 6],
    description: "This is the 3rd Vertical Row, also known as the Arrow of Outlook / Action. It signifies a life of activity and practical engagement with the world."
  },
  {
    name: "Arrow of Intellect",
    numbers: [4, 9, 2],
    description: "This is the 1st Horizontal Row, also known as the Brain / Mental plane. You are a thinker with a powerful intellect, an orderly and tidy mind, and excellent memory. You are not easily fooled and are considered a very brainy person."
  },
  {
    name: "Arrow of Spirituality",
    numbers: [3, 5, 7],
    description: "This is the Central Horizontal Row, indicating the Arrow of Emotional Harmony, Emotions, Spiritual Ethics & Values. It leads to contentment, calmness & inner peace after 30-40 years of age. You may come to the field of spirituality after seeing too much trouble in life. It is also known as the Heart / Emotional plane."
  },
  {
    name: "Arrow of Prosperity",
    numbers: [8, 1, 6],
    description: "This is the 3rd Horizontal Row (at the bottom), known as the Action / Practical plane. It indicates a materialistic or commercial success and prosperity with practicality. You are always interested in superficial life & success, and never inclined towards a higher purpose in life. If you have few or no numbers in the upper two rows, you will be cold towards emotions & only focused on self-benefit."
  },
  {
    name: "Arrow of Determination",
    numbers: [2, 5, 8],
    description: "This is a Diagonal Row indicating a strong will and determination. It signifies your resolve and drive to see things through to the end."
  },
  {
    name: "Arrow of Emotional Balance",
    numbers: [4, 5, 6],
    description: "This is the 1st Diagonal Row. You are humanitarian, helping & compassionate by nature, and this often leads you to make your career out of the same. You are psychic, intuitive, sensitive, emotional, caring & understanding. You easily understand the demands of the people around you. You are quite, gentle, generous, shy, and introverted by nature, especially in your young age."
  }
];

export const ARROWS_OF_WEAKNESS = [
  {
    name: "Arrow of Confusion",
    numbers: [4, 9, 2],
    description: "The absence of numbers on the Mental Plane (4, 9, 2) creates the Arrow of Confusion. This may indicate a struggle with mental tasks and a slower thought process. You are likely a person of action rather than a deep thinker and may need to put in extra effort on intellectual pursuits."
  },
  {
    name: "Arrow of Scepticism",
    numbers: [3, 5, 7],
    description: "The absence of numbers on the Emotional Plane (3, 5, 7) creates the Arrow of Scepticism. You tend to be doubtful of things that cannot be proven with logic and fact. You may have a deep-seated disbelief in spiritual or metaphysical matters and can appear insensitive to the emotional needs of others."
  },
  {
    name: "Arrow of Frustration",
    numbers: [8, 1, 6],
    description: "The absence of numbers on the Practical Plane (8, 1, 6) creates the Arrow of Frustration. You may have many great ideas but lack the practical ability or follow-through to bring them to fruition. This can lead to a sense of frustration with your own inability to manifest your goals."
  },
  {
    name: "Arrow of Indecision",
    numbers: [4, 3, 8],
    description: "The absence of numbers in the Thought Plane (4, 3, 8) creates the Arrow of Indecision. You may lack the ability to think things through methodically, leading to a tendency to hesitate and be indecisive when faced with important choices."
  },
  {
    name: "Arrow of Suspicion",
    numbers: [9, 5, 1],
    description: "The absence of numbers in the Will Plane (9, 5, 1) creates the Arrow of Suspicion or the Arrow of Poor Memory. You may lack determination and willpower, and you might also have a tendency to be forgetful or to doubt the intentions of others."
  },
  {
    name: "Arrow of Apathy",
    numbers: [2, 7, 6],
    description: "The absence of numbers in the Action Plane (2, 7, 6) creates the Arrow of Apathy. You may lack the physical drive to put plans into action, preferring to remain passive rather than actively engaging with the world to achieve your goals."
  },
  {
    name: "Arrow of Disappointment",
    numbers: [4, 5, 6],
    description: "The absence of numbers in this Diagonal Row (4, 5, 6) creates the Arrow of Disappointment. You may experience frequent setbacks and feel that life often lets you down. This can foster a pessimistic outlook and a sense of being unsupported in your endeavors."
  },
  {
    name: "Arrow of Doubt",
    numbers: [2, 5, 8],
    description: "The absence of numbers in this Diagonal Row (2, 5, 8) creates the Arrow of Doubt. You may suffer from a lack of self-belief and constantly question your own abilities and decisions, which can hold you back from reaching your full potential."
  }
];

// Defines the shape of the user data object
export interface UserData {
  day: number;
  month: number;
  year: number;
  gender: string;
}

export type NumerologyData = ReturnType<typeof generateLoShuData>;

/**
 * Generates all numerology data including the Lo Shu Grid and arrows.
 * @param userData - An object with day, month, year, gender.
 * @returns An object containing all calculated results.
 */
export const generateLoShuData = ({ day, month, year, gender }: UserData) => {
  // 1. Calculate all core numbers
  const psycheNum = calculatePsyche(day);
  const destinyNum = calculateDestiny(day, month, year);
  // We need the original Kua calculation before it's adjusted for '5' to handle special cases
  const rawKua = reduceToSingleDigit(
    gender.toLowerCase() === 'male' 
      ? (year >= 2000 ? 9 : 11) - reduceToSingleDigit(String(year).split('').reduce((acc, d) => acc + parseInt(d, 10), 0))
      : (year >= 2000 ? 6 : 4) + reduceToSingleDigit(String(year).split('').reduce((acc, d) => acc + parseInt(d, 10), 0))
  );
  const kuaNum = calculateKua(year, gender);

  // 2. Get Kua Directions
  let auspiciousDirections;
  // Use the raw, pre-adjustment Kua for Kua 5 gender split
  if (rawKua === 5) {
      auspiciousDirections = KUA_DIRECTIONS[5][gender.toLowerCase() as 'male' | 'female'];
  } else {
      auspiciousDirections = KUA_DIRECTIONS[kuaNum];
  }
  
  // 3. Get Kua Attributes
  const kuaAttributes = KUA_ATTRIBUTES[kuaNum] || { element: 'N/A', colors: 'N/A', season: 'N/A' };


  // 4. Aggregate ALL digits for the grid
  const birthDigits = (String(day) + String(month) + String(year))
    .split('')
    .filter(d => d !== '0');
    
  const allDigitsForGrid = [
    ...birthDigits,
    ...String(psycheNum).split(''),
    ...String(destinyNum).split(''),
    ...String(kuaNum).split(''),
  ];
  
  const presentDigits = new Set(allDigitsForGrid.map(d => parseInt(d, 10)));

  // 5. Count frequencies and create grid data
  const counts: { [key: string]: number } = {};
  for (const digit of allDigitsForGrid) {
    counts[digit] = (counts[digit] || 0) + 1;
  }

  const gridContent: { [key: string]: string } = {};
  for (let i = 1; i <= 9; i++) {
    const digitStr = String(i);
    gridContent[digitStr] = counts[digitStr] ? digitStr.repeat(counts[digitStr]) : '';
  }

  // 6. Arrange data into a 2D array for rendering
  const gridLayout = [
    [gridContent['4'], gridContent['9'], gridContent['2']],
    [gridContent['3'], gridContent['5'], gridContent['7']],
    [gridContent['8'], gridContent['1'], gridContent['6']],
  ];

  // 7. Determine present arrows of strength
  const arrowsOfStrength = ARROWS_OF_STRENGTH.filter(arrow => 
    arrow.numbers.every(num => presentDigits.has(num))
  );

  // 8. Determine present arrows of weakness
  const arrowsOfWeakness = ARROWS_OF_WEAKNESS.filter(arrow =>
    arrow.numbers.every(num => !presentDigits.has(num))
  );
  
  // 9. Return all calculated data
  return {
    psycheNum,
    destinyNum,
    kuaNum,
    loShuGrid: gridLayout,
    allDigitsForGrid: allDigitsForGrid,
    arrowsOfStrength,
    arrowsOfWeakness,
    auspiciousDirections,
    kuaAttributes,
  };
};
