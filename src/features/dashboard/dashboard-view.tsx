"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Car,
  ParkingSquare,
  QrCode,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { LivePulse } from "@/components/shared/live-pulse";
import { PageHeader } from "@/components/shared/page-header";
import { PageSkeleton } from "@/components/shared/page-skeleton";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemoLoading } from "@/hooks/use-demo-loading";
import { formatDateTime, formatRelativeTime } from "@/lib/format";
import { fadeUp, staggerChildren } from "@/lib/motion";
import { mockApi } from "@/services/mock-api";

export function DashboardView() {
  const loading = useDemoLoading(520);
  const stats = mockApi.getStats();
  const passes = mockApi.getPasses().slice(0, 5);
  const activity = mockApi.getActivity().slice(0, 6);
  const community = mockApi.getCommunity();

  if (loading) {
    return (
      <AppShell role="admin" title="Overview">
        <PageSkeleton variant="dashboard" />
      </AppShell>
    );
  }

  return (
    <AppShell role="admin" title="Overview">
      <motion.div
        className="mx-auto max-w-6xl space-y-10"
        variants={staggerChildren(0.06)}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={fadeUp}>
          <PageHeader
            title="Parking overview"
            description={`${community.name} · real-time visitor parking at a glance.`}
            actions={<LivePulse label="Live occupancy" />}
          />
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            index={0}
            label="Occupancy"
            value={`${stats.occupancyRate}%`}
            numericValue={stats.occupancyRate}
            suffix="%"
            hint={`${stats.occupiedSlots} of ${stats.totalSlots} slots`}
            icon={ParkingSquare}
            trend="+4% vs yesterday"
          />
          <StatCard
            index={1}
            label="Available slots"
            value={stats.availableSlots}
            numericValue={stats.availableSlots}
            hint="Ready for allocation"
            icon={Car}
          />
          <StatCard
            index={2}
            label="Active passes"
            value={stats.activePasses}
            numericValue={stats.activePasses}
            hint="Currently valid"
            icon={QrCode}
          />
          <StatCard
            index={3}
            label="Visitors today"
            value={stats.todayVisitors}
            numericValue={stats.todayVisitors}
            hint="Checked in or expected"
            icon={Users}
          />
        </div>

        <div className="grid gap-5 lg:grid-cols-5">
          <motion.div variants={fadeUp} className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base tracking-tight">
                  Recent passes
                </CardTitle>
                <CardDescription>
                  Latest visitor credentials across the community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="surface-solid overflow-hidden rounded-xl ring-1 ring-border/50">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Visitor</TableHead>
                        <TableHead className="hidden sm:table-cell">
                          Host
                        </TableHead>
                        <TableHead>Slot</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {passes.map((pass) => (
                        <TableRow
                          key={pass.id}
                          className="transition-colors hover:bg-muted/40"
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{pass.visitorName}</p>
                              <p className="text-xs text-muted-foreground">
                                {pass.vehiclePlate}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {pass.hostName}
                            <span className="text-muted-foreground">
                              {" "}
                              · {pass.hostUnit}
                            </span>
                          </TableCell>
                          <TableCell>{pass.slotLabel ?? "—"}</TableCell>
                          <TableCell>
                            <StatusBadge status={pass.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base tracking-tight">
                      Activity
                    </CardTitle>
                    <CardDescription>Live community feed</CardDescription>
                  </div>
                  <LivePulse />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {activity.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.07, duration: 0.3 }}
                    className="flex gap-3"
                  >
                    <span className="relative mt-1.5 flex size-2 shrink-0">
                      {index === 0 ? (
                        <>
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-40" />
                          <span className="relative size-2 rounded-full bg-primary" />
                        </>
                      ) : (
                        <span className="size-2 rounded-full bg-primary/50" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {item.description}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {formatRelativeTime(item.timestamp)} ·{" "}
                        {formatDateTime(item.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
                <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <Activity className="size-3.5" aria-hidden="true" />
                  Stream updating for demo
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AppShell>
  );
}
