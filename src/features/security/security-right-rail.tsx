"use client";

import { motion } from "framer-motion";
import { Lightbulb, Phone, MapPinned, Users } from "lucide-react";
import { glass } from "@/lib/glass";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { SecurityParkingZone } from "@/services/security";
import type { SecurityContact, SecurityUpcomingArrival } from "@/types";

interface SecurityRightRailProps {
  parkingSummary: SecurityParkingZone[];
  upcomingArrivals: SecurityUpcomingArrival[];
  tips: string[];
  emergencyContacts: SecurityContact[];
}

export function SecurityRightRail({
  parkingSummary,
  upcomingArrivals,
  tips,
  emergencyContacts,
}: SecurityRightRailProps) {
  return (
    <aside className="hidden w-72 shrink-0 space-y-4 xl:block">
      <motion.div
        id="parking"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className={cn("scroll-mt-24 rounded-2xl p-5", glass.panel)}
      >
        <div className="flex items-center gap-2">
          <MapPinned className="size-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight">
            Parking Summary
          </h2>
        </div>
        <ul className="mt-4 space-y-3">
          {parkingSummary.map((zone) => (
            <li key={zone.zone}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{zone.zone}</span>
                <span className="font-medium tabular-nums">
                  {zone.occupied}/{zone.total}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full bg-primary",
                    [
                      "w-0",
                      "w-[10%]",
                      "w-[20%]",
                      "w-[30%]",
                      "w-[40%]",
                      "w-[50%]",
                      "w-[60%]",
                      "w-[70%]",
                      "w-[80%]",
                      "w-[90%]",
                      "w-full",
                    ][
                      Math.min(
                        10,
                        Math.round((zone.occupied / zone.total) * 10)
                      )
                    ]
                  )}
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {zone.available} available
              </p>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        id="expected"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.04 }}
        className={cn("scroll-mt-24 rounded-2xl p-5", glass.panel)}
      >
        <div className="flex items-center gap-2">
          <Users className="size-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight">
            Upcoming Arrivals
          </h2>
        </div>
        <ul className="mt-4 space-y-3">
          {upcomingArrivals.map((arrival) => (
            <li
              key={`${arrival.visitorName}-${arrival.eta}`}
              className="rounded-xl border border-border/40 bg-background/35 px-3 py-2.5"
            >
              <p className="text-sm font-medium">{arrival.visitorName}</p>
              <p className="text-xs text-muted-foreground">
                {arrival.residentName} · {arrival.vehiclePlate}
              </p>
              <p className="mt-1 text-xs font-medium text-primary">
                {arrival.eta}
              </p>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.06 }}
        className={cn("rounded-2xl p-5", glass.panel)}
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-warning" />
          <h2 className="text-sm font-semibold tracking-tight">
            Security Tips
          </h2>
        </div>
        <ul className="mt-4 space-y-3">
          {tips.map((tip) => (
            <li
              key={tip}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        id="incidents"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.08 }}
        className={cn("scroll-mt-24 rounded-2xl p-5", glass.panel)}
      >
        <div className="flex items-center gap-2">
          <Phone className="size-4 text-destructive" />
          <h2 className="text-sm font-semibold tracking-tight">
            Emergency Contacts
          </h2>
        </div>
        <ul className="mt-4 space-y-3">
          {emergencyContacts.map((contact) => (
            <li
              key={contact.label}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="text-muted-foreground">{contact.label}</span>
              <span className="font-mono font-medium">{contact.value}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <div id="settings" className="sr-only" aria-hidden="true" />
    </aside>
  );
}
