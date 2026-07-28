"use client";

import { motion } from "framer-motion";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";
import type { TwinSlotStatus } from "@/types";

export type TwinFilter = "all" | TwinSlotStatus;

interface TwinFiltersProps {
  value: TwinFilter;
  onChange: (value: TwinFilter) => void;
  counts: Record<TwinFilter, number>;
}

const filters: Array<{ id: TwinFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "available", label: "Available" },
  { id: "reserved", label: "Reserved" },
  { id: "occupied", label: "Occupied" },
  { id: "overstay", label: "Overstays" },
];

export function TwinFilters({ value, onChange, counts }: TwinFiltersProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl p-2",
        glass.panel
      )}
      role="tablist"
      aria-label="Filter parking slots"
    >
      {filters.map((filter) => {
        const active = value === filter.id;
        return (
          <motion.button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={active}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(filter.id)}
            className={cn(
              "rounded-xl px-3.5 py-2 text-sm transition-colors",
              active
                ? "bg-primary/12 font-medium text-primary shadow-[inset_0_0_0_1px] shadow-primary/15"
                : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
            )}
          >
            {filter.label}
            <span className="ml-1.5 tabular-nums text-xs opacity-70">
              {counts[filter.id]}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
