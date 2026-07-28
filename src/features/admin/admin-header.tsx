"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, LogOut, Menu, Search, UserRound } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AdminSidebar } from "@/features/admin/admin-sidebar";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface AdminHeaderProps {
  user: User;
  communityName: string;
  search: string;
  onSearchChange: (value: string) => void;
}

export function AdminHeader({
  user,
  communityName,
  search,
  onSearchChange,
}: AdminHeaderProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const dateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(now);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 sm:px-6",
        glass.nav
      )}
    >
      <Sheet>
        <SheetTrigger
          className="inline-flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-background/60 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-60 border-r p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Admin navigation</SheetTitle>
          </SheetHeader>
          <AdminSidebar
            communityName={communityName}
            className="w-full border-0 shadow-none"
          />
        </SheetContent>
      </Sheet>

      <div className="relative min-w-0 flex-1 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Global search..."
          className={cn("h-9 pl-9", glass.search)}
          aria-label="Global search"
        />
      </div>

      <div className="hidden text-right leading-tight lg:block">
        <p className="text-xs text-muted-foreground">Today</p>
        <p className="text-sm font-medium">{dateLabel}</p>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
          className="relative"
        >
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary" />
        </Button>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-9 items-center gap-2 rounded-full px-1.5 transition-colors hover:bg-background/60 sm:px-2">
            <Avatar className="size-7 ring-1 ring-border/60">
              <AvatarFallback className="bg-primary/15 text-xs font-medium text-primary">
                {user.avatarInitials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-28 truncate text-sm sm:inline">
              {user.name}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  Admin · {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserRound className="size-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              render={<Link href="/login" className="flex items-center gap-1.5" />}
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
