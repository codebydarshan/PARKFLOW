"use client";

import { useCallback, useState } from "react";

export type FeedbackTone = "success" | "warning" | "danger" | "info";

export interface ActionFeedbackState {
  open: boolean;
  title: string;
  description?: string;
  tone: FeedbackTone;
}

const initial: ActionFeedbackState = {
  open: false,
  title: "",
  description: undefined,
  tone: "success",
};

/** Visual action feedback for live demos — prefer this over silent state changes. */
export function useActionFeedback(durationMs = 2400) {
  const [feedback, setFeedback] = useState<ActionFeedbackState>(initial);

  const show = useCallback(
    (next: Omit<ActionFeedbackState, "open">) => {
      setFeedback({ ...next, open: true });
      window.setTimeout(() => {
        setFeedback((current) => ({ ...current, open: false }));
      }, durationMs);
    },
    [durationMs]
  );

  const dismiss = useCallback(() => {
    setFeedback((current) => ({ ...current, open: false }));
  }, []);

  return { feedback, show, dismiss };
}
