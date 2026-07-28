"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/features/landing/section-heading";
import { glass } from "@/lib/glass";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { LandingPricing } from "@/services/landing";

interface PricingSectionProps {
  pricing: LandingPricing;
}

export function PricingSection({ pricing }: PricingSectionProps) {
  return (
    <section id="pricing" className="scroll-mt-28 pb-20 sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, ease: easeOut }}
          className={cn(
            "relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-10 sm:py-16",
            glass.panelStrong
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_oklch(0.55_0.14_255_/_0.16),_transparent_55%)]"
            aria-hidden="true"
          />
          <div className="relative">
            <SectionHeading
              eyebrow={pricing.eyebrow}
              title={pricing.title}
              description={pricing.description}
              align="center"
              className="max-w-xl"
            />
            <div className="mt-8 flex justify-center">
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ size: "lg" }), "gap-2")}
              >
                {pricing.cta}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Pilot access · mock data · no backend required
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
