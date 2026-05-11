
'use server';
import { getAstroInsight, type AstroInsightInput } from '@/lib/astrology';
import { generateLoShuData } from '@/lib/numerology';
import { buildCosmicProfile } from '@/lib/cosmic-synthesizer-enhanced'; // Import the enhanced synthesizer

export async function getAstroInsightAction(formData: AstroInsightInput) {
  try {
    if (!formData.name || !formData.day || !formData.month || !formData.year || !formData.gender) {
      return { success: false, error: 'Please fill out all fields.' };
    }
    
    const [insightResult, numerologyResult] = await Promise.all([
        getAstroInsight(formData),
        Promise.resolve(generateLoShuData(formData))
    ]);

    // Generate the enhanced cosmic profile
    const cosmicProfile = buildCosmicProfile(formData.name, insightResult, numerologyResult);

    return { success: true, insight: insightResult, numerology: numerologyResult, cosmicProfile };
  } catch (error) {
    console.error('Error getting insight:', error);
    return { success: false, error: 'An error occurred while fetching insights. Please try again.' };
  }
}
