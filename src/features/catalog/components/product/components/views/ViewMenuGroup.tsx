"use client";
import {
  useCreateOption,
  useDeleteOption,
  useUpdateOption,
} from "@/features/catalog/hooks/useMenuHooks";
import {
  IOption,
  IOptionGroup,
  OptionCreate,
} from "@/features/catalog/types/catlog";
import { useState } from "react";
import MenuGroupOption from "../MenuGroupOption";
import NewMenuGroupOption from "../news/NewMenuGroupOptioin";
import EditMenuGroup from "../edits/EditMenuGroup";
import { useMenuStore } from "@/features/catalog/stores/menuStore";
import { getDisplayErrorMessage } from "@/lib/uiErrors"; // 💡 Importación de tu helper centralizado
import { useAlert } from "@/features/common/ui/Alert/Alert";

interface ViewMenuGroupProps {
  businessId: string;
  menuId: string;
  sectionId: string;
  groupId: string;
  productId: string;
  currencyMask?: string;
  onUpdate: (data: { group: Partial<IOptionGroup> }) => void;
  onDeleteGroup: (groupId: string, optionsId: string[]) => void;
}

export default function ViewMenuGroup({
  businessId,
  menuId,
  sectionId,
  productId,
  groupId,
  currencyMask = "$",
  onUpdate,
  onDeleteGroup,
}: ViewMenuGroupProps) {
  const group = useMenuStore((status) =>
    status.menus
      .find((m) => m.id == menuId)
      ?.sections.find((s) => s.id == sectionId)
      ?.products.find((p) => p.id == productId)
      ?.optionGroups.find((g) => g.id == groupId)
  );
  const createOption = useCreateOption(businessId);
  const updateOption = useUpdateOption(businessId);
  const deleteOption = useDeleteOption(businessId);

  const createOptionStore = useMenuStore((state) => state.addOption);
  const updateOptionStore = useMenuStore((state) => state.updateOption);
  const deleteOptionStore = useMenuStore((state) => state.deleteOption);

  const [editing, setEditing] = useState(false);
  const { addAlert } = useAlert();

  const [showNewOption, setShowNewOption] = useState(false);

  if (!group) {
    return <div></div>;
  }

  // Actualizar opción
  const handleOptionUpdate = async (option: Partial<IOption>) => {
    try {
      const result = await updateOption.mutateAsync({
        data: option,
        optionId: option.id || "",
      });
      if (result) {
        updateOptionStore(
          { groupId, menuId, optionId: result.id, productId, sectionId },
          result
        );
      }
    } catch (e) {
      addAlert({
        message: getDisplayErrorMessage(e),
        type: "error",
      });
    }
  };

  // Eliminar opción
  const handleOptionDelete = async (optionId: string) => {
    try {
      await deleteOption.mutateAsync(optionId);
      deleteOptionStore({ menuId, groupId, optionId, productId, sectionId });
    } catch (e) {
      // 🎯 Captura el ApiError y usa el helper para mostrar el mensaje
      addAlert({
        message: getDisplayErrorMessage(e),
        type: "error",
      });
    }
  };

  // Crear nueva opción
  const handleNewOptionCreate = async (option: OptionCreate) => {
    try {
      const result = await createOption.mutateAsync(option);

      if (result) {
        createOptionStore({ groupId, menuId, productId, sectionId }, result);
        setShowNewOption(false);
      }
    } catch (e) {
      addAlert({
        message: getDisplayErrorMessage(e),
        type: "error",
      });
    }
  };

  return (
    <div className="mb-6 rounded-2xl border bg-white shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center border-b p-4">
        <h3 className="text-lg font-semibold">{group.name}</h3>
        <div className="flex items-center gap-3">
          <button
            className="text-blue-600 text-sm hover:underline"
            onClick={() => {
              setEditing(true);
            }}
          >
            Editar
          </button>
          {onDeleteGroup && (
            <button
              className="text-red-500 text-sm hover:underline"
              onClick={() => {
                onDeleteGroup(
                  group.id,
                  group.options.map((op) => op.id)
                );
              }}
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(group.options ?? []).map((option) => (
            <MenuGroupOption
              key={option.id}
              option={option}
              currencyMask={currencyMask}
              onUpdate={handleOptionUpdate}
              onDelete={handleOptionDelete}
            />
          ))}
        </ul>

        {showNewOption ? (
          <NewMenuGroupOption
            optionGroupId={group.id}
            onCreate={handleNewOptionCreate}
            // Asumo que tu componente NewMenuGroupOption tiene un onCancel
            // onCancel={() => setShowNewOption(false)}
          />
        ) : (
          <button
            className="mt-4 text-blue-600 text-sm hover:underline"
            onClick={() => {
              setShowNewOption(true);
            }}
          >
            + Agregar opción
          </button>
        )}
      </div>

      {editing && (
        <EditMenuGroup
          group={group}
          onUpdate={({ group: updated }) => {
            onUpdate({ group: { ...updated } });
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
          onDelete={onDeleteGroup}
        />
      )}
    </div>
  );
}
