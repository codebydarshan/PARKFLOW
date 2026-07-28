import type { DemoStepId } from "./demo-state";

export interface DemoTimelineStep {
  id: DemoStepId;
  /** Story beat number shown in UI (1–10). Final complete is still step 10. */
  beat: number;
  label: string;
  narration: string;
  route: string;
  /** Base duration at 1× speed */
  durationMs: number;
  spotlight?: string | null;
  toast?: { title: string; description?: string; tone?: "success" | "info" | "warning" };
  createPassPhase?: "idle" | "fill" | "submit" | "success";
  createPassOpen?: boolean;
  securityPhase?: "idle" | "scanning" | "verified" | "exit";
  /** Engine action key handled by controller */
  action?:
    | "none"
    | "reserve"
    | "allocate"
    | "release"
    | "prepare"
    | "complete";
}

/** ~55s at 1× across the full journey. */
export const DEMO_TIMELINE: DemoTimelineStep[] = [
  {
    id: "resident-open",
    beat: 1,
    label: "Resident dashboard",
    narration: "Resident opens the dashboard to invite a visitor.",
    route: "/resident",
    durationMs: 3500,
    spotlight: "demo-resident-hero",
    action: "prepare",
    createPassOpen: false,
    createPassPhase: "idle",
  },
  {
    id: "highlight-create",
    beat: 1,
    label: "Create Visitor Pass",
    narration: "Resident creates a visitor pass.",
    route: "/resident",
    durationMs: 3000,
    spotlight: "demo-create-pass",
    createPassOpen: false,
    createPassPhase: "idle",
  },
  {
    id: "fill-form",
    beat: 2,
    label: "Visitor details",
    narration: "Visitor details fill in automatically — name, vehicle, and timing.",
    route: "/resident",
    durationMs: 4500,
    spotlight: "demo-pass-form",
    createPassOpen: true,
    createPassPhase: "fill",
  },
  {
    id: "generate-pass",
    beat: 3,
    label: "QR generated",
    narration: "QR code generated instantly.",
    route: "/resident",
    durationMs: 4500,
    spotlight: "demo-pass-qr",
    toast: {
      title: "Visitor Pass Generated",
      description: "QR Created · ready for the gate",
    },
    createPassOpen: true,
    createPassPhase: "success",
    action: "reserve",
  },
  {
    id: "allocate-twin",
    beat: 4,
    label: "Parking Twin",
    narration: "Parking is automatically assigned by the allocation engine.",
    route: "/parking",
    durationMs: 5500,
    spotlight: "demo-twin-slot",
    toast: {
      title: "Parking Assigned",
      description: "Digital Twin updated in real time",
      tone: "info",
    },
    createPassOpen: false,
  },
  {
    id: "security-scan",
    beat: 5,
    label: "Security scan",
    narration: "Security verifies the visitor.",
    route: "/security",
    durationMs: 5000,
    spotlight: "demo-security-scan",
    toast: {
      title: "Visitor Verified",
      description: "QR scan successful",
    },
    securityPhase: "scanning",
  },
  {
    id: "vehicle-enter",
    beat: 6,
    label: "Vehicle enters",
    narration: "Vehicle enters the society — bay moves Available → Occupied.",
    route: "/parking",
    durationMs: 5500,
    spotlight: "demo-twin-slot",
    toast: {
      title: "Vehicle Entered",
      description: "Parking Occupied",
      tone: "info",
    },
    action: "allocate",
    securityPhase: "verified",
  },
  {
    id: "admin-metrics",
    beat: 7,
    label: "Admin Mission Control",
    narration: "Admin metrics refresh as occupancy and activity update live.",
    route: "/admin",
    durationMs: 5000,
    spotlight: "demo-admin-metrics",
    toast: {
      title: "Occupancy Updated",
      description: "Mission Control counters animated",
      tone: "info",
    },
  },
  {
    id: "visit-progress",
    beat: 8,
    label: "Visit in progress",
    narration: "Visitor spends time inside — the pass timer keeps running.",
    route: "/admin",
    durationMs: 4000,
    spotlight: "demo-admin-timeline",
  },
  {
    id: "visitor-exit",
    beat: 9,
    label: "Visitor exits",
    narration: "Security marks the exit at the gate.",
    route: "/security",
    durationMs: 4500,
    spotlight: "demo-security-exit",
    toast: {
      title: "Visitor Exited",
      description: "Exit recorded by security",
    },
    securityPhase: "exit",
  },
  {
    id: "parking-release",
    beat: 10,
    label: "Parking released",
    narration: "Vehicle exits and parking is released.",
    route: "/parking",
    durationMs: 4500,
    spotlight: "demo-twin-slot",
    toast: {
      title: "Parking Released",
      description: "Bay returned to Available",
    },
    action: "release",
  },
  {
    id: "complete",
    beat: 10,
    label: "Journey complete",
    narration: "Visitor Journey Completed Successfully.",
    route: "/parking",
    durationMs: 4000,
    spotlight: null,
    toast: {
      title: "Demo Complete",
      description: "Visitor Journey Completed Successfully",
    },
    action: "complete",
  },
];

export function getTimelineTotalMs(): number {
  return DEMO_TIMELINE.reduce((sum, step) => sum + step.durationMs, 0);
}
