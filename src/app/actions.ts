'use server';

import { getAstroInsight, type AstroInsightInput } from '@/ai/flows/astro-insight-flow';
import { generateLoShuData } from '@/lib/numerology';
import { textToSpeech } from '@/ai/flows/text-to-speech-flow';

export async function getAstroInsightAction(formData: AstroInsightInput) {
  try {
    if (!formData.name || !formData.day || !formData.month || !formData.year || !formData.gender) {
      return { success: false, error: 'Please fill out all fields.' };
    }
    
    // Generate both results in parallel
    const [insightResult, numerologyResult] = await Promise.all([
        getAstroInsight(formData),
        generateLoShuData(formData)
    ]);


    return { success: true, insight: insightResult, numerology: numerologyResult };
  } catch (error) {
    console.error('Error getting insight:', error);
    return { success: false, error: 'An error occurred while fetching insights. Please try again.' };
  }
}

export async function textToSpeechAction(text: string): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
  try {
    const result = await textToSpeech(text);
    if (result.audioUrl) {
      return { success: true, audioUrl: result.audioUrl };
    }
    return { success: false, error: 'Failed to generate audio.' };
  } catch (error) {
    console.error('Error generating audio:', error);
    return { success: false, error: 'An error occurred during text-to-speech conversion.' };
  }
}

  