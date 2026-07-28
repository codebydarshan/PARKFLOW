import security from "@/mock/security.json";
import { parkingEngine } from "@/services/parking-engine";
import type {
  SecurityActivity,
  SecurityContact,
  SecurityStats,
  SecurityUpcomingArrival,
  SecurityVisitor,
  User,
} from "@/types";

export interface SecurityParkingZone {
  zone: string;
  occupied: number;
  available: number;
  total: number;
}

export interface MockQrOption {
  label: string;
  visitorId: string;
}

export interface SecurityDashboardData {
  profile: User;
  stats: SecurityStats;
  visitors: SecurityVisitor[];
  activity: SecurityActivity[];
  parkingSummary: SecurityParkingZone[];
  upcomingArrivals: SecurityUpcomingArrival[];
  tips: string[];
  emergencyContacts: SecurityContact[];
  mockQrOptions: MockQrOption[];
}

export function getSecurityDashboard(): SecurityDashboardData {
  const base = security as SecurityDashboardData;
  const analytics = parkingEngine.getAnalytics();
  const occupancy = parkingEngine.getOccupancy();

  return {
    ...base,
    stats: {
      ...base.stats,
      parkingOccupied: occupancy.occupied + occupancy.overstay,
      parkingAvailable: occupancy.available,
      overstays: occupancy.overstay,
    },
    parkingSummary: analytics.zoneUtilization.map((zone) => ({
      zone: zone.zone.charAt(0).toUpperCase() + zone.zone.slice(1),
      occupied: zone.occupied,
      available: zone.available,
      total: zone.total,
    })),
  };
}
