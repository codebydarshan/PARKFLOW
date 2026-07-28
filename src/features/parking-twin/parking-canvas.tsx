"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MapPinned } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { SlotCard } from "@/features/parking-twin/slot-card";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";
import type { TwinParkingSlot } from "@/types";

interface ParkingCanvasProps {
  slots: TwinParkingSlot[];
  selectedId: string | null;
  onSelect: (slot: TwinParkingSlot) => void;
  allAvailable: boolean;
  highlightLabel?: string | null;
}

export function ParkingCanvas({
  slots,
  selectedId,
  onSelect,
  allAvailable,
  highlightLabel,
}: ParkingCanvasProps) {
  return (
    <section className={cn("rounded-2xl p-4 sm:p-5", glass.panel)}>
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Parking Digital Twin
          </h2>
          <p className="text-sm text-muted-foreground">
            Live visitor bay map · P01–P30
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {[
            { label: "Available", className: "bg-success" },
            { label: "Reserved", className: "bg-warning" },
            { label: "Occupied", className: "bg-primary" },
            { label: "Overstay", className: "bg-warning/80" },
          ].map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5">
              <span className={cn("size-2 rounded-full", item.className)} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {allAvailable ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <EmptyState
              icon={MapPinned}
              title="Visitor parking is completely available."
              description="Every visitor bay is open. The twin will animate as arrivals and reservations appear."
              className="border-border/40 bg-background/20 py-16"
            />
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
              {slots.map((slot, index) => (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  selected={selectedId === slot.id}
                  onSelect={onSelect}
                  index={index}
                  highlightLabel={highlightLabel}
                />
              ))}
            </div>
          </motion.div>
        ) : slots.length === 0 ? (
          <motion.div
            key="filtered-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <EmptyState
              icon={MapPinned}
              title="No slots match this filter."
              description="Try another status or clear your search."
              className="border-0 bg-transparent py-16"
            />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          >
            {slots.map((slot, index) => (
              <SlotCard
                key={slot.id}
                slot={slot}
                selected={selectedId === slot.id}
                onSelect={onSelect}
                index={index}
                highlightLabel={highlightLabel}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
