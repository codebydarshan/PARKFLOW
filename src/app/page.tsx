import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/landing-page";

export const metadata: Metadata = {
  title: "ParkFlow — Visitor Parking. Finally Solved.",
  description:
    "Generate QR visitor passes, assign parking automatically, eliminate parking conflicts, and manage visitor vehicles effortlessly.",
};

export default function HomePage() {
  return <LandingPage />;
}
