// src/features/business/hooks/useBusinessProfile.ts
import { useQuery } from "@tanstack/react-query";
import { fetchBusinessSchedule } from "../api/businessApi";

export const useSchedule = (businessId: string) => {
  return useQuery({
    queryKey: ["business-schedule", businessId], // incluimos user?.id en la clave
    queryFn: () => fetchBusinessSchedule(businessId),
    enabled: !!businessId, // solo si hay ambos
    refetchOnWindowFocus: false, // ❌ no refetch al cambiar de pestaña
    refetchOnReconnect: false, // ❌ no refetch al reconectarse
    staleTime: 1000 * 60 * 60, // ✅ los datos se consideran "frescos" por 1 hora
  });
};
