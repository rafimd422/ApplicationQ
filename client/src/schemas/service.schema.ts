import { z } from "zod";

export const serviceSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  duration: z.enum(["15", "30", "60"]),
  requiredStaffType: z.enum(["Doctor", "Consultant", "Support Agent"]),
});

export type ServiceForm = z.infer<typeof serviceSchema>;
