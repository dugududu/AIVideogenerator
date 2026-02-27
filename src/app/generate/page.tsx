import Link from "next/link";
import { VideoGenerator } from "@/components/video/VideoGenerator";
import type { Avatar } from "@/types";

// In production this would be fetched from the DB / API.
const SAMPLE_AVATARS: Avatar[] = [
  {
    id: "did-avatar-anna",
    name: "Anna",
    thumbnailUrl:
      "https://create-images-results.d-id.com/DefaultPresenters/Noelle_f/thumbnail.jpeg",
    gender: "female",
    style: "realistic",
    provider: "did",
  },
  {
    id: "did-avatar-james",
    name: "James",
    thumbnailUrl:
      "https://create-images-results.d-id.com/DefaultPresenters/Ethan_m/thumbnail.jpeg",
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
    name: "Mia",
    thumbnailUrl: "https://resource.heygen.com/avatar/Mia_animated.jpg",
    gender: "female",
    style: "animated",
    provider: "heygen",
  },
];

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
          >
            UGC Studio
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
          >
            Pricing
          </Link>
        </div>
      </nav>

      <main className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              Create Your AI UGC Video
            </h1>
            <p className="text-gray-400 text-sm">
              Pick your avatar, write your script, and let AI do the rest.
            </p>
          </div>
          <VideoGenerator avatars={SAMPLE_AVATARS} />
        </div>
      </main>
    </div>
  );
}
