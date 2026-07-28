"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  runTwinSimulationTick,
  twinMarkExit,
  twinReassign,
} from "@/services/parking-twin";
import { listTwinSlots } from "@/services/parking-engine";
import type { TwinActivityItem, TwinParkingSlot } from "@/types";

export function useTwinSimulation(initial: {
  slots: TwinParkingSlot[];
  activity: TwinActivityItem[];
  incomingVisitors: number;
  outgoingVisitors: number;
}) {
  const [slots, setSlots] = useState(initial.slots);
  const [activity, setActivity] = useState(initial.activity);
  const [incoming, setIncoming] = useState(initial.incomingVisitors);
  const [outgoing, setOutgoing] = useState(initial.outgoingVisitors);
  const [tick, setTick] = useState(0);
  const paused = useRef(false);

  const applyEngineTick = useCallback(() => {
    const result = runTwinSimulationTick();
    setSlots(result.slots);
    if (result.activityItem) {
      const item = result.activityItem;
      setActivity((current) => [item, ...current].slice(0, 40));
      if (item.type === "occupied" || item.type === "entered") {
        setIncoming((value) => Math.max(0, value));
      }
      if (item.type === "exited" || item.type === "released") {
        setOutgoing((value) => value + 1);
      }
    }
    setTick((value) => value + 1);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!paused.current) applyEngineTick();
    }, 3800);
    return () => window.clearInterval(id);
  }, [applyEngineTick]);

  const refresh = useCallback(() => {
    applyEngineTick();
  }, [applyEngineTick]);

  const markExit = useCallback((slotId: string) => {
    setSlots(twinMarkExit(slotId));
    const item: TwinActivityItem = {
      id: `exit_${Date.now()}`,
      type: "exited",
      title: "Visitor exited.",
      description: "Marked exit via allocation engine",
      timestamp: new Date().toISOString(),
    };
    setActivity((current) => [item, ...current].slice(0, 40));
    setOutgoing((value) => value + 1);
  }, []);

  const reassignSlot = useCallback((slotId: string) => {
    setSlots(twinReassign(slotId));
    const item: TwinActivityItem = {
      id: `re_${Date.now()}`,
      type: "occupied",
      title: "Bay reassigned.",
      description: "Visitor moved by allocation engine",
      timestamp: new Date().toISOString(),
    };
    setActivity((current) => [item, ...current].slice(0, 40));
  }, []);

  const syncFromEngine = useCallback(() => {
    setSlots(listTwinSlots());
  }, []);

  const setPaused = useCallback((value: boolean) => {
    paused.current = value;
  }, []);

  return {
    slots,
    activity,
    incoming,
    outgoing,
    tick,
    refresh,
    markExit,
    reassignSlot,
    syncFromEngine,
    setPaused,
  };
}
