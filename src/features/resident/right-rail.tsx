"use client";

import { motion } from "framer-motion";
import { Lightbulb, MapPinned } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { glass } from "@/lib/glass";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type {
  ResidentUpcoming,
  ResidentZoneAvailability,
} from "@/services/resident";
import type { PassStatus, TimelineEvent } from "@/types";

interface RightRailProps {
  timeline: TimelineEvent[];
  upcoming: ResidentUpcoming;
  parkingAvailability: ResidentZoneAvailability[];
  tips: string[];
}

export function RightRail({
  timeline,
  upcoming,
  parkingAvailability,
  tips,
}: RightRailProps) {
  return (
    <aside className="hidden w-72 shrink-0 space-y-4 xl:block">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className={cn("rounded-2xl p-5", glass.panel)}
      >
        <h2 className="text-sm font-semibold tracking-tight">
          Today&apos;s Timeline
        </h2>
        <ul className="mt-4 space-y-4">
          {timeline.map((item, index) => (
            <li key={item.id} className="flex gap-3">
              <span className="relative mt-1.5 flex size-2 shrink-0">
                {index === 0 ? (
                  <>
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-40" />
                    <span className="relative size-2 rounded-full bg-primary" />
                  </>
                ) : (
                  <span className="size-2 rounded-full bg-primary/40" />
                )}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">{item.time}</p>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.05 }}
        className={cn("rounded-2xl p-5", glass.panel)}
      >
        <h2 className="text-sm font-semibold tracking-tight">
          Upcoming Visitor
        </h2>
        <div className="mt-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium tracking-tight">
                {upcoming.visitorName}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                {upcoming.vehiclePlate}
              </p>
            </div>
            <StatusBadge status={upcoming.status as PassStatus} />
          </div>
          <p className="text-sm text-muted-foreground">{upcoming.when}</p>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.08 }}
        className={cn("rounded-2xl p-5", glass.panel)}
      >
        <div className="flex items-center gap-2">
          <MapPinned className="size-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight">
            Parking Availability
          </h2>
        </div>
        <ul className="mt-4 space-y-3">
          {parkingAvailability.map((zone) => (
            <li key={zone.zone}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{zone.zone}</span>
                <span className="font-medium tabular-nums">
                  {zone.available}/{zone.total}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full bg-primary",
                    [
                      "w-0",
                      "w-[10%]",
                      "w-[20%]",
                      "w-[30%]",
                      "w-[40%]",
                      "w-[50%]",
                      "w-[60%]",
                      "w-[70%]",
                      "w-[80%]",
                      "w-[90%]",
                      "w-full",
                    ][
                      Math.min(
                        10,
                        Math.round((zone.available / zone.total) * 10)
                      )
                    ]
                  )}
                />
              </div>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className={cn("rounded-2xl p-5", glass.panel)}
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-warning" />
          <h2 className="text-sm font-semibold tracking-tight">Tips</h2>
        </div>
        <ul className="mt-4 space-y-3">
          {tips.map((tip) => (
            <li
              key={tip}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>
    </aside>
  );
}
