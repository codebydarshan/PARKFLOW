"use client";

import {
  CalendarClock,
  Car,
  ParkingSquare,
  QrCode,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import type { ResidentStats } from "@/types";

interface OverviewCardsProps {
  stats: ResidentStats;
}

export function OverviewCards({ stats }: OverviewCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard
        index={0}
        label="Today's Visitors"
        value={stats.todayVisitors}
        numericValue={stats.todayVisitors}
        icon={Users}
      />
      <StatCard
        index={1}
        label="Upcoming Visitors"
        value={stats.upcomingVisitors}
        numericValue={stats.upcomingVisitors}
        icon={CalendarClock}
      />
      <StatCard
        index={2}
        label="Available Parking"
        value={stats.availableParking}
        numericValue={stats.availableParking}
        icon={Car}
      />
      <StatCard
        index={3}
        label="Parking Occupancy"
        value={`${stats.occupancyRate}%`}
        numericValue={stats.occupancyRate}
        suffix="%"
        icon={ParkingSquare}
      />
      <StatCard
        index={4}
        label="Active Visitor Passes"
        value={stats.activePasses}
        numericValue={stats.activePasses}
        icon={QrCode}
      />
    </div>
  );
}
