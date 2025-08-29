// src/features/orders/hooks/useCreateOrder.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchCreateAddress,
  fetchCreateOrder,
  fetchUserAddresses,
} from "../api/catalog-api";
import { Address, AddressCreateDto } from "../types/address";

export const useAddress = () => {
  return useMutation<AddressCreateDto, Error, Address>({
    mutationFn: fetchCreateAddress,
  });
};

export const useAddresses = (userId?: string) => {
  return useQuery<AddressCreateDto[]>({
    queryKey: ["addresses", userId],
    queryFn: () => fetchUserAddresses(userId!),
    enabled: !!userId, // solo ejecuta si hay userId
    refetchOnWindowFocus: false, // ❌ no refetch al cambiar de pestaña
    refetchOnReconnect: false, // ❌ no refetch al reconectarse
    staleTime: 1000 * 60 * 60, // ✅ los datos se consideran "frescos" por 1 hora
  });
};
