"use client";

import { SecurityHeader } from "@/features/security/security-header";
import { SecuritySidebar } from "@/features/security/security-sidebar";
import type { User } from "@/types";

interface SecurityShellProps {
  user: User;
  search: string;
  onSearchChange: (value: string) => void;
  children: React.ReactNode;
}

export function SecurityShell({
  user,
  search,
  onSearchChange,
  children,
}: SecurityShellProps) {
  return (
    <div className="surface-app flex min-h-screen">
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <SecuritySidebar gateLabel={user.unit} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <SecurityHeader
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
