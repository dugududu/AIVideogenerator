// ─────────────────────────────────────────────────────────────────────────────
// Kling AI Video Generation integration
// Docs: https://klingai.com/docs  (Kuaishou)
// ─────────────────────────────────────────────────────────────────────────────
import axios from "axios";

const KLING_BASE = "https://api.klingai.com/v1";

export interface KlingVideoRequest {
  prompt: string;
  aspectRatio?: "9:16" | "16:9" | "1:1";
  duration?: 5 | 10;
  mode?: "std" | "pro";
  negativePrompt?: string;
}

export interface KlingVideoTask {
  task_id: string;
  status: "submitted" | "processing" | "succeed" | "failed";
  videoUrl?: string;
  coverImageUrl?: string;
}

/**
 * Submit a text-to-video task on Kling AI.
 */
export async function createKlingVideoTask(
  request: KlingVideoRequest,
  apiKey: string
): Promise<string> {
  const { data } = await axios.post<{ data: { task_id: string } }>(
    `${KLING_BASE}/videos/text2video`,
    {
      prompt: request.prompt,
      aspect_ratio: request.aspectRatio ?? "9:16",
      duration: String(request.duration ?? 5),
      mode: request.mode ?? "std",
      negative_prompt: request.negativePrompt ?? "",
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );
  return data.data.task_id;
}

/**
 * Poll task status on Kling AI.
 */
export async function getKlingVideoTask(
  taskId: string,
  apiKey: string
): Promise<KlingVideoTask> {
  const { data } = await axios.get<{
    data: {
      task_id: string;
      task_status: string;
      task_result?: { videos: Array<{ url: string; cover_image_url: string }> };
    };
  }>(`${KLING_BASE}/videos/text2video/${taskId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  const task = data.data;
  const video = task.task_result?.videos?.[0];
  return {
    task_id: task.task_id,
    status: task.task_status as KlingVideoTask["status"],
    videoUrl: video?.url,
    coverImageUrl: video?.cover_image_url,
  };
}
