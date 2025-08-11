import { useQuery } from "@tanstack/react-query";
import { fetchCommentsByBusinessId, fetchSummary, fetchSummarySudmi } from "../api/businessApi";
import { useState } from "react";

export const useRating = (businessId: string) => {
  return useQuery({
    queryKey: ["business-rating", businessId], // incluimos user?.id en la clave
    queryFn: () => fetchSummary(businessId),
    enabled: !!businessId, // solo si hay ambos
    refetchOnWindowFocus: false, // ❌ no refetch al cambiar de pestaña
    refetchOnReconnect: false, // ❌ no refetch al reconectarse
    staleTime: 1000 * 60 * 60, // ✅ los datos se consideran "frescos" por 1 hora
  });
};

export const useRatingComments = (businessId: string) => {
  return useQuery({
    queryKey: ["business-rating-comments", businessId], // incluimos user?.id en la clave
    queryFn: () => fetchCommentsByBusinessId(businessId),
    enabled: !!businessId, // solo si hay ambos
    refetchOnWindowFocus: false, // ❌ no refetch al cambiar de pestaña
    refetchOnReconnect: false, // ❌ no refetch al reconectarse
    staleTime: 1000 * 60 * 60, // ✅ los datos se consideran "frescos" por 1 hora
  });
};

interface UseSubmitRatingOptions {
  businessId: string;
  userId: string | null;
  onSuccess?: () => void;
}

export function useSubmitRating({
  businessId,
  userId,
  onSuccess,
}: UseSubmitRatingOptions) {
  const [loading, setLoading] = useState(false);

  const submit = async (value: number, comment: string) => {
    if (!value || !userId) return;

    try {
      setLoading(true);
      await fetchSummarySudmi(businessId, userId, value, comment);

      onSuccess?.();
    } catch (error) {
      console.error("Error al enviar calificación:", error);
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading };
}
