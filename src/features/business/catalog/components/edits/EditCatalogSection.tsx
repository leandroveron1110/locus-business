"use client";

import { useState } from "react";
import { IMenuSectionWithProducts } from "../../types/catlog";
import { z } from "zod";
import { Check, X, Trash } from "lucide-react";

interface Props {
  section: IMenuSectionWithProducts;
  onUpdate: (data: { section: Partial<IMenuSectionWithProducts> }) => void;
  onDelete: (sectionId: string) => void;
  onCancel?: () => void;
}

const sectionSchema = z.object({
  name: z.string().min(1, "El nombre de la sección no puede estar vacío"),
  index: z.number().int().min(0, "El índice debe ser mayor o igual a 0"),
});

export default function EditCatalogSection({
  section,
  onUpdate,
  onDelete,
  onCancel,
}: Props) {
  const [temp, setTemp] = useState({
    name: section.name,
    index: section.index,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof temp, value: any) => {
    setTemp((prev) => ({ ...prev, [field]: value }));
  };

  const getModifiedFields = (): Partial<IMenuSectionWithProducts> => {
    const modified: Partial<IMenuSectionWithProducts> = { id: section.id };
    (Object.keys(temp) as (keyof typeof temp)[]).forEach((key) => {
      if (temp[key] !== section[key as keyof IMenuSectionWithProducts]) {
        modified[key] = temp[key] as any;
      }
    });
    return modified;
  };

  const handleSave = () => {
    const modified = getModifiedFields();

    if (Object.keys(modified).length === 1 && modified.id) {
      // no hay cambios
      onCancel?.();
      return;
    }

    const result = sectionSchema.safeParse({ ...section, ...modified });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    onUpdate({ section: modified });
    onCancel?.();
  };

  return (
    <div className="bg-white rounded-xl border shadow-md p-4 space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Nombre de la sección
          </label>
          <input
            type="text"
            value={temp.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej: Entradas"
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">Índice</label>
          <input
            type="number"
            value={temp.index}
            onChange={(e) => handleChange("index", Number(e.target.value))}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Botones */}
      <div className="flex gap-3 flex-wrap justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Check size={18} /> Guardar
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          <X size={18} /> Cancelar
        </button>
        <button
          onClick={() => onDelete(section.id)}
          className="flex items-center gap-1 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition"
        >
          <Trash size={18} /> Eliminar
        </button>
      </div>
    </div>
  );
}
