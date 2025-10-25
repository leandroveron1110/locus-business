import { useCallback, useMemo } from "react";
import { NotificationType, useBusinessNotificationsStore } from "../../common/hooks/useBusinessNotificationsStore";

export const useNotifications = (businessId: string) => {
  const {
    getNotifications,
    addNotification,
    clearNotifications,
  } = useBusinessNotificationsStore();

  // 🧩 Obtenemos las notificaciones de este negocio (si no existen, array vacío)
  const notifications = useMemo(
    () => getNotifications(businessId),
    [businessId, getNotifications]
  );

  const clear = useCallback(() => {
    clearNotifications(businessId);
  }, [businessId, clearNotifications]);

  // ✉️ Agregar una nueva notificación
  const add = useCallback(
    (n: { id: string; message: string; createdAt: string, type: NotificationType }) => {
      addNotification(businessId, n);
    },
    [businessId, addNotification]
  );

  return { notifications, add, clear };
};
