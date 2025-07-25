
'use server';

/**
 * @fileOverview A flow to get insights based on personal data.
 * - getAstroInsight - A function that returns insights for a given person.
 * - AstroInsightInput - The input type for the getAstroInsight function.
 * - AstroInsightOutput - The return type for the getAstroInsight function.
 */
import {ai} from '@/ai/genkit';
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
    compatibilities: z.record(z.string()),
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


const insightPrompt = ai.definePrompt({
    name: 'astroInsightPrompt',
    input: { schema: z.object({ name: z.string(), new_astrology_sign: z.string(), western_sign: z.string(), sign: z.string(), element: z.string() }) },
    output: { schema: z.object({ reading: z.string(), luckyNumber: z.number(), luckyColor: z.string() }) },
    prompt: `You are an expert astrologer. Based on the following information, generate a short, insightful, and positive astrological reading (2-3 sentences) for {{name}}. Also, provide a lucky number and a lucky color.

- Name: {{name}}
- Western Zodiac Sign: {{western_sign}}
- Chinese Zodiac Sign: {{sign}}
- Chinese Zodiac Element: {{element}}
- Combined New Astrology Sign: {{new_astrology_sign}}
`,
});


const getAstroInsightFlow = ai.defineFlow(
  {
    name: 'getAstroInsightFlow',
    inputSchema: AstroInsightInputSchema,
    outputSchema: AstroInsightOutputSchema,
  },
  async (input) => {
    const { year, month, day, name } = input;
    
    // 1. Determine Zodiac signs
    const western_sign = getWesternZodiacSign(day, month);
    const { sign, element } = getChineseZodiacSign(day, month, year);
    const new_astrology_sign = `${western_sign}/${sign}`;

    // 2. Get the entire data object for that sign
    const signData = (zodiacData as any)[sign];
    if (!signData) {
      throw new Error(`No zodiac data found for sign: ${sign}`);
    }

    // 3. Generate AI-powered reading
    const { output } = await insightPrompt({ name, new_astrology_sign, western_sign, sign, element });
    if (!output) {
        throw new Error('Failed to generate AI insight.');
    }
    
    // 4. Return combined data
    return {
        name,
        western_sign,
        new_astrology_sign,
        sign,
        element,
        reading: output.reading,
        luckyNumber: output.luckyNumber,
        luckyColor: output.luckyColor,
        signData: signData,
    };
  }
);


export async function getAstroInsight(input: AstroInsightInput): Promise<AstroInsightOutput> {
    return getAstroInsightFlow(input);
}
