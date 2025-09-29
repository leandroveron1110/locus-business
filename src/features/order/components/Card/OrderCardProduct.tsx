import { useState } from "react";
import { Eye } from "lucide-react";
import { OrderItem } from "../../types/order";

interface OrderCardProductProps {
  order: OrderItem;
}

export const OrderCardProduct: React.FC<OrderCardProductProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(price);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="border rounded-lg shadow-sm p-4 mb-4 hover:shadow-md transition-shadow bg-white">
      {/* Header: Imagen + Nombre + Cantidad + Total */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {order.productImageUrl && (
            <img
              src={order.productImageUrl}
              alt={order.productName}
              className="w-12 h-12 object-cover rounded-md"
            />
          )}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{order.productName}</h3>
            {order.productDescription && (
              <p className="text-xs text-gray-500 truncate max-w-xs">
                {order.productDescription}
              </p>
            )}
            {order.notes && (
              <p className="text-xs text-blue-600 mt-1">Notas: {order.notes}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-gray-700">
            Cant: {order.quantity}
          </span>
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(order.priceAtPurchase)}
          </span>
        </div>
      </div>

      {/* Opciones / Acordeón */}
      {order.optionGroups.length > 0 && (
        <button
          onClick={toggleExpand}
          className="mt-3 flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          {isExpanded ? "Ocultar opciones" : "Ver opciones"}
        </button>
      )}

      {isExpanded &&
        order.optionGroups.map((group) => (
          <div key={group.id} className="mt-2 border-t pt-2">
            <h4 className="text-xs font-semibold text-gray-600">
              {group.groupName} ({group.quantityType})
            </h4>
            {group.options.map((option) => (
              <div
                key={option.id}
                className="flex justify-between items-center text-xs mt-1"
              >
                <span>{option.optionName} x{option.quantity}</span>
                <span>{formatPrice(option.priceFinal)}</span>
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};
