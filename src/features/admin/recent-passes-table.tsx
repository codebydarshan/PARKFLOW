"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { QrCode } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatVisitDate } from "@/lib/format";
import { glass } from "@/lib/glass";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { AdminPassRow } from "@/types";

interface RecentPassesTableProps {
  passes: AdminPassRow[];
  search: string;
}

export function RecentPassesTable({ passes, search }: RecentPassesTableProps) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return passes;
    return passes.filter(
      (pass) =>
        pass.visitorName.toLowerCase().includes(q) ||
        pass.residentName.toLowerCase().includes(q) ||
        pass.vehiclePlate.toLowerCase().includes(q)
    );
  }, [passes, search]);

  return (
    <motion.section
      id="passes"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn("scroll-mt-24 space-y-4")}
    >
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Recent Visitor Passes
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Latest credentials across the community
        </p>
      </div>

      <div className={cn("rounded-2xl p-2 sm:p-3", glass.panel)}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={QrCode}
            title="No visitor passes found."
            description="Adjust search or wait for residents to issue new passes."
            className="border-0 bg-transparent py-12"
          />
        ) : (
          <div className="surface-solid overflow-x-auto rounded-xl ring-1 ring-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead className="hidden sm:table-cell">Resident</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Parking</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((pass) => (
                  <TableRow
                    key={pass.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="font-medium">
                      {pass.visitorName}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {pass.residentName}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {pass.vehiclePlate}
                    </TableCell>
                    <TableCell>{pass.slotLabel ?? "—"}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatVisitDate(pass.visitDate)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={pass.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </motion.section>
  );
}
