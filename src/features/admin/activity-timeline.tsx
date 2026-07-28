"use client";

import { motion } from "framer-motion";
import { glass } from "@/lib/glass";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { AdminTimelineItem } from "@/types";

interface ActivityTimelineProps {
  timeline: AdminTimelineItem[];
}

export function ActivityTimeline({ timeline }: ActivityTimelineProps) {
  return (
    <motion.section
      data-demo-target="demo-admin-timeline"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn("rounded-2xl p-5 sm:p-6", glass.panel)}
    >
      <h2 className="text-lg font-semibold tracking-tight">
        Today&apos;s Visitor Activity
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Operational timeline across gates and visitor bays
      </p>

      <ul className="mt-5 space-y-4">
        {timeline.map((item, index) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.3 }}
            className="flex gap-3"
          >
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
          </motion.li>
        ))}
      </ul>
    </motion.section>
  );
}
