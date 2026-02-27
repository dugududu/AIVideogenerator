"use client";

import { useState } from "react";
import { AvatarCard } from "@/components/video/AvatarCard";
import { ScriptEditor } from "@/components/video/ScriptEditor";
import { VideoSettingsPanel } from "@/components/video/VideoSettingsPanel";
import { cn } from "@/lib/utils";
import type { Avatar, VideoSettings, VideoJob } from "@/types";

const STEPS = ["Script", "Avatar", "Settings", "Generate"] as const;
type Step = (typeof STEPS)[number];

const DEFAULT_SETTINGS: VideoSettings = {
  aspectRatio: "9:16",
  resolution: "1080p",
  captions: true,
};

interface VideoGeneratorProps {
  avatars: Avatar[];
}

export function VideoGenerator({ avatars }: VideoGeneratorProps) {
  const [step, setStep] = useState<Step>("Script");
  const [script, setScript] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [settings, setSettings] = useState<VideoSettings>(DEFAULT_SETTINGS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [job, setJob] = useState<Partial<VideoJob> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(step);
  const canProceed =
    (step === "Script" && script.trim().length > 10) ||
    (step === "Avatar" && selectedAvatar !== null) ||
    step === "Settings";

  function goNext() {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  }

  function goBack() {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  }

  async function handleGenerate() {
    if (!selectedAvatar || !script) return;
    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script,
          avatarIdOrUrl: selectedAvatar.thumbnailUrl,
          voiceId: "21m00Tcm4TlvDq8ikWAM", // default ElevenLabs voice
          settings,
          avatarProvider: selectedAvatar.provider === "heygen" ? "heygen" : "did",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Generation failed");
      setJob({ id: data.jobId, status: "pending" });
      setStep("Generate");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step progress */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => i < stepIndex && setStep(s)}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                s === step
                  ? "text-violet-400"
                  : i < stepIndex
                  ? "text-gray-300 cursor-pointer hover:text-gray-100"
                  : "text-gray-600 cursor-default"
              )}
            >
              <span
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2",
                  s === step
                    ? "border-violet-500 bg-violet-500/20 text-violet-300"
                    : i < stepIndex
                    ? "border-green-500 bg-green-500/10 text-green-400"
                    : "border-gray-700 text-gray-600"
                )}
              >
                {i < stepIndex ? "✓" : i + 1}
              </span>
              {s}
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  i < stepIndex ? "bg-green-500/40" : "bg-gray-700"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-6">
        {step === "Script" && (
          <ScriptEditor value={script} onChange={setScript} />
        )}

        {step === "Avatar" && (
          <div>
            <h3 className="text-sm font-medium text-gray-200 mb-4">
              Choose an AI Avatar
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {avatars.map((avatar) => (
                <AvatarCard
                  key={avatar.id}
                  avatar={avatar}
                  selected={selectedAvatar?.id === avatar.id}
                  onSelect={setSelectedAvatar}
                />
              ))}
            </div>
          </div>
        )}

        {step === "Settings" && (
          <VideoSettingsPanel settings={settings} onChange={setSettings} />
        )}

        {step === "Generate" && (
          <div className="text-center py-8">
            {job?.status === "pending" && (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-violet-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  Generating your video…
                </h3>
                <p className="text-sm text-gray-400">
                  This usually takes 1–3 minutes. You&apos;ll receive a notification when it&apos;s ready.
                </p>
              </>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            stepIndex === 0
              ? "text-gray-600 cursor-default"
              : "text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700"
          )}
        >
          ← Back
        </button>

        {step !== "Generate" && step !== "Settings" && (
          <button
            type="button"
            onClick={goNext}
            disabled={!canProceed}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all",
              canProceed
                ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20"
                : "bg-gray-800 text-gray-600 cursor-not-allowed"
            )}
          >
            Next →
          </button>
        )}

        {step === "Settings" && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2 rounded-lg text-sm font-semibold bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating…" : "✨ Generate Video"}
          </button>
        )}
      </div>
    </div>
  );
}
