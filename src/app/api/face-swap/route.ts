// POST /api/face-swap
// Swap a user's face into a template video using Akool.
import { NextRequest, NextResponse } from "next/server";
import { createFaceSwap, getFaceSwapResult, getAkoolToken } from "@/lib/akool";
import type { ApiError } from "@/types";

// POST – create face-swap job
export async function POST(req: NextRequest) {
  try {
    const { faceImageUrl, targetVideoUrl } = (await req.json()) as {
      faceImageUrl: string;
      targetVideoUrl: string;
    };

    if (!faceImageUrl || !targetVideoUrl) {
      return NextResponse.json(
        {
          error: "MISSING_FIELDS",
          message: "faceImageUrl and targetVideoUrl are required.",
        } satisfies ApiError,
        { status: 400 }
      );
    }

    const clientId = process.env.AKOOL_CLIENT_ID ?? "";
    const clientSecret = process.env.AKOOL_CLIENT_SECRET ?? "";
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "MISSING_API_KEY", message: "Akool credentials not set." } satisfies ApiError,
        { status: 503 }
      );
    }

    const token = await getAkoolToken(clientId, clientSecret);
    const jobId = await createFaceSwap({ faceImageUrl, targetVideoUrl }, token);

    return NextResponse.json({ jobId, status: "pending" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Face-swap failed";
    return NextResponse.json(
      { error: "FACESWAP_ERROR", message } satisfies ApiError,
      { status: 500 }
    );
  }
}

// GET /api/face-swap?jobId=xxx – poll job status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    if (!jobId) {
      return NextResponse.json(
        { error: "MISSING_JOB_ID", message: "jobId query param required." } satisfies ApiError,
        { status: 400 }
      );
    }

    const clientId = process.env.AKOOL_CLIENT_ID ?? "";
    const clientSecret = process.env.AKOOL_CLIENT_SECRET ?? "";
    const token = await getAkoolToken(clientId, clientSecret);
    const result = await getFaceSwapResult(jobId, token);

    const statusMap: Record<number, string> = {
      1: "pending",
      2: "processing",
      3: "completed",
      4: "failed",
    };

    return NextResponse.json({
      jobId: result._id,
      status: statusMap[result.status] ?? "unknown",
      videoUrl: result.videoUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Poll failed";
    return NextResponse.json(
      { error: "POLL_ERROR", message } satisfies ApiError,
      { status: 500 }
    );
  }
}
