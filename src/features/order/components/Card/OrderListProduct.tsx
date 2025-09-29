import { useState } from "react";
import { OrderItem } from "../../types/order";
import { OrderCardProduct } from "./OrderCardProduct";

interface OrderModalProps {
  orders: OrderItem[];
  isOpen: boolean;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ orders, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Contenedor del modal */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Pedidos</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
          {orders.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No hay pedidos para mostrar
            </div>
          ) : (
            orders.map((order) => (
              <OrderCardProduct key={order.id} order={order} />
            ))
          )}
        </div>

        {/* Footer opcional */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
