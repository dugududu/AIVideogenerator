import Link from "next/link";
import { VideoGenerator } from "@/components/video/VideoGenerator";
import type { Avatar } from "@/types";

// Inline SVG data-URI avatars — always render without any network requests.
// In production, replace thumbnailUrl with real D-ID / HeyGen avatar image URLs.
const AVATAR_SVGS = {
  anna:  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTYwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM3YzNhZWQiIHN0b3Atb3BhY2l0eT0iMC45Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzdjM2FlZCIgc3RvcC1vcGFjaXR5PSIwLjUiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTYwIiBmaWxsPSJ1cmwoI2JnKSIgcng9IjAiLz4KICA8ZWxsaXBzZSBjeD0iNjAiIGN5PSI0NCIgcng9IjI4IiByeT0iMjQiIGZpbGw9IiM0YzFkOTUiLz4KICA8ZWxsaXBzZSBjeD0iNjAiIGN5PSI1NSIgcng9IjIyIiByeT0iMjYiIGZpbGw9IiNmYmJmMjQiLz4KICA8cGF0aCBkPSJNMTUgMTYwIFEzMCAxMDAgNjAgOTggUTkwIDEwMCAxMDUgMTYwIFoiIGZpbGw9IiM0YzFkOTUiIG9wYWNpdHk9IjAuOCIvPgogIDxyZWN0IHg9IjUyIiB5PSI3OCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZmJiZjI0IiByeD0iMyIvPgo8L3N2Zz4=",
  james: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTYwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxZDRlZDgiIHN0b3Atb3BhY2l0eT0iMC45Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFkNGVkOCIgc3RvcC1vcGFjaXR5PSIwLjUiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTYwIiBmaWxsPSJ1cmwoI2JnKSIgcng9IjAiLz4KICA8ZWxsaXBzZSBjeD0iNjAiIGN5PSI0NCIgcng9IjI4IiByeT0iMjQiIGZpbGw9IiMxZTNhOGEiLz4KICA8ZWxsaXBzZSBjeD0iNjAiIGN5PSI1NSIgcng9IjIyIiByeT0iMjYiIGZpbGw9IiNjMjg1NWEiLz4KICA8cGF0aCBkPSJNMTUgMTYwIFEzMCAxMDAgNjAgOTggUTkwIDEwMCAxMDUgMTYwIFoiIGZpbGw9IiMxZTNhOGEiIG9wYWNpdHk9IjAuOCIvPgogIDxyZWN0IHg9IjUyIiB5PSI3OCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjYzI4NTVhIiByeD0iMyIvPgo8L3N2Zz4=",
  sofia: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTYwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNiZTE4NWQiIHN0b3Atb3BhY2l0eT0iMC45Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2JlMTg1ZCIgc3RvcC1vcGFjaXR5PSIwLjUiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTYwIiBmaWxsPSJ1cmwoI2JnKSIgcng9IjAiLz4KICA8ZWxsaXBzZSBjeD0iNjAiIGN5PSI0NCIgcng9IjI4IiByeT0iMjQiIGZpbGw9IiM4MzE4NDMiLz4KICA8ZWxsaXBzZSBjeD0iNjAiIGN5PSI1NSIgcng9IjIyIiByeT0iMjYiIGZpbGw9IiNmNGEyNjEiLz4KICA8cGF0aCBkPSJNMTUgMTYwIFEzMCAxMDAgNjAgOTggUTkwIDEwMCAxMDUgMTYwIFoiIGZpbGw9IiM4MzE4NDMiIG9wYWNpdHk9IjAuOCIvPgogIDxyZWN0IHg9IjUyIiB5PSI3OCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZjRhMjYxIiByeD0iMyIvPgo8L3N2Zz4=",
  ryan:  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTYwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwNjVmNDYiIHN0b3Atb3BhY2l0eT0iMC45Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA2NWY0NiIgc3RvcC1vcGFjaXR5PSIwLjUiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTYwIiBmaWxsPSJ1cmwoI2JnKSIgcng9IjAiLz4KICA8ZWxsaXBzZSBjeD0iNjAiIGN5PSI0NCIgcng9IjI4IiByeT0iMjQiIGZpbGw9IiMwNjRlM2IiLz4KICA8ZWxsaXBzZSBjeD0iNjAiIGN5PSI1NSIgcng9IjIyIiByeT0iMjYiIGZpbGw9IiNhMTYyMDciLz4KICA8cGF0aCBkPSJNMTUgMTYwIFEzMCAxMDAgNjAgOTggUTkwIDEwMCAxMDUgMTYwIFoiIGZpbGw9IiMwNjRlM2IiIG9wYWNpdHk9IjAuOCIvPgogIDxyZWN0IHg9IjUyIiB5PSI3OCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjYTE2MjA3IiByeD0iMyIvPgo8L3N2Zz4=",
  mia:   "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAgMTYwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJnIiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM2ZDI4ZDkiIHN0b3Atb3BhY2l0eT0iMC45Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzZkMjhkOSIgc3RvcC1vcGFjaXR5PSIwLjUiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTYwIiBmaWxsPSJ1cmwoI2JnKSIgcng9IjAiLz4KICA8ZWxsaXBzZSBjeD0iNjAiIGN5PSI0NCIgcng9IjI4IiByeT0iMjQiIGZpbGw9IiM0YzFkOTUiLz4KICA8ZWxsaXBzZSBjeD0iNjAiIGN5PSI1NSIgcng9IjIyIiByeT0iMjYiIGZpbGw9IiNmYjkyM2MiLz4KICA8cGF0aCBkPSJNMTUgMTYwIFEzMCAxMDAgNjAgOTggUTkwIDEwMCAxMDUgMTYwIFoiIGZpbGw9IiM0YzFkOTUiIG9wYWNpdHk9IjAuOCIvPgogIDxyZWN0IHg9IjUyIiB5PSI3OCIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiBmaWxsPSIjZmI5MjNjIiByeD0iMyIvPgo8L3N2Zz4=",
};

// In production, replace thumbnailUrl with real D-ID / HeyGen avatar image URLs.
const SAMPLE_AVATARS: Avatar[] = [
  {
    id: "did-avatar-anna",
    name: "Anna",
    thumbnailUrl: AVATAR_SVGS.anna,
    gender: "female",
    style: "realistic",
    provider: "did",
  },
  {
    id: "did-avatar-james",
    name: "James",
    thumbnailUrl: AVATAR_SVGS.james,
    gender: "male",
    style: "realistic",
    provider: "did",
  },
  {
    id: "heygen-avatar-sofia",
    name: "Sofia",
    thumbnailUrl: AVATAR_SVGS.sofia,
    gender: "female",
    style: "realistic",
    provider: "heygen",
  },
  {
    id: "heygen-avatar-ryan",
    name: "Ryan",
    thumbnailUrl: AVATAR_SVGS.ryan,
    gender: "male",
    style: "realistic",
    provider: "heygen",
  },
  {
    id: "heygen-avatar-mia",
    name: "Mia",
    thumbnailUrl: AVATAR_SVGS.mia,
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
