"use client";

import MapClientWrapper from "@/features/locationSelector/components/MapClientWrapper";
import { AddressData } from "@/features/locationSelector/types/address-data";
import { useState } from "react";

interface BusinessContactEditorProps {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  onCancel: () => void;
  onSave: (data: {
    address?: string;
    addressData?: AddressData;
    phone?: string;
    whatsapp?: string;
    email?: string;
    latitude?: number;
    longitude?: number;
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
  }) => void;
}

export default function BusinessContactEditor({
  address,
  phone,
  whatsapp,
  email,
  websiteUrl,
  facebookUrl,
  instagramUrl,
  onCancel,
  onSave,
}: BusinessContactEditorProps) {
  const [formData, setFormData] = useState({
    phone,
    whatsapp,
    email,
    websiteUrl,
    facebookUrl,
    instagramUrl,
  });

  const [editingAddress, setEditingAddress] = useState(false);
  const [addressData, setAddressData] = useState<AddressData | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMapSave = (data: AddressData) => {
    setAddressData(data);
    setEditingAddress(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      ...formData,
      ...(addressData
        ? {
            address: `${addressData.street} ${addressData.number || ""}, ${addressData.city}`,
            latitude: addressData.latitude,
            longitude: addressData.longitude,
          }
        : {}),
    });
  };

  const resolvedAddress = addressData
    ? `${addressData.street} ${addressData.number || ""}, ${addressData.city}`
    : address;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-6 sm:p-10 space-y-4 border border-gray-100 relative z-10"
      >
        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Dirección</label>
          <div className="flex gap-2 items-center mt-1">
            <span
              className="flex-1 truncate text-gray-800"
              title={resolvedAddress}
            >
              {resolvedAddress}
            </span>
            <button
              type="button"
              onClick={() => setEditingAddress(true)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 whitespace-nowrap"
            >
              Editar dirección
            </button>
          </div>
        </div>

        {/* Campos de contacto */}
        {[
          { label: "Teléfono", name: "phone", type: "text" },
          { label: "WhatsApp", name: "whatsapp", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "Website", name: "websiteUrl", type: "text" },
          { label: "Facebook", name: "facebookUrl", type: "text" },
          { label: "Instagram", name: "instagramUrl", type: "text" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name as keyof typeof formData] || ""}
              onChange={handleChange}
              className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              placeholder={`Ingrese ${field.label.toLowerCase()}`}
            />
          </div>
        ))}

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Guardar
          </button>
        </div>
      </form>

      {/* Modal mapa */}
      {editingAddress && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="w-full h-full bg-white rounded-xl shadow-lg relative">
            <button
              className="absolute top-4 right-4 px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 z-50"
              onClick={() => setEditingAddress(false)}
            >
              Cancelar
            </button>
            <MapClientWrapper onSave={handleMapSave} />
          </div>
        </div>
      )}
    </>
  );
}
