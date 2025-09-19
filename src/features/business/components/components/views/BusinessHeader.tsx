"use client";

import Image from "next/image";
import { Pencil, Globe } from "lucide-react";

interface BusinessHeaderProps {
  logoUrl?: string;
  name: string;
  fullDescription?: string;
  onEdit?: () => void;
}

export default function BusinessHeader({
  logoUrl,
  name,
  fullDescription,
  onEdit,
}: BusinessHeaderProps) {
  const commonClasses = "object-cover shadow-md";

  return (
    <header className="w-full flex flex-col sm:flex-row sm:items-start relative">
      {/* Vista móvil */}
      <div className="w-full h-64 relative flex-shrink-0 sm:hidden">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            fill
            className={`${commonClasses} rounded-b-3xl`}
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-b-3xl">
            <Globe className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Overlay con fullDescription */}
        {fullDescription && (
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-4">
            <h1 className="text-2xl font-extrabold text-white drop-shadow-lg">{name}</h1>
            <p className="text-white text-sm mt-1 line-clamp-3 drop-shadow-sm">{fullDescription}</p>
          </div>
        )}

        {/* Botón Editar en móvil */}
        {onEdit && (
          <button
            onClick={onEdit}
            className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Pencil className="w-3 h-3" />
            Editar
          </button>
        )}
      </div>

      {/* Vista escritorio */}
      <div className="hidden sm:block sm:w-40 sm:h-40 relative flex-shrink-0">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={`${name} logo`}
            fill
            className={`${commonClasses} rounded-3xl`}
            sizes="160px"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-3xl">
            <Globe className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      {/* Texto y fullDescription en escritorio */}
      <div className="flex-1 mt-4 px-4 hidden sm:flex flex-col justify-center relative">
        <h1 className="text-3xl font-extrabold text-gray-900 break-words">{name}</h1>
        {fullDescription && (
          <p className="mt-1 text-gray-500 text-sm sm:text-base max-w-xl line-clamp-3">{fullDescription}</p>
        )}

        {/* Botón Editar escritorio */}
        {onEdit && (
          <button
            onClick={onEdit}
            className="absolute top-0 right-0 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </button>
        )}
      </div>
    </header>
  );
}
