export type DemoSpeed = 1 | 2 | 4;

export type DemoStatus = "idle" | "running" | "paused" | "completed";

export type DemoStepId =
  | "resident-open"
  | "highlight-create"
  | "fill-form"
  | "generate-pass"
  | "allocate-twin"
  | "security-scan"
  | "vehicle-enter"
  | "admin-metrics"
  | "visit-progress"
  | "visitor-exit"
  | "parking-release"
  | "complete";

export interface DemoToast {
  id: string;
  title: string;
  description?: string;
  tone: "success" | "info" | "warning";
}

export interface DemoVisitorScript {
  visitorName: string;
  phone: string;
  vehicleNumber: string;
  vehicleType: "car" | "bike" | "taxi" | "delivery";
  visitDate: string;
  arrivalTime: string;
  durationHours: number;
  notes: string;
  visitorId: string;
  passId: string;
}

export interface DemoRuntimeState {
  status: DemoStatus;
  stepIndex: number;
  stepId: DemoStepId | null;
  speed: DemoSpeed;
  elapsedMs: number;
  totalDurationMs: number;
  narration: string;
  narrationVisible: boolean;
  spotlightTarget: string | null;
  toast: DemoToast | null;
  bayLabel: string | null;
  bayId: string | null;
  passId: string | null;
  visitorScript: DemoVisitorScript;
  createPassOpen: boolean;
  createPassPhase: "idle" | "fill" | "submit" | "success";
  securityPhase: "idle" | "scanning" | "verified" | "exit";
}

export interface DemoBridge {
  onPassCreated?: (payload: {
    passId: string;
    bayLabel: string;
    visitorName: string;
    vehiclePlate: string;
  }) => void;
  onExitMarked?: () => void;
}

export const DEMO_TOTAL_STEPS = 10;
