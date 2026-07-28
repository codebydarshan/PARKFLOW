"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ActionFeedback } from "@/components/shared/action-feedback";
import { LivePulse } from "@/components/shared/live-pulse";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { ActivityFeed } from "@/features/security/activity-feed";
import { MetricsCards } from "@/features/security/metrics-cards";
import {
  PrimaryActions,
  type SecurityPrimaryAction,
} from "@/features/security/primary-actions";
import {
  QrScanner,
  type ScanOutcome,
} from "@/features/security/qr-scanner";
import { SecurityRightRail } from "@/features/security/security-right-rail";
import { SecurityShell } from "@/features/security/security-shell";
import {
  VerificationPanel,
  type VerificationPhase,
} from "@/features/security/verification-panel";
import { VisitorsInsideTable } from "@/features/security/visitors-inside-table";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import { useDemoLoading } from "@/hooks/use-demo-loading";
import { fadeUp } from "@/lib/motion";
import {
  mapVehicleTypeToCategory,
  mapVehicleTypeToSize,
  resolveEntryAllocation,
  parkingEngine,
} from "@/services/parking-engine";
import { getSecurityDashboard } from "@/services/security";
import type { SecurityActivity, SecurityVisitor } from "@/types";

export function SecurityDashboard() {
  const loading = useDemoLoading(460);
  const data = useMemo(() => getSecurityDashboard(), []);
  const [search, setSearch] = useState("");
  const [visitors, setVisitors] = useState<SecurityVisitor[]>(data.visitors);
  const [activity, setActivity] = useState<SecurityActivity[]>(data.activity);
  const [primaryAction, setPrimaryAction] =
    useState<SecurityPrimaryAction>("scan");
  const [selected, setSelected] = useState<SecurityVisitor | null>(null);
  const [scanOutcome, setScanOutcome] = useState<ScanOutcome>("idle");
  const [phase, setPhase] = useState<VerificationPhase>("idle");
  const { feedback, show, dismiss } = useActionFeedback(2600);

  const stats = useMemo(() => {
    const visitorsInside = visitors.filter(
      (v) => v.status === "inside" || v.status === "overstay"
    ).length;
    const visitorsExpected = visitors.filter(
      (v) => v.status === "expected"
    ).length;
    const expiredPasses = visitors.filter((v) => v.status === "expired").length;
    const overstays = visitors.filter((v) => v.status === "overstay").length;

    return {
      ...data.stats,
      visitorsInside,
      visitorsExpected,
      expiredPasses,
      overstays,
    };
  }, [data.stats, visitors]);

  function pushActivity(
    partial: Omit<SecurityActivity, "id" | "timestamp"> & { id?: string }
  ) {
    const next: SecurityActivity = {
      id: partial.id ?? `act_${Date.now()}`,
      type: partial.type,
      title: partial.title,
      description: partial.description,
      timestamp: new Date().toISOString(),
    };
    setActivity((current) => [next, ...current]);
  }

  function handlePrimaryAction(action: SecurityPrimaryAction) {
    setPrimaryAction(action);
    if (action === "scan" || action === "manual") {
      document.getElementById("scanner")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    if (action === "exit") {
      document.getElementById("inside")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      show({
        tone: "info",
        title: "Visitor Exit mode",
        description: "Use Mark Exit on any guest currently inside",
      });
    }
    if (action === "emergency") {
      show({
        tone: "warning",
        title: "Emergency protocol armed",
        description: "Demo override — supervisor notified (mock)",
      });
    }
  }

  function handleSimulateScan(visitorId: string) {
    setScanOutcome("scanning");
    setPhase("idle");

    window.setTimeout(() => {
      const match = visitors.find(
        (visitor) =>
          visitor.visitorId.toLowerCase() === visitorId.toLowerCase() ||
          visitor.qrCode.toLowerCase() === visitorId.toLowerCase()
      );

      if (
        !match ||
        match.status === "invalid" ||
        match.status === "expired" ||
        match.status === "exited"
      ) {
        setSelected(match ?? null);
        setScanOutcome("invalid");
        setPhase("idle");
        pushActivity({
          type: "rejected",
          title: "QR verification failed",
          description: match
            ? `${match.visitorName} · ${match.status} credential`
            : `Unknown ID · ${visitorId}`,
        });
        show({
          tone: "danger",
          title: "Invalid Pass",
          description: "Do not open the gate",
        });
        return;
      }

      setSelected(match);
      setScanOutcome("valid");
      setPhase("ready");
      pushActivity({
        type: "verified",
        title: "QR verified",
        description: `${match.visitorName} ready for entry`,
      });
      show({
        tone: "success",
        title: "Visitor Verified",
        description: `${match.visitorName} · ${match.vehiclePlate}`,
      });
    }, 700);
  }

  function handleApprove() {
    if (!selected) return;
    setPhase("approving");

    window.setTimeout(() => {
      const now = new Date().toISOString();
      const outcome = resolveEntryAllocation({
        visitorId: selected.visitorId,
        visitorName: selected.visitorName,
        visitorCategory: mapVehicleTypeToCategory(selected.vehicleType),
        vehiclePlate: selected.vehiclePlate,
        vehicleSize: mapVehicleTypeToSize(selected.vehicleType),
        residentName: selected.residentName,
        apartment: selected.apartment,
        passId: selected.id,
        expectedArrival: now,
        expectedExit: selected.expiryTime,
      });

      if (!outcome.ok) {
        setPhase("idle");
        show({
          tone: "warning",
          title: "Allocation failed",
          description: outcome.message,
        });
        return;
      }

      const slot = outcome.bay.label;

      setVisitors((current) =>
        current.map((visitor) =>
          visitor.id === selected.id
            ? {
                ...visitor,
                status: "inside",
                parkingSlot: slot,
                entryTime: now,
                expectedExit: visitor.expiryTime,
              }
            : visitor
        )
      );

      const updated = {
        ...selected,
        status: "inside" as const,
        parkingSlot: slot,
        entryTime: now,
        expectedExit: selected.expiryTime,
      };
      setSelected(updated);
      setPhase("success");

      pushActivity({
        type: "entered",
        title: "Visitor entered",
        description: `${updated.visitorName} · slot ${slot}`,
      });
      pushActivity({
        type: "assigned",
        title: "Parking assigned",
        description: `${slot} allocated by parking engine`,
      });

      show({
        tone: "success",
        title: "Entry Recorded",
        description: `Parking Assigned · Timer Started · ${slot}`,
      });
    }, 650);
  }

  function handleReject() {
    if (!selected) return;
    setPhase("rejected");
    setVisitors((current) =>
      current.map((visitor) =>
        visitor.id === selected.id
          ? { ...visitor, status: "invalid" }
          : visitor
      )
    );
    setSelected({ ...selected, status: "invalid" });
    pushActivity({
      type: "rejected",
      title: "Entry rejected",
      description: `${selected.visitorName} denied at Gate A`,
    });
    show({
      tone: "danger",
      title: "Entry Denied",
      description: `${selected.visitorName} · ask guest to contact host`,
    });
  }

  function handleMarkExit(id: string) {
    const target = visitors.find((visitor) => visitor.id === id);
    if (!target) return;

    if (target.parkingSlot) {
      parkingEngine.release(target.parkingSlot);
    }

    setVisitors((current) =>
      current.map((visitor) =>
        visitor.id === id ? { ...visitor, status: "exited" } : visitor
      )
    );
    pushActivity({
      type: "exited",
      title: "Visitor exited",
      description: `${target.visitorName} · slot ${target.parkingSlot ?? "released"}`,
    });
    if (selected?.id === id) {
      setSelected({ ...target, status: "exited" });
      setPhase("idle");
    }
    show({
      tone: "success",
      title: "Exit recorded",
      description: `${target.visitorName} · parking released`,
    });
  }

  function handleViewDetails(visitor: SecurityVisitor) {
    setSelected(visitor);
    setPhase(
      visitor.status === "inside" || visitor.status === "expected"
        ? "ready"
        : "idle"
    );
    setScanOutcome(
      visitor.status === "invalid" || visitor.status === "expired"
        ? "invalid"
        : visitor.status === "expected" || visitor.status === "inside"
          ? "valid"
          : "idle"
    );
    document.getElementById("verification")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  if (loading) {
    return (
      <SecurityShell
        user={data.profile}
        search={search}
        onSearchChange={setSearch}
      >
        <PageSkeleton variant="split" />
      </SecurityShell>
    );
  }

  return (
    <SecurityShell
      user={data.profile}
      search={search}
      onSearchChange={setSearch}
    >
      <div className="mx-auto flex max-w-7xl gap-6">
        <div className="min-w-0 flex-1 space-y-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-[2rem]">
                Gate verification
              </h1>
              <p className="mt-2 max-w-xl text-[15px] text-muted-foreground">
                Verify visitors in under 5 seconds — scan, confirm, approve.
              </p>
            </div>
            <LivePulse label={`${data.profile.unit} live`} />
          </motion.div>

          <MetricsCards stats={stats} />
          <PrimaryActions
            active={primaryAction}
            onAction={handlePrimaryAction}
          />

          <div className="grid gap-5 xl:grid-cols-2">
            <QrScanner
              mockOptions={data.mockQrOptions}
              outcome={scanOutcome}
              onSimulateScan={handleSimulateScan}
            />
            <div id="verification" className="scroll-mt-24">
              <VerificationPanel
                visitor={selected}
                phase={phase}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </div>
          </div>

          <VisitorsInsideTable
            visitors={visitors}
            search={search}
            onMarkExit={handleMarkExit}
            onViewDetails={handleViewDetails}
          />

          <div className="xl:hidden">
            <ActivityFeed activity={activity} />
          </div>
        </div>

        <div className="hidden w-72 shrink-0 space-y-4 xl:block">
          <ActivityFeed activity={activity} />
          <SecurityRightRail
            parkingSummary={data.parkingSummary}
            upcomingArrivals={data.upcomingArrivals}
            tips={data.tips}
            emergencyContacts={data.emergencyContacts}
          />
        </div>
      </div>

      <ActionFeedback feedback={feedback} onDismiss={dismiss} />
    </SecurityShell>
  );
}
