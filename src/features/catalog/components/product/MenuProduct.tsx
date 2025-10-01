"use client";
import React, { useState } from "react";
import { IMenuProduct, OptionGroupCreate } from "../../types/catlog";
import MenuProductImage from "./components/MenuProducImage";
import MenuGroup from "./components/MenuGroup";
import MenuProductHeader from "./components/MenuProductHeader";
import MenuProductPrice from "./components/MenuProductPrice";
import MenuProductStock from "./components/MenuProductStock";
import MenuProductFlags from "./components/MenuProductFlags";
import EnabledSwitch from "./components/EnabledSwitch";
import NewMenuGroup from "./components/news/NewMenuGroup";
import {
  useCreateOptionGroup,
  useDeleteManyOption,
  useDeleteOptionGroup,
  useUpdateMenuProduct,
  useUpdateOptionGroup,
} from "../../hooks/useMenuHooks";
import { useMenuStore } from "../../stores/menuStore";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface Props {
  businessId: string;
  menuId: string;
  sectionId: string;
  productId: string;
  onClose: () => void;
}

export default function MenuProduct({
  businessId,
  menuId,
  sectionId,
  productId,
  onClose,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const { addAlert } = useAlert();

  // 📌 producto desde la store
  const product = useMenuStore((state) =>
    state.menus
      .find((m) => m.id === menuId)
      ?.sections.find((s) => s.id === sectionId)
      ?.products.find((p) => p.id === productId)
  );

  const [initialProduct] = useState(() => (product ? { ...product } : null));
  const updateProduct = useMenuStore((state) => state.updateProduct);
  const updateGroupStore = useMenuStore((state) => state.updateGroup);
  const deleteGroupStore = useMenuStore((state) => state.deleteGroup);
  const addGroupStore = useMenuStore((state) => state.addGroup);

  const createGroup = useCreateOptionGroup(businessId);
  const updateGroup = useUpdateOptionGroup(businessId);
  const deleteGroup = useDeleteOptionGroup(businessId);
  const deleteManyOptionsMutate = useDeleteManyOption(businessId);
  const updateMenuProductMutate = useUpdateMenuProduct(businessId);

  if (!product) return null;

  const handleUpdate = (data: Partial<IMenuProduct>) => {
    updateProduct({ menuId, sectionId, productId }, { ...product, ...data });
  };

  const getModifiedFields = (): Partial<IMenuProduct> => {
    if (!initialProduct) return {};

    // Cambiamos el tipo de construcción a uno más flexible inicialmente
    const modified: Record<string, unknown> = { id: product.id };

    (Object.keys(product) as (keyof IMenuProduct)[]).forEach((key) => {
      // Es mejor usar '===' para la comparación de igualdad
      if (
        JSON.stringify(product[key]) !== JSON.stringify(initialProduct[key])
      ) {
        const value = product[key];

        // La verificación 'value !== null' sigue siendo esencial para tu lógica de negocio
        if (value !== null) {
          // Asignamos sin problemas de tipo porque modified es Record<string, unknown>
          modified[key as string] = value;
        }
      }
    });

    // Asertamos el objeto construido a tu tipo final antes de devolverlo.
    // Esto es seguro ya que Object.keys(product) solo produce claves de IMenuProduct.
    return modified as Partial<IMenuProduct>;
  };

  const handleSaveAll = async () => {
    const modified = getModifiedFields();

    if (Object.keys(modified).length <= 1) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      const data = await updateMenuProductMutate.mutateAsync({
        productId,
        data: modified,
      });

      if (data) {
        updateProduct({ menuId, sectionId, productId }, data);
        onClose();
      }
    } catch (error) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGroupUpdate = async (
    groupId: string,
    updatedData: Partial<OptionGroupCreate>
  ) => {
    try {
      const result = await updateGroup.mutateAsync({
        groupId,
        data: updatedData,
      });
      if (result) {
        updateGroupStore(
          {
            menuId,
            groupId,
            sectionId,
            productId,
          },
          result
        );
      }
    } catch (error) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  };

  const deleteGroupWithOptions = async (
    groupId: string,
    optionIds: string[]
  ) => {
    try {
      await deleteManyOptionsMutate.mutateAsync(optionIds);
      await deleteGroup.mutateAsync(groupId);
      deleteGroupStore({
        groupId,
        menuId,
        productId,
        sectionId,
      });
    } catch (error) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  };

  const handleNewGroupCreate = async (group: OptionGroupCreate) => {
    try {
      const result = await createGroup.mutateAsync(group);

      if (result) {
        addGroupStore(
          {
            menuId,
            productId,
            sectionId,
          },
          result
        );
        setShowNewGroup(false);
      }
    } catch (error) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Imagen */}
      <MenuProductImage
        businessId={businessId}
        menuProductId={product.id}
        image={product.imageUrl || ""}
        name={product.name}
        onUpdate={(data) => handleUpdate({ imageUrl: data.imageUrl })}
      />

      {/* Header */}
      <MenuProductHeader
        name={product.name}
        description={product.description}
        onUpdate={(data) => handleUpdate(data)}
      />

      {/* Precio */}
      <MenuProductPrice
        finalPrice={product.finalPrice}
        originalPrice={product.originalPrice}
        discountPercentage={product.discountPercentage}
        currencyMask={product.currencyMask}
        onUpdate={(data) => handleUpdate(data)}
      />

      {/* Stock y disponibilidad */}
      <MenuProductStock
        available={product.available}
        stock={product.stock}
        preparationTime={product.preparationTime}
        onUpdate={(data) => handleUpdate(data)}
      />

      {/* Flags */}
      <MenuProductFlags
        isMostOrdered={product.isMostOrdered}
        isRecommended={product.isRecommended}
        onUpdate={(data) => handleUpdate(data)}
      />

      {/* Enabled */}
      <EnabledSwitch
        enabled={!!product.enabled}
        onChange={(val) => handleUpdate({ enabled: val })}
        label="Visible en la carta"
        hint="Activa o desactiva la visibilidad del producto."
      />

      {/* Opciones */}
      <div className="space-y-6 mb-6">
        {(product.optionGroups ?? []).map((group) => (
          <MenuGroup
            key={group.id}
            businessId={businessId}
            groupId={group.id}
            menuId={menuId}
            productId={productId}
            sectionId={sectionId}
            currencyMask={product.currencyMask || "$"}
            onDeleteGroup={deleteGroupWithOptions}
            onUpdate={(data) => handleGroupUpdate(group.id, data.group)}
          />
        ))}

        {showNewGroup ? (
          <NewMenuGroup
            menuProductId={product.id}
            onCreate={handleNewGroupCreate}
            onClose={() => setShowNewGroup(false)}
          />
        ) : (
          <button
            className="text-blue-600 hover:underline text-sm"
            onClick={() => setShowNewGroup(true)}
          >
            + Agregar grupo
          </button>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={onClose}
          className="flex-1 text-sm sm:flex-none px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 disabled:opacity-50"
          // onClick={}
        >
          Eliminar
        </button>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
