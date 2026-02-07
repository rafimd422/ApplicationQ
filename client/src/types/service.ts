export interface Service {
  id: string;
  serviceName: string;
  duration: number;
  requiredStaffType: "Doctor" | "Consultant" | "Support Agent";
}
