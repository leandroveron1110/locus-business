// src/features/business/hooks/useBusinessProfile.ts
import { useQuery } from "@tanstack/react-query";
import { fetchBusinessesByID } from "../api/businessApi";
import { useAuthStore } from "@/features/auth/store/authStore";

export const useBusinessProfile = (businessId: string) => {
  return useQuery({
    queryKey: ["business-profile", businessId], // incluimos user?.id en la clave
    queryFn: () => fetchBusinessesByID(businessId),
    enabled: !!businessId, // solo si hay ambos
    refetchOnWindowFocus: false, // ❌ no refetch al cambiar de pestaña
    refetchOnReconnect: false, // ❌ no refetch al reconectarse
    staleTime: 1000 * 60 * 60, // ✅ los datos se consideran "frescos" por 1 hora
  });
};
