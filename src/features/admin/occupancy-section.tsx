"use client";

import { motion } from "framer-motion";
import { CountUp } from "@/components/shared/count-up";
import type { AdminOccupancyBreakdown } from "@/services/admin";
import { glass } from "@/lib/glass";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface OccupancySectionProps {
  occupancy: AdminOccupancyBreakdown;
}

export function OccupancySection({ occupancy }: OccupancySectionProps) {
  const rate = Math.round((occupancy.occupied / occupancy.total) * 100);

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn("rounded-2xl p-5 sm:p-6", glass.panel)}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Parking Occupancy
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Live visitor bay utilization across {occupancy.total} slots
          </p>
        </div>
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          <CountUp value={rate} suffix="%" />
        </p>
      </div>

      <div className="mt-6 h-4 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${rate}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70"
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { label: "Occupied", value: occupancy.occupied, tone: "text-primary" },
          {
            label: "Reserved",
            value: occupancy.reserved,
            tone: "text-warning",
          },
          {
            label: "Available",
            value: occupancy.available,
            tone: "text-success",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border/50 bg-background/40 px-3 py-3"
          >
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className={cn("mt-1 text-xl font-semibold tabular-nums", item.tone)}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
