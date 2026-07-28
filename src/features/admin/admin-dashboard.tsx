"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ActionFeedback } from "@/components/shared/action-feedback";
import { LivePulse } from "@/components/shared/live-pulse";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { PageHeader } from "@/components/shared/page-header";
import {
  isDemoActive,
  StartDemoButton,
  useDemoOptional,
} from "@/features/demo";
import { ActivityTimeline } from "@/features/admin/activity-timeline";
import { AdminShell } from "@/features/admin/admin-shell";
import { ExecutiveMetrics } from "@/features/admin/executive-metrics";
import { FlatLeaderboard } from "@/features/admin/flat-leaderboard";
import { InsightsPanel } from "@/features/admin/insights-panel";
import { OccupancySection } from "@/features/admin/occupancy-section";
import { ParkingManagement } from "@/features/admin/parking-management";
import { PeakHoursChart } from "@/features/admin/peak-hours-chart";
import { RecentPassesTable } from "@/features/admin/recent-passes-table";
import { ResidentsTable } from "@/features/admin/residents-table";
import { SecurityOverview } from "@/features/admin/security-overview";
import { useActionFeedback } from "@/hooks/use-action-feedback";
import { useDemoLoading } from "@/hooks/use-demo-loading";
import { fadeUp } from "@/lib/motion";
import { getAdminDashboard } from "@/services/admin";

export function AdminDashboard() {
  const loading = useDemoLoading(500);
  const demo = useDemoOptional();
  const [tick, setTick] = useState(0);
  const data = useMemo(() => getAdminDashboard(), [tick]);
  const [search, setSearch] = useState("");
  const { feedback, show, dismiss } = useActionFeedback(2600);

  useEffect(() => {
    if (!demo || !isDemoActive(demo.status)) return;
    setTick((value) => value + 1);
  }, [demo?.stepId, demo?.status, demo]);

  function handleExport(reportTitle: string) {
    show({
      tone: "success",
      title: `${reportTitle} exported`,
      description: "Mock download — no file was generated",
    });
  }

  if (loading) {
    return (
      <AdminShell
        user={data.profile}
        communityName={data.communityName}
        search={search}
        onSearchChange={setSearch}
      >
        <PageSkeleton variant="dashboard" />
      </AdminShell>
    );
  }

  return (
    <AdminShell
      user={data.profile}
      communityName={data.communityName}
      search={search}
      onSearchChange={setSearch}
    >
      <div className="mx-auto flex max-w-[90rem] flex-col gap-6 xl:flex-row">
        <div className="min-w-0 flex-1 space-y-8">
          <motion.div
            id="overview"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="scroll-mt-24"
          >
            <PageHeader
              eyebrow={<LivePulse label="Live ops" />}
              title="Mission Control"
              description={`Executive overview of visitor parking across ${data.communityName}.`}
              actions={<StartDemoButton size="default" variant="outline" />}
            />
          </motion.div>

          <ExecutiveMetrics stats={data.stats} />
          <OccupancySection occupancy={data.occupancy} />

          <div className="grid gap-6 lg:grid-cols-2">
            <ActivityTimeline timeline={data.timeline} />
            <PeakHoursChart data={data.hourlyVisits} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <FlatLeaderboard flats={data.topFlats} />
            <RecentPassesTable
              passes={data.recentPasses}
              search={search}
            />
          </div>

          <ParkingManagement slots={data.slots} />
          <ResidentsTable residents={data.residents} search={search} />
          <SecurityOverview overview={data.securityOverview} />
        </div>

        <div className="xl:sticky xl:top-20 xl:self-start">
          <InsightsPanel
            insights={data.insights}
            reports={data.reports}
            policies={data.policies}
            onExport={handleExport}
          />
        </div>
      </div>

      <ActionFeedback feedback={feedback} onDismiss={dismiss} />
    </AdminShell>
  );
}
