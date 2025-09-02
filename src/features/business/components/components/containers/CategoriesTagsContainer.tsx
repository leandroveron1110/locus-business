"use client";

import { useState, useEffect } from "react";
import { useCategoriesTagsByBusinessId } from "@/features/business/hooks/useCategoriesTags";
import CategoriesTags from "../views/CategoriesTags";
import CategoriesTagsEditor from "../edits/CategoriesTagsEditor";

interface Props {
  businessId: string;
}

export default function CategoriesTagsContainer({ businessId }: Props) {
  const { data, isLoading, isError } = useCategoriesTagsByBusinessId(businessId);

  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  // Inicializar con datos del backend
  useEffect(() => {
    if (data) {
      setCategories(data.categories.map((c) => c.name));
      setTags(data.tags.map((t) => t.name));
    }
  }, [data]);

  if (isLoading) return <p className="text-sm text-gray-500">Cargando categorías y tags...</p>;
  if (isError || !data) return null;

  // 🔑 Calcula los cambios respecto a los datos originales
  const getChanges = () => {
    const originalCategories = data.categories.map((c) => c.name);
    const originalTags = data.tags.map((t) => t.name);

    const addedCategories = categories.filter((c) => !originalCategories.includes(c));
    const removedCategories = originalCategories.filter((c) => !categories.includes(c));

    const addedTags = tags.filter((t) => !originalTags.includes(t));
    const removedTags = originalTags.filter((t) => !tags.includes(t));

    return { addedCategories, removedCategories, addedTags, removedTags };
  };

  const handleSave = () => {
    const changes = getChanges();

    if (
      changes.addedCategories.length === 0 &&
      changes.removedCategories.length === 0 &&
      changes.addedTags.length === 0 &&
      changes.removedTags.length === 0
    ) {
      console.log("⚠️ No hay cambios para guardar");
      setIsEditing(false);
      return;
    }

    // 🚀 Request al backend solo con los cambios
    console.log("Guardando cambios:", changes);

    // Después de guardar, salimos del modo edición
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <CategoriesTagsEditor
          businessId={businessId}
          initialCategories={categories}
          initialTags={tags}
          onSave={(newCategories, newTags) => {
            // Mientras se envían al backend, actualizamos la vista
            setCategories(newCategories);
            setTags(newTags);
            handleSave();
          }}
        />
      ) : (
        <div>
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200"
            >
              Editar
            </button>
          </div>
          <CategoriesTags
            categories={categories.map((name) => ({ id: name, name }))}
            tags={tags.map((name) => ({ id: name, name }))}
            showAllCategories={true}
            showAllTags={true}
            onToggleCategories={() => {}}
            onToggleTags={() => {}}
          />
        </div>
      )}
    </div>
  );
}
