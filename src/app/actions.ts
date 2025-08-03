'use server';

import { getAstroInsight, type AstroInsightInput } from '@/lib/astrology';
import { generateLoShuData } from '@/lib/numerology';
import { textToSpeech } from '@/lib/tts';

export async function getAstroInsightAction(formData: AstroInsightInput) {
  try {
    if (!formData.name || !formData.day || !formData.month || !formData.year || !formData.gender) {
      return { success: false, error: 'Please fill out all fields.' };
    }
    
    const [insightResult, numerologyResult] = await Promise.all([
        getAstroInsight(formData),
        Promise.resolve(generateLoShuData(formData))
    ]);


    return { success: true, insight: insightResult, numerology: numerologyResult };
  } catch (error) {
    console.error('Error getting insight:', error);
    return { success: false, error: 'An error occurred while fetching insights. Please try again.' };
  }
}


export async function getSpeechAction(text: string): Promise<{
    success: boolean;
    audioUrl?: string;
    error?: string;
}> {
    try {
        if (!text) {
            return { success: false, error: 'No text provided for speech synthesis.' };
        }
        const result = await textToSpeech(text);
        if (result && result.media) {
            return { success: true, audioUrl: result.media };
        } else {
            return { success: false, error: 'Audio generation failed.' };
        }
    } catch (error: any) {
        console.error('Error getting speech:', error);
        return { success: false, error: `An error occurred: ${error.message}` };
    }
}
