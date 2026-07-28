"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Search } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";
import type { PassStatus, VisitorPass } from "@/types";

interface RecentVisitorsProps {
  passes: VisitorPass[];
  search: string;
  onCreatePass: () => void;
}

const filters: Array<{ label: string; value: "all" | PassStatus }> = [
  { label: "All", value: "all" },
  { label: "Approved", value: "approved" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Expired", value: "expired" },
];

export function RecentVisitors({
  passes,
  search,
  onCreatePass,
}: RecentVisitorsProps) {
  const [status, setStatus] = useState<"all" | PassStatus>("all");
  const [localSearch, setLocalSearch] = useState("");

  const query = (localSearch || search).trim().toLowerCase();

  const filtered = useMemo(() => {
    return passes.filter((pass) => {
      const statusMatch = status === "all" || pass.status === status;
      const textMatch =
        !query ||
        pass.visitorName.toLowerCase().includes(query) ||
        pass.vehiclePlate.toLowerCase().includes(query) ||
        (pass.slotLabel ?? "").toLowerCase().includes(query);
      return statusMatch && textMatch;
    });
  }, [passes, query, status]);

  return (
    <section id="history" className="scroll-mt-24 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Recent visitors
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search and filter your visitor parking history
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative sm:w-56">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              placeholder="Filter table..."
              className={cn("pl-9", glass.search)}
              aria-label="Filter recent visitors"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) =>
              setStatus((value as "all" | PassStatus) ?? "all")
            }
          >
            <SelectTrigger className="w-full sm:w-36" aria-label="Filter status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {filters.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("rounded-2xl p-2 sm:p-3", glass.panel)}
      >
        {passes.length === 0 ? (
          <EmptyState
            icon={QrCode}
            title="No visitor passes yet."
            description="Create your first visitor pass to allocate parking and share a QR credential."
            action={
              <Button onClick={onCreatePass} className="gap-1.5">
                Create your first visitor pass
              </Button>
            }
            className="border-0 bg-transparent"
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No matching visitors"
            description="Try another name, plate, or status filter."
            className="border-0 bg-transparent py-12"
          />
        ) : (
          <div className="surface-solid overflow-x-auto rounded-xl ring-1 ring-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Parking</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Visit Date
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((pass) => (
                  <TableRow
                    key={pass.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <TableCell>
                      <p className="font-medium">{pass.visitorName}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        {pass.visitDate
                          ? formatVisitDate(pass.visitDate)
                          : "—"}
                      </p>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {pass.vehiclePlate}
                    </TableCell>
                    <TableCell>{pass.slotLabel ?? "Pending"}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {pass.visitDate ? formatVisitDate(pass.visitDate) : "—"}
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
      </motion.div>
    </section>
  );
}
