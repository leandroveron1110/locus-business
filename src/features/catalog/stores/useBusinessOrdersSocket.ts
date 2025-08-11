// hooks/useBusinessOrdersSocket.ts
import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useBusinessOrdersStore } from "../stores/useBusinessOrdersStore";
import { Order } from "../types/order";

export function useBusinessOrdersSocket(businessId: string) {
  const addOrder = useBusinessOrdersStore((s) => s.addOrder);
  const updateOrderStatus = useBusinessOrdersStore((s) => s.updateOrderStatus);

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

    socket.on("order_status_updated", (data: { orderId: string; status: string }) => {
      console.log("Estado de orden actualizado:", data);
      updateOrderStatus(data.orderId, data.status);
    });

    return () => {
      socket.disconnect();
    };
  }, [businessId, addOrder, updateOrderStatus]);
}
