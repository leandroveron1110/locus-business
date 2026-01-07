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
  Order,
  PaymentMethodType,
} from "@/types/order";

interface Props {
  order: Order;
  onClick: () => void;
}

export function OrderList({ order, onClick }: Props) {
  const date = new Date(order.createdAt).toLocaleDateString("es-AR", {
    // day: "2-digit",
    month: "2-digit",
    year: '2-digit',
  });

  const time = new Date(order.createdAt).toLocaleTimeString("es-AR", {
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
      className="bg-white border-b hover:bg-gray-50 cursor-pointer transition"
    >

      {/* DESKTOP */}
      <div className="hidden md:grid grid-cols-[90px_60px_1fr_160px_140px_140px_120px] items-center px-4 py-3 text-sm">
        <span className="text-xs text-gray-500">{order.id.slice(0, 6)}</span>
        <span className="text-xs text-gray-500">{date}</span>
        <span className="text-xs text-gray-500">{time}</span>

        <span className="truncate font-medium">
          {order.user.fullName}
        </span>

        <OrderStatusBadge
          status={order.status}
          paymentStatus={order.paymentStatus}
          orderPaymentMethod={order.orderPaymentMethod}
        />

        <span className="flex items-center gap-1">
          <DeliveryIcon className="w-4 h-4" />
          {order.deliveryType === DeliveryType.PICKUP
            ? "Retiro"
            : "Domicilio"}
        </span>

        <span className="flex items-center gap-1">
          <PaymentIcon className="w-4 h-4" />
          {order.orderPaymentMethod === PaymentMethodType.CASH
            ? "Efectivo"
            : "Transferencia"}
        </span>

        <span className="text-right font-semibold text-green-700">
          {formatPrice(order.total)}
        </span>
      </div>
    </div>
  );
}
