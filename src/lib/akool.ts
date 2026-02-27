// ─────────────────────────────────────────────────────────────────────────────
// Akool Face-Swap integration
// Docs: https://docs.akool.com/
// Akool provides best-in-class face-swap API used by many UGC SaaS tools.
// ─────────────────────────────────────────────────────────────────────────────
import axios from "axios";

const AKOOL_BASE = "https://openapi.akool.com/api/open/v3";

export interface FaceSwapRequest {
  /** URL of the source face image (the face to put IN) */
  faceImageUrl: string;
  /** URL of the target video (the video to swap INTO) */
  targetVideoUrl: string;
  /** 0 = first face in video, or specify face index */
  faceIndex?: number;
}

export interface FaceSwapTask {
  _id: string;
  status: 1 | 2 | 3 | 4; // 1=queued, 2=processing, 3=completed, 4=failed
  videoUrl?: string;
}

/**
 * Submit a face-swap video job on Akool.
 */
export async function createFaceSwap(
  request: FaceSwapRequest,
  token: string
): Promise<string> {
  const { data } = await axios.post<{ data: { _id: string } }>(
    `${AKOOL_BASE}/faceswap/video/create`,
    {
      sourceImage: [{ path: request.faceImageUrl, type: 1 }],
      targetVideo: { path: request.targetVideoUrl, type: 1 },
      face_enhance: true,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return data.data._id;
}

/**
 * Poll face-swap job status.
 */
export async function getFaceSwapResult(
  jobId: string,
  token: string
): Promise<FaceSwapTask> {
  const { data } = await axios.get<{
    data: { _id: string; status: number; video?: string };
  }>(`${AKOOL_BASE}/faceswap/video/query?_id=${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return {
    _id: data.data._id,
    status: data.data.status as FaceSwapTask["status"],
    videoUrl: data.data.video,
  };
}

/**
 * Get Akool auth token via client credentials.
 */
export async function getAkoolToken(
  clientId: string,
  clientSecret: string
): Promise<string> {
  const { data } = await axios.post<{ data: { token: string } }>(
    `${AKOOL_BASE}/open/create`,
    { clientId, clientSecret }
  );
  return data.data.token;
}
