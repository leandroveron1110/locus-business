"use client";

import { Pencil } from "lucide-react";

interface BusinessHeaderProps {
  logoUrl?: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  onEdit?: () => void;
}

export default function BusinessHeader({
  logoUrl,
  name,
  shortDescription,
  fullDescription,
  onEdit,
}: BusinessHeaderProps) {
  return (
    <div className="w-full">
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 bg-white rounded-2xl shadow-md p-6 sm:p-10 relative border border-gray-100">
        {/* Logo */}
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${name} logo`}
            className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-xl border border-gray-200 shadow"
          />
        ) : (
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-lg shadow-inner">
            Sin logo
          </div>
        )}

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            {name}
          </h1>
          {shortDescription && (
            <p className="mt-2 text-gray-600 text-base sm:text-lg max-w-2xl">
              {shortDescription}
            </p>
          )}
        </div>

        {/* Botón Editar */}
        {onEdit && (
          <button
            onClick={onEdit}
            className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </button>
        )}
      </header>

      {/* Descripción larga */}
      {fullDescription && (
        <section className="mt-6 sm:mt-8 px-4 sm:px-0">
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-4xl mx-auto text-center sm:text-left">
            {fullDescription}
          </p>
        </section>
      )}
    </div>
  );
}
