import { z } from "zod";

export const vehicleTypes = ["car", "bike", "taxi", "delivery"] as const;

export const createPassSchema = z.object({
  visitorName: z
    .string()
    .min(2, "Enter the visitor's full name")
    .max(80, "Name is too long"),
  phone: z
    .string()
    .min(8, "Enter a valid phone number")
    .max(20, "Phone number is too long"),
  vehicleNumber: z
    .string()
    .min(4, "Enter a vehicle plate")
    .max(20, "Plate is too long"),
  vehicleType: z.enum(vehicleTypes),
  visitDate: z.string().min(1, "Select a visit date"),
  arrivalTime: z.string().min(1, "Select an arrival time"),
  durationHours: z
    .number()
    .min(1, "Minimum 1 hour")
    .max(24, "Maximum 24 hours"),
  notes: z.string().max(240, "Keep notes under 240 characters").optional(),
});

export type CreatePassValues = z.infer<typeof createPassSchema>;
