"use client";

import { motion } from "framer-motion";
import { CountUp } from "@/components/shared/count-up";
import { SectionHeading } from "@/features/landing/section-heading";
import { glass } from "@/lib/glass";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type {
  LandingLogo,
  LandingTestimonial,
  LandingTrustMetric,
} from "@/services/landing";

interface TestimonialsSectionProps {
  testimonials: LandingTestimonial[];
  logos: LandingLogo[];
  trustMetrics: LandingTrustMetric[];
}

export function TestimonialsSection({
  testimonials,
  logos,
  trustMetrics,
}: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="scroll-mt-28 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Social proof"
          title="Built for the people who live it daily."
          description="Mock pilot voices from Riverside Heights—residents, security, and admins aligned on one operating picture."
        />

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustMetrics.map((metric, index) => {
            const numeric = Number(metric.value);
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: easeOut }}
                className={cn("rounded-2xl px-4 py-5 text-center", glass.panel)}
              >
                <p className="text-3xl font-semibold tracking-tight">
                  {Number.isFinite(numeric) ? (
                    <>
                      <CountUp
                        value={numeric}
                        durationMs={900}
                        suffix={metric.suffix}
                      />
                    </>
                  ) : (
                    `${metric.value}${metric.suffix}`
                  )}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {metric.label}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {logos.map((logo, index) => (
            <motion.div
              key={logo.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 + index * 0.04, duration: 0.35 }}
              className="rounded-xl border border-border/50 bg-background/40 px-4 py-2.5 text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase"
            >
              {logo.name}
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
                ease: easeOut,
              }}
              className={cn("flex h-full flex-col rounded-2xl p-6", glass.panel)}
            >
              <p className="text-3xl leading-none text-primary/40" aria-hidden="true">
                “
              </p>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-foreground/90">
                {item.quote}
              </p>
              <footer className="mt-6 border-t border-border/50 pt-4">
                <p className="text-sm font-medium tracking-tight">{item.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {item.role} · {item.community}
                </p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
