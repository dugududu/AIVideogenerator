import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UGC Studio — AI Video Generator",
  description:
    "Create studio-quality UGC videos with AI avatars, voice synthesis, and face-swap in minutes. Built on ElevenLabs, D-ID, HeyGen, Kling AI, and Akool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-gray-950 text-gray-100 font-sans">
        {children}
      </body>
    </html>
  );
}
