"use client";

import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";

import OrdersFilters from "./OrdersFilters";
import { simplifiedFilters } from "@/features/common/utils/filtersData";

import { useBusinessOrdersSocket } from "../stores/useBusinessOrdersSocket";
import { useFetchBusinessOrders } from "../stores/useFetchBusinessOrders";
import { useBusinessNotificationsStore } from "../../common/hooks/useBusinessNotificationsStore";
import { useGlobalBusinessOrdersStore } from "@/lib/stores/orderStoreGlobal";

import {
  IOrder,
  OrderStatus,
  PaymentMethodType,
  PaymentStatus,
} from "../types/order";

import { OrderList } from "./order/OrderList";
import { OrderDetailsModal } from "./order/OrderDetailsModal";

interface Props {
  businessId: string;
}

export default function BusinessOrdersPage({ businessId }: Props) {
  const resetNotificationOrder = useBusinessNotificationsStore(
    (s) => s.clearNotificationsByType
  );

  const rawOrders = useGlobalBusinessOrdersStore((s) =>
    s.getOrders(businessId)
  );

  const orders = useMemo(() => (rawOrders || []) as IOrder[], [rawOrders]);

  useFetchBusinessOrders(businessId);
  useBusinessOrdersSocket(businessId);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    if (businessId) {
      resetNotificationOrder(businessId, "NEW_ORDER");
    }
  }, [businessId, resetNotificationOrder]);

  // --- reglas de visibilidad ---
  const filterOrdersView = (order: IOrder) => {
    if (order.orderPaymentMethod === PaymentMethodType.CASH) return true;
    if (
      order.orderPaymentMethod === PaymentMethodType.TRANSFER &&
      order.paymentStatus !== PaymentStatus.PENDING &&
      order.paymentStatus !== PaymentStatus.REJECTED
    )
      return true;
    return false;
  };

  const getOrderPriority = (order: IOrder) => {
    if (
      order.orderPaymentMethod === PaymentMethodType.CASH &&
      order.status === OrderStatus.PENDING
    )
      return 1;

    if (
      order.orderPaymentMethod === PaymentMethodType.TRANSFER &&
      (order.paymentStatus === PaymentStatus.PENDING ||
        order.paymentStatus === PaymentStatus.IN_PROGRESS)
    )
      return 2;

    if (
      order.status === OrderStatus.CONFIRMED ||
      order.status === OrderStatus.PREPARING
    )
      return 3;

    if (
      order.status === OrderStatus.COMPLETED ||
      order.status === OrderStatus.DELIVERED
    )
      return 4;

    return 5;
  };

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(filterOrdersView);

    const currentFilter = simplifiedFilters.find(
      (f) => f.label === activeFilter
    );

    if (currentFilter && currentFilter.label !== "Todos") {
      filtered = filtered.filter((order) => {
        if (currentFilter.condition) return currentFilter.condition(order);
        return currentFilter.statuses.includes(order.status);
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(term) ||
          o.user.fullName.toLowerCase().includes(term) ||
          (o.user.phone && o.user.phone.toLowerCase().includes(term))
      );
    }

    return filtered.sort((a, b) => {
      const p = getOrderPriority(a) - getOrderPriority(b);
      if (p !== 0) return p;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders, activeFilter, searchTerm]);

  return (
    <div className="w-full h-full bg-gray-100 flex flex-col">
      {/* FILTROS */}
      <div className="sticky top-0 z-20 bg-white border-b">
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pedido, cliente o teléfono"
              className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <OrdersFilters
            quickFilters={simplifiedFilters}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            orders={orders}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto  overflow-x-auto">

      {/* HEADER TABLA (DESKTOP) */}
      <div className="hidden md:grid grid-cols-[90px_80px_80px_170px_160px_140px_140px_120px] px-4 py-2 text-xs font-semibold text-gray-500 border-b bg-gray-50">
        <span>ID</span>
        <span>Fecha</span>
        <span>Hora</span>
        <span>Cliente</span>
        <span>Estado</span>
        <span>Tipo</span>
        <span>Pago</span>
        <span className="text-right">Total</span>
      </div>

      {/* LISTA */}
      <div className="">
        {filteredAndSortedOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay órdenes para mostrar
          </div>
        ) : (
          filteredAndSortedOrders.map((order) => (
            <OrderList
              key={order.id}
              order={order}
              onClick={() => setSelectedOrder(order)}
            />
          ))
        )}
      </div>


      </div>


      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
