import { useQuery } from "@tanstack/react-query";
import { fetchBusinessCategories, fetchBusinessTags } from "../api/searchApi";

export const useCategoriesTags = (businessId: string) => {
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
