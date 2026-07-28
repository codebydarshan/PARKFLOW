"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  createPassSchema,
  type CreatePassValues,
  vehicleTypes,
} from "@/features/resident/schemas/create-pass";
import { VisitorPassCard } from "@/features/resident/visitor-pass-card";
import { glass } from "@/lib/glass";
import { cn } from "@/lib/utils";
import {
  buildReserveRequest,
  parkingEngine,
} from "@/services/parking-engine";
import { useDemoOptional } from "@/features/demo";
import type { User, VisitorPass } from "@/types";

interface CreatePassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onCreated: (pass: VisitorPass) => void;
  onFeedback: (title: string, description: string) => void;
}

const vehicleLabels: Record<(typeof vehicleTypes)[number], string> = {
  car: "Car",
  bike: "Bike",
  taxi: "Taxi",
  delivery: "Delivery",
};

function buildPass(
  values: CreatePassValues,
  user: User
): { pass: VisitorPass; error?: string } {
  const id = `pass_${Date.now().toString(36)}`;
  const arrival = new Date(`${values.visitDate}T${values.arrivalTime}:00`);
  const expiry = new Date(
    arrival.getTime() + values.durationHours * 60 * 60 * 1000
  );
  const visitorId = `vis_${values.visitorName.trim().toLowerCase().replace(/\s+/g, "_")}_${Date.now().toString(36)}`;
  const plate = values.vehicleNumber.trim().toUpperCase();

  const outcome = parkingEngine.reserve(
    buildReserveRequest({
      visitorId,
      visitorName: values.visitorName.trim(),
      vehiclePlate: plate,
      vehicleType: values.vehicleType,
      notes: values.notes,
      residentName: user.name,
      apartment: user.unit,
      passId: id,
      durationHours: values.durationHours,
      expectedArrival: arrival.toISOString(),
      expectedExit: expiry.toISOString(),
    })
  );

  if (!outcome.ok) {
    return {
      pass: {
        id,
        visitorName: values.visitorName.trim(),
        vehiclePlate: plate,
        hostName: user.name,
        hostUnit: user.unit,
        slotId: null,
        slotLabel: null,
        status: "pending",
        validFrom: arrival.toISOString(),
        validUntil: expiry.toISOString(),
        qrCode: `PF-${id.toUpperCase()}-${user.unit}`,
        createdAt: new Date().toISOString(),
        phone: values.phone.trim(),
        vehicleType: values.vehicleType,
        notes: values.notes?.trim() || undefined,
        visitDate: values.visitDate,
        durationHours: values.durationHours,
      },
      error: outcome.message,
    };
  }

  return {
    pass: {
      id,
      visitorName: values.visitorName.trim(),
      vehiclePlate: plate,
      hostName: user.name,
      hostUnit: user.unit,
      slotId: outcome.bay.id,
      slotLabel: outcome.bay.label,
      status: "approved",
      validFrom: arrival.toISOString(),
      validUntil: expiry.toISOString(),
      qrCode: `PF-${id.toUpperCase()}-${user.unit}`,
      createdAt: new Date().toISOString(),
      phone: values.phone.trim(),
      vehicleType: values.vehicleType,
      notes: values.notes?.trim() || undefined,
      visitDate: values.visitDate,
      durationHours: values.durationHours,
    },
  };
}

export function CreatePassModal({
  open,
  onOpenChange,
  user,
  onCreated,
  onFeedback,
}: CreatePassModalProps) {
  const [step, setStep] = useState<"form" | "generating" | "success">("form");
  const [issuedPass, setIssuedPass] = useState<VisitorPass | null>(null);
  const demo = useDemoOptional();

  const form = useForm<CreatePassValues>({
    resolver: zodResolver(createPassSchema),
    defaultValues: {
      visitorName: "",
      phone: "",
      vehicleNumber: "",
      vehicleType: "car",
      visitDate: new Date().toISOString().slice(0, 10),
      arrivalTime: "10:00",
      durationHours: 4,
      notes: "",
    },
  });

  useEffect(() => {
    if (!open) {
      const timer = window.setTimeout(() => {
        setStep("form");
        setIssuedPass(null);
        form.reset();
      }, 200);
      return () => window.clearTimeout(timer);
    }
  }, [open, form]);

  useEffect(() => {
    if (!demo || !open) return;

    if (demo.createPassPhase === "fill") {
      const script = demo.visitorScript;
      setStep("form");
      form.reset({
        visitorName: script.visitorName,
        phone: script.phone,
        vehicleNumber: script.vehicleNumber,
        vehicleType: script.vehicleType,
        visitDate: script.visitDate,
        arrivalTime: script.arrivalTime,
        durationHours: script.durationHours,
        notes: script.notes,
      });
    }

    if (demo.createPassPhase === "success") {
      const script = demo.visitorScript;
      const pass: VisitorPass = {
        id: script.passId,
        visitorName: script.visitorName,
        vehiclePlate: script.vehicleNumber,
        hostName: user.name,
        hostUnit: user.unit,
        slotId: demo.bayId,
        slotLabel: demo.bayLabel,
        status: "approved",
        validFrom: new Date().toISOString(),
        validUntil: new Date(
          Date.now() + script.durationHours * 3_600_000
        ).toISOString(),
        qrCode: `PF-${script.passId.toUpperCase()}-${user.unit}`,
        createdAt: new Date().toISOString(),
        phone: script.phone,
        vehicleType: script.vehicleType,
        notes: script.notes,
        visitDate: script.visitDate,
        durationHours: script.durationHours,
      };
      setIssuedPass(pass);
      setStep("success");
    }
  }, [
    demo?.createPassPhase,
    demo?.bayId,
    demo?.bayLabel,
    demo?.visitorScript,
    open,
    form,
    user,
    demo,
  ]);

  function onSubmit(values: CreatePassValues) {
    setStep("generating");
    window.setTimeout(() => {
      const { pass, error } = buildPass(values, user);
      setIssuedPass(pass);
      onCreated(pass);
      setStep("success");
      if (error) {
        onFeedback("Pass created without bay", error);
      } else {
        onFeedback(
          "Visitor pass generated",
          `${pass.visitorName} · slot ${pass.slotLabel}`
        );
      }
    }, 900);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] overflow-y-auto sm:max-w-xl",
          glass.float,
          "bg-transparent ring-0"
        )}
        showCloseButton={step !== "generating"}
      >
        <AnimatePresence mode="wait">
          {step === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl tracking-tight">
                  Create Visitor Pass
                </DialogTitle>
                <DialogDescription>
                  Invite a guest and generate a QR parking pass in seconds.
                </DialogDescription>
              </DialogHeader>

              <form
                data-demo-target="demo-pass-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="visitorName">Visitor Name</Label>
                    <Input
                      id="visitorName"
                      placeholder="Emily Brooks"
                      aria-invalid={!!form.formState.errors.visitorName}
                      aria-describedby={
                        form.formState.errors.visitorName
                          ? "visitorName-error"
                          : undefined
                      }
                      {...form.register("visitorName")}
                    />
                    {form.formState.errors.visitorName ? (
                      <p
                        id="visitorName-error"
                        className="text-xs text-destructive"
                        role="alert"
                      >
                        {form.formState.errors.visitorName.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 512 555 0100"
                      aria-invalid={!!form.formState.errors.phone}
                      aria-describedby={
                        form.formState.errors.phone ? "phone-error" : undefined
                      }
                      {...form.register("phone")}
                    />
                    {form.formState.errors.phone ? (
                      <p
                        id="phone-error"
                        className="text-xs text-destructive"
                        role="alert"
                      >
                        {form.formState.errors.phone.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                    <Input
                      id="vehicleNumber"
                      placeholder="TX-8PL21"
                      aria-invalid={!!form.formState.errors.vehicleNumber}
                      aria-describedby={
                        form.formState.errors.vehicleNumber
                          ? "vehicleNumber-error"
                          : undefined
                      }
                      {...form.register("vehicleNumber")}
                    />
                    {form.formState.errors.vehicleNumber ? (
                      <p
                        id="vehicleNumber-error"
                        className="text-xs text-destructive"
                        role="alert"
                      >
                        {form.formState.errors.vehicleNumber.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <Controller
                      control={form.control}
                      name="vehicleType"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) =>
                            field.onChange(value ?? "car")
                          }
                        >
                          <SelectTrigger
                            className="w-full"
                            aria-label="Vehicle type"
                          >
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {vehicleTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {vehicleLabels[type]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.vehicleType ? (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.vehicleType.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visitDate">Visit Date</Label>
                    <Input
                      id="visitDate"
                      type="date"
                      {...form.register("visitDate")}
                    />
                    {form.formState.errors.visitDate ? (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.visitDate.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arrivalTime">Arrival Time</Label>
                    <Input
                      id="arrivalTime"
                      type="time"
                      {...form.register("arrivalTime")}
                    />
                    {form.formState.errors.arrivalTime ? (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.arrivalTime.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="durationHours">Expected Duration (hrs)</Label>
                    <Input
                      id="durationHours"
                      type="number"
                      min={1}
                      max={24}
                      {...form.register("durationHours", { valueAsNumber: true })}
                    />
                    {form.formState.errors.durationHours ? (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.durationHours.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="notes">Resident Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Optional context for security"
                      rows={3}
                      {...form.register("notes")}
                    />
                    {form.formState.errors.notes ? (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.notes.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" size="lg">
                  <Sparkles className="size-4" />
                  Generate Visitor Pass
                </Button>
              </form>
            </motion.div>
          ) : null}

          {step === "generating" ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="mt-4 text-base font-medium tracking-tight">
                Allocating parking slot…
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Generating QR credential
              </p>
            </motion.div>
          ) : null}

          {step === "success" && issuedPass ? (
            <motion.div
              key="success"
              data-demo-target="demo-pass-qr"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <DialogHeader className="sr-only">
                <DialogTitle>Visitor pass ready</DialogTitle>
                <DialogDescription>
                  Your visitor parking pass has been generated.
                </DialogDescription>
              </DialogHeader>
              <VisitorPassCard
                pass={issuedPass}
                onClose={() => onOpenChange(false)}
                onFeedback={onFeedback}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
