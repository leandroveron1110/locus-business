"use client";

import { Tag } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface TagItem {
  id: string;
  name: string;
}

interface Props {
  categories: Category[];
  tags: TagItem[];
  showAllCategories: boolean;
  showAllTags: boolean;
  onToggleCategories: () => void;
  onToggleTags: () => void;
}

const MAX_ITEMS = 6;

export default function CategoriesTagsView({
  categories,
  tags,
  showAllCategories,
  showAllTags,
  onToggleCategories,
  onToggleTags,
}: Props) {
  return (
    <section className="mt-8 space-y-8">
      {/* Categorías */}
      {categories.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Categorías</h2>
          <ul className="flex flex-wrap gap-3">
            {(showAllCategories ? categories : categories.slice(0, MAX_ITEMS)).map((cat) => (
              <li
                key={cat.id}
                className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full flex items-center gap-2 shadow-sm hover:bg-blue-200 transition"
              >
                <Tag size={16} /> {cat.name}
              </li>
            ))}
          </ul>
          {categories.length > MAX_ITEMS && (
            <button
              onClick={onToggleCategories}
              className="text-blue-600 mt-2 text-sm hover:underline"
            >
              {showAllCategories ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Tags</h2>
          <ul className="flex flex-wrap gap-3">
            {(showAllTags ? tags : tags.slice(0, MAX_ITEMS)).map((tag) => (
              <li
                key={tag.id}
                className="bg-green-100 text-green-800 text-sm font-semibold px-4 py-1 rounded-full shadow-sm hover:bg-green-200 transition"
              >
                {tag.name}
              </li>
            ))}
          </ul>
          {tags.length > MAX_ITEMS && (
            <button
              onClick={onToggleTags}
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
