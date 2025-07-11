'use server';

import { getAstroInsight } from '@/ai/flows/astro-insight-flow';

export async function getAstroInsightAction(celestialObject: string) {
  try {
    if (!celestialObject) {
      return { success: false, error: 'Please enter a celestial object.' };
    }
    const result = await getAstroInsight({ celestialObject });
    return { success: true, insight: result };
  } catch (error) {
    console.error('Error getting insight:', error);
    return { success: false, error: 'An error occurred while fetching insights. Please try again.' };
  }
}
