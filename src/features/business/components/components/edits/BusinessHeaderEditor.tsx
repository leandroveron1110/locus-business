"use client";

import { useState } from "react";
import { Image, X, Save } from "lucide-react";

interface BusinessHeaderEditorProps {
  logoUrl?: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  onCancel: () => void;
  onSave: (data: {
    logoUrl?: string;
    name: string;
    shortDescription?: string;
    fullDescription?: string;
  }) => void;
}

export default function BusinessHeaderEditor({
  logoUrl,
  name,
  shortDescription,
  fullDescription,
  onCancel,
  onSave,
}: BusinessHeaderEditorProps) {
  const [formData, setFormData] = useState({
    logoUrl,
    name,
    shortDescription,
    fullDescription,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-6 sm:p-10 space-y-6 border border-gray-100"
    >
      {/* Logo */}
      <div>
        <label className="block text-sm font-semibold text-gray-800">
          Logo del negocio
        </label>
        <div className="mt-2 flex items-center gap-4">
          {formData.logoUrl ? (
            <img
              src={formData.logoUrl}
              alt="Logo preview"
              className="w-20 h-20 rounded-lg object-cover border border-gray-200 shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 flex items-center justify-center rounded-lg bg-gray-100 text-gray-400 border border-dashed border-gray-300">
              <Image className="w-6 h-6" />
            </div>
          )}
          <input
            type="text"
            name="logoUrl"
            value={formData.logoUrl || ""}
            onChange={handleChange}
            placeholder="https://ejemplo.com/logo.png"
            className="flex-1 px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-semibold text-gray-800">
          Nombre del negocio <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-2 block w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Descripción corta */}
      <div>
        <label className="block text-sm font-semibold text-gray-800">
          Descripción corta
        </label>
        <input
          type="text"
          name="shortDescription"
          value={formData.shortDescription || ""}
          onChange={handleChange}
          placeholder="Ej: Cafetería artesanal en el centro"
          className="mt-2 block w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Descripción completa */}
      <div>
        <label className="block text-sm font-semibold text-gray-800">
          Descripción completa
        </label>
        <textarea
          name="fullDescription"
          value={formData.fullDescription || ""}
          onChange={handleChange}
          rows={4}
          placeholder="Escribe una descripción más detallada del negocio..."
          className="mt-2 block w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Save className="w-4 h-4" />
          Guardar
        </button>
      </div>
    </form>
  );
}
