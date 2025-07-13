// src/lib/astrology.ts

// Helper function to get the Western Zodiac sign
export const getWesternZodiacSign = (day: number, month: number): string => {
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  // Default to Capricorn for days outside the ranges (e.g., Dec 22 - Jan 19)
  return "Capricorn";
};

// Helper function to get the Chinese Zodiac sign and element
export const getChineseZodiacSign = (year: number): { sign: string, element: string } => {
  const animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  const elements = ["Wood", "Fire", "Earth", "Metal", "Water"];
  const epoch = 1924; // A Rat year and a Wood year
  
  const yearDiff = year - epoch;

  const signIndex = yearDiff % 12;
  const sign = animals[signIndex >= 0 ? signIndex : signIndex + 12];
  
  // This formula correctly handles years before and after the epoch.
  const elementIndex = Math.floor(yearDiff / 2) % 5;
  const element = elements[elementIndex >= 0 ? elementIndex : elementIndex + 5];

  return { sign, element };
};
