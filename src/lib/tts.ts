'use server';
/**
 * @fileOverview A text-to-speech AI agent using Genkit.
 *
 * - textToSpeech - A function that handles the TTS process.
 */

import { genkit, configureGenkit } from '@genkit-ai/ai';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import wav from 'wav';

// Initialize Genkit
configureGenkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracing: true,
});

// Define the schema for the output
const TTSOutputSchema = z.object({
  media: z.string().describe("The base64 encoded WAV audio data URI."),
});

// Helper function to convert PCM data to WAV format
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

// Define the Genkit flow for text-to-speech
const textToSpeechFlow = genkit.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: z.string(),
    outputSchema: TTSOutputSchema,
  },
  async (query) => {
    const { media } = await genkit.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: query,
    });

    if (!media) {
      throw new Error('No media returned from TTS model');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);
    
    return {
      media: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);

// Exported wrapper function
export async function textToSpeech(text: string): Promise<{ media: string }> {
    return await textToSpeechFlow(text);
}
