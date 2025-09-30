import { useQuery } from "@tanstack/react-query";
import { fetchWeeklySchedule, updateWeeklySchedule } from "../api/businessApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/api";
import { ApiResult } from "@/lib/apiFetch";

export function useSchedule(businessId: string) {
  return useQuery<ApiResult<Record<string, string[]>>, ApiError>({
    queryKey: ["schedule", businessId],
    queryFn: () => fetchWeeklySchedule(businessId),
  });
}

export function useUpdateSchedule(businessId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, ApiError, Record<string, string[]> >({
    mutationFn: (payload: Record<string, string[]>) =>
      updateWeeklySchedule(businessId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule", businessId] });
    },
  });
}
