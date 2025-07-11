'use server';

import { interpretFirebaseInit } from '@/ai/flows/interpret-firebase-init';

export async function getGuidanceAction(featureSelections: string) {
  try {
    if (!featureSelections) {
      return { success: false, error: 'Please select at least one feature.' };
    }
    const result = await interpretFirebaseInit({ featureSelections });
    return { success: true, guidance: result.guidance };
  } catch (error) {
    console.error('Error getting guidance:', error);
    return { success: false, error: 'An error occurred while fetching guidance. Please try again.' };
  }
}
