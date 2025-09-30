import { OptionCreate } from "@/features/catalog/types/catlog";
import { useState } from "react";
import { z } from "zod";

interface NewMenuGroupOptionProp {
  optionGroupId: string;
  onCreate?: (option: OptionCreate) => void;
}

// 🔑 maxQuantity ahora tiene que ser al menos 1
const optionSchema = z.object({
  name: z.string().min(1, "El nombre no puede estar vacío"),
  priceFinal: z.string().min(1, "El precio final es obligatorio"),
  hasStock: z.boolean(),
  maxQuantity: z.string().refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num >= 1;
  }, "La cantidad máxima debe ser un número mayor o igual a 1"),
});

export default function NewMenuGroupOption({
  optionGroupId,
  onCreate,
}: NewMenuGroupOptionProp) {
  const [newOption, setNewOption] = useState<OptionCreate>({
    hasStock: true,
    index: 0,
    name: "",
    optionGroupId,
    priceFinal: "",
    priceModifierType: "0",
    priceWithoutTaxes: "0",
    taxesAmount: "0",
    maxQuantity: 1,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = <K extends keyof OptionCreate>(
    field: K,
    value: OptionCreate[K]
  ) => {
    setNewOption((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Transformamos maxQuantity en string para validar con zod
    const result = optionSchema.safeParse({
      ...newOption,
      maxQuantity: String(newOption.maxQuantity),
    });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    const parsedOption = {
      ...newOption,
      maxQuantity: Number(newOption.maxQuantity), // convertimos a número al guardar
    };

    if (onCreate) {
      onCreate(parsedOption);
    }

    // Reset form
    setNewOption({
      hasStock: true,
      index: 0,
      name: "",
      optionGroupId,
      priceFinal: "",
      priceModifierType: "",
      priceWithoutTaxes: "",
      taxesAmount: "",
      maxQuantity: 1,
    });
    setError(null);
  };

  return (
    <div className="border rounded-md p-4 mb-4 bg-gray-50">
      <div className="flex flex-col gap-3">
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">
            Nombre de la opción (ej: "Coca Cola 500ml")
          </label>
          <input
            type="text"
            value={newOption.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="border rounded-md px-2 py-1"
          />
        </div>

        {/* Precio final */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-600">
            Precio final (incluye impuestos y extras)
          </label>
          <input
            type="text"
            value={newOption.priceFinal}
            onChange={(e) => handleChange("priceFinal", e.target.value)}
            className="border rounded-md px-2 py-1"
          />
        </div>

        {/* Cantidad máxima */}
        {/* <div className="flex flex-col">
          <label className="text-sm text-gray-600">
            Cantidad máxima que puede elegir el cliente
          </label>
          <input
            type="text"
            value={newOption.maxQuantity}
            onChange={(e) => handleChange("maxQuantity", e.target.value)}
            className="border rounded-md px-2 py-1"
          />
        </div> */}

        {/* Stock */}
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={newOption.hasStock}
            onChange={(e) => handleChange("hasStock", e.target.checked)}
          />
          Disponible en stock
        </label>

        {/* Error */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Botón */}
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 mt-2"
        >
          Crear opción
        </button>
      </div>
    </div>
  );
}
