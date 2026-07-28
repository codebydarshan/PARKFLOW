"use client";

import { AdminHeader } from "@/features/admin/admin-header";
import { AdminSidebar } from "@/features/admin/admin-sidebar";
import type { User } from "@/types";

interface AdminShellProps {
  user: User;
  communityName: string;
  search: string;
  onSearchChange: (value: string) => void;
  children: React.ReactNode;
}

export function AdminShell({
  user,
  communityName,
  search,
  onSearchChange,
  children,
}: AdminShellProps) {
  return (
    <div className="surface-app flex min-h-screen">
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <AdminSidebar communityName={communityName} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          user={user}
          communityName={communityName}
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
