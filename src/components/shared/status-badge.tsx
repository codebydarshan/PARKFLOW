import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PassStatus, SecurityVisitorStatus, SlotStatus } from "@/types";

const warningTone =
  "border-warning/35 bg-warning/15 text-warning-foreground hover:bg-warning/15";

const passStyles: Record<PassStatus, string> = {
  active:
    "border-success/30 bg-success/10 text-success hover:bg-success/10",
  approved:
    "border-success/30 bg-success/10 text-success hover:bg-success/10",
  pending: warningTone,
  expired: "border-border bg-muted text-muted-foreground hover:bg-muted",
  revoked:
    "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/10",
};

const securityStyles: Record<SecurityVisitorStatus, string> = {
  expected:
    "border-primary/30 bg-primary/10 text-primary hover:bg-primary/10",
  inside:
    "border-success/30 bg-success/10 text-success hover:bg-success/10",
  approved:
    "border-success/30 bg-success/10 text-success hover:bg-success/10",
  exited: "border-border bg-muted text-muted-foreground hover:bg-muted",
  expired: "border-border bg-muted text-muted-foreground hover:bg-muted",
  overstay: warningTone,
  invalid:
    "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/10",
};

const slotStyles: Record<SlotStatus, string> = {
  available:
    "border-success/30 bg-success/10 text-success hover:bg-success/10",
  occupied:
    "border-primary/30 bg-primary/10 text-primary hover:bg-primary/10",
  reserved: warningTone,
  blocked:
    "border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/10",
  overstay: warningTone,
  maintenance:
    "border-border bg-muted text-muted-foreground hover:bg-muted",
};

interface StatusBadgeProps {
  status: PassStatus | SlotStatus | SecurityVisitorStatus;
  kind?: "pass" | "slot" | "security";
  className?: string;
}

export function StatusBadge({
  status,
  kind = "pass",
  className,
}: StatusBadgeProps) {
  const styles =
    kind === "slot"
      ? slotStyles
      : kind === "security"
        ? securityStyles
        : passStyles;

  const resolved =
    styles[status as keyof typeof styles] ??
    passStyles.active;

  const label = status.replace("_", " ");

  return (
    <Badge
      variant="outline"
      className={cn("capitalize", resolved, className)}
    >
      {label}
    </Badge>
  );
}
