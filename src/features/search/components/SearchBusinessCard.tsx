"use client";

import { Star, MapPin, Tag, Users } from "lucide-react";
import { SearchResultBusiness } from "../types/search";
import { useRouter } from "next/navigation";

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    address: string;
    description: string;
    role: string;
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
      className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer max-w-3xl"
    >
      {/* Contenido */}
      <div className="flex flex-col justify-between flex-grow">
        {/* Título y descripción */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 line-clamp-2">
            {business.name}
          </h3>
          {business.description && (
            <p className="mt-1 text-gray-600 text-sm line-clamp-3">
              {business.description}
            </p>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-gray-700 text-sm">
          {/* Dirección con tooltip */}
          <div
            className="flex items-center gap-1 max-w-[250px] truncate"
            title={`${business.address}`}
          >
            <MapPin size={16} />
            <span className="truncate">{business.address}</span>
          </div>

          {/* role */}
          <div
            className="flex items-center gap-1 max-w-[250px] truncate"
            title={`${business.role}`}
          >
            <span className="truncate">{business.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
