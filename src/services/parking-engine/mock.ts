import { TOTAL_BAYS } from "./constants";
import type {
  ParkingAssignment,
  ParkingBay,
  ParkingZone,
  VehicleSize,
  VisitorCategory,
} from "./types";

interface BaySeed {
  zone: ParkingZone;
  floor: number;
  distanceFromGate: number;
  vehicleSize: VehicleSize;
  reservedBay: boolean;
  accessible: boolean;
}

/** Deterministic bay layout — P01 nearest gate through P30. */
const BAY_LAYOUT: BaySeed[] = [
  { zone: "gate", floor: 1, distanceFromGate: 8, vehicleSize: "standard", reservedBay: false, accessible: true },
  { zone: "gate", floor: 1, distanceFromGate: 12, vehicleSize: "standard", reservedBay: false, accessible: false },
  { zone: "gate", floor: 1, distanceFromGate: 16, vehicleSize: "large", reservedBay: false, accessible: true },
  { zone: "accessible", floor: 1, distanceFromGate: 18, vehicleSize: "standard", reservedBay: false, accessible: true },
  { zone: "accessible", floor: 1, distanceFromGate: 22, vehicleSize: "large", reservedBay: false, accessible: true },
  { zone: "delivery", floor: 1, distanceFromGate: 25, vehicleSize: "large", reservedBay: false, accessible: false },
  { zone: "delivery", floor: 1, distanceFromGate: 28, vehicleSize: "oversized", reservedBay: false, accessible: false },
  { zone: "delivery", floor: 1, distanceFromGate: 32, vehicleSize: "large", reservedBay: false, accessible: false },
  { zone: "premium", floor: 1, distanceFromGate: 35, vehicleSize: "standard", reservedBay: true, accessible: false },
  { zone: "premium", floor: 1, distanceFromGate: 38, vehicleSize: "standard", reservedBay: true, accessible: true },
  { zone: "premium", floor: 1, distanceFromGate: 42, vehicleSize: "large", reservedBay: true, accessible: false },
  { zone: "standard", floor: 1, distanceFromGate: 48, vehicleSize: "compact", reservedBay: false, accessible: false },
  { zone: "standard", floor: 1, distanceFromGate: 52, vehicleSize: "standard", reservedBay: false, accessible: false },
  { zone: "standard", floor: 1, distanceFromGate: 56, vehicleSize: "standard", reservedBay: false, accessible: false },
  { zone: "standard", floor: 1, distanceFromGate: 60, vehicleSize: "large", reservedBay: false, accessible: false },
  { zone: "standard", floor: 2, distanceFromGate: 68, vehicleSize: "compact", reservedBay: false, accessible: false },
  { zone: "standard", floor: 2, distanceFromGate: 72, vehicleSize: "standard", reservedBay: false, accessible: false },
  { zone: "standard", floor: 2, distanceFromGate: 76, vehicleSize: "standard", reservedBay: false, accessible: true },
  { zone: "standard", floor: 2, distanceFromGate: 80, vehicleSize: "large", reservedBay: false, accessible: false },
  { zone: "standard", floor: 2, distanceFromGate: 84, vehicleSize: "standard", reservedBay: false, accessible: false },
  { zone: "standard", floor: 2, distanceFromGate: 88, vehicleSize: "compact", reservedBay: false, accessible: false },
  { zone: "longstay", floor: 2, distanceFromGate: 95, vehicleSize: "standard", reservedBay: false, accessible: false },
  { zone: "longstay", floor: 2, distanceFromGate: 100, vehicleSize: "large", reservedBay: false, accessible: false },
  { zone: "longstay", floor: 2, distanceFromGate: 105, vehicleSize: "standard", reservedBay: false, accessible: false },
  { zone: "longstay", floor: 2, distanceFromGate: 110, vehicleSize: "oversized", reservedBay: false, accessible: false },
  { zone: "longstay", floor: 3, distanceFromGate: 120, vehicleSize: "standard", reservedBay: false, accessible: false },
  { zone: "longstay", floor: 3, distanceFromGate: 125, vehicleSize: "large", reservedBay: false, accessible: false },
  { zone: "standard", floor: 3, distanceFromGate: 130, vehicleSize: "standard", reservedBay: false, accessible: false },
  { zone: "standard", floor: 3, distanceFromGate: 135, vehicleSize: "compact", reservedBay: false, accessible: false },
  { zone: "standard", floor: 3, distanceFromGate: 140, vehicleSize: "standard", reservedBay: false, accessible: false },
];

interface OccupancySeed {
  index: number;
  status: "occupied" | "reserved" | "overstay" | "blocked" | "maintenance";
  visitorName: string;
  visitorId: string;
  visitorCategory: VisitorCategory;
  vehiclePlate: string;
  residentName: string;
  apartment: string;
  hoursAgoArrival: number;
  durationHours: number;
}

const OCCUPANCY_SEED: OccupancySeed[] = [
  { index: 0, status: "occupied", visitorName: "Emily Brooks", visitorId: "vis_emily", visitorCategory: "guest", vehiclePlate: "TX-8PL21", residentName: "Darshan", apartment: "B-204", hoursAgoArrival: 4, durationHours: 6 },
  { index: 1, status: "occupied", visitorName: "Noah Patel", visitorId: "vis_noah", visitorCategory: "family", vehiclePlate: "TX-1VK03", residentName: "Jordan Lee", apartment: "A-118", hoursAgoArrival: 3, durationHours: 5 },
  { index: 3, status: "occupied", visitorName: "Amelia Chen", visitorId: "vis_amelia", visitorCategory: "guest", vehiclePlate: "TX-AMC01", residentName: "Priya Nair", apartment: "Office", hoursAgoArrival: 2, durationHours: 4 },
  { index: 5, status: "occupied", visitorName: "Courier Express", visitorId: "vis_courier", visitorCategory: "delivery", vehiclePlate: "TX-DLV88", residentName: "Sofia Alvarez", apartment: "C-301", hoursAgoArrival: 1, durationHours: 2 },
  { index: 8, status: "reserved", visitorName: "Liam Ortega", visitorId: "vis_liam", visitorCategory: "vip", vehiclePlate: "TX-6YD42", residentName: "Darshan", apartment: "B-204", hoursAgoArrival: 0, durationHours: 4 },
  { index: 9, status: "reserved", visitorName: "Harper Kim", visitorId: "vis_harper", visitorCategory: "vip", vehiclePlate: "TX-2FJ19", residentName: "Jordan Lee", apartment: "A-118", hoursAgoArrival: 0, durationHours: 3 },
  { index: 12, status: "occupied", visitorName: "Alex Rivera", visitorId: "vis_alex", visitorCategory: "guest", vehiclePlate: "TX-4DEMO1", residentName: "Sofia Alvarez", apartment: "C-301", hoursAgoArrival: 5, durationHours: 4 },
  { index: 14, status: "overstay", visitorName: "Sofia Guest", visitorId: "vis_sofia_g", visitorCategory: "guest", vehiclePlate: "TX-9GUEST", residentName: "Sam Okonkwo", apartment: "B-110", hoursAgoArrival: 8, durationHours: 3 },
  { index: 16, status: "occupied", visitorName: "Omar Hassan", visitorId: "vis_omar", visitorCategory: "family", vehiclePlate: "TX-3OMAR", residentName: "Darshan", apartment: "B-204", hoursAgoArrival: 2, durationHours: 5 },
  { index: 21, status: "occupied", visitorName: "Kenji Sato", visitorId: "vis_kenji", visitorCategory: "contractor", vehiclePlate: "TX-7KEN", residentName: "Sam Okonkwo", apartment: "B-110", hoursAgoArrival: 6, durationHours: 10 },
  { index: 22, status: "occupied", visitorName: "Maya Singh", visitorId: "vis_maya", visitorCategory: "contractor", vehiclePlate: "TX-2HN77", residentName: "Priya Nair", apartment: "Office", hoursAgoArrival: 4, durationHours: 8 },
  { index: 28, status: "blocked", visitorName: "", visitorId: "", visitorCategory: "guest", vehiclePlate: "", residentName: "", apartment: "", hoursAgoArrival: 0, durationHours: 0 },
  { index: 29, status: "maintenance", visitorName: "", visitorId: "", visitorCategory: "guest", vehiclePlate: "", residentName: "", apartment: "", hoursAgoArrival: 0, durationHours: 0 },
];

function hoursAgoIso(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

function hoursFromIso(from: string, hours: number): string {
  return new Date(new Date(from).getTime() + hours * 3_600_000).toISOString();
}

export function createInitialInventory(): {
  bays: ParkingBay[];
  assignments: ParkingAssignment[];
} {
  if (BAY_LAYOUT.length !== TOTAL_BAYS) {
    throw new Error(`Expected ${TOTAL_BAYS} bay seeds, got ${BAY_LAYOUT.length}`);
  }

  const now = new Date().toISOString();
  const bays: ParkingBay[] = BAY_LAYOUT.map((seed, index) => {
    const label = `P${String(index + 1).padStart(2, "0")}`;
    return {
      id: `bay_${label.toLowerCase()}`,
      label,
      zone: seed.zone,
      floor: seed.floor,
      distanceFromGate: seed.distanceFromGate,
      vehicleSize: seed.vehicleSize,
      reservedBay: seed.reservedBay,
      accessible: seed.accessible,
      status: "available",
      lastUpdated: now,
    };
  });

  const assignments: ParkingAssignment[] = [];

  for (const seed of OCCUPANCY_SEED) {
    const bay = bays[seed.index];
    if (!bay) continue;

    bay.status = seed.status;
    bay.lastUpdated = now;

    if (
      seed.status === "blocked" ||
      seed.status === "maintenance" ||
      !seed.visitorId
    ) {
      continue;
    }

    const arrival = hoursAgoIso(Math.max(seed.hoursAgoArrival, 0.1));
    const expectedExit = hoursFromIso(arrival, seed.durationHours);
    const assignmentId = `asn_${bay.label.toLowerCase()}`;

    bay.vehiclePlate = seed.vehiclePlate;
    bay.visitorId = seed.visitorId;
    bay.visitorName = seed.visitorName;
    bay.visitorCategory = seed.visitorCategory;
    bay.residentName = seed.residentName;
    bay.apartment = seed.apartment;
    bay.assignmentId = assignmentId;
    bay.arrivalTime = arrival;
    bay.expectedExit = expectedExit;
    bay.passId = `pass_${seed.visitorId}`;

    assignments.push({
      id: assignmentId,
      bayId: bay.id,
      bayLabel: bay.label,
      visitorId: seed.visitorId,
      visitorName: seed.visitorName,
      visitorCategory: seed.visitorCategory,
      vehiclePlate: seed.vehiclePlate,
      passId: bay.passId,
      residentName: seed.residentName,
      apartment: seed.apartment,
      status:
        seed.status === "reserved"
          ? "reserved"
          : seed.status === "overstay"
            ? "overstay"
            : "active",
      reservedAt: seed.status === "reserved" ? now : undefined,
      allocatedAt: seed.status !== "reserved" ? arrival : undefined,
      expectedExit,
    });
  }

  return { bays, assignments };
}

export const SIM_VISITORS = [
  {
    visitorName: "Riley Quinn",
    visitorId: "vis_riley",
    visitorCategory: "guest" as VisitorCategory,
    vehiclePlate: "TX-RQ991",
    vehicleSize: "standard" as VehicleSize,
    accessible: false,
    residentName: "Darshan",
    apartment: "B-204",
  },
  {
    visitorName: "Samira Noor",
    visitorId: "vis_samira",
    visitorCategory: "family" as VisitorCategory,
    vehiclePlate: "TX-SN442",
    vehicleSize: "standard" as VehicleSize,
    accessible: false,
    residentName: "Jordan Lee",
    apartment: "A-118",
  },
  {
    visitorName: "Delivery Hub",
    visitorId: "vis_dhub",
    visitorCategory: "delivery" as VisitorCategory,
    vehiclePlate: "TX-DH210",
    vehicleSize: "large" as VehicleSize,
    accessible: false,
    residentName: "Sofia Alvarez",
    apartment: "C-301",
  },
  {
    visitorName: "Chris Vale",
    visitorId: "vis_chris",
    visitorCategory: "contractor" as VisitorCategory,
    vehiclePlate: "TX-CV088",
    vehicleSize: "compact" as VehicleSize,
    accessible: false,
    residentName: "Sam Okonkwo",
    apartment: "B-110",
  },
  {
    visitorName: "Ava Sterling",
    visitorId: "vis_ava",
    visitorCategory: "vip" as VisitorCategory,
    vehiclePlate: "TX-AVA01",
    vehicleSize: "standard" as VehicleSize,
    accessible: false,
    residentName: "Priya Nair",
    apartment: "Office",
  },
  {
    visitorName: "Emergency Unit",
    visitorId: "vis_emerg",
    visitorCategory: "emergency" as VisitorCategory,
    vehiclePlate: "TX-EM911",
    vehicleSize: "large" as VehicleSize,
    accessible: true,
    residentName: "Gate Desk",
    apartment: "Lobby",
  },
];
