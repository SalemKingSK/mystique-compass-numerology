'use server';

/**
 * @fileOverview A flow to get insights based on personal data.
 * - getAstroInsight - A function that returns insights for a given person.
 * - AstroInsightInput - The input type for the getAstroInsight function.
 * - AstroInsightOutput - The return type for the getAstroInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  reading: z.string().describe('A detailed astrological reading for the person.'),
  luckyNumber: z.number().describe('A lucky number for the person.'),
  luckyColor: z.string().describe('A lucky color for the person.'),
  new_astrology_sign: z.string().describe('The combined New Astrology sign (e.g., "Aries/Dragon").'),
  western_sign: z.string().describe('The Western zodiac sign (e.g., "Aries").'),
  element: z.string().describe('The Chinese zodiac element (e.g., "Wood").'),
  sign: z.string().describe('The Chinese zodiac animal sign (e.g., "Dragon").'),
  psyche_num: z.number().describe('The Psyche number from numerology.'),
  destiny_num: z.number().describe('The Destiny number from numerology.'),
  kua_num: z.number().describe('The Kua number from numerology.'),
  lo_shu_grid: z.array(z.array(z.nullable(z.number()))).describe('A 3x3 Lo Shu grid, represented as a 2D array. Empty cells should be null.'),
  found_arrows: z.array(z.object({
    name: z.string().describe('The name of the found arrow of strength.'),
    description: z.string().describe('The description of the arrow of strength.'),
  })).describe('The arrows of strength found in the numerology chart.'),
  number_analysis: z.array(z.object({
    number: z.number().describe('The number being analyzed.'),
    count: z.number().describe('How many times the number appears.'),
    meaning: z.string().describe('The meaning of the repeated number.'),
  })).describe('Analysis of repeated numbers in the chart.'),
  general_desc: z.string().describe('A general description of the Chinese animal sign.'),
  elemental_desc: z.string().describe('A description of the element\'s influence on the sign.'),
  compatibilities: z.string().describe('A description of the sign\'s compatibilities.'),
  future_predictions: z.record(z.object({
      element: z.string(),
      year: z.string(),
      prediction: z.string()
  })).describe('Predictions for future years based on the Chinese zodiac. The key should be the year.'),
  new_astrology_desc: z.string().describe('A description of the combined New Astrology sign.'),
});
export type AstroInsightOutput = z.infer<typeof AstroInsightOutputSchema>;

export async function getAstroInsight(input: AstroInsightInput): Promise<AstroInsightOutput> {
  return astroInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'astroInsightPrompt',
  input: {schema: AstroInsightInputSchema},
  output: {schema: AstroInsightOutputSchema},
  prompt: `You are an expert astrologer and numerologist. You combine Western and Chinese astrology with numerology to provide a comprehensive "New Astrology" profile.

For the person with the following details:
Name: {{{name}}}
Date of Birth: {{{day}}}/{{{month}}}/{{{year}}}
Gender: {{{gender}}}

Please generate a complete profile including:
1.  **Core Information**: Western sign, Chinese animal sign, and element.
2.  **New Astrology**: Their combined sign and a detailed description.
3.  **Numerology**:
    *   Calculate their Psyche, Destiny, and Kua numbers.
    *   Create their 3x3 Lo Shu grid. Represent empty cells with null.
    *   Identify any "Arrows of Strength" and describe them.
    *   Analyze any repeated numbers in their birth date and describe the meaning.
4.  **Chinese Zodiac**:
    *   Provide a general description of their animal sign.
    *   Describe the influence of their element on their sign.
    *   Detail their compatibilities.
    *   Provide predictions for the next 3 relevant animal years.
5.  **Simple Profile**: Also provide a simple reading, a lucky number, and a lucky color.
  `,
});

const astroInsightFlow = ai.defineFlow(
  {
    name: 'astroInsightFlow',
    inputSchema: AstroInsightInputSchema,
    outputSchema: AstroInsightOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
