import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi, queueApi } from "@/services/api";
import { Appointment } from "@/types/appointment";
import { AppointmentForm } from "@/schemas/appointment.schema";
import { useToast } from "@/components/ui";

export const useAppointments = (filters?: {
  date?: string;
  staffId?: string;
  status?: string;
}) => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const appointmentsQuery = useQuery({
    queryKey: ["appointments", filters],
    queryFn: async () => {
      const response = await appointmentsApi.getAll(filters);
      return response.data.appointments as Appointment[];
    },
  });

  const createAppointment = useMutation({
    mutationFn: (data: AppointmentForm) => appointmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["queue"] });
      addToast("success", "Appointment scheduled");
    },
    onError: (error: any) => {
      addToast(
        "error",
        error.response?.data?.error || "Failed to schedule appointment",
      );
    },
  });

  const updateAppointment = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<AppointmentForm & { status: string }>;
    }) => appointmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["queue"] });
      addToast("success", "Appointment updated");
    },
    onError: (error: any) => {
      addToast(
        "error",
        error.response?.data?.error || "Failed to update appointment",
      );
    },
  });

  const cancelAppointment = useMutation({
    mutationFn: (id: string) => appointmentsApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["queue"] });
      addToast("success", "Appointment cancelled");
    },
    onError: (error: any) => {
      addToast(
        "error",
        error.response?.data?.error || "Failed to cancel appointment",
      );
    },
  });

  const completeAppointment = useMutation({
    mutationFn: (id: string) => appointmentsApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      addToast("success", "Appointment marked as completed");
    },
  });

  const noShowAppointment = useMutation({
    mutationFn: (id: string) => appointmentsApi.noShow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      addToast("warning", "Appointment marked as no-show");
    },
  });

  return {
    appointments: appointmentsQuery.data || [],
    isLoading: appointmentsQuery.isLoading,
    createAppointment: createAppointment.mutateAsync,
    isCreating: createAppointment.isPending,
    updateAppointment: updateAppointment.mutateAsync,
    isUpdating: updateAppointment.isPending,
    cancelAppointment: cancelAppointment.mutateAsync,
    isCancelling: cancelAppointment.isPending,
    completeAppointment: completeAppointment.mutateAsync,
    noShowAppointment: noShowAppointment.mutateAsync,
    isSubmitting:
      createAppointment.isPending ||
      updateAppointment.isPending ||
      cancelAppointment.isPending,
  };
};

export const useQueue = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const queueQuery = useQuery({
    queryKey: ["queue"],
    queryFn: async () => {
      const response = await queueApi.getAll();
      return response.data.queue;
    },
  });

  const autoAssign = useMutation({
    mutationFn: () => queueApi.autoAssign(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queue"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      addToast("success", "Queue auto-assigned");
    },
  });

  const manualAssign = useMutation({
    mutationFn: ({ queueId, staffId }: { queueId: string; staffId: string }) =>
      queueApi.manualAssign(queueId, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["queue"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      addToast("success", "Staff assigned manually");
    },
  });

  return {
    queue: queueQuery.data || [],
    isLoading: queueQuery.isLoading,
    autoAssign: autoAssign.mutate,
    isAssigning: autoAssign.isPending,
    manualAssign: manualAssign.mutate,
  };
};
