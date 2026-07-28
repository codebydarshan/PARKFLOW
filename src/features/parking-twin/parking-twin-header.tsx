"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw, Search } from "lucide-react";
import { LivePulse } from "@/components/shared/live-pulse";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StartDemoButton } from "@/features/demo";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";
import type { TwinMetrics } from "@/types";

interface ParkingTwinHeaderProps {
  communityName: string;
  search: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
  metrics: TwinMetrics;
}

export function ParkingTwinHeader({
  communityName,
  search,
  onSearchChange,
  onRefresh,
  refreshing,
  metrics,
}: ParkingTwinHeaderProps) {
  const total =
    metrics.available +
    metrics.reserved +
    metrics.occupied +
    metrics.overstays;
  const occupiedPct = Math.round(
    ((metrics.occupied + metrics.overstays) / Math.max(total, 1)) * 100
  );

  return (
    <header className={cn("sticky top-0 z-30 border-b px-4 sm:px-6", glass.nav)}>
      <div className="mx-auto flex h-14 max-w-[90rem] items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
          aria-label="Back to overview"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <Logo href="/parking" className="hidden sm:inline-flex" />

        <div className="relative min-w-0 flex-1 max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search parking, visitor, vehicle..."
            className={cn("h-9 pl-9", glass.search)}
            aria-label="Search parking slot"
          />
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <div className="hidden items-center gap-3 rounded-xl border border-border/50 bg-background/35 px-3 py-1.5 text-xs lg:flex">
            <span className="text-muted-foreground">{communityName}</span>
            <span className="font-medium tabular-nums">{occupiedPct}% live</span>
            <span className="text-muted-foreground">
              {metrics.available} open
            </span>
          </div>

          <LivePulse label="Live" className="hidden sm:inline-flex" />

          <StartDemoButton size="sm" variant="outline" className="hidden md:inline-flex" />

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Refresh twin"
            onClick={onRefresh}
          >
            <RefreshCw
              className={cn("size-4", refreshing && "animate-spin")}
            />
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
