"use client";

import { motion } from "framer-motion";
import { Bike, Car, CarTaxiFront, Package } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import { glass } from "@/lib/glass";
import { useMotionVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { TwinParkingSlot, TwinSlotStatus, VehicleType } from "@/types";

interface SlotCardProps {
  slot: TwinParkingSlot;
  selected: boolean;
  onSelect: (slot: TwinParkingSlot) => void;
  index: number;
  highlightLabel?: string | null;
}

const statusTone: Record<TwinSlotStatus, string> = {
  available:
    "border-success/20 bg-success/[0.06] hover:border-success/35 hover:shadow-[0_0_24px_-8px] hover:shadow-success/30",
  reserved:
    "border-warning/20 bg-warning/[0.07] hover:border-warning/35 hover:shadow-[0_0_24px_-8px] hover:shadow-warning/25",
  occupied:
    "border-primary/20 bg-primary/[0.07] hover:border-primary/40 hover:shadow-[0_0_28px_-8px] hover:shadow-primary/35",
  overstay:
    "border-warning/30 bg-warning/[0.1] hover:border-warning/45 hover:shadow-[0_0_28px_-8px] hover:shadow-warning/30",
};

const statusDot: Record<TwinSlotStatus, string> = {
  available: "bg-success",
  reserved: "bg-warning",
  occupied: "bg-primary",
  overstay: "bg-warning",
};

function VehicleIcon({ type }: { type?: VehicleType }) {
  const className = "size-4 opacity-80";
  switch (type) {
    case "bike":
      return <Bike className={className} aria-hidden="true" />;
    case "taxi":
      return <CarTaxiFront className={className} aria-hidden="true" />;
    case "delivery":
      return <Package className={className} aria-hidden="true" />;
    default:
      return <Car className={className} aria-hidden="true" />;
  }
}

export function SlotCard({
  slot,
  selected,
  onSelect,
  index,
  highlightLabel,
}: SlotCardProps) {
  const busy = slot.status !== "available";
  const motionSafe = useMotionVariants();

  return (
    <motion.button
      type="button"
      layout={!motionSafe.reduced}
      data-demo-target={
        slot.label === highlightLabel ? "demo-twin-slot" : undefined
      }
      initial={motionSafe.reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.012, 0.3), duration: 0.35 }}
      whileHover={motionSafe.hoverLift}
      whileTap={motionSafe.reduced ? undefined : { scale: 0.98 }}
      onClick={() => onSelect(slot)}
      className={cn(
        "group relative flex min-h-[7.5rem] flex-col rounded-2xl border p-3.5 text-left transition-[box-shadow,border-color] duration-300",
        glass.panel,
        statusTone[slot.status],
        selected && "ring-2 ring-primary/40 ring-offset-2 ring-offset-background"
      )}
      aria-label={`Slot ${slot.label}, ${slot.status}`}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-lg font-semibold tracking-tight">{slot.label}</p>
        <span
          className={cn(
            "mt-1 size-2 shrink-0 rounded-full",
            statusDot[slot.status],
            slot.status === "occupied" && "animate-pulse"
          )}
        />
      </div>

      <p className="mt-1 text-xs capitalize text-muted-foreground">
        {slot.status}
      </p>

      <div className="mt-auto flex items-end justify-between gap-2 pt-3">
        <div className="min-w-0">
          {busy ? (
            <>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <VehicleIcon type={slot.vehicleType} />
                <span className="truncate text-[11px] capitalize">
                  {slot.vehicleType ?? "vehicle"}
                </span>
              </div>
              {slot.expectedExit ? (
                <p className="mt-1 truncate text-[10px] text-muted-foreground">
                  Exit {formatDateTime(slot.expectedExit)}
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-[11px] text-muted-foreground">Open bay</p>
          )}
        </div>
        {slot.vehiclePlate ? (
          <span className="truncate font-mono text-[10px] text-muted-foreground">
            {slot.vehiclePlate}
          </span>
        ) : null}
      </div>
    </motion.button>
  );
}
