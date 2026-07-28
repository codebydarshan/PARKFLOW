"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  EyeOff,
  MessageSquareWarning,
  ParkingCircle,
  ShieldAlert,
} from "lucide-react";
import { SectionHeading } from "@/features/landing/section-heading";
import { glass } from "@/lib/glass";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { LandingBeforeAfter, LandingProblem } from "@/services/landing";

const icons = [ParkingCircle, ShieldAlert, MessageSquareWarning, EyeOff];

interface ProblemSectionProps {
  problems: LandingProblem[];
  beforeAfter: LandingBeforeAfter;
}

export function ProblemSection({ problems, beforeAfter }: ProblemSectionProps) {
  return (
    <section id="problem" className="scroll-mt-28 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="The problem"
          title="Visitor parking is broken."
          description="Residential communities still run guest parking on phone calls, screenshots, and hope. The result is confusion at every gate."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, ease: easeOut }}
            className={cn("rounded-2xl p-6 sm:p-7", glass.panel)}
          >
            <p className="text-xs font-medium tracking-wide text-destructive uppercase">
              Before ParkFlow
            </p>
            <ul className="mt-5 space-y-3">
              {beforeAfter.before.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 + index * 0.06, duration: 0.35 }}
                  className="flex items-start gap-3 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive/70" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: 0.08, ease: easeOut }}
            className={cn("rounded-2xl p-6 sm:p-7", glass.panelStrong)}
          >
            <p className="text-xs font-medium tracking-wide text-success uppercase">
              After ParkFlow
            </p>
            <ul className="mt-5 space-y-3">
              {beforeAfter.after.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.06, duration: 0.35 }}
                  className="flex items-start gap-3 text-sm text-foreground/90"
                >
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" />
                  {item}
                </motion.li>
              ))}
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary">
              One system. One source of truth.
              <ArrowRight className="size-4" aria-hidden="true" />
            </div>
          </motion.div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {problems.map((problem, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.article
                key={problem.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.06,
                  ease: easeOut,
                }}
                whileHover={{ y: -2 }}
                className={cn("rounded-2xl p-6", glass.panel)}
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive ring-1 ring-destructive/15">
                  <Icon className="size-4.5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-medium tracking-tight">
                  {problem.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {problem.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
