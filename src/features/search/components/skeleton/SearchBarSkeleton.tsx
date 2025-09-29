// features/search/components/SearchBarSkeleton.tsx
import React from "react";

const SearchBarSkeleton: React.FC = () => {
  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {/* Icono de búsqueda con un color más suave */}
          <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        {/* Simulación del input con efecto de carga */}
        <div className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full bg-gray-100 animate-pulse"></div>
      </div>
    </div>
  );
};

export default SearchBarSkeleton;
