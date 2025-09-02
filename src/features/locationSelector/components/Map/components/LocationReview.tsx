// src/components/LocationReview.tsx
"use client";

import { useState } from "react";
import { MapPin, Pencil } from "lucide-react";
import { AddressData } from "@/features/locationSelector/types/address-data";


interface LocationReviewProps {
  address: AddressData;
  onConfirm: (apartment: string, notes: string) => void;
  onBack: () => void;
  isConfirming: boolean;
}

const LocationReview = ({
  address,
  onConfirm,
  onBack,
  isConfirming,
}: LocationReviewProps) => {
  const [apartment, setApartment] = useState("");
  const [notes, setNotes] = useState("");

  const handleConfirmClick = () => {
    onConfirm(apartment, notes);
  };

  return (
    <div className="flex justify-center items-center w-full mt-10">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 bg-blue-600 text-white px-6 py-4">
          <MapPin className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Verifica y completa tu dirección</h2>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Dirección */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
            <p className="text-gray-800 font-medium text-base">
              {address.street} {address.number}
            </p>
            <p className="text-gray-600 text-sm">
              {address.city}, {address.province}, {address.country}
            </p>
            {address.postalCode && (
              <p className="text-gray-500 text-sm">C.P.: {address.postalCode}</p>
            )}
          </div>

          {/* Departamento */}
          <div className="mb-5">
            <label
              htmlFor="apartment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Departamento (opcional)
            </label>
            <input
              id="apartment"
              type="text"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
              placeholder="Ej: Piso 5, Depto. B"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Notas */}
          <div className="mb-8">
            <label
              htmlFor="notes"
              className="flex items-center text-sm font-medium text-gray-700 mb-2"
            >
              <Pencil size={14} className="mr-1 text-gray-500" />
              Notas adicionales (opcional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej: Casa amarilla, portón negro, timbre en la entrada"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onBack}
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 bg-white text-gray-700 font-medium shadow hover:bg-gray-50 transition"
            >
              Volver
            </button>
            <button
              onClick={handleConfirmClick}
              disabled={isConfirming}
              className="flex-1 px-4 py-3 rounded-full bg-green-600 text-white font-medium shadow hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              {isConfirming ? "Confirmando..." : "Confirmar Dirección"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationReview;
