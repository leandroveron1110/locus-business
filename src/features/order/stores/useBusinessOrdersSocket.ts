// hooks/useBusinessOrdersSocket.ts
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useBusinessOrdersStore } from "./useBusinessOrdersStore";
import { Order, PaymentStatus } from "../types/order";

export function useBusinessOrdersSocket(businessId: string) {
  const addOrder = useBusinessOrdersStore((s) => s.addOrder);
  const updateOrderStatus = useBusinessOrdersStore((s) => s.updateOrderStatus);
  const updatePaymentStatus = useBusinessOrdersStore(
    (s) => s.updatePaymentStatus
  );

  useEffect(() => {
    if (!businessId) return;

    const socket: Socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Conectado al socket como negocio", socket.id);
      socket.emit("join_role", { role: "business", id: businessId });
    });

    socket.on("new_order", (order: Order) => {
      console.log("Nueva orden recibida:", order);
      addOrder(order);
    });

    socket.on(
      "order_status_updated",
      (data: { orderId: string; status: string }) => {
        console.log("Estado de orden actualizado:", data);
        updateOrderStatus(data.orderId, data.status);
      }
    );

    socket.on(
      "payment_updated",
      (data: {
        orderId: string;
        paymentStatus: string;
        paymentReceiptUrl: string;
      }) => {
        console.log("Estado de pago actualizado:", data);
        updatePaymentStatus(
          data.orderId,
          data.paymentStatus as PaymentStatus,
          data.paymentReceiptUrl
        );
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [businessId, addOrder, updateOrderStatus]);
}
