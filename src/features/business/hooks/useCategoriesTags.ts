import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchBusinessTags,
  fetchBusinessCategories,
  fetchGetTags,
  fetchGetCategories,
  updateBusinessCategories,
  updateBusinessTags,
} from "../api/businessApi";

export const useCategoriesTagsByBusinessId = (businessId: string) => {
  return useQuery({
    queryKey: ["business-category-tag", businessId],
    queryFn: async () => {
      const [tags, categories] = await Promise.all([
        fetchBusinessTags(businessId),
        fetchBusinessCategories(businessId),
      ]);
      return { tags, categories }; // 👈 lo devolvés como objeto
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60,
  });
};

export const useCategoriesTags = () => {
  return useQuery({
    queryKey: ["business-category-tag"],
    queryFn: async () => {
      const [tags, categories] = await Promise.all([
        fetchGetTags(),
        fetchGetCategories(),
      ]);
      return { tags, categories }; // 👈 lo devolvés como objeto
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60,
  });
};

export function useUpdateCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      categoryIds,
    }: {
      businessId: string;
      categoryIds: string[];
    }) => updateBusinessCategories(businessId, categoryIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["business-categories-tags", variables.businessId],
      });
    },
    onError: (error) => {
      // Aquí puedes manejar el error, por ejemplo, mostrando una notificación
      console.error("Error updating categories:", error);
    },
  });
}

export function useUpdateTags() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      businessId,
      tagIds,
    }: {
      businessId: string;
      tagIds: string[];
    }) => updateBusinessTags(businessId, tagIds),
    onSuccess: (_, variables) => {
      // Invalida la caché de los datos del negocio para que se refetchee
      // y obtenga los tags actualizados del backend.
      queryClient.invalidateQueries({
        queryKey: ["business-categories-tags", variables.businessId],
      });
    },
    onError: (error) => {
      console.error("Error updating tags:", error);
    },
  });
}
