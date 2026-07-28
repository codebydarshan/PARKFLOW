"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Search, Users } from "lucide-react";
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
import { formatDateTime } from "@/lib/format";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";
import type { SecurityVisitor, SecurityVisitorStatus } from "@/types";

interface VisitorsInsideTableProps {
  visitors: SecurityVisitor[];
  search: string;
  onMarkExit: (id: string) => void;
  onViewDetails: (visitor: SecurityVisitor) => void;
}

const filters: Array<{ label: string; value: "all" | SecurityVisitorStatus }> =
  [
    { label: "All inside", value: "inside" },
    { label: "Overstay", value: "overstay" },
    { label: "Expected", value: "expected" },
    { label: "All statuses", value: "all" },
  ];

export function VisitorsInsideTable({
  visitors,
  search,
  onMarkExit,
  onViewDetails,
}: VisitorsInsideTableProps) {
  const [status, setStatus] = useState<"all" | SecurityVisitorStatus>("inside");
  const [localSearch, setLocalSearch] = useState("");
  const query = (localSearch || search).trim().toLowerCase();

  const filtered = useMemo(() => {
    return visitors.filter((visitor) => {
      const statusMatch =
        status === "all"
          ? true
          : status === "inside"
            ? visitor.status === "inside" || visitor.status === "overstay"
            : visitor.status === status;
      const textMatch =
        !query ||
        visitor.visitorName.toLowerCase().includes(query) ||
        visitor.residentName.toLowerCase().includes(query) ||
        visitor.vehiclePlate.toLowerCase().includes(query) ||
        (visitor.parkingSlot ?? "").toLowerCase().includes(query);
      return statusMatch && textMatch;
    });
  }, [visitors, query, status]);

  const expectedCount = visitors.filter((v) => v.status === "expected").length;

  return (
    <section
      id="inside"
      data-demo-target="demo-security-exit"
      className="scroll-mt-24 space-y-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Visitors Inside
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Active guests on property — mark exits as they leave
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative sm:w-52">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              placeholder="Filter table..."
              className={cn("h-10 pl-9", glass.search)}
              aria-label="Filter visitors inside"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) =>
              setStatus((value as "all" | SecurityVisitorStatus) ?? "inside")
            }
          >
            <SelectTrigger className="h-10 w-full sm:w-40" aria-label="Status">
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
        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={
              status === "expected" || expectedCount === 0
                ? "No expected visitors."
                : "No visitors match this filter."
            }
            description={
              status === "expected" || expectedCount === 0
                ? "When residents issue passes, expected arrivals will appear here."
                : "Try another search or status filter."
            }
            className="border-0 bg-transparent py-12"
          />
        ) : (
          <div className="surface-solid overflow-x-auto rounded-xl ring-1 ring-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visitor</TableHead>
                  <TableHead className="hidden md:table-cell">Resident</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Parking</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Entry Time
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Expected Exit
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((visitor) => (
                  <TableRow
                    key={visitor.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <TableCell>
                      <p className="font-medium">{visitor.visitorName}</p>
                      <p className="text-xs text-muted-foreground md:hidden">
                        {visitor.residentName}
                      </p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {visitor.residentName}
                      <span className="text-muted-foreground">
                        {" "}
                        · {visitor.apartment}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {visitor.vehiclePlate}
                    </TableCell>
                    <TableCell>{visitor.parkingSlot ?? "—"}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {visitor.entryTime
                        ? formatDateTime(visitor.entryTime)
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {visitor.expectedExit
                        ? formatDateTime(visitor.expectedExit)
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={visitor.status} kind="security" />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {(visitor.status === "inside" ||
                          visitor.status === "overstay") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-9 gap-1.5"
                            onClick={() => onMarkExit(visitor.id)}
                          >
                            <LogOut className="size-3.5" />
                            Mark Exit
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-9"
                          onClick={() => onViewDetails(visitor)}
                        >
                          View Details
                        </Button>
                      </div>
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
