// GET /api/avatars
// Return the catalogue of available AI avatars.
// In production this would come from a DB; here we return sample data.
// thumbnailUrl values are inline SVG data-URIs so they render without any network requests.
// Replace with real D-ID / HeyGen CDN URLs once you have API keys.
import { NextResponse } from "next/server";
import type { Avatar } from "@/types";

const SAMPLE_AVATARS: Avatar[] = [
  {
    id: "did-avatar-anna",
    name: "Anna",
    thumbnailUrl: "https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/thumbnail.jpeg",
    gender: "female",
    style: "realistic",
    provider: "did",
  },
  {
    id: "did-avatar-james",
    name: "James",
    thumbnailUrl: "https://create-images-results.d-id.com/DefaultPresenters/Ethan_m/thumbnail.jpeg",
    gender: "male",
    style: "realistic",
    provider: "did",
  },
  {
    id: "heygen-avatar-sofia",
    name: "Sofia",
    thumbnailUrl: "https://resource.heygen.com/avatar/Sofia.jpg",
    gender: "female",
    style: "realistic",
    provider: "heygen",
  },
  {
    id: "heygen-avatar-ryan",
    name: "Ryan",
    thumbnailUrl: "https://resource.heygen.com/avatar/Ryan.jpg",
    gender: "male",
    style: "realistic",
    provider: "heygen",
  },
  {
    id: "heygen-avatar-mia",
    name: "Mia (Animated)",
    thumbnailUrl: "https://resource.heygen.com/avatar/Mia_animated.jpg",
    gender: "female",
    style: "animated",
    provider: "heygen",
  },
];

export async function GET() {
  return NextResponse.json({ avatars: SAMPLE_AVATARS });
}
