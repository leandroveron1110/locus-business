"use client";
import { OptionGroupCreate } from "@/features/business/catalog/types/catlog";
import { useState } from "react";
import { z } from "zod";
import { Check, X } from "lucide-react";

interface NewMenuGroupProps {
  menuProductId: string;
  onCreate?: (group: OptionGroupCreate) => void;
}

const groupSchema = z.object({
  name: z.string().min(1, "El nombre del grupo es obligatorio"),
  minQuantity: z.number().int().min(0, "Debe ser >= 0"),
  maxQuantity: z.number().int().min(0, "Debe ser >= 0"),
  quantityType: z.enum(["FIXED", "MIN_MAX"]),
});

export default function NewMenuGroup({ menuProductId, onCreate }: NewMenuGroupProps) {
  const [newGroup, setNewGroup] = useState<OptionGroupCreate>({
    maxQuantity: 0,
    menuProductId,
    minQuantity: 0,
    name: "",
    quantityType: "FIXED",
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof OptionGroupCreate, value: any) => {
    setNewGroup((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const result = groupSchema.safeParse(newGroup);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    if (onCreate) {
      onCreate(newGroup);
    }

    // Reset form
    setNewGroup({
      maxQuantity: 0,
      menuProductId,
      minQuantity: 0,
      name: "",
      quantityType: "FIXED",
    });
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl border shadow-md p-4 flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-4">
      {/* Nombre */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">Nombre del grupo</label>
        <input
          type="text"
          value={newGroup.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Ej: Bebidas"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Cantidad mínima */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">Cantidad mínima</label>
        <input
          type="number"
          value={newGroup.minQuantity}
          onChange={(e) => handleChange("minQuantity", Number(e.target.value))}
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Cantidad máxima */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">Cantidad máxima</label>
        <input
          type="number"
          value={newGroup.maxQuantity}
          onChange={(e) => handleChange("maxQuantity", Number(e.target.value))}
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Tipo de cantidad */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">Tipo de cantidad</label>
        <select
          value={newGroup.quantityType}
          onChange={(e) => handleChange("quantityType", e.target.value)}
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="FIXED">Fijo</option>
          <option value="MIN_MAX">Mín/Máx</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="col-span-1 md:col-span-2 text-red-500 text-sm font-medium">{error}</div>
      )}

      {/* Botones */}
      <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row gap-3 justify-end mt-2">
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white w-full md:w-auto px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Check size={20} />
          Crear
        </button>
        <button
          onClick={() => setNewGroup({ ...newGroup, name: "", minQuantity: 0, maxQuantity: 0, quantityType: "FIXED" })}
          className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 w-full md:w-auto px-4 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
        >
          <X size={20} />
          Limpiar
        </button>
      </div>
    </div>
  );
}
