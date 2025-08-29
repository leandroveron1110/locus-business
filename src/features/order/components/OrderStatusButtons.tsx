// src/components/OrderStatusButtons.tsx

import { useMemo } from "react";
import {
  Order,
  EOrderStatusBusiness,
  DeliveryType,
  OrderStatus,
} from "../types/order";
import { Package } from "lucide-react";

interface Props {
  order: Order;
  handleStatusChange: (newStatus: EOrderStatusBusiness) => void;
  setShowDeliverySelector: (show: boolean) => void;
  defaultDeliveryCompanyId: string | null;
  defaultDeliveryCompanyName: string | null; // <-- Nueva prop
  handleAssignDelivery: (companyId: string) => Promise<void>;
}

export default function OrderStatusButtons({
  order,
  handleStatusChange,
  setShowDeliverySelector,
  defaultDeliveryCompanyId,
  defaultDeliveryCompanyName, // <-- Usamos la nueva prop aquí
  handleAssignDelivery,
}: Props) {
  const status = order.status as unknown as OrderStatus;

  const shouldShowAutomaticAssignment = useMemo(() => {
    return (
      status === OrderStatus.READY_FOR_DELIVERY_PICKUP &&
      order.deliveryType !== DeliveryType.PICKUP &&
      !!defaultDeliveryCompanyId
    );
  }, [status, order.deliveryType, defaultDeliveryCompanyId]);

  switch (status) {
    case OrderStatus.PENDING:
      return (
        <>
          <button
            onClick={() => handleStatusChange(EOrderStatusBusiness.CONFIRMED)}
            className="px-3 py-1 text-sm rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
          >
            Confirmar
          </button>
          <button
            onClick={() =>
              handleStatusChange(EOrderStatusBusiness.REJECTED_BY_BUSINESS)
            }
            className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
          >
            Rechazar
          </button>
        </>
      );
    case OrderStatus.CONFIRMED:
    case OrderStatus.PREPARING:
      return (
        <button
          onClick={() => {
            const nextStatus =
              order.deliveryType === DeliveryType.PICKUP
                ? EOrderStatusBusiness.READY_FOR_CUSTOMER_PICKUP
                : EOrderStatusBusiness.READY_FOR_DELIVERY_PICKUP;
            handleStatusChange(nextStatus);
          }}
          className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
        >
          Pedido Completado
        </button>
      );
    case OrderStatus.READY_FOR_CUSTOMER_PICKUP:
      return (
        <button
          onClick={() => handleStatusChange(EOrderStatusBusiness.COMPLETED)}
          className="px-3 py-1 text-sm rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors"
        >
          Entregado
        </button>
      );
    case OrderStatus.READY_FOR_DELIVERY_PICKUP:
      return (
        <div className="flex gap-2">
          {shouldShowAutomaticAssignment && (
            <button
              onClick={() => handleAssignDelivery(defaultDeliveryCompanyId!)}
              className="px-3 py-1 text-sm rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors flex items-center gap-1"
            >
              <Package className="w-4 h-4" />
              Asignar a {defaultDeliveryCompanyName}
            </button>
          )}
          <button
            onClick={() => setShowDeliverySelector(true)}
            className="px-3 py-1 text-sm rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition-colors flex items-center gap-1"
          >
            Asignar Delivery
          </button>
        </div>
      );
    case OrderStatus.OUT_FOR_PICKUP:
      return (
        <button
          onClick={() => handleStatusChange(EOrderStatusBusiness.COMPLETED)}
          className="px-3 py-1 text-sm rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
        >
          Entregado al Delivery
        </button>
      );
    case OrderStatus.DELIVERED:
      return (
        <button
          onClick={() => handleStatusChange(EOrderStatusBusiness.COMPLETED)}
          className="px-3 py-1 text-sm rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-colors"
        >
          Marcar como Completada
        </button>
      );
    case OrderStatus.CANCELLED_BY_USER:
    case OrderStatus.REJECTED_BY_BUSINESS:
    case OrderStatus.COMPLETED:
    case OrderStatus.DELIVERY_FAILED:
      return null;
    default:
      return null;
  }
}