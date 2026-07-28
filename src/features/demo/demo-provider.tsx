"use client";

import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { createDemoToast } from "@/features/demo/demo-events";
import {
  createDemoVisitorScript,
  runDemoEngineAction,
} from "@/features/demo/demo-controller";
import {
  DEMO_TOTAL_STEPS,
  type DemoBridge,
  type DemoRuntimeState,
  type DemoSpeed,
  type DemoStatus,
} from "@/features/demo/demo-state";
import {
  DEMO_TIMELINE,
  getTimelineTotalMs,
} from "@/features/demo/demo-timeline";
import { DemoOverlay } from "@/features/demo/demo-overlay";

interface DemoContextValue extends DemoRuntimeState {
  start: () => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  replay: () => void;
  skipStep: () => void;
  previousStep: () => void;
  setSpeed: (speed: DemoSpeed) => void;
  setNarrationVisible: (visible: boolean) => void;
  registerBridge: (bridge: DemoBridge) => () => void;
  totalSteps: number;
  remainingMs: number;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function initialState(): DemoRuntimeState {
  return {
    status: "idle",
    stepIndex: 0,
    stepId: null,
    speed: 1,
    elapsedMs: 0,
    totalDurationMs: getTimelineTotalMs(),
    narration: "",
    narrationVisible: true,
    spotlightTarget: null,
    toast: null,
    bayLabel: null,
    bayId: null,
    passId: null,
    visitorScript: createDemoVisitorScript(),
    createPassOpen: false,
    createPassPhase: "idle",
    securityPhase: "idle",
  };
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<DemoRuntimeState>(initialState);
  const stateRef = useRef(state);
  const bridgeRef = useRef<DemoBridge>({});
  const stepStartedAt = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTick = useRef(0);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const applyStep = useCallback(
    (index: number, script = stateRef.current.visitorScript) => {
      const step = DEMO_TIMELINE[index];
      if (!step) return;

      const engine = runDemoEngineAction(
        step.action,
        script,
        stateRef.current.bayId
      );

      if (step.route && step.route !== pathname) {
        router.push(step.route);
      }

      if (step.action === "reserve" && engine.bayLabel) {
        bridgeRef.current.onPassCreated?.({
          passId: script.passId,
          bayLabel: engine.bayLabel,
          visitorName: script.visitorName,
          vehiclePlate: script.vehicleNumber,
        });
      }

      if (step.action === "release") {
        bridgeRef.current.onExitMarked?.();
      }

      stepStartedAt.current = performance.now();
      lastTick.current = performance.now();

      setState((current) => ({
        ...current,
        status: "running",
        stepIndex: index,
        stepId: step.id,
        narration: step.narration,
        spotlightTarget: step.spotlight ?? null,
        createPassOpen: step.createPassOpen ?? false,
        createPassPhase: step.createPassPhase ?? "idle",
        securityPhase: step.securityPhase ?? "idle",
        bayId: engine.bayId ?? current.bayId,
        bayLabel: engine.bayLabel ?? current.bayLabel,
        passId: engine.passId ?? current.passId,
        toast: step.toast
          ? createDemoToast(
              step.toast.title,
              step.toast.description,
              step.toast.tone ?? "success"
            )
          : null,
      }));
    },
    [pathname, router]
  );

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const advance = useCallback(() => {
    const current = stateRef.current;
    const next = current.stepIndex + 1;
    if (next >= DEMO_TIMELINE.length) {
      stopLoop();
      setState((s) => ({
        ...s,
        status: "completed",
        narration: "Visitor Journey Completed Successfully.",
        spotlightTarget: null,
        createPassOpen: false,
      }));
      return;
    }
    applyStep(next);
  }, [applyStep, stopLoop]);

  const tick = useCallback(() => {
    const current = stateRef.current;
    if (current.status !== "running") return;

    const now = performance.now();
    const delta = now - lastTick.current;
    lastTick.current = now;
    const step = DEMO_TIMELINE[current.stepIndex];
    if (!step) return;

    const scaledDuration = step.durationMs / current.speed;
    const stepElapsed = now - stepStartedAt.current;

    setState((s) => ({
      ...s,
      elapsedMs: Math.min(
        s.totalDurationMs,
        s.elapsedMs + delta * s.speed
      ),
    }));

    if (stepElapsed >= scaledDuration) {
      advance();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [advance]);

  const startLoop = useCallback(() => {
    stopLoop();
    lastTick.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [stopLoop, tick]);

  const start = useCallback(() => {
    const script = createDemoVisitorScript();
    setState({
      ...initialState(),
      status: "running",
      visitorScript: script,
      passId: script.passId,
    });
    applyStep(0, script);
    startLoop();
  }, [applyStep, startLoop]);

  const pause = useCallback(() => {
    stopLoop();
    setState((s) =>
      s.status === "running" ? { ...s, status: "paused" } : s
    );
  }, [stopLoop]);

  const resume = useCallback(() => {
    setState((s) => {
      if (s.status !== "paused") return s;
      return { ...s, status: "running" };
    });
    stepStartedAt.current = performance.now();
    startLoop();
  }, [startLoop]);

  const stop = useCallback(() => {
    stopLoop();
    setState(initialState());
  }, [stopLoop]);

  const replay = useCallback(() => {
    stopLoop();
    start();
  }, [start, stopLoop]);

  const skipStep = useCallback(() => {
    if (stateRef.current.status === "idle") return;
    advance();
    if (stateRef.current.status === "paused") {
      // keep paused but on next step — applyStep sets running; re-pause
      pause();
    } else {
      startLoop();
    }
  }, [advance, pause, startLoop]);

  const previousStep = useCallback(() => {
    const current = stateRef.current;
    if (current.status === "idle") return;
    const prev = Math.max(0, current.stepIndex - 1);
    applyStep(prev);
    if (current.status === "paused") {
      pause();
    } else {
      startLoop();
    }
  }, [applyStep, pause, startLoop]);

  const setSpeed = useCallback((speed: DemoSpeed) => {
    setState((s) => ({ ...s, speed }));
    stepStartedAt.current = performance.now();
  }, []);

  const setNarrationVisible = useCallback((visible: boolean) => {
    setState((s) => ({ ...s, narrationVisible: visible }));
  }, []);

  const registerBridge = useCallback((bridge: DemoBridge) => {
    bridgeRef.current = { ...bridgeRef.current, ...bridge };
    return () => {
      bridgeRef.current = {};
    };
  }, []);

  useEffect(() => {
    if (state.status === "running" && rafRef.current == null) {
      startLoop();
    }
    return () => stopLoop();
  }, [state.status, startLoop, stopLoop]);

  // Clear toast after a beat
  useEffect(() => {
    if (!state.toast) return;
    const id = window.setTimeout(() => {
      setState((s) => ({ ...s, toast: null }));
    }, 2800 / state.speed);
    return () => window.clearTimeout(id);
  }, [state.toast, state.speed]);

  const remainingMs = Math.max(0, state.totalDurationMs - state.elapsedMs);

  const value = useMemo<DemoContextValue>(
    () => ({
      ...state,
      start,
      pause,
      resume,
      stop,
      replay,
      skipStep,
      previousStep,
      setSpeed,
      setNarrationVisible,
      registerBridge,
      totalSteps: DEMO_TOTAL_STEPS,
      remainingMs,
    }),
    [
      state,
      start,
      pause,
      resume,
      stop,
      replay,
      skipStep,
      previousStep,
      setSpeed,
      setNarrationVisible,
      registerBridge,
      remainingMs,
    ]
  );

  return createElement(
    DemoContext.Provider,
    { value },
    children,
    createElement(DemoOverlay)
  );
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) {
    throw new Error("useDemo must be used within DemoProvider");
  }
  return ctx;
}

export function useDemoOptional(): DemoContextValue | null {
  return useContext(DemoContext);
}

export function isDemoActive(status: DemoStatus): boolean {
  return status === "running" || status === "paused" || status === "completed";
}
