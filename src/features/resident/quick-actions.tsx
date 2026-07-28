"use client";

import { motion } from "framer-motion";
import {
  Car,
  Clock3,
  MapPinned,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { glass } from "@/lib/glass";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
}

interface QuickActionsProps {
  onCreatePass: () => void;
}

export function QuickActions({ onCreatePass }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: "create",
      title: "Create Visitor Pass",
      description: "Invite a guest in under 20 seconds",
      icon: Plus,
      onClick: onCreatePass,
    },
    {
      id: "vehicles",
      title: "My Vehicles",
      description: "Manage registered plates",
      icon: Car,
      href: "#vehicles",
    },
    {
      id: "map",
      title: "Parking Map",
      description: "See open visitor bays",
      icon: MapPinned,
      href: "/parking",
    },
    {
      id: "history",
      title: "Visitor History",
      description: "Review past passes",
      icon: Clock3,
      href: "#history",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        const content = (
          <>
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-transform duration-200 group-hover:scale-105">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <div className="mt-4">
              <p className="text-base font-medium tracking-tight">
                {action.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {action.description}
              </p>
            </div>
          </>
        );

        return (
          <motion.div
            key={action.id}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 + index * 0.04 }}
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {action.onClick ? (
              <button
                type="button"
                onClick={action.onClick}
                className={cn(
                  "group h-full w-full rounded-2xl p-5 text-left transition-shadow duration-200 hover:shadow-[var(--shadow-glass-lg)]",
                  glass.panel
                )}
              >
                {content}
              </button>
            ) : (
              <a
                href={action.href}
                className={cn(
                  "group block h-full rounded-2xl p-5 transition-shadow duration-200 hover:shadow-[var(--shadow-glass-lg)]",
                  glass.panel
                )}
              >
                {content}
              </a>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
