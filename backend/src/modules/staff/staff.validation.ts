import { z } from "zod";

export const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  staffType: z.enum(["Doctor", "Consultant", "Support Agent"]),
  dailyCapacity: z.number().int().min(1).max(50).default(5),
  availabilityStatus: z.enum(["Available", "On Leave"]).default("Available"),
});

export const updateStaffSchema = staffSchema.partial();

export type StaffInput = z.infer<typeof staffSchema>;
