import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Shield,
  Settings,
  Home,
  QrCode,
  Car,
  ClipboardList,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export const mainNav: NavItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Community parking overview",
  },
  {
    title: "Parking Twin",
    href: "/parking",
    icon: Car,
    description: "Live visitor parking map",
  },
  {
    title: "Resident",
    href: "/resident",
    icon: Home,
    description: "Visitor passes & QR codes",
  },
  {
    title: "Security",
    href: "/security",
    icon: Shield,
    description: "Gate verification console",
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Settings,
    description: "Slots, zones & policies",
  },
];

export const residentNav: NavItem[] = [
  { title: "My Passes", href: "/resident", icon: QrCode },
  { title: "Vehicles", href: "/resident", icon: Car },
];

export const securityNav: NavItem[] = [
  { title: "Verify", href: "/security", icon: Shield },
  { title: "Live Slots", href: "/security", icon: Car },
];

export const adminNav: NavItem[] = [
  { title: "Slots", href: "/admin", icon: Car },
  { title: "Residents", href: "/admin", icon: Users },
  { title: "Activity", href: "/admin", icon: ClipboardList },
];
