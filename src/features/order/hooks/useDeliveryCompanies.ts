// src/features/business/hooks/useDeliveryCompanies.ts
import { useQuery } from "@tanstack/react-query";
import { fetchDeliveryCompany } from "../api/catalog-api";
import { ApiResult } from "@/lib/apiFetch";
import { ICompany } from "../types/company";
import { ApiError } from "@/types/api";

export const useDeliveryCompanies = () => {
  return useQuery<ApiResult<ICompany[]>, ApiError>({
    queryKey: ["delivery-companies"],
    queryFn: fetchDeliveryCompany,
    staleTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};
