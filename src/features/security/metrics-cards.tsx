"use client";

import {
  AlertTriangle,
  Car,
  Clock3,
  ParkingSquare,
  UserCheck,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import type { SecurityStats } from "@/types";

interface MetricsCardsProps {
  stats: SecurityStats;
}

export function MetricsCards({ stats }: MetricsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      <StatCard
        index={0}
        label="Visitors Expected"
        value={stats.visitorsExpected}
        numericValue={stats.visitorsExpected}
        icon={Users}
      />
      <StatCard
        index={1}
        label="Visitors Inside"
        value={stats.visitorsInside}
        numericValue={stats.visitorsInside}
        icon={UserCheck}
      />
      <StatCard
        index={2}
        label="Visitor Parking Occupied"
        value={stats.parkingOccupied}
        numericValue={stats.parkingOccupied}
        icon={ParkingSquare}
      />
      <StatCard
        index={3}
        label="Available Visitor Parking"
        value={stats.parkingAvailable}
        numericValue={stats.parkingAvailable}
        icon={Car}
      />
      <StatCard
        index={4}
        label="Expired Passes"
        value={stats.expiredPasses}
        numericValue={stats.expiredPasses}
        icon={Clock3}
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
