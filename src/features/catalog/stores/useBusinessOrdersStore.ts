// stores/useBusinessOrdersStore.ts
import { create } from "zustand";
import { Order } from "../types/order";
// import { Order } from "../types/order"; // Definí tu tipo Order según el backend

interface BusinessOrdersState {
  orders: Order[];
  addOrder: (order: any) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
}

export const useBusinessOrdersStore = create<BusinessOrdersState>((set) => ({
  orders: [],
  addOrder: (order) =>
    set((state) => {
      // Evitar duplicados
      if (state.orders.some((o) => o.id === order.id)) return state;
      return { orders: [order, ...state.orders] };
    }),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      ),
    })),
}));
