"use client";
import React, { useState } from "react";
import { MenuCreate } from "../../types/catlog";

interface Props {
  businessId: string;
  ownerId: string;
  onAddMenu: (menu: MenuCreate) => void; // callback para actualizar lista en el padre
}

export default function NewCatalogMenu({ businessId, ownerId, onAddMenu }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;

    const newMenu: MenuCreate = { name, businessId, ownerId };

    onAddMenu(newMenu); // enviamos al componente padre
    setName(""); // limpiar input
  };

  return (
    <div className="mt-4 flex items-center gap-2">
      <input
        type="text"
        placeholder="Nombre del menú"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded p-2 flex-1"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!name.trim()}
      >
        Crear Menú
      </button>
    </div>
  );
}
