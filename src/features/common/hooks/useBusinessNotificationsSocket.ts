import { useEffect } from "react";
import { useBusinessSocket } from "@/features/common/hooks/useBusinessSocket";
import { formatPrice } from "@/features/common/utils/formatPrice";
import { useBusinessNotificationsStore } from "./useBusinessNotificationsStore";

export function useBusinessNotificationsSocket(businessId: string | undefined) {
  const socket = useBusinessSocket(businessId);

  const addNotification = useBusinessNotificationsStore(
    (s) => s.addNotification
  );

  useEffect(() => {
    if (!socket || !businessId) return; // Aseguramos que businessId exista

    socket.on("new_order_notification", (data: {
      orderId: string;
      customerName: string;
      total: string;
      createdAt: string;
    }) => {
      addNotification(businessId, {
        id: data.orderId,
        message: `¡Nueva Orden #${data.orderId.slice(0, 8)} de ${data.customerName.toUpperCase() || 'Cliente'}! \n
            de ${formatPrice(data.total)}`,
        createdAt: data.createdAt,
        type: 'NEW_ORDER'
      });
    });

    return () => {
      socket.off("new_order_notification");
    };
  }, [socket, addNotification, businessId]); // businessId es una dependencia
}