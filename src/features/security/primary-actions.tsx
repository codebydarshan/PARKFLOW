"use client";

import { motion } from "framer-motion";
import {
  Keyboard,
  LogOut,
  ScanLine,
  Siren,
  type LucideIcon,
} from "lucide-react";
import { glass } from "@/lib/glass";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type SecurityPrimaryAction =
  | "scan"
  | "manual"
  | "exit"
  | "emergency";

interface PrimaryActionsProps {
  active: SecurityPrimaryAction;
  onAction: (action: SecurityPrimaryAction) => void;
}

const actions: Array<{
  id: SecurityPrimaryAction;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    id: "scan",
    title: "Scan QR",
    description: "Verify visitor pass",
    icon: ScanLine,
  },
  {
    id: "manual",
    title: "Manual Entry",
    description: "Paste visitor ID",
    icon: Keyboard,
  },
  {
    id: "exit",
    title: "Visitor Exit",
    description: "Mark checkout",
    icon: LogOut,
  },
  {
    id: "emergency",
    title: "Emergency Entry",
    description: "Override protocol",
    icon: Siren,
  },
];

export function PrimaryActions({ active, onAction }: PrimaryActionsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        const isActive = active === action.id;

        return (
          <motion.button
            key={action.id}
            type="button"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.08 + index * 0.03 }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onAction(action.id)}
            className={cn(
              "flex min-h-[5.5rem] items-center gap-4 rounded-2xl px-5 py-4 text-left transition-shadow duration-200",
              glass.panel,
              isActive
                ? "shadow-[inset_0_0_0_1px] shadow-primary/40 ring-1 ring-primary/30"
                : "hover:shadow-[var(--shadow-glass-lg)]"
            )}
          >
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary ring-1 ring-primary/15"
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight">
                {action.title}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {action.description}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
