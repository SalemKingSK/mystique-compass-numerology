'use server';

/**
 * @fileOverview A flow to personalize a numerology reading based on the user's chart.
 * - personalizeReading - A function that rewrites a conditional reading to be a definitive one.
 * - PersonalizeReadingInput - The input type for the personalizeReading function.
 * - PersonalizeReadingOutput - The return type for the personalizeReading function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeReadingInputSchema = z.object({
  reading: z.string().describe('The conditional numerology reading text.'),
  numbers: z.array(z.number()).describe("An array of all numbers present in the user's numerology chart."),
});
export type PersonalizeReadingInput = z.infer<typeof PersonalizeReadingInputSchema>;

const PersonalizeReadingOutputSchema = z.object({
  personalizedReading: z.string().describe('The personalized, definitive numerology reading.'),
});
export type PersonalizeReadingOutput = z.infer<typeof PersonalizeReadingOutputSchema>;

export async function personalizeReading(input: PersonalizeReadingInput): Promise<PersonalizeReadingOutput> {
  return personalizeReadingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeReadingPrompt',
  input: {schema: PersonalizeReadingInputSchema},
  output: {schema: PersonalizeReadingOutputSchema},
  prompt: `You are an expert numerologist. You will be given a generic, conditional numerology reading and a list of numbers present in a person's chart. Your task is to rewrite the reading to be definitive and specific to that person.

**Rules:**
1.  Analyze the conditional phrases in the reading (e.g., "if supported by X and Y," "if X is not present," "if you have Z").
2.  Check the provided list of numbers to see if those conditions are met.
3.  Rewrite the reading to be a direct, confident statement based on whether the conditions are true or false for this specific person.
4.  Remove all conditional language ("if," "when," "supported by"). The new reading must be a direct analysis.
5.  Maintain the original tone and core meaning of the reading.

**Example:**
*   **Original Reading:** "You have a good financial level, as 6 & 8 are also in this plane."
*   **Person's Numbers:** [1, 9, 9, 3, 4, 7] (No 6 or 8)
*   **Personalized Reading:** "You face difficulty in communication & expression. You can communicate by other means, like writing or art, but find it hard to fully commit to one thing. You may find it difficult to understand others' points of view." (The part about finances is omitted because the condition was not met).

*   **Original Reading:** "You develop a concept of life & evolve spiritually with faith & devotion when there is support of 5 & 7."
*   **Person's Numbers:** [3, 3, 7, 9] (Has 7, but not 5)
*   **Personalized Reading:** "Because you have the number 7, you are on a path to developing your spiritual side with devotion, though this development may be focused and specific rather than broad."

**Input Reading:**
{{{reading}}}

**Person's Numbers:**
{{#each numbers}}- {{this}}
{{/each}}
`,
});

const personalizeReadingFlow = ai.defineFlow(
  {
    name: 'personalizeReadingFlow',
    inputSchema: PersonalizeReadingInputSchema,
    outputSchema: PersonalizeReadingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
