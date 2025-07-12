'use server';

import { getAstroInsight, type AstroInsightInput } from '@/ai/flows/astro-insight-flow';
import { personalizeReading, type PersonalizeReadingInput } from '@/ai/flows/personalize-reading-flow';

export async function getAstroInsightAction(formData: AstroInsightInput) {
  try {
    if (!formData.name || !formData.day || !formData.month || !formData.year || !formData.gender) {
      return { success: false, error: 'Please fill out all fields.' };
    }
    
    const insightResult = await getAstroInsight(formData);

    return { success: true, insight: insightResult };
  } catch (error) {
    console.error('Error getting insight:', error);
    return { success: false, error: 'An error occurred while fetching insights. Please try again.' };
  }
}

export async function personalizeReadingAction(formData: PersonalizeReadingInput) {
    try {
        const personalizedReading = await personalizeReading(formData);
        return { success: true, personalizedReading: personalizedReading.personalizedReading };
    } catch (error) {
        console.error('Error personalizing reading:', error);
        return { success: false, error: 'An error occurred while personalizing the reading.' };
    }
}
