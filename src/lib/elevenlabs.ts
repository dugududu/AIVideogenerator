// ─────────────────────────────────────────────────────────────────────────────
// ElevenLabs Text-to-Speech integration
// Docs: https://elevenlabs.io/docs/api-reference
// ─────────────────────────────────────────────────────────────────────────────
import axios from "axios";

const ELEVENLABS_BASE = "https://api.elevenlabs.io/v1";

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  labels: Record<string, string>;
  preview_url: string;
}

/**
 * Fetch available voices from ElevenLabs.
 */
export async function listElevenLabsVoices(
  apiKey: string
): Promise<ElevenLabsVoice[]> {
  const { data } = await axios.get<{ voices: ElevenLabsVoice[] }>(
    `${ELEVENLABS_BASE}/voices`,
    { headers: { "xi-api-key": apiKey } }
  );
  return data.voices;
}

/**
 * Convert text to speech using ElevenLabs.
 * Returns a Buffer containing the MP3 audio.
 */
export async function textToSpeech(
  text: string,
  voiceId: string,
  apiKey: string,
  modelId = "eleven_multilingual_v2"
): Promise<Buffer> {
  const response = await axios.post(
    `${ELEVENLABS_BASE}/text-to-speech/${voiceId}`,
    {
      text,
      model_id: modelId,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    },
    {
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      responseType: "arraybuffer",
    }
  );
  return Buffer.from(response.data);
}
