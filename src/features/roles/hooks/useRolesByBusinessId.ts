// src/features/roles/hooks/useRolesByBusinessId.ts
import { useQuery } from "@tanstack/react-query";
import { getRolesByBusinessIdApi } from "../api/roles-api";
import { BusinessRole } from "../types/roles";
import { ApiResult } from "@/lib/apiFetch";
import { ApiError } from "@/types/api";

export const useRolesByBusinessId = (businessId: string) => {
  return useQuery<ApiResult<BusinessRole[]>, ApiError>({
    queryKey: ["roles", businessId],
    queryFn: () => getRolesByBusinessIdApi(businessId),
    enabled: !!businessId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};
