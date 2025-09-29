// filtersData.ts

import { Order, OrderStatus, PaymentMethodType, PaymentStatus } from "@/features/order/types/order";


export const statusPriority: Record<OrderStatus, number> = {
  [OrderStatus.PENDING]: 1,
  [OrderStatus.WAITING_FOR_PAYMENT]: 2,
  [OrderStatus.PAYMENT_IN_PROGRESS]: 3,
  [OrderStatus.PAYMENT_CONFIRMED]: 4,
  [OrderStatus.PENDING_CONFIRMATION]: 5,
  [OrderStatus.CONFIRMED]: 6,
  [OrderStatus.PREPARING]: 7,
  [OrderStatus.REJECTED_BY_BUSINESS]: 20,
  [OrderStatus.READY_FOR_CUSTOMER_PICKUP]: 8,
  [OrderStatus.READY_FOR_DELIVERY_PICKUP]: 9,
  [OrderStatus.DELIVERY_PENDING]: 10,
  [OrderStatus.DELIVERY_ASSIGNED]: 11,
  [OrderStatus.DELIVERY_ACCEPTED]: 12,
  [OrderStatus.DELIVERY_REJECTED]: 21,
  [OrderStatus.DELIVERY_REASSIGNING]: 13,
  [OrderStatus.OUT_FOR_PICKUP]: 14,
  [OrderStatus.PICKED_UP]: 15,
  [OrderStatus.OUT_FOR_DELIVERY]: 16,
  [OrderStatus.DELIVERED]: 30,
  [OrderStatus.DELIVERY_FAILED]: 22,
  [OrderStatus.RETURNED]: 23,
  [OrderStatus.REFUNDED]: 40,
  [OrderStatus.COMPLETED]: 50,
  [OrderStatus.CANCELLED_BY_USER]: 60,
  [OrderStatus.CANCELLED_BY_BUSINESS]: 61,
  [OrderStatus.CANCELLED_BY_DELIVERY]: 62,
  [OrderStatus.FAILED]: 70,
};

export const simplifiedFilters = [
  {
    label: "Todos",
    statuses: [],
  },
    {
    label: "Pago pendiente",
    statuses: [
      OrderStatus.PENDING,

    ],
    condition: (order: Order) =>
      (order.paymentType === PaymentMethodType.TRANSFER &&
      (order.paymentStatus === PaymentStatus.PENDING ||
        order.paymentStatus === PaymentStatus.IN_PROGRESS) || order.paymentType == PaymentMethodType.CASH && (order.paymentStatus === PaymentStatus.PENDING ||
        order.paymentStatus === PaymentStatus.IN_PROGRESS)),
  },
  {
    label: "En curso",
    statuses: [
      OrderStatus.WAITING_FOR_PAYMENT,
      OrderStatus.PENDING_CONFIRMATION,
      OrderStatus.CONFIRMED,
      OrderStatus.PREPARING,
      OrderStatus.READY_FOR_CUSTOMER_PICKUP,
      OrderStatus.READY_FOR_DELIVERY_PICKUP,
      OrderStatus.OUT_FOR_DELIVERY,
      OrderStatus.DELIVERY_ASSIGNED,
      OrderStatus.DELIVERY_ACCEPTED,
      OrderStatus.OUT_FOR_PICKUP,
      OrderStatus.PICKED_UP,
      OrderStatus.DELIVERY_REASSIGNING, // Añadido para un seguimiento más preciso
    ],
  },
  {
    label: "Completados",
    statuses: [
      OrderStatus.DELIVERED,
      OrderStatus.COMPLETED,
      OrderStatus.REFUNDED, // Agregado aquí ya que la acción finaliza el ciclo
    ],
  },
  {
    label: "Cancelados",
    statuses: [
      OrderStatus.REJECTED_BY_BUSINESS,
      OrderStatus.DELIVERY_REJECTED,
      OrderStatus.DELIVERY_FAILED,
      OrderStatus.RETURNED,
      OrderStatus.CANCELLED_BY_USER,
      OrderStatus.CANCELLED_BY_BUSINESS,
      OrderStatus.CANCELLED_BY_DELIVERY,
      OrderStatus.FAILED,
    ],
  },
];