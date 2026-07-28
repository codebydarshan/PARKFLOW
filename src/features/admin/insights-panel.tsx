"use client";

import { motion } from "framer-motion";
import { Download, FileText, Scale, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { glass } from "@/lib/glass";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { AdminInsight, AdminReportCard } from "@/types";

interface InsightsPanelProps {
  insights: AdminInsight[];
  reports: AdminReportCard[];
  policies: string[];
  onExport: (reportTitle: string) => void;
  className?: string;
}

export function InsightsPanel({
  insights,
  reports,
  policies,
  onExport,
  className,
}: InsightsPanelProps) {
  return (
    <aside className={cn("w-full space-y-4 xl:w-72 xl:shrink-0", className)}>
      <motion.section
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className={cn("rounded-2xl p-5", glass.panel)}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="text-sm font-semibold tracking-tight">AI Insights</h2>
          </div>
          <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-primary uppercase">
            AI Preview
          </span>
        </div>
        <ul className="mt-4 space-y-3">
          {insights.map((insight) => (
            <li
              key={insight.id}
              className="rounded-xl border border-border/40 bg-background/35 px-3 py-2.5 text-sm leading-relaxed text-muted-foreground"
            >
              {insight.text}
            </li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        id="reports"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.05 }}
        className={cn("scroll-mt-24 rounded-2xl p-5", glass.panel)}
      >
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight">Reports</h2>
        </div>
        <div className="mt-4 space-y-3">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-xl border border-border/40 bg-background/35 p-3"
            >
              <p className="text-sm font-medium">{report.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {report.description}
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted-foreground">
                  {report.period}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5"
                  onClick={() => onExport(report.title)}
                >
                  <Download className="size-3.5" />
                  Export
                </Button>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        id="policies"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.08 }}
        className={cn("scroll-mt-24 rounded-2xl p-5", glass.panel)}
      >
        <div className="flex items-center gap-2">
          <Scale className="size-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight">Policies</h2>
        </div>
        <ul className="mt-4 space-y-2.5">
          {policies.map((policy) => (
            <li
              key={policy}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {policy}
            </li>
          ))}
        </ul>
      </motion.section>

      <div id="settings" className="sr-only" aria-hidden="true" />
    </aside>
  );
}
