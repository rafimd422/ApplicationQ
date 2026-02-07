export interface Staff {
  id: string;
  name: string;
  staffType: "Doctor" | "Consultant" | "Support Agent";
  dailyCapacity: number;
  availabilityStatus: "Available" | "On Leave";
  isAvailable?: boolean;
}
