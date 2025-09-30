"use client";

import React from "react";
import { IMenuSectionWithProducts } from "../../types/catlog";
import ViewCatalogSection from "./ViewCatalogSection";
import { useDeleteSection, useUpdateSection } from "../../hooks/useMenuHooks";
import { useMenuStore } from "../../stores/menuStore";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

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
  const updateSectionMutation = useUpdateSection();
  const deleteSectionMutation = useDeleteSection();
  const updateSection = useMenuStore((state) => state.updateSection);
  const deleteSection = useMenuStore((state) => state.deleteSection);
  const { addAlert } = useAlert();

  const handleSectionChange = async (
    updated: Partial<IMenuSectionWithProducts>
  ) => {
    try {
      const up = await updateSectionMutation.mutateAsync({
        sectionId,
        data: {
          businessId,
          menuId,
          ownerId,
          ...updated,
        },
      });

      if (up) {
        updateSection({ menuId, sectionId }, up);
      }
    } catch (error) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  };

  const handleSectionDelete = () => {
    try {
      deleteSectionMutation.mutateAsync(sectionId);
      deleteSection({
        menuId,
        sectionId,
      });
    } catch (error) {
      addAlert({
        message: getDisplayErrorMessage(error),
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
