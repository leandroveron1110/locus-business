"use client";

import { useState } from "react";
import { SectionCreate } from "../../types/catlog";

interface NewCatalogSectionProps {
  businessId: string;
  menuId: string;
  ownerId: string;
  currentIndex: number;
  onAddSection: (section: SectionCreate) => void;
}

export default function NewCatalogSection({
  businessId,
  menuId,
  ownerId,
  currentIndex,
  onAddSection,
}: NewCatalogSectionProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");

  const handleCreate = () => {
    if (!name.trim()) return;
    const newSection: SectionCreate = {
      businessId,
      menuId,
      ownerId,
      imageUrls: [],
      name: name.trim(),
      index: currentIndex,
    };
    onAddSection(newSection);
    setName("");
    setIsCreating(false);
  };

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 shadow-sm bg-white hover:shadow-md transition-all duration-200">
      {!isCreating ? (
        <button
          className="text-blue-600 hover:text-blue-700 font-medium text-lg flex items-center justify-center gap-2"
          onClick={() => setIsCreating(true)}
        >
          <span className="text-xl">+</span> Crear nueva sección
        </button>
      ) : (
        <div className="flex flex-col gap-3 animate-fade-in">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la sección"
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            autoFocus
          />
          <div className="flex justify-center gap-3">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-all"
              onClick={handleCreate}
            >
              Guardar
            </button>
            <button
              className="bg-gray-100 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-all"
              onClick={() => setIsCreating(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
