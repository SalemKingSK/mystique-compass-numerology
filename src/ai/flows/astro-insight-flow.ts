
'use server';

/**
 * @fileOverview A flow to get insights based on personal data.
 * - getAstroInsight - A function that returns insights for a given person.
 * - AstroInsightInput - The input type for the getAstroInsight function.
 * - AstroInsightOutput - The return type for the getAstroInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { zodiac_data } from '@/lib/zodiac';
import {getChineseZodiacSign, getWesternZodiacSign} from '@/lib/astrology';

const AstroInsightInputSchema = z.object({
  name: z.string().describe('The full name of the person.'),
  day: z.number().describe('The day of birth.'),
  month: z.number().describe('The month of birth.'),
  year: z.number().describe('The year of birth.'),
  gender: z.string().describe('The gender of the person.'),
});
export type AstroInsightInput = z.infer<typeof AstroInsightInputSchema>;

const AstroInsightOutputSchema = z.object({
  name: z.string().describe("The person's name."),
  reading: z.string().describe('A simple, AI-powered astrological reading for the person.'),
  luckyNumber: z.number().describe('A lucky number for the person.'),
  luckyColor: z.string().describe('A lucky color for the person.'),
  new_astrology_sign: z.string().describe('The combined New Astrology sign (e.g., "Aries/Dragon").'),
  western_sign: z.string().describe('The Western zodiac sign (e.g., "Aries").'),
  element: z.string().describe('The Chinese zodiac element (e.g., "Wood").'),
  sign: z.string().describe('The Chinese zodiac animal sign (e.g., "Dragon").'),
  introduction: z.string().describe('A general description of the Chinese animal sign.'),
  elemental_desc: z.string().describe("A description of the element's influence on the sign."),
  compatibilities: z.string().describe("A description of the sign's compatibilities."),
  new_astrology_desc: z.string().describe('A unique, personalized description for the combined New Astrology sign.'),
});
export type AstroInsightOutput = z.infer<typeof AstroInsightOutputSchema>;

export async function getAstroInsight(input: AstroInsightInput): Promise<AstroInsightOutput> {
  return astroInsightFlow(input);
}

const CreativePromptInputSchema = z.object({
    name: z.string(),
    western_sign: z.string(),
    chinese_sign: z.string(),
    element: z.string(),
    new_astrology_sign: z.string(),
});

const CreativePromptOutputSchema = z.object({
    reading: z.string().describe('A simple, AI-powered astrological reading for the person.'),
    luckyNumber: z.number().describe('A lucky number for the person.'),
    luckyColor: z.string().describe('A lucky color for the person.'),
    new_astrology_desc: z.string().describe('A unique, personalized description for the combined New Astrology sign.'),
});


const creativePrompt = ai.definePrompt({
  name: 'astroCreativePrompt',
  input: {schema: CreativePromptInputSchema},
  output: {schema: CreativePromptOutputSchema},
  prompt: `You are an expert astrologer. For the person named {{{name}}}, who is a {{{new_astrology_sign}}} ({{{western_sign}}} and {{{element}}} {{{chinese_sign}}}), generate the following:
1. A unique, personalized description for this combined "New Astrology" sign.
2. A simple, AI-powered astrological reading.
3. A lucky number.
4. A lucky color.`,
});

const astroInsightFlow = ai.defineFlow(
  {
    name: 'astroInsightFlow',
    inputSchema: AstroInsightInputSchema,
    outputSchema: AstroInsightOutputSchema,
  },
  async (input) => {
    const { year, month, day, name } = input;
    
    // Determine Zodiac signs and data
    const western_sign = getWesternZodiacSign(day, month);
    const { sign, element } = getChineseZodiacSign(year);
    const new_astrology_sign = `${western_sign}/${sign}`;
    const signData = zodiac_data[sign as keyof typeof zodiac_data];

    // Check for missing data
    if (!signData || !signData.introduction || signData.introduction.startsWith('PENDING')) {
        throw new Error(`Zodiac data for "${sign}" is incomplete. Please add it to zodiac.ts.`);
    }

    // Generate creative content
    const creativeResult = await creativePrompt({
        name,
        western_sign,
        chinese_sign: sign,
        element,
        new_astrology_sign,
    });
    const { output: creativeData } = creativeResult;

    if (!creativeData) {
        throw new Error('Failed to generate creative content from the AI model.');
    }

    // Combine generated and static data
    return {
        name,
        reading: creativeData.reading,
        luckyNumber: creativeData.luckyNumber,
        luckyColor: creativeData.luckyColor,
        new_astrology_sign,
        western_sign,
        element,
        sign,
        introduction: signData.introduction,
        elemental_desc: signData.elements[element as keyof typeof signData.elements],
        compatibilities: signData.compatibilities,
        new_astrology_desc: creativeData.new_astrology_desc,
    };
  }
);
