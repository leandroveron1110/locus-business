import { useEffect, useMemo, useCallback, useRef } from "react";
import {
  Notification,
  useBusinessNotificationsStore,
} from "@/features/common/hooks/useBusinessNotificationsStore";
import { syncNewNotificationOrders } from "../api/searchApi";
import { formatPrice } from "@/features/common/utils/formatPrice";

export const useInitialNotificationLoad = (businessIds: string[]) => {
  const setSyncedNotifications = useBusinessNotificationsStore(
    (s) => s.setSyncedNotifications
  );
  const getNotifications = useBusinessNotificationsStore(
    (s) => s.getNotifications
  );
  const storeLastSyncTimes = useBusinessNotificationsStore(
    (s) => s.lastSyncTimes
  );

  // 🧠 Evita recomputar si los mismos businessIds se mantienen
  const syncTimesMap = useMemo(() => {
    return businessIds.reduce<Record<string, string | null>>((acc, businessId) => {
      acc[businessId] =
        storeLastSyncTimes[businessId] !== undefined
          ? storeLastSyncTimes[businessId]
          : null;
      return acc;
    }, {});
  }, [businessIds.join(","), storeLastSyncTimes]); // join evita triggers por cambio de referencia

  // 🚫 Previene múltiples llamadas simultáneas
  const isLoadingRef = useRef(false);

  const loadNotifications = useCallback(async () => {
    if (isLoadingRef.current || businessIds.length === 0) return;
    isLoadingRef.current = true;

    try {
      const { newOrders, latestTimestamp } = await syncNewNotificationOrders(syncTimesMap);

      if (Array.isArray(newOrders) && newOrders.length > 0) {
        const mergedNotifications: Record<string, Notification[]> = {};

        newOrders.forEach((order) => {
          const businessId = order.businessId;
          const notification: Notification = {
            id: order.id,
            message: `¡Orden pendiente #${order.id.slice(0, 8)}\n de ${
              order.customerName?.toUpperCase() || "Cliente"
            }! \n Precio: ${formatPrice(order.total)}`,
            createdAt: order.createdAt,
            type: "NEW_ORDER",
          };

          if (!mergedNotifications[businessId]) {
            mergedNotifications[businessId] = getNotifications(businessId) || [];
          }

          // Evitar duplicados si ya existe la notificación
          const exists = mergedNotifications[businessId].some(
            (n) => n.id === notification.id
          );
          if (!exists) {
            mergedNotifications[businessId].unshift(notification);
          }
        });

        businessIds.forEach((businessId) => {
          const finalNotifications =
            mergedNotifications[businessId] || getNotifications(businessId) || [];

          setSyncedNotifications(businessId, finalNotifications, latestTimestamp);
        });
      }
    } catch (error) {
      console.error("Error cargando notificaciones iniciales:", error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [businessIds.join(","), getNotifications, setSyncedNotifications, syncTimesMap]);

  // ⚙️ Solo cargar una vez cuando hay IDs válidos
  useEffect(() => {
    if (businessIds.length > 0) {
      loadNotifications();
    }
  }, [loadNotifications]);
};
