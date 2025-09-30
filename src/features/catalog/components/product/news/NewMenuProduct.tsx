// src/features/business/catalog/product/NewMenuProduct.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { IMenuProduct, MenuProductCreate } from "../../../types/catlog";
import { useCreateMenuProduct } from "../../../hooks/useMenuHooks";
import MenuProductPrice from "../components/MenuProductPrice";
import MenuProductStock from "../components/MenuProductStock";
import MenuProductFlags from "../components/MenuProductFlags";
import EnabledSwitch from "../components/EnabledSwitch";
import { useMenuStore } from "../../../stores/menuStore";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface Props {
  menuId: string;
  sectionId: string;
  businessId: string;
  ownerId: string;
  onClose: () => void;
  onCreated: (product: IMenuProduct) => void;
}

export default function NewMenuProduct({
  menuId,
  sectionId,
  businessId,
  ownerId,
  onClose,
  onCreated,
}: Props) {

  const { addAlert } = useAlert();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prices, setPrices] = useState({
    originalPrice: "",
    finalPrice: "",
    discountPercentage: "",
  });

  const [stock, setStock] = useState(0);
  const [available, setAvailable] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [flags, setFlags] = useState({
    isMostOrdered: false,
    isRecommended: false,
  });

  const createProduct = useCreateMenuProduct();
  const addProduct = useMenuStore((status) => status.addProduct);
  const [saving, setSaving] = useState(false);

  // --- REFERENCIA PARA EL INPUT DE NOMBRE ---
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const newProduct: MenuProductCreate = {
        name,
        businessId,
        menuId,
        ownerId,
        description,
        enabled,
        originalPrice: "" + prices.originalPrice,
        finalPrice: "" + prices.finalPrice,
        discountPercentage: "" + prices.discountPercentage,
        stock,
        available,
        isMostOrdered: flags.isMostOrdered,
        isRecommended: flags.isRecommended,
        hasOptions: false,
        seccionId: sectionId,
        imageUrl: undefined,
      };

      const created = await createProduct.mutateAsync(newProduct);

      if(created) {
        onCreated(created);
  
        const add: IMenuProduct = {
          ...created,
          ...newProduct,
        };
  
        addProduct({ menuId, sectionId }, add);
        onClose();
      }
    } catch (error) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: 'error'
      })
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-xl mx-auto space-y-5">
      <h2 className="text-xl font-semibold">Nuevo Producto</h2>

      <EnabledSwitch
        enabled={enabled}
        onChange={setEnabled}
        label="Visible en la carta"
        hint="Controla si el producto aparece o no para los clientes."
      />

      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input
          ref={nameInputRef}
          type="text"
          value={name}
          placeholder="Ej: Pizza Napolitana"
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          value={description}
          placeholder="Agrega una breve descripción del producto"
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <MenuProductPrice
        finalPrice={prices.finalPrice}
        discountPercentage={prices.discountPercentage}
        originalPrice={prices.originalPrice}
        onUpdate={(data) =>
          setPrices({
            discountPercentage: `${data.discountPercentage}`,
            finalPrice: `${data.finalPrice}`,
            originalPrice: `${data.originalPrice}`,
          })
        }
      />

      <MenuProductStock
        stock={stock}
        available={available}
        preparationTime={0}
        onUpdate={(data) => {
          if (data.stock !== undefined) setStock(data.stock);
          if (data.available !== undefined) setAvailable(data.available);
        }}
      />

      <MenuProductFlags
        isMostOrdered={flags.isMostOrdered}
        isRecommended={flags.isRecommended}
        onUpdate={(data) => setFlags(data)}
      />

      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={onClose}
          className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleCreate}
          disabled={saving || !name.trim() || Number(prices.finalPrice) <= 0}
          className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Creando..." : "Crear Producto"}
        </button>
      </div>
    </div>
  );
}
