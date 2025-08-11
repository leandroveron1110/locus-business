// src/features/business/hooks/useDeliveryCompanies.ts
import { useQuery } from "@tanstack/react-query";
import { fetchDeliveryCompany } from "../api/catalog-api";

export const useDeliveryCompanies = () => {
  return useQuery({
    queryKey: ["delivery-companies"],
    queryFn: fetchDeliveryCompany,
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
