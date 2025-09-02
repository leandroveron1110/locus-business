// src/components/AddressInput.tsx
"use client";

import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

interface AddressInputProps {
  onSearch: (fullAddress: string, streetAndNumber: string) => void;
  isLoading: boolean;
  lastSearchAddress?: string; // Nueva prop para la vista previa
}

const AddressInput = ({ onSearch, isLoading, lastSearchAddress }: AddressInputProps) => {
  const [streetAndNumber, setStreetAndNumber] = useState("");

  const DEFAULT_CITY = "Concepción del Uruguay";
  const DEFAULT_PROVINCE = "Entre Ríos";
  const DEFAULT_COUNTRY = "Argentina";

  const handleSearchClick = () => {
    if (streetAndNumber.trim()) {
      const fullAddress = `${streetAndNumber}, ${DEFAULT_CITY}, ${DEFAULT_COUNTRY}`;
      onSearch(fullAddress, streetAndNumber);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="flex justify-center items-center w-full mt-8">
      <div className="w-full max-w-md bg-white/90 shadow-lg rounded-2xl p-6 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Ingresa tu dirección
        </h2>

        <div className="flex gap-2">
          <input
            type="text"
            value={streetAndNumber}
            onChange={(e) => setStreetAndNumber(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ej: Juan Perón 660"
            className="flex-1 px-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
          />
          <button
            onClick={handleSearchClick}
            disabled={isLoading}
            className="flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Buscar"
            )}
          </button>
        </div>

        {/* Vista previa de la última dirección */}
        {lastSearchAddress && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            <p className="font-medium">Última búsqueda:</p>
            <p>{lastSearchAddress}</p>
          </div>
        )}

        <div className="flex items-center mt-4 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-blue-500" />
          <span>
            Ciudad por defecto: {DEFAULT_CITY}, {DEFAULT_PROVINCE},{" "}
            {DEFAULT_COUNTRY}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AddressInput;