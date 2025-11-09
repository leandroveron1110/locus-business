// src/lib/hooks/useGlobalImageSearch.ts

import { useCallback } from "react";
import { fetchImageGlobal } from "@/features/catalog/api/catalog-api"; 
import { useGlobalImageStore } from "@/lib/stores/globalImageStore";

/**
 * Hook especializado para la búsqueda y sincronización manual de imágenes globales.
 * Implementa la lógica condicional para enviar o no el lastSyncTime.
 */
export const useGlobalImageSearch = () => {
    
    // Obtenemos el objeto del store y la función de acción
    const store = useGlobalImageStore.getState();
    const { setSyncedGlobalImage } = useGlobalImageStore(); 

    /**
     * @function syncImages
     * Dispara la sincronización/búsqueda.
     * @param query - Opcional. El texto de búsqueda.
     */
    const syncImages = useCallback(async (query?: string) => {
        
        try {
            // 🔑 LÓGICA CONDICIONAL CLAVE:
            let lastSyncTimeToSend: string | undefined;

            if (query && query.trim() !== "") {
                // 1. HAY BÚSQUEDA: No se envía el lastSyncTime.
                // Esto fuerza a la API a buscar en todo el catálogo y trae todos los resultados.
                lastSyncTimeToSend = undefined;
                console.log(`[Sync Global Images] Búsqueda. Query: ${query}. Enviando lastSyncTime: undefined`);
            } else {
                // 2. SIN BÚSQUEDA (Sync Inicial/Incremental): Se envía el lastSyncTime del store.
                // Esto permite la sincronización incremental eficiente (solo trae ítems nuevos/modificados).
                lastSyncTimeToSend = store.getLastSyncTime();
                console.log(`[Sync Global Images] Sync. Enviando lastSyncTime: ${lastSyncTimeToSend || "undefined"}`);
            }
            
            // 2. Llamar a la API con el lastSyncTime condicional y el query
            const res = await fetchImageGlobal({ lastSyncTime: lastSyncTimeToSend, query });
            
            // 3. Delegar la actualización y FUSIÓN al Store
            // El Store (setSyncedGlobalImage) maneja el MERGE y actualiza el timestamp.
            setSyncedGlobalImage(res.items, res.latestTimestamp);
            
            return res;

        } catch (error) {
            throw error; 
        }

    }, [setSyncedGlobalImage, store]); 

    return { syncGlobalImages: syncImages };
};