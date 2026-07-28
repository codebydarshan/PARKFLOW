import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Car,
  FileText,
  LayoutDashboard,
  QrCode,
  Scale,
  Settings,
  Shield,
  Users,
} from "lucide-react";

export interface AdminNavItem {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
}

export const adminSidebarNav: AdminNavItem[] = [
  { id: "overview", title: "Overview", href: "/admin", icon: LayoutDashboard },
  { id: "parking", title: "Parking", href: "/parking", icon: Car },
  { id: "residents", title: "Residents", href: "/admin#residents", icon: Users },
  { id: "security", title: "Security", href: "/admin#security", icon: Shield },
  {
    id: "passes",
    title: "Visitor Passes",
    href: "/admin#passes",
    icon: QrCode,
  },
  {
    id: "analytics",
    title: "Analytics",
    href: "/admin#analytics",
    icon: BarChart3,
  },
  { id: "reports", title: "Reports", href: "/admin#reports", icon: FileText },
  { id: "policies", title: "Policies", href: "/admin#policies", icon: Scale },
  {
    id: "settings",
    title: "Settings",
    href: "/admin#settings",
    icon: Settings,
  },
];
