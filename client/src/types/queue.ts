export interface QueueEntry {
  id: string;
  queuePosition: number;
  addedAt: string;
  appointmentId: string;
  customerName: string;
  serviceName: string;
  requiredStaffType: string;
  serviceDuration: number;
  appointmentDate: string;
  appointmentTime: string;
}
