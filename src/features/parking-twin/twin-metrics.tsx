"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  CarFront,
  CircleDot,
  Clock3,
  ParkingSquare,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import type { TwinMetrics } from "@/types";

interface TwinMetricsProps {
  metrics: TwinMetrics;
}

export function TwinMetricsBar({ metrics }: TwinMetricsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        dense
        index={0}
        label="Available"
        value={metrics.available}
        numericValue={metrics.available}
        icon={ParkingSquare}
      />
      <StatCard
        dense
        index={1}
        label="Reserved"
        value={metrics.reserved}
        numericValue={metrics.reserved}
        icon={Clock3}
      />
      <StatCard
        dense
        index={2}
        label="Occupied"
        value={metrics.occupied}
        numericValue={metrics.occupied}
        icon={CarFront}
      />
      <StatCard
        dense
        index={3}
        label="Overstays"
        value={metrics.overstays}
        numericValue={metrics.overstays}
        icon={CircleDot}
      />
      <StatCard
        dense
        index={4}
        label="Incoming Visitors"
        value={metrics.incoming}
        numericValue={metrics.incoming}
        icon={ArrowDownRight}
      />
      <StatCard
        dense
        index={5}
        label="Outgoing Visitors"
        value={metrics.outgoing}
        numericValue={metrics.outgoing}
        icon={ArrowUpRight}
      />
    </div>
  );
}
