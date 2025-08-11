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
import { OrderStatus } from "../types/order"; // enum numérico
import { DeliveryCompanySelector } from "./DeliveryCompanySelector";

interface Props {
  businessId: string;
}

const ORDER_STATUS: (keyof typeof OrderStatus)[] = [
  "PENDING",
  "CONFIRMED",
  "READY_FOR_DELIVERY",
  "IN_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

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
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    fetchDeliveryCompany()
      .then(setDeliveryCompanies)
      .catch((e: any) =>
        console.error("Error cargando delivery companies", e)
      );
  }, []);

  const handleChangeStatus = async (
    orderId: string,
    newStatusKey: keyof typeof OrderStatus
  ) => {
    try {
      // Convertir el string a valor real del enum numérico
      const newStatus = OrderStatus[newStatusKey] as unknown as OrderStatus;

      console.log("Nuevo estado seleccionado:", newStatusKey, newStatus);

      // Si es READY_FOR_DELIVERY → abrir modal
      if (newStatusKey === "READY_FOR_DELIVERY") {
        setSelectedOrderId(orderId);
        setPendingStatus(newStatus);
        setShowDeliverySelector(true);
        return;
      }

      // Cambiar estado directamente si no es READY_FOR_DELIVERY
      const updatedOrder = await fetchUpdateOrdersByOrderID(orderId, newStatusKey);
      updateOrderStatus(updatedOrder.id, updatedOrder.status);
    } catch (error) {
      console.error("Error cambiando el estado:", error);
    }
  };

  const handleConfirmDeliveryCompany = async (companyId: string) => {
    if (!selectedOrderId || !pendingStatus) return;

    const newStatus = OrderStatus[pendingStatus];

    try {
      await fetchAssignCompany(selectedOrderId, companyId);
      const updatedOrder = await fetchUpdateOrdersByOrderID(
        selectedOrderId,
        newStatus
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
              <p>
                <strong>ID:</strong> {order.id}
              </p>
              <p>
                <strong>Cliente:</strong> {order.user.firstName}{" "}
                {order.user.lastName}
              </p>

              <div className="flex items-center gap-2">
                <strong>Estado:</strong>
                <select
                  value={order.status as keyof typeof OrderStatus}
                  onChange={(e) =>
                    handleChangeStatus(
                      order.id,
                      e.target.value as keyof typeof OrderStatus
                    )
                  }
                  className="border p-1 rounded"
                >
                  {ORDER_STATUS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <p>
                <strong>Total:</strong> ${order.total.toLocaleString()}
              </p>

              {order.pickupAddress && (
                <p>
                  <strong>Dirección de retiro:</strong>{" "}
                  {order.pickupAddress.street}{" "}
                  {order.pickupAddress.number ?? ""},{" "}
                  {order.pickupAddress.city}
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
