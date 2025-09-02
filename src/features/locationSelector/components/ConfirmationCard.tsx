// src/components/ConfirmationCard.tsx
"use client";

import { MapPin, X } from "lucide-react";

interface ConfirmationCardProps {
  onClose: () => void;
}

const ConfirmationCard = ({ onClose }: ConfirmationCardProps) => {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm">
      <div className="bg-white rounded-lg shadow-xl p-4 border border-gray-200 text-center relative">
        {/* Botón para cerrar */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          aria-label="Cerrar"
        >
          <X size={16} />
        </button>

        <h3 className="text-md font-semibold text-gray-800 mb-2">
          ¡Ubicación encontrada!
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          Por favor, verifica en el mapa que el marcador esté en el lugar correcto.
        </p>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <MapPin size={16} className="text-blue-500" />
          <span>Arrastra el marcador para ajustar la posición</span>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationCard;