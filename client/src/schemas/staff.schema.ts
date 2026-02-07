import { z } from "zod";

export const staffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  staffType: z.enum(["Doctor", "Consultant", "Support Agent"]),
  dailyCapacity: z.string().regex(/^\d+$/, "Must be a number"),
  availabilityStatus: z.enum(["Available", "On Leave"]),
});

export type StaffForm = z.infer<typeof staffSchema>;
