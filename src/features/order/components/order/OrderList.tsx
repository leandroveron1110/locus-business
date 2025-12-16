import {
  DollarSign,
  Wallet,
  MapPin,
  Package,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import OrderStatusBadge from "../OrderStatusBadge";
import { formatPrice } from "@/features/common/utils/formatPrice";
import {
  DeliveryType,
  Order,
  PaymentMethodType,
} from "@/types/order";

interface OrderProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
}

export function OrderList({ order, onViewDetails }: OrderProps) {
  // ==============================
  // Helpers
  // ==============================
  const isPickup = order.deliveryType === DeliveryType.PICKUP;
  const paymentInfo =
    order.paymentType === PaymentMethodType.CASH
      ? { icon: <DollarSign className="w-3.5 h-3.5 text-green-600" />, text: "Efectivo" }
      : order.paymentType === PaymentMethodType.TRANSFER
      ? { icon: <Wallet className="w-3.5 h-3.5 text-blue-600" />, text: "Transferencia" }
      : { icon: <AlertCircle className="w-3.5 h-3.5 text-gray-400" />, text: "Sin definir" };

  const shortId = `#${order.id.slice(0, 6)}`;
  const DeliveryIcon = isPickup ? Package : MapPin;
  const deliveryText = isPickup ? "Retiro" : "Envío";

  const formattedDate = new Date(order.createdAt).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
  });
  const formattedTime = new Date(order.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDateTime = `${formattedDate} ${formattedTime}hs`;

  const hasObservations =
    order.customerObservations;

  // ==============================
  // Render
  // ==============================
  return (
    <div
      className="w-full border-b border-gray-100 hover:bg-gray-50 transition-colors px-4 py-3 cursor-pointer"
      onClick={onViewDetails ? () => onViewDetails(order.id) : undefined}
    >
{/* Línea superior */}
<div className="flex flex-wrap items-center justify-start gap-x-2">
  <span className="text-sm font-semibold text-gray-900 truncate max-w-[60%]">
    {order.user.fullName}
  </span>

  <span className="text-xs text-gray-500 font-mono">
    {formattedDateTime}
  </span>
</div>


      {/* Línea principal */}
      <div className="flex flex-wrap items-center text-xs text-gray-600 mt-1 gap-x-3 gap-y-1">
        <span className="font-mono text-gray-500">{shortId}</span>

        <span className="text-gray-300">|</span>

        {/* Entrega */}
        <span className="flex items-center">
          <DeliveryIcon className="w-3.5 h-3.5 mr-1 text-gray-400" />
          {deliveryText}
        </span>

        <span className="text-gray-300">|</span>

        {/* Pago */}
        <span className="flex items-center truncate">
          {paymentInfo.icon}
          <span className="ml-1">{paymentInfo.text}</span>
        </span>

        <span className="text-gray-300">|</span>

        {/* Estado del pago */}
        {/* <span
          className={`flex items-center ${
            order.paymentStatus === PaymentStatus.PAID
              ? "text-green-600"
              : order.paymentStatus === PaymentStatus.PENDING
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {order.paymentStatus === PaymentStatus.PAID && (
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
          )}
          {order.paymentStatus === PaymentStatus.PENDING && (
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
          )}
          {order.paymentStatus === PaymentStatus.REJECTED && (
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
          )}
          {order.paymentStatus}
        </span> */}

        {/* <span className="text-gray-300">|</span> */}

        {/* Estado de la orden */}
        <OrderStatusBadge
          status={order.status}
          paymentStatus={order.paymentStatus}
          paymentType={order.paymentType}
        />

        <span className="text-gray-300">|</span>

        {/* Monto */}
        <span className="text-sm font-semibold text-green-700">
          {formatPrice(order.total)}
        </span>
      </div>

      {/* Línea de notas/observaciones */}
      {hasObservations && (
        <div className="mt-1 flex items-start gap-1 text-xs text-gray-500">
          <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-[2px] text-gray-400" />
          <p className="truncate max-w-full">
            {order.customerObservations ||
              order.businessObservations ||
              order.notes}
          </p>
        </div>
      )}
    </div>
  );
}
