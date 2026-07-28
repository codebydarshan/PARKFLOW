"use client";

import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  isDemoActive,
  useDemoOptional,
} from "@/features/demo/demo-provider";
import { DEMO_TIMELINE } from "@/features/demo/demo-timeline";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";
import type { DemoSpeed } from "@/features/demo/demo-state";

function formatMs(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function DemoControls() {
  const demo = useDemoOptional();
  if (!demo || !isDemoActive(demo.status)) return null;

  const step = DEMO_TIMELINE[demo.stepIndex];
  const beat = step?.beat ?? demo.totalSteps;
  const progress = Math.min(1, demo.elapsedMs / Math.max(demo.totalDurationMs, 1));
  const speeds: DemoSpeed[] = [1, 2, 4];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-3xl rounded-2xl p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:inset-x-auto sm:right-4 sm:left-auto sm:w-[28rem]",
        glass.float
      )}
      role="region"
      aria-label="Demo controls"
    >
      <div className="mb-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          Step {beat}/{demo.totalSteps}
          {step ? ` · ${step.label}` : ""}
        </span>
        <span className="tabular-nums">
          {formatMs(demo.elapsedMs)} / {formatMs(demo.remainingMs)} left
        </span>
      </div>

      <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.2 }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Previous step"
          onClick={demo.previousStep}
        >
          <ChevronLeft className="size-4" />
        </Button>

        {demo.status === "paused" || demo.status === "completed" ? (
          <Button
            size="icon-sm"
            variant="default"
            aria-label={demo.status === "completed" ? "Replay" : "Resume"}
            onClick={demo.status === "completed" ? demo.replay : demo.resume}
          >
            <Play className="size-4" />
          </Button>
        ) : (
          <Button
            size="icon-sm"
            variant="default"
            aria-label="Pause"
            onClick={demo.pause}
          >
            <Pause className="size-4" />
          </Button>
        )}

        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Skip step"
          onClick={demo.skipStep}
        >
          <ChevronRight className="size-4" />
        </Button>

        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Replay demo"
          onClick={demo.replay}
        >
          <RotateCcw className="size-4" />
        </Button>

        <div className="ml-auto flex items-center gap-1">
          {speeds.map((speed) => (
            <button
              key={speed}
              type="button"
              onClick={() => demo.setSpeed(speed)}
              className={cn(
                "rounded-lg px-2 py-1 text-xs tabular-nums transition-colors",
                demo.speed === speed
                  ? "bg-primary/15 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {speed}×
            </button>
          ))}
        </div>

        <Button
          size="icon-sm"
          variant="ghost"
          aria-label="Stop demo"
          onClick={demo.stop}
        >
          <X className="size-4" />
        </Button>
      </div>

      {!demo.narrationVisible ? (
        <button
          type="button"
          onClick={() => demo.setNarrationVisible(true)}
          className="mt-2 text-xs text-primary hover:underline"
        >
          Show narration
        </button>
      ) : null}
    </motion.div>
  );
}
