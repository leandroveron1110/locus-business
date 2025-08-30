"use client";
import {
  useCreateOption,
  useDeleteOption,
  useUpdateOption,
} from "@/features/business/catalog/hooks/useMenuHooks";
import {
  IOption,
  IOptionGroup,
  OptionCreate,
} from "@/features/business/catalog/types/catlog";
import { useState } from "react";
import MenuGroupOption from "../MenuGroupOption";
import NewMenuGroupOption from "../news/NewMenuGroupOptioin";
import EditMenuGroup from "../edits/EditMenuGroup";
import { useMenuStore } from "@/features/business/catalog/stores/menuStore";

interface ViewMenuGroupProps {
  menuId: string;
  sectionId: string;
  groupId: string;
  productId: string;
  currencyMask?: string;
  onUpdate: (data: { group: Partial<IOptionGroup> }) => void;
  onDeleteGroup: (groupId: string, optionsId: string[]) => void;
}

export default function ViewMenuGroup({
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
  const createOption = useCreateOption();
  const updateOption = useUpdateOption();
  const deleteOption = useDeleteOption();

  const createOptionStore = useMenuStore((state) => state.addOption);
  const updateOptionStore = useMenuStore((state) => state.updateOption);
  const deleteOptionStore = useMenuStore((state) => state.deleteOption);

  const [editing, setEditing] = useState(false);
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
      updateOptionStore(
        {
          groupId,
          menuId,
          optionId: result.id,
          productId,
          sectionId,
        },
        result
      );
    } catch (e) {
      console.error("Error actualizando opción", e);
    }
  };

  // Eliminar opción
  const handleOptionDelete = async (optionId: string) => {
    try {
      await deleteOption.mutateAsync(optionId);
      deleteOptionStore({ menuId, groupId, optionId, productId, sectionId });
    } catch (e) {
      console.error("Error eliminando opción", e);
    }
  };

  // Crear nueva opción
  const handleNewOptionCreate = async (option: OptionCreate) => {
    try {
      const result = await createOption.mutateAsync(option);
      createOptionStore(
        {
          groupId,
          menuId,
          productId,
          sectionId,
        },
        result
      );
      setShowNewOption(false);
    } catch (e) {
      console.error("Error creando opción", e);
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
            onClick={() => setEditing(true)}
          >
            Editar
          </button>
          {onDeleteGroup && (
            <button
              className="text-red-500 text-sm hover:underline"
              onClick={() =>
                onDeleteGroup(
                  group.id,
                  group.options.map((op) => op.id)
                )
              }
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      {/* Opciones */}
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
          />
        ) : (
          <button
            className="mt-4 text-blue-600 text-sm hover:underline"
            onClick={() => setShowNewOption(true)}
          >
            + Agregar opción
          </button>
        )}
      </div>

      {/* Modal / Inline edición */}
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
