// src/features/orders/hooks/useCreateOrder.ts
import { useMutation } from "@tanstack/react-query";
import { CreateOrderFull } from "../types/order";
import { fetchCreateOrder } from "../api/catalog-api";

export const useCreateOrder = () => {
  return useMutation<any, Error, CreateOrderFull>({
    mutationFn: fetchCreateOrder,
  });
};
