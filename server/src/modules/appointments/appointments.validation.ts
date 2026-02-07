import { z } from "zod";

export const appointmentSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  serviceId: z.string().uuid("Invalid service ID"),
  staffId: z.string().uuid("Invalid staff ID").nullable().optional(),
  appointmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  appointmentTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
});

export const updateAppointmentSchema = appointmentSchema.partial().extend({
  status: z.enum(["Scheduled", "Completed", "Cancelled", "No-Show"]).optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
