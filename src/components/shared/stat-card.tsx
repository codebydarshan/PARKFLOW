"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { CountUp } from "@/components/shared/count-up";
import { glass } from "@/lib/glass";
import { useMotionVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  numericValue?: number;
  suffix?: string;
  hint?: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
  index?: number;
  dense?: boolean;
}

export function StatCard({
  label,
  value,
  numericValue,
  suffix,
  hint,
  icon: Icon,
  trend,
  className,
  index = 0,
  dense = false,
}: StatCardProps) {
  const motionSafe = useMotionVariants();

  return (
    <motion.div
      variants={motionSafe.fadeUp}
      initial="hidden"
      animate="visible"
      transition={{ delay: motionSafe.reduced ? 0 : index * 0.05 }}
      whileHover={motionSafe.hoverLift}
      className={cn(
        "rounded-2xl transition-shadow duration-200 hover:shadow-[var(--shadow-glass-lg)]",
        dense ? "p-4" : "p-5",
        glass.panel,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={cn("text-muted-foreground", dense ? "text-xs" : "text-sm")}>
            {label}
          </p>
          <p
            className={cn(
              "mt-2 font-semibold tracking-tight",
              dense ? "text-2xl" : "text-3xl"
            )}
          >
            {typeof numericValue === "number" ? (
              <CountUp value={numericValue} suffix={suffix} />
            ) : (
              value
            )}
          </p>
        </div>
        <div
          className={cn(
            "flex items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15",
            dense ? "size-8" : "size-10"
          )}
        >
          <Icon className={dense ? "size-3.5" : "size-4.5"} aria-hidden="true" />
        </div>
      </div>
      {(hint || trend) && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          {trend ? (
            <span className="font-medium text-success">{trend}</span>
          ) : null}
          {hint ? <span>{hint}</span> : null}
        </div>
      )}
    </motion.div>
  );
}
