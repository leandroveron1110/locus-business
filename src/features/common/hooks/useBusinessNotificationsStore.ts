import { create } from "zustand";

export type NotificationType = 'NEW_ORDER' | 'STOCK_LOW' | 'NEW_MESSAGE';

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  type: NotificationType;
}

interface NotificationsState {
  notificationsMap: Record<string, Notification[]>;

  addNotification: (businessId: string, n: Notification) => void;
  clearNotifications: (businessId: string) => void;
  clearAllNotifications: () => void;
  getNotifications: (businessId: string) => Notification[];
  clearNotificationsByType: (businessId: string, type: NotificationType) => void;
}

export const useBusinessNotificationsStore = create<NotificationsState>((set, get) => ({
  notificationsMap: {},

  addNotification: (businessId, newNotification) =>
    set((state) => {
      const existing = state.notificationsMap[businessId] ?? [];

      // 🔹 Validar duplicados por `id`
      const alreadyExists = existing.some(n => n.id === newNotification.id);
      if (alreadyExists) return state;

      return {
        notificationsMap: {
          ...state.notificationsMap,
          [businessId]: [newNotification, ...existing],
        },
      };
    }),

  clearNotifications: (businessId) =>
    set((state) => ({
      notificationsMap: {
        ...state.notificationsMap,
        [businessId]: [],
      },
    })),

  clearAllNotifications: () => set({ notificationsMap: {} }),

  getNotifications: (businessId) => get().notificationsMap[businessId] ?? [],

  clearNotificationsByType: (businessId, typeToClear) =>
    set((state) => {
      const existingNotifications = state.notificationsMap[businessId] ?? [];
      const filteredNotifications = existingNotifications.filter(
        (n) => n.type !== typeToClear
      );

      if (filteredNotifications.length === existingNotifications.length) return state;

      return {
        notificationsMap: {
          ...state.notificationsMap,
          [businessId]: filteredNotifications,
        },
      };
    }),
}));
