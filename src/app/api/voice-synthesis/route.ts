// POST /api/voice-synthesis
// Generate audio from script using ElevenLabs.
import { NextRequest, NextResponse } from "next/server";
import { textToSpeech, listElevenLabsVoices } from "@/lib/elevenlabs";
import type { ApiError } from "@/types";

// GET – list available voices
export async function GET() {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY ?? "";
    if (!apiKey) {
      return NextResponse.json(
        { error: "MISSING_API_KEY", message: "ELEVENLABS_API_KEY not set." } satisfies ApiError,
        { status: 503 }
      );
    }
    const voices = await listElevenLabsVoices(apiKey);
    return NextResponse.json({ voices });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list voices";
    return NextResponse.json(
      { error: "PROVIDER_ERROR", message } satisfies ApiError,
      { status: 500 }
    );
  }
}

// POST – synthesise speech, return audio as MP3
export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = (await req.json()) as {
      text: string;
      voiceId: string;
    };

    if (!text || !voiceId) {
      return NextResponse.json(
        { error: "MISSING_FIELDS", message: "text and voiceId are required." } satisfies ApiError,
        { status: 400 }
      );
    }

    const apiKey = process.env.ELEVENLABS_API_KEY ?? "";
    const audioBuffer = await textToSpeech(text, voiceId, apiKey);

    return new NextResponse(audioBuffer.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": String(audioBuffer.byteLength),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "TTS failed";
    return NextResponse.json(
      { error: "TTS_ERROR", message } satisfies ApiError,
      { status: 500 }
    );
  }
}
