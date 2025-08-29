"use client";
import { CheckCircle, XCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface OptionCardProps {
  option: {
    name: string;
    maxQuantity: number;
    priceFinal: string;
    hasStock: boolean;
  };
  currencyMask: string;
}

export default function OptionCard({ option, currencyMask }: OptionCardProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div
      className={`flex flex-col gap-3 
        p-4 rounded-2xl shadow-sm border cursor-pointer transition 
        ${
          option.hasStock
            ? "hover:bg-gray-50"
            : "opacity-50 cursor-not-allowed"
        }`}
      onClick={() => option.hasStock && setEditing(true)}
    >
      {/* Nombre + Estado */}
      <div className="flex items-center gap-2">
        {option.hasStock ? (
          <CheckCircle className="text-green-500 w-5 h-5 shrink-0" />
        ) : (
          <XCircle className="text-red-500 w-5 h-5 shrink-0" />
        )}
        <span className="font-semibold text-base text-gray-800 leading-snug break-words">
          {option.name || "Sin nombre"}
        </span>
      </div>

      {/* Cantidad Máxima */}
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <ShoppingCart className="w-4 h-4 shrink-0" />
        <span>Máx. {option.maxQuantity || 1}</span>
      </div>

      {/* Precio */}
      <div className="flex justify-end">
        <span className="font-bold text-indigo-600 text-xl sm:text-2xl">
          {currencyMask}
          {Number(option.priceFinal || 0).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
