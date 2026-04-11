
import { onCall } from "firebase-functions/v2/https";
import { defineString } from "firebase-functions/params";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Define environment variables
const geminiApiKey = defineString("GEMINI_API_KEY");

// Constants
// Using Gemini 1.5 Flash for the best free-tier performance and rate limits
const GEMINI_MODEL = "gemini-1.5-flash";

// Define interfaces for our function
interface OracleInput {
  userReport: string;
  userQuestion: string;
  chatHistory?: { role: 'user' | 'model'; text: string }[];
}

interface OracleOutput {
  response: string;
}

// System prompt and knowledge base
const APP_KNOWLEDGE_BASE = `
The user profile contains detailed astrological and numerological information.
- Western Zodiac Sign: Determined by birth date.
- Chinese Animal Sign: Determined by birth year.
- Numerology Report: Calculated from the user's full name and birth date. Includes:
  - Life Path Number: The main lesson in this life.
  - Expression Number: Talents and potential.
  - Soul Urge Number: Inner desires.
- Zodiacal Lore: Based on the western zodiac sign.
`;

const SYSTEM_PROMPT = `You are the Mystique Oracle, a wise and empathetic astrologer and numerologist.
Your purpose is to provide insightful, positive, and uplifting guidance based on the user's detailed profile.

**GUIDELINES:**
1.  **Analyze the Full Profile:** Always base your answers on the complete user profile provided (astrology, numerology, etc.). Do not ask for this information again.
2.  **Direct Answers:** Address the user's question directly, weaving in insights from their profile to create a personalized and relevant response.
3.  **Empathetic & Positive Tone:** Your tone should be encouraging, wise, and slightly mystical, like a trusted spiritual advisor. Avoid clinical or overly technical language.
4.  **No Generic Advice:** Do not give generic advice. Every part of your answer should feel like it's specifically for the user based on their unique data.
5.  **Be Specific:** Instead of saying \"Your Life Path number suggests...\", say \"As a Life Path 5, you have a natural love for freedom and adventure. This situation might feel restrictive because...\".
6.  **Don't Repeat the Profile:** The user has their full report. Do not simply list their numbers or signs back to them. Interpret and apply the information to their question.
7.  **Safety First:** Do not provide medical, legal, or financial advice. If asked, gently decline and guide them to a professional in that field, while still offering a supportive astrological perspective (e.g., \"While I cannot offer financial advice, your determined Taurus nature is a great asset in building security. Focus on that strength as you consult a financial expert.\").

**KNOWLEDGE BASE CONTEXT:**
${APP_KNOWLEDGE_BASE}
`;


/**
 * Firebase Callable Function to consult the Gemini AI Oracle.
 */
export const consultoracle = onCall(async (request) => {
  const { userReport, userQuestion, chatHistory } = request.data as OracleInput;
  const apiKey = geminiApiKey.value();

  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set in environment.");
    // Using a more specific error code for the client to handle
    throw new Error("Server configuration error: API key not found.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: SYSTEM_PROMPT });

  // Convert our app's chat history to the format Gemini expects
  const history = (chatHistory || []).map(msg => ({
    role: msg.role, // 'user' or 'model'
    parts: [{ text: msg.text }],
  }));
  
  // Construct the full user message including their profile data
  const userMessage = `USER PROFILE (use this data for all responses):
${userReport}

USER'S QUESTION:
${userQuestion}`;

  try {
    const chat = model.startChat({
        history,
        generationConfig: {
            maxOutputTokens: 1000,
            temperature: 0.85,
        },
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ]
    });

    const result = await chat.sendMessage(userMessage);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error('Gemini returned an empty response.');
    }

    return { response: responseText } as OracleOutput;

  } catch (error) {
    console.error('[Oracle Function] Gemini API error:', error);
    // Throwing an error here will be caught by the client's .catch() block
    throw new Error('Failed to get a response from the Oracle.');
  }
});

export * from './ingestVault';
