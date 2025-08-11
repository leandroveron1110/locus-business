"use client";

import { Tag } from "lucide-react";
import { useCategoriesTags } from "../../hooks/useCategoriesTags";
import { useState } from "react";

interface Props {
  businessId: string;
}

const MAX_ITEMS = 6;

export default function CategoriesTags({ businessId }: Props) {
  const { data, isLoading, isError } = useCategoriesTags(businessId);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  if (isLoading) return <p className="text-sm text-gray-500">Cargando categorías y tags...</p>;
  if (isError || !data) return null;

  return (
    <section className="mt-8 space-y-6">
      {/* Categorías */}
      {data.categories.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Categorías</h2>
          <ul className="flex flex-wrap gap-3">
            {(showAllCategories ? data.categories : data.categories.slice(0, MAX_ITEMS)).map((cat) => (
              <li
                key={cat.id}
                className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full flex items-center gap-2 shadow-sm hover:bg-blue-200 transition"
              >
                <Tag size={16} /> {cat.name}
              </li>
            ))}
          </ul>
          {data.categories.length > MAX_ITEMS && (
            <button
              onClick={() => setShowAllCategories((prev) => !prev)}
              className="text-blue-600 mt-2 text-sm hover:underline"
            >
              {showAllCategories ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      )}

      {/* Tags */}
      {data.tags.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Tags</h2>
          <ul className="flex flex-wrap gap-3">
            {(showAllTags ? data.tags : data.tags.slice(0, MAX_ITEMS)).map((tag) => (
              <li
                key={tag.id}
                className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm hover:bg-green-200 transition"
              >
                {tag.name}
              </li>
            ))}
          </ul>
          {data.tags.length > MAX_ITEMS && (
            <button
              onClick={() => setShowAllTags((prev) => !prev)}
              className="text-green-600 mt-2 text-sm hover:underline"
            >
              {showAllTags ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
