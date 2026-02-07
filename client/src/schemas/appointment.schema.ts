import { z } from "zod";

export const appointmentSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  serviceId: z.string().min(1, "Service is required"),
  staffId: z.string().optional(),
  appointmentDate: z.string().min(1, "Date is required"),
  appointmentTime: z.string().min(1, "Time is required"),
});

export type AppointmentForm = z.infer<typeof appointmentSchema>;
