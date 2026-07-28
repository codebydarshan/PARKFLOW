"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountUpProps {
  value: number;
  durationMs?: number;
  suffix?: string;
  className?: string;
}

/** Animates numeric stats for demo impact. */
export function CountUp({
  value,
  durationMs = 700,
  suffix = "",
  className,
}: CountUpProps) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const decimals = Number.isInteger(value)
      ? 0
      : (String(value).split(".")[1]?.length ?? 1);

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = value * eased;
      setDisplay(
        decimals === 0
          ? Math.round(next)
          : Number(next.toFixed(decimals))
      );
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, durationMs, reduced]);

  return (
    <span className={cn("tabular-nums", className)}>
      {display}
      {suffix}
    </span>
  );
}
