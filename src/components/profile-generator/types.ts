

// src/components/profile-generator/types.ts

// This is the data that the user provides
export interface AstroInsightInput {
  name: string;
  day: number;
  month: number;
  year: number;
  gender: string;
}

export interface ZodiacData {
  introduction?: string;
  elements?: { [key: string]: string };
  compatibilities?: { [key: string]: string };
  futures?: { [key: string]: { year: string; element: string; prediction: string } };
}

// Data for the combined "New Astrology" signs
export interface NewAstroSignData {
  description?: string;
  love?: string;
  compatibilities?: string;
  homeAndFamily?: string;
  profession?: string;
}

// This is the data returned from the astrology calculation
export interface AstroInsightOutput {
  name: string;
  western_sign: string;
  sign: string; // e.g., "Pig"
  element: string; // e.g., "Wood"
  new_astrology_sign: string; // e.g. "Pisces/Snake"
  zodiacData: ZodiacData; // Holds all data for the Chinese sign
  signData: NewAstroSignData; // Holds all data for the combined New Astrology sign
}

// This is the data returned from the numerology calculation
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
  repeatedNumberMeanings: { [key: string]: string };
  arrowsOfStrength: ArrowData[];
  arrowsOfWeakness: ArrowData[];
}


