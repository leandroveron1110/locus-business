"use client";

import React from "react";
import { IMenuSectionWithProducts } from "../types/catlog";
import ViewCatalogSection from "./views/ViewCatalogSection";
import { useDeleteSection, useUpdateSection } from "../hooks/useMenuHooks";

interface Props {
  menuId: string;
  section: IMenuSectionWithProducts;
  businessId: string;
  ownerId: string;
}

export default function CatalogSection({
  section,
  menuId,
  businessId,
  ownerId,
}: Props) {
  const updateSectionMutation = useUpdateSection();
  const deleteSectionMutation = useDeleteSection();

  const handleSectionChange = (updated: Partial<IMenuSectionWithProducts>) => {
    updateSectionMutation.mutate({
      sectionId: section.id,
      data: {
        businessId,
        menuId,
        ownerId,
        ...updated,
      },
    });
  };

  const handleSectionDelete = () => {
    deleteSectionMutation.mutate(section.id);
  };

  return (
    <ViewCatalogSection
      section={section}
      menuId={menuId}
      businessId={businessId}
      ownerId={ownerId}
      onSectionChange={handleSectionChange}
      onSectionDelete={handleSectionDelete}
    />
  );
}
