import {
  CATEGORY_DURATION_HINT_HOURS,
} from "./constants";
import { createInitialInventory, SIM_VISITORS } from "./mock";
import {
  assertBayAssignable,
  normalizePlate,
  selectBestBay,
  validateAllocationRequest,
} from "./rules";
import type {
  AllocationOutcome,
  AllocationRequest,
  AllocationStrategy,
  OccupancySnapshot,
  ParkingAnalytics,
  ParkingAssignment,
  ParkingBay,
  ParkingEngineAPI,
  ParkingZone,
  SimulationEvent,
  ZoneUtilization,
} from "./types";

/** Deterministic rule-based strategy — production default. */
export class RuleBasedStrategy implements AllocationStrategy {
  readonly name = "rule-based";

  findBestSlot(
    request: AllocationRequest,
    bays: readonly ParkingBay[]
  ): ParkingBay | null {
    return selectBestBay(bays, request);
  }
}

/**
 * Future AI strategy placeholder.
 * Do not implement model inference here — swap in when ready.
 */
export class FutureAIStrategy implements AllocationStrategy {
  readonly name = "future-ai";

  findBestSlot(
    _request: AllocationRequest,
    _bays: readonly ParkingBay[]
  ): ParkingBay | null {
    throw new Error(
      "FutureAIStrategy is not implemented. Use RuleBasedStrategy until AI allocation ships."
    );
  }
}

function clearBayOccupant(bay: ParkingBay): void {
  delete bay.vehiclePlate;
  delete bay.visitorId;
  delete bay.visitorName;
  delete bay.visitorCategory;
  delete bay.residentName;
  delete bay.apartment;
  delete bay.assignmentId;
  delete bay.arrivalTime;
  delete bay.expectedExit;
  delete bay.passId;
}

function cloneBay(bay: ParkingBay): ParkingBay {
  return { ...bay };
}

export class ParkingAllocator implements ParkingEngineAPI {
  private bays: ParkingBay[];
  private assignments: ParkingAssignment[];
  private strategy: AllocationStrategy;
  private peakUtilizationPercent: number;
  private staySamplesHours: number[];
  private simCursor = 0;

  constructor(strategy: AllocationStrategy = new RuleBasedStrategy()) {
    const inventory = createInitialInventory();
    this.bays = inventory.bays;
    this.assignments = inventory.assignments;
    this.strategy = strategy;
    this.peakUtilizationPercent = this.getOccupancy().occupancyPercent;
    this.staySamplesHours = inventory.assignments
      .filter((a) => a.allocatedAt && a.expectedExit)
      .map((a) => {
        const start = new Date(a.allocatedAt!).getTime();
        const end = new Date(a.expectedExit!).getTime();
        return Math.max(0.5, (end - start) / 3_600_000);
      });
  }

  setStrategy(strategy: AllocationStrategy): void {
    this.strategy = strategy;
  }

  getBays(): ParkingBay[] {
    return this.bays.map(cloneBay);
  }

  getAssignments(): ParkingAssignment[] {
    return this.assignments.map((a) => ({ ...a }));
  }

  findBestSlot(request: AllocationRequest): ParkingBay | null {
    this.expireStaleReservations();
    const bay = this.strategy.findBestSlot(request, this.bays);
    return bay ? cloneBay(bay) : null;
  }

  getAvailableSlots(filters?: {
    zone?: ParkingZone;
    accessible?: boolean;
  }): ParkingBay[] {
    this.expireStaleReservations();
    return this.bays
      .filter((bay) => {
        if (bay.status !== "available") return false;
        if (filters?.zone && bay.zone !== filters.zone) return false;
        if (filters?.accessible && !bay.accessible) return false;
        return true;
      })
      .map(cloneBay);
  }

  getOccupancy(): OccupancySnapshot {
    const total = this.bays.length;
    const available = this.countStatus("available");
    const reserved = this.countStatus("reserved");
    const occupied = this.countStatus("occupied");
    const blocked = this.countStatus("blocked");
    const maintenance = this.countStatus("maintenance");
    const overstay = this.countStatus("overstay");
    const busy = occupied + reserved + overstay;
    const occupancyPercent = Math.round((busy / Math.max(total, 1)) * 100);

    return {
      total,
      available,
      reserved,
      occupied,
      blocked,
      maintenance,
      overstay,
      occupancyPercent,
    };
  }

  getAnalytics(): ParkingAnalytics {
    const occupancy = this.getOccupancy();
    const avg =
      this.staySamplesHours.length === 0
        ? 0
        : this.staySamplesHours.reduce((a, b) => a + b, 0) /
          this.staySamplesHours.length;

    this.peakUtilizationPercent = Math.max(
      this.peakUtilizationPercent,
      occupancy.occupancyPercent
    );

    const zones = Array.from(
      new Set(this.bays.map((bay) => bay.zone))
    ) as ParkingZone[];

    const zoneUtilization: ZoneUtilization[] = zones.map((zone) => {
      const zoneBays = this.bays.filter((bay) => bay.zone === zone);
      const occupied = zoneBays.filter(
        (bay) =>
          bay.status === "occupied" ||
          bay.status === "overstay" ||
          bay.status === "reserved"
      ).length;
      const reserved = zoneBays.filter((bay) => bay.status === "reserved").length;
      const available = zoneBays.filter((bay) => bay.status === "available").length;
      return {
        zone,
        total: zoneBays.length,
        occupied,
        reserved,
        available,
        utilizationPercent: Math.round(
          (occupied / Math.max(zoneBays.length, 1)) * 100
        ),
      };
    });

    return {
      occupancyPercent: occupancy.occupancyPercent,
      averageStayHours: Number(avg.toFixed(1)),
      peakUtilizationPercent: this.peakUtilizationPercent,
      zoneUtilization,
      availableCount: occupancy.available,
      reservedCount: occupancy.reserved,
      occupiedCount: occupancy.occupied,
      overstayCount: occupancy.overstay,
    };
  }

  reserve(request: AllocationRequest): AllocationOutcome {
    return this.commit(request, "reserved");
  }

  allocate(request: AllocationRequest): AllocationOutcome {
    // Prefer converting an existing reservation for this visitor/pass
    const existing = this.assignments.find(
      (a) =>
        a.status === "reserved" &&
        (a.visitorId === request.visitorId ||
          (request.passId != null && a.passId === request.passId) ||
          normalizePlate(a.vehiclePlate) === normalizePlate(request.vehiclePlate))
    );

    if (existing) {
      const bay = this.findBay(existing.bayId);
      if (bay && bay.status === "reserved") {
        return this.activateReservation(bay, request);
      }
    }

    return this.commit(request, "occupied");
  }

  release(bayIdOrLabel: string): AllocationOutcome {
    const bay = this.findBay(bayIdOrLabel);
    if (!bay) {
      return { ok: false, code: "NOT_FOUND", message: "Parking bay not found." };
    }

    if (bay.status === "available") {
      return {
        ok: false,
        code: "VALIDATION",
        message: `${bay.label} is already available.`,
      };
    }

    if (bay.status === "blocked" || bay.status === "maintenance") {
      return {
        ok: false,
        code: "BAY_UNAVAILABLE",
        message: `${bay.label} cannot be released from ${bay.status}.`,
      };
    }

    if (bay.arrivalTime) {
      const hours =
        (Date.now() - new Date(bay.arrivalTime).getTime()) / 3_600_000;
      this.staySamplesHours.push(Math.max(0.25, hours));
    }

    const assignmentId = bay.assignmentId;
    const now = new Date().toISOString();
    if (assignmentId) {
      this.assignments = this.assignments.map((a) =>
        a.id === assignmentId
          ? { ...a, status: "released", releasedAt: now }
          : a
      );
    }

    const snapshot = cloneBay(bay);
    bay.status = "available";
    bay.lastUpdated = now;
    clearBayOccupant(bay);

    return { ok: true, bay: snapshot, assignmentId: assignmentId ?? "" };
  }

  cancel(bayIdOrLabel: string): AllocationOutcome {
    const bay = this.findBay(bayIdOrLabel);
    if (!bay) {
      return { ok: false, code: "NOT_FOUND", message: "Parking bay not found." };
    }

    if (bay.status !== "reserved") {
      return {
        ok: false,
        code: "VALIDATION",
        message: `${bay.label} has no active reservation to cancel.`,
      };
    }

    const assignmentId = bay.assignmentId;
    const now = new Date().toISOString();
    if (assignmentId) {
      this.assignments = this.assignments.map((a) =>
        a.id === assignmentId
          ? { ...a, status: "cancelled", releasedAt: now }
          : a
      );
    }

    const snapshot = cloneBay(bay);
    bay.status = "available";
    bay.lastUpdated = now;
    clearBayOccupant(bay);

    return { ok: true, bay: snapshot, assignmentId: assignmentId ?? "" };
  }

  markOverstay(bayIdOrLabel: string): AllocationOutcome {
    const bay = this.findBay(bayIdOrLabel);
    if (!bay) {
      return { ok: false, code: "NOT_FOUND", message: "Parking bay not found." };
    }

    if (bay.status !== "occupied" && bay.status !== "overstay") {
      return {
        ok: false,
        code: "VALIDATION",
        message: `${bay.label} must be occupied to mark overstay.`,
      };
    }

    bay.status = "overstay";
    bay.lastUpdated = new Date().toISOString();
    if (bay.assignmentId) {
      this.assignments = this.assignments.map((a) =>
        a.id === bay.assignmentId ? { ...a, status: "overstay" } : a
      );
    }

    return {
      ok: true,
      bay: cloneBay(bay),
      assignmentId: bay.assignmentId ?? "",
    };
  }

  /** Generate one realistic mock event against live inventory. */
  simulate(): SimulationEvent | null {
    this.expireStaleReservations();
    const roll = this.simCursor++ % 6;

    if (roll === 0) {
      const guest = SIM_VISITORS[this.simCursor % SIM_VISITORS.length]!;
      const plate = `${guest.vehiclePlate}-${this.simCursor}`;
      const result = this.allocate({
        ...guest,
        vehiclePlate: plate,
        visitorId: `${guest.visitorId}_${this.simCursor}`,
        passId: `pass_sim_${this.simCursor}`,
        durationHours:
          CATEGORY_DURATION_HINT_HOURS[guest.visitorCategory],
      });
      if (!result.ok) return this.simulateFallbackExit();
      return {
        type: "vehicle_enter",
        timestamp: new Date().toISOString(),
        bayId: result.bay.id,
        bayLabel: result.bay.label,
        visitorName: guest.visitorName,
        message: `${result.bay.label} occupied by ${guest.visitorName}.`,
      };
    }

    if (roll === 1) {
      return this.simulateFallbackExit();
    }

    if (roll === 2) {
      const reserved = this.bays.filter((b) => b.status === "reserved");
      const target = reserved[0];
      if (!target) return this.simulateFallbackExit();
      const label = target.label;
      this.cancel(target.id);
      return {
        type: "reservation_expire",
        timestamp: new Date().toISOString(),
        bayId: target.id,
        bayLabel: label,
        message: `Reservation expired on ${label}.`,
      };
    }

    if (roll === 3) {
      return this.simulateFallbackExit();
    }

    if (roll === 4) {
      const occupied = this.bays.filter((b) => b.status === "occupied");
      const target = occupied[this.simCursor % Math.max(occupied.length, 1)];
      if (!target) return null;
      this.markOverstay(target.id);
      return {
        type: "visitor_overstay",
        timestamp: new Date().toISOString(),
        bayId: target.id,
        bayLabel: target.label,
        visitorName: target.visitorName,
        message: `${target.label} overstay — ${target.visitorName ?? "visitor"}.`,
      };
    }

    const available = this.bays.filter((b) => b.status === "available");
    const target = available[available.length - 1];
    if (!target) return null;
    target.status = "maintenance";
    target.lastUpdated = new Date().toISOString();
    return {
      type: "bay_unavailable",
      timestamp: new Date().toISOString(),
      bayId: target.id,
      bayLabel: target.label,
      message: `${target.label} marked unavailable for maintenance.`,
    };
  }

  private simulateFallbackExit(): SimulationEvent | null {
    const busy = this.bays.filter(
      (b) => b.status === "occupied" || b.status === "overstay"
    );
    const target = busy[0];
    if (!target) return null;
    const label = target.label;
    const name = target.visitorName;
    this.release(target.id);
    return {
      type: "vehicle_exit",
      timestamp: new Date().toISOString(),
      bayId: target.id,
      bayLabel: label,
      visitorName: name,
      message: `${label} released${name ? ` — ${name} exited` : ""}.`,
    };
  }

  private commit(
    request: AllocationRequest,
    mode: "reserved" | "occupied"
  ): AllocationOutcome {
    this.expireStaleReservations();

    const validation = validateAllocationRequest(
      request,
      this.assignments,
      this.bays
    );
    if (validation) return validation;

    const best = this.strategy.findBestSlot(request, this.bays);
    if (!best) {
      return {
        ok: false,
        code: "NO_CAPACITY",
        message: "No eligible visitor parking bay is available.",
      };
    }

    const bay = this.findBay(best.id);
    const blocked = assertBayAssignable(bay);
    if (blocked) return blocked;
    if (!bay) {
      return { ok: false, code: "NOT_FOUND", message: "Parking bay not found." };
    }

    const now = new Date().toISOString();
    const duration =
      request.durationHours ??
      CATEGORY_DURATION_HINT_HOURS[request.visitorCategory];
    const arrival =
      mode === "occupied"
        ? (request.expectedArrival ?? now)
        : (request.expectedArrival ?? now);
    const expectedExit =
      request.expectedExit ??
      new Date(new Date(arrival).getTime() + duration * 3_600_000).toISOString();

    const assignmentId = `asn_${Date.now().toString(36)}_${bay.label.toLowerCase()}`;

    bay.status = mode;
    bay.lastUpdated = now;
    bay.vehiclePlate = normalizePlate(request.vehiclePlate);
    bay.visitorId = request.visitorId;
    bay.visitorName = request.visitorName;
    bay.visitorCategory = request.visitorCategory;
    bay.residentName = request.residentName;
    bay.apartment = request.apartment;
    bay.assignmentId = assignmentId;
    bay.arrivalTime = mode === "occupied" ? arrival : undefined;
    bay.expectedExit = expectedExit;
    bay.passId = request.passId;

    this.assignments.unshift({
      id: assignmentId,
      bayId: bay.id,
      bayLabel: bay.label,
      visitorId: request.visitorId,
      visitorName: request.visitorName,
      visitorCategory: request.visitorCategory,
      vehiclePlate: normalizePlate(request.vehiclePlate),
      passId: request.passId,
      residentName: request.residentName,
      apartment: request.apartment,
      status: mode === "reserved" ? "reserved" : "active",
      reservedAt: mode === "reserved" ? now : undefined,
      allocatedAt: mode === "occupied" ? arrival : undefined,
      expectedExit,
    });

    const occupancy = this.getOccupancy();
    this.peakUtilizationPercent = Math.max(
      this.peakUtilizationPercent,
      occupancy.occupancyPercent
    );

    return { ok: true, bay: cloneBay(bay), assignmentId };
  }

  private activateReservation(
    bay: ParkingBay,
    request: AllocationRequest
  ): AllocationOutcome {
    const now = new Date().toISOString();
    bay.status = "occupied";
    bay.lastUpdated = now;
    bay.arrivalTime = now;
    bay.visitorName = request.visitorName || bay.visitorName;
    bay.residentName = request.residentName ?? bay.residentName;
    bay.apartment = request.apartment ?? bay.apartment;

    if (bay.assignmentId) {
      this.assignments = this.assignments.map((a) =>
        a.id === bay.assignmentId
          ? { ...a, status: "active", allocatedAt: now }
          : a
      );
    }

    return {
      ok: true,
      bay: cloneBay(bay),
      assignmentId: bay.assignmentId ?? "",
    };
  }

  private expireStaleReservations(): void {
    const now = Date.now();
    for (const bay of this.bays) {
      if (
        bay.status === "reserved" &&
        bay.expectedExit != null &&
        new Date(bay.expectedExit).getTime() < now
      ) {
        const assignmentId = bay.assignmentId;
        if (assignmentId) {
          this.assignments = this.assignments.map((a) =>
            a.id === assignmentId
              ? {
                  ...a,
                  status: "cancelled",
                  releasedAt: new Date().toISOString(),
                }
              : a
          );
        }
        bay.status = "available";
        bay.lastUpdated = new Date().toISOString();
        clearBayOccupant(bay);
      }
    }
  }

  private findBay(idOrLabel: string): ParkingBay | undefined {
    const key = idOrLabel.trim().toLowerCase();
    return this.bays.find(
      (bay) =>
        bay.id.toLowerCase() === key ||
        bay.label.toLowerCase() === key ||
        bay.id.toLowerCase() === `bay_${key}`
    );
  }

  private countStatus(status: ParkingBay["status"]): number {
    return this.bays.filter((bay) => bay.status === status).length;
  }
}
