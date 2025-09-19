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
            <span className="flex-1">
              {addressData
                ? `${addressData.street} ${addressData.number || ""}, ${addressData.city}`
                : address}
            </span>
            <button
              type="button"
              onClick={() => setEditingAddress(true)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Editar dirección
            </button>
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
          />
        </div>

        <div>
        <label className="block text-sm font-medium text-gray-700">Website</label>
        <input
          type="text"
          name="websiteUrl"
          value={formData.websiteUrl || ""}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Facebook</label>
        <input
          type="text"
          name="facebookUrl"
          value={formData.facebookUrl || ""}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Instagram</label>
        <input
          type="text"
          name="instagramUrl"
          value={formData.instagramUrl || ""}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
