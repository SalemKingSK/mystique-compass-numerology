'use server';

/**
 * @fileOverview This file defines a Genkit flow to interpret the selections made during the 'firebase init' command
 * and provide customized setup guidance using GenAI.
 *
 * - interpretFirebaseInit - A function that handles the interpretation of firebase init selections and provides guidance.
 * - InterpretFirebaseInitInput - The input type for the interpretFirebaseInit function.
 * - InterpretFirebaseInitOutput - The return type for the interpretFirebaseInit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretFirebaseInitInputSchema = z.object({
  featureSelections: z
    .string()
    .describe(
      'A string containing the features selected during the firebase init command. Example: \'firestore, functions, hosting\''
    ),
});
export type InterpretFirebaseInitInput = z.infer<typeof InterpretFirebaseInitInputSchema>;

const InterpretFirebaseInitOutputSchema = z.object({
  guidance: z.string().describe('Customized setup guidance based on the selected Firebase features.'),
});
export type InterpretFirebaseInitOutput = z.infer<typeof InterpretFirebaseInitOutputSchema>;

export async function interpretFirebaseInit(input: InterpretFirebaseInitInput): Promise<InterpretFirebaseInitOutput> {
  return interpretFirebaseInitFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretFirebaseInitPrompt',
  input: {schema: InterpretFirebaseInitInputSchema},
  output: {schema: InterpretFirebaseInitOutputSchema},
  prompt: `You are a Firebase expert. A user has selected the following features during firebase init: {{{featureSelections}}}.

  Provide clear and concise setup guidance, explaining the implications of their choices and suggesting next steps for effective Firebase configuration.`,
});

const interpretFirebaseInitFlow = ai.defineFlow(
  {
    name: 'interpretFirebaseInitFlow',
    inputSchema: InterpretFirebaseInitInputSchema,
    outputSchema: InterpretFirebaseInitOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
