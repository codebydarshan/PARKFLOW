"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { adminSidebarNav } from "@/constants/admin-nav";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  communityName: string;
  className?: string;
  onNavigate?: () => void;
}

export function AdminSidebar({
  communityName,
  className,
  onNavigate,
}: AdminSidebarProps) {
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
        <Logo href="/admin" />
      </div>

      <div className="px-3 pb-4">
        <div className="rounded-xl border border-border/50 bg-background/40 px-3 py-2.5 backdrop-blur-sm">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
            Mission Control
          </p>
          <p className="mt-1 truncate text-sm font-medium tracking-tight">
            {communityName}
          </p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 pb-3" aria-label="Admin">
        {adminSidebarNav.map((item) => {
          const Icon = item.icon;
          const highlighted =
            pathname === item.href ||
            (item.id === "overview" && pathname === "/admin");

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
          Executive view · mock data
        </p>
      </div>
    </aside>
  );
}
