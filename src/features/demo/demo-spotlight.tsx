"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { isDemoActive, useDemoOptional } from "@/features/demo/demo-provider";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";

export function DemoSpotlight() {
  const demo = useDemoOptional();
  const reduced = useReducedMotion();
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!demo || !isDemoActive(demo.status) || !demo.spotlightTarget) {
      setRect(null);
      return;
    }

    let alive = true;
    let measuredOnce = false;

    function measure() {
      if (!demo?.spotlightTarget) return;
      const el = document.querySelector(
        `[data-demo-target="${demo.spotlightTarget}"]`
      );
      if (el && alive) {
        setRect(el.getBoundingClientRect());
        if (!measuredOnce && !reduced) {
          measuredOnce = true;
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }
    }

    measure();
    const id = window.setInterval(measure, 500);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);

    return () => {
      alive = false;
      window.clearInterval(id);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [demo?.spotlightTarget, demo?.status, demo?.stepId, demo, reduced]);

  if (!demo || !isDemoActive(demo.status) || !rect) return null;

  const pad = 10;

  return (
    <motion.div
      key={demo.spotlightTarget ?? "none"}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pointer-events-none fixed z-[70]"
      style={{
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
        borderRadius: 16,
        boxShadow:
          "0 0 0 9999px rgba(0,0,0,0.42), 0 0 0 2px color-mix(in oklch, var(--primary) 70%, transparent), 0 0 28px color-mix(in oklch, var(--primary) 30%, transparent)",
      }}
      aria-hidden="true"
    />
  );
}

export function DemoNarration() {
  const demo = useDemoOptional();
  if (!demo || !isDemoActive(demo.status) || !demo.narrationVisible) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={demo.narration}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className={cn(
          "pointer-events-auto fixed top-[4.75rem] right-3 z-[80] w-[min(100%-1.5rem,20rem)] rounded-2xl p-4 sm:right-4",
          glass.float
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium tracking-[0.08em] text-primary uppercase">
              Live Demo
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground">
              {demo.narration}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => demo.setNarrationVisible(false)}
            aria-label="Hide narration"
          >
            Hide
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function DemoToastHost() {
  const demo = useDemoOptional();

  return (
    <AnimatePresence>
      {demo?.toast ? (
        <motion.div
          key={demo.toast.id}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          className={cn(
            "fixed bottom-[7.5rem] left-1/2 z-[85] w-[min(100%-2rem,24rem)] -translate-x-1/2 rounded-2xl px-4 py-3 text-center sm:bottom-[8.25rem]",
            glass.float
          )}
        >
          <p className="text-sm font-semibold tracking-tight">
            {demo.toast.title}
          </p>
          {demo.toast.description ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {demo.toast.description}
            </p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
