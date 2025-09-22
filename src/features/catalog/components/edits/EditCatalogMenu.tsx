"use client";
import React, { useState } from "react";
import { Check, X, Trash, AlertCircle } from "lucide-react";

interface Props {
  name: string;
  onSave: (newName: string) => void;
  onDelete: () => void;
  onCancel?: () => void;
  ownerId: string;
}

export default function EditCatalogMenu({
  name,
  onSave,
  onDelete,
  onCancel,
  ownerId,
}: Props) {
  const [tempName, setTempName] = useState(name);
  const [error, setError] = useState<string | null>(null);

  if (!ownerId) return null; // solo el dueño puede editar

  const handleSave = () => {
    if (!tempName.trim()) {
      setError("El nombre no puede estar vacío");
      return;
    }
    onSave(tempName.trim());
    setError(null);
  };

  const handleCancel = () => {
    setTempName(name);
    setError(null);
    onCancel?.();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 space-y-4 w-full max-w-md">
      {/* Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Nombre del menú
        </label>
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          placeholder="Nombre del menú"
          className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Botones */}
      <div className="flex flex-wrap justify-end gap-3 pt-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-blue-700 transition-all"
        >
          <Check size={18} /> Guardar
        </button>

        <button
          onClick={handleCancel}
          className="flex items-center gap-2 bg-gray-100 text-gray-800 px-5 py-2 rounded-xl font-medium hover:bg-gray-200 transition-all"
        >
          <X size={18} /> Cancelar
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-2 text-red-600 bg-red-50 px-5 py-2 rounded-xl font-medium hover:bg-red-100 transition-all"
        >
          <Trash size={18} /> Eliminar
        </button>
      </div>
    </div>
  );
}
