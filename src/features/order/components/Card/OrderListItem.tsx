"use client";

import { Copy, Wallet, Package, Clock, Truck } from "lucide-react"; 
import {
  DeliveryType,
  PaymentMethodType,
  PaymentStatus,
} from "../../types/order";
import OrderStatusBadge from "../OrderStatusBadge";
import { useGlobalBusinessOrdersStore } from "@/lib/stores/orderStoreGlobal";

interface OrderListItemProps {
  businessId: string;
  orderId: string;
  // Mantengo deliveryCompanies por si se necesita información del selector en el futuro,
  // pero no es estrictamente necesario para la vista compacta.
  deliveryCompanies: { id: string; name: string }[];
  // **OPCIONAL:** Función para abrir el detalle completo al hacer clic en la fila
  onSelectOrder: (orderId: string) => void;
}

const getShortId = (id: string) => (id ? `#${id.substring(0, 8)}` : "");
const formatTime = (dateString: string) =>
  new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function OrderListItem({
  orderId,
  businessId,
  onSelectOrder,
}: OrderListItemProps) {
  // Solo necesitamos la orden para mostrar los datos
  const order = useGlobalBusinessOrdersStore((s) =>
    s.getOrderById(businessId, orderId)
  );

  // NOTA: Toda la lógica de `handleStatusChange`, `handleAssignDelivery`,
  // `handlePaymentConfirmation`, `useEffect` de auto-actualización, y `useState`s
  // se mantiene en el componente o se mueve a un componente de **Detalle** que se abre
  // al seleccionar la orden.
  // Para este ejemplo de "sólo diseño", eliminamos lo que no es estrictamente de visualización compacta.

  if (!order) {
    return (
      <div className="text-gray-500 text-sm italic py-2">Orden no encontrada.</div>
    );
  }

  // Identificar los estados clave para la vista rápida
  const isPickup = order.deliveryType === DeliveryType.PICKUP;
  const isTransfer = order.paymentType === PaymentMethodType.TRANSFER;

  // Renderizado principal: una fila compacta
  return (
    <div
      className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-yellow-50/70 transition-colors cursor-pointer text-sm"
      onClick={() => onSelectOrder(order.id)} // Abrir detalle al hacer clic
      role="row"
      aria-label={`Orden de ${order.user.fullName}`}
    >
      {/* Columna 1: ID, Estado y Fecha (Elemento principal de la lista) */}
      <div className="flex-1 min-w-[200px] flex items-center space-x-3 pr-2">
        <div className="min-w-[100px]">
          <OrderStatusBadge
            status={order.status}
            paymentStatus={order.paymentStatus as PaymentStatus}
            paymentType={order.paymentType}
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 flex items-center gap-1">
            {order.user.fullName || "Cliente Desconocido"}
          </span>
          <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime(order.createdAt)} - {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Columna 2: Tipo de Entrega y Dirección/Compañía */}
      <div className="flex-1 min-w-[150px] text-gray-600 hidden sm:block pr-2">
        <span className="font-medium flex items-center gap-1">
          {isPickup ? (
            <>
              <Package className="w-4 h-4 text-orange-500" /> Retiro en Tienda
            </>
          ) : (
            <>
              <Truck className="w-4 h-4 text-blue-500" />
              {order.deliveryCompanyId ? (
                // Muestra el nombre de la compañía asignada o solo 'Envío'
                order.deliveryCompanyId || 'Envío Asignado'
              ) : (
                "Envío Pendiente"
              )}
            </>
          )}
        </span>
        {/* Mostrar dirección corta solo si no es retiro */}
        {!isPickup && (
          <p className="text-xs text-gray-500 truncate">
            {order.user.address || "Dirección no especificada"}
          </p>
        )}
      </div>

      {/* Columna 3: Pago y Total (Cifra clave) */}
      <div className="w-24 text-right">
        <span className="font-bold text-lg text-green-700">
          ${Number(order.total).toFixed(2)}
        </span>
        <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
          {isTransfer ? (
            <Wallet className="w-3 h-3 text-blue-600" />
          ) : (
            <span className="font-medium text-xs">Efectivo</span>
          )}
        </div>
      </div>

      {/* Columna 4 (Opcional): Botón de Acciones Rápidas (e.g., copiar ID) */}
      <div className="w-10 flex justify-end pl-2">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Previene que se abra el detalle de la orden
            navigator.clipboard.writeText(order.id);
            // Mostrar una alerta de copia, si es posible
          }}
          className="p-1 text-gray-400 hover:text-gray-700 rounded-full"
          title="Copiar ID de la orden"
          aria-label="Copiar ID"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}