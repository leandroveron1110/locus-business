"use client";

import { SocialNetworkData } from "@/features/business/types/business-form";
import { useState } from "react";

interface SocialNetworksEditProps {
  data: SocialNetworkData;
  onSave: (data: SocialNetworkData) => void;
  onCancel: () => void;
}

export default function SocialNetworksEdit({
  data,
  onSave,
  onCancel,
}: SocialNetworksEditProps) {
  const [formData, setFormData] = useState<SocialNetworkData>(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      className="space-y-4 p-4 bg-gray-50 rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Editar Redes Sociales
      </h2>

      {["websiteUrl", "facebookUrl", "instagramUrl"].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 capitalize">
            {field.replace("Url", "")}
          </label>
          <input
            type="url"
            name={field}
            value={formData[field as keyof SocialNetworkData] || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder={`https://${field}.com`}
          />
        </div>
      ))}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
