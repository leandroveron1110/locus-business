import { IOption } from "@/features/catalog/types/catlog";
import { useState } from "react";
import { z } from "zod";
import { Check, X, Trash } from "lucide-react"; // iconos modernos

interface EditMenuGroupOptionProps {
  option: IOption;
  currencyMask?: string;
  onCancel: () => void;
  onUpdate: (data: { option: Partial<IOption> }) => void;
  onDelete?: (optionId: string) => void;
}

const optionSchema = z.object({
  name: z.string().min(1, "El nombre no puede estar vacío"),
  priceFinal: z.string().min(1, "El precio es obligatorio"),
  maxQuantity: z.number().int().min(1, "La cantidad máxima debe ser >= 1"),
});

interface TempOption {
  id: string;
  name: string;
  maxQuantity: number;
  priceFinal: string;
  hasStock: boolean;
}

export default function EditMenuGroupOption({
  option,
  onUpdate,
  onDelete,
  onCancel,
}: EditMenuGroupOptionProps) {
  const [temp, setTemp] = useState<TempOption>({
    maxQuantity: option.maxQuantity || 1,
    name: option.name,
    id: option.id,
    priceFinal: option.priceFinal,
    hasStock: option.hasStock,
  });
  const [error, setError] = useState<string | null>(null);
  const isFree = parseFloat(temp.priceFinal) === 0;

  const getModifiedFields = (): Partial<IOption> => {
    const modified: Record<string, unknown> = { id: option.id };
    (Object.keys(temp) as (keyof typeof temp)[]).forEach((key) => {
      if (temp[key] !== option[key]) {
        modified[key] = temp[key];
      }
    });
    return modified as Partial<IOption>;
  };

  const handleChange = <K extends keyof TempOption>(
    field: K,
    value: TempOption[K]
  ) => {
    setTemp((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const modified = getModifiedFields();
    if (Object.keys(modified).length === 0) return onCancel();
    const result = optionSchema.safeParse({ ...option, ...modified });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    onUpdate({ option: modified });
    onCancel();
  };

  return (
    <div className="bg-white rounded-xl border shadow-md p-4 flex flex-col gap-4">
      {/* Contenedor de inputs */}
      <div className="flex flex-col gap-4">
        {/* Nombre */}
        <div className="flex flex-col gap-2">
          <label className="text-xs sm:text-sm font-medium text-gray-600">
            Nombre
          </label>
          <input
            type="text"
            value={temp.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Ej: Coca Cola 500ml"
            className="border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm w-full"
          />
        </div>

        {/* Precio */}
        <div className="flex flex-col gap-2">
          <label className="text-xs sm:text-sm font-medium text-gray-600">
            Precio ($)
          </label>
          <input
            type="text"
            // Mostrar "" si es gratis para que el usuario pueda escribir más fácilmente, si no, el valor actual
            value={isFree ? "" : temp.priceFinal}
            onChange={(e) => handleChange("priceFinal", e.target.value)}
            // Placeholder: incluye la opción "Gratis"
            placeholder={isFree ? "Gratis (Precio 0)" : "Ej: 15.00"}
            className="border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm w-full"
          />
        </div>

        {/* Cantidad máxima */}
        {/* <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-600">Cantidad máxima</label>
      <input
        type="number"
        value={temp.maxQuantity}
        onChange={(e) => handleChange("maxQuantity", Number(e.target.value))}
        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div> */}

        {/* Stock - Descomentar y ajustar si es necesario */}
        <div className="flex items-center gap-2 mt-4 sm:col-span-1">
          <input
            type="checkbox"
            checked={temp.hasStock}
            onChange={(e) => handleChange("hasStock", e.target.checked)}
            // Se usa el tamaño 'sm' para compatibilidad con Tailwind
            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 shrink-0"
          />
          <span className="text-sm text-gray-700 select-none">En stock</span>
        </div>

        {/* Error */}
        {error && (
          <div className="col-span-2 text-red-500 text-sm font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Contenedor de botones */}
      <div className="flex flex-col md:flex-row md:justify-end gap-3 mt-4">
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white w-full md:w-auto px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Check size={20} />
          Guardar
        </button>

        <button
          onClick={onCancel}
          className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 w-full md:w-auto px-4 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
        >
          <X size={20} />
          Cancelar
        </button>

        {onDelete && (
          <button
            onClick={() => onDelete(option.id)}
            className="flex items-center justify-center gap-2 text-red-600 w-full md:w-auto px-4 py-3 rounded-lg hover:bg-red-50 transition font-medium"
          >
            <Trash size={20} />
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}
