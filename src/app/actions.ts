'use server';

import { getAstroInsight, type AstroInsightInput } from '@/ai/flows/astro-insight-flow';
import { generateLoShuData } from '@/lib/numerology';

export async function getAstroInsightAction(formData: AstroInsightInput) {
  try {
    if (!formData.name || !formData.day || !formData.month || !formData.year || !formData.gender) {
      return { success: false, error: 'Please fill out all fields.' };
    }
    
    // Perform AI and numerology calculations in parallel
    const [insightResult, numerologyData] = await Promise.all([
        getAstroInsight(formData),
        generateLoShuData(formData)
    ]);

    return { success: true, insight: insightResult, numerology: numerologyData };
  } catch (error) {
    console.error('Error getting insight:', error);
    return { success: false, error: 'An error occurred while fetching insights. Please try again.' };
  }
}
