// src/stores/useGlobalImageStore.ts (CON PERSISTENCIA)

import { create } from "zustand";
import { IGlobalImage } from "@/types/global-image";
import { immer } from "zustand/middleware/immer";
// 💡 IMPORTANTE: Importar el middleware 'persist'
import { persist, createJSONStorage } from "zustand/middleware"; 


interface IGlobalImageState {
  lastSyncTime: string | undefined;
  imageGlobal: IGlobalImage[];
}

interface IGlobalImageActions {
  getGlobalImage: () => IGlobalImage[];
  getLastSyncTime: () => string | undefined;
  setSyncedGlobalImage: (
    newImages: IGlobalImage[],
    latestTimestamp: string
  ) => void;
  addGlobalImage: (image: IGlobalImage) => void;
  clearGlobalImage: () => void;
}

type IGlobalImageStore = IGlobalImageState & IGlobalImageActions;


// Usamos el middleware 'immer' y lo envolvemos con 'persist'
export const useGlobalImageStore = create<IGlobalImageStore>()(
  // 1. Envolvemos 'immer' con 'persist'
  persist(
    immer((set, get) => ({
      // --- ESTADO INICIAL ---
      lastSyncTime: undefined,
      imageGlobal: [],

      // --- SELECTORES (MÉTODOS GETTER) ---
      getGlobalImage: () => get().imageGlobal,
      getLastSyncTime: () => get().lastSyncTime,

      setSyncedGlobalImage: (newImages, latestTimestamp) => {
        set((state) => {
          const updatedImagesMap = new Map<string, IGlobalImage>();

          // 1. Llenar el mapa con los ítems actuales del store
          state.imageGlobal.forEach((img) => updatedImagesMap.set(img.id, img));

          // 2. Sobrescribir (actualizar) o añadir los ítems nuevos/modificados
          newImages.forEach((newImg) => {
            updatedImagesMap.set(newImg.id, newImg);
          });

          // 3. Convertir el mapa de vuelta al array para el estado
          state.imageGlobal = Array.from(updatedImagesMap.values());

          // 4. Actualizar el timestamp
          state.lastSyncTime = latestTimestamp;
        });
      },

      addGlobalImage: (image) => {
        set((state) => {
          const existingIndex = state.imageGlobal.findIndex(
            (img) => img.id === image.id
          );

          if (existingIndex !== -1) {
            state.imageGlobal[existingIndex] = image;
          } else {
            state.imageGlobal.unshift(image);
          }
        });
      },

      clearGlobalImage: () => {
        set((state) => {
          state.lastSyncTime = undefined;
          state.imageGlobal = [];
        });
      },
    })),
    {
      name: "global-image-storage", 
      storage: createJSONStorage(() => localStorage), 
      // Opcional: Especifica qué partes del estado persistir (útil si hay datos grandes/sensibles)
      // En tu caso, persistiremos todo: lastSyncTime e imageGlobal
      // partialize: (state) => ({ imageGlobal: state.imageGlobal, lastSyncTime: state.lastSyncTime }),
    }
  )
);