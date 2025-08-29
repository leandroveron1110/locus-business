"use client";
import React, { useState } from "react";

interface Props {
  name: string;
  onSave: (newName: string) => void;
  onCancel?: () => void;
  ownerId: string;
}

export default function EditCatalogMenu({ name, onSave, onCancel, ownerId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const handleSave = () => {
    onSave(newName);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setNewName(name);
    if (onCancel) onCancel();
  };

  if (!ownerId) return null; // solo el dueño puede editar

  return (
    <div className="flex items-center gap-2">
        <>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
          />
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Guardar
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
          >
            Cancelar
          </button>
        </>
    </div>
  );
}
