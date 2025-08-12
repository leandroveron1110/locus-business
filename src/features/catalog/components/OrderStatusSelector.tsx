import React, { useState } from "react";
import { EOrderStatusBusiness } from "../types/order";

const ORDER_STATUS = [
  { value: EOrderStatusBusiness.PENDING_CONFIRMATION, label: "Pendiente confirmación", color: "bg-yellow-500" },
  { value: EOrderStatusBusiness.CONFIRMED, label: "Confirmar pedido", color: "bg-green-500" },
  { value: EOrderStatusBusiness.REJECTED_BY_BUSINESS, label: "Rechazar", color: "bg-red-500" },
  { value: EOrderStatusBusiness.READY_FOR_CUSTOMER_PICKUP, label: "Listo para retiro", color: "bg-purple-500" },
  { value: EOrderStatusBusiness.READY_FOR_DELIVERY_PICKUP, label: "Llamar delivery", color: "bg-pink-500" },
];

interface Props {
  orderId: string;
  status: EOrderStatusBusiness;
  handleChangeStatus: (orderId: string, value: EOrderStatusBusiness) => void;
}

function OrderStatusSelector({ orderId, status, handleChangeStatus }: Props) {
  const [isChanging, setIsChanging] = useState(false);

  const currentStatus = ORDER_STATUS.find((s) => s.value === status);

  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as EOrderStatusBusiness;
    if (newStatus === status) return;

    setIsChanging(true);
    try {
      await handleChangeStatus(orderId, newStatus);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="mt-2 flex items-center space-x-2">
      {/* Indicador de color */}
      <span
        className={`w-4 h-4 rounded-full ${currentStatus?.color ?? "bg-gray-400"}`}
        title={currentStatus?.label}
      />

      <select
        className={`px-3 py-1 rounded border border-gray-300 text-gray-800 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-${currentStatus?.color.replace("bg-", "")}`}
        value={status}
        onChange={onChange}
        disabled={isChanging}
        title={currentStatus?.label}
      >
        {ORDER_STATUS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {isChanging && (
        <span className="text-gray-600 text-xs italic select-none">Actualizando...</span>
      )}
    </div>
  );
}

export default OrderStatusSelector;
