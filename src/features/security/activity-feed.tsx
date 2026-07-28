"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  LogIn,
  LogOut,
  MapPinned,
  ShieldX,
  TimerOff,
} from "lucide-react";
import { formatDateTime, formatRelativeTime } from "@/lib/format";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";
import type { SecurityActivity } from "@/types";

interface ActivityFeedProps {
  activity: SecurityActivity[];
}

const icons = {
  entered: LogIn,
  verified: CheckCircle2,
  assigned: MapPinned,
  exited: LogOut,
  expired: TimerOff,
  rejected: ShieldX,
} as const;

export function ActivityFeed({ activity }: ActivityFeedProps) {
  const sorted = [...activity].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <section
      id="activity"
      className={cn("scroll-mt-24 rounded-2xl p-5", glass.panel)}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Live Activity Feed
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Newest events appear at the top
          </p>
        </div>
        <Activity className="size-4 text-primary" aria-hidden="true" />
      </div>

      <ul className="mt-5 space-y-3">
        <AnimatePresence initial={false}>
          {sorted.map((item, index) => {
            const Icon = icons[item.type];
            return (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
                className="flex gap-3 rounded-xl border border-border/40 bg-background/35 px-3 py-3"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-3.5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {formatRelativeTime(item.timestamp)} ·{" "}
                    {formatDateTime(item.timestamp)}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </section>
  );
}
