import {
  FutureAIStrategy,
  ParkingAllocator,
  RuleBasedStrategy,
} from "./allocator";
import { ENGINE_COMMUNITY } from "./constants";
import { normalizePlate } from "./rules";
import type {
  AllocationOutcome,
  AllocationRequest,
  EngineBayStatus,
  ParkingAnalytics,
  ParkingBay,
  VisitorCategory,
} from "./types";
import type {
  AdminParkingSlot,
  ParkingSlot,
  PassStatus,
  SlotStatus,
  TwinActivityItem,
  TwinActivityType,
  TwinMetrics,
  TwinParkingSlot,
  TwinSlotStatus,
  VehicleType,
} from "@/types";

export type {
  AllocationFailure,
  AllocationOutcome,
  AllocationRequest,
  AllocationResult,
  AllocationStrategy,
  EngineBayStatus,
  OccupancySnapshot,
  ParkingAnalytics,
  ParkingAssignment,
  ParkingBay,
  ParkingEngineAPI,
  ParkingZone,
  SimulationEvent,
  VehicleSize,
  VisitorCategory,
  ZoneUtilization,
} from "./types";

export {
  FutureAIStrategy,
  ParkingAllocator,
  RuleBasedStrategy,
} from "./allocator";
export { ENGINE_COMMUNITY, TOTAL_BAYS, VISITOR_PRIORITY } from "./constants";

/** Singleton engine — single source of truth for mock allocation. */
export const parkingEngine = new ParkingAllocator(new RuleBasedStrategy());

export function mapVehicleTypeToCategory(
  vehicleType?: VehicleType,
  hints?: { notes?: string; accessible?: boolean }
): VisitorCategory {
  const notes = hints?.notes?.toLowerCase() ?? "";
  if (notes.includes("emergency")) return "emergency";
  if (notes.includes("vip")) return "vip";
  if (notes.includes("contractor")) return "contractor";
  if (notes.includes("family")) return "family";
  if (vehicleType === "delivery") return "delivery";
  return "guest";
}

export function mapVehicleTypeToSize(
  vehicleType?: VehicleType
): AllocationRequest["vehicleSize"] {
  switch (vehicleType) {
    case "bike":
      return "compact";
    case "delivery":
      return "large";
    case "taxi":
      return "standard";
    default:
      return "standard";
  }
}

function toSlotStatus(status: EngineBayStatus): SlotStatus {
  return status;
}

function toTwinStatus(status: EngineBayStatus): TwinSlotStatus {
  if (status === "blocked" || status === "maintenance") return "reserved";
  return status;
}

function toVehicleType(bay: ParkingBay): VehicleType | undefined {
  if (!bay.visitorCategory && !bay.vehiclePlate) return undefined;
  if (bay.visitorCategory === "delivery") return "delivery";
  if (bay.vehicleSize === "compact") return "bike";
  return "car";
}

function qrStatusFor(bay: ParkingBay): PassStatus | undefined {
  if (bay.status === "reserved") return "pending";
  if (bay.status === "overstay") return "expired";
  if (bay.status === "occupied") return "approved";
  if (bay.status === "blocked" || bay.status === "maintenance") return "revoked";
  return undefined;
}

export function toAdminParkingSlot(bay: ParkingBay): AdminParkingSlot {
  return {
    id: bay.id,
    label: bay.label,
    status: toSlotStatus(bay.status),
    vehiclePlate: bay.vehiclePlate,
    visitorName: bay.visitorName,
    residentName: bay.residentName,
    arrivalTime: bay.arrivalTime,
    expectedExit: bay.expectedExit,
  };
}

export function toParkingSlot(bay: ParkingBay): ParkingSlot {
  return {
    id: bay.id,
    label: bay.label,
    zone: bay.zone,
    status: toSlotStatus(bay.status),
    vehiclePlate: bay.vehiclePlate,
  };
}

export function toTwinParkingSlot(bay: ParkingBay): TwinParkingSlot {
  return {
    id: bay.id,
    label: bay.label,
    status: toTwinStatus(bay.status),
    vehicleType: toVehicleType(bay),
    vehiclePlate: bay.vehiclePlate,
    visitorName:
      bay.status === "blocked"
        ? "Blocked"
        : bay.status === "maintenance"
          ? "Maintenance"
          : bay.visitorName,
    residentName: bay.residentName,
    apartment: bay.apartment,
    arrivalTime: bay.arrivalTime,
    expectedExit: bay.expectedExit,
    qrStatus: qrStatusFor(bay),
    passId: bay.passId,
    timeline: bay.visitorName
      ? [
          {
            id: `${bay.id}_tl_1`,
            time: "Assigned",
            title: "Bay assigned by allocation engine",
            description: `${bay.label} · ${bay.zone} zone`,
          },
        ]
      : undefined,
  };
}

export function listAdminSlots(): AdminParkingSlot[] {
  return parkingEngine.getBays().map(toAdminParkingSlot);
}

export function listTwinSlots(): TwinParkingSlot[] {
  return parkingEngine.getBays().map(toTwinParkingSlot);
}

export function listParkingSlots(): ParkingSlot[] {
  return parkingEngine.getBays().map(toParkingSlot);
}

export function occupancyToAdminBreakdown() {
  const o = parkingEngine.getOccupancy();
  return {
    occupied: o.occupied + o.overstay,
    reserved: o.reserved,
    available: o.available,
    total: o.total,
  };
}

export function analyticsToAdminStats(analytics: ParkingAnalytics) {
  return {
    todayVisitors: analytics.occupiedCount + analytics.reservedCount + 12,
    visitorsInside: analytics.occupiedCount + analytics.overstayCount,
    occupancyRate: analytics.occupancyPercent,
    averageVisitHours: analytics.averageStayHours,
    peakOccupancy: analytics.peakUtilizationPercent,
    overstays: analytics.overstayCount,
  };
}

export function twinMetricsFromEngine(
  incoming: number,
  outgoing: number
): TwinMetrics {
  const a = parkingEngine.getAnalytics();
  return {
    available: a.availableCount,
    reserved: a.reservedCount,
    occupied: a.occupiedCount,
    overstays: a.overstayCount,
    incoming,
    outgoing,
  };
}

export function simulationToActivity(
  event: NonNullable<ReturnType<typeof parkingEngine.simulate>>
): TwinActivityItem {
  const typeMap: Record<string, TwinActivityType> = {
    vehicle_enter: "occupied",
    vehicle_exit: "exited",
    reservation_expire: "expired",
    parking_released: "released",
    visitor_overstay: "expired",
    bay_unavailable: "reserved",
  };

  return {
    id: `eng_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: typeMap[event.type] ?? "occupied",
    title: event.bayLabel
      ? event.type === "vehicle_enter"
        ? `${event.bayLabel} occupied.`
        : event.type === "vehicle_exit" || event.type === "parking_released"
          ? `${event.bayLabel} released.`
          : event.message
      : event.message,
    description: event.message,
    timestamp: event.timestamp,
    slotLabel: event.bayLabel,
  };
}

export function getEngineCommunity(): string {
  return ENGINE_COMMUNITY;
}

/** Build a reservation request for resident pass creation. */
export function buildReserveRequest(input: {
  visitorId: string;
  visitorName: string;
  vehiclePlate: string;
  vehicleType?: VehicleType;
  notes?: string;
  accessible?: boolean;
  residentName: string;
  apartment: string;
  passId: string;
  durationHours: number;
  expectedArrival: string;
  expectedExit: string;
}): AllocationRequest {
  return {
    visitorId: input.visitorId,
    visitorName: input.visitorName,
    visitorCategory: mapVehicleTypeToCategory(input.vehicleType, {
      notes: input.notes,
      accessible: input.accessible,
    }),
    vehiclePlate: input.vehiclePlate,
    vehicleSize: mapVehicleTypeToSize(input.vehicleType),
    accessible: input.accessible,
    residentName: input.residentName,
    apartment: input.apartment,
    passId: input.passId,
    durationHours: input.durationHours,
    expectedArrival: input.expectedArrival,
    expectedExit: input.expectedExit,
  };
}

/**
 * Security entry helper — reuse an existing bay for the same plate/visitor,
 * otherwise allocate a new one through the engine.
 */
export function resolveEntryAllocation(
  request: AllocationRequest
): AllocationOutcome {
  const plate = normalizePlate(request.vehiclePlate);
  const existingBay = parkingEngine.getBays().find(
    (bay) =>
      bay.vehiclePlate != null &&
      normalizePlate(bay.vehiclePlate) === plate &&
      (bay.status === "occupied" ||
        bay.status === "reserved" ||
        bay.status === "overstay")
  );

  if (existingBay) {
    if (existingBay.status === "reserved") {
      return parkingEngine.allocate(request);
    }
    return {
      ok: true,
      bay: existingBay,
      assignmentId: existingBay.assignmentId ?? "",
    };
  }

  const byVisitor = parkingEngine.getBays().find(
    (bay) =>
      bay.visitorId === request.visitorId &&
      (bay.status === "occupied" ||
        bay.status === "reserved" ||
        bay.status === "overstay")
  );
  if (byVisitor) {
    if (byVisitor.status === "reserved") {
      return parkingEngine.allocate(request);
    }
    return {
      ok: true,
      bay: byVisitor,
      assignmentId: byVisitor.assignmentId ?? "",
    };
  }

  return parkingEngine.allocate(request);
}
