"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ShieldX,
  Timer,
} from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { glass } from "@/lib/glass";
import { scalePop } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { SecurityVisitor } from "@/types";

export type VerificationPhase =
  | "idle"
  | "ready"
  | "approving"
  | "success"
  | "rejected";

interface VerificationPanelProps {
  visitor: SecurityVisitor | null;
  phase: VerificationPhase;
  onApprove: () => void;
  onReject: () => void;
}

export function VerificationPanel({
  visitor,
  phase,
  onApprove,
  onReject,
}: VerificationPanelProps) {
  const canAct =
    visitor &&
    (visitor.status === "expected" ||
      visitor.status === "approved" ||
      visitor.status === "inside") &&
    phase !== "approving" &&
    phase !== "success";

  const isInvalid =
    visitor &&
    (visitor.status === "invalid" ||
      visitor.status === "expired" ||
      visitor.status === "exited");

  return (
    <section className={cn("rounded-2xl p-5 sm:p-6", glass.panel)}>
      <div className="flex items-center gap-2">
        <ShieldCheck className="size-4 text-primary" />
        <h2 className="text-lg font-semibold tracking-tight">
          Verification Panel
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Confirm credentials, then approve or reject with one tap.
      </p>

      {!visitor ? (
        <div className="mt-8 rounded-xl border border-dashed border-border/70 px-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Scan or select a visitor to load verification details.
          </p>
        </div>
      ) : (
        <motion.div
          key={visitor.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 space-y-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-2xl font-semibold tracking-tight">
                {visitor.visitorName}
              </p>
              <p className="mt-1 text-muted-foreground">
                Host {visitor.residentName} · Apt {visitor.apartment}
              </p>
            </div>
            <StatusBadge status={visitor.status} kind="security" />
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Vehicle Number", value: visitor.vehiclePlate, mono: true },
              {
                label: "Vehicle Type",
                value: visitor.vehicleType,
                capitalize: true,
              },
              { label: "Visitor ID", value: visitor.visitorId, mono: true },
              {
                label: "Parking Slot",
                value: visitor.parkingSlot ?? "Unassigned",
              },
              {
                label: "Arrival Time",
                value: formatDateTime(visitor.arrivalTime),
              },
              {
                label: "Expiry Time",
                value: formatDateTime(visitor.expiryTime),
              },
            ].map((field) => (
              <div
                key={field.label}
                className="rounded-xl border border-border/50 bg-background/40 p-3.5"
              >
                <dt className="text-xs text-muted-foreground">{field.label}</dt>
                <dd
                  className={cn(
                    "mt-1 text-sm font-medium",
                    field.mono && "font-mono",
                    field.capitalize && "capitalize"
                  )}
                >
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>

          <AnimatePresence mode="wait">
            {phase === "success" ? (
              <motion.div
                key="success"
                variants={scalePop}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-3 rounded-2xl border border-success/30 bg-success/10 p-4 text-success"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-5" />
                  <p className="text-base font-semibold">Entry Recorded</p>
                </div>
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p className="flex items-center gap-2 opacity-90">
                    <ShieldCheck className="size-4" />
                    Parking Assigned · {visitor.parkingSlot ?? "C-03"}
                  </p>
                  <p className="flex items-center gap-2 opacity-90">
                    <Timer className="size-4" />
                    Timer Started
                  </p>
                </div>
              </motion.div>
            ) : null}
            {phase === "rejected" ? (
              <motion.div
                key="rejected"
                variants={scalePop}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive"
              >
                <ShieldX className="size-5" />
                <div>
                  <p className="text-sm font-semibold">Entry Denied</p>
                  <p className="text-xs opacity-80">
                    Ask the guest to contact their host
                  </p>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              size="lg"
              className="h-14 gap-2 text-base"
              disabled={!canAct || !!isInvalid}
              onClick={onApprove}
            >
              {phase === "approving" ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <CheckCircle2 className="size-5" />
              )}
              {phase === "approving"
                ? "Recording…"
                : phase === "success"
                  ? "Approved"
                  : "Approve Entry"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 gap-2 text-base"
              disabled={!visitor || phase === "approving" || phase === "rejected"}
              onClick={onReject}
            >
              <ShieldX className="size-5" />
              Reject
            </Button>
          </div>
        </motion.div>
      )}
    </section>
  );
}
