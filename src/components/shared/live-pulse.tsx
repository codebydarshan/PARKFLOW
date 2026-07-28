"use client";

import { cn } from "@/lib/utils";

interface LivePulseProps {
  label?: string;
  className?: string;
}

export function LivePulse({ label = "Live", className }: LivePulseProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/40 px-2.5 py-1 text-xs font-medium backdrop-blur-sm",
        className
      )}
    >
      <span className="relative flex size-1.5" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex size-1.5 rounded-full bg-success" />
      </span>
      {label}
    </span>
  );
}
