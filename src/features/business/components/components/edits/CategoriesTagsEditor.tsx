"use client";

import { useState, useEffect } from "react";
import { Tag, X, Plus } from "lucide-react";
import { useCategoriesTags } from "@/features/business/hooks/useCategoriesTags";

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
  businessId,
  initialCategories,
  initialTags,
  onSave,
}: Props) {
  const { data, isLoading, isError } = useCategoriesTags();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (data) {
      const availableCategoryIds = data.categories.map(c => c.id);
      const availableTagIds = data.tags.map(t => t.id);

      setSelectedCategories(prev => prev.filter(c => availableCategoryIds.includes(c)));
      setSelectedTags(prev => prev.filter(t => availableTagIds.includes(t)));
    }
  }, [data]);

  if (isLoading) return <p className="text-sm text-gray-500">Cargando categorías y tags...</p>;
  if (isError || !data) return <p className="text-sm text-red-500">Error al cargar datos</p>;

  const handleToggleCategory = (id: string) => {
    setSelectedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleToggleTag = (id: string) => {
    setSelectedTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !selectedCategories.includes(newCategory.trim())) {
      setSelectedCategories(prev => [...prev, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleSave = () => {
    onSave(selectedCategories, selectedTags);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-10 space-y-6 border border-gray-100">
      {/* Categorías */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Categorías</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {data.categories.map((cat: Category) => (
            <button
              key={cat.id}
              onClick={() => handleToggleCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm transition ${
                selectedCategories.includes(cat.id)
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              {cat.name}
              {selectedCategories.includes(cat.id) && <X size={12} />}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Tags</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {data.tags.map((tag: TagItem) => (
            <button
              key={tag.id}
              onClick={() => handleToggleTag(tag.id)}
              className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm transition ${
                selectedTags.includes(tag.id)
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              {tag.name}
              {selectedTags.includes(tag.id) && <X size={12} />}
            </button>
          ))}
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
