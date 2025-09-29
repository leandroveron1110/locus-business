"use client";

import { useCategoriesTags } from "@/features/search/hooks/useCategoriesTags";
import { Tag } from "lucide-react";

interface Props {
  businessId: string;
}

export default function CategoriesTags({ businessId }: Props) {
  const { data, isLoading, isError } = useCategoriesTags(businessId);

  if (isLoading)
    return (
      <p className="text-sm text-gray-500 px-4 sm:px-0 text-center">
        Cargando categorías y tags...
      </p>
    );

  if (isError || !data)
    return (
      <p className="text-sm text-gray-500 px-4 sm:px-0 text-center">
        No se pudieron cargar las categorías y tags.
      </p>
    );

  if (!data.categories) {
    return (
      <p className="text-sm text-gray-500 px-4 sm:px-0 text-center">
        Sin categorías.
      </p>
    );
  }

  if (!data.tags) {
    return (
      <p className="text-sm text-gray-500 px-4 sm:px-0 text-center">
        Sin Tags.
      </p>
    );
  }

  const renderChips = (items: { id: string; name: string }[]) =>
    items.map((item) => (
      <div
        key={item.id}
        className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium shadow-sm hover:bg-gray-200 transition cursor-pointer"
      >
        <Tag size={14} className="text-blue-500" />
        {item.name}
      </div>
    ));

  const noCategories = data.categories.length === 0;
  const noTags = data.tags.length === 0;

  if (noCategories && noTags) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400 space-y-2">
        <Tag size={40} className="text-gray-300" />
        <span className="text-sm font-medium">
          Este negocio aún no tiene categorías ni tags disponibles
        </span>
      </div>
    );
  }

  return (
    <section className="mt-6 px-4 sm:px-0 space-y-6">
      {/* Categorías */}
      {data.categories.length > 0 && (
        <div>
          <h3 className="text-gray-800 font-semibold mb-2">
            Categorías ({data.categories.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {renderChips(data.categories)}
          </div>
        </div>
      )}

      {/* Tags */}
      {data.tags.length > 0 && (
        <div>
          <h3 className="text-gray-800 font-semibold mb-2">
            Tags ({data.tags.length})
          </h3>
          <div className="flex flex-wrap gap-2">{renderChips(data.tags)}</div>
        </div>
      )}
    </section>
  );
}
