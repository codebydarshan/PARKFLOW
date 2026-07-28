import {
  getEngineCommunity,
  listTwinSlots,
  parkingEngine,
  simulationToActivity,
  twinMetricsFromEngine,
} from "@/services/parking-engine";
import type { TwinActivityItem, TwinMetrics, TwinParkingSlot } from "@/types";

export interface ParkingTwinData {
  communityName: string;
  slots: TwinParkingSlot[];
  activity: TwinActivityItem[];
  incomingVisitors: number;
  outgoingVisitors: number;
}

const seedActivity: TwinActivityItem[] = [
  {
    id: "act_eng_01",
    type: "occupied",
    title: "P01 occupied.",
    description: "Emily Brooks · allocated by parking engine",
    timestamp: new Date(Date.now() - 120_000).toISOString(),
    slotLabel: "P01",
  },
  {
    id: "act_eng_02",
    type: "reserved",
    title: "P09 reserved.",
    description: "VIP bay hold · Liam Ortega",
    timestamp: new Date(Date.now() - 240_000).toISOString(),
    slotLabel: "P09",
  },
  {
    id: "act_eng_03",
    type: "expired",
    title: "Overstay flagged.",
    description: "Sofia Guest past expected exit",
    timestamp: new Date(Date.now() - 360_000).toISOString(),
    slotLabel: "P15",
  },
];

export function getParkingTwin(): ParkingTwinData {
  return {
    communityName: getEngineCommunity(),
    slots: listTwinSlots(),
    activity: seedActivity,
    incomingVisitors: 4,
    outgoingVisitors: 2,
  };
}

export function computeTwinMetrics(
  _slots: TwinParkingSlot[],
  incoming: number,
  outgoing: number
): TwinMetrics {
  return twinMetricsFromEngine(incoming, outgoing);
}

export function runTwinSimulationTick(): {
  slots: TwinParkingSlot[];
  activityItem: TwinActivityItem | null;
} {
  const event = parkingEngine.simulate();
  return {
    slots: listTwinSlots(),
    activityItem: event ? simulationToActivity(event) : null,
  };
}

export function twinMarkExit(bayId: string): TwinParkingSlot[] {
  parkingEngine.release(bayId);
  return listTwinSlots();
}

export function twinReassign(bayId: string): TwinParkingSlot[] {
  const bays = parkingEngine.getBays();
  const source = bays.find((bay) => bay.id === bayId);
  if (!source || source.status === "available") return listTwinSlots();

  const request = {
    visitorId: `${source.visitorId ?? "vis"}_re_${Date.now()}`,
    visitorName: source.visitorName ?? "Visitor",
    visitorCategory: source.visitorCategory ?? ("guest" as const),
    vehiclePlate: `${source.vehiclePlate ?? "TX-RASN"}-R`,
    vehicleSize: source.vehicleSize,
    accessible: source.accessible,
    residentName: source.residentName,
    apartment: source.apartment,
    passId: `pass_re_${Date.now()}`,
    durationHours: 3,
  };

  parkingEngine.release(bayId);
  parkingEngine.allocate(request);
  return listTwinSlots();
}
