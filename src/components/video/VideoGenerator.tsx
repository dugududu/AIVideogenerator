"use client";

import { useState, useEffect } from "react";
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

// Demo pipeline steps shown while "generating"
const DEMO_PIPELINE_STEPS = [
  { label: "Converting script to speech (ElevenLabs)…", duration: 1800 },
  { label: "Animating avatar face (D-ID / HeyGen)…", duration: 2400 },
  { label: "Adding captions…", duration: 1000 },
  { label: "Compositing final video…", duration: 1400 },
];

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
  // Demo mode state
  const [demoPipelineStep, setDemoPipelineStep] = useState(-1);
  const [demoComplete, setDemoComplete] = useState(false);

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

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
    if (step === "Generate") {
      setJob(null);
      setDemoComplete(false);
      setDemoPipelineStep(-1);
    }
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  }

  // Run the demo pipeline animation step by step
  useEffect(() => {
    if (!isGenerating || !isDemoMode) return;

    let current = 0;
    setDemoPipelineStep(0);

    function advance() {
      current += 1;
      if (current < DEMO_PIPELINE_STEPS.length) {
        setDemoPipelineStep(current);
        setTimeout(advance, DEMO_PIPELINE_STEPS[current].duration);
      } else {
        // All done
        setTimeout(() => {
          setIsGenerating(false);
          setDemoComplete(true);
          setJob({ id: "demo-job-001", status: "completed" });
        }, 800);
      }
    }

    setTimeout(advance, DEMO_PIPELINE_STEPS[0].duration);
  }, [isGenerating, isDemoMode]);

  async function handleGenerate() {
    if (!selectedAvatar || !script) return;
    setIsGenerating(true);
    setError(null);
    setDemoComplete(false);
    setDemoPipelineStep(-1);
    setStep("Generate");

    if (isDemoMode) {
      // Demo mode: animate pipeline, no real API call
      return;
    }

    try {
      const res = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script,
          avatarIdOrUrl: selectedAvatar.thumbnailUrl,
          voiceId: "21m00Tcm4TlvDq8ikWAM",
          settings,
          avatarProvider: selectedAvatar.provider === "heygen" ? "heygen" : "did",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Generation failed");
      setJob({ id: data.jobId, status: "pending" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsGenerating(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Demo mode banner */}
      {isDemoMode && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/8 px-4 py-3">
          <span className="text-amber-400 mt-0.5">🎮</span>
          <div>
            <p className="text-sm font-medium text-amber-300">Demo Mode — No API keys required</p>
            <p className="text-xs text-amber-400/80 mt-0.5">
              Walk through the full UI flow. Add real API keys in{" "}
              <code className="font-mono bg-amber-500/15 px-1 rounded">.env.local</code> to generate actual videos.
            </p>
          </div>
        </div>
      )}

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
          <div className="py-6">
            {isGenerating && (
              <div className="text-center">
                {/* Spinner */}
                <div className="mx-auto w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-violet-400 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>

                {/* Live pipeline steps (demo mode) */}
                {isDemoMode && (
                  <div className="text-left max-w-sm mx-auto space-y-3 mb-4">
                    {DEMO_PIPELINE_STEPS.map((ps, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        {i < demoPipelineStep ? (
                          <span className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center shrink-0">
                            <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        ) : i === demoPipelineStep ? (
                          <span className="w-5 h-5 rounded-full border border-violet-500/40 flex items-center justify-center shrink-0">
                            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full border border-gray-700 shrink-0" />
                        )}
                        <span className={cn(
                          "transition-colors",
                          i < demoPipelineStep
                            ? "text-green-400 line-through decoration-green-600"
                            : i === demoPipelineStep
                            ? "text-violet-300"
                            : "text-gray-600"
                        )}>
                          {ps.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-sm text-gray-400">
                  {isDemoMode
                    ? "Running demo pipeline…"
                    : "This usually takes 1–3 minutes. You'll receive a notification when it's ready."}
                </p>
              </div>
            )}

            {/* Completed state */}
            {!isGenerating && demoComplete && (
              <div className="text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  🎉 Video ready! (Demo)
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                  In production this would be your generated UGC video. Add real API keys to create actual videos.
                </p>

                {/* Fake video player placeholder */}
                <div className="relative mx-auto w-48 aspect-[9/16] rounded-xl overflow-hidden border border-gray-700 bg-gradient-to-b from-violet-900/30 to-gray-900">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="w-14 h-14 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                      <svg className="w-7 h-7 text-violet-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-400 text-center px-4">
                      {selectedAvatar?.name ?? "Avatar"} · {settings.aspectRatio}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-center mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm hover:border-gray-500 hover:text-white transition-colors"
                    onClick={() => {
                      setStep("Script");
                      setJob(null);
                      setDemoComplete(false);
                      setDemoPipelineStep(-1);
                    }}
                  >
                    ← Create another
                  </button>
                  <button
                    type="button"
                    aria-disabled="true"
                    className="px-4 py-2 rounded-lg bg-violet-600/50 text-white/60 text-sm font-medium cursor-not-allowed select-none"
                    title="Add real API keys to enable downloads"
                  >
                    ⬇ Download (demo only)
                  </button>
                </div>
              </div>
            )}

            {/* Real job pending state */}
            {!isGenerating && job?.status === "pending" && !demoComplete && (
              <div className="text-center py-2">
                <p className="text-sm text-gray-400">
                  Job submitted (ID: <code className="text-violet-400 font-mono text-xs">{job.id}</code>).
                  Polling for completion…
                </p>
              </div>
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
          disabled={stepIndex === 0 || isGenerating}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            stepIndex === 0 || isGenerating
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

