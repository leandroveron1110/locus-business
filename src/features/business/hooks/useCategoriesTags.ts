import { useQuery } from "@tanstack/react-query";
import { fetchBusinessTags, fetchBusinessCategories, fetchGetTags, fetchGetCategories } from "../api/businessApi";

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
