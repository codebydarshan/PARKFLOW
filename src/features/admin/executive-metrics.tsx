"use client";

import {
  AlertTriangle,
  Clock3,
  ParkingSquare,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import type { AdminStats } from "@/types";

interface ExecutiveMetricsProps {
  stats: AdminStats;
}

export function ExecutiveMetrics({ stats }: ExecutiveMetricsProps) {
  return (
    <div
      data-demo-target="demo-admin-metrics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6"
    >
      <StatCard
        index={0}
        label="Today's Visitors"
        value={stats.todayVisitors}
        numericValue={stats.todayVisitors}
        icon={Users}
      />
      <StatCard
        index={1}
        label="Visitors Currently Inside"
        value={stats.visitorsInside}
        numericValue={stats.visitorsInside}
        icon={UserCheck}
      />
      <StatCard
        index={2}
        label="Visitor Parking Occupancy"
        value={`${stats.occupancyRate}%`}
        numericValue={stats.occupancyRate}
        suffix="%"
        icon={ParkingSquare}
      />
      <StatCard
        index={3}
        label="Average Visit Duration"
        value={`${stats.averageVisitHours.toFixed(1)}h`}
        icon={Clock3}
      />
      <StatCard
        index={4}
        label="Peak Occupancy"
        value={`${stats.peakOccupancy}%`}
        numericValue={stats.peakOccupancy}
        suffix="%"
        icon={TrendingUp}
      />
      <StatCard
        index={5}
        label="Overstays"
        value={stats.overstays}
        numericValue={stats.overstays}
        icon={AlertTriangle}
      />
    </div>
  );
}
