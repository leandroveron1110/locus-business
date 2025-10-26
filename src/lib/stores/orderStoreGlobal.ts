// src/stores/useGlobalBusinessOrdersStore.ts

import { Order, OrderStatus, PaymentStatus } from "@/types/order";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

// 💡 Tipo: Un mapa de arrays de órdenes, donde el valor puede ser undefined
type OrdersByBusiness = Record<string, Order[] | undefined>;
type LastSyncTimes = Record<string, string | undefined>;

interface GlobalOrdersState {
  businessOrders: OrdersByBusiness;
  lastSyncTimes: LastSyncTimes;

  // Acciones:
  getOrders: (businessId: string) => Order[] | undefined;
  getOrderById: (businessId: string, orderId: string) => Order | undefined;
  setOrdersForBusiness: (
    businessId: string,
    orders: Order[],
    syncTime: string
  ) => void; // 💡 La función ahora acepta syncTime
  getLastSyncTime: (businessId: string) => string | undefined;

  addOrder: (businessId: string, order: Order) => void;
  updateOrder: (businessId: string, order: Order) => void;
  updateOrderStatus: (
    businessId: string,
    orderId: string,
    status: string
  ) => void;
  updatePaymentStatus: (
    businessId: string,
    orderId: string,
    newPaymentStatus: PaymentStatus,
    paymentReceiptUrl: string
  ) => void;
  reset: () => void;
}

export const useGlobalBusinessOrdersStore = create<GlobalOrdersState>()(
  immer((set, get) => ({
    businessOrders: {},
    lastSyncTimes: {},

    // 🎯 NUEVO GETTER
    getLastSyncTime: (businessId) => get().lastSyncTimes[businessId],

    getOrderById: (businessId, orderId) => {
        return get().businessOrders[businessId]?.find(o => o.id === orderId);
    },

    // 🎯 SETTER ACTUALIZADO para guardar los datos Y la marca de tiempo
    setOrdersForBusiness: (businessId, orders, syncTime) => {
      set((state) => {
        // 1. Guardar las órdenes
        state.businessOrders[businessId] = orders;
        // 2. Guardar la marca de tiempo
        state.lastSyncTimes[businessId] = syncTime;
      });
    },
    // ⚙️ SELECTOR (para usar con useMemo en el componente)
    getOrders: (businessId) => get().businessOrders[businessId],

    // ⚙️ AGREGAR ORDEN (Usado para sockets o nuevas sincronizaciones)
    addOrder: (businessId, order) => {
      set((state) => {
        const orders = state.businessOrders[businessId];
        // Inicializar el array si no existe
        if (!orders) {
          state.businessOrders[businessId] = [order];
          return;
        }

        // Evitar duplicados y agregar al inicio (LIFO: Last In, First Out)
        if (!orders.some((o) => o.id === order.id)) {
          orders.unshift(order);
        }
      });
    },

    // ⚙️ ACTUALIZAR ORDEN COMPLETA (Usado para sincronización incremental)
    updateOrder: (businessId, updatedOrder) => {
      set((state) => {
        const orders = state.businessOrders[businessId];
        if (!orders) return;

        const index = orders.findIndex((o) => o.id === updatedOrder.id);
        if (index !== -1) {
          // Sobrescribir la orden si se encuentra
          orders[index] = updatedOrder;
        } else {
          // Si no existe (orden nueva), la añadimos
          orders.unshift(updatedOrder);
        }
      });
    },

    // ⚙️ ACTUALIZAR SOLO EL ESTADO DE ORDEN
    updateOrderStatus: (businessId, orderId, status) => {
      set((state) => {
        const orders = state.businessOrders[businessId];
        if (!orders) return;

        const order = orders.find((o) => o.id === orderId);
        if (order) {
          order.status = status as OrderStatus;
        }
      });
    },

    // ⚙️ ACTUALIZAR ESTADO DE PAGO Y RECIBO
    updatePaymentStatus: (
      businessId,
      orderId,
      newPaymentStatus,
      paymentReceiptUrl
    ) => {
      set((state) => {
        const orders = state.businessOrders[businessId];
        if (!orders) return;

        const order = orders.find((o) => o.id === orderId);
        if (order) {
          order.paymentStatus = newPaymentStatus;
          order.paymentReceiptUrl = paymentReceiptUrl;
        }
      });
    },

    // ⚙️ RESETEAR TODO EL CACHÉ GLOBAL
    reset: () => {
      set((state) => {
        state.businessOrders = {};
      });
    },
  }))
);
