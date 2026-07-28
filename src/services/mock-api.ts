import community from "@/mock/community.json";
import users from "@/mock/users.json";
import passes from "@/mock/passes.json";
import activity from "@/mock/activity.json";
import {
  listParkingSlots,
  parkingEngine,
} from "@/services/parking-engine";
import type {
  ActivityItem,
  Community,
  DashboardStats,
  ParkingSlot,
  PassStatus,
  User,
  VisitorPass,
} from "@/types";

/** Mock data access layer — swap for real API clients later. */
export const mockApi = {
  getCommunity(): Community {
    return community as Community;
  },

  getUsers(): User[] {
    return users as User[];
  },

  getCurrentUser(role: User["role"] = "resident"): User {
    const match = (users as User[]).find((user) => user.role === role);
    return match ?? (users as User[])[0];
  },

  getSlots(): ParkingSlot[] {
    return listParkingSlots();
  },

  getPasses(status?: PassStatus): VisitorPass[] {
    const all = passes as VisitorPass[];
    if (!status) return all;
    return all.filter((pass) => pass.status === status);
  },

  getPassById(id: string): VisitorPass | undefined {
    return (passes as VisitorPass[]).find((pass) => pass.id === id);
  },

  getActivity(): ActivityItem[] {
    return (activity as ActivityItem[]).slice().sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  },

  getStats(): DashboardStats {
    const analytics = parkingEngine.getAnalytics();
    const occupancy = parkingEngine.getOccupancy();
    return {
      totalSlots: occupancy.total,
      occupiedSlots: occupancy.occupied + occupancy.overstay,
      availableSlots: occupancy.available,
      activePasses: occupancy.occupied + occupancy.reserved,
      todayVisitors: analytics.occupiedCount + analytics.reservedCount + 10,
      occupancyRate: analytics.occupancyPercent,
    };
  },
};
