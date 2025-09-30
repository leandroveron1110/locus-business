// src/features/business/hooks/useBusinessProfile.ts
import { useQuery } from "@tanstack/react-query";
import { fetchFollowers } from "../api/businessApi";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ApiResult } from "@/lib/apiFetch";
import { BusinessFollow } from "../types/business";
import { ApiError } from "@/types/api";

export const useFollowInfo = (businessId: string) => {
  const user = useAuthStore((state) => state.user);

  return useQuery<ApiResult<BusinessFollow>, ApiError>({
    queryKey: ["business-follow", businessId], // incluimos user?.id en la clave
    queryFn: () => fetchFollowers(businessId, user?.id),
    enabled: !!businessId, // solo si hay ambos
    refetchOnWindowFocus: false, // ❌ no refetch al cambiar de pestaña
    refetchOnReconnect: false, // ❌ no refetch al reconectarse
    staleTime: 1000 * 60 * 60, // ✅ los datos se consideran "frescos" por 1 hora
  });
};
