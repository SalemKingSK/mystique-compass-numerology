'use server';

/**
 * @fileOverview A flow to get insights based on personal data.
 * - getAstroInsight - A function that returns insights for a given person.
 * - AstroInsightInput - The input type for the getAstroInsight function.
 * - AstroInsightOutput - The return type for the getAstroInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AstroInsightInputSchema = z.object({
  name: z.string().describe('The full name of the person.'),
  day: z.number().describe('The day of birth.'),
  month: z.number().describe('The month of birth.'),
  year: z.number().describe('The year of birth.'),
  gender: z.string().describe('The gender of the person.'),
});
export type AstroInsightInput = z.infer<typeof AstroInsightInputSchema>;

const AstroInsightOutputSchema = z.object({
  name: z.string().describe("The person's name."),
  reading: z.string().describe('A detailed astrological reading for the person.'),
  luckyNumber: z.number().describe('A lucky number for the person.'),
  luckyColor: z.string().describe('A lucky color for the person.'),
  new_astrology_sign: z.string().describe('The combined New Astrology sign (e.g., "Aries/Dragon").'),
  western_sign: z.string().describe('The Western zodiac sign (e.g., "Aries").'),
  element: z.string().describe('The Chinese zodiac element (e.g., "Wood").'),
  sign: z.string().describe('The Chinese zodiac animal sign (e.g., "Dragon").'),
  psyche_num: z.number().describe('The Psyche number from numerology.'),
  destiny_num: z.number().describe('The Destiny number from numerology.'),
  kua_num: z.number().describe('The Kua number from numerology.'),
  lo_shu_grid: z.array(z.array(z.nullable(z.number()))).describe('A 3x3 Lo Shu grid, represented as a 2D array. Empty cells should be null.'),
  found_arrows: z.array(z.object({
    name: z.string().describe('The name of the found arrow of strength.'),
    description: z.string().describe('The description of the arrow of strength.'),
  })).describe('The arrows of strength found in the numerology chart.'),
  number_analysis: z.array(z.object({
    number: z.number().describe('The number being analyzed.'),
    count: z.number().describe('How many times the number appears.'),
    meaning: z.string().describe('The meaning of the repeated number.'),
  })).describe('Analysis of repeated numbers in the chart.'),
  general_desc: z.string().describe('A general description of the Chinese animal sign.'),
  elemental_desc: z.string().describe('A description of the element\'s influence on the sign.'),
  compatibilities: z.string().describe('A description of the sign\'s compatibilities.'),
  future_predictions: z.record(z.object({
      element: z.string(),
      year: z.string(),
      prediction: z.string()
  })).describe('Predictions for future years based on the Chinese zodiac. The key should be the year.'),
  new_astrology_desc: z.string().describe('A description of the combined New Astrology sign.'),
});
export type AstroInsightOutput = z.infer<typeof AstroInsightOutputSchema>;

export async function getAstroInsight(input: AstroInsightInput): Promise<AstroInsightOutput> {
  return astroInsightFlow(input);
}

const prompt = ai.definePrompt({
  name: 'astroInsightPrompt',
  input: {schema: AstroInsightInputSchema},
  output: {schema: AstroInsightOutputSchema},
  prompt: `You are an expert astrologer and numerologist. You combine Western and Chinese astrology with numerology to provide a comprehensive "New Astrology" profile.

For the person with the following details:
Name: {{{name}}}
Date of Birth: {{{day}}}/{{{month}}}/{{{year}}}
Gender: {{{gender}}}

Please generate a complete profile including:
1.  **Core Information**: Western sign, Chinese animal sign, and element.
2.  **New Astrology**: Their combined sign and a detailed description.
3.  **Numerology**:
    *   Calculate their Psyche, Destiny, and Kua numbers.
    *   Create their 3x3 Lo Shu grid. Represent empty cells with null.
    *   Identify any "Arrows of Strength" and describe them.
    *   Analyze any repeated numbers in their birth date and describe the meaning. Use the following specific meanings for repeated numbers.
        *   **One 1**: Faces difficulty in communication & expression (verbal). They can communicate by other means, through art, craft, design, sculpturing, cartoons, graffiti, painting, writing, dancing etc. But they never able to soak themselves into anything, they touch the crust but never reach the core. Find it difficult to understand others point of view. Good financial level, as 6 & 8 are also in this plane.
        *   **Two 1s**: Good in Expression & Communication. Impartial & Balanced outlook towards everyone in life. Way of living life is very neutral. They understand others point of view as well as their own. Good in financial matters. Perfect placement of pair in a chart.
        *   **Three 1s**: Good in Expression, Very Sensitive & Caring. Number of Extra Marital Relation (concept of Pati, Patni & Wo). Some times Too much Talkative, they Never stop talking. But Sometimes they can be Very Quiet & Introvert, as they have both of the extremes in behaviors. They keep on changing their behavior according to time & Situations. They have materialistic growth if other two numbers are supporting. Generally they are Happy, Good Entertainers in Life. Love going out of House.
        *   **Four 1s**: Blockage at Vishudha or Throat chakra hence it is extremely difficult for them to open their heart out verbally. Very sensitive & caring by nature but they are mostly misunderstood. They are always on their toes, anxious, overly energetic. Take rest or get relaxed very rarely, always hyperactive. Only materialistic desires will be found & more focus on wealth accumulation other than anything else in their life.
        *   **Five or more 1s**: Face too much difficulties in Expressing their Emotions out Verbally. Very much misunderstood Personalities. They direct their Energy of Expression into other forms of Expressions like Writing, Painting, Dancing, Art, Sculpture, Creativity etc. Over Indulge in Alcoholism, Drug, Food, Many Relationships or any other types of Addictions.
        *   **One 2**: Caring & intelligent by nature, easily hurt by others. Easily understands & gauge people just by looking at them. They can easily distinguish between sincere & insincere people. If only 2 is present in the plane then average mind set, but if other two numbers also there then high intellect. Do well in the philosophical, judicial & literary fields.
        *   **Two 2s**: High in Intelligence, Sensitivity & Double in Intuition Level (as 2 is 2 times). They have innate ability to get into someone's Mind & Soul. They can easily Scan the Mind & Soul of Someone & find about their Feelings, Motive & Purpose. Only Two 2s in the plane without 4 & 9, makes the Personal Highly Sceptical & Very Negative. This also makes person Deprived of Positive Energy, Enthusiasm, the Level of Chi or Life Driving Force in them is very Weak. This will eventually affect their Health Condition, Physical & Mental both. If 4 & 9 present along with 2, then the Person will be Good in Memorising things & High in Intellectual way.
        *   **Three 2s**: More 2s in the chart makes a person more Intuitive & Sensitive. But Sensitivity & Intuitiveness are good up to a limit, but after a point these two properties can make a person Maniac. These people will be too much Vulnerable or Defenseless & hence will easily Hurt & affected by others. As a result that person will prefer to be Alone & Aloof away from the public to protect themselves from being Hurt. They lock themselves in their Mental world as the don't find the people around them in the physical world capable enough to understand them. Hence the become Introvert regardless of their basic Behavior and Tendencies.
        *   **Four 2s**: Their Patience Level is very Low. They Have tendency to Overreact over the issues which are Irrelevant & Meaningless. Extreme behavioural sensitivity is observed which lead to self hurting behaviour.
        *   **Five or more 2s**: Rarely found set in a grid. If 5,6 or more 2s are there with no 4 & 9 support then the condition will be Unfortunate, which makes their life very difficult to live (difficult to adjust too). Too much of Arrogance in the behavior is seen along with Sarcasm & Rudeness. Self Doubt & Lack of Confidence is also seen. In this Century people can have Six 2s in their chart (e.g. 22 Feb 2022).
        *   **One 3**: STRESS & HURT is there, if there is only one 3. Good Creative Brain with excellent memory. DOWN TO EARTH in their approach towards life. POSITIVE MIND SET in achieving any task or goal. They keep inspiring others by their honesty & optimism in their attitude. Totally focused on their growth & their goal. They find it DIFFICULT TO DEAL WITH COMPETITIONS.
        *   **Two 3s**: Intelligence, Sensitiveness & Intuitiveness are the qualities associated. They have Balanced Mentality & Strong Personality. Have Good Compatibility & Adjusting Nature, hence emerge as good friends. They can easily sense the motive of other people around them. They Develop Concept of Life & Evolve Spiritually with faith & devotion when there is support of 5 & 7. They have an Active, Imaginative & very Creative Brain. They enjoy Breaking Rule or Contract & Strange or Unconventional in Nature. They can emerge are Path Breakers or Trend Breakers or Trend Maker. Their Power of Creativity Makes them Trend Setters also. They very well know how to Control their Innovative Mind. They have power of projection of expression through words. So they excel professionally as Writers, Artists, Actors etc.
        *   **Three 3s**: They life in an IMAGINARY BUBBLE OR DAY DREAMING STATE. They often find it hard to relate with others. They are not good listeners. They can appear Self Engaged & Isolated. They have Brilliant Mental Ability, but they spend their lives in the world of dreams. They can be Quarrelsome & Unimportant at times. Their Clairvoyance & Spiritualism.
        *   **Four 3s**: Unrealistic, Fearful & Over Imaginative (Illusionist). These qualities makes it hard for them to function well in Everyday Life. This combination is Rare to be found in Charts. Sensitive, Imaginative & Intuitive in nature, Day Dreamers & love to stick in that world. High Intelligence, High intellect, High Spirituality & High Intuitive abilities seen if 3 is supported by 5 & 7 in this plane. Intolerance, Irresponsible & Thoughtless. Other Supportive Numbers are not of much help in this case of too much 4s.
4.  **Chinese Zodiac**:
    *   Provide a general description of their animal sign.
    *   Describe the influence of their element on their sign.
    *   Detail their compatibilities.
    *   Provide predictions for the next 3 relevant animal years.
5.  **Simple Profile**: Also provide a simple reading, a lucky number, and a lucky color.
  `,
});

const astroInsightFlow = ai.defineFlow(
  {
    name: 'astroInsightFlow',
    inputSchema: AstroInsightInputSchema,
    outputSchema: AstroInsightOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
