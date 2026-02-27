// ─────────────────────────────────────────────────────────────────────────────
// HeyGen Talking Avatar integration
// Docs: https://docs.heygen.com/
// HeyGen is used by JoggAI, Creatify-like tools for high-quality avatar videos.
// ─────────────────────────────────────────────────────────────────────────────
import axios from "axios";

const HEYGEN_BASE = "https://api.heygen.com";

export interface HeyGenVideoRequest {
  avatarId: string;
  voiceId: string;
  script: string;
  width?: number;
  height?: number;
  aspectRatio?: "9:16" | "16:9" | "1:1";
}

export interface HeyGenVideoTask {
  video_id: string;
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
}

/**
 * Submit a video generation request to HeyGen.
 */
export async function createHeyGenVideo(
  request: HeyGenVideoRequest,
  apiKey: string
): Promise<string> {
  const dimensions = resolveDimensions(
    request.aspectRatio ?? "9:16",
    request.width,
    request.height
  );

  const { data } = await axios.post<{ data: { video_id: string } }>(
    `${HEYGEN_BASE}/v2/video/generate`,
    {
      video_inputs: [
        {
          character: {
            type: "avatar",
            avatar_id: request.avatarId,
            avatar_style: "normal",
          },
          voice: {
            type: "text",
            voice_id: request.voiceId,
            input_text: request.script,
          },
        },
      ],
      dimension: dimensions,
    },
    {
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    }
  );
  return data.data.video_id;
}

/**
 * Poll HeyGen video status.
 */
export async function getHeyGenVideo(
  videoId: string,
  apiKey: string
): Promise<HeyGenVideoTask> {
  const { data } = await axios.get<{
    data: {
      video_id: string;
      status: string;
      video_url?: string;
      thumbnail_url?: string;
      duration?: number;
    };
  }>(`${HEYGEN_BASE}/v1/video_status.get?video_id=${videoId}`, {
    headers: { "X-Api-Key": apiKey },
  });

  const v = data.data;
  return {
    video_id: v.video_id,
    status: v.status as HeyGenVideoTask["status"],
    videoUrl: v.video_url,
    thumbnailUrl: v.thumbnail_url,
    duration: v.duration,
  };
}

function resolveDimensions(
  ratio: "9:16" | "16:9" | "1:1",
  w?: number,
  h?: number
): { width: number; height: number } {
  if (w && h) return { width: w, height: h };
  const map: Record<string, { width: number; height: number }> = {
    "9:16": { width: 720, height: 1280 },
    "16:9": { width: 1280, height: 720 },
    "1:1": { width: 1080, height: 1080 },
  };
  return map[ratio];
}
