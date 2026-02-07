export interface Appointment {
  id: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  staffId: string | null;
  staffName: string | null;
  appointmentDate: string;
  appointmentTime: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "No-Show";
}
