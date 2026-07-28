import resident from "@/mock/resident.json";
import { parkingEngine } from "@/services/parking-engine";
import type {
  ResidentStats,
  ResidentVehicle,
  TimelineEvent,
  User,
  VisitorPass,
} from "@/types";

export interface ResidentUpcoming {
  visitorName: string;
  vehiclePlate: string;
  when: string;
  status: string;
}

export interface ResidentZoneAvailability {
  zone: string;
  available: number;
  total: number;
}

export interface ResidentDashboardData {
  profile: User;
  stats: ResidentStats;
  vehicles: ResidentVehicle[];
  passes: VisitorPass[];
  timeline: TimelineEvent[];
  upcoming: ResidentUpcoming;
  parkingAvailability: ResidentZoneAvailability[];
  tips: string[];
}

export function getResidentDashboard(): ResidentDashboardData {
  const base = resident as ResidentDashboardData;
  const analytics = parkingEngine.getAnalytics();
  const occupancy = parkingEngine.getOccupancy();

  const parkingAvailability = analytics.zoneUtilization.map((zone) => ({
    zone: zone.zone.charAt(0).toUpperCase() + zone.zone.slice(1),
    available: zone.available,
    total: zone.total,
  }));

  return {
    ...base,
    stats: {
      ...base.stats,
      availableParking: occupancy.available,
      occupancyRate: analytics.occupancyPercent,
    },
    parkingAvailability,
  };
}
