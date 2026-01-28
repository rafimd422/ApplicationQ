import { z } from "zod";

// Auth validators
export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Staff validators
export const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  staffType: z.enum(["Doctor", "Consultant", "Support Agent"]),
  dailyCapacity: z.number().int().min(1).max(50).default(5),
  availabilityStatus: z.enum(["Available", "On Leave"]).default("Available"),
});

export const updateStaffSchema = staffSchema.partial();

// Service validators
export const serviceSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  duration: z.enum(["15", "30", "60"]).transform(Number),
  requiredStaffType: z.enum(["Doctor", "Consultant", "Support Agent"]),
});

export const updateServiceSchema = serviceSchema.partial();

// Appointment validators
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

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type StaffInput = z.infer<typeof staffSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
