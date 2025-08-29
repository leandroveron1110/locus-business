// src/components/BusinessOrderCard.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Order,
  EOrderStatusBusiness,
  PaymentStatus,
  PaymentMethodType,
  DeliveryType,
  OrderStatus,
} from "../types/order";
import {
  fetchUpdateOrdersByOrderID,
  fetchAssignCompany,
  fetchUpdateOrdersPaymentByOrderID,
} from "../api/catalog-api";
import { useBusinessOrdersStore } from "../stores/useBusinessOrdersStore";
import OrderStatusBadge from "./OrderStatusBadge";
import {
  Check,
  X,
  Truck,
  User,
  Clock,
  Info,
  Store,
  Wallet,
  DollarSign,
  Package,
} from "lucide-react";
import { DeliveryCompanySelector } from "./DeliveryCompanySelector";
import OrderItem from "./OrderItem";
import OrderStatusButtons from "./OrderStatusButtons";

interface Props {
  order: Order;
  deliveryCompanies: { id: string; name: string }[];
}

const DEFAULT_DELIVERY_KEY = "defaultDeliveryCompany";

export default function BusinessOrderCard({ order, deliveryCompanies }: Props) {
  const updateOrderStatus = useBusinessOrdersStore((s) => s.updateOrderStatus);
  const updatePaymentStatus = useBusinessOrdersStore((s) => s.updatePaymentStatus);

  const [showDeliverySelector, setShowDeliverySelector] = useState(false);
  const [defaultDeliveryCompanyId, setDefaultDeliveryCompanyId] = useState<string | null>(null);
  const [defaultDeliveryCompanyName, setDefaultDeliveryCompanyName] = useState<string | null>(null);

  // Carga la compañía de delivery por defecto desde localStorage y su nombre al inicio
  useEffect(() => {
    const savedDefaultId = localStorage.getItem(DEFAULT_DELIVERY_KEY);
    if (savedDefaultId) {
      const company = deliveryCompanies.find(c => c.id === savedDefaultId);
      if (company) {
        setDefaultDeliveryCompanyId(company.id);
        setDefaultDeliveryCompanyName(company.name);
      }
    }
  }, [deliveryCompanies]);

  const formatDate = (isoDate: string) =>
    new Date(isoDate).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleStatusChange = async (newStatus: EOrderStatusBusiness) => {
    try {
      const updatedOrder = await fetchUpdateOrdersByOrderID(
        order.id,
        newStatus
      );
      updateOrderStatus(updatedOrder.id, updatedOrder.status);
    } catch (error) {
      console.error("Error cambiando el estado:", error);
      alert("Hubo un error al cambiar el estado de la orden.");
    }
  };

  const handlePaymentConfirmation = async (isConfirmed: boolean) => {
    try {
      const newStatus = isConfirmed
        ? PaymentStatus.CONFIRMED
        : PaymentStatus.REJECTED;

      const updatedOrder = await fetchUpdateOrdersPaymentByOrderID(
        order.id,
        newStatus
      );

      // Actualiza el estado de pago en el store
      updatePaymentStatus(updatedOrder.id, updatedOrder.paymentStatus, updatedOrder.paymentReceiptUrl || "");

    } catch (error) {
    }
  };

  const handleAssignDelivery = async (companyId: string) => {
    try {
      await fetchAssignCompany(order.id, companyId);
      await handleStatusChange(EOrderStatusBusiness.DELIVERY_PENDING);
      setShowDeliverySelector(false);
      
      // Obtén el nombre de la compañía para guardarlo también
      const companyName = deliveryCompanies.find(c => c.id === companyId)?.name || null;

      localStorage.setItem(DEFAULT_DELIVERY_KEY, companyId);
      setDefaultDeliveryCompanyId(companyId);
      setDefaultDeliveryCompanyName(companyName);
    } catch (error) {
      alert("Error al asignar el delivery.");
    }
  };

  const getDeliveryInfo = (deliveryType: DeliveryType) => {
    switch (deliveryType) {
      case DeliveryType.PICKUP:
        return {
          icon: <Store className="inline w-3 h-3 mr-1 text-gray-500" />,
          text: "Retiro en el local",
        };
      case DeliveryType.DELIVERY:
      case DeliveryType.IN_HOUSE_DELIVERY:
      case DeliveryType.EXTERNAL_DELIVERY:
        return {
          icon: <Truck className="inline w-3 h-3 mr-1 text-gray-500" />,
          text: "Envío a domicilio",
        };
      default:
        return {
          icon: null,
          text: "Tipo de entrega no definido",
        };
    }
  };

  const getPaymentInfo = (paymentType: PaymentMethodType) => {
    switch (paymentType) {
      case PaymentMethodType.CASH:
        return {
          icon: <DollarSign className="inline w-3 h-3 mr-1 text-green-600" />,
          text: "Pago en efectivo",
        };
      case PaymentMethodType.TRANSFER:
        return {
          icon: <Wallet className="inline w-3 h-3 mr-1 text-blue-600" />,
          text: "Transferencia bancaria",
        };
      case PaymentMethodType.DELIVERY:
        return {
          icon: <Truck className="inline w-3 h-3 mr-1 text-purple-600" />,
          text: "Pago al delivery",
        };
      default:
        return {
          icon: null,
          text: "Método de pago no definido",
        };
    }
  };

  const deliveryInfo = getDeliveryInfo(order.deliveryType);
  const paymentInfo = getPaymentInfo(order.paymentType);

  const shouldShowTransferPending = useMemo(() => {
    return (
      order.paymentType === PaymentMethodType.TRANSFER &&
      order.paymentStatus === PaymentStatus.PENDING
    );
  }, [order.paymentType, order.paymentStatus]);

  const shouldShowPaymentReview = useMemo(() => {
    return (
      order.paymentType === PaymentMethodType.TRANSFER &&
      order.paymentStatus === PaymentStatus.IN_PROGRESS &&
      !!order.paymentReceiptUrl
    );
  }, [order.paymentType, order.paymentStatus, order.paymentReceiptUrl]);

  return (
    <div className="p-4 rounded-xl bg-white shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
        <div className="mb-2 sm:mb-0">
          <p className="font-semibold text-gray-800">
            <User className="inline w-4 h-4 mr-1 text-gray-500" />
            {order.user.fullName}
          </p>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            {deliveryInfo.icon}
            <span className="text-gray-600">{deliveryInfo.text}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            {paymentInfo.icon}
            <span className="text-gray-600">{paymentInfo.text}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            <Clock className="inline w-3 h-3 mr-1" />
            {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-lg text-gray-900">
            ${order.total.toFixed(2)}
          </p>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {shouldShowTransferPending && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <h4 className="font-semibold text-sm text-blue-800">
              Pago Pendiente
            </h4>
          </div>
          <p className="text-xs text-gray-700 mt-1">
            El cliente ha realizado un pedido por transferencia. Aún no ha
            subido el comprobante de pago.
          </p>
        </div>
      )}

      {shouldShowPaymentReview && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-yellow-600 flex-shrink-0" />
            <h4 className="font-semibold text-sm text-yellow-800">
              Comprobante de Pago
            </h4>
          </div>
          <p className="text-xs text-gray-700 mb-2">
            El cliente subió un comprobante. Revísalo y confirma el pago.
          </p>
          <div className="flex items-center gap-2 mb-3">
            <a
              href={order.paymentReceiptUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm hover:underline"
            >
              Ver imagen del comprobante
            </a>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePaymentConfirmation(true)}
              className="flex-1 px-3 py-1 text-xs rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
            >
              <Check className="inline w-4 h-4 mr-1" /> Confirmar Pago
            </button>
            <button
              onClick={() => handlePaymentConfirmation(false)}
              className="flex-1 px-3 py-1 text-xs rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
            >
              <X className="inline w-4 h-4 mr-1" /> Rechazar Pago
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-dashed">
        <h4 className="font-semibold text-gray-800 mb-2">
          Detalles del Pedido
        </h4>
        <div className="space-y-2 text-sm text-gray-700">
          {order.items.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t flex justify-end">
        <OrderStatusButtons
          order={order}
          handleStatusChange={handleStatusChange}
          setShowDeliverySelector={setShowDeliverySelector}
          defaultDeliveryCompanyId={defaultDeliveryCompanyId}
          defaultDeliveryCompanyName={defaultDeliveryCompanyName}
          handleAssignDelivery={handleAssignDelivery}
        />
      </div>

      {showDeliverySelector && (
        <DeliveryCompanySelector
          companies={deliveryCompanies}
          onCancel={() => setShowDeliverySelector(false)}
          onConfirm={handleAssignDelivery}
        />
      )}
    </div>
  );
}