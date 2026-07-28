"use client";

import { motion } from "framer-motion";
import { QrCode, Replace, LogOut } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatDurationHours } from "@/lib/format";
import { glass } from "@/lib/glass";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { TwinParkingSlot } from "@/types";

interface SlotDetailsContentProps {
  slot: TwinParkingSlot;
  onViewPass: () => void;
  onMarkExit: () => void;
  onReassign: () => void;
}

export function SlotDetailsContent({
  slot,
  onViewPass,
  onMarkExit,
  onReassign,
}: SlotDetailsContentProps) {
  const busy = slot.status !== "available";
  const duration =
    slot.arrivalTime != null
      ? formatDurationHours(slot.arrivalTime, slot.expectedExit)
      : "—";

  const fields = [
    { label: "Visitor Name", value: slot.visitorName ?? "—" },
    { label: "Resident", value: slot.residentName ?? "—" },
    { label: "Apartment", value: slot.apartment ?? "—" },
    {
      label: "Vehicle",
      value: slot.vehicleType
        ? slot.vehicleType.charAt(0).toUpperCase() + slot.vehicleType.slice(1)
        : "—",
    },
    { label: "Vehicle Number", value: slot.vehiclePlate ?? "—", mono: true },
    {
      label: "Arrival Time",
      value: slot.arrivalTime ? formatDateTime(slot.arrivalTime) : "—",
    },
    {
      label: "Expected Exit",
      value: slot.expectedExit ? formatDateTime(slot.expectedExit) : "—",
    },
    { label: "Duration", value: duration },
    {
      label: "QR Status",
      value: slot.qrStatus ?? "—",
      capitalize: true,
    },
    { label: "Visitor Pass", value: slot.passId ?? "—" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Parking slot</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight">
            {slot.label}
          </h3>
        </div>
        <StatusBadge status={slot.status} kind="slot" />
      </div>

      {!busy ? (
        <p className="rounded-xl border border-border/40 bg-background/35 px-3.5 py-3 text-sm text-muted-foreground">
          This bay is open and ready for the next visitor allocation.
        </p>
      ) : (
        <>
          <dl className="grid gap-2.5">
            {fields.map((field) => (
              <div
                key={field.label}
                className="rounded-xl border border-border/40 bg-background/35 px-3.5 py-2.5"
              >
                <dt className="text-[11px] text-muted-foreground">
                  {field.label}
                </dt>
                <dd
                  className={cn(
                    "mt-0.5 text-sm font-medium",
                    field.mono && "font-mono",
                    field.capitalize && "capitalize"
                  )}
                >
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>

          {slot.timeline && slot.timeline.length > 0 ? (
            <div>
              <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Timeline
              </p>
              <ol className="relative space-y-3 border-l border-border/60 pl-4">
                {slot.timeline.map((event) => (
                  <li key={event.id} className="relative">
                    <span className="absolute top-1.5 -left-[1.2rem] size-2 rounded-full bg-primary/70" />
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.time} · {event.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <Button className="w-full gap-1.5" onClick={onViewPass}>
              <QrCode className="size-4" />
              View Pass
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="gap-1.5"
                onClick={onMarkExit}
              >
                <LogOut className="size-4" />
                Mark Exit
              </Button>
              <Button
                variant="outline"
                className="gap-1.5"
                onClick={onReassign}
              >
                <Replace className="size-4" />
                Reassign
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface SlotDetailsPanelProps {
  slot: TwinParkingSlot | null;
  onViewPass: (slot: TwinParkingSlot) => void;
  onMarkExit: (slot: TwinParkingSlot) => void;
  onReassign: (slot: TwinParkingSlot) => void;
}

export function SlotDetailsPanel({
  slot,
  onViewPass,
  onMarkExit,
  onReassign,
}: SlotDetailsPanelProps) {
  return (
    <motion.aside
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn("hidden w-72 shrink-0 rounded-2xl p-5 lg:block", glass.panel)}
    >
      {slot ? (
        <SlotDetailsContent
          slot={slot}
          onViewPass={() => onViewPass(slot)}
          onMarkExit={() => onMarkExit(slot)}
          onReassign={() => onReassign(slot)}
        />
      ) : (
        <div className="flex h-full min-h-72 flex-col justify-center text-center">
          <p className="text-sm font-medium tracking-tight">Slot details</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Select a parking bay on the twin map to inspect visitor, vehicle,
            and pass context.
          </p>
        </div>
      )}
    </motion.aside>
  );
}
