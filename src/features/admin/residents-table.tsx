"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
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
import { glass } from "@/lib/glass";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { AdminResidentRow } from "@/types";

interface ResidentsTableProps {
  residents: AdminResidentRow[];
  search: string;
}

export function ResidentsTable({ residents, search }: ResidentsTableProps) {
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [localSearch, setLocalSearch] = useState("");
  const query = (localSearch || search).trim().toLowerCase();

  const filtered = useMemo(() => {
    return residents.filter((resident) => {
      const statusMatch = status === "all" || resident.status === status;
      const textMatch =
        !query ||
        resident.name.toLowerCase().includes(query) ||
        resident.apartment.toLowerCase().includes(query) ||
        resident.lastVisitor.toLowerCase().includes(query);
      return statusMatch && textMatch;
    });
  }, [residents, query, status]);

  return (
    <motion.section
      id="residents"
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="scroll-mt-24 space-y-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Resident Management
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Directory of units, vehicles, and visitor activity
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative sm:w-52">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              placeholder="Search residents..."
              className={cn("h-10 pl-9", glass.search)}
              aria-label="Search residents"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) =>
              setStatus((value as "all" | "active" | "inactive") ?? "all")
            }
          >
            <SelectTrigger className="h-10 w-full sm:w-36" aria-label="Status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={cn("rounded-2xl p-2 sm:p-3", glass.panel)}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No residents match."
            description="Try another name, apartment, or status filter."
            className="border-0 bg-transparent py-12"
          />
        ) : (
          <div className="surface-solid overflow-x-auto rounded-xl ring-1 ring-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident</TableHead>
                  <TableHead>Apartment</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Registered Vehicles
                  </TableHead>
                  <TableHead>Visitor Count</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Last Visitor
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((resident) => (
                  <TableRow
                    key={resident.id}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="font-medium">{resident.name}</TableCell>
                    <TableCell>{resident.apartment}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {resident.vehicles}
                    </TableCell>
                    <TableCell className="tabular-nums">
                      {resident.visitorCount}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {resident.lastVisitor}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          resident.status === "active"
                            ? "border-success/30 bg-success/10 text-success"
                            : "border-border bg-muted text-muted-foreground"
                        )}
                      >
                        {resident.status}
                      </Badge>
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
