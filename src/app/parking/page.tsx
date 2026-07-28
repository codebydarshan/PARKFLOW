import type { Metadata } from "next";
import { ParkingTwinDashboard } from "@/features/parking-twin/parking-twin-dashboard";

export const metadata: Metadata = {
  title: "Parking Twin",
};

export default function ParkingPage() {
  return <ParkingTwinDashboard />;
}
