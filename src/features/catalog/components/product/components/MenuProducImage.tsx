"use client";
import { useState, useRef } from "react";
import {
  useDeleteMenuProductImage,
  useUploadMenuProductImage,
} from "../../../hooks/useMenuHooks";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface MenuProductImageProp {
  image: string;
  name: string;
  menuProductId: string;
  businessId: string;
  onUpdate: (data: { imageUrl: string }) => void;
}

export default function MenuProductImage({
  image,
  name,
  menuProductId,
  businessId,
  onUpdate,
}: MenuProductImageProp) {
  const [preview, setPreview] = useState(image);
  const inputRef = useRef<HTMLInputElement>(null);

  const { addAlert } = useAlert();

  const uploadMutate = useUploadMenuProductImage(businessId);
  const deleteMutate = useDeleteMenuProductImage(businessId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutate.mutate(
      { menuProductId, file },
      {
        onSuccess: (data) => {
          if (data) {
            setPreview(data.url);
            onUpdate({ imageUrl: data.url });
          }
        },
        onError: (error) => {
          addAlert({
            message: getDisplayErrorMessage(error),
            type: "error",
          });
        },
      }
    );
  };

  const handleRemove = () => {
    deleteMutate.mutate(menuProductId, {
      onSuccess: () => {
        setPreview("");
        onUpdate({ imageUrl: "" });
        if (inputRef.current) inputRef.current.value = "";
      },
      onError: (error) => {
        addAlert({
          message: getDisplayErrorMessage(error),
          type: "error",
        });
      },
    });
  };

  return (
    <div className="w-full h-[170px] rounded overflow-hidden border border-gray-200 relative">
      {preview ? (
        <img src={preview} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          Sin imagen
        </div>
      )}

      <div className="absolute top-2 right-2 flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
        >
          Cambiar
        </button>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
