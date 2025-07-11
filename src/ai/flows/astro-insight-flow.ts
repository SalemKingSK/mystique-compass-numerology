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
});
export type AstroInsightOutput = z.infer<typeof AstroInsightOutputSchema>;

export async function getAstroInsight(input: AstroInsightInput): Promise<AstroInsightOutput> {
  return astroInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'astroInsightPrompt',
  input: {schema: AstroInsightInputSchema},
  output: {schema: AstroInsightOutputSchema},
  prompt: `You are an expert astrologer. Provide a detailed and positive astrological reading for the following person:

Name: {{{name}}}
Date of Birth: {{{day}}}/{{{month}}}/{{{year}}}
Gender: {{{gender}}}

Generate a personal reading, a lucky number, and a lucky color.
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
