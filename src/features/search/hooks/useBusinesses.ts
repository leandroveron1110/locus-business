import { useQuery } from "@tanstack/react-query";
import { getBusinessesByIds } from "../api/searchApi";
import { ApiResult } from "@/lib/apiFetch";
import { ISearchBusiness } from "../types/search";
import { ApiError } from "@/types/api";


export const useBusinesses = (ids: string[]) => {
  return useQuery<ApiResult<ISearchBusiness>, ApiError>({
    queryKey: ["businesses", ids],
    queryFn: () => getBusinessesByIds(ids),
    enabled: ids.length > 0, // solo ejecuta si hay ids
  });
};