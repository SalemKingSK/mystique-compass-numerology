'use server';

/**
 * @fileOverview A flow to get insights about celestial objects.
 * - getAstroInsight - A function that returns insights for a given celestial object.
 * - AstroInsightInput - The input type for the getAstroInsight function.
 * - AstroInsightOutput - The return type for the getAstroInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AstroInsightInputSchema = z.object({
  celestialObject: z
    .string()
    .describe('The name of the celestial object to get insights for. Example: "Mars"'),
});
export type AstroInsightInput = z.infer<typeof AstroInsightInputSchema>;

const AstroInsightOutputSchema = z.object({
  name: z.string().describe('The name of the celestial object.'),
  type: z.string().describe('The type of celestial object (e.g., Planet, Star, Galaxy).'),
  description: z.string().describe('A detailed description of the celestial object.'),
  facts: z.array(z.string()).describe('A list of interesting facts about the celestial object.'),
});
export type AstroInsightOutput = z.infer<typeof AstroInsightOutputSchema>;

export async function getAstroInsight(input: AstroInsightInput): Promise<AstroInsightOutput> {
  return astroInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'astroInsightPrompt',
  input: {schema: AstroInsightInputSchema},
  output: {schema: AstroInsightOutputSchema},
  prompt: `You are an expert astronomer. Provide detailed insights about the following celestial object: {{{celestialObject}}}.

  Provide a detailed description and a list of interesting facts.
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
