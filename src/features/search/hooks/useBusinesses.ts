import { useQuery } from "@tanstack/react-query";
import { getBusinessesByIds, getNewNotificationOrders, OrderNotification } from "../api/searchApi";
import { ApiResult } from "@/lib/apiFetch";
import { ISearchBusiness } from "../types/search";
import { ApiError } from "@/types/api";

export const useBusinesses = (ids: string[]) => {
  return useQuery<ApiResult<ISearchBusiness>, ApiError>({
    queryKey: ["businesses", ids],
    queryFn: () => getBusinessesByIds(ids),
    enabled: ids.length > 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};

export const useBusinessesNotifications = (ids: string[]) => {
  return useQuery<ApiResult<OrderNotification[]>, ApiError>({
    queryKey: ["businesses", ids],
    queryFn: () => getNewNotificationOrders(ids),
    enabled: ids.length > 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};
