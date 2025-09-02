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
  initialCategories: string[]; // nombres de las categorias que el negocio ya tiene
  initialTags: string[]; // nombres de los tags que el negocio ya tiene
  onSave: (categories: string[], tags: string[]) => void;
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
      // Podríamos inicializar si queremos filtrar lo que ya tiene el negocio
      const availableCategories = data.categories.map((c: Category) => c.name);
      const availableTags = data.tags.map((t: TagItem) => t.name);
      setSelectedCategories((prev) => prev.filter((c) => availableCategories.includes(c)));
      setSelectedTags((prev) => prev.filter((t) => availableTags.includes(t)));
    }
  }, [data]);

  if (isLoading) return <p className="text-sm text-gray-500">Cargando categorías y tags...</p>;
  if (isError || !data) return <p className="text-sm text-red-500">Error al cargar datos</p>;

  const handleToggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleToggleTag = (name: string) => {
    setSelectedTags((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !selectedCategories.includes(newCategory.trim())) {
      setSelectedCategories((prev) => [...prev, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !selectedTags.includes(newTag.trim())) {
      setSelectedTags((prev) => [...prev, newTag.trim()]);
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
              onClick={() => handleToggleCategory(cat.name)}
              className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm transition ${
                selectedCategories.includes(cat.name)
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              {cat.name}
              {selectedCategories.includes(cat.name) && <X size={12} />}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Agregar nueva categoría"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
          >
            <Plus size={14} /> Agregar
          </button>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Tags</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {data.tags.map((tag: TagItem) => (
            <button
              key={tag.id}
              onClick={() => handleToggleTag(tag.name)}
              className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm transition ${
                selectedTags.includes(tag.name)
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              {tag.name}
              {selectedTags.includes(tag.name) && <X size={12} />}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Agregar nuevo tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
          >
            <Plus size={14} /> Agregar
          </button>
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
