// src/features/business/hooks/useBusinessProfile.ts
import { useQuery } from "@tanstack/react-query";
import { fetchCatalogByBusinessID } from "../api/catalog-api";
import { ApiResult } from "@/lib/apiFetch";
import { IMenu } from "../types/catlog";
import { ApiError } from "@/types/api";

export const useCatalg = (businessId: string) => {
  return useQuery<ApiResult<IMenu[]>, ApiError>({
    queryKey: ["menu-catalog", businessId],
    queryFn: () => fetchCatalogByBusinessID(businessId),
    enabled: !!businessId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false, 
    staleTime: 1000 * 60 * 60, 
    retry: false, 
  });
};
