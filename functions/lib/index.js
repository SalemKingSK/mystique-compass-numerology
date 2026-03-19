"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultoracle = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const generative_ai_1 = require("@google/generative-ai");
const geminiApiKey = (0, params_1.defineString)("GEMINI_API_KEY");
const GEMINI_MODEL = "gemini-1.5-pro-latest";
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
exports.consultoracle = (0, https_1.onCall)(async (request) => {
    const { userReport, userQuestion, chatHistory } = request.data;
    const apiKey = geminiApiKey.value();
    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set in environment.");
        throw new Error("Server configuration error: API key not found.");
    }
    const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction: SYSTEM_PROMPT });
    const history = (chatHistory || []).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
    }));
    const userMessage = `USER PROFILE (use this data for all responses):
${userReport}

USER'S QUESTION:
${userQuestion}`;
    try {
        const chat = model.startChat({
            history,
            generationConfig: {
                maxOutputTokens: 600,
                temperature: 0.85,
            },
            safetySettings: [
                { category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ]
        });
        const result = await chat.sendMessage(userMessage);
        const responseText = result.response.text();
        if (!responseText) {
            throw new Error('Gemini returned an empty response.');
        }
        return { response: responseText };
    }
    catch (error) {
        console.error('[Oracle Function] Gemini API error:', error);
        throw new Error('Failed to get a response from the Oracle.');
    }
});
__exportStar(require("./ingestVault"), exports);
//# sourceMappingURL=index.js.map