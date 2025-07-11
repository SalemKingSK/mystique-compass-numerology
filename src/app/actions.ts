'use server';

import { getAstroInsight, type AstroInsightInput } from '@/ai/flows/astro-insight-flow';

export async function getAstroInsightAction(formData: AstroInsightInput) {
  try {
    if (!formData.name || !formData.day || !formData.month || !formData.year || !formData.gender) {
      return { success: false, error: 'Please fill out all fields.' };
    }
    const result = await getAstroInsight(formData);
    return { success: true, insight: result };
  } catch (error) {
    console.error('Error getting insight:', error);
    return { success: false, error: 'An error occurred while fetching insights. Please try again.' };
  }
}
