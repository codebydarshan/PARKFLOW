import type { Metadata } from "next";
import { ResidentView } from "@/features/resident/resident-view";

export const metadata: Metadata = {
  title: "Resident",
};

export default function ResidentPage() {
  return <ResidentView />;
}
