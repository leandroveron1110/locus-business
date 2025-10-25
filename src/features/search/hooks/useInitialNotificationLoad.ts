import { useBusinessNotificationsStore } from "@/features/common/hooks/useBusinessNotificationsStore";
import { useEffect, useRef } from "react";
import { getNewNotificationOrders } from "../api/searchApi";
import { formatPrice } from "@/features/common/utils/formatPrice";

export const useInitialNotificationLoad = (businessIds: string[]) => {
  const { addNotification } = useBusinessNotificationsStore();
  const hasLoadedRef = useRef(false);

  const loadNotifications = async () => {
    if (hasLoadedRef.current) {
      return;
    }

    if (businessIds.length === 0) {
      return;
    }

    try {
      const result = await getNewNotificationOrders(businessIds);

      if (result) {
        result.forEach((order) => {
          addNotification(order.businessId, {
            id: order.id,
            message: `¡Orden pendiente #${order.id.slice(0, 8)}\n de ${
              order.customerName.toUpperCase() || "Cliente"
            }! \n Precio: ${formatPrice(order.total)}`,
            createdAt: order.createdAt,
            type: "NEW_ORDER",
          });
        });
      }

      hasLoadedRef.current = true;
    } catch (error) {
      console.error("Error cargando las notificaciones iniciales:", error);
    }
  };

  useEffect(() => {
    if (businessIds.length > 0) {
      loadNotifications();
    }

  }, [businessIds.length]);
};
