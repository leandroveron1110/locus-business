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
    <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg text-center">
      {!isCreating ? (
        <button
          className="text-blue-600 hover:text-blue-800 font-semibold"
          onClick={() => setIsCreating(true)}
        >
          + Crear nueva sección
        </button>
      ) : (
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la sección"
            className="border border-gray-300 rounded px-2 py-1"
          />
          <div className="flex justify-center gap-2">
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={handleCreate}
            >
              Guardar
            </button>
            <button
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
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
