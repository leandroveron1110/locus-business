import {
  Package,
  Truck,
  DollarSign,
  Wallet,
} from "lucide-react";

import OrderStatusBadge from "../OrderStatusBadge";
import { formatPrice } from "@/features/common/utils/formatPrice";
import {
  DeliveryType,
  PaymentMethodType,
} from "@/types/order";
import { IOrder } from "../../types/order";

interface Props {
  order: IOrder;
  onClick: () => void;
}

export function OrderList({ order, onClick }: Props) {
  const createdAt = new Date(order.createdAt);

  const date = createdAt.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: '2-digit'
  });

  const time = createdAt.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const DeliveryIcon =
    order.deliveryType === DeliveryType.PICKUP ? Package : Truck;

  const PaymentIcon =
    order.orderPaymentMethod === PaymentMethodType.CASH
      ? DollarSign
      : Wallet;

  return (
    <div
      onClick={onClick}
      className="bg-white border-b hover:bg-gray-50 transition cursor-pointer"
    >
      {/* ================= MOBILE ================= */}
      <div className="md:hidden p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="text-xs text-gray-500">
            #{order.id.slice(0, 6)} • {date} {time}
          </div>

          <span className="font-semibold text-green-700">
            {formatPrice(order.total)}
          </span>
        </div>

        {/* Cliente */}
        <div className="font-medium truncate">
          {order.user.fullName}
        </div>

        {/* Info */}
        <div className="flex flex-wrap gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <DeliveryIcon className="w-3.5 h-3.5" />
            {order.deliveryType === DeliveryType.PICKUP
              ? "Retiro"
              : "Domicilio"}
          </span>

          <span className="flex items-center gap-1">
            <PaymentIcon className="w-3.5 h-3.5" />
            {order.orderPaymentMethod === PaymentMethodType.CASH
              ? "Efectivo"
              : "Transferencia"}
          </span>
        </div>

        {/* Estado */}
        <OrderStatusBadge
          status={order.status}
          paymentStatus={order.paymentStatus}
          orderPaymentMethod={order.orderPaymentMethod}
        />
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:grid grid-cols-[90px_80px_80px_160px_160px_140px_140px_120px] items-center px-4 py-3 text-sm">
        {/* ID */}
        <span className="text-xs text-gray-500">
          #{order.id.slice(0, 6)}
        </span>

        {/* Fecha */}
        <span className="text-xs text-gray-500">
          {date}
        </span>

        {/* Hora */}
        <span className="text-xs text-gray-500">
          {time}
        </span>

        {/* Cliente */}
        <span className="truncate font-medium">
          {order.user.fullName}
        </span>

        {/* Estado */}
        <OrderStatusBadge
          status={order.status}
          paymentStatus={order.paymentStatus}
          orderPaymentMethod={order.orderPaymentMethod}
        />

        {/* Tipo */}
        <span className="flex items-center gap-2 text-gray-700 p-2">
          <DeliveryIcon className="w-4 h-4" />
          {order.deliveryType === DeliveryType.PICKUP
            ? "Retiro"
            : "Domicilio"}
        </span>

        {/* Pago */}
        <span className="flex items-center gap-2 text-gray-700">
          <PaymentIcon className="w-4 h-4" />
          {order.orderPaymentMethod === PaymentMethodType.CASH
            ? "Efectivo"
            : "Transferencia"}
        </span>

        {/* Total */}
        <span className="text-right font-semibold text-green-700">
          {formatPrice(order.total)}
        </span>
      </div>
    </div>
  );
}
