import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "@/services/api";
import { Staff } from "@/types/staff";
import { StaffForm } from "@/schemas/staff.schema";
import { useToast } from "@/components/ui";

export const useStaff = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const staffQuery = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const response = await staffApi.getAll();
      return response.data.staff as Staff[];
    },
  });

  const createStaff = useMutation({
    mutationFn: (data: StaffForm) =>
      staffApi.create({
        ...data,
        dailyCapacity: parseInt(data.dailyCapacity),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      addToast("success", "Staff member created");
    },
    onError: (error: any) => {
      addToast(
        "error",
        error.response?.data?.error || "Failed to create staff",
      );
    },
  });

  const updateStaff = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<StaffForm> }) =>
      staffApi.update(id, {
        ...data,
        dailyCapacity: data.dailyCapacity
          ? parseInt(data.dailyCapacity)
          : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      addToast("success", "Staff member updated");
    },
    onError: (error: any) => {
      addToast(
        "error",
        error.response?.data?.error || "Failed to update staff",
      );
    },
  });

  const deleteStaff = useMutation({
    mutationFn: (id: string) => staffApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      addToast("success", "Staff member deleted");
    },
    onError: (error: any) => {
      addToast(
        "error",
        error.response?.data?.error || "Failed to delete staff",
      );
    },
  });

  return {
    staff: staffQuery.data || [],
    isLoading: staffQuery.isLoading,
    createStaff: createStaff.mutate,
    isCreating: createStaff.isPending,
    updateStaff: updateStaff.mutate,
    isUpdating: updateStaff.isPending,
    deleteStaff: deleteStaff.mutate,
    isDeleting: deleteStaff.isPending,
  };
};

export const useStaffAvailability = (date: string) => {
  return useQuery({
    queryKey: ["staff-availability", date],
    queryFn: async () => {
      const response = await staffApi.getAllAvailability(date);
      return response.data.availability;
    },
    enabled: !!date,
  });
};
