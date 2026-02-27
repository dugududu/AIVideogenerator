"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
  maxChars?: number;
  placeholder?: string;
}

const HOOK_TEMPLATES = [
  "🔥 Stop scrolling! Here's why {product} will change your life...",
  "❌ You're doing {task} wrong. Here's the fix:",
  "✅ I tried {product} for 30 days. Here's what happened:",
  "💡 The secret {niche} pros don't want you to know:",
  "🚀 This ONE thing doubled my {result} in just 7 days:",
];

export function ScriptEditor({
  value,
  onChange,
  maxChars = 500,
  placeholder = "Write your UGC video script here...",
}: ScriptEditorProps) {
  const [showTemplates, setShowTemplates] = useState(false);

  const handleTemplate = useCallback(
    (template: string) => {
      onChange(template);
      setShowTemplates(false);
    },
    [onChange]
  );

  const charCount = value.length;
  // ~150 wpm, avg 5 chars/word → ~12.5 chars/sec
  const estimatedDuration = Math.ceil(charCount / 12.5);

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-200">Video Script</label>
        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Hook templates
        </button>
      </div>

      {/* Hook templates */}
      {showTemplates && (
        <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-3 space-y-2">
          <p className="text-xs text-gray-400 mb-2">Click to use a template:</p>
          {HOOK_TEMPLATES.map((t, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleTemplate(t)}
              className="w-full text-left text-xs text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 rounded-md px-3 py-2 transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxChars}
          rows={6}
          className={cn(
            "w-full rounded-lg border bg-gray-900 text-gray-100 placeholder-gray-500",
            "px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 transition-colors",
            charCount > maxChars * 0.9
              ? "border-amber-500/50 focus:ring-amber-500/30"
              : "border-gray-700 focus:ring-violet-500/30 focus:border-violet-500/50"
          )}
        />
        {/* Stats bar */}
        <div className="absolute bottom-2 right-3 flex items-center gap-3 text-xs text-gray-500">
          <span>~{estimatedDuration}s</span>
          <span
            className={cn(
              charCount > maxChars * 0.9 ? "text-amber-400" : "text-gray-500"
            )}
          >
            {charCount}/{maxChars}
          </span>
        </div>
      </div>
    </div>
  );
}
