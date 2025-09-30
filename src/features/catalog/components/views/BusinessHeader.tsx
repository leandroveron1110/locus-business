// components/BusinessHeader.tsx

import React from "react";
import Image from "next/image";
import { Business } from "../../types/business";
import { Star } from "lucide-react";

interface Props {
  business: Business;
}

// Función para truncar la descripción
const truncateDescription = (description: string, maxLength: number) => {
  if (description.length > maxLength) {
    return description.substring(0, maxLength) + "...";
  }
  return description;
};

export default function BusinessHeader({ business }: Props) {
  const logoUrl = business.logoUrl || "/placeholder-logo.png";
  const truncatedDescription = business.fullDescription
    ? truncateDescription(business.fullDescription, 100)
    : null;

  return (
    <div className="bg-white md:p-6 mb-6">
      <div className="flex flex-row items-center gap-6">
        {/* Logo */}
        <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 rounded-full overflow-hidden border-1 border-gray-200 bg-gray-50">
          <Image
            src={logoUrl}
            alt={`${business.name} logo`}
            fill
            className="object-cover"
            sizes="112px"
            priority
          />
        </div>

        <div className="flex-1 text-left">
          <h1 className="text-xl md:text-2xl font-bold uppercase text-gray-900 leading-tight">
            {business.name}
          </h1>

          {truncatedDescription && (
            <p className="mt-1 text-sm md:text-base text-gray-600 max-w-xl">
              {truncatedDescription}
            </p>
          )}

          {/* Rating */}
          <div className="flex gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.round(Number(business.ratingsCount) || 0)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
