"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const floatSlots = [
  { label: "P01", x: "8%", y: "18%", delay: 0 },
  { label: "P07", x: "78%", y: "22%", delay: 0.4 },
  { label: "P14", x: "14%", y: "68%", delay: 0.8 },
  { label: "P22", x: "84%", y: "62%", delay: 1.2 },
];

/** Ambient hero atmosphere — grid, soft light, floating bay signals, QR pulse, link lines. */
export function HeroBackdrop() {
  const reduced = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,oklch(0.55_0.14_255_/_0.22),transparent_60%)] dark:bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,oklch(0.45_0.14_255_/_0.32),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_90%_30%,oklch(0.6_0.08_200_/_0.08),transparent_50%)]" />

      <div
        className={cn(
          "absolute inset-0 opacity-[0.045] dark:opacity-[0.07]",
          !reduced && "animate-[grid-drift_28s_linear_infinite]"
        )}
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklch, var(--foreground) 40%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 40%, transparent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 1200 700"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.path
          d="M180 160 C320 180, 420 240, 560 280 S820 320, 980 250"
          stroke="color-mix(in oklch, var(--primary) 45%, transparent)"
          strokeWidth="1.2"
          strokeDasharray="6 10"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.7 }}
          transition={{ duration: 2.4, ease: "easeOut" }}
        />
        <motion.path
          d="M220 520 C380 460, 520 440, 680 470 S920 540, 1040 480"
          stroke="color-mix(in oklch, var(--primary) 35%, transparent)"
          strokeWidth="1.2"
          strokeDasharray="5 12"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: 2.8, delay: 0.3, ease: "easeOut" }}
        />
        <motion.circle
          cx="560"
          cy="280"
          r="3"
          fill="var(--primary)"
          animate={
            reduced
              ? undefined
              : { opacity: [0.3, 1, 0.3], scale: [1, 1.4, 1] }
          }
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="680"
          cy="470"
          r="3"
          fill="var(--primary)"
          animate={
            reduced
              ? undefined
              : { opacity: [0.25, 0.9, 0.25], scale: [1, 1.35, 1] }
          }
          transition={{
            duration: 3,
            delay: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>

      {floatSlots.map((slot) => (
        <motion.div
          key={slot.label}
          className="absolute hidden rounded-lg border border-primary/20 bg-background/40 px-2.5 py-1.5 text-[10px] font-medium tracking-tight text-muted-foreground shadow-[var(--shadow-glass)] backdrop-blur-sm sm:block"
          style={{ left: slot.x, top: slot.y }}
          animate={
            reduced
              ? undefined
              : { y: [0, -8, 0], opacity: [0.45, 0.85, 0.45] }
          }
          transition={{
            duration: 5.5,
            delay: slot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {slot.label}
        </motion.div>
      ))}

      <motion.div
        className="absolute top-[28%] right-[10%] hidden size-16 items-center justify-center rounded-xl border border-border/40 bg-background/35 p-2 backdrop-blur-sm lg:flex"
        animate={
          reduced
            ? undefined
            : { y: [0, 10, 0], rotate: [0, 2, 0] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="grid grid-cols-4 gap-0.5">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.span
              key={i}
              className="size-1.5 rounded-[1px] bg-foreground"
              animate={
                reduced
                  ? undefined
                  : { opacity: [0.2, 0.85, 0.2] }
              }
              transition={{
                duration: 2.2,
                delay: (i % 4) * 0.12,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
