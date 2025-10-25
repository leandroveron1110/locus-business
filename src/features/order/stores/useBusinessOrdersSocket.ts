import { useEffect } from "react";
import { useBusinessOrdersStore } from "../stores/useBusinessOrdersStore";
import { Order } from "../types/order";
import { useBusinessSocket } from "@/features/common/hooks/useBusinessSocket";

export function useBusinessOrdersSocket(businessId: string) {
  const socket = useBusinessSocket(businessId);
  const addOrder = useBusinessOrdersStore((s) => s.addOrder);
  const updateOrderStatus = useBusinessOrdersStore((s) => s.updateOrderStatus);
  const updatePaymentStatus = useBusinessOrdersStore((s) => s.updatePaymentStatus);

  useEffect(() => {

    if (!socket) return;

    socket.on("new_order", (order: Order) => {
      addOrder(order);
    });

    socket.on("order_status_updated", (data) => {
      updateOrderStatus(data.orderId, data.status);
    });

    socket.on("payment_updated", (data) => {
      updatePaymentStatus(data.orderId, data.paymentStatus, data.paymentReceiptUrl);
    });

    return () => {
      socket.off("new_order");
      socket.off("order_status_updated");
      socket.off("payment_updated");
    };
  }, [addOrder, updateOrderStatus, updatePaymentStatus, socket]);
}
