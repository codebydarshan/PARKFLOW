"use client";

import Link from "next/link";
import { LogOut, Menu, UserRound } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface AppHeaderProps {
  user: User;
  communityName: string;
  title?: string;
}

export function AppHeader({ user, communityName, title }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center gap-3 border-b px-4 sm:px-6",
        glass.nav
      )}
    >
      <Sheet>
        <SheetTrigger
          className="inline-flex size-8 items-center justify-center rounded-lg text-foreground transition-colors duration-150 hover:bg-background/60 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="size-4" />
        </SheetTrigger>
        <SheetContent side="left" className="w-60 border-r p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <AppSidebar
            communityName={communityName}
            className="w-full border-0 shadow-none"
          />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        {title ? (
          <p className="truncate text-sm font-medium tracking-tight text-muted-foreground">
            {title}
          </p>
        ) : null}
      </div>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-9 items-center gap-2 rounded-full px-1.5 transition-colors duration-150 hover:bg-background/60 sm:px-2">
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
              <span className="text-xs text-muted-foreground">{user.email}</span>
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
    </header>
  );
}
