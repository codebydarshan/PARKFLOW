"use client";

import { motion } from "framer-motion";
import { glass } from "@/lib/glass";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { AdminFlatLeader } from "@/types";

interface FlatLeaderboardProps {
  flats: AdminFlatLeader[];
}

export function FlatLeaderboard({ flats }: FlatLeaderboardProps) {
  const max = Math.max(...flats.map((flat) => flat.visits), 1);

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn("rounded-2xl p-5 sm:p-6", glass.panel)}
    >
      <h2 className="text-lg font-semibold tracking-tight">
        Most Frequently Visited Flats
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Leaderboard by visitor volume this month
      </p>

      <ol className="mt-5 space-y-3">
        {flats.map((flat, index) => (
          <li key={flat.apartment} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{flat.apartment}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {flat.residentName}
                  </p>
                </div>
              </div>
              <span className="tabular-nums font-medium">{flat.visits}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.round((flat.visits / max) * 100)}%`,
                }}
                transition={{ delay: 0.08 * index, duration: 0.5 }}
                className="h-full rounded-full bg-primary/80"
              />
            </div>
          </li>
        ))}
      </ol>
    </motion.section>
  );
}
