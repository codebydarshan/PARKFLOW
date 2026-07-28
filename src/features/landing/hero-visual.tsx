"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, QrCode, ShieldCheck } from "lucide-react";
import { CountUp } from "@/components/shared/count-up";
import { LivePulse } from "@/components/shared/live-pulse";
import { StatusBadge } from "@/components/shared/status-badge";
import { glass } from "@/lib/glass";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SlotState = "available" | "occupied" | "reserved";

const initialSlots: Array<{ label: string; state: SlotState }> = [
  { label: "P01", state: "occupied" },
  { label: "P02", state: "available" },
  { label: "P03", state: "reserved" },
  { label: "P04", state: "available" },
  { label: "P05", state: "occupied" },
  { label: "P06", state: "reserved" },
  { label: "P07", state: "available" },
  { label: "P08", state: "occupied" },
];

const slotTone: Record<SlotState, string> = {
  available: "border-success/25 bg-success/10 text-success",
  occupied: "border-primary/25 bg-primary/10 text-primary",
  reserved: "border-warning/30 bg-warning/12 text-warning-foreground",
};

const notifications = [
  "Visitor pass generated · Aria Kapoor",
  "P03 reserved · VIP bay hold",
  "Gate A verified · TX-8PL21",
  "P05 occupied · vehicle entered",
];

/** Full-bleed animated product preview — living twin of ParkFlow operations. */
export function HeroVisual() {
  const reduced = useReducedMotion();
  const [slots, setSlots] = useState(initialSlots);
  const [stats, setStats] = useState({ available: 24, occupied: 18, passes: 6 });
  const [toastIndex, setToastIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;

    const slotTimer = window.setInterval(() => {
      setSlots((current) => {
        const next = current.map((slot) => ({ ...slot }));
        const index = Math.floor(Math.random() * next.length);
        const cycle: SlotState[] = ["available", "reserved", "occupied"];
        const currentState = next[index]!.state;
        const nextState =
          cycle[(cycle.indexOf(currentState) + 1) % cycle.length]!;
        next[index] = { ...next[index]!, state: nextState };

        const available = next.filter((s) => s.state === "available").length;
        const occupied = next.filter((s) => s.state === "occupied").length;
        setStats({
          available: 16 + available,
          occupied: 12 + occupied,
          passes: 4 + Math.floor(Math.random() * 4),
        });
        return next;
      });
    }, 2800);

    const toastTimer = window.setInterval(() => {
      setToastIndex((value) => (value + 1) % notifications.length);
    }, 3200);

    return () => {
      window.clearInterval(slotTimer);
      window.clearInterval(toastTimer);
    };
  }, [reduced]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28, duration: 0.55, ease: easeOut }}
      className="relative w-full"
      aria-hidden="true"
    >
      <div className="relative overflow-hidden border-y border-border/40 bg-gradient-to-b from-primary/[0.08] via-background/50 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_oklch(0.55_0.14_255_/_0.12),_transparent_60%)]" />

        <div className="relative mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-12 lg:gap-5 lg:py-12">
          <div className={cn("rounded-2xl p-4 sm:p-5 lg:col-span-7", glass.panelStrong)}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Mission Control</p>
                <p className="text-sm font-medium tracking-tight">
                  Riverside Heights
                </p>
              </div>
              <LivePulse label="Live" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
              {[
                { label: "Available", value: stats.available, tone: "text-success" },
                { label: "Occupied", value: stats.occupied, tone: "text-primary" },
                { label: "Active passes", value: stats.passes, tone: "text-foreground" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border/50 bg-background/45 px-3 py-3"
                >
                  <p className="text-[10px] tracking-wider text-muted-foreground uppercase sm:text-[11px]">
                    {stat.label}
                  </p>
                  <p
                    className={cn(
                      "mt-1 text-xl font-semibold tracking-tight sm:text-2xl",
                      stat.tone
                    )}
                  >
                    <CountUp value={stat.value} durationMs={600} />
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <p className="mb-2.5 text-xs text-muted-foreground">
                Visitor parking twin
              </p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                <AnimatePresence initial={false}>
                  {slots.map((slot) => (
                    <motion.div
                      key={slot.label}
                      layout
                      initial={false}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.35, ease: easeOut }}
                      className={cn(
                        "rounded-lg border px-1.5 py-2 text-center transition-colors duration-500",
                        slotTone[slot.state]
                      )}
                    >
                      <p className="text-[11px] font-semibold tracking-tight sm:text-xs">
                        {slot.label}
                      </p>
                      <p className="mt-0.5 text-[9px] capitalize opacity-80 sm:text-[10px]">
                        {slot.state}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-5 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={toastIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-xl border border-primary/20 bg-primary/8 px-3.5 py-2.5 text-xs text-primary"
                >
                  {notifications[toastIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-5">
            <div className={cn("flex flex-1 flex-col rounded-2xl p-4 sm:p-5", glass.panel)}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Visitor QR</p>
                  <p className="mt-0.5 text-sm font-medium">Emily Brooks</p>
                </div>
                <StatusBadge status="active" />
              </div>
              <div className="mt-4 flex flex-1 items-center gap-4">
                <motion.div
                  className="flex size-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-background/40 sm:size-28"
                  animate={
                    reduced
                      ? undefined
                      : { boxShadow: ["0 0 0 0 transparent", "0 0 0 8px color-mix(in oklch, var(--primary) 12%, transparent)", "0 0 0 0 transparent"] }
                  }
                  transition={{ duration: 2.8, repeat: Infinity }}
                >
                  <div className="grid grid-cols-5 gap-0.5">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="size-2 rounded-[1px] bg-foreground sm:size-2.5"
                        animate={
                          reduced
                            ? undefined
                            : { opacity: [0.25, 0.9, 0.25] }
                        }
                        transition={{
                          duration: 2,
                          delay: (i % 5) * 0.08,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <QrCode className="size-4" />
                    <span className="text-xs font-medium">Pass ready</span>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    TX-8PL21 · Slot P01
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Valid today · allocated by engine
                  </p>
                </div>
              </div>
            </div>

            <div className={cn("rounded-2xl p-4 sm:p-5", glass.panel)}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-success" />
                <p className="text-sm font-medium tracking-tight">
                  Security approval
                </p>
              </div>
              <motion.div
                className="mt-3 flex items-center gap-3 rounded-xl border border-success/25 bg-success/10 px-3 py-3 text-success"
                animate={reduced ? undefined : { opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Check className="size-4 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Access granted</p>
                  <p className="text-xs opacity-80">
                    Direct guest to Visitor Bay P01
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
