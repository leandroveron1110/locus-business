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

interface Props {
  menuId: string;
  sectionId: string;
  productId: string;
  onClose: () => void;
}

export default function MenuProduct({ menuId, sectionId, productId, onClose }: Props) {
  const [saving, setSaving] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);

  // 📌 producto desde la store
  const product = useMenuStore((state) =>
    state.menus
      .find((m) => m.id === menuId)
      ?.sections.find((s) => s.id === sectionId)
      ?.products.find((p) => p.id === productId)
  );


  const updateProduct = useMenuStore((state) => state.updateProduct);

  const createGroup = useCreateOptionGroup();
  const updateGroup = useUpdateOptionGroup();
  const deleteGroup = useDeleteOptionGroup();
  const deleteManyOptionsMutate = useDeleteManyOption();
  const updateMenuProductMutate = useUpdateMenuProduct();

  if (!product) return null;

  const handleUpdate = (data: Partial<IMenuProduct>) => {
    updateProduct({ menuId, sectionId, productId }, { ...product, ...data });
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const { optionGroups, ...menuProductData } = product; // no enviar groups
      const updatedProduct = await updateMenuProductMutate.mutateAsync({
        productId,
        data: menuProductData,
      });
      updateProduct({ menuId, sectionId, productId }, updatedProduct);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el producto");
    } finally {
      setSaving(false);
    }
  };

  const handleGroupUpdate = async (
    groupId: string,
    updatedData: Partial<OptionGroupCreate>
  ) => {
    try {
      const result = await updateGroup.mutateAsync({ groupId, data: updatedData });
      updateProduct({ menuId, sectionId, productId }, {
        ...product,
        optionGroups: product.optionGroups.map((g) =>
          g.id === groupId ? { ...g, ...result } : g
        ),
      });
    } catch (error) {
      console.error("Error actualizando grupo", error);
    }
  };

  const deleteGroupWithOptions = async (groupId: string, optionIds: string[]) => {
    try {
      await deleteManyOptionsMutate.mutateAsync(optionIds);
      await deleteGroup.mutateAsync(groupId);
      updateProduct({ menuId, sectionId, productId }, {
        ...product,
        optionGroups: product.optionGroups.filter((g) => g.id !== groupId),
      });
    } catch (e) {
      console.error("Error eliminando grupo y opciones", e);
    }
  };

  const handleNewGroupCreate = async (group: OptionGroupCreate) => {
    try {
      const result = await createGroup.mutateAsync(group);
      updateProduct({ menuId, sectionId, productId }, {
        ...product,
        optionGroups: [
          ...product.optionGroups,
          {
            id: result.id,
            name: result.name,
            maxQuantity: result.maxQuantity,
            minQuantity: result.minQuantity,
            quantityType: result.quantityType,
            options: [],
          },
        ],
      });
      setShowNewGroup(false);
    } catch {}
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Imagen */}
      <MenuProductImage
        menuProductId={product.id}
        image={product.imageUrl || ""}
        name={product.name}
        onUpdate={(data) => handleUpdate({ imageUrl: data.imageUrl })}
      />

      {/* Enabled */}
      <EnabledSwitch
        enabled={!!product.enabled}
        onChange={(val) => handleUpdate({ enabled: val })}
        label="Visible en la carta"
        hint="Activa o desactiva la visibilidad del producto."
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

      {/* Opciones */}
      <div className="space-y-6 mb-6">
        {(product.optionGroups ?? []).map((group) => (
          <MenuGroup
            key={group.id}
            group={group}
            currencyMask={product.currencyMask || "$"}
            onDeleteGroup={deleteGroupWithOptions}
            onUpdate={(data) => handleGroupUpdate(group.id, data.group)}
          />
        ))}

        {showNewGroup ? (
          <NewMenuGroup
            menuProductId={product.id}
            onCreate={handleNewGroupCreate}
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

      {/* Guardar */}
      <button
        onClick={handleSaveAll}
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
}
