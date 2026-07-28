"use client";

import { useEffect, useState } from "react";

/** Simulates a brief loading state for premium dashboard polish. */
export function useDemoLoading(delayMs = 450): boolean {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs]);

  return loading;
}
