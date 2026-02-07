import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queueApi } from "@/services/api";
import { useToast } from "@/components/ui";
import { QueueEntry } from "@/types/queue";

export const useQueue = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const queueQuery = useQuery({
    queryKey: ["queue"],
    queryFn: async () => {
      const response = await queueApi.getAll();
      return response.data.queue as QueueEntry[];
    },
  });

  const autoAssign = useMutation({
    mutationFn: () => queueApi.autoAssign(),
    onSuccess: (response) => {
      if (response.data.assigned) {
        addToast("success", response.data.message);
        queryClient.invalidateQueries({ queryKey: ["queue"] });
        queryClient.invalidateQueries({ queryKey: ["staff"] });
      } else {
        addToast("warning", response.data.message);
      }
    },
    onError: (error: any) => {
      addToast("error", error.response?.data?.error || "Auto-assign failed");
    },
  });

  const manualAssign = useMutation({
    mutationFn: ({ queueId, staffId }: { queueId: string; staffId: string }) =>
      queueApi.manualAssign(queueId, staffId),
    onSuccess: (response) => {
      addToast("success", response.data.message);
      queryClient.invalidateQueries({ queryKey: ["queue"] });
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: (error: any) => {
      addToast("error", error.response?.data?.error || "Assignment failed");
    },
  });

  return {
    queue: queueQuery.data || [],
    isLoading: queueQuery.isLoading,
    autoAssign: autoAssign.mutateAsync,
    isAutoAssigning: autoAssign.isPending,
    manualAssign: manualAssign.mutateAsync,
    isManualAssigning: manualAssign.isPending,
  };
};
