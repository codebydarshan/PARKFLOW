"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { ActionFeedback } from "@/components/shared/action-feedback";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { StartDemoButton, useDemoOptional } from "@/features/demo";
import { CreatePassModal } from "@/features/resident/create-pass-modal";
import { OverviewCards } from "@/features/resident/overview-cards";
import { QuickActions } from "@/features/resident/quick-actions";
import { RecentVisitors } from "@/features/resident/recent-visitors";
import { ResidentShell } from "@/features/resident/resident-shell";
import { RightRail } from "@/features/resident/right-rail";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import { useDemoLoading } from "@/hooks/use-demo-loading";
import { getGreeting } from "@/lib/format";
import { fadeUp } from "@/lib/motion";
import { getResidentDashboard } from "@/services/resident";
import type { VisitorPass } from "@/types";

export function ResidentDashboard() {
  const loading = useDemoLoading(480);
  const data = useMemo(() => getResidentDashboard(), []);
  const [passes, setPasses] = useState<VisitorPass[]>(data.passes);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const { feedback, show, dismiss } = useActionFeedback();
  const demo = useDemoOptional();

  const stats = useMemo(() => {
    const activePasses = passes.filter(
      (pass) => pass.status === "active" || pass.status === "approved"
    ).length;
    const upcomingVisitors = passes.filter(
      (pass) => pass.status === "pending"
    ).length;

    return {
      ...data.stats,
      activePasses,
      upcomingVisitors,
      todayVisitors: Math.max(data.stats.todayVisitors, activePasses),
    };
  }, [data.stats, passes]);

  function handleCreated(pass: VisitorPass) {
    setPasses((current) => [pass, ...current]);
  }

  useEffect(() => {
    if (!demo) return;
    if (demo.createPassOpen) {
      setModalOpen(true);
    }
  }, [demo?.createPassOpen, demo]);

  useEffect(() => {
    if (!demo) return;
    return demo.registerBridge({
      onPassCreated: ({ passId, bayLabel, visitorName, vehiclePlate }) => {
        const now = new Date().toISOString();
        handleCreated({
          id: passId,
          visitorName,
          vehiclePlate,
          hostName: data.profile.name,
          hostUnit: data.profile.unit,
          slotId: `bay_${bayLabel.toLowerCase()}`,
          slotLabel: bayLabel,
          status: "approved",
          validFrom: now,
          validUntil: new Date(Date.now() + 3 * 3_600_000).toISOString(),
          qrCode: `PF-${passId.toUpperCase()}-${data.profile.unit}`,
          createdAt: now,
          vehicleType: "car",
          durationHours: 3,
        });
      },
    });
  }, [demo, data.profile]);

  if (loading) {
    return (
      <ResidentShell
        user={data.profile}
        search={search}
        onSearchChange={setSearch}
      >
        <PageSkeleton variant="dashboard" />
      </ResidentShell>
    );
  }

  return (
    <ResidentShell
      user={data.profile}
      search={search}
      onSearchChange={setSearch}
    >
      <div className="mx-auto flex max-w-7xl gap-6">
        <div className="min-w-0 flex-1 space-y-8">
          <motion.div
            data-demo-target="demo-resident-hero"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <PageHeader
              eyebrow={
                <p className="text-sm text-muted-foreground">
                  Unit {data.profile.unit}
                </p>
              }
              title={`${getGreeting()}, ${data.profile.name}`}
              description="Manage your visitor parking effortlessly."
              actions={
                <>
                  <StartDemoButton size="default" variant="outline" />
                  <Button
                    size="lg"
                    className="gap-1.5 shadow-[var(--shadow-glass)]"
                    data-demo-target="demo-create-pass"
                    onClick={() => setModalOpen(true)}
                  >
                    <Plus className="size-4" />
                    Create Visitor Pass
                  </Button>
                </>
              }
            />
          </motion.div>

          <OverviewCards stats={stats} />
          <QuickActions onCreatePass={() => setModalOpen(true)} />

          <section id="vehicles" className="sr-only" aria-hidden="true" />
          <section id="parking" className="sr-only" aria-hidden="true" />
          <section id="settings" className="sr-only" aria-hidden="true" />
          <section id="help" className="sr-only" aria-hidden="true" />

          <RecentVisitors
            passes={passes}
            search={search}
            onCreatePass={() => setModalOpen(true)}
          />
        </div>

        <RightRail
          timeline={data.timeline}
          upcoming={data.upcoming}
          parkingAvailability={data.parkingAvailability}
          tips={data.tips}
        />
      </div>

      <CreatePassModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        user={data.profile}
        onCreated={handleCreated}
        onFeedback={(title, description) =>
          show({ tone: "success", title, description })
        }
      />

      <ActionFeedback feedback={feedback} onDismiss={dismiss} />
    </ResidentShell>
  );
}
