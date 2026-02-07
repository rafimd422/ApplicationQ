import { z } from "zod";

export const serviceSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  duration: z.enum(["15", "30", "60"]).transform(Number),
  requiredStaffType: z.enum(["Doctor", "Consultant", "Support Agent"]),
});

export const updateServiceSchema = serviceSchema.partial();

export type ServiceInput = z.infer<typeof serviceSchema>;
