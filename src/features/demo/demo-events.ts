import type { DemoStepId, DemoToast } from "./demo-state";

export type DemoEventType =
  | "start"
  | "pause"
  | "resume"
  | "stop"
  | "replay"
  | "skip"
  | "previous"
  | "speed"
  | "step-enter"
  | "step-exit"
  | "toast"
  | "complete";

export interface DemoEvent {
  type: DemoEventType;
  stepId?: DemoStepId;
  stepIndex?: number;
  toast?: DemoToast;
  speed?: 1 | 2 | 4;
  at: number;
}

export function createDemoToast(
  title: string,
  description?: string,
  tone: DemoToast["tone"] = "success"
): DemoToast {
  return {
    id: `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title,
    description,
    tone,
  };
}
