// hooks/useFetchBusinessOrders.ts
import { useEffect } from "react";
import { useBusinessOrdersStore } from "../stores/useBusinessOrdersStore";
import { fetchOrdersByBusinessId } from "../api/catalog-api";

export function useFetchBusinessOrders(businessId: string) {
  const addOrder = useBusinessOrdersStore((s) => s.addOrder);

  useEffect(() => {
    if (!businessId) return;

    fetch();
  }, [businessId, addOrder]);

  const fetch = async () => {
    const res = await fetchOrdersByBusinessId(businessId);

    res.forEach((order: any) => addOrder(order));
  };
}
