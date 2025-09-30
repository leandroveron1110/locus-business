// hooks/useFetchBusinessOrders.ts
import { useEffect } from "react";
import { useBusinessOrdersStore } from "./useBusinessOrdersStore";
import { fetchOrdersByBusinessId } from "../api/catalog-api";
import { Order } from "../types/order";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

export function useFetchBusinessOrders(businessId: string) {
  const addOrder = useBusinessOrdersStore((s) => s.addOrder);
  const { addAlert } = useAlert();

  useEffect(() => {
    if (!businessId) return;

    fetch();
  }, [businessId, addOrder]);

  const fetch = async () => {
    try {
      const res = await fetchOrdersByBusinessId(businessId);
      if (res) {
        res.forEach((order: Order) => addOrder(order));
      }
    } catch (error: unknown) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  };
}
