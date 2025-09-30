"use client";
import { useState } from "react";

interface Props {
  isMostOrdered?: boolean;
  isRecommended?: boolean;
  onUpdate: (data: { isMostOrdered: boolean; isRecommended: boolean }) => void;
}

export default function MenuProductFlags({
  isMostOrdered = false,
  isRecommended = false,
  onUpdate,
}: Props) {
  const [flags, setFlags] = useState({ isMostOrdered, isRecommended });

  const toggleFlag = (field: "isMostOrdered" | "isRecommended") => {
    const newFlags = { ...flags, [field]: !flags[field] };
    setFlags(newFlags);
    onUpdate(newFlags);
  };

  return (
    <div className="flex gap-2 mb-4">
      {/* Más pedido */}
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full cursor-pointer transition 
          ${
            flags.isMostOrdered
              ? "bg-blue-100 text-blue-700 hover:opacity-70"
              : "bg-gray-200 text-gray-400"
          }`}
        onClick={() => toggleFlag("isMostOrdered")}
      >
        Más pedido
      </span>

      {/* Recomendado */}
      <span
        className={`text-xs font-medium px-2 py-1 rounded-full cursor-pointer transition
          ${
            flags.isRecommended
              ? "bg-green-100 text-green-700 hover:opacity-70"
              : "bg-gray-200 text-gray-400"
          }`}
        onClick={() => toggleFlag("isRecommended")}
      >
        Recomendado
      </span>
    </div>
  );
}
