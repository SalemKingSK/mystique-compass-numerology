
'use server';

/**
 * @fileOverview A flow to get insights based on personal data.
 * - getAstroInsight - A function that returns insights for a given person.
 * - AstroInsightInput - The input type for the getAstroInsight function.
 * - AstroInsightOutput - The return type for the getAstroInsight function.
 */

import { z } from 'zod';
import { zodiacData } from '@/lib/zodiac';
import { getChineseZodiacSign, getWesternZodiacSign } from '@/lib/astrology';

const AstroInsightInputSchema = z.object({
  name: z.string().describe('The full name of the person.'),
  day: z.number().describe('The day of birth.'),
  month: z.number().describe('The month of birth.'),
  year: z.number().describe('The year of birth.'),
  gender: z.string().describe('The gender of the person.'),
});
export type AstroInsightInput = z.infer<typeof AstroInsightInputSchema>;

// Define a Zod schema for the futures object
const FuturePredictionSchema = z.object({
  year: z.string(),
  element: z.string(),
  prediction: z.string(),
});

// Define a schema for the main sign data structure
const SignDataSchema = z.object({
    introduction: z.string(),
    elements: z.record(z.string()),
    compatibilities: z.string(),
    futures: z.record(FuturePredictionSchema),
});

const AstroInsightOutputSchema = z.object({
  name: z.string().describe("The person's name."),
  western_sign: z.string().describe('The Western zodiac sign (e.g., "Aries").'),
  new_astrology_sign: z.string().describe('The combined New Astrology sign (e.g., "Aries/Dragon").'),
  sign: z.string().describe('The Chinese zodiac animal sign (e.g., "Dragon").'),
  element: z.string().describe('The Chinese zodiac element (e.g., "Wood").'),
  reading: z.string().describe('A simple, AI-powered astrological reading for the person.'),
  luckyNumber: z.number().describe('A lucky number for the person.'),
  luckyColor: z.string().describe('A lucky color for the person.'),
  signData: SignDataSchema.describe("The detailed data object for the person's Chinese zodiac sign."),
});
export type AstroInsightOutput = z.infer<typeof AstroInsightOutputSchema>;

export async function getAstroInsight(input: AstroInsightInput): Promise<AstroInsightOutput> {
    const { year, month, day, name } = input;
    
    // 1. Determine Zodiac signs
    const western_sign = getWesternZodiacSign(day, month);
    const { sign, element } = getChineseZodiacSign(day, month, year);
    const new_astrology_sign = `${western_sign}/${sign}`;

    // 2. Get the entire data object for that sign
    // The type assertion is safe because our zodiacData is statically typed.
    const signData = (zodiacData as any)[sign];
    if (!signData) {
      throw new Error(`No zodiac data found for sign: ${sign}`);
    }
    
    // 3. Return combined data without AI generation.
    return {
        name,
        western_sign,
        new_astrology_sign,
        sign,
        element,
        // Provide empty values for the removed AI fields
        reading: '',
        luckyNumber: 0,
        luckyColor: '',
        signData: signData,
    };
}
