import { useQuery } from "@tanstack/react-query";
import { dashboardApi, activityApi } from "@/services/api";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const response = await dashboardApi.getStats();
      return response.data.stats;
    },
  });
};

export const useStaffLoad = (date?: string) => {
  return useQuery({
    queryKey: ["dashboard", "staff-load", date],
    queryFn: async () => {
      const response = await dashboardApi.getStaffLoad(date);
      return response.data.staffLoad;
    },
  });
};

export const useRecentActivity = (limit = 10) => {
  return useQuery({
    queryKey: ["activity", "recent", limit],
    queryFn: async () => {
      const response = await activityApi.getRecent(limit);
      return response.data.activities;
    },
  });
};
