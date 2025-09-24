// Código mejorado para CatalogMenu.jsx

"use client";

import React, { useMemo, useState } from "react";
import { SectionCreate } from "../../types/catlog";
import CatalogSection from "./CatalogSection";
import NewCatalogSection from "../news/NewCatalogSection";
import { useCreateSection, useUpdateMenu } from "../../hooks/useMenuHooks";
import EditCatalogMenu from "../edits/EditCatalogMenu";
import { useMenuStore } from "../../stores/menuStore";
import { Pencil } from 'lucide-react'; // Importa el ícono de lápiz

interface Props {
  businessId: string;
  menuId: string;
  ownerId: string;
}

export default function CatalogMenu({ menuId, ownerId, businessId }: Props) {
  const [showEditMenuModal, setShowEditMenuModal] = useState(false);

  const menu = useMenuStore((state) =>
    state.menus.find((m) => m.id === menuId)
  );

  const updateMenuStore = useMenuStore((state) => state.updateMenu);
  const addSection = useMenuStore((state) => state.addSection);

  const createSectionMutation = useCreateSection();
  const updateMenuMutation = useUpdateMenu();

  const sortedSections = useMemo(() => {
    return menu ? [...(menu.sections ?? [])].sort((a, b) => a.index - b.index) : [];
  }, [menu]);

  const handleSaveMenu = async (newName: string) => {
    if (!menu) return;
    try {
      const updatedMenu = await updateMenuMutation.mutateAsync({
        menuId: menu.id,
        data: { name: newName, businessId, ownerId },
      });
      updateMenuStore(menu.id, updatedMenu);
      setShowEditMenuModal(false);
    } catch (err) {
      console.error("Error actualizando el menú:", err);
    }
  };

  const handleAddSection = async (newSection: SectionCreate) => {
    if (!menu) return;
    try {
      const createdSection = await createSectionMutation.mutateAsync(newSection);
      addSection({ menuId: menu.id }, createdSection);
    } catch (err) {
      console.error("Error creando sección:", err);
    }
  };

  if (!menu) return null;

  return (
    <div className="bg-gray-50 ">
      <div className="bg-white">
        
        {/* Header con botón e ícono */}
        <header className="p-8 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">{menu.name}</h2>
            <button
              onClick={() => setShowEditMenuModal(true)}
              className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              aria-label="Editar Menú"
            >
              <Pencil className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Contenedor de Secciones */}
        <div className="p-8 space-y-8">
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
      </div>

      {showEditMenuModal && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 relative">
            <EditCatalogMenu
              name={menu.name}
              ownerId={ownerId}
              onSave={handleSaveMenu}
              onCancel={() => setShowEditMenuModal(false)}
              onDelete={() => console.log("Eliminar menú")}
            />
          </div>
        </div>
      )}
    </div>
  );
}