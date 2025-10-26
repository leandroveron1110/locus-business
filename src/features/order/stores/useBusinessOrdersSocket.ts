import { useEffect } from "react";
import { Order } from "../types/order";
import { useBusinessSocket } from "@/features/common/hooks/useBusinessSocket";
import { useGlobalBusinessOrdersStore } from "@/lib/stores/orderStoreGlobal";

export function useBusinessOrdersSocket(businessId: string) {
  const socket = useBusinessSocket(businessId);
  const addOrder = useGlobalBusinessOrdersStore((s) => s.addOrder);
  const updateOrderStatus = useGlobalBusinessOrdersStore(
    (s) => s.updateOrderStatus
  );
  const updatePaymentStatus = useGlobalBusinessOrdersStore(
    (s) => s.updatePaymentStatus
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("new_order", (order: Order) => {
      addOrder(businessId, order);
    });

    socket.on("order_status_updated", (data) => {
      updateOrderStatus(businessId, data.orderId, data.status);
    });

    socket.on("payment_updated", (data) => {
      updatePaymentStatus(
        businessId,
        data.orderId,
        data.paymentStatus,
        data.paymentReceiptUrl
      );
    });

    return () => {
      socket.off("new_order");
      socket.off("order_status_updated");
      socket.off("payment_updated");
    };
  }, [addOrder, updateOrderStatus, updatePaymentStatus, socket]);
}
