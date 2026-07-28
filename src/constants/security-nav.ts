import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Car,
  LayoutDashboard,
  Settings,
  Users,
  UserCheck,
} from "lucide-react";

export interface SecurityNavItem {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
}

export const securitySidebarNav: SecurityNavItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    href: "/security",
    icon: LayoutDashboard,
  },
  {
    id: "expected",
    title: "Expected Visitors",
    href: "/security#expected",
    icon: Users,
  },
  {
    id: "inside",
    title: "Visitors Inside",
    href: "/security#inside",
    icon: UserCheck,
  },
  {
    id: "parking",
    title: "Parking Status",
    href: "/parking",
    icon: Car,
  },
  {
    id: "activity",
    title: "Activity Feed",
    href: "/security#activity",
    icon: Activity,
  },
  {
    id: "incidents",
    title: "Incidents",
    href: "/security#incidents",
    icon: AlertTriangle,
  },
  {
    id: "settings",
    title: "Settings",
    href: "/security#settings",
    icon: Settings,
  },
];
