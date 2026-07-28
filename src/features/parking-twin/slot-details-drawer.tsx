"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SlotDetailsContent } from "@/features/parking-twin/slot-details-panel";
import type { TwinParkingSlot } from "@/types";

interface SlotDetailsDrawerProps {
  slot: TwinParkingSlot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onViewPass: (slot: TwinParkingSlot) => void;
  onMarkExit: (slot: TwinParkingSlot) => void;
  onReassign: (slot: TwinParkingSlot) => void;
}

export function SlotDetailsDrawer({
  slot,
  open,
  onOpenChange,
  onViewPass,
  onMarkExit,
  onReassign,
}: SlotDetailsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-xl tracking-tight">
            {slot ? `Slot ${slot.label}` : "Slot details"}
          </SheetTitle>
          <SheetDescription>
            Live bay context from the parking digital twin
          </SheetDescription>
        </SheetHeader>
        {slot ? (
          <div className="mt-2 px-1 pb-6">
            <SlotDetailsContent
              slot={slot}
              onViewPass={() => onViewPass(slot)}
              onMarkExit={() => onMarkExit(slot)}
              onReassign={() => onReassign(slot)}
            />
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
