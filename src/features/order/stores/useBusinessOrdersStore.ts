// src/stores/useBusinessOrdersStore.ts
import { create } from "zustand";
import { Order, OrderStatus, PaymentStatus } from "../types/order";

interface BusinessOrdersState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: string) => void;
  // Agregamos la nueva acción para actualizar el estado de pago
  updatePaymentStatus: (orderId: string, newPaymentStatus: PaymentStatus, paymentReceiptUrl: string) => void;
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
      orders: state.orders.map(o=> o.id == orderId ? 
        {
          ...o,
          status: status as OrderStatus
        }
         : o)
    })),

  // Nueva función para actualizar el estado de pago y el comprobante
  updatePaymentStatus: (orderId, newPaymentStatus, paymentReceiptUrl) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              paymentStatus: newPaymentStatus,
              paymentReceiptUrl: paymentReceiptUrl,
            }
          : order
      ),
    })),
}));