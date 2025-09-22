"use client";
import { useState } from "react";
import { Clock, Package } from "lucide-react";

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
  available = true,
  stock = 0,
  preparationTime = 0,
  onUpdate,
}: Props) {
  const [editingField, setEditingField] = useState<"stock" | "preparationTime" | null>(null);
  const [tempValue, setTempValue] = useState<number | null>(null);

  const handleEdit = (field: "stock" | "preparationTime", value: number) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSave = () => {
    if (!editingField) return;
    onUpdate({ available, stock, preparationTime, [editingField]: tempValue });
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") setEditingField(null);
  };

  return (
    <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
      <div className="flex items-center gap-1">
        <Package size={16} />
        {editingField === "stock" ? (
          <input
            type="text"
            value={tempValue || ""}
            autoFocus
            onChange={(e) => setTempValue(Number(e.target.value))}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="border-b border-gray-400 outline-none w-20"
          />
        ) : (
          <span
            className="cursor-pointer hover:opacity-70"
            onClick={() => handleEdit("stock", stock)}
          >
            {available ? `Stock: ${stock ?? "Disponible"}` : "No disponible"}
          </span>
        )}
      </div>

      {editingField === "preparationTime" ? (
        <div className="flex items-center gap-1">
          <Clock size={16} />
          <input
            type="number"
            value={tempValue || " "}
            autoFocus
            onChange={(e) => setTempValue(Number(e.target.value))}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="border-b border-gray-400 outline-none w-16"
          />
          <span>min preparación</span>
        </div>
      ) : (
        preparationTime !== null && (
          <div className="flex items-center gap-1 cursor-pointer hover:opacity-70" onClick={() => handleEdit("preparationTime", preparationTime)}>
            <Clock size={16} />
            {preparationTime} min preparación
          </div>
        )
      )}
    </div>
  );
}
