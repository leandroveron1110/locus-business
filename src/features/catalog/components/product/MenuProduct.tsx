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
  menuId: string;
  sectionId: string;
  productId: string;
  onClose: () => void;
}

export default function MenuProduct({
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

  const createGroup = useCreateOptionGroup();
  const updateGroup = useUpdateOptionGroup();
  const deleteGroup = useDeleteOptionGroup();
  const deleteManyOptionsMutate = useDeleteManyOption();
  const updateMenuProductMutate = useUpdateMenuProduct();

  if (!product) return null;

  const handleUpdate = (data: Partial<IMenuProduct>) => {
    updateProduct({ menuId, sectionId, productId }, { ...product, ...data });
  };

  const getModifiedFields = (): Partial<IMenuProduct> => {
    if (!initialProduct) return {};
    const modified: Partial<IMenuProduct> = { id: product.id };
    (Object.keys(product) as (keyof IMenuProduct)[]).forEach((key) => {
      if (
        JSON.stringify(product[key]) !== JSON.stringify(initialProduct[key])
      ) {
        modified[key] = product[key] as any;
      }
    });
    return modified;
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
