'use server';

import { getAstroInsight, type AstroInsightInput } from '@/ai/flows/astro-insight-flow';
import { generateLoShuData } from '@/numerology';

export async function getAstroInsightAction(formData: AstroInsightInput) {
  try {
    if (!formData.name || !formData.day || !formData.month || !formData.year || !formData.gender) {
      return { success: false, error: 'Please fill out all fields.' };
    }
    
    const insightResult = await getAstroInsight(formData);

    // Numerology data is no longer part of the AI call, so we don't need Promise.all here.
    // It will be calculated on the client side.

    return { success: true, insight: insightResult };
  } catch (error) {
    console.error('Error getting insight:', error);
    return { success: false, error: 'An error occurred while fetching insights. Please try again.' };
  }
}
