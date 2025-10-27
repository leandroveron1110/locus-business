// OrderCard.tsx
"use client";

import { Copy, DollarSign, Wallet } from "lucide-react";
import {
  DeliveryType,
  EOrderStatusBusiness,
  PaymentMethodType,
  PaymentStatus,
} from "../../types/order";
import OrderStatusBadge from "../OrderStatusBadge";
import OrderStatusButtons from "../OrderStatusButtons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchAssignCompany,
  fetchUpdateOrdersByOrderID,
  fetchUpdateOrdersPaymentByOrderID,
} from "../../api/catalog-api";
import { DeliveryCompanySelector } from "../DeliveryCompanySelector";
import PaymentPendingCard from "./PaymentPendingCard";
import OrderSummary from "./OrderSummary";
import { OrderModal } from "./OrderListProduct";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
import { useGlobalBusinessOrdersStore } from "@/lib/stores/orderStoreGlobal";

interface OrderCardProps {
  businessId: string;
  orderId: string;
  deliveryCompanies: { id: string; name: string }[];
}

const DEFAULT_DELIVERY_KEY = "defaultDeliveryCompany";

export default function OrderCard({
  businessId,
  orderId,
  deliveryCompanies,
}: OrderCardProps) {
  const order = useGlobalBusinessOrdersStore((s) =>
    s.getOrderById(businessId, orderId)
  );
  const updateOrderStatus = useGlobalBusinessOrdersStore(
    (s) => s.updateOrderStatus
  );
  const updatePaymentStatus = useGlobalBusinessOrdersStore(
    (s) => s.updatePaymentStatus
  );

  const { addAlert } = useAlert();

  const [showDeliverySelector, setShowDeliverySelector] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [hasSeenVoucher, setHasSeenVoucher] = useState(false);
  const [paymentActionTaken, setPaymentActionTaken] = useState(false);

  const [defaultDeliveryCompanyId, setDefaultDeliveryCompanyId] = useState<
    string | null
  >(null);
  const [defaultDeliveryCompanyName, setDefaultDeliveryCompanyName] = useState<
    string | null
  >(null);
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);

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

  // --- NUEVA LÓGICA DE ACTUALIZACIÓN AUTOMÁTICA ---
  useEffect(() => {
    if (!order) return;

    // 1. Condición de estado
    const isReadyForAutomaticAssignment =
      (order.status as unknown as EOrderStatusBusiness) ==
      EOrderStatusBusiness.READY_FOR_DELIVERY_PICKUP;

    // 2. Condición de asignación de compañía (cliente ya la eligió)
    const hasDeliveryCompanyAssigned = !!order.deliveryCompanyId;

    // 3. Condición de prevención de bucles
    if (isAutoUpdating) return;

    if (isReadyForAutomaticAssignment && hasDeliveryCompanyAssigned) {
      if (order.deliveryCompanyId) {
        setIsAutoUpdating(true);
        handleAssignDelivery(order.deliveryCompanyId);
      }
    }
  }, [order?.status, order?.deliveryCompanyId]);

  const handleAssignDelivery = useCallback(
    async (companyId: string) => {
      if (!order) {
        addAlert({
          message: `No existe la orden`,
          type: "info",
        });
        return;
      }

      // 1. 💾 GUARDAR estado de rollback
      const previousStatus = order.status;
      const previousDeliverySelectorState = showDeliverySelector;
      const previousDefaultCompanyId = defaultDeliveryCompanyId;
      const previousDefaultCompanyName = defaultDeliveryCompanyName;

      // 2. ⚡ ACTUALIZACIÓN OPTIMISTA (Sólo cambios locales, el status lo maneja la API)

      // Si la función debe ejecutarse, asumimos éxito local
      setShowDeliverySelector(false); // Ocultar selector

      const companyName =
        deliveryCompanies.find((c) => c.id === companyId)?.name || null;

      // Actualizar estados locales y localStorage de la compañía por defecto
      localStorage.setItem(DEFAULT_DELIVERY_KEY, companyId);
      setDefaultDeliveryCompanyId(companyId);
      setDefaultDeliveryCompanyName(companyName);

      try {
        await fetchAssignCompany(order.id, companyId);
        await handleStatusChange(EOrderStatusBusiness.DELIVERY_PENDING);
      } catch (error) {
        updateOrderStatus(order.businessId, order.id, previousStatus as string);
        setShowDeliverySelector(previousDeliverySelectorState);
        if (previousDefaultCompanyId) {
          localStorage.setItem(DEFAULT_DELIVERY_KEY, previousDefaultCompanyId);
        } else {
          localStorage.removeItem(DEFAULT_DELIVERY_KEY);
        }
        setDefaultDeliveryCompanyId(previousDefaultCompanyId);
        setDefaultDeliveryCompanyName(previousDefaultCompanyName);
        addAlert({
          message: `Error al asignar el delivery.. ${getDisplayErrorMessage(
            error
          )} `,
          type: "error",
        });
      }
    },
    [
      order,
      deliveryCompanies,
      showDeliverySelector,
      defaultDeliveryCompanyId,
      defaultDeliveryCompanyName,
      updateOrderStatus,
      addAlert,
    ]
  );

  const shouldShowTransferPending = useMemo(
    () =>
      order?.paymentType === PaymentMethodType.TRANSFER &&
      order?.paymentStatus === PaymentStatus.PENDING,
    [order?.paymentType, order?.paymentStatus]
  );

  const shouldShowPaymentReview = useMemo(
    () =>
      order?.paymentType === PaymentMethodType.TRANSFER &&
      order?.paymentStatus === PaymentStatus.IN_PROGRESS &&
      !!order?.paymentReceiptUrl,
    [order?.paymentType, order?.paymentStatus, order?.paymentReceiptUrl]
  );

  if (!order) {
    return (
      <div className="text-gray-500 text-sm italic">Cargando orden...</div>
    );
  }
  const handleStatusChange = async (newStatus: EOrderStatusBusiness) => {
    if (!order) {
      addAlert({
        message: `No existe la orden`,
        type: "info",
      });
      return;
    }
    const previousStatus = order.status;

    updateOrderStatus(order.businessId, order.id, newStatus);
    try {
      const res = await fetchUpdateOrdersByOrderID(order.id, newStatus);

      if (res) {
        updateOrderStatus(order.businessId, order.id, res.status);
      } else {
        throw new Error(`No se pudo actualizar el estado`);
      }
    } catch (error) {
      updateOrderStatus(order.businessId, order.id, previousStatus);

      addAlert({
        message: `Hubo un error al cambiar el estado de la orden. ${getDisplayErrorMessage(
          error
        )} `,
        type: "error",
      });
    }
  };

  const handlePaymentConfirmation = async (isConfirmed: boolean) => {
    if (!order) {
      addAlert({
        message: `No existe la orden`,
        type: "info",
      });
      return;
    }

    // 1. 💾 GUARDAR estado de rollback
    const previousPaymentStatus = order.paymentStatus;
    const previousPaymentReceiptUrl = order.paymentReceiptUrl;
    const previousPaymentActionTaken = paymentActionTaken;

    const newStatus = isConfirmed
      ? PaymentStatus.CONFIRMED
      : PaymentStatus.REJECTED;

    // 2. ⚡ ACTUALIZACIÓN OPTIMISTA
    // Asumimos que la nueva URL del recibo no cambia, solo el estado de pago.
    updatePaymentStatus(
      order.businessId,
      order.id,
      newStatus,
      order.paymentReceiptUrl || ""
    );
    setPaymentActionTaken(true); // Ocultar botones inmediatamente
    try {
      const res = await fetchUpdateOrdersPaymentByOrderID(order.id, newStatus);
      if (res) {
        updatePaymentStatus(
          order.businessId,
          order.id,
          res.paymentStatus,
          order.paymentReceiptUrl || ""
        );
      } else {
        throw new Error(`No se pudo actualizar el estado`);
      }
    } catch (error) {
      updatePaymentStatus(
        order.businessId,
        order.id,
        previousPaymentStatus,
        previousPaymentReceiptUrl || ""
      );

      setPaymentActionTaken(previousPaymentActionTaken);
      addAlert({
        message: `${getDisplayErrorMessage(error)} `,
        type: "error",
      });
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

  const shouldShowPaymentButtons =
    ((order.paymentType === PaymentMethodType.CASH &&
      order.paymentStatus === PaymentStatus.PENDING) ||
      (order.paymentType === PaymentMethodType.TRANSFER &&
        shouldShowPaymentReview &&
        hasSeenVoucher)) &&
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
            setHasSeenVoucher(true);
          }}
        />
      </div>

      {/* Comentario */}
      {order.notes && (
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
