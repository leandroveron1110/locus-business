// src/stores/useBusinessNotificationsStore.ts (VERSIÓN CON SYNC INCREMENTAL)

import { create } from "zustand";
import { immer } from "zustand/middleware/immer"; // 💡 Importar Immer

export type NotificationType = "NEW_ORDER" | "STOCK_LOW" | "NEW_MESSAGE";

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  type: NotificationType;
}

type LastSyncTimes = Record<string, string | undefined>;
type NotificationsMap = Record<string, Notification[] | undefined>; // Permite undefined

interface NotificationsState {
  notificationsMap: NotificationsMap;
  lastSyncTimes: LastSyncTimes;

  // ⚙️ SELECTORES
  getLastSyncTime: (businessId: string) => string | undefined;
  getNotifications: (businessId: string) => Notification[] | undefined; // Retorna undefined si no hay
  // ⚙️ ACCIONES DE SINCRONIZACIÓN
  setSyncedNotifications: (
    businessId: string,
    notifications: Notification[],
    latestTimestamp: string
  ) => void;

  // ⚙️ ACCIONES DE MUTACIÓN
  addNotification: (businessId: string, n: Notification) => void;
  clearNotifications: (businessId: string) => void;
  clearAllNotifications: () => void;
  clearNotificationsByType: (
    businessId: string,
    type: NotificationType
  ) => void;
}

export const useBusinessNotificationsStore = create<NotificationsState>()(
  immer((set, get) => ({
    notificationsMap: {},
    lastSyncTimes: {}, // 💡 Inicializar el mapa de tiempos

    // ⚙️ SELECTORES IMPLEMENTADOS
    getLastSyncTime: (businessId) => get().lastSyncTimes[businessId],
    // Se cambia para retornar 'undefined' si no existe, coherente con el mapa
    getNotifications: (businessId) => get().notificationsMap[businessId],

    // 🎯 FUNCIÓN CLAVE PARA LA CACHÉ/SINCRONIZACIÓN
    setSyncedNotifications: (businessId, notifications, latestTimestamp) => {
      set((state) => {
        // 1. Guardar el array completo de notificaciones
        state.notificationsMap[businessId] = notifications;
        // 2. Guardar el nuevo tiempo de sincronización
        state.lastSyncTimes[businessId] = latestTimestamp;
      });
    },

    // ⚙️ ACCIONES DE MUTACIÓN (Refactorizadas para usar Immer)
    addNotification: (businessId, newNotification) =>
      set((state) => {
        const existing = state.notificationsMap[businessId];
        // Inicializar si no existe, usando mutación de Immer
        if (!existing) {
          state.notificationsMap[businessId] = [newNotification];
          return;
        }

        // 🔹 Validar duplicados por `id`
        const alreadyExists = existing.some((n) => n.id === newNotification.id);
        if (alreadyExists) return;

        // Agregar al inicio
        existing.unshift(newNotification);
      }),

    clearNotifications: (businessId) =>
      set((state) => {
        state.notificationsMap[businessId] = [];
      }),

    clearAllNotifications: () =>
      set((state) => {
        state.notificationsMap = {};
        state.lastSyncTimes = {}; // 💡 Limpiar también los tiempos
      }),

    clearNotificationsByType: (businessId, typeToClear) =>
      set((state) => {
        const existingNotifications = state.notificationsMap[businessId];

        if (!existingNotifications) return;

        // Filtrar
        const filteredNotifications = existingNotifications.filter(
          (n) => n.type !== typeToClear
        );

        // Si no hubo cambios, retornar
        if (filteredNotifications.length === existingNotifications.length)
          return;

        // Reemplazar el array mutando el estado
        state.notificationsMap[businessId] = filteredNotifications;
      }),
  }))
);
