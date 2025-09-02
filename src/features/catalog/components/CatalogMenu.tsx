"use client";

import React, { useMemo, useState } from "react";
import { SectionCreate } from "../types/catlog";
import CatalogSection from "./CatalogSection";
import NewCatalogSection from "./news/NewCatalogSection";
import { useCreateSection, useUpdateMenu } from "../hooks/useMenuHooks";
import EditCatalogMenu from "./edits/EditCatalogMenu";
import { useMenuStore } from "../stores/menuStore";

interface Props {
  businessId: string;
  menuId: string;   // 👈 pasamos solo el id, no todo el menú
  ownerId: string;
}

export default function CatalogMenu({ menuId, ownerId, businessId }: Props) {
  const [showEditMenuModal, setShowEditMenuModal] = useState(false);

  // 📌 Obtenemos el menú desde la store
  const menu = useMenuStore((state) =>
    state.menus.find((m) => m.id === menuId)
  );

  const updateMenuStore = useMenuStore((state) => state.updateMenu);
  const addSection = useMenuStore((state) => state.addSection);

  const createSectionMutation = useCreateSection();
  const updateMenuMutation = useUpdateMenu();

  // Ordenamos secciones desde el store
  const sortedSections = useMemo(() => {
    return menu ? [...(menu.sections ?? [])].sort((a, b) => a.index - b.index) : [];
  }, [menu]);

  // Guardar nuevo nombre de menú
  const handleSaveMenu = async (newName: string) => {
    if (!menu) return;
    try {
      const updatedMenu = await updateMenuMutation.mutateAsync({
        menuId: menu.id,
        data: { name: newName, businessId, ownerId },
      });
      updateMenuStore(menu.id, updatedMenu); // 👈 actualiza la store
      setShowEditMenuModal(false);
    } catch (err) {
      console.error("Error actualizando el menú:", err);
    }
  };

  // Crear nueva sección
  const handleAddSection = async (newSection: SectionCreate) => {
    if (!menu) return;
    try {
      const createdSection = await createSectionMutation.mutateAsync(
        newSection
      );
      addSection({ menuId: menu.id }, createdSection); // 👈 solo store
    } catch (err) {
      console.error("Error creando sección:", err);
    }
  };

  if (!menu) return null;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800">{menu.name}</h2>
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
            sectionId={section.id}
            businessId={businessId}
            ownerId={ownerId}
            menuId={menu.id}
          />
        ))}

        <NewCatalogSection
          businessId={businessId}
          menuId={menu.id}
          ownerId={ownerId}
          onAddSection={handleAddSection}
          currentIndex={menu.sections?.length || 1}
        />
      </div>

      {/* Modal para editar nombre de menú */}
      {showEditMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <EditCatalogMenu
              name={menu.name}
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
