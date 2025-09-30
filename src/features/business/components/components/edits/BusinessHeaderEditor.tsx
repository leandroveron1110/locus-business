// src/components/business/BusinessHeaderEditor.tsx
"use client";

import { useState } from "react";
import { Image, X, Save, UploadCloud } from "lucide-react";
import { useFileUploader } from "@/features/business/hooks/useImageUploader";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface BusinessHeaderEditorProps {
  businessId: string; // Agregamos el businessId
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

const MAX_SHORT_DESC = 60;

export default function BusinessHeaderEditor({
  businessId, // Lo desestructuramos aquí
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

  // Usamos el hook y le pasamos la URL del endpoint para el logo
  const { uploadFile, isUploading } = useFileUploader(businessId);

  const { addAlert } = useAlert()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "shortDescription" && value.length > MAX_SHORT_DESC) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    try {
      // Llamamos al hook para subir el archivo
      const data = await uploadFile(file);

      if(data){
        setFormData((prev) => ({ ...prev, logoUrl: data.url }));
      }
    } catch (err) {
      addAlert({
        message: getDisplayErrorMessage(err),
        type: 'error'
      })
    }
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
          <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-200 text-sm">
            <UploadCloud className="w-4 h-4" />
            {isUploading ? "Subiendo..." : "Subir imagen"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </label>
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

      {/* Descripción para buscador */}
      <div>
        <label className="block text-sm font-semibold text-gray-800">
          Descripción corta (para buscador)
        </label>
        <input
          type="text"
          name="shortDescription"
          value={formData.shortDescription || ""}
          onChange={handleChange}
          placeholder="Ej: Cafetería artesanal en el centro"
          className="mt-2 block w-full px-3 py-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        <p className="text-gray-400 text-xs mt-1">
          Máximo {MAX_SHORT_DESC} caracteres ({formData.shortDescription?.length || 0}/{MAX_SHORT_DESC})
        </p>
      </div>

      {/* Descripción para perfil */}
      <div>
        <label className="block text-sm font-semibold text-gray-800">
          Descripción completa (perfil)
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
          disabled={isUploading}
        >
          <Save className="w-4 h-4" />
          {isUploading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}