// src/features/business/hooks/useBusinessProfile.ts
import { useQuery } from "@tanstack/react-query";
import { fetchBusinessesByID } from "../api/businessApi";
import { ApiResult } from "@/lib/apiFetch";
import { Business } from "../types/business";
import { ApiError } from "@/types/api";

export const useBusinessProfile = (businessId: string) => {
  return useQuery<ApiResult<Business>, ApiError>({
    queryKey: ["business-profile", businessId],
    queryFn: () => fetchBusinessesByID(businessId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60,
    retry: false
  });
};
