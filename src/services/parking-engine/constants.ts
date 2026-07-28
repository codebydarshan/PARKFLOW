import type { ParkingZone, VehicleSize, VisitorCategory } from "./types";

/** Deterministic visitor priority — lower index = higher priority. */
export const VISITOR_PRIORITY: readonly VisitorCategory[] = [
  "emergency",
  "vip",
  "delivery",
  "guest",
  "family",
  "contractor",
] as const;

export const ALLOCATABLE_STATUSES = ["available"] as const;

export const BLOCKED_ALLOCATION_STATUSES = [
  "occupied",
  "reserved",
  "blocked",
  "maintenance",
  "overstay",
] as const;

/** Preferred zones per visitor category (ordered). */
export const CATEGORY_ZONE_PREFERENCE: Record<
  VisitorCategory,
  readonly ParkingZone[]
> = {
  emergency: ["gate", "accessible", "standard", "premium"],
  delivery: ["delivery", "gate", "standard"],
  vip: ["premium", "gate", "standard"],
  guest: ["standard", "gate", "premium"],
  family: ["standard", "longstay", "gate"],
  contractor: ["longstay", "standard"],
};

export const CATEGORY_DURATION_HINT_HOURS: Record<VisitorCategory, number> = {
  emergency: 2,
  delivery: 1.5,
  vip: 4,
  guest: 3,
  family: 6,
  contractor: 10,
};

export const VEHICLE_SIZE_RANK: Record<VehicleSize, number> = {
  compact: 1,
  standard: 2,
  large: 3,
  oversized: 4,
};

export const TOTAL_BAYS = 30;

export const ENGINE_COMMUNITY = "Riverside Heights";
