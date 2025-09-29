// OrderCard.tsx
"use client";

import { Check, Copy, DollarSign, Wallet } from "lucide-react";
import {
  DeliveryType,
  EOrderStatusBusiness,
  Order,
  PaymentMethodType,
  PaymentStatus,
} from "../../types/order";
import OrderStatusBadge from "../OrderStatusBadge";
import OrderStatusButtons from "../OrderStatusButtons";
import { useBusinessOrdersStore } from "../../stores/useBusinessOrdersStore";
import { useEffect, useMemo, useState } from "react";
import {
  fetchAssignCompany,
  fetchUpdateOrdersByOrderID,
  fetchUpdateOrdersPaymentByOrderID,
} from "../../api/catalog-api";
import { DeliveryCompanySelector } from "../DeliveryCompanySelector";
import PaymentPendingCard from "./PaymentPendingCard";
import OrderSummary from "./OrderSummary";
import { OrderModal } from "./OrderListProduct";

interface OrderCardProps {
  order: Order;
  deliveryCompanies: { id: string; name: string }[];
}

const DEFAULT_DELIVERY_KEY = "defaultDeliveryCompany";

export default function OrderCard({ order, deliveryCompanies }: OrderCardProps) {
  const updateOrderStatus = useBusinessOrdersStore((s) => s.updateOrderStatus);
  const updatePaymentStatus = useBusinessOrdersStore(
    (s) => s.updatePaymentStatus
  );

  const [showDeliverySelector, setShowDeliverySelector] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [hasSeenVoucher, setHasSeenVoucher] = useState(false);
  const [paymentActionTaken, setPaymentActionTaken] = useState(false);

  const [defaultDeliveryCompanyId, setDefaultDeliveryCompanyId] = useState<string | null>(null);
  const [defaultDeliveryCompanyName, setDefaultDeliveryCompanyName] = useState<string | null>(null);

  useEffect(() => {
    const savedDefaultId = localStorage.getItem(DEFAULT_DELIVERY_KEY);
    if (savedDefaultId) {
      const company = deliveryCompanies.find((c) => c.id === savedDefaultId);
      if (company) {
        setDefaultDeliveryCompanyId(company.id);
        setDefaultDeliveryCompanyName(company.name);
      }
    }
  }, [deliveryCompanies]);

  const handleStatusChange = async (newStatus: EOrderStatusBusiness) => {
    try {
      const updatedOrder = await fetchUpdateOrdersByOrderID(order.id, newStatus);
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
      updatePaymentStatus(
        updatedOrder.id,
        updatedOrder.paymentStatus,
        updatedOrder.paymentReceiptUrl || ""
      );
      setPaymentActionTaken(true); // Oculta los botones
    } catch (error) {
      console.error(error);
    }
  };

  const handleAssignDelivery = async (companyId: string) => {
    try {
      await fetchAssignCompany(order.id, companyId);
      await handleStatusChange(EOrderStatusBusiness.DELIVERY_PENDING);
      setShowDeliverySelector(false);

      const companyName =
        deliveryCompanies.find((c) => c.id === companyId)?.name || null;

      localStorage.setItem(DEFAULT_DELIVERY_KEY, companyId);
      setDefaultDeliveryCompanyId(companyId);
      setDefaultDeliveryCompanyName(companyName);
    } catch (error) {
      alert("Error al asignar el delivery.");
    }
  };

  const getPaymentInfo = (paymentType: PaymentMethodType) => {
    switch (paymentType) {
      case PaymentMethodType.CASH:
        return {
          icon: <DollarSign className="inline w-4 h-4 mr-1 text-green-600" />,
          text: "Efectivo",
        };
      case PaymentMethodType.TRANSFER:
        return {
          icon: <Wallet className="inline w-4 h-4 mr-1 text-blue-600" />,
          text: "Transferencia",
        };
      default:
        return { icon: null, text: "Método de pago no definido" };
    }
  };

  const getShortId = (id: string) => (id ? `#${id.substring(0, 8)}` : "");

  const shouldShowTransferPending = useMemo(
    () =>
      order.paymentType === PaymentMethodType.TRANSFER &&
      order.paymentStatus === PaymentStatus.PENDING,
    [order.paymentType, order.paymentStatus]
  );

  const shouldShowPaymentReview = useMemo(
    () =>
      order.paymentType === PaymentMethodType.TRANSFER &&
      order.paymentStatus === PaymentStatus.IN_PROGRESS &&
      !!order.paymentReceiptUrl,
    [order.paymentType, order.paymentStatus, order.paymentReceiptUrl]
  );

  const shouldShowPaymentButtons =
    ((order.paymentType === PaymentMethodType.CASH && order.paymentStatus === PaymentStatus.PENDING) ||
      (order.paymentType === PaymentMethodType.TRANSFER && shouldShowPaymentReview && hasSeenVoucher)) &&
    !paymentActionTaken;

  const isPickup = order.deliveryType === DeliveryType.PICKUP;
  const paymentInfo = getPaymentInfo(order.paymentType);

  return (
    <div className="w-full sm:max-w-md sm:mx-auto bg-[#f9f9ef] border border-gray-300 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-700">
            <OrderStatusBadge
              status={order.status}
              paymentStatus={order.paymentStatus as PaymentStatus}
              paymentType={order.paymentType}
            />
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 font-mono select-none">
            {getShortId(order.id)}
          </span>
          <button
            onClick={() => navigator.clipboard.writeText(order.id)}
            className="ml-2 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
            title="Copiar ID completo"
            aria-label="Copiar ID de la orden"
          >
            <Copy className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Fecha */}
      <div className="text-xs text-gray-500 mb-2">
        <div>{new Date(order.createdAt).toLocaleDateString()}</div>
        <div>
          {new Date(order.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          hs
        </div>
      </div>

      <hr className="border-dashed border-gray-400 my-2" />

      {/* Cliente + pago */}
      <div className="flex justify-between items-center text-sm text-gray-700 mb-3">
        <OrderSummary
          address={order.user.address}
          fullName={order.user.fullName}
          isPickup={isPickup}
          paymentInfo={paymentInfo.text}
          totalProduct={Number(order.total)}
          isPayment={shouldShowPaymentReview}
          paymentReceiptUrl={order.paymentReceiptUrl || null}
          onViewProducts={() => setShowProduct(true)}
          onViewVoucher={() => {
            setShowVoucher(true);
            setHasSeenVoucher(true);
          }}
        />
      </div>

      {/* Comentario */}
      {order.customerObservations && (
        <p className="text-xs text-gray-500 text-center">
          {order.customerObservations}
        </p>
      )}

      {/* Botones de pago */}
      {shouldShowPaymentButtons && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => handlePaymentConfirmation(false)}
            className="bg-red-600 w-full text-white text-sm font-medium py-2 px-4 rounded-full hover:bg-red-700 transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={() => handlePaymentConfirmation(true)}
            className="bg-green-600 w-full text-white text-sm font-medium py-2 px-4 rounded-full hover:bg-green-700 transition-colors"
          >
            Aceptar
          </button>
        </div>
      )}

      {/* Botones de estado solo si no hay revisión pendiente o ya tomó acción */}
      {!shouldShowTransferPending &&
        (!shouldShowPaymentReview || paymentActionTaken) && (
          <div className="mt-4 pt-2 flex justify-end">
            <OrderStatusButtons
              order={order}
              handleStatusChange={handleStatusChange}
              setShowDeliverySelector={setShowDeliverySelector}
              defaultDeliveryCompanyId={defaultDeliveryCompanyId}
              defaultDeliveryCompanyName={defaultDeliveryCompanyName}
              handleAssignDelivery={handleAssignDelivery}
            />
          </div>
        )}

      {/* Mensaje de pago pendiente */}
      {shouldShowTransferPending && <PaymentPendingCard />}

      {/* Delivery selector */}
      {showDeliverySelector && (
        <DeliveryCompanySelector
          companies={deliveryCompanies}
          onCancel={() => setShowDeliverySelector(false)}
          onConfirm={handleAssignDelivery}
        />
      )}

      {/* Modal de productos */}
      {showProduct && (
        <OrderModal
          orders={order.items}
          isOpen={showProduct}
          onClose={() => setShowProduct(false)}
        />
      )}
    </div>
  );
}
