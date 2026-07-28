"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { residentSidebarNav } from "@/constants/resident-nav";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";

interface ResidentSidebarProps {
  unit: string;
  className?: string;
  onNavigate?: () => void;
}

export function ResidentSidebar({
  unit,
  className,
  onNavigate,
}: ResidentSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-60 shrink-0 flex-col border-r",
        glass.sidebar,
        className
      )}
    >
      <div className="flex h-14 items-center px-4">
        <Logo href="/resident" />
      </div>

      <div className="px-3 pb-4">
        <div className="rounded-xl border border-border/50 bg-background/40 px-3 py-2.5 backdrop-blur-sm">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Resident
          </p>
          <p className="mt-1 truncate text-sm font-medium tracking-tight">
            Unit {unit}
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3" aria-label="Resident">
        {residentSidebarNav.map((item) => {
          const Icon = item.icon;
          const highlighted =
            pathname === item.href ||
            (item.id === "dashboard" && pathname === "/resident");

          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onNavigate}
              aria-current={highlighted ? "page" : undefined}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                highlighted
                  ? "bg-primary/12 font-medium text-primary shadow-[inset_0_0_0_1px] shadow-primary/15"
                  : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/50 p-3">
        <p className="px-2 text-xs text-muted-foreground">
          Demo mode · mock data
        </p>
      </div>
    </aside>
  );
}
