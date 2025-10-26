import { useEffect, useRef, useCallback } from "react";
import { useGlobalBusinessOrdersStore } from "@/lib/stores/orderStoreGlobal";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { syncOrdersByBusinessId } from "../api/catalog-api";

export function useFetchBusinessOrders(businessId: string) {
  const getLastSyncTime = useGlobalBusinessOrdersStore((s) => s.getLastSyncTime);
  const setOrdersForBusiness = useGlobalBusinessOrdersStore((s) => s.setOrdersForBusiness);
  const getOrders = useGlobalBusinessOrdersStore((s) => s.getOrders);
  const { addAlert } = useAlert();

  const isSyncingRef = useRef(false); // 🚫 Evita llamadas simultáneas o loops

  const syncOrdersByBusiness = useCallback(async () => {
    if (!businessId || isSyncingRef.current) return;
    isSyncingRef.current = true;

    const lastSyncTime = getLastSyncTime(businessId);

    console.log(`[Sync] Iniciando sync para ${businessId}. Último tiempo: ${lastSyncTime || "N/A"}`);

    try {
      const res = await syncOrdersByBusinessId(businessId, lastSyncTime);

      if (!res) return;

      const { newOrUpdatedOrders, latestTimestamp } = res;
      const currentOrders = getOrders(businessId) || [];

      if (newOrUpdatedOrders.length > 0) {
        const existingMap = new Map(currentOrders.map((o) => [o.id, o]));
        newOrUpdatedOrders.forEach((updated) => existingMap.set(updated.id, updated));

        const mergedOrders = Array.from(existingMap.values());
        setOrdersForBusiness(businessId, mergedOrders, latestTimestamp);
      } else {
        console.log(
          `[Sync Success] No hay cambios. Último sync actualizado a ${latestTimestamp}`
        );
        // 💡 Solo actualizar si cambió el timestamp
        if (latestTimestamp !== lastSyncTime) {
          setOrdersForBusiness(businessId, currentOrders, latestTimestamp);
        }
      }
    } catch (error) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    } finally {
      isSyncingRef.current = false;
    }
  }, [businessId, getLastSyncTime, setOrdersForBusiness, getOrders, addAlert]);

  // 💡 Solo ejecuta una vez cuando cambia el negocio, no en cada timestamp
  useEffect(() => {
    if (!businessId) return;
    syncOrdersByBusiness();
  }, [businessId, syncOrdersByBusiness]);
}
