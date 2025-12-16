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
import { generateTempId } from "@/features/common/utils/utilities-rollback";

interface Props {
  menuId: string;
  sectionId: string;
  businessId: string;
  ownerId: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function NewMenuProduct({
  menuId,
  sectionId,
  businessId,
  ownerId,
  onClose,
}: Props) {
  const { addAlert } = useAlert();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [prices, setPrices] = useState({
    originalPrice: "",
    finalPrice: "",
    discountPercentage: "",
  });

  const [stock, setStock] = useState(1);
  const [available, setAvailable] = useState(true);
  const [enabled, setEnabled] = useState(true);

  const [flags, setFlags] = useState({
    isMostOrdered: false,
    isRecommended: false,
  });

  // 🆕 Métodos de pago del producto
  const [paymentMethods, setPaymentMethods] = useState({
    acceptsCash: true,
    acceptsTransfer: true,
    acceptsQr: false,
  });

  const createProduct = useCreateMenuProduct(businessId);
  const addProduct = useMenuStore((s) => s.addProduct);
  const replaceTempId = useMenuStore((s) => s.replaceTempId);
  const deleteProduct = useMenuStore((s) => s.deleteProduct);
  const updateProduct = useMenuStore((s) => s.updateProduct);

  const [saving, setSaving] = useState(false);

  // Autofocus en nombre
  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleCreate = async () => {
    if (!name.trim() || Number(prices.finalPrice) <= 0) return;

    setSaving(true);

    const tempId = generateTempId();

    // Datos que se envían al servidor
    const newProductCreate: MenuProductCreate = {
      name,
      businessId,
      menuId,
      ownerId,
      description,
      enabled,
      originalPrice: prices.originalPrice,
      finalPrice: prices.finalPrice,
      discountPercentage: prices.discountPercentage,
      stock,
      available,
      isMostOrdered: flags.isMostOrdered,
      isRecommended: flags.isRecommended,
      hasOptions: false,
      seccionId: sectionId,
      imageUrl: undefined,

      // 🆕 MÉTODOS DE PAGO
      acceptsCash: paymentMethods.acceptsCash,
      acceptsTransfer: paymentMethods.acceptsTransfer,
      acceptsQr: paymentMethods.acceptsQr,
    };

    // Product optimista
    const optimisticProduct: IMenuProduct = {
      id: tempId,
      name,
      description,
      enabled,
      originalPrice: prices.originalPrice,
      finalPrice: prices.finalPrice,
      discountPercentage: prices.discountPercentage,
      stock,
      available,
      isMostOrdered: flags.isMostOrdered,
      isRecommended: flags.isRecommended,
      hasOptions: false,
      seccionId: sectionId,
      currency: "$",
      imageUrl: "",
      optionGroups: [],
      preparationTime: 0,

      // 🆕 Métodos de pago en store
      acceptsCash: paymentMethods.acceptsCash,
      acceptsTransfer: paymentMethods.acceptsTransfer,
      acceptsQr: paymentMethods.acceptsQr,
    };

    addProduct({ menuId, sectionId }, optimisticProduct);
    onClose();

    try {
      const created = await createProduct.mutateAsync(newProductCreate);

      if (created && created.id) {
        replaceTempId(
          "product",
          { menuId, sectionId },
          tempId,
          created.id
        );

        updateProduct(
          { menuId, productId: created.id, sectionId },
          created
        );

        addAlert({
          message: `Producto "${created.name}" creado con éxito.`,
          type: "success",
        });

        onClose();
      } else {
        throw new Error("Producto creado pero el ID real no fue devuelto.");
      }
    } catch (error) {
      deleteProduct({ menuId, sectionId, productId: tempId });

      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        {/* Nombre */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-700 mb-0.5">
            Nombre
          </label>
          <input
            ref={nameInputRef}
            type="text"
            value={name}
            placeholder="Ej: Pizza Napolitana"
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-700 mb-0.5">
            Descripción
          </label>
          <textarea
            value={description}
            placeholder="Agrega una breve descripción del producto"
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            rows={2}
          />
        </div>
      </div>

      {/* --- Precios --- */}
      <div className="border-t border-gray-200 pt-4">
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
      </div>

      {/* --- Stock y Flags --- */}
      <div className="border-t border-gray-200 pt-4 space-y-4">
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

        <EnabledSwitch
          enabled={enabled}
          onChange={setEnabled}
          label="Visible en la carta"
          hint="Controla si el producto aparece o no para los clientes."
        />
      </div>

      {/* 🆕 MÉTODOS DE PAGO DEL PRODUCTO */}
      <div className="p-4 border border-gray-200 rounded-xl bg-white">
        <h4 className="font-semibold text-gray-800 mb-3">
          Métodos de pago del producto
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <EnabledSwitch
            enabled={paymentMethods.acceptsCash}
            onChange={(v) =>
              setPaymentMethods((p) => ({ ...p, acceptsCash: v }))
            }
            label="Efectivo"
            hint="Permite pagar este producto en efectivo."
          />

          <EnabledSwitch
            enabled={paymentMethods.acceptsTransfer}
            onChange={(v) =>
              setPaymentMethods((p) => ({ ...p, acceptsTransfer: v }))
            }
            label="Transferencia"
            hint="Permite pagar con transferencia bancaria."
          />

          <EnabledSwitch
            enabled={paymentMethods.acceptsQr}
            onChange={(v) =>
              setPaymentMethods((p) => ({ ...p, acceptsQr: v }))
            }
            label="QR / billeteras"
            hint="Permite pagar con QR o billeteras digitales."
          />
        </div>
      </div>

      {/* Acciones */}
      <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-end gap-3">
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
