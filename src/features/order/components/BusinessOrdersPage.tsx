"use client";

import React, { useState, useEffect, useMemo } from "react";
import { fetchDeliveryCompany } from "../api/catalog-api";
import { useBusinessOrdersSocket } from "../stores/useBusinessOrdersSocket";
import { useFetchBusinessOrders } from "../stores/useFetchBusinessOrders";
import {
  Order,
  OrderStatus,
  PaymentMethodType,
  PaymentStatus,
} from "../types/order";
import { Search } from "lucide-react";
import OrderCard from "./Card/OrderCard";
import OrdersFilters from "./OrdersFilters";
import { simplifiedFilters } from "@/features/common/utils/filtersData";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
import { useBusinessNotificationsStore } from "../../common/hooks/useBusinessNotificationsStore";
import { useGlobalBusinessOrdersStore } from "@/lib/stores/orderStoreGlobal";

interface Props {
  businessId: string;
}

export default function BusinessOrdersPage({ businessId }: Props) {

  // hooks
  const resetNotificationOrder = useBusinessNotificationsStore(
    (s) => s.clearNotificationsByType
  );

  const { addAlert } = useAlert();
  const rawOrders = useGlobalBusinessOrdersStore((s) =>
    s.getOrders(businessId)
  );
  const orders = useMemo(() => (rawOrders || []) as Order[], [rawOrders]);

  useFetchBusinessOrders(businessId);
  useBusinessOrdersSocket(businessId);
  const [deliveryCompanies, setDeliveryCompanies] = useState<
    { id: string; name: string }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");

  useEffect(() => {
    if (businessId) {
      resetNotificationOrder(businessId, "NEW_ORDER");
    }
  }, [businessId, resetNotificationOrder]);

  useEffect(() => {
    fetchDeliveryCompany()
      .then((c) => {
        if (c) setDeliveryCompanies(c);
      })
      .catch((e) =>
        addAlert({
          message: `Error cargando delivery companies. ${getDisplayErrorMessage(
            e
          )} `,
          type: "error",
        })
      );
  }, [addAlert]);

  // --- filtros y lógica (igual que antes) ---
  const filterOrdersView = (order: Order) => {
    if (order.paymentType === PaymentMethodType.CASH) return true;
    if (
      order.paymentType === PaymentMethodType.TRANSFER &&
      order.paymentStatus !== PaymentStatus.PENDING &&
      order.paymentStatus !== PaymentStatus.REJECTED
    )
      return true;
    return false;
  };

  const getOrderPriority = (order: Order) => {
    if (
      order.paymentType === PaymentMethodType.CASH &&
      order.status === OrderStatus.PENDING
    )
      return 1;
    if (
      order.paymentType === PaymentMethodType.TRANSFER &&
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
    if (
      order.status === OrderStatus.CANCELLED_BY_USER ||
      order.status === OrderStatus.REJECTED_BY_BUSINESS ||
      order.status === OrderStatus.DELIVERY_FAILED ||
      order.status === OrderStatus.DELIVERY_REJECTED
    )
      return 5;
    return 6;
  };

  console.log(orders.length)
  const filteredAndSortedOrders = useMemo(() => {
    if (!orders) return [];

    const currentFilter = simplifiedFilters.find(
      (f) => f.label === activeFilter
    );

    let filtered = orders.filter((order) => filterOrdersView(order));

    if (currentFilter && currentFilter.label !== "Todos") {
      filtered = filtered.filter((order) => {
        if (currentFilter.condition) return currentFilter.condition(order);
        return currentFilter.statuses.includes(order.status);
      });
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.user.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (order.user.phone &&
            order.user.phone.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered.sort((a, b) => {
      const priorityDiff = getOrderPriority(a) - getOrderPriority(b);
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [orders, activeFilter, searchTerm]);

  const orderFilter = orders.filter((order) => filterOrdersView(order));

  return (
    <div className="w-full bg-gray-100">
      {/* Quick Filters */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm pt-4 pb-2">
        <OrdersFilters
          quickFilters={simplifiedFilters}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          orders={orderFilter ?? []}
        />
      </div>

      {/* Buscador */}
      <div className="sticky top-0 z-10 bg-gray-100 pb-2 mb-4">
        <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por ID, cliente o teléfono..."
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Lista de órdenes */}
      {filteredAndSortedOrders.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-lg">
            No se encontraron órdenes para este negocio.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 p-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredAndSortedOrders.map((order) => (
            <OrderCard
              key={order.id}
              orderId={order.id}
              businessId={businessId}
              deliveryCompanies={deliveryCompanies}
            />
          ))}
        </div>
      )}
    </div>
  );
}
