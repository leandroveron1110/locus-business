"use client";
import React, { useState, useMemo } from "react";
import { IMenuProduct, IOption, MenuProductCreate, OptionCreate } from "../types/catlog";
import { useUpdateMenuProduct, useCreateOption, useUpdateOption } from "../hooks/useMenuHooks";
import { Star, Plus, Trash2 } from "lucide-react";

interface Props {
  product: IMenuProduct;
  onClose: () => void;
}

export default function ProductEditorModern({ product, onClose }: Props) {
  const [productName, setProductName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.finalPrice);
  const [available, setAvailable] = useState(product.available);
  const [enabled, setEnabled] = useState(product.enabled);
  const [options, setOptions] = useState<IOption[]>(product.optionGroups.flatMap(g => g.options));

  const updateProductMutation = useUpdateMenuProduct(product.id);
  const createOptionMutation = useCreateOption();
  const updateOptionMutation = useUpdateOption("");

  // Guardar cambios de producto
  const handleSaveProduct = () => {
    updateProductMutation.mutate({
      name: productName,
      description,
      finalPrice: price,
      available,
      enabled,
    } as Partial<MenuProductCreate>);
    onClose();
  };

  // Guardar cambios de opción
  const handleUpdateOption = (optionId: string, field: keyof OptionCreate, value: any) => {
    updateOptionMutation.mutate({ [field]: value });
    setOptions((prev) =>
      prev.map((o) => (o.id === optionId ? { ...o, [field]: value } : o))
    );
  };

  // Agregar nueva opción
  const handleAddOption = () => {
    const newOption: OptionCreate = {
      name: "Nueva opción",
      hasStock: true,
      index: options.length + 1,
      priceFinal: "0.00",
      priceWithoutTaxes: "0.00",
      taxesAmount: "0.00",
      priceModifierType: "NOT_CHANGE",
      optionGroupId: product.optionGroups[0].id,
    };
    createOptionMutation.mutate(newOption);
    setOptions([...options, { ...newOption, id: Math.random().toString() } as IOption]);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4 border rounded shadow-lg bg-white">
      {/* Imagen */}
      {product.imageUrl && (
        <div className="w-full h-[200px] rounded overflow-hidden border mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Información del producto editable */}
      <div className="space-y-3">
        <input
          className="border p-2 rounded w-full text-lg font-semibold"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Nombre del producto"
        />
        <textarea
          className="border p-2 rounded w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción"
        />
        <div className="flex gap-4 items-center">
          <input
            type="number"
            className="border p-2 rounded w-32"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Precio"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            Disponible
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
            />
            Habilitado
          </label>
        </div>
        <div className="flex items-center gap-2 text-yellow-400">
          <Star />
          <span>{product.rating}</span>
        </div>
      </div>

      {/* Opciones del producto */}
      {options.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Opciones</h3>
          {options.map((opt) => (
            <div key={opt.id} className="flex gap-2 items-center border p-2 rounded">
              <input
                className="border p-1 rounded flex-1"
                value={opt.name}
                onChange={(e) => handleUpdateOption(opt.id, "name", e.target.value)}
              />
              <input
                className="border p-1 rounded w-24"
                value={opt.priceFinal}
                onChange={(e) => handleUpdateOption(opt.id, "priceFinal", e.target.value)}
              />
              <button
                className="text-red-500 hover:text-red-700"
                aria-label="Eliminar opción"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddOption}
            className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            <Plus size={16} /> Agregar opción
          </button>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleSaveProduct}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar cambios
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
