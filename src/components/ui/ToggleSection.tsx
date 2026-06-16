"use client";

import { useState } from "react";

interface ToggleSectionProps {
  title: string;
  count?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function ToggleSection({ title, count, defaultOpen = false, children }: ToggleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="mb-2xl">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left py-md border-b border-border hover:opacity-80 transition-opacity"
      >
        <span className="text-title text-foreground">
          {title}
          {count && (
            <span className="text-label text-foreground-secondary ml-sm font-normal">
              {count}
            </span>
          )}
        </span>
        <span className={`text-foreground-secondary transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <ChevronDown />
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-[9999px] opacity-100 pt-lg" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </section>
  );
}

function ChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 8 4 4 4-4" />
    </svg>
  );
}
