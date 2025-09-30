// src/features/business/hooks/useBusinessProfile.ts
import { useQuery } from "@tanstack/react-query";
import { fetchBusinessGaleryBasic } from "../api/businessApi";
import { ApiResult } from "@/lib/apiFetch";
import { BusinessGalery } from "../types/business";
import { ApiError } from "@/types/api";

export const useGallery = (businessId: string) => {
  return useQuery<ApiResult<BusinessGalery[]>, ApiError>({
    queryKey: ["business-gallery", businessId], // incluimos user?.id en la clave
    queryFn: () => fetchBusinessGaleryBasic(businessId),
    enabled: !!businessId, // solo si hay ambos
    refetchOnWindowFocus: false, // ❌ no refetch al cambiar de pestaña
    refetchOnReconnect: false, // ❌ no refetch al reconectarse
    staleTime: 1000 * 60 * 60, // ✅ los datos se consideran "frescos" por 1 hora
  });
};
