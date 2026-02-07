import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "@/services/api";
import { Service } from "@/types/service";
import { ServiceForm } from "@/schemas/service.schema";
import { useToast } from "@/components/ui";

export const useServices = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const servicesQuery = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await servicesApi.getAll();
      return response.data.services as Service[];
    },
  });

  const createService = useMutation({
    mutationFn: (data: ServiceForm) => servicesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      addToast("success", "Service created successfully");
    },
    onError: (error: any) => {
      addToast(
        "error",
        error.response?.data?.error || "Failed to create service",
      );
    },
  });

  const updateService = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ServiceForm }) =>
      servicesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      addToast("success", "Service updated successfully");
    },
    onError: (error: any) => {
      addToast(
        "error",
        error.response?.data?.error || "Failed to update service",
      );
    },
  });

  const deleteService = useMutation({
    mutationFn: (id: string) => servicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      addToast("success", "Service deleted successfully");
    },
    onError: (error: any) => {
      addToast(
        "error",
        error.response?.data?.error || "Failed to delete service",
      );
    },
  });

  return {
    services: servicesQuery.data || [],
    isLoading: servicesQuery.isLoading,
    createService: createService.mutate,
    isCreating: createService.isPending,
    updateService: updateService.mutate,
    isUpdating: updateService.isPending,
    deleteService: deleteService.mutate,
    isDeleting: deleteService.isPending,
  };
};
