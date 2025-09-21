import { useQuery } from "@tanstack/react-query";
import { fetchWeeklySchedule, updateWeeklySchedule } from "../api/businessApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiErrorResponse } from "@/types/api";

export function useSchedule(businessId: string) {
  return useQuery<Record<string, string[]>, ApiErrorResponse>({
    queryKey: ["schedule", businessId],
    queryFn: () => fetchWeeklySchedule(businessId),
  });
}

export function useUpdateSchedule(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Record<string, string[]>) =>
      updateWeeklySchedule(businessId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule", businessId] });
    },
  });
}
