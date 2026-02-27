import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Controls demo mode. String "true"/"false" — checked with === "true" in VideoGenerator.tsx.
    // Defaults to "true" so the UI works without any API keys out of the box.
    // Override by setting NEXT_PUBLIC_DEMO_MODE=false in .env.local and adding real API keys.
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE ?? "true",
  },
};

export default nextConfig;
