// POST /api/generate-video
// Kick off the UGC video generation pipeline.
import { NextRequest, NextResponse } from "next/server";
import { runVideoPipeline } from "@/lib/pipeline";
import type { VideoSettings, ApiError } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      script: string;
      avatarIdOrUrl: string;
      voiceId: string;
      settings: VideoSettings;
      avatarProvider?: "did" | "heygen";
      faceImageUrl?: string;
    };

    if (!body.script || !body.avatarIdOrUrl || !body.voiceId) {
      return NextResponse.json(
        {
          error: "MISSING_FIELDS",
          message: "script, avatarIdOrUrl, and voiceId are required.",
        } satisfies ApiError,
        { status: 400 }
      );
    }

    const env = {
      elevenLabsApiKey: process.env.ELEVENLABS_API_KEY ?? "",
      didApiKey: process.env.DID_API_KEY,
      heygenApiKey: process.env.HEYGEN_API_KEY,
      akoolClientId: process.env.AKOOL_CLIENT_ID,
      akoolClientSecret: process.env.AKOOL_CLIENT_SECRET,
    };

    const { jobId, providerJobId } = await runVideoPipeline(
      {
        script: body.script,
        avatarIdOrUrl: body.avatarIdOrUrl,
        voiceId: body.voiceId,
        settings: body.settings ?? {
          aspectRatio: "9:16",
          resolution: "1080p",
          captions: true,
        },
      },
      {
        avatarProvider: body.avatarProvider ?? "did",
        faceSwap: {
          enabled: !!body.faceImageUrl,
          faceImageUrl: body.faceImageUrl,
        },
      },
      env
    );

    return NextResponse.json({ jobId, providerJobId, status: "pending" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: "PIPELINE_ERROR", message } satisfies ApiError,
      { status: 500 }
    );
  }
}
