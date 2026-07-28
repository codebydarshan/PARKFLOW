"use client";

import { motion } from "framer-motion";
import { glass } from "@/lib/glass";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { AdminHourlyPoint } from "@/types";

interface PeakHoursChartProps {
  data: AdminHourlyPoint[];
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  const max = Math.max(...data.map((point) => point.visitors), 1);

  return (
    <motion.section
      id="analytics"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn("scroll-mt-24 rounded-2xl p-5 sm:p-6", glass.panel)}
    >
      <h2 className="text-lg font-semibold tracking-tight">Peak Visit Hours</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Visitor volume by hour — demo chart
      </p>

      <div className="mt-6 flex h-48 items-end gap-2 sm:gap-2.5">
        {data.map((point, index) => {
          const height = Math.max(8, Math.round((point.visitors / max) * 100));
          return (
            <div
              key={point.hour}
              className="flex min-w-0 flex-1 flex-col items-center gap-2"
            >
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  delay: 0.05 * index,
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex w-full origin-bottom justify-center"
                style={{ height: `${height}%` }}
              >
                <div
                  className={cn(
                    "w-full max-w-8 rounded-t-md bg-primary/80",
                    point.visitors === max && "bg-primary"
                  )}
                  title={`${point.visitors} visitors`}
                />
              </motion.div>
              <span className="text-[10px] text-muted-foreground sm:text-xs">
                {point.hour}
              </span>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
