"use client";

import React from "react";
import { IMenuSectionWithProducts } from "../../types/catlog";
import ViewCatalogSection from "./ViewCatalogSection";
import { useDeleteSection, useUpdateSection } from "../../hooks/useMenuHooks";
import { useMenuStore } from "../../stores/menuStore";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
import {
  deepCopy,
  getPreviousValues,
} from "@/features/common/utils/utilities-rollback";

interface Props {
  menuId: string;
  sectionId: string;
  businessId: string;
  ownerId: string;
}

export default function CatalogSection({
  sectionId,
  menuId,
  businessId,
  ownerId,
}: Props) {
  const updateSectionMutation = useUpdateSection(businessId);
  const deleteSectionMutation = useDeleteSection(businessId);
  const restoreSection = useMenuStore((state) => state.restoreSection);
  const updateSection = useMenuStore((state) => state.updateSection);
  const deleteSection = useMenuStore((state) => state.deleteSection);
  const { addAlert } = useAlert();
  const section = useMenuStore((state) =>
    state.menus
      .find((m) => m.id === menuId)
      ?.sections.find((s) => s.id === sectionId)
  );

  const handleSectionChange = async (
    updated: Partial<IMenuSectionWithProducts>
  ) => {
    if (!section) return;

    const previousValues = getPreviousValues<Partial<IMenuSectionWithProducts>>(
      section,
      updated
    );

    if (Object.keys(previousValues).length === 0) return;

    updateSection({ menuId, sectionId }, updated);

    try {
      const sectionUpdate = await updateSectionMutation.mutateAsync({
        sectionId,
        data: {
          businessId,
          menuId,
          ownerId,
          ...updated,
        },
      });

      if (sectionUpdate) {
        updateSection({ menuId, sectionId }, sectionUpdate);
        addAlert({
          message: "Sección actualizada con éxito.",
          type: "success",
        });
      } else {
        throw new Error(`Ocurrio un error al actualizar la seccion`)
      }
    } catch (error) {
      updateSection({ menuId, sectionId }, previousValues);

      // 7. Notificar Error
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  };

  const handleSectionDelete = async () => {
    if (!section) return;

    const sectionToRestore = deepCopy(section);

    // 2. ⚡ APLICAR ELIMINACIÓN OPTIMISTA
    deleteSection({
      menuId,
      sectionId: section.id, // Usamos section.id por claridad
    });

    try {
      await deleteSectionMutation.mutateAsync(sectionId);
      addAlert({
        message: `Sección "${sectionToRestore.name}" eliminada con éxito.`,
        type: "info",
      });
    } catch (error) {
      restoreSection({ menuId }, sectionToRestore);

      addAlert({
        message: `Error al eliminar la sección. Revertido: ${getDisplayErrorMessage(
          error
        )}`,
        type: "error",
      });
    }
  };
  return (
    <ViewCatalogSection
      sectionId={sectionId}
      menuId={menuId}
      businessId={businessId}
      ownerId={ownerId}
      onSectionChange={handleSectionChange}
      onSectionDelete={handleSectionDelete}
    />
  );
}
