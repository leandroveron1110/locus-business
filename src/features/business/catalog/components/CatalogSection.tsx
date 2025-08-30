"use client";

import React from "react";
import { IMenuSectionWithProducts } from "../types/catlog";
import ViewCatalogSection from "./views/ViewCatalogSection";
import { useDeleteSection, useUpdateSection } from "../hooks/useMenuHooks";
import { useMenuStore } from "../stores/menuStore";

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

  const handleSectionChange = async (
    updated: Partial<IMenuSectionWithProducts>
  ) => {
    const up = await updateSectionMutation.mutateAsync({
      sectionId,
      data: {
        businessId,
        menuId,
        ownerId,
        ...updated,
      },
    });

    updateSection({ menuId, sectionId }, up);
  };

  const handleSectionDelete = () => {
    deleteSectionMutation.mutateAsync(sectionId);
    deleteSection({
      menuId,
      sectionId,
    });
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
