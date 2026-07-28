"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Car,
  LogOut,
  QrCode,
  Shield,
  UserRound,
} from "lucide-react";
import { SectionHeading } from "@/features/landing/section-heading";
import { glass } from "@/lib/glass";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { LandingWorkflowStep } from "@/services/landing";

const stepIcons = [UserRound, QrCode, Shield, Car, LogOut];

interface SolutionSectionProps {
  steps: LandingWorkflowStep[];
}

export function SolutionSection({ steps }: SolutionSectionProps) {
  const reduced = useReducedMotion();

  return (
    <section
      id="solution"
      className="scroll-mt-28 border-y border-border/50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="One clear workflow. Zero parking confusion."
          description="ParkFlow turns visitor parking into a guided loop—from resident invite to bay release—so every guest knows exactly where to go."
        />

        <div className="mt-14 hidden items-center justify-between gap-2 lg:flex" aria-hidden="true">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center text-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-primary/12 text-primary ring-1 ring-primary/20">
                  {(() => {
                    const Icon = stepIcons[index] ?? Car;
                    return <Icon className="size-4.5" />;
                  })()}
                </span>
                <p className="mt-3 text-sm font-medium tracking-tight">
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 ? (
                <motion.div
                  className="mx-3 h-px flex-1 origin-left bg-gradient-to-r from-primary/50 to-primary/10"
                  initial={reduced ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: 0.15 + index * 0.12 }}
                />
              ) : null}
            </div>
          ))}
        </div>

        <ol className="mt-10 space-y-4 lg:mt-12">
          {steps.map((step, index) => {
            const Icon = stepIcons[index] ?? Car;
            return (
              <motion.li
                key={step.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px", amount: 0.4 }}
                transition={{ duration: 0.45, ease: easeOut }}
                className={cn(
                  "relative overflow-hidden rounded-2xl px-5 py-5 sm:px-6 sm:py-6",
                  glass.panel
                )}
              >
                <motion.div
                  className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-primary"
                  initial={reduced ? false : { scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  style={{ transformOrigin: "top" }}
                />
                <div className="flex items-start gap-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/20">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        Step {index + 1}
                      </span>
                      <h3 className="text-lg font-medium tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
