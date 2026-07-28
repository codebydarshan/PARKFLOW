"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";
import type { ActionFeedbackState } from "@/hooks/use-action-feedback";

const icons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
  info: Info,
};

const tones = {
  success: "text-success",
  warning: "text-warning-foreground",
  danger: "text-destructive",
  info: "text-primary",
};

interface ActionFeedbackProps {
  feedback: ActionFeedbackState;
  onDismiss?: () => void;
}

export function ActionFeedback({ feedback, onDismiss }: ActionFeedbackProps) {
  const Icon = icons[feedback.tone];
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {feedback.open ? (
        <motion.div
          role="status"
          aria-live="polite"
          initial={reduced ? false : { opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "fixed right-4 bottom-4 z-[60] flex w-[min(100%-2rem,22rem)] items-start gap-3 rounded-2xl p-4 max-sm:bottom-[calc(1rem+env(safe-area-inset-bottom,0px))]",
            glass.float
          )}
        >
          <div
            className={cn(
              "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-background/50",
              tones[feedback.tone]
            )}
          >
            <Icon className="size-4.5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium tracking-tight">{feedback.title}</p>
            {feedback.description ? (
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {feedback.description}
              </p>
            ) : null}
          </div>
          {onDismiss ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onDismiss}
              aria-label="Dismiss notification"
            >
              Close
            </Button>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
