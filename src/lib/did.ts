// ─────────────────────────────────────────────────────────────────────────────
// D-ID Talking Avatar integration
// Docs: https://docs.d-id.com/
// Creates a lip-synced talking-head video from an image + audio.
// ─────────────────────────────────────────────────────────────────────────────
import axios from "axios";

const DID_BASE = "https://api.d-id.com";

export interface DIDTalkRequest {
  /** Public URL of the face image */
  sourceImageUrl: string;
  /** Script object — either audio URL or plain text */
  script:
    | { type: "audio"; audioUrl: string }
    | { type: "text"; input: string; providerType?: string; voiceId?: string };
  /** Optional background removal */
  config?: { fluent?: boolean; pad_audio?: number };
}

export interface DIDTalkTask {
  id: string;
  status: "created" | "started" | "done" | "error";
  resultUrl?: string;
}

/**
 * Create a talking-avatar video on D-ID.
 */
export async function createDIDTalk(
  request: DIDTalkRequest,
  apiKey: string
): Promise<string> {
  const body: Record<string, unknown> = {
    source_url: request.sourceImageUrl,
    config: request.config ?? { fluent: true, pad_audio: 0 },
  };

  if (request.script.type === "audio") {
    body.script = { type: "audio", audio_url: request.script.audioUrl };
  } else {
    body.script = {
      type: "text",
      input: request.script.input,
      provider: {
        type: request.script.providerType ?? "elevenlabs",
        voice_id: request.script.voiceId ?? "21m00Tcm4TlvDq8ikWAM",
      },
    };
  }

  const { data } = await axios.post<{ id: string }>(
    `${DID_BASE}/talks`,
    body,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
        "Content-Type": "application/json",
      },
    }
  );
  return data.id;
}

/**
 * Poll D-ID talk status.
 */
export async function getDIDTalk(
  talkId: string,
  apiKey: string
): Promise<DIDTalkTask> {
  const { data } = await axios.get<{
    id: string;
    status: string;
    result_url?: string;
  }>(`${DID_BASE}/talks/${talkId}`, {
    headers: {
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
    },
  });
  return {
    id: data.id,
    status: data.status as DIDTalkTask["status"],
    resultUrl: data.result_url,
  };
}
