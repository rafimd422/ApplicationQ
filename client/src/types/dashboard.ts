export interface DashboardStats {
  completed: number;
  pending: number;
  cancelled: number;
  noShow: number;
  waitingQueueCount: number;
  totalStaff: number;
  availableStaff: number;
}

export interface StaffLoad {
  id: string;
  name: string;
  staffType: string;
  currentAppointments: number;
  dailyCapacity: number;
  loadStatus: "OK" | "Booked";
}

export interface ActivityLog {
  id: string;
  userName: string;
  action: string;
  timestamp: string;
}
