import { useQuery } from "@tanstack/react-query";
import { getBusinessesByIds } from "../api/searchApi";


export const useBusinesses = (ids: string[]) => {
  return useQuery({
    queryKey: ["businesses", ids],
    queryFn: () => getBusinessesByIds(ids),
    enabled: ids.length > 0, // solo ejecuta si hay ids
  });
};