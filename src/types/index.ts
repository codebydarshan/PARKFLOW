export type UserRole = "resident" | "security" | "admin";

export type PassStatus = "active" | "expired" | "pending" | "revoked" | "approved";

export type SlotStatus =
  | "available"
  | "occupied"
  | "reserved"
  | "blocked"
  | "overstay"
  | "maintenance";

export type VehicleType = "car" | "bike" | "taxi" | "delivery";

export interface Community {
  id: string;
  name: string;
  address: string;
  totalSlots: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  unit: string;
  avatarInitials: string;
}

export interface ParkingSlot {
  id: string;
  label: string;
  zone: string;
  status: SlotStatus;
  vehiclePlate?: string;
}

export interface VisitorPass {
  id: string;
  visitorName: string;
  vehiclePlate: string;
  hostName: string;
  hostUnit: string;
  slotId: string | null;
  slotLabel: string | null;
  status: PassStatus;
  validFrom: string;
  validUntil: string;
  qrCode: string;
  createdAt: string;
  phone?: string;
  vehicleType?: VehicleType;
  notes?: string;
  visitDate?: string;
  durationHours?: number;
}

export interface ResidentVehicle {
  id: string;
  label: string;
  plate: string;
  type: VehicleType;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
}

export interface ActivityItem {
  id: string;
  type: "check_in" | "check_out" | "pass_created" | "slot_assigned" | "alert";
  title: string;
  description: string;
  timestamp: string;
}

export interface DashboardStats {
  totalSlots: number;
  occupiedSlots: number;
  availableSlots: number;
  activePasses: number;
  todayVisitors: number;
  occupancyRate: number;
}

export interface ResidentStats {
  todayVisitors: number;
  upcomingVisitors: number;
  availableParking: number;
  occupancyRate: number;
  activePasses: number;
}

export type SecurityVisitorStatus =
  | "expected"
  | "inside"
  | "exited"
  | "expired"
  | "overstay"
  | "invalid"
  | "approved";

export interface SecurityStats {
  visitorsExpected: number;
  visitorsInside: number;
  parkingOccupied: number;
  parkingAvailable: number;
  expiredPasses: number;
  overstays: number;
}

export interface SecurityVisitor {
  id: string;
  visitorName: string;
  residentName: string;
  apartment: string;
  vehiclePlate: string;
  vehicleType: VehicleType;
  visitorId: string;
  arrivalTime: string;
  expiryTime: string;
  parkingSlot: string | null;
  status: SecurityVisitorStatus;
  entryTime?: string;
  expectedExit?: string;
  qrCode: string;
}

export interface SecurityActivity {
  id: string;
  type:
    | "entered"
    | "verified"
    | "assigned"
    | "exited"
    | "expired"
    | "rejected";
  title: string;
  description: string;
  timestamp: string;
}

export interface SecurityContact {
  label: string;
  value: string;
}

export interface SecurityUpcomingArrival {
  visitorName: string;
  residentName: string;
  eta: string;
  vehiclePlate: string;
}

export interface AdminStats {
  todayVisitors: number;
  visitorsInside: number;
  occupancyRate: number;
  averageVisitHours: number;
  peakOccupancy: number;
  overstays: number;
}

export interface AdminParkingSlot {
  id: string;
  label: string;
  status: SlotStatus;
  vehiclePlate?: string;
  visitorName?: string;
  residentName?: string;
  arrivalTime?: string;
  expectedExit?: string;
}

export interface AdminResidentRow {
  id: string;
  name: string;
  apartment: string;
  vehicles: number;
  visitorCount: number;
  lastVisitor: string;
  status: "active" | "inactive";
}

export interface AdminPassRow {
  id: string;
  visitorName: string;
  residentName: string;
  vehiclePlate: string;
  slotLabel: string | null;
  visitDate: string;
  status: PassStatus;
}

export interface AdminHourlyPoint {
  hour: string;
  visitors: number;
}

export interface AdminFlatLeader {
  apartment: string;
  residentName: string;
  visits: number;
}

export interface AdminTimelineItem {
  id: string;
  time: string;
  title: string;
  description: string;
}

export interface AdminSecurityOverview {
  guardsOnDuty: number;
  verifiedToday: number;
  averageVerificationSeconds: number;
  rejectedEntries: number;
}

export interface AdminInsight {
  id: string;
  text: string;
}

export interface AdminReportCard {
  id: string;
  title: string;
  description: string;
  period: string;
}

export type TwinSlotStatus =
  | "available"
  | "reserved"
  | "occupied"
  | "overstay";

export type TwinActivityType =
  | "occupied"
  | "released"
  | "entered"
  | "exited"
  | "reserved"
  | "expired";

export interface TwinParkingSlot {
  id: string;
  label: string;
  status: TwinSlotStatus;
  vehicleType?: VehicleType;
  vehiclePlate?: string;
  visitorName?: string;
  residentName?: string;
  apartment?: string;
  arrivalTime?: string;
  expectedExit?: string;
  qrStatus?: PassStatus;
  passId?: string;
  timeline?: TimelineEvent[];
}

export interface TwinActivityItem {
  id: string;
  type: TwinActivityType;
  title: string;
  description: string;
  timestamp: string;
  slotLabel?: string;
}

export interface TwinMetrics {
  available: number;
  reserved: number;
  occupied: number;
  overstays: number;
  incoming: number;
  outgoing: number;
}
