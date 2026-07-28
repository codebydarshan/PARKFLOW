"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LivePulse } from "@/components/shared/live-pulse";
import { StatusBadge } from "@/components/shared/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/features/landing/section-heading";
import { glass } from "@/lib/glass";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

const previewPasses = [
  {
    visitor: "Emily Brooks",
    plate: "TX-8PL21",
    slot: "A-03",
    status: "active" as const,
  },
  {
    visitor: "Noah Patel",
    plate: "TX-1VK03",
    slot: "B-06",
    status: "active" as const,
  },
  {
    visitor: "Liam Ortega",
    plate: "TX-6YD42",
    slot: "—",
    status: "pending" as const,
  },
];

const activity = [
  "Emily Brooks checked in · A-03",
  "Pass created for Liam Ortega",
  "Tower A at 72% occupancy",
];

export function PreviewSection() {
  return (
    <section
      id="preview"
      className="scroll-mt-28 border-y border-border/50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Live product preview"
            title="The dashboard investors remember."
            description="Premium surfaces, live occupancy, and gate-ready verification—presentation-ready from the first scroll."
          />
          <Link
            href="/dashboard"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "shrink-0 gap-2 self-start sm:self-auto"
            )}
          >
            Open full demo
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease: easeOut }}
            className={cn("rounded-2xl p-5 sm:p-6 lg:col-span-3", glass.panelStrong)}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Overview</p>
                <p className="text-sm font-medium tracking-tight">
                  Recent visitor passes
                </p>
              </div>
              <LivePulse />
            </div>

            <div className="surface-solid mt-5 overflow-x-auto rounded-xl ring-1 ring-border/50">
              <div className="min-w-[20rem]">
                <div className="grid grid-cols-[1.4fr_0.8fr_0.7fr] gap-2 border-b border-border/60 px-4 py-2.5 text-xs text-muted-foreground">
                  <span>Visitor</span>
                  <span>Slot</span>
                  <span>Status</span>
                </div>
                {previewPasses.map((pass) => (
                  <div
                    key={pass.visitor}
                    className="grid grid-cols-[1.4fr_0.8fr_0.7fr] items-center gap-2 border-b border-border/40 px-4 py-3 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {pass.visitor}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {pass.plate}
                      </p>
                    </div>
                    <p className="text-sm">{pass.slot}</p>
                    <StatusBadge status={pass.status} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.08, ease: easeOut }}
            className={cn("rounded-2xl p-5 sm:p-6 lg:col-span-2", glass.panel)}
          >
            <p className="text-xs text-muted-foreground">Security console</p>
            <p className="mt-0.5 text-sm font-medium tracking-tight">
              Gate verification
            </p>

            <div className="mt-5 rounded-xl border border-success/25 bg-success/10 p-4">
              <p className="text-sm font-medium text-success">Access granted</p>
              <p className="mt-1 text-xs text-success/80">
                Emily Brooks · TX-8PL21 · Slot A-03
              </p>
            </div>

            <ul className="mt-5 space-y-3">
              {activity.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
