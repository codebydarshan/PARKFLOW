import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { mockApi } from "@/services/mock-api";
import type { UserRole } from "@/types";

interface AppShellProps {
  children: React.ReactNode;
  role?: UserRole;
  title?: string;
}

export function AppShell({
  children,
  role = "resident",
  title,
}: AppShellProps) {
  const user = mockApi.getCurrentUser(role);
  const community = mockApi.getCommunity();

  return (
    <div className="surface-app flex min-h-screen">
      <div className="hidden lg:block">
        <div className="sticky top-0 h-screen">
          <AppSidebar communityName={community.name} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader
          user={user}
          communityName={community.name}
          title={title}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
