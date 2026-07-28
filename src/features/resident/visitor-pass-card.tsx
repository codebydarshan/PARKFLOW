"use client";

import { motion } from "framer-motion";
import { Check, Copy, Download, Share2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { glass } from "@/lib/glass";
import { scalePop } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { VisitorPass } from "@/types";

interface VisitorPassCardProps {
  pass: VisitorPass;
  onClose: () => void;
  onFeedback: (title: string, description: string) => void;
}

export function VisitorPassCard({
  pass,
  onClose,
  onFeedback,
}: VisitorPassCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(pass.id);
      setCopied(true);
      onFeedback("Visitor ID copied", pass.id);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      onFeedback("Copy unavailable", "Clipboard permission was denied");
    }
  }

  function sharePass() {
    const summary = `${pass.visitorName} · ${pass.vehiclePlate} · Slot ${pass.slotLabel ?? "TBD"} · ${pass.qrCode}`;
    if (navigator.share) {
      void navigator.share({
        title: "ParkFlow Visitor Pass",
        text: summary,
      });
    } else {
      void navigator.clipboard.writeText(summary);
      onFeedback("Pass details copied", "Share link simulated for demo");
    }
  }

  function downloadPass() {
    onFeedback(
      "Download ready",
      "Demo mode — pass export is simulated"
    );
  }

  return (
    <motion.div
      variants={scalePop}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-md"
    >
      <div
        className={cn(
          "overflow-hidden rounded-3xl",
          glass.panelStrong
        )}
      >
        <div className="bg-gradient-to-br from-primary/20 via-transparent to-transparent px-6 pt-6 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
                ParkFlow Pass
              </p>
              <h3 className="mt-1 text-2xl font-semibold tracking-tight">
                {pass.visitorName}
              </h3>
            </div>
            <StatusBadge status={pass.status} />
          </div>
        </div>

        <div className="space-y-5 px-6 pb-6">
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="rounded-2xl border border-border/60 bg-background p-4 shadow-[var(--shadow-glass)]"
            >
              <QRCodeSVG
                value={pass.qrCode}
                size={168}
                level="M"
                bgColor="transparent"
                fgColor="currentColor"
                className="text-foreground"
              />
            </motion.div>
          </div>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-border/50 bg-background/40 p-3">
              <dt className="text-xs text-muted-foreground">Vehicle</dt>
              <dd className="mt-1 font-mono font-medium">{pass.vehiclePlate}</dd>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/40 p-3">
              <dt className="text-xs text-muted-foreground">Parking Slot</dt>
              <dd className="mt-1 font-medium">{pass.slotLabel ?? "Assigning…"}</dd>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/40 p-3">
              <dt className="text-xs text-muted-foreground">Visitor ID</dt>
              <dd className="mt-1 truncate font-mono text-xs">{pass.id}</dd>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/40 p-3">
              <dt className="text-xs text-muted-foreground">Status</dt>
              <dd className="mt-1 font-medium capitalize">{pass.status}</dd>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/40 p-3">
              <dt className="text-xs text-muted-foreground">Arrival</dt>
              <dd className="mt-1 font-medium">
                {formatDateTime(pass.validFrom)}
              </dd>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/40 p-3">
              <dt className="text-xs text-muted-foreground">Expiry</dt>
              <dd className="mt-1 font-medium">
                {formatDateTime(pass.validUntil)}
              </dd>
            </div>
          </dl>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={downloadPass}
            >
              <Download className="size-3.5" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={sharePass}
            >
              <Share2 className="size-3.5" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => void copyId()}
            >
              {copied ? (
                <Check className="size-3.5 text-success" />
              ) : (
                <Copy className="size-3.5" />
              )}
              Copy ID
            </Button>
            <Button size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
