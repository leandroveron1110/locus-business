"use client";

import { useState } from "react";
import { IMenuSectionWithProducts } from "../../types/catlog";
import { z } from "zod";
import { Check, X, Trash, AlertCircle } from "lucide-react";

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

type TempSection = {
  name: string;
  index: number;
};

export default function EditCatalogSection({
  section,
  onUpdate,
  onDelete,
  onCancel,
}: Props) {
  const [temp, setTemp] = useState<TempSection>({
    name: section.name,
    index: section.index,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = <K extends keyof TempSection>(
    field: K,
    value: TempSection[K]
  ) => {
    setTemp((prev) => ({ ...prev, [field]: value }));
  };

  const getModifiedFields = (): Partial<IMenuSectionWithProducts> => {
    const modified: Record<string, unknown> = { id: section.id };

    (Object.keys(temp) as (keyof TempSection)[]).forEach((key) => {
      if (temp[key] !== section[key]) {
        modified[key] = temp[key];
      }
    });

    return modified as Partial<IMenuSectionWithProducts>;
  };

  const handleSave = () => {
    const modified = getModifiedFields();

    if (Object.keys(modified).length === 1 && modified.id) {
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
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
      {/* Inputs */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Nombre de la sección
          </label>
          <input
            type="text"
            value={temp.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej: Entradas"
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Índice</label>
          <input
            type="number"
            value={temp.index}
            onChange={(e) => handleChange("index", Number(e.target.value))}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Botones */}
      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-blue-700 transition-all"
        >
          <Check size={18} /> Guardar
        </button>

        <button
          onClick={onCancel}
          className="flex items-center gap-2 bg-gray-100 text-gray-800 px-5 py-2 rounded-xl font-medium hover:bg-gray-200 transition-all"
        >
          <X size={18} /> Cancelar
        </button>

        <button
          onClick={() => onDelete(section.id)}
          className="flex items-center gap-2 text-red-600 bg-red-50 px-5 py-2 rounded-xl font-medium hover:bg-red-100 transition-all"
        >
          <Trash size={18} /> Eliminar
        </button>
      </div>
    </div>
  );
}
