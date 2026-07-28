import {
  buildReserveRequest,
  parkingEngine,
} from "@/services/parking-engine";
import type { DemoVisitorScript } from "./demo-state";
import type { DemoTimelineStep } from "./demo-timeline";

export function createDemoVisitorScript(): DemoVisitorScript {
  const stamp = Date.now().toString(36).slice(-4).toUpperCase();
  const today = new Date();
  const visitDate = today.toISOString().slice(0, 10);

  return {
    visitorName: "Aria Kapoor",
    phone: "+1 512 555 0142",
    vehicleNumber: `TX-DM${stamp}`,
    vehicleType: "car",
    visitDate,
    arrivalTime: "18:30",
    durationHours: 3,
    notes: "Live demo guest · evening visit",
    visitorId: `vis_demo_${stamp.toLowerCase()}`,
    passId: `pass_demo_${stamp.toLowerCase()}`,
  };
}

export function runDemoEngineAction(
  action: DemoTimelineStep["action"],
  script: DemoVisitorScript,
  currentBayId: string | null
): { bayId: string | null; bayLabel: string | null; passId: string | null } {
  if (!action || action === "none" || action === "prepare") {
    return { bayId: currentBayId, bayLabel: null, passId: script.passId };
  }

  const arrival = new Date(`${script.visitDate}T${script.arrivalTime}:00`);
  const expectedExit = new Date(
    arrival.getTime() + script.durationHours * 3_600_000
  );

  if (action === "reserve") {
    // Clear any prior demo assignment with same pass id
    const existing = parkingEngine
      .getBays()
      .find((bay) => bay.passId === script.passId);
    if (existing) {
      parkingEngine.release(existing.id);
    }

    const outcome = parkingEngine.reserve(
      buildReserveRequest({
        visitorId: script.visitorId,
        visitorName: script.visitorName,
        vehiclePlate: script.vehicleNumber,
        vehicleType: script.vehicleType,
        notes: script.notes,
        residentName: "Darshan",
        apartment: "B-204",
        passId: script.passId,
        durationHours: script.durationHours,
        expectedArrival: arrival.toISOString(),
        expectedExit: expectedExit.toISOString(),
      })
    );

    if (!outcome.ok) {
      // Fallback: allocate directly if reserve blocked
      const alloc = parkingEngine.allocate(
        buildReserveRequest({
          visitorId: `${script.visitorId}_a`,
          visitorName: script.visitorName,
          vehiclePlate: `${script.vehicleNumber}A`,
          vehicleType: script.vehicleType,
          notes: script.notes,
          residentName: "Darshan",
          apartment: "B-204",
          passId: `${script.passId}_a`,
          durationHours: script.durationHours,
          expectedArrival: new Date().toISOString(),
          expectedExit: expectedExit.toISOString(),
        })
      );
      if (!alloc.ok) {
        return { bayId: currentBayId, bayLabel: null, passId: script.passId };
      }
      return {
        bayId: alloc.bay.id,
        bayLabel: alloc.bay.label,
        passId: script.passId,
      };
    }

    return {
      bayId: outcome.bay.id,
      bayLabel: outcome.bay.label,
      passId: script.passId,
    };
  }

  if (action === "allocate") {
    const outcome = parkingEngine.allocate(
      buildReserveRequest({
        visitorId: script.visitorId,
        visitorName: script.visitorName,
        vehiclePlate: script.vehicleNumber,
        vehicleType: script.vehicleType,
        notes: script.notes,
        residentName: "Darshan",
        apartment: "B-204",
        passId: script.passId,
        durationHours: script.durationHours,
        expectedArrival: new Date().toISOString(),
        expectedExit: expectedExit.toISOString(),
      })
    );

    if (!outcome.ok && currentBayId) {
      return {
        bayId: currentBayId,
        bayLabel:
          parkingEngine.getBays().find((b) => b.id === currentBayId)?.label ??
          null,
        passId: script.passId,
      };
    }

    if (!outcome.ok) {
      return { bayId: currentBayId, bayLabel: null, passId: script.passId };
    }

    return {
      bayId: outcome.bay.id,
      bayLabel: outcome.bay.label,
      passId: script.passId,
    };
  }

  if (action === "release") {
    const target =
      currentBayId ??
      parkingEngine.getBays().find((bay) => bay.passId === script.passId)?.id;
    if (target) {
      const bay = parkingEngine.getBays().find((b) => b.id === target);
      parkingEngine.release(target);
      return {
        bayId: target,
        bayLabel: bay?.label ?? null,
        passId: script.passId,
      };
    }
  }

  return { bayId: currentBayId, bayLabel: null, passId: script.passId };
}
