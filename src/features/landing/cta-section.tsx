"use client";

import { motion } from "framer-motion";
import { StartDemoButton } from "@/features/demo";
import { easeOut } from "@/lib/motion";
import type { LandingCta } from "@/services/landing";

interface CtaSectionProps {
  cta: LandingCta;
}

export function CtaSection({ cta }: CtaSectionProps) {
  return (
    <section className="relative scroll-mt-28 overflow-hidden py-20 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,oklch(0.55_0.16_255_/_0.22),transparent_70%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,oklch(0.42_0.16_255_/_0.35),transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: easeOut }}
          className="text-sm font-medium tracking-wide text-primary"
        >
          {cta.eyebrow}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.05, ease: easeOut }}
          className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
        >
          {cta.title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1, ease: easeOut }}
          className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {cta.description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.16, ease: easeOut }}
          className="mt-9 flex justify-center"
        >
          <StartDemoButton label={cta.cta} />
        </motion.div>
      </div>
    </section>
  );
}
