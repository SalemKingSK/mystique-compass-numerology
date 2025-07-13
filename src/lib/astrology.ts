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

// The complete Chinese Calendar data from 1920 to 2025
export const CHINESE_CALENDAR = [
    { year: 1920, sign: 'Monkey', element: 'Metal', start: [2, 20] },
    { year: 1921, sign: 'Rooster', element: 'Metal', start: [2, 8] },
    { year: 1922, sign: 'Dog', element: 'Water', start: [1, 28] },
    { year: 1923, sign: 'Pig', element: 'Water', start: [2, 16] },
    { year: 1924, sign: 'Rat', element: 'Wood', start: [2, 5] },
    { year: 1925, sign: 'Ox', element: 'Wood', start: [1, 25] },
    { year: 1926, sign: 'Tiger', element: 'Fire', start: [2, 13] },
    { year: 1927, sign: 'Rabbit', element: 'Fire', start: [2, 2] },
    { year: 1928, sign: 'Dragon', element: 'Earth', start: [1, 23] },
    { year: 1929, sign: 'Snake', element: 'Earth', start: [2, 10] },
    { year: 1930, sign: 'Horse', element: 'Metal', start: [1, 30] },
    { year: 1931, sign: 'Goat', element: 'Metal', start: [2, 17] },
    { year: 1932, sign: 'Monkey', element: 'Water', start: [2, 6] },
    { year: 1933, sign: 'Rooster', element: 'Water', start: [1, 26] },
    { year: 1934, sign: 'Dog', element: 'Wood', start: [2, 14] },
    { year: 1935, sign: 'Pig', element: 'Wood', start: [2, 4] },
    { year: 1936, sign: 'Rat', element: 'Fire', start: [1, 24] },
    { year: 1937, sign: 'Ox', element: 'Fire', start: [2, 11] },
    { year: 1938, sign: 'Tiger', element: 'Earth', start: [1, 31] },
    { year: 1939, sign: 'Rabbit', element: 'Earth', start: [2, 19] },
    { year: 1940, sign: 'Dragon', element: 'Metal', start: [2, 8] },
    { year: 1941, sign: 'Snake', element: 'Metal', start: [1, 27] },
    { year: 1942, sign: 'Horse', element: 'Water', start: [2, 15] },
    { year: 1943, sign: 'Goat', element: 'Water', start: [2, 5] },
    { year: 1944, sign: 'Monkey', element: 'Wood', start: [1, 25] },
    { year: 1945, sign: 'Rooster', element: 'Wood', start: [2, 13] },
    { year: 1946, sign: 'Dog', element: 'Fire', start: [2, 2] },
    { year: 1947, sign: 'Pig', element: 'Fire', start: [1, 22] },
    { year: 1948, sign: 'Rat', element: 'Earth', start: [2, 10] },
    { year: 1949, sign: 'Ox', element: 'Earth', start: [1, 29] },
    { year: 1950, sign: 'Tiger', element: 'Metal', start: [2, 17] },
    { year: 1951, sign: 'Rabbit', element: 'Metal', start: [2, 6] },
    { year: 1952, sign: 'Dragon', element: 'Water', start: [1, 27] },
    { year: 1953, sign: 'Snake', element: 'Water', start: [2, 14] },
    { year: 1954, sign: 'Horse', element: 'Wood', start: [2, 3] },
    { year: 1955, sign: 'Goat', element: 'Wood', start: [1, 24] },
    { year: 1956, sign: 'Monkey', element: 'Fire', start: [2, 12] },
    { year: 1957, sign: 'Rooster', element: 'Fire', start: [1, 31] },
    { year: 1958, sign: 'Dog', element: 'Earth', start: [2, 18] },
    { year: 1959, sign: 'Pig', element: 'Earth', start: [2, 8] },
    { year: 1960, sign: 'Rat', element: 'Metal', start: [1, 28] },
    { year: 1961, sign: 'Ox', element: 'Metal', start: [2, 15] },
    { year: 1962, sign: 'Tiger', element: 'Water', start: [2, 5] },
    { year: 1963, sign: 'Rabbit', element: 'Water', start: [1, 25] },
    { year: 1964, sign: 'Dragon', element: 'Wood', start: [2, 13] },
    { year: 1965, sign: 'Snake', element: 'Wood', start: [2, 2] },
    { year: 1966, sign: 'Horse', element: 'Fire', start: [1, 21] },
    { year: 1967, sign: 'Goat', element: 'Fire', start: [2, 9] },
    { year: 1968, sign: 'Monkey', element: 'Earth', start: [1, 30] },
    { year: 1969, sign: 'Rooster', element: 'Earth', start: [2, 17] },
    { year: 1970, sign: 'Dog', element: 'Metal', start: [2, 6] },
    { year: 1971, sign: 'Pig', element: 'Metal', start: [1, 27] },
    { year: 1972, sign: 'Rat', element: 'Water', start: [2, 15] },
    { year: 1973, sign: 'Ox', element: 'Water', start: [2, 3] },
    { year: 1974, sign: 'Tiger', element: 'Wood', start: [1, 23] },
    { year: 1975, sign: 'Rabbit', element: 'Wood', start: [2, 11] },
    { year: 1976, sign: 'Dragon', element: 'Fire', start: [1, 31] },
    { year: 1977, sign: 'Snake', element: 'Fire', start: [2, 18] },
    { year: 1978, sign: 'Horse', element: 'Earth', start: [2, 7] },
    { year: 1979, sign: 'Goat', element: 'Earth', start: [1, 28] },
    { year: 1980, 'sign': 'Monkey', 'element': 'Metal', start: [2, 16] },
    { year: 1981, 'sign': 'Rooster', 'element': 'Metal', start: [2, 5] },
    { year: 1982, 'sign': 'Dog', 'element': 'Water', start: [1, 25] },
    { year: 1983, 'sign': 'Pig', 'element': 'Water', start: [2, 13] },
    { year: 1984, 'sign': 'Rat', 'element': 'Wood', start: [2, 2] },
    { year: 1985, 'sign': 'Ox', 'element': 'Wood', start: [2, 20] },
    { year: 1986, 'sign': 'Tiger', 'element': 'Fire', start: [2, 9] },
    { year: 1987, 'sign': 'Rabbit', 'element': 'Fire', start: [1, 29] },
    { year: 1988, 'sign': 'Dragon', 'element': 'Earth', start: [2, 17] },
    { year: 1989, 'sign': 'Snake', 'element': 'Earth', start: [2, 6] },
    { year: 1990, 'sign': 'Horse', 'element': 'Metal', start: [1, 27] },
    { year: 1991, 'sign': 'Goat', 'element': 'Metal', start: [2, 15] },
    { year: 1992, 'sign': 'Monkey', 'element': 'Water', start: [2, 4] },
    { year: 1993, 'sign': 'Rooster', 'element': 'Water', start: [1, 23] },
    { year: 1994, 'sign': 'Dog', 'element': 'Wood', start: [2, 10] },
    { year: 1995, 'sign': 'Pig', 'element': 'Wood', start: [1, 31] },
    { year: 1996, 'sign': 'Rat', 'element': 'Fire', start: [2, 19] },
    { year: 1997, 'sign': 'Ox', 'element': 'Fire', start: [2, 7] },
    { year: 1998, 'sign': 'Tiger', 'element': 'Earth', start: [1, 28] },
    { year: 1999, 'sign': 'Rabbit', 'element': 'Earth', start: [2, 16] },
    { year: 2000, 'sign': 'Dragon', 'element': 'Metal', start: [2, 5] },
    { year: 2001, 'sign': 'Snake', 'element': 'Metal', start: [1, 24] },
    { year: 2002, 'sign': 'Horse', 'element': 'Water', start: [2, 12] },
    { year: 2003, 'sign': 'Goat', 'element': 'Water', start: [2, 1] },
    { year: 2004, 'sign': 'Monkey', 'element': 'Wood', start: [1, 22] },
    { year: 2005, 'sign': 'Rooster', 'element': 'Wood', start: [2, 9] },
    { year: 2006, 'sign': 'Dog', 'element': 'Fire', start: [1, 29] },
    { year: 2007, 'sign': 'Pig', 'element': 'Fire', start: [2, 18] },
    { year: 2008, 'sign': 'Rat', 'element': 'Earth', start: [2, 7] },
    { year: 2009, 'sign': 'Ox', 'element': 'Earth', start: [1, 26] },
    { year: 2010, 'sign': 'Tiger', 'element': 'Metal', start: [2, 14] },
    { year: 2011, 'sign': 'Rabbit', 'element': 'Metal', start: [2, 3] },
    { year: 2012, 'sign': 'Dragon', 'element': 'Water', start: [1, 23] },
    { year: 2013, 'sign': 'Snake', 'element': 'Water', start: [2, 10] },
    { year: 2014, 'sign': 'Horse', 'element': 'Wood', start: [1, 31] },
    { year: 2015, 'sign': 'Goat', 'element': 'Wood', start: [2, 19] },
    { year: 2016, 'sign': 'Monkey', 'element': 'Fire', start: [2, 8] },
    { year: 2017, 'sign': 'Rooster', 'element': 'Fire', start: [1, 28] },
    { year: 2018, sign: 'Dog', element: 'Earth', start: [2, 16] },
    { year: 2019, 'sign': 'Pig', 'element': 'Earth', start: [2, 5] },
    { year: 2020, 'sign': 'Rat', 'element': 'Metal', start: [1, 25] },
    { year: 2021, 'sign': 'Ox', 'element': 'Metal', start: [2, 12] },
    { year: 2022, 'sign': 'Tiger', 'element': 'Water', start: [2, 1] },
    { year: 2023, 'sign': 'Rabbit', 'element': 'Water', start: [1, 22] },
    { year: 2024, 'sign': 'Dragon', 'element': 'Wood', start: [2, 10] },
    { year: 2025, 'sign': 'Snake', 'element': 'Wood', start: [1, 29] },
];

export const getChineseZodiacSign = (day: number, month: number, year: number) => {
  // Find the Chinese New Year (CNY) date for the user's birth year.
  const cnyEntryForBirthYear = CHINESE_CALENDAR.find(entry => entry.year === year);
  
  let effectiveZodiacYear = year;

  // If we have an entry for the birth year, check if the birth date is before that year's CNY.
  if (cnyEntryForBirthYear && cnyEntryForBirthYear.start) {
    const cnyMonth = cnyEntryForBirthYear.start[0];
    const cnyDay = cnyEntryForBirthYear.start[1];

    // If born before this year's CNY, the effective zodiac year is the previous year.
    if (month < cnyMonth || (month === cnyMonth && day < cnyDay)) {
      effectiveZodiacYear = year - 1;
    }
  } else {
      // This is a fallback for edge cases like years missing from the calendar
      // or dates very early in the year before the typical CNY range.
      if (month === 1 || (month === 2 && day < 4)) {
          effectiveZodiacYear = year - 1;
      }
  }

  // Now, find the zodiac sign and element for the determined effective year.
  const finalZodiacEntry = CHINESE_CALENDAR.find(entry => entry.year === effectiveZodiacYear);

  if (finalZodiacEntry) {
    return {
      sign: finalZodiacEntry.sign,
      element: finalZodiacEntry.element,
    };
  }
  
  // Fallback if the effective year is somehow still not found (e.g., trying a year before 1920).
  return { sign: 'Unknown', element: 'Unknown' };
};
