"use client";

import { Package, CheckCircle, XCircle } from "lucide-react";

interface Props {
  available?: boolean;
  stock?: number;
  preparationTime: number | null;
  onUpdate: (data: {
    available?: boolean;
    stock?: number;
    preparationTime: number | null;
  }) => void;
}

export default function MenuProductStock({
  stock = 0,
  available = true,
  preparationTime = 0,
  onUpdate,
}: Props) {
  const hasStock = stock > 0;

  const handleStockToggle = () => {
    const newStock = hasStock ? 0 : 1;
    onUpdate({ available, stock: newStock, preparationTime });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Título de la sección con icono */}
      <div className="flex items-center gap-2 pb-2 border-b">
        <Package className="w-5 h-5 text-indigo-600" />
        <h3 className="text-base font-semibold text-gray-800">
          Estado del Stock
        </h3>
      </div>

      {/* Switch de Stock */}
      <div className="flex items-center justify-between gap-4">
        {/* Indicador de estado con icono */}
        <div
          className={`flex items-center gap-2 font-medium transition-colors ${
            hasStock ? "text-green-600" : "text-red-500"
          }`}
        >
          {hasStock ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>{hasStock ? "Stock disponible" : "Sin stock"}</span>
        </div>

        {/* Switch estilo EnabledSwitch */}
        <button
          type="button"
          role="switch"
          aria-checked={hasStock}
          aria-label="Estado del stock"
          onClick={handleStockToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleStockToggle();
            }
          }}
          className={[
            "relative flex-shrink-0 inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-green-500",
            hasStock ? "bg-green-500" : "bg-gray-300",
          ].join(" ")}
        >
          <span
            className={[
              "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
              hasStock ? "translate-x-5" : "translate-x-1",
            ].join(" ")}
          />
        </button>
      </div>
    </div>
  );
}
