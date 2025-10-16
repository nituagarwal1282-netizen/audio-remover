
import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Transcribes an audio file using the Gemini API.
 * @param base64Audio The base64 encoded audio data.
 * @param mimeType The MIME type of the audio file.
 * @returns The transcribed text as a string.
 */
export const transcribeAudio = async (base64Audio: string, mimeType: string): Promise<string> => {
  try {
    const audioPart = {
      inlineData: {
        mimeType,
        data: base64Audio,
      },
    };
    const textPart = {
      text: "Transcribe the following audio precisely. Respond only with the transcribed text.",
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [audioPart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error in transcribeAudio:", error);
    throw new Error("Failed to transcribe audio. The file might be unsupported or too large.");
  }
};

/**
 * Synthesizes speech from text using the Gemini TTS model.
 * @param text The text to synthesize.
 * @returns A base64 encoded string of the synthesized audio.
 */
export const synthesizeSpeech = async (text: string): Promise<string> => {
  if (!text.trim()) {
    throw new Error("Cannot synthesize speech from empty text.");
  }
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say with a clear and professional voice: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("Audio synthesis failed to produce data.");
    }
    return base64Audio;
  } catch (error) {
    console.error("Error in synthesizeSpeech:", error);
    throw new Error("Failed to synthesize speech.");
  }
};
