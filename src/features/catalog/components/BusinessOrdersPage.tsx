"use client";

import React, { useState, useEffect } from "react";
import {
  fetchUpdateOrdersByOrderID,
  fetchAssignCompany,
  fetchDeliveryCompany,
} from "../api/catalog-api";
import { useBusinessOrdersSocket } from "../stores/useBusinessOrdersSocket";
import { useBusinessOrdersStore } from "../stores/useBusinessOrdersStore";
import { useFetchBusinessOrders } from "../stores/useFetchBusinessOrders";
import { EOrderStatusBusiness } from "../types/order";
import { DeliveryCompanySelector } from "./DeliveryCompanySelector";
import OrderStatusSelector from "./OrderStatusSelector";
import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
  businessId: string;
}

export default function BusinessOrdersPage({ businessId }: Props) {
  useFetchBusinessOrders(businessId);
  useBusinessOrdersSocket(businessId);

  const orders = useBusinessOrdersStore((s) => s.orders);
  const updateOrderStatus = useBusinessOrdersStore((s) => s.updateOrderStatus);

  const [deliveryCompanies, setDeliveryCompanies] = useState<
    { id: string; name: string }[]
  >([]);
  const [showDeliverySelector, setShowDeliverySelector] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] =
    useState<EOrderStatusBusiness | null>(null);

  useEffect(() => {
    fetchDeliveryCompany()
      .then(setDeliveryCompanies)
      .catch((e) => console.error("Error cargando delivery companies", e));
  }, []);

  const handleChangeStatus = async (
    orderId: string,
    newStatus: EOrderStatusBusiness
  ) => {
    try {
      if (newStatus === EOrderStatusBusiness.READY_FOR_DELIVERY_PICKUP) {
        setSelectedOrderId(orderId);
        setPendingStatus(newStatus);
        setShowDeliverySelector(true);
        return;
      }

      const updatedOrder = await fetchUpdateOrdersByOrderID(orderId, newStatus);
      updateOrderStatus(updatedOrder.id, updatedOrder.status);
    } catch (error) {
      console.error("Error cambiando el estado:", error);
    }
  };

  const handleConfirmDeliveryCompany = async (companyId: string) => {
    if (!selectedOrderId || !pendingStatus) return;

    try {
      await fetchAssignCompany(selectedOrderId, companyId);
      const updatedOrder = await fetchUpdateOrdersByOrderID(
        selectedOrderId,
        pendingStatus
      );
      updateOrderStatus(updatedOrder.id, updatedOrder.status);

      setShowDeliverySelector(false);
      setSelectedOrderId(null);
      setPendingStatus(null);
    } catch (error) {
      console.error("Error asignando compañía o actualizando estado:", error);
    }
  };

  const handleCancelDeliverySelection = () => {
    setShowDeliverySelector(false);
    setSelectedOrderId(null);
    setPendingStatus(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Órdenes en tiempo real</h1>

      {orders.length === 0 ? (
        <p>No hay órdenes todavía.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
               Estado: <OrderStatusBadge status={order.status} />
              <p>
                <strong>ID:</strong> {order.id}
              </p>
              <p>
                <strong>Cliente:</strong> {order.user.firstName}{" "}
                {order.user.lastName}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <OrderStatusSelector
                  orderId={order.id}
                  status={order.status as EOrderStatusBusiness}
                  handleChangeStatus={handleChangeStatus}
                />
              </div>

              <p className="mt-2">
                <strong>Total:</strong> ${order.total.toLocaleString()}
              </p>

              {order.pickupAddress && (
                <p>
                  <strong>Dirección de retiro:</strong>{" "}
                  {order.pickupAddress.street}{" "}
                  {order.pickupAddress.number ?? ""}, {order.pickupAddress.city}
                </p>
              )}
              {order.deliveryAddress && (
                <p>
                  <strong>Dirección de entrega:</strong>{" "}
                  {order.deliveryAddress.street}{" "}
                  {order.deliveryAddress.number ?? ""},{" "}
                  {order.deliveryAddress.city}
                </p>
              )}

              <div className="mt-2">
                <strong>Productos:</strong>
                <ul className="list-disc list-inside ml-4">
                  {order.items.map((item: any) => (
                    <li key={item.id}>
                      {item.productName} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showDeliverySelector && (
        <DeliveryCompanySelector
          companies={deliveryCompanies}
          onCancel={handleCancelDeliverySelection}
          onConfirm={handleConfirmDeliveryCompany}
        />
      )}
    </div>
  );
}
