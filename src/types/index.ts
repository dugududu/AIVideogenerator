// ─────────────────────────────────────────────────────────────────────────────
// Core domain types for the AI UGC Video Generator SaaS
// ─────────────────────────────────────────────────────────────────────────────

export type VideoProvider = "kling" | "veo" | "runway" | "pika";
export type VoiceProvider = "elevenlabs" | "openai" | "murf";
export type AvatarProvider = "did" | "heygen" | "synthesia";
export type FaceSwapProvider = "faceswapai" | "reface" | "akool";

/** A pre-made or user-uploaded AI character avatar */
export interface Avatar {
  id: string;
  name: string;
  thumbnailUrl: string;
  previewVideoUrl?: string;
  gender: "male" | "female" | "neutral";
  style: "realistic" | "animated" | "cartoon";
  provider: AvatarProvider;
}

/** Voice option from a TTS provider */
export interface Voice {
  id: string;
  name: string;
  language: string;
  accent?: string;
  gender: "male" | "female" | "neutral";
  previewUrl?: string;
  provider: VoiceProvider;
}

/** A user's video generation job */
export interface VideoJob {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
  outputUrl?: string;
  thumbnailUrl?: string;
  script: string;
  avatarId: string;
  voiceId: string;
  settings: VideoSettings;
  provider: VideoProvider;
}

/** Settings for video generation */
export interface VideoSettings {
  aspectRatio: "9:16" | "16:9" | "1:1";
  duration?: number; // seconds
  resolution: "720p" | "1080p" | "4k";
  captions: boolean;
  captionStyle?: CaptionStyle;
  backgroundMusic?: boolean;
  musicVolume?: number; // 0–1
}

export interface CaptionStyle {
  font: string;
  size: "small" | "medium" | "large";
  color: string;
  position: "top" | "middle" | "bottom";
  highlight: boolean;
}

/** Face-swap job */
export interface FaceSwapJob {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  sourceImageUrl: string;  // face to swap in
  targetVideoUrl: string;  // video to swap into
  outputVideoUrl?: string;
  provider: FaceSwapProvider;
  createdAt: string;
}

/** SaaS pricing plan */
export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  videosPerMonth: number;
  features: string[];
  highlighted?: boolean;
}

/** API error shape */
export interface ApiError {
  error: string;
  message: string;
  statusCode?: number;
}

/** Generic API response */
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
