"use client";

import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    address: string;
    description?: string;
    role?: string;
  };
}

export const SearchBusinessCard = ({ business }: BusinessCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/business/${business.id}`);
  };

  return (
    <div
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
      className="flex flex-col sm:flex-row gap-4 p-5 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer max-w-3xl focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {/* Contenido principal */}
      <div className="flex flex-col justify-between flex-grow">
        {/* Título */}
        <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">
          {business.name}
        </h3>

        {/* Descripción */}
        {business.description && (
          <p className="mt-2 text-gray-600 text-sm line-clamp-3">
            {business.description}
          </p>
        )}

        {/* Información adicional */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-gray-700 text-sm">
          {/* Dirección */}
          {business.address && (
            <div
              className="flex items-center gap-1 max-w-[250px] truncate"
              title={business.address}
            >
              <MapPin size={16} />
              <span className="truncate">{business.address}</span>
            </div>
          )}

          {/* Role */}
          {business.role && (
            <div
              className="flex items-center gap-1 max-w-[250px] truncate"
              title={business.role}
            >
              <span className="truncate">{business.role}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
