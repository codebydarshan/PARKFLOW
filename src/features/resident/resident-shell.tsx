"use client";

import { ResidentHeader } from "@/features/resident/resident-header";
import { ResidentSidebar } from "@/features/resident/resident-sidebar";
import type { User } from "@/types";

interface ResidentShellProps {
  user: User;
  search: string;
  onSearchChange: (value: string) => void;
  children: React.ReactNode;
}

export function ResidentShell({
  user,
  search,
  onSearchChange,
  children,
}: ResidentShellProps) {
  return (
    <div className="surface-app flex min-h-screen">
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <ResidentSidebar unit={user.unit} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <ResidentHeader
          user={user}
          search={search}
          onSearchChange={onSearchChange}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
