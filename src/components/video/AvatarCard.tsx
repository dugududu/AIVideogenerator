"use client";

import { cn } from "@/lib/utils";
import type { Avatar } from "@/types";

interface AvatarCardProps {
  avatar: Avatar;
  selected?: boolean;
  onSelect?: (avatar: Avatar) => void;
}

export function AvatarCard({ avatar, selected, onSelect }: AvatarCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(avatar)}
      className={cn(
        "group relative rounded-xl overflow-hidden border-2 transition-all duration-200 w-full aspect-[3/4] bg-gray-900",
        selected
          ? "border-violet-500 ring-2 ring-violet-500/40"
          : "border-gray-700 hover:border-gray-500"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatar.thumbnailUrl}
        alt={avatar.name}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='8' r='4' fill='%236b7280'/%3E%3Cpath d='M4 20c0-4 3.6-7 8-7s8 3 8 7' fill='%236b7280'/%3E%3C/svg%3E";
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <p className="text-white text-sm font-medium truncate">{avatar.name}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <span
            className={cn(
              "text-xs px-1.5 py-0.5 rounded-full",
              avatar.style === "realistic"
                ? "bg-blue-500/30 text-blue-300"
                : "bg-purple-500/30 text-purple-300"
            )}
          >
            {avatar.style}
          </span>
          <span className="text-xs text-gray-400 capitalize">{avatar.provider}</span>
        </div>
      </div>

      {/* Selected checkmark */}
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}
