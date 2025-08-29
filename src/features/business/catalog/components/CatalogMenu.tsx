"use client";

import React, { useState, useMemo } from "react";
import { IMenu, SectionCreate } from "../types/catlog";
import CatalogSection from "./CatalogSection";
import NewCatalogSection from "./news/NewCatalogSection";
import { useCreateSection, useUpdateMenu } from "../hooks/useMenuHooks";
import EditCatalogMenu from "./edits/EditCatalogMenu";

interface Props {
  businessId: string;
  menu: IMenu;
  ownerId: string;
}

export default function CatalogMenu({ menu, ownerId, businessId }: Props) {
  const [sections, setSections] = useState(menu.sections);
  const [menuName, setMenuName] = useState(menu.name);
  const [showEditMenuModal, setShowEditMenuModal] = useState(false);

  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.index - b.index),
    [sections]
  );

  const createSectionMutation = useCreateSection();
  const updateMenuMutation = useUpdateMenu();

  // Guardar nuevo nombre de menú
  const handleSaveMenu = async (newName: string) => {
    try {
      const updatedMenu = await updateMenuMutation.mutateAsync({
        menuId: menu.id,
        data: { name: newName, businessId, ownerId },
      });
      setMenuName(updatedMenu.name);
      setShowEditMenuModal(false);
    } catch (err) {
      console.error("Error actualizando el menú:", err);
    }
  };

  // Crear nueva sección
  const handleAddSection = async (newSection: SectionCreate) => {
    try {
      const createdSection = await createSectionMutation.mutateAsync(newSection);
      setSections((prev) => [...prev, createdSection]);
    } catch (err) {
      console.error("Error creando sección:", err);
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800">{menuName}</h2>
        <button
          onClick={() => setShowEditMenuModal(true)}
          className="text-blue-500 text-sm"
        >
          Editar Menú
        </button>
      </header>

      <div className="space-y-12">
        {sortedSections.map((section) => (
          <CatalogSection
            key={section.id}
            section={section}
            businessId={menu.businessId}
            ownerId={ownerId}
            menuId={menu.id}
          />
        ))}

        <NewCatalogSection
          businessId={menu.businessId}
          menuId={menu.id}
          ownerId={ownerId}
          onAddSection={handleAddSection}
          currentIndex={sections.length}
        />
      </div>

      {/* Modal para editar nombre de menú */}
      {showEditMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <EditCatalogMenu
              name={menuName}
              ownerId={ownerId}
              onSave={handleSaveMenu}
              onCancel={() => setShowEditMenuModal(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
}
