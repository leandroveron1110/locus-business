// src/lib/hooks/useGlobalImageSync.ts
import { useUserDataSync } from "./useUserDataSync";
import { fetchImageGlobal } from "@/features/catalog/api/catalog-api";
import { IGlobalImage } from "@/types/global-image";
import { useGlobalImageStore } from "./globalImageStore";

type GlobalImageEntity = IGlobalImage;

/**
 * Hook especializado para sincronizar la caché de imágenes globales.
 * Permite pasar el query dinámicamente en cada ejecución.
 */
export const useGlobalImageSync = () => {
  const store = useGlobalImageStore.getState();
  const { setSyncedGlobalImage } = useGlobalImageStore();

  // 🔹 Definimos la función que se pasará a useUserDataSync
  const fetcher = async (lastSyncTime: string | undefined, query?: string) => {
    return fetchImageGlobal({ lastSyncTime, query });
  };

  const syncOptions = {
    getLastSyncTime: store.getLastSyncTime,
    getItems: store.getGlobalImage,
    setSyncedItems: (items: GlobalImageEntity[], latestTimestamp: string) => {
      setSyncedGlobalImage(items, latestTimestamp);
    },
    // ⚠️ Pasamos un "wrapper" que recibe la query de forma dinámica
    fetchUpdatedItems: (lastSyncTime: string | undefined) =>
      fetcher(lastSyncTime),
    entityName: "Global Images",
  };

  const { syncData } = useUserDataSync<GlobalImageEntity>(syncOptions);

  /**
   * 🚀 Nueva función que permite pasar `query` solo cuando querés buscar.
   */
  const syncGlobalImages = async (query?: string) => {
    const lastSyncTime = store.getLastSyncTime();
    const res = await fetcher(lastSyncTime, query);
    setSyncedGlobalImage(res.items, res.latestTimestamp);
    return res;
  };

  return { syncGlobalImages };
};
