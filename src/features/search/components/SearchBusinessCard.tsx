"use client";

import { Star, MapPin, Tag, Users } from "lucide-react";
import { SearchResultBusiness } from "../types/search";
import { useRouter } from "next/navigation";

interface BusinessCardProps {
  business: SearchResultBusiness;
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
      {/* Logo o placeholder */}
      <div className="w-full sm:w-40 h-40 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden shrink-0">
        {business.logoUrl ? (
          <img
            src={business.logoUrl}
            alt={business.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <Tag size={48} />
            <span className="mt-1 text-sm font-medium">Sin Logo</span>
          </div>
        )}
      </div>

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
          {business.address && (
            <div
              className="flex items-center gap-1 max-w-[250px] truncate"
              title={`${business.address}, ${business.city}, ${business.province}`}
            >
              <MapPin size={16} />
              <span className="truncate">
                {business.address}, {business.city}, {business.province}
              </span>
            </div>
          )}

          {/* Seguidores */}
          {typeof business.followersCount === "number" && (
            <div className="flex items-center gap-1">
              <Users size={16} className="text-blue-500" />
              <span>
                {business.followersCount.toLocaleString()}{" "}
                {business.followersCount === 1 ? "seguidor" : "seguidores"}
              </span>
            </div>
          )}

          {/* Calificación promedio */}
          {typeof business.averageRating === "number" && (
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400" />
              <span>{business.averageRating.toFixed(1)} / 5</span>
              {business.reviewCount ? (
                <span className="text-gray-500">({business.reviewCount})</span>
              ) : null}
            </div>
          )}

          {/* Estado abierto/cerrado */}
          {business.isOpenNow !== undefined && (
            <span
              className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
                business.isOpenNow
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {business.isOpenNow ? "Abierto ahora" : "Cerrado"}
            </span>
          )}
        </div>

        {/* Tags */}
        {business.tagNames?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {business.tagNames.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="bg-gray-200 text-gray-800 text-xs font-medium px-3 py-1 rounded-full select-none"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};
