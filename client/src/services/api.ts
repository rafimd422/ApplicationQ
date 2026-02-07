import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authApi = {
  signup: (data: { email: string; password: string; name: string }) =>
    api.post("/auth/signup", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// Staff API
export const staffApi = {
  getAll: () => api.get("/staff"),
  getById: (id: string) => api.get(`/staff/${id}`),
  create: (data: {
    name: string;
    staffType: string;
    dailyCapacity?: number;
    availabilityStatus?: string;
  }) => api.post("/staff", data),
  update: (
    id: string,
    data: Partial<{
      name: string;
      staffType: string;
      dailyCapacity: number;
      availabilityStatus: string;
    }>,
  ) => api.put(`/staff/${id}`, data),
  delete: (id: string) => api.delete(`/staff/${id}`),
  getAvailability: (id: string, date: string) =>
    api.get(`/staff/${id}/availability`, { params: { date } }),
  getAllAvailability: (date: string) =>
    api.get("/staff/availability/all", { params: { date } }),
};

// Services API
export const servicesApi = {
  getAll: () => api.get("/services"),
  getById: (id: string) => api.get(`/services/${id}`),
  create: (data: {
    serviceName: string;
    duration: string;
    requiredStaffType: string;
  }) => api.post("/services", data),
  update: (
    id: string,
    data: Partial<{
      serviceName: string;
      duration: string;
      requiredStaffType: string;
    }>,
  ) => api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
};

// Appointments API
export const appointmentsApi = {
  getAll: (params?: { date?: string; staffId?: string; status?: string }) =>
    api.get("/appointments", { params }),
  getById: (id: string) => api.get(`/appointments/${id}`),
  create: (data: {
    customerName: string;
    serviceId: string;
    staffId?: string | null;
    appointmentDate: string;
    appointmentTime: string;
  }) => api.post("/appointments", data),
  update: (
    id: string,
    data: Partial<{
      customerName: string;
      serviceId: string;
      staffId: string;
      appointmentDate: string;
      appointmentTime: string;
      status: string;
    }>,
  ) => api.put(`/appointments/${id}`, data),
  cancel: (id: string) => api.delete(`/appointments/${id}`),
  complete: (id: string) => api.post(`/appointments/${id}/complete`),
  noShow: (id: string) => api.post(`/appointments/${id}/no-show`),
};

// Queue API
export const queueApi = {
  getAll: () => api.get("/queue"),
  autoAssign: () => api.post("/queue/assign"),
  manualAssign: (queueId: string, staffId: string) =>
    api.post(`/queue/${queueId}/assign/${staffId}`),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => api.get("/dashboard/stats"),
  getStaffLoad: (date?: string) =>
    api.get("/dashboard/staff-load", { params: { date } }),
};

// Activity API
export const activityApi = {
  getRecent: (limit?: number) => api.get("/activity", { params: { limit } }),
};
