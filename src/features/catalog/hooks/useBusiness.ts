// src/features/business/hooks/useBusinessProfile.ts
import { useQuery } from "@tanstack/react-query";
import { fetchBusinessID } from "../api/business-catalog-api";
import { ApiResult } from "@/lib/apiFetch";
import { Business } from "../types/business";
import { ApiError } from "@/types/api";

export const useBusinessProfile = (businessId: string) => {

  return useQuery<ApiResult<Business>, ApiError>({
    queryKey: ["business--catalog-profile", businessId], // incluimos user?.id en la clave
    queryFn: () => fetchBusinessID(businessId),
    enabled: !!businessId, // solo si hay ambos
    refetchOnWindowFocus: false, // ❌ no refetch al cambiar de pestaña
    refetchOnReconnect: false, // ❌ no refetch al reconectarse
    staleTime: 1000 * 60 * 60, // ✅ los datos se consideran "frescos" por 1 hora
  });
};
