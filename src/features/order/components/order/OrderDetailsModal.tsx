"use client";

import { useState } from "react";
import {
  X,
  Package,
  Truck,
  DollarSign,
  Wallet,
  ExternalLink,
  Image as ImageIcon,
  AlertTriangle,
  CreditCard,
  Banknote,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { EOrderStatus, IOrder } from "../../types/order";
import {
  DeliveryType,
  PaymentMethodType,
  PaymentStatus,
} from "@/types/order";

import { formatPrice } from "@/features/common/utils/formatPrice";
import OrderStatusBadge from "../OrderStatusBadge";
import {
  fetchUpdateOrdersByOrderID,
  fetchUpdateOrdersPaymentByOrderID,
} from "../../api/catalog-api";
import { useAlert } from "@/features/common/ui/Alert/Alert";

interface Props {
  order: IOrder;
  onClose: () => void;
}

const getNextOrderStatus = (
  current: EOrderStatus,
  deliveryType: DeliveryType
): EOrderStatus | null => {
  switch (current) {
    case EOrderStatus.PENDING:
      return EOrderStatus.PREPARING;
    case EOrderStatus.CONFIRMED:
      return EOrderStatus.PREPARING
    case EOrderStatus.PREPARING:
      return deliveryType === DeliveryType.PICKUP
        ? EOrderStatus.READY_FOR_CUSTOMER_PICKUP
        : EOrderStatus.READY_FOR_DELIVERY_PICKUP;
    case EOrderStatus.READY_FOR_CUSTOMER_PICKUP:
    case EOrderStatus.READY_FOR_DELIVERY_PICKUP:
      return EOrderStatus.COMPLETED;
    default:
      return null;
  }
};

export function OrderDetailsModal({ order, onClose }: Props) {
  const createdAt = new Date(order.createdAt);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addAlert } = useAlert();

  /* ================== TOTALES ================== */
  const totals = order.items.reduce(
    (acc, item) => {
      const subtotal = item.priceAtPurchase * item.quantity;
      if (item.productPaymentMethod === PaymentMethodType.CASH) {
        acc.cash += subtotal;
      } else {
        acc.transfer += subtotal;
      }
      return acc;
    },
    { cash: 0, transfer: 0 }
  );

  const isTransferOrder =
    order.orderPaymentMethod === PaymentMethodType.TRANSFER;

  const hasPaymentConflict = isTransferOrder && totals.cash > 0;

  const nextStatus = getNextOrderStatus(
    order.status as unknown as EOrderStatus,
    order.deliveryType
  );

  const handleAdvanceStatus = async () => {
    if (!nextStatus) return;

    try {
      setLoading(true);
      setError(null);

      if (
        isTransferOrder &&
        order.paymentStatus === PaymentStatus.IN_PROGRESS
      ) {
        await fetchUpdateOrdersPaymentByOrderID(
          order.id,
          PaymentStatus.CONFIRMED
        );
        addAlert({
          message: "Pago confirmado",
          type: "success",
        });
      }

      await fetchUpdateOrdersByOrderID(order.id, nextStatus);
      addAlert({
        message: `Orden actualizada`,
        type: "info",
      });
      onClose();
    } catch {
      setError("Error al actualizar el pedido");
      addAlert({
        message: "Error al actualizar el pedido",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      if (
        isTransferOrder &&
        order.paymentStatus === PaymentStatus.IN_PROGRESS
      ) {
        await fetchUpdateOrdersPaymentByOrderID(
          order.id,
          PaymentStatus.REJECTED
        );
        addAlert({
          message: "Pago rechazado",
          type: "info",
        });
      }
      await fetchUpdateOrdersByOrderID(
        order.id,
        EOrderStatus.CANCELLED_BY_BUSINESS
      );
      addAlert({
          message: "Pedido rechazado",
          type: "info",
        });
      onClose();
    } catch {
      setError("Error al cancelar el pedido");
      addAlert({
        message: "Error al cancelar el pedido",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const nextActionLabel = (() => {
    switch (nextStatus) {
      case EOrderStatus.PREPARING:
        return "Aceptar y preparar pedido";
      case EOrderStatus.CONFIRMED:
        return "Listo para retirar"
      case EOrderStatus.READY_FOR_CUSTOMER_PICKUP:
        return "Listo para retirar";
      case EOrderStatus.READY_FOR_DELIVERY_PICKUP:
        return "Listo para envío";
      case EOrderStatus.COMPLETED:
        return "Finalizar pedido";
      default:
        return null;
    }
  })();

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">
              Pedido #{order.id.slice(0, 6)}
            </h2>
            <p className="text-xs text-gray-500">
              {createdAt.toLocaleDateString("es-AR")} •{" "}
              {createdAt.toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <OrderStatusBadge
              status={order.status}
              paymentStatus={order.paymentStatus}
              orderPaymentMethod={order.orderPaymentMethod}
            />
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* CLIENTE */}
          <section className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-700">Cliente</h3>
            <p className="font-medium">{order.user.fullName}</p>
            {order.user.phone && (
              <p className="text-sm text-gray-500">{order.user.phone}</p>
            )}
            {order.user.address && (
              <p className="text-sm text-gray-500">{order.user.address}</p>
            )}
          </section>

          {/* ENTREGA */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Entrega
            </h3>
            <div className="flex items-center gap-2 text-sm">
              {order.deliveryType === DeliveryType.PICKUP ? (
                <>
                  <Package className="w-4 h-4 text-gray-600" />
                  Retiro en local
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4 text-gray-600" />
                  Envío a domicilio
                </>
              )}
            </div>
          </section>

          {/* PRODUCTOS */}
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Productos
            </h3>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between font-medium text-sm">
                    <span>
                      {item.quantity}× {item.productName}
                    </span>
                    <span>
                      {formatPrice(item.priceAtPurchase * item.quantity)}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium
                    ${
                      item.productPaymentMethod === PaymentMethodType.CASH
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.productPaymentMethod === PaymentMethodType.CASH ? (
                      <Banknote className="w-3.5 h-3.5" />
                    ) : (
                      <CreditCard className="w-3.5 h-3.5" />
                    )}
                    {item.productPaymentMethod === PaymentMethodType.CASH
                      ? "Solo efectivo"
                      : "Transferencia"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* PAGO */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Pago</h3>

            <div className="flex items-center gap-2 text-sm">
              {isTransferOrder ? (
                <>
                  <Wallet className="w-4 h-4 text-gray-600" />
                  Transferencia bancaria
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 text-gray-600" />
                  Pago en efectivo
                </>
              )}
            </div>

            <div className="text-sm space-y-1">
              {totals.transfer > 0 && (
                <p className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  Transferencia: {formatPrice(totals.transfer)}
                </p>
              )}
              {totals.cash > 0 && (
                <p className="flex items-center gap-2">
                  <Banknote className="w-4 h-4 text-yellow-600" />
                  Efectivo: {formatPrice(totals.cash)}
                </p>
              )}
            </div>

            <p className="text-lg font-semibold text-green-700">
              Total: {formatPrice(order.total)}
            </p>

            {hasPaymentConflict && (
              <div className="flex gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                <AlertTriangle className="w-4 h-4 mt-0.5" />
                El cliente transfiere {formatPrice(totals.transfer)} y paga{" "}
                {formatPrice(totals.cash)} en efectivo al entregar.
              </div>
            )}

            {order.paymentReceiptUrl && (
              <div className="space-y-2">
                <a
                  href={order.paymentReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <ImageIcon className="w-4 h-4" />
                  Ver comprobante
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="border rounded-lg overflow-hidden max-w-xs">
                  <img
                    src={order.paymentReceiptUrl}
                    alt="Comprobante"
                    className="w-full object-cover"
                  />
                </div>
              </div>
            )}
          </section>

          {error && (
            <p className="text-sm text-red-600 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              {error}
            </p>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <button
            onClick={handleCancelOrder}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
          >
            Cancelar pedido
          </button>

          {nextStatus && (
            <button
              onClick={handleAdvanceStatus}
              disabled={loading}
              className="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              {nextActionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
