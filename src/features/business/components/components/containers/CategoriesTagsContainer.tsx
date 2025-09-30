"use client";

import { useState } from "react";
import {
  useCategoriesTagsByBusinessId,
  useUpdateCategories,
  useUpdateTags,
} from "@/features/business/hooks/useCategoriesTags";
import CategoriesTags from "../views/CategoriesTags";
import CategoriesTagsEditor from "../edits/CategoriesTagsEditor";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface Props {
  businessId: string;
}

export default function CategoriesTagsContainer({ businessId }: Props) {
  const {
    data,
    isLoading: isQueryLoading,
    isError: isQueryError,
  } = useCategoriesTagsByBusinessId(businessId);

  const { mutateAsync: updateCategories, isPending: isUpdatingCategories } =
    useUpdateCategories();
  const { mutateAsync: updateTags, isPending: isUpdatingTags } =
    useUpdateTags();
  const { addAlert } = useAlert();

  const [isEditing, setIsEditing] = useState(false);

  const isLoading = isQueryLoading || isUpdatingCategories || isUpdatingTags;
  const isError = isQueryError;

  if (isLoading) return <p className="text-sm text-gray-500">Cargando...</p>;
  if (isError || !data) return null;

  // 🔒 Normalizamos para no tener problemas con null
  const categories = data.categories ?? [];
  const tags = data.tags ?? [];

  const handleSave = async (categoryIds: string[], tagIds: string[]) => {
    try {
      const promises = [];
      if (categoryIds.length)
        promises.push(updateCategories({ businessId, categoryIds }));
      if (tagIds.length) promises.push(updateTags({ businessId, tagIds }));
      await Promise.all(promises);
      setIsEditing(false);
    } catch (error) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  };

  return (
    <div>
      {isEditing ? (
        <CategoriesTagsEditor
          businessId={businessId}
          initialCategories={categories.map((c) => c.id)}
          initialTags={tags.map((t) => t.id)}
          onSave={handleSave}
        />
      ) : (
        <div>
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200"
            >
              Editar
            </button>
          </div>
          <CategoriesTags
            categories={categories}
            tags={tags}
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
