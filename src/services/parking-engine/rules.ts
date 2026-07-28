import {
  CATEGORY_ZONE_PREFERENCE,
  VEHICLE_SIZE_RANK,
} from "./constants";
import type {
  AllocationFailure,
  AllocationRequest,
  ParkingAssignment,
  ParkingBay,
  VehicleSize,
} from "./types";

export function normalizePlate(plate: string): string {
  return plate.trim().toUpperCase().replace(/\s+/g, "");
}

export function isBayAllocatable(bay: ParkingBay): boolean {
  return bay.status === "available";
}

export function bayFitsVehicle(
  bay: ParkingBay,
  vehicleSize: VehicleSize = "standard"
): boolean {
  return VEHICLE_SIZE_RANK[bay.vehicleSize] >= VEHICLE_SIZE_RANK[vehicleSize];
}

/**
 * Score candidates — lower is better.
 * Encodes priority rules: emergency→nearest gate, accessible→accessible bay,
 * delivery→delivery zone, VIP→premium, guest→nearest standard, contractor→longstay.
 */
export function scoreBay(bay: ParkingBay, request: AllocationRequest): number {
  const prefs = CATEGORY_ZONE_PREFERENCE[request.visitorCategory];
  const zoneIndex = prefs.indexOf(bay.zone);
  const zoneScore = zoneIndex === -1 ? 80 + bay.distanceFromGate : zoneIndex * 20;

  let score = zoneScore + bay.distanceFromGate;

  if (request.accessible) {
    score += bay.accessible ? -40 : 120;
  }

  if (request.visitorCategory === "emergency") {
    score = bay.distanceFromGate * 2 + (bay.accessible ? -5 : 0);
  }

  if (request.visitorCategory === "delivery" && bay.zone === "delivery") {
    score -= 30;
  }

  if (request.visitorCategory === "vip" && (bay.zone === "premium" || bay.reservedBay)) {
    score -= 35;
  }

  if (request.visitorCategory === "contractor" && bay.zone === "longstay") {
    score -= 40;
  }

  if (request.visitorCategory === "guest" || request.visitorCategory === "family") {
    if (bay.zone === "standard" || bay.zone === "gate") {
      score -= 10;
    }
  }

  if (!bayFitsVehicle(bay, request.vehicleSize ?? "standard")) {
    score += 200;
  }

  return score;
}

export function filterEligibleBays(
  bays: readonly ParkingBay[],
  request: AllocationRequest
): ParkingBay[] {
  return bays.filter((bay) => {
    if (!isBayAllocatable(bay)) return false;
    if (!bayFitsVehicle(bay, request.vehicleSize ?? "standard")) return false;
    if (request.accessible && !bay.accessible) return false;
    if (
      request.visitorCategory === "vip" &&
      bay.zone !== "premium" &&
      !bay.reservedBay
    ) {
      // VIP prefers premium but may fall through if none open
      return true;
    }
    return true;
  });
}

export function selectBestBay(
  bays: readonly ParkingBay[],
  request: AllocationRequest
): ParkingBay | null {
  const eligible = filterEligibleBays(bays, request);
  if (eligible.length === 0) {
    // Accessible-only may be too strict — soften if needed for emergency
    if (request.accessible && request.visitorCategory === "emergency") {
      const near = bays
        .filter((bay) => isBayAllocatable(bay))
        .sort((a, b) => a.distanceFromGate - b.distanceFromGate);
      return near[0] ?? null;
    }

    // VIP soft fallback to any available
    if (request.visitorCategory === "vip") {
      const open = bays
        .filter((bay) => isBayAllocatable(bay))
        .sort((a, b) => scoreBay(a, request) - scoreBay(b, request));
      return open[0] ?? null;
    }

    return null;
  }

  return [...eligible].sort(
    (a, b) => scoreBay(a, request) - scoreBay(b, request)
  )[0] ?? null;
}

export function validateAllocationRequest(
  request: AllocationRequest,
  assignments: readonly ParkingAssignment[],
  bays: readonly ParkingBay[]
): AllocationFailure | null {
  const plate = normalizePlate(request.vehiclePlate);
  const visitorId = request.visitorId.trim();

  if (!visitorId) {
    return {
      ok: false,
      code: "VALIDATION",
      message: "Visitor ID is required.",
    };
  }

  if (!plate) {
    return {
      ok: false,
      code: "VALIDATION",
      message: "Vehicle number is required.",
    };
  }

  const activeStatuses = new Set(["reserved", "active", "overstay"]);

  const duplicateVehicle = assignments.some(
    (a) =>
      activeStatuses.has(a.status) &&
      normalizePlate(a.vehiclePlate) === plate
  );
  if (duplicateVehicle) {
    return {
      ok: false,
      code: "DUPLICATE_VEHICLE",
      message: `Vehicle ${plate} already has an active parking assignment.`,
    };
  }

  const duplicateVisitor = assignments.some(
    (a) => activeStatuses.has(a.status) && a.visitorId === visitorId
  );
  if (duplicateVisitor) {
    return {
      ok: false,
      code: "DUPLICATE_VISITOR",
      message: `Visitor ${visitorId} already has an active parking assignment.`,
    };
  }

  if (request.passId) {
    const activePass = assignments.some(
      (a) =>
        activeStatuses.has(a.status) &&
        a.passId === request.passId
    );
    if (activePass) {
      return {
        ok: false,
        code: "ACTIVE_PASS_EXISTS",
        message: "This visitor pass already has an active bay assignment.",
      };
    }
  }

  // Expire stale reservations before counting capacity
  const now = Date.now();
  const hasStaleReservation = bays.some(
    (bay) =>
      bay.status === "reserved" &&
      bay.expectedExit != null &&
      new Date(bay.expectedExit).getTime() < now
  );
  if (hasStaleReservation) {
    // Validation layer flags; allocator clears them before allocate
  }

  return null;
}

export function assertBayAssignable(
  bay: ParkingBay | undefined
): AllocationFailure | null {
  if (!bay) {
    return { ok: false, code: "NOT_FOUND", message: "Parking bay not found." };
  }

  if (bay.status === "occupied" || bay.status === "overstay") {
    return {
      ok: false,
      code: "BAY_UNAVAILABLE",
      message: `${bay.label} is occupied.`,
    };
  }

  if (bay.status === "maintenance") {
    return {
      ok: false,
      code: "BAY_UNAVAILABLE",
      message: `${bay.label} is under maintenance.`,
    };
  }

  if (bay.status === "blocked") {
    return {
      ok: false,
      code: "BAY_UNAVAILABLE",
      message: `${bay.label} is blocked.`,
    };
  }

  if (bay.status === "reserved") {
    const expired =
      bay.expectedExit != null &&
      new Date(bay.expectedExit).getTime() < Date.now();
    if (!expired) {
      return {
        ok: false,
        code: "BAY_UNAVAILABLE",
        message: `${bay.label} is reserved.`,
      };
    }
  }

  return null;
}
