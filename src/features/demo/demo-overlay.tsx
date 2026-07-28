"use client";

import { DemoControls } from "@/features/demo/demo-controls";
import {
  DemoNarration,
  DemoSpotlight,
  DemoToastHost,
} from "@/features/demo/demo-spotlight";
import { isDemoActive, useDemoOptional } from "@/features/demo/demo-provider";

export function DemoOverlay() {
  const demo = useDemoOptional();
  if (!demo || !isDemoActive(demo.status)) return null;

  return (
    <>
      <DemoSpotlight />
      <DemoNarration />
      <DemoToastHost />
      <DemoControls />
    </>
  );
}
