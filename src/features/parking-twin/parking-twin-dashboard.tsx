"use client";

import { useEffect, useMemo, useState } from "react";
import { ActionFeedback } from "@/components/shared/action-feedback";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { isDemoActive, useDemoOptional } from "@/features/demo";
import { TwinActivityFeed } from "@/features/parking-twin/activity-feed";
import { ParkingCanvas } from "@/features/parking-twin/parking-canvas";
import { ParkingTwinHeader } from "@/features/parking-twin/parking-twin-header";
import { SlotDetailsDrawer } from "@/features/parking-twin/slot-details-drawer";
import { SlotDetailsPanel } from "@/features/parking-twin/slot-details-panel";
import {
  TwinFilters,
  type TwinFilter,
} from "@/features/parking-twin/twin-filters";
import { TwinMetricsBar } from "@/features/parking-twin/twin-metrics";
import { useTwinSimulation } from "@/features/parking-twin/use-twin-simulation";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import { useDemoLoading } from "@/hooks/use-demo-loading";
import {
  computeTwinMetrics,
  getParkingTwin,
} from "@/services/parking-twin";
import type { TwinParkingSlot } from "@/types";

export function ParkingTwinDashboard() {
  const loading = useDemoLoading(420);
  const seed = useMemo(() => getParkingTwin(), []);
  const {
    slots,
    activity,
    incoming,
    outgoing,
    refresh,
    markExit,
    reassignSlot,
    syncFromEngine,
    setPaused,
  } = useTwinSimulation(seed);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TwinFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { feedback, show, dismiss } = useActionFeedback(2400);
  const demo = useDemoOptional();

  useEffect(() => {
    setPaused(!!demo && isDemoActive(demo.status));
  }, [demo?.status, demo, setPaused]);

  useEffect(() => {
    if (!demo || !isDemoActive(demo.status)) return;
    syncFromEngine();
    if (demo.bayId) {
      setSelectedId(demo.bayId);
    }
  }, [demo?.stepId, demo?.bayLabel, demo?.status, demo, syncFromEngine]);

  const metrics = useMemo(
    () => computeTwinMetrics(slots, incoming, outgoing),
    [slots, incoming, outgoing]
  );

  const selected = useMemo(
    () => slots.find((slot) => slot.id === selectedId) ?? null,
    [slots, selectedId]
  );

  useEffect(() => {
    if (selectedId && !slots.some((slot) => slot.id === selectedId)) {
      setSelectedId(null);
      setDrawerOpen(false);
    }
  }, [slots, selectedId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return slots.filter((slot) => {
      const statusMatch = filter === "all" || slot.status === filter;
      if (!statusMatch) return false;
      if (!q) return true;
      return (
        slot.label.toLowerCase().includes(q) ||
        slot.visitorName?.toLowerCase().includes(q) ||
        slot.vehiclePlate?.toLowerCase().includes(q) ||
        slot.apartment?.toLowerCase().includes(q) ||
        slot.residentName?.toLowerCase().includes(q)
      );
    });
  }, [slots, filter, search]);

  const counts = useMemo(
    () => ({
      all: slots.length,
      available: metrics.available,
      reserved: metrics.reserved,
      occupied: metrics.occupied,
      overstay: metrics.overstays,
    }),
    [slots.length, metrics]
  );

  const allAvailable =
    metrics.available === slots.length &&
    filter === "all" &&
    !search.trim();

  function handleSelect(slot: TwinParkingSlot) {
    setSelectedId(slot.id);
    setDrawerOpen(true);
  }

  function handleRefresh() {
    setRefreshing(true);
    refresh();
    show({
      tone: "info",
      title: "Twin refreshed",
      description: "Simulated live parking event applied",
    });
    window.setTimeout(() => setRefreshing(false), 700);
  }

  function handleViewPass(slot: TwinParkingSlot) {
    show({
      tone: "success",
      title: "Visitor pass opened",
      description: `${slot.passId ?? slot.label} · mock preview`,
    });
  }

  function handleMarkExit(slot: TwinParkingSlot) {
    markExit(slot.id);
    show({
      tone: "success",
      title: "Exit marked",
      description: `${slot.label} released`,
    });
    setDrawerOpen(false);
  }

  function handleReassign(slot: TwinParkingSlot) {
    reassignSlot(slot.id);
    show({
      tone: "info",
      title: "Slot reassigned",
      description: `${slot.visitorName ?? "Visitor"} moved to an open bay`,
    });
  }

  if (loading) {
    return (
      <div className="surface-app min-h-screen">
        <ParkingTwinHeader
          communityName={seed.communityName}
          search={search}
          onSearchChange={setSearch}
          onRefresh={handleRefresh}
          refreshing={false}
          metrics={metrics}
        />
        <div className="mx-auto max-w-[90rem] px-4 py-6 sm:px-6">
          <PageSkeleton variant="split" />
        </div>
      </div>
    );
  }

  return (
    <div className="surface-app min-h-screen">
      <ParkingTwinHeader
        communityName={seed.communityName}
        search={search}
        onSearchChange={setSearch}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        metrics={metrics}
      />

      <main className="mx-auto max-w-[90rem] space-y-5 px-4 py-6 sm:px-6 lg:py-8">
        <TwinMetricsBar metrics={metrics} />
        <TwinFilters value={filter} onChange={setFilter} counts={counts} />

        <div className="flex gap-5">
          <div className="min-w-0 flex-1 space-y-5">
            <ParkingCanvas
              slots={filtered}
              selectedId={selectedId}
              onSelect={handleSelect}
              allAvailable={allAvailable}
              highlightLabel={demo?.bayLabel}
            />
            <TwinActivityFeed items={activity} />
          </div>

          <SlotDetailsPanel
            slot={selected}
            onViewPass={handleViewPass}
            onMarkExit={handleMarkExit}
            onReassign={handleReassign}
          />
        </div>
      </main>

      <SlotDetailsDrawer
        slot={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onViewPass={handleViewPass}
        onMarkExit={handleMarkExit}
        onReassign={handleReassign}
      />

      <ActionFeedback feedback={feedback} onDismiss={dismiss} />
    </div>
  );
}
