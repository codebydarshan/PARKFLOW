"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, ScanLine, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MockQrOption } from "@/services/security";
import { glass } from "@/lib/glass";
import { scalePop } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type ScanOutcome = "idle" | "scanning" | "valid" | "invalid";

interface QrScannerProps {
  mockOptions: MockQrOption[];
  outcome: ScanOutcome;
  onSimulateScan: (visitorId: string) => void;
}

export function QrScanner({
  mockOptions,
  outcome,
  onSimulateScan,
}: QrScannerProps) {
  const [pastedId, setPastedId] = useState("");
  const [selectedMock, setSelectedMock] = useState(
    mockOptions[0]?.visitorId ?? ""
  );

  function handleScan(source: "paste" | "mock") {
    const id =
      source === "paste" ? pastedId.trim() : selectedMock.trim();
    if (!id) return;
    onSimulateScan(id);
  }

  return (
    <section
      id="scanner"
      data-demo-target="demo-security-scan"
      className={cn("scroll-mt-24 rounded-2xl p-5 sm:p-6", glass.panel)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">QR Scanner</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Mock scanner — paste an ID or select a demo QR. No camera required.
          </p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
          <ScanLine className="size-5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-border/70 bg-background/40">
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 p-6">
            <div className="relative size-40 rounded-xl border border-primary/30 bg-primary/5">
              <motion.div
                className="absolute inset-x-3 h-0.5 bg-primary/80 shadow-[0_0_12px] shadow-primary/50"
                animate={{ top: ["12%", "88%", "12%"] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="absolute inset-3 rounded-lg border border-primary/20" />
            </div>
            <p className="text-sm text-muted-foreground">
              Align QR within the frame
            </p>
          </div>

          <AnimatePresence mode="wait">
            {outcome === "scanning" ? (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Loader2 className="size-4 animate-spin text-primary" />
                  Verifying pass…
                </div>
              </motion.div>
            ) : null}
            {outcome === "valid" ? (
              <motion.div
                key="valid"
                variants={scalePop}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-xl border border-success/30 bg-success/15 px-4 py-3 text-success"
              >
                <CheckCircle2 className="size-5 shrink-0" />
                <span className="text-sm font-semibold">
                  ✓ Visitor Verified
                </span>
              </motion.div>
            ) : null}
            {outcome === "invalid" ? (
              <motion.div
                key="invalid"
                variants={scalePop}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/15 px-4 py-3 text-destructive"
              >
                <XCircle className="size-5 shrink-0" />
                <span className="text-sm font-semibold">✕ Invalid Pass</span>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visitor-id">Paste Visitor ID</Label>
            <Input
              id="visitor-id"
              value={pastedId}
              onChange={(event) => setPastedId(event.target.value)}
              placeholder="PF-PASS-…"
              className={cn("h-11", glass.search)}
            />
            <Button
              className="h-11 w-full"
              variant="outline"
              onClick={() => handleScan("paste")}
              disabled={!pastedId.trim() || outcome === "scanning"}
            >
              Verify pasted ID
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Select Mock QR</Label>
            <Select
              value={selectedMock}
              onValueChange={(value) => setSelectedMock(value ?? "")}
            >
              <SelectTrigger className="h-11 w-full" aria-label="Mock QR">
                <SelectValue placeholder="Choose demo pass" />
              </SelectTrigger>
              <SelectContent>
                {mockOptions.map((option) => (
                  <SelectItem key={option.visitorId} value={option.visitorId}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="h-12 w-full gap-2 text-base"
              onClick={() => handleScan("mock")}
              disabled={!selectedMock || outcome === "scanning"}
            >
              <ScanLine className="size-4" />
              Simulate Scan
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
