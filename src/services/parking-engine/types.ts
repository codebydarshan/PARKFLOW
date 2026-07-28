/**
 * Parking Allocation Engine — domain types.
 * Isolated from UI. Future APIs should consume these contracts.
 */

export type EngineBayStatus =
  | "available"
  | "reserved"
  | "occupied"
  | "blocked"
  | "maintenance"
  | "overstay";

export type VisitorCategory =
  | "guest"
  | "family"
  | "delivery"
  | "contractor"
  | "emergency"
  | "vip";

export type VehicleSize = "compact" | "standard" | "large" | "oversized";

export type ParkingZone =
  | "gate"
  | "delivery"
  | "premium"
  | "standard"
  | "longstay"
  | "accessible";

export interface ParkingBay {
  id: string;
  label: string;
  zone: ParkingZone;
  floor: number;
  distanceFromGate: number;
  vehicleSize: VehicleSize;
  reservedBay: boolean;
  accessible: boolean;
  status: EngineBayStatus;
  lastUpdated: string;
  vehiclePlate?: string;
  visitorId?: string;
  visitorName?: string;
  visitorCategory?: VisitorCategory;
  residentName?: string;
  apartment?: string;
  assignmentId?: string;
  arrivalTime?: string;
  expectedExit?: string;
  passId?: string;
}

export interface AllocationRequest {
  visitorId: string;
  visitorName: string;
  visitorCategory: VisitorCategory;
  vehiclePlate: string;
  vehicleSize?: VehicleSize;
  accessible?: boolean;
  residentName?: string;
  apartment?: string;
  passId?: string;
  durationHours?: number;
  expectedArrival?: string;
  expectedExit?: string;
}

export interface AllocationResult {
  ok: true;
  bay: ParkingBay;
  assignmentId: string;
}

export interface AllocationFailure {
  ok: false;
  code:
    | "NO_CAPACITY"
    | "DUPLICATE_VEHICLE"
    | "DUPLICATE_VISITOR"
    | "ACTIVE_PASS_EXISTS"
    | "BAY_UNAVAILABLE"
    | "VALIDATION"
    | "NOT_FOUND";
  message: string;
}

export type AllocationOutcome = AllocationResult | AllocationFailure;

export interface ParkingAssignment {
  id: string;
  bayId: string;
  bayLabel: string;
  visitorId: string;
  visitorName: string;
  visitorCategory: VisitorCategory;
  vehiclePlate: string;
  passId?: string;
  residentName?: string;
  apartment?: string;
  status: "reserved" | "active" | "released" | "cancelled" | "overstay";
  reservedAt?: string;
  allocatedAt?: string;
  releasedAt?: string;
  expectedExit?: string;
}

export interface OccupancySnapshot {
  total: number;
  available: number;
  reserved: number;
  occupied: number;
  blocked: number;
  maintenance: number;
  overstay: number;
  occupancyPercent: number;
}

export interface ZoneUtilization {
  zone: ParkingZone;
  total: number;
  occupied: number;
  reserved: number;
  available: number;
  utilizationPercent: number;
}

export interface ParkingAnalytics {
  occupancyPercent: number;
  averageStayHours: number;
  peakUtilizationPercent: number;
  zoneUtilization: ZoneUtilization[];
  availableCount: number;
  reservedCount: number;
  occupiedCount: number;
  overstayCount: number;
}

export type SimulationEventType =
  | "vehicle_enter"
  | "vehicle_exit"
  | "reservation_expire"
  | "parking_released"
  | "visitor_overstay"
  | "bay_unavailable";

export interface SimulationEvent {
  type: SimulationEventType;
  timestamp: string;
  bayId?: string;
  bayLabel?: string;
  message: string;
  visitorName?: string;
}

export interface AllocationStrategy {
  readonly name: string;
  findBestSlot(
    request: AllocationRequest,
    bays: readonly ParkingBay[]
  ): ParkingBay | null;
}

export interface ParkingEngineAPI {
  allocate(request: AllocationRequest): AllocationOutcome;
  release(bayIdOrLabel: string): AllocationOutcome;
  reserve(request: AllocationRequest): AllocationOutcome;
  cancel(bayIdOrLabel: string): AllocationOutcome;
  markOverstay(bayIdOrLabel: string): AllocationOutcome;
  findBestSlot(request: AllocationRequest): ParkingBay | null;
  getAvailableSlots(filters?: {
    zone?: ParkingZone;
    accessible?: boolean;
  }): ParkingBay[];
  getOccupancy(): OccupancySnapshot;
  getAnalytics(): ParkingAnalytics;
  getBays(): ParkingBay[];
  getAssignments(): ParkingAssignment[];
  simulate(): SimulationEvent | null;
  setStrategy(strategy: AllocationStrategy): void;
}
