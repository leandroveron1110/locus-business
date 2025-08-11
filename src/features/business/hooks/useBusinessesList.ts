import { useQuery } from "@tanstack/react-query";
import { fetchBusinesses } from "../api/businessApi";

export const useBusinessesList = () => {
  return useQuery({
    queryKey: ["businesses"],
    queryFn: fetchBusinesses,
  });
};
