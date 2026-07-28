import type { LucideIcon } from "lucide-react";
import {
  Car,
  CircleHelp,
  Clock3,
  LayoutDashboard,
  MapPinned,
  QrCode,
  Settings,
} from "lucide-react";

export interface ResidentNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  id: string;
}

export const residentSidebarNav: ResidentNavItem[] = [
  { id: "dashboard", title: "Dashboard", href: "/resident", icon: LayoutDashboard },
  { id: "passes", title: "Visitor Passes", href: "/resident#passes", icon: QrCode },
  { id: "vehicles", title: "My Vehicles", href: "/resident#vehicles", icon: Car },
  { id: "parking", title: "Parking", href: "/parking", icon: MapPinned },
  { id: "history", title: "History", href: "/resident#history", icon: Clock3 },
  { id: "settings", title: "Settings", href: "/resident#settings", icon: Settings },
  { id: "help", title: "Help", href: "/resident#help", icon: CircleHelp },
];
