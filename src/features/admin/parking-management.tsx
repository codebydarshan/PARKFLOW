"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatDateTime } from "@/lib/format";
import { glass } from "@/lib/glass";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { AdminParkingSlot } from "@/types";

interface ParkingManagementProps {
  slots: AdminParkingSlot[];
}

const statusTone = {
  available: "bg-success/10 border-success/25 text-success",
  occupied: "bg-primary/10 border-primary/25 text-primary",
  reserved: "bg-warning/10 border-warning/25 text-warning",
  blocked: "bg-destructive/10 border-destructive/25 text-destructive",
  overstay: "bg-warning/10 border-warning/30 text-warning",
  maintenance: "bg-muted border-border/60 text-muted-foreground",
} as const;

export function ParkingManagement({ slots }: ParkingManagementProps) {
  const [selected, setSelected] = useState<AdminParkingSlot | null>(null);

  return (
    <>
      <motion.section
        id="parking"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="scroll-mt-24 space-y-4"
      >
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Parking Management
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            All visitor slots P01–P30 — tap a bay for details
          </p>
        </div>

        <div className={cn("rounded-2xl p-4 sm:p-5", glass.panel)}>
          <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {[
              { label: "Available", className: "bg-success" },
              { label: "Occupied", className: "bg-primary" },
              { label: "Reserved", className: "bg-warning" },
            ].map((item) => (
              <span key={item.label} className="inline-flex items-center gap-1.5">
                <span className={cn("size-2 rounded-full", item.className)} />
                {item.label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {slots.map((slot, index) => (
              <motion.button
                key={slot.id}
                type="button"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(index * 0.01, 0.25) }}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(slot)}
                className={cn(
                  "rounded-xl border px-2 py-3 text-center transition-shadow",
                  statusTone[slot.status]
                )}
                aria-label={`Slot ${slot.label}, ${slot.status}`}
              >
                <p className="text-sm font-semibold tracking-tight">
                  {slot.label}
                </p>
                <p className="mt-0.5 text-[10px] capitalize opacity-80">
                  {slot.status}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      <Sheet
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle className="text-xl tracking-tight">
                  Slot {selected.label}
                </SheetTitle>
                <SheetDescription>
                  Visitor parking bay details
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4 px-1">
                <StatusBadge status={selected.status} kind="slot" />
                <dl className="grid gap-3">
                  {[
                    { label: "Vehicle", value: selected.vehiclePlate ?? "—" },
                    { label: "Visitor", value: selected.visitorName ?? "—" },
                    { label: "Resident", value: selected.residentName ?? "—" },
                    {
                      label: "Arrival Time",
                      value: selected.arrivalTime
                        ? formatDateTime(selected.arrivalTime)
                        : "—",
                    },
                    {
                      label: "Expected Exit",
                      value: selected.expectedExit
                        ? formatDateTime(selected.expectedExit)
                        : "—",
                    },
                    {
                      label: "Status",
                      value: selected.status,
                      capitalize: true,
                    },
                  ].map((field) => (
                    <div
                      key={field.label}
                      className="rounded-xl border border-border/50 bg-background/40 p-3.5"
                    >
                      <dt className="text-xs text-muted-foreground">
                        {field.label}
                      </dt>
                      <dd
                        className={cn(
                          "mt-1 text-sm font-medium",
                          field.capitalize && "capitalize",
                          field.label === "Vehicle" && "font-mono"
                        )}
                      >
                        {field.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
