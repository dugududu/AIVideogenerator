"use client";

import { cn } from "@/lib/utils";
import type { VideoSettings } from "@/types";

interface VideoSettingsPanelProps {
  settings: VideoSettings;
  onChange: (settings: VideoSettings) => void;
}

const ASPECT_RATIOS: { value: VideoSettings["aspectRatio"]; label: string; icon: string }[] = [
  { value: "9:16", label: "Portrait", icon: "▬" },
  { value: "16:9", label: "Landscape", icon: "▭" },
  { value: "1:1", label: "Square", icon: "■" },
];

const RESOLUTIONS: { value: VideoSettings["resolution"]; label: string }[] = [
  { value: "720p", label: "720p HD" },
  { value: "1080p", label: "1080p Full HD" },
  { value: "4k", label: "4K Ultra HD" },
];

export function VideoSettingsPanel({ settings, onChange }: VideoSettingsPanelProps) {
  function update<K extends keyof VideoSettings>(key: K, value: VideoSettings[K]) {
    onChange({ ...settings, [key]: value });
  }

  return (
    <div className="space-y-5">
      {/* Aspect Ratio */}
      <div>
        <label className="text-sm font-medium text-gray-200 block mb-2">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ASPECT_RATIOS.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => update("aspectRatio", value)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border py-3 text-xs font-medium transition-all",
                settings.aspectRatio === value
                  ? "border-violet-500 bg-violet-500/10 text-violet-300"
                  : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
              )}
            >
              <span
                className={cn(
                  "text-xl leading-none",
                  value === "9:16" ? "scale-x-50" : value === "16:9" ? "scale-y-50" : ""
                )}
              >
                {icon}
              </span>
              {label}
              <span className="text-[10px] opacity-60">{value}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resolution */}
      <div>
        <label className="text-sm font-medium text-gray-200 block mb-2">
          Resolution
        </label>
        <div className="flex flex-col gap-1.5">
          {RESOLUTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => update("resolution", value)}
              className={cn(
                "flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-all",
                settings.resolution === value
                  ? "border-violet-500 bg-violet-500/10 text-violet-300"
                  : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
              )}
            >
              <span>{label}</span>
              {settings.resolution === value && (
                <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Captions */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-200">Auto Captions</p>
          <p className="text-xs text-gray-500">Add AI-generated subtitles</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={settings.captions}
          onClick={() => update("captions", !settings.captions)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            settings.captions ? "bg-violet-600" : "bg-gray-700"
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              settings.captions ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>
    </div>
  );
}
