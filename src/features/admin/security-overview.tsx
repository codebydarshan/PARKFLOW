"use client";

import { motion } from "framer-motion";
import { Clock3, Shield, ShieldX, UserCheck } from "lucide-react";
import { CountUp } from "@/components/shared/count-up";
import { glass } from "@/lib/glass";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { AdminSecurityOverview } from "@/types";

interface SecurityOverviewProps {
  overview: AdminSecurityOverview;
}

const cards = [
  {
    key: "guards",
    label: "Guards On Duty",
    icon: Shield,
    getValue: (o: AdminSecurityOverview) => o.guardsOnDuty,
  },
  {
    key: "verified",
    label: "Visitors Verified Today",
    icon: UserCheck,
    getValue: (o: AdminSecurityOverview) => o.verifiedToday,
  },
  {
    key: "avg",
    label: "Average Verification Time",
    icon: Clock3,
    display: (o: AdminSecurityOverview) => `${o.averageVerificationSeconds}s`,
  },
  {
    key: "rejected",
    label: "Rejected Entries",
    icon: ShieldX,
    getValue: (o: AdminSecurityOverview) => o.rejectedEntries,
  },
] as const;

export function SecurityOverview({ overview }: SecurityOverviewProps) {
  return (
    <motion.section
      id="security"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="scroll-mt-24 space-y-4"
    >
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Security Overview
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Gate performance across Riverside Heights
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={cn("rounded-2xl p-5", glass.panel)}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight">
                    {"display" in card ? (
                      card.display(overview)
                    ) : (
                      <CountUp value={card.getValue(overview)} />
                    )}
                  </p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  <Icon className="size-4.5" aria-hidden="true" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
