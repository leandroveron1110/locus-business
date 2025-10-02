"use client";

import { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useCategoriesTags } from "@/features/business/hooks/useCategoriesTags";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface Category {
  id: string;
  name: string;
}

interface TagItem {
  id: string;
  name: string;
}

interface Props {
  businessId: string;
  initialCategories: string[]; // IDs de las categorías
  initialTags: string[]; // IDs de los tags
  onSave: (categoryIds: string[], tagIds: string[]) => void;
}

export default function CategoriesTagsEditor({
  initialCategories,
  initialTags,
  onSave,
}: Props) {
  const { data, isLoading, isError, error } = useCategoriesTags();

  const { addAlert } = useAlert();

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  const [categorySearch, setCategorySearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  useEffect(() => {
    if (isError) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  }, [isError, error, addAlert]);

  useEffect(() => {
    if (data) {
      const availableCategoryIds: string[] = [];
      if (data.categories) {
        availableCategoryIds.push(...data.categories.map((c) => c.id));
      }
      const availableTagIds: string[] = [];

      if (data.tags) {
        availableTagIds.push(...data.tags.map((t) => t.id));
      }

      setSelectedCategories((prev) =>
        prev.filter((c) => availableCategoryIds.includes(c))
      );
      setSelectedTags((prev) =>
        prev.filter((t) => availableTagIds.includes(t))
      );
    }
  }, [data]);

  if (isLoading)
    return (
      <p className="text-sm text-gray-500">Cargando categorías y tags...</p>
    );
  if (isError || !data)
    return <p className="text-sm text-red-500">Error al cargar datos</p>;

  const handleToggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleToggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(selectedCategories, selectedTags);
  };

  const filteredCategories = data.categories?.filter((cat: Category) =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );
  const filteredTags = data.tags?.filter((tag: TagItem) =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-10 space-y-6 border border-gray-100">
      {/* Categorías */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Categorías</h2>

        {/* Buscador categorías */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar categoría..."
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-2 max-h-48 overflow-y-auto">
          {filteredCategories && filteredCategories.length > 0 ? (
            filteredCategories.map((cat: Category) => (
              <button
                key={cat.id}
                onClick={() => handleToggleCategory(cat.id)}
                className={`px-3 py-1 capitalize rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm transition ${
                  selectedCategories.includes(cat.id)
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
              >
                {cat.name}
                {selectedCategories.includes(cat.id) && <X size={12} />}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-400">
              No se encontraron categorías
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Tags</h2>

        {/* Buscador tags */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar tag..."
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-2 max-h-48 overflow-y-auto">
          {filteredTags && filteredTags.length > 0 ? (
            filteredTags.map((tag: TagItem) => (
              <button
                key={tag.id}
                onClick={() => handleToggleTag(tag.id)}
                className={`px-3 py-1 capitalize rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm transition ${
                  selectedTags.includes(tag.id)
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                {tag.name}
                {selectedTags.includes(tag.id) && <X size={12} />}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-400">No se encontraron tags</p>
          )}
        </div>
      </div>

      {/* Guardar cambios */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
