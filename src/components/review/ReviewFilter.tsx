"use client";

interface ReviewFilterProps {
  activeSource: string;
  onChange: (source: string) => void;
}

const SOURCES = [
  { value: "", label: "Semua" },
  { value: "google_maps", label: "Google Maps" },
  { value: "tiktok", label: "TikTok" },
];

export function ReviewFilter({ activeSource, onChange }: ReviewFilterProps) {
  return (
    <div className="flex items-center rounded-button border border-border overflow-hidden">
      {SOURCES.map((s) => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          className={`h-9 px-4 text-caption font-medium transition-colors border-r border-border last:border-r-0 ${
            activeSource === s.value
              ? "bg-foreground text-background"
              : "bg-surface text-foreground-secondary hover:text-foreground hover:bg-surface-elevated"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
