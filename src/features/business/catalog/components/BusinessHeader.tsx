// components/BusinessHeader.tsx

import React from "react";
import Image from "next/image";
import { Business } from "../types/business";

interface Props {
  business: Business;
}

export default function BusinessHeader({ business }: Props) {
  const logoUrl = business.logoUrl || "/placeholder-logo.png";

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-100">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Sección del Logo */}
        <div className="relative w-28 h-28 flex-shrink-0 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
          <img
            src={logoUrl}
            alt={`${business.name} logo`}
            // fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 640px) 100vw, 150px"
          />
        </div>

        {/* Sección de la Información del Negocio */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            {business.name}
          </h1>
          {business.shortDescription && (
            <p className="mt-1 text-gray-600 max-w-lg mx-auto sm:mx-0">
              {business.shortDescription}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}