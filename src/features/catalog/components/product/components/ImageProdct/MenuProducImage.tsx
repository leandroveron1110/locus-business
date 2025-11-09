"use client";
import { useState, useRef } from "react";
import { Upload, Library, X } from "lucide-react";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
import {
  useDeleteMenuProductImage,
  useUploadMenuProductImage,
} from "@/features/catalog/hooks/useMenuHooks";
import { ImagePreviewComponent } from "./components/ImagePreviewComponent";
import { GlobalImageLibraryDropdown } from "./components/GlobalImageLibraryDropdown";

interface MenuProductImageProp {
  image: string;
  name: string;
  menuProductId: string;
  businessId: string;
  onUpdate: (data: { imageUrl: string }) => void;
}

type ImageSource = "upload" | "library" | null;

export default function MenuProductImage({
  image,
  name,
  menuProductId,
  businessId,
  onUpdate,
}: MenuProductImageProp) {
  const [preview, setPreview] = useState(image);
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageSource, setImageSource] = useState<ImageSource>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const { addAlert } = useAlert();

  const uploadMutate = useUploadMenuProductImage(businessId);
  const deleteMutate = useDeleteMenuProductImage(businessId);

  const isUploadPending = uploadMutate.isPending;
  const isDeletePending = deleteMutate.isPending;
  const isPending = isUploadPending || isDeletePending;

  /** 🟢 Subir nueva imagen */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (inputRef.current) inputRef.current.value = "";

    setImageSource("upload");
    setShowDropdown(false);

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

  /** 🔴 Eliminar imagen */
  const handleRemove = () => {
    deleteMutate.mutate(menuProductId, {
      onSuccess: () => {
        setPreview("");
        setImageSource(null);
        onUpdate({ imageUrl: "" });
      },
      onError: (error) => {
        addAlert({
          message: getDisplayErrorMessage(error),
          type: "error",
        });
      },
    });
  };

  /** 📂 Abrir selector de archivos */
  const handleInputClick = () => {
    if (isPending) return;
    inputRef.current?.click();
  };

  /** 🖼️ Seleccionar imagen de librería */
  const handleSelectFromLibrary = (data: { imageUrl: string }) => {
    setPreview(data.imageUrl);
    setImageSource("library");
    onUpdate(data);
    setShowDropdown(false);
  };

  return (
    <div className="w-full relative">
      {/* 1️⃣ Previsualización */}
      <ImagePreviewComponent
        preview={preview}
        name={name}
        isPending={isPending}
        onRemove={handleRemove}
      />

      {/* 2️⃣ Botones de acción (solo uno visible según el estado) */}
      <div className="flex gap-2 justify-between items-center mt-2">
        {!showDropdown ? (
          <>
            <button
              onClick={handleInputClick}
              disabled={isPending}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {isUploadPending ? (
                <span className="flex items-center">
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  {/* Texto visible solo en pantallas medianas en adelante */}
                  <span className="hidden md:inline">Subiendo...</span>
                </span>
              ) : (
                <span className="flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Subir nueva imagen</span>
                </span>
              )}
            </button>

            <button
              onClick={() => setShowDropdown(true)}
              disabled={isPending}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              <Library className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Usar librería</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowDropdown(false)}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-600 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition"
          >
            <X className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Cerrar librería</span>
          </button>
        )}
      </div>

      {/* 3️⃣ Input oculto */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 4️⃣ Dropdown de librería */}
      {showDropdown && (
        <GlobalImageLibraryDropdown
          show={showDropdown}
          onClose={() => setShowDropdown(false)}
          onUpdate={handleSelectFromLibrary}
          menuProductId={menuProductId}
        />
      )}

      {/* 5️⃣ Fuente de imagen actual */}
      {imageSource && (
        <p className="text-xs text-gray-500 mt-2 italic">
          Imagen seleccionada desde{" "}
          {imageSource === "upload" ? "tu dispositivo" : "la librería global"}.
        </p>
      )}
    </div>
  );
}
