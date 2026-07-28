"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StartDemoButton } from "@/features/demo";
import { HeroBackdrop } from "@/features/landing/hero-backdrop";
import { HeroVisual } from "@/features/landing/hero-visual";
import { easeOut, useMotionVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function HeroSection() {
  const motionSafe = useMotionVariants();

  return (
    <section className="relative overflow-hidden pt-10 sm:pt-14">
      <HeroBackdrop />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={motionSafe.reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOut }}
            className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
          >
            ParkFlow
          </motion.h1>

          <motion.p
            initial={motionSafe.reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.45, ease: easeOut }}
            className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
          >
            Visitor Parking.
            <br className="hidden sm:block" /> Finally Solved.
          </motion.p>

          <motion.p
            initial={motionSafe.reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.4, ease: easeOut }}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            QR passes, intelligent bay allocation, and live gate visibility—one
            calm operating system for residential visitor parking.
          </motion.p>

          <motion.div
            initial={motionSafe.reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.4, ease: easeOut }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <StartDemoButton />
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2"
              )}
            >
              View Dashboard
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 mt-14 sm:mt-16">
        <HeroVisual />
      </div>
    </section>
  );
}
