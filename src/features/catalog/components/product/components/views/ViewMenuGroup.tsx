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
import {
  deepCopy,
  generateTempId,
  getPreviousValues,
} from "@/features/common/utils/utilities-rollback";

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
  const replaceTempId = useMenuStore((state) => state.replaceTempId);
  const restoreOption = useMenuStore((state) => state.restoreOption);

  const [editing, setEditing] = useState(false);
  const { addAlert } = useAlert();

  const [showNewOption, setShowNewOption] = useState(false);

  if (!group) {
    return <div></div>;
  }

  // Actualizar opción
  const handleOptionUpdate = async (updatedData: Partial<IOption>) => {
    // 1. 🔍 Encontrar la opción actual
    const currentOption = group.options?.find((o) => o.id === updatedData.id);

    if (!currentOption) return;

    // 2. 💾 GUARDAR ESTADO DE ROLLBACK
    const previousValues = getPreviousValues<IOption>(
      currentOption,
      updatedData
    );

    // 3. ⚡ APLICAR ACTUALIZACIÓN OPTIMISTA
    updateOptionStore(
      { menuId, groupId, optionId: currentOption.id, productId, sectionId },
      updatedData
    );
    try {
      const result = await updateOption.mutateAsync({
        data: updatedData,
        optionId: updatedData.id || "",
      });
      if (result) {
        // 4. ✅ ÉXITO: Aplicar el resultado canónico del backend
        updateOptionStore(
          { menuId, groupId, optionId: result.id, productId, sectionId },
          result
        );
        addAlert({
          message: `Opción "${result.name}" actualizada.`,
          type: "success",
        });
      } else {
        throw new Error("La API no devolvió la opción actualizada.");
      }
    } catch (e) {
      updateOptionStore(
        { menuId, groupId, optionId: currentOption.id, productId, sectionId },
        previousValues
      );
      addAlert({
        message: getDisplayErrorMessage(e),
        type: "error",
      });
    }
  };

  // Eliminar opción
  const handleOptionDelete = async (optionId: string) => {
    const optionToDelete = group.options?.find((o) => o.id === optionId);

    if (!optionToDelete) return;

    // 1. 💾 GUARDAR ESTADO DE ROLLBACK: COPIA PROFUNDA
    const optionToRestore = deepCopy(optionToDelete);

    // 2. ⚡ APLICAR ELIMINACIÓN OPTIMISTA
    deleteOptionStore({ menuId, groupId, optionId, productId, sectionId });
    try {
      await deleteOption.mutateAsync(optionId);
      addAlert({
        message: `Opción "${optionToRestore.name}" eliminada con éxito.`,
        type: "info",
      });
    } catch (e) {
      restoreOption({ menuId, groupId, productId, sectionId }, optionToRestore);
      addAlert({
        message: getDisplayErrorMessage(e),
        type: "error",
      });
    }
  };

  // Crear nueva opción
  const handleNewOptionCreate = async (optionCreate: OptionCreate) => {
    const tempId = generateTempId();

    // 2. ⚡ CONSTRUIR OPCIÓN OPTIMISTA (IOption con ID temporal)
    const optimisticOption: IOption = {
      id: tempId,
      hasStock: optionCreate.hasStock,
      index: 0,
      name: optionCreate.name,
      priceFinal: optionCreate.priceFinal,
      priceModifierType: "",
      priceWithoutTaxes: "",
      taxesAmount: "",
      maxQuantity: 1,
      images: [],
      optionGroupId: groupId,
    };
    // 3. 💾 ACTUALIZACIÓN OPTIMISTA
    createOptionStore(
      { groupId, menuId, productId, sectionId },
      optimisticOption
    );
    setShowNewOption(false);
    try {
      const result = await createOption.mutateAsync(optionCreate);

      if (result && result.id) {
        // 5. ✅ ÉXITO: REEMPLAZAR ID TEMPORAL
        replaceTempId(
          "option",
          { menuId, sectionId, productId, groupId }, // IDs de los padres
          tempId,
          result.id // ID real
        );

        // 6. Aplicar el patch canónico (opcional pero recomendado)
        updateOptionStore(
          { menuId, sectionId, productId, groupId, optionId: result.id },
          result
        );

        addAlert({
          message: `Opción "${result.name}" creada con éxito.`,
          type: "success",
        });
      } else {
        throw new Error("La opción se creó pero no se recibió el ID real.");
      }
    } catch (e) {
      deleteOptionStore({
        menuId,
        groupId,
        optionId: tempId,
        productId,
        sectionId,
      });
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
