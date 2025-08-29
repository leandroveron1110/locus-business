// src/features/business/catalog/product/MenuProduct.tsx
"use client";
import React, { useState } from "react";
import { IMenuProduct, OptionGroupCreate } from "../../types/catlog";
import MenuProductImage from "./components/MenuProducImage";
import MenuGroup from "./components/MenuGroup";
import MenuProductHeader from "./components/MenuProductHeader";
import MenuProductPrice from "./components/MenuProductPrice";
import MenuProductStock from "./components/MenuProductStock";
import MenuProductFlags from "./components/MenuProductFlags";
import EnabledSwitch from "./components/EnabledSwitch"; // <<--- IMPORTAR
import NewMenuGroup from "./components/news/NewMenuGroup";
import {
  useCreateOptionGroup,
  useDeleteManyOption,
  useDeleteOptionGroup,
  useUpdateMenuProduct,
  useUpdateOptionGroup,
} from "../../hooks/useMenuHooks";

interface Props {
  product: IMenuProduct;
  onClose: () => void;
  onChange: (updatedProduct: IMenuProduct) => void;
}

export default function MenuProduct({ product, onClose, onChange }: Props) {
  const [editableProduct, setEditableProduct] = useState(product);
  const [saving, setSaving] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);

  const createGroup = useCreateOptionGroup();
  const updateGroup = useUpdateOptionGroup();
  const deleteGroup = useDeleteOptionGroup();
  const deleteManyOptionsMutate = useDeleteManyOption();
  const updateMenuProductMutate = useUpdateMenuProduct();

  const handleUpdate = (data: Partial<IMenuProduct>) => {
    setEditableProduct((prev) => ({ ...prev, ...data }));
  };

  const getModifiedProductFields = (): Partial<IMenuProduct> => {
    const modified: Partial<IMenuProduct> = { id: editableProduct.id };
    (Object.keys(editableProduct) as (keyof IMenuProduct)[]).forEach((key) => {
      if (editableProduct[key] !== product[key]) {
        modified[key] = editableProduct[key];
      }
    });
    return modified;
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const modifiedFields = getModifiedProductFields();
      const { optionGroups, ...menuProductData } = modifiedFields; // no enviar groups
      const updatedProduct = await updateMenuProductMutate.mutateAsync({
        productId: editableProduct.id,
        data: menuProductData,
      });
      onChange(updatedProduct);
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
      setEditableProduct((prev) => ({
        ...prev,
        optionGroups: prev.optionGroups.map((g) =>
          g.id === groupId ? { ...g, ...result } : g
        ),
      }));
    } catch (error) {
      console.error("Error actualizando grupo", error);
    }
  };

  const deleteGroupWithOptions = async (groupId: string, optionIds: string[]) => {
    try {
      await deleteManyOptionsMutate.mutateAsync(optionIds);
      await deleteGroup.mutateAsync(groupId);
      setEditableProduct((prev) => ({
        ...prev,
        optionGroups: prev.optionGroups.filter((g) => g.id !== groupId),
      }));
    } catch (e) {
      console.error("Error eliminando grupo y opciones", e);
    }
  };

  const handleNewGroupCreate = async (group: OptionGroupCreate) => {
    try {
      const result = await createGroup.mutateAsync(group);
      setEditableProduct((prev) => ({
        ...prev,
        optionGroups: [
          ...prev.optionGroups,
          {
            id: result.id,
            name: result.name,
            maxQuantity: result.maxQuantity,
            minQuantity: result.minQuantity,
            quantityType: result.quantityType,
            options: [],
          },
        ],
      }));
      setShowNewGroup(false);
    } catch {}
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Imagen */}
      <MenuProductImage
        menuProductId={product.id}
        image={editableProduct.imageUrl || ""}
        name={editableProduct.name}
        onUpdate={(data) => handleUpdate({ imageUrl: data.imageUrl })}
      />

      {/* Enabled */}
      <EnabledSwitch
        enabled={!!editableProduct.enabled}
        onChange={(val) => handleUpdate({ enabled: val })}
        label="Visible en la carta"
        hint="Activa o desactiva la visibilidad del producto."
      />

      {/* Header */}
      <MenuProductHeader
        name={editableProduct.name}
        description={editableProduct.description}
        onUpdate={(data) => handleUpdate(data)}
      />

      {/* Precio */}
      <MenuProductPrice
        finalPrice={editableProduct.finalPrice}
        originalPrice={editableProduct.originalPrice}
        discountPercentage={editableProduct.discountPercentage}
        currencyMask={editableProduct.currencyMask}
        onUpdate={(data) => handleUpdate(data)}
      />

      {/* Stock y disponibilidad */}
      <MenuProductStock
        available={editableProduct.available}
        stock={editableProduct.stock}
        preparationTime={editableProduct.preparationTime}
        onUpdate={(data) => handleUpdate(data)}
      />

      {/* Flags */}
      <MenuProductFlags
        isMostOrdered={editableProduct.isMostOrdered}
        isRecommended={editableProduct.isRecommended}
        onUpdate={(data) => handleUpdate(data)}
      />

      {/* Opciones */}
      {editableProduct.hasOptions && (
        <div className="space-y-6 mb-6">
          {editableProduct.optionGroups.map((group) => (
            <MenuGroup
              key={group.id}
              group={group}
              currencyMask={editableProduct.currencyMask || "$"}
              onDeleteGroup={deleteGroupWithOptions}
              onUpdate={(data) => handleGroupUpdate(group.id, data.group)}
            />
          ))}

          {showNewGroup ? (
            <NewMenuGroup
              menuProductId={editableProduct.id}
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
      )}

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
