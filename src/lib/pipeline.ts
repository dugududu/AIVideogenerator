// ─────────────────────────────────────────────────────────────────────────────
// Unified Video Generation Pipeline
//
// Architecture (same pattern used by Creatify, JoggAI, MakeUGC, etc.):
//   1.  User writes script  →  ElevenLabs TTS  →  audio .mp3
//   2.  Audio + avatar image  →  D-ID / HeyGen  →  talking-head video
//   3.  (Optional) user face  →  Akool face-swap  →  personalised video
//   4.  Kling / Veo (optional) for b-roll background scenes
//   5.  Return final video URL to client
//
// All heavy work is async; the job record is stored in your DB and polled.
// ─────────────────────────────────────────────────────────────────────────────
import { textToSpeech } from "./elevenlabs";
import { createDIDTalk, getDIDTalk } from "./did";
import { createHeyGenVideo, getHeyGenVideo } from "./heygen";
import { createFaceSwap, getFaceSwapResult, getAkoolToken } from "./akool";
import type { VideoJob, VideoSettings, FaceSwapJob } from "@/types";

export type PipelineConfig = {
  /** Which avatar provider to use for the talking head */
  avatarProvider: "did" | "heygen";
  /** Whether to run face-swap after avatar video is generated */
  faceSwap?: {
    enabled: boolean;
    /** Public URL of the face image to swap in */
    faceImageUrl?: string;
  };
};

export type PipelineInput = {
  script: string;
  /** Public URL of the avatar image (for D-ID) or HeyGen avatar ID */
  avatarIdOrUrl: string;
  /** ElevenLabs voice ID */
  voiceId: string;
  settings: VideoSettings;
};

export type PipelineEnv = {
  elevenLabsApiKey: string;
  didApiKey?: string;
  heygenApiKey?: string;
  akoolClientId?: string;
  akoolClientSecret?: string;
};

/**
 * Run the full UGC video generation pipeline.
 *
 * Returns a partial VideoJob that can be stored in the DB.
 * The caller is responsible for polling until status === "completed".
 */
export async function runVideoPipeline(
  input: PipelineInput,
  config: PipelineConfig,
  env: PipelineEnv
): Promise<{ jobId: string; providerJobId: string }> {
  // Step 1 – Text → Speech
  const audioBuffer = await textToSpeech(
    input.script,
    input.voiceId,
    env.elevenLabsApiKey
  );

  // For simplicity, assume the audio is uploaded to your storage and you get a URL back.
  // In production you would upload to S3/R2 and return a signed URL.
  const audioUrl = await uploadAudioBuffer(audioBuffer);

  // Step 2 – Audio + Avatar → Talking-head video
  let providerJobId: string;
  if (config.avatarProvider === "did" && env.didApiKey) {
    providerJobId = await createDIDTalk(
      {
        sourceImageUrl: input.avatarIdOrUrl,
        script: { type: "audio", audioUrl },
      },
      env.didApiKey
    );
  } else if (config.avatarProvider === "heygen" && env.heygenApiKey) {
    providerJobId = await createHeyGenVideo(
      {
        avatarId: input.avatarIdOrUrl,
        voiceId: input.voiceId,
        script: input.script,
        aspectRatio: input.settings.aspectRatio,
      },
      env.heygenApiKey
    );
  } else {
    throw new Error(
      "No valid avatar provider configured. Set didApiKey or heygenApiKey."
    );
  }

  // Step 3 – (Optional) Face-swap queued separately after avatar video completes
  // This is handled by pollAndFaceSwap() below.

  const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return { jobId, providerJobId };
}

/**
 * Poll an avatar-provider job until it finishes, then optionally run face-swap.
 * Call this from a background worker / cron / serverless function.
 */
export async function pollAndFaceSwap(
  providerJobId: string,
  config: PipelineConfig,
  env: PipelineEnv
): Promise<string | null> {
  let videoUrl: string | null = null;

  if (config.avatarProvider === "did" && env.didApiKey) {
    const task = await getDIDTalk(providerJobId, env.didApiKey);
    if (task.status === "done" && task.resultUrl) {
      videoUrl = task.resultUrl;
    }
  } else if (config.avatarProvider === "heygen" && env.heygenApiKey) {
    const task = await getHeyGenVideo(providerJobId, env.heygenApiKey);
    if (task.status === "completed" && task.videoUrl) {
      videoUrl = task.videoUrl;
    }
  }

  if (
    !videoUrl ||
    !config.faceSwap?.enabled ||
    !config.faceSwap.faceImageUrl
  ) {
    return videoUrl;
  }

  // Step 3 – Face-swap (Akool)
  if (!env.akoolClientId || !env.akoolClientSecret) {
    return videoUrl; // skip face-swap if Akool not configured
  }

  const token = await getAkoolToken(
    env.akoolClientId,
    env.akoolClientSecret
  );
  const faceSwapJobId = await createFaceSwap(
    {
      faceImageUrl: config.faceSwap.faceImageUrl,
      targetVideoUrl: videoUrl,
    },
    token
  );

  // Poll face-swap (simplified; in production use a queue)
  for (let i = 0; i < 30; i++) {
    await sleep(5000);
    const result = await getFaceSwapResult(faceSwapJobId, token);
    if (result.status === 3 && result.videoUrl) return result.videoUrl;
    if (result.status === 4) throw new Error("Face-swap job failed");
  }

  throw new Error("Face-swap job timed out");
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Placeholder: upload audio buffer to object storage.
 * Replace with your actual S3/R2/GCS upload logic.
 */
async function uploadAudioBuffer(_buffer: Buffer): Promise<string> {
  // In production:
  //   const key = `audio/${Date.now()}.mp3`;
  //   await s3.putObject({ Bucket: BUCKET, Key: key, Body: _buffer, ContentType: "audio/mpeg" });
  //   return `https://${BUCKET}.s3.amazonaws.com/${key}`;
  throw new Error(
    "uploadAudioBuffer() is not implemented. " +
      "Plug in your S3 / Cloudflare R2 / Supabase Storage upload here."
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
