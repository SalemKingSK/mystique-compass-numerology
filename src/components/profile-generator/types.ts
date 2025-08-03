
// src/components/profile-generator/types.ts

// This is the data that the user provides
export interface AstroInsightInput {
  name: string;
  day: number;
  month: number;
  year: number;
  gender: string;
}

// This is the data returned from the astrology calculation
export interface AstroInsightOutput {
  name: string;
  western_sign: string;
  new_astrology_sign: string;
  sign: string;
  element: string;
  reading: string;
  luckyNumber: number;
  luckyColor: string;
  signData: {
    introduction: string;
    elements: any;
    compatibilities: any;
    futures: any;
    description?: string;
    love?: string;
    homeAndFamily?: string;
    profession?: string;
  };
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
  arrowsOfStrength: ArrowData[];
  arrowsOfWeakness: ArrowData[];
}

    