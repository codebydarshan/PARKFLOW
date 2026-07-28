import admin from "@/mock/admin.json";
import {
  analyticsToAdminStats,
  listAdminSlots,
  occupancyToAdminBreakdown,
  parkingEngine,
} from "@/services/parking-engine";
import type {
  AdminFlatLeader,
  AdminHourlyPoint,
  AdminInsight,
  AdminParkingSlot,
  AdminPassRow,
  AdminReportCard,
  AdminResidentRow,
  AdminSecurityOverview,
  AdminStats,
  AdminTimelineItem,
  User,
} from "@/types";

export interface AdminOccupancyBreakdown {
  occupied: number;
  reserved: number;
  available: number;
  total: number;
}

export interface AdminDashboardData {
  profile: User;
  communityName: string;
  stats: AdminStats;
  occupancy: AdminOccupancyBreakdown;
  timeline: AdminTimelineItem[];
  hourlyVisits: AdminHourlyPoint[];
  topFlats: AdminFlatLeader[];
  recentPasses: AdminPassRow[];
  residents: AdminResidentRow[];
  securityOverview: AdminSecurityOverview;
  insights: AdminInsight[];
  reports: AdminReportCard[];
  policies: string[];
  slots: AdminParkingSlot[];
}

export function getAdminDashboard(): AdminDashboardData {
  const base = admin as AdminDashboardData;
  const analytics = parkingEngine.getAnalytics();
  const occupancy = occupancyToAdminBreakdown();
  const slots = listAdminSlots();

  return {
    ...base,
    stats: {
      ...analyticsToAdminStats(analytics),
      todayVisitors: base.stats.todayVisitors,
    },
    occupancy,
    slots,
    insights: [
      {
        id: "eng_ins_01",
        text: `Parking occupancy is currently ${analytics.occupancyPercent}%.`,
      },
      {
        id: "eng_ins_02",
        text: `${analytics.overstayCount} visitors are in overstay.`,
      },
      {
        id: "eng_ins_03",
        text: `Peak utilization tracked at ${analytics.peakUtilizationPercent}%.`,
      },
      {
        id: "eng_ins_04",
        text: `Average stay is ${analytics.averageStayHours}h across zones.`,
      },
    ],
  };
}
