"use client";
import React, { useState } from "react";
import { MenuCreate } from "../../types/catlog";
import { Plus, X } from "lucide-react";

interface Props {
  businessId: string;
  ownerId: string;
  onAddMenu: (menu: MenuCreate) => void;
}

export default function NewCatalogMenu({ businessId, ownerId, onAddMenu }: Props) {
  const [name, setName] = useState("");
  const [isAdding, setIsAdding] = useState(false); // Nuevo estado para controlar si se está agregando un menú

  const handleSubmit = () => {
    if (!name.toUpperCase().trim()) return;

    const newMenu: MenuCreate = { name, businessId, ownerId };

    onAddMenu(newMenu);
    setName("");
    setIsAdding(false); // Cerrar el formulario después de la creación
  };

  if (isAdding) {
    return (
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Nuevo Menú</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Nombre del menú (ej. Desayunos, Almuerzos)"
            value={name}
            onChange={(e) => setName(e.target.value.toLocaleUpperCase())}
            className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            disabled={!name.trim()}
            aria-label="Crear Menú"
          >
            Crear
          </button>
          <button
            onClick={() => setIsAdding(false)}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Cancelar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="w-full flex justify-center items-center p-8 sm:p-12 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-100 transition-colors group"
      aria-label="Agregar un nuevo menú"
    >
      <div className="flex flex-col items-center justify-center text-gray-500 group-hover:text-green-600 transition-colors">
        <Plus className="w-10 h-10 mb-2 transition-transform group-hover:rotate-90" />
        <span className="text-lg font-semibold">Agregar Menú</span>
      </div>
    </button>
  );
}