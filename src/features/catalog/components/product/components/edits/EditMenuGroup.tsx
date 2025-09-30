import { IOptionGroup } from "@/features/catalog/types/catlog";
import { useState } from "react";
import { z } from "zod";
import { Check, X, Trash } from "lucide-react"; // íconos

interface EditMenuGroupProps {
  group: IOptionGroup;
  onUpdate: (data: { group: Partial<IOptionGroup> }) => void;
  onDelete: (groupId: string, optionsId: string[]) => void;
  onCancel?: () => void;
}

const groupSchema = z.object({
  name: z.string().min(1, "El nombre del grupo no puede estar vacío"),
  minQuantity: z.number().int().min(0, "Debe ser mayor o igual a 0"),
  maxQuantity: z.number().int().min(1, "Debe ser mayor o igual a 1"),
  quantityType: z.enum(["FIXED", "MIN_MAX"]),
});

export default function EditMenuGroup({
  group,
  onUpdate,
  onDelete,
  onCancel,
}: EditMenuGroupProps) {
  const [temp, setTemp] = useState({
    name: group.name,
    minQuantity: group.minQuantity,
    maxQuantity: group.maxQuantity,
    quantityType: group.quantityType,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof IOptionGroup, value: any) => {
    setTemp((prev) => ({ ...prev, [field]: value }));
  };

  const getModifiedFields = (): Partial<IOptionGroup> => {
    const modified: Partial<IOptionGroup> = { id: group.id };
    (Object.keys(temp) as (keyof typeof temp)[]).forEach((key) => {
      if (temp[key] !== group[key as keyof IOptionGroup]) {
        modified[key] = temp[key] as any;
      }
    });
    return modified;
  };

  const handleSave = () => {
    const modified = getModifiedFields();
    if (Object.keys(modified).length === 0) {
      onCancel?.();
      return;
    }
    const result = groupSchema.safeParse({ ...group, ...modified });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    onUpdate({ group: modified });
    onCancel?.();
  };

  return (
    <div className="bg-white rounded-xl border shadow-md p-4 space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Nombre del grupo
          </label>
          <input
            type="text"
            value={temp.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej: Bebidas"
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Cantidad mínima
          </label>
          <input
            type="number"
            value={temp.minQuantity}
            onChange={(e) =>
              handleChange("minQuantity", Number(e.target.value))
            }
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Cantidad máxima
          </label>
          <input
            type="number"
            value={temp.maxQuantity}
            onChange={(e) =>
              handleChange("maxQuantity", Number(e.target.value))
            }
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Tipo de cantidad
          </label>
          <select
            value={temp.quantityType}
            onChange={(e) => handleChange("quantityType", e.target.value)}
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="FIXED">Fijo</option>
            <option value="MIN_MAX">Mín/Máx</option>
          </select>
        </div> */}
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
        {onDelete && (
          <button
            onClick={() =>
              onDelete(
                group.id,
                group.options.map((op) => op.id)
              )
            }
            className="flex items-center gap-1 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition"
          >
            <Trash size={18} /> Eliminar
          </button>
        )}
      </div>
    </div>
  );
}
