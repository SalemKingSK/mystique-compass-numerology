/**
 * @fileOverview A Genkit flow for converting text to speech.
 *
 * This file defines a Genkit flow that takes a string of text,
 * converts it to audio using a specified TTS model, and returns
 * the audio data as a Base64-encoded data URI.
 */

'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { googleAI } from '@genkit-ai/googleai';

/**
 * Converts raw PCM audio data into a WAV file format and returns it as a Base64 string.
 * @param pcmData - The raw audio data buffer.
 * @param channels - The number of audio channels.
 * @param rate - The sample rate of the audio.
 * @param sampleWidth - The width of each audio sample in bytes.
 * @returns A promise that resolves to the Base64-encoded WAV audio string.
 */
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
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const TextToSpeechInputSchema = z.string();
const TextToSpeechOutputSchema = z.object({
  audioUrl: z.string().describe('The Base64-encoded WAV audio data URI.'),
});

/**
 * Defines the text-to-speech Genkit flow.
 */
const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async (text) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: text,
    });

    if (!media) {
      throw new Error('No media was returned from the TTS model.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavData = await toWav(audioBuffer);

    return {
      audioUrl: `data:audio/wav;base64,${wavData}`,
    };
  }
);


export async function textToSpeech(text: string) {
    return textToSpeechFlow(text);
}

  