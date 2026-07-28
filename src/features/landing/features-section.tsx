"use client";

import { motion } from "framer-motion";
import {
  Activity,
  LayoutDashboard,
  MapPinned,
  QrCode,
  Shield,
  Waypoints,
} from "lucide-react";
import { SectionHeading } from "@/features/landing/section-heading";
import { glass } from "@/lib/glass";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { LandingFeature } from "@/services/landing";

const icons = [
  QrCode,
  MapPinned,
  Activity,
  Waypoints,
  LayoutDashboard,
  Shield,
];

interface FeaturesSectionProps {
  features: LandingFeature[];
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section id="features" className="scroll-mt-28 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to run visitor parking."
          description="Purpose-built tools for residents, security, and admins—nothing extra, nothing missing."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = icons[index % icons.length];
            return (
              <motion.article
                key={feature.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: easeOut,
                }}
                whileHover={{ y: -2 }}
                className={cn("rounded-2xl p-6", glass.panel)}
              >
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
                  <Icon className="size-4.5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-medium tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
