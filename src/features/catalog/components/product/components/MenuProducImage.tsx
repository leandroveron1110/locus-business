"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  useDeleteMenuProductImage,
  useUploadMenuProductImage,
  useLinkMenuProductImage,
} from "../../../hooks/useMenuHooks";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
import { IGlobalImage } from "@/types/global-image";
import { fetchImageGlobal } from "@/features/catalog/api/catalog-api";

// 🌟 Importaciones de Lucide React
import { Upload, Library, Trash2, Image, X } from "lucide-react"; 

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
  const [hasLoadedGlobal, setHasLoadedGlobal] = useState(false); 
  const [globalImages, setGlobalImages] = useState<IGlobalImage[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addAlert } = useAlert();

  const uploadMutate = useUploadMenuProductImage(businessId);
  const deleteMutate = useDeleteMenuProductImage(businessId);
  const linkMutate = useLinkMenuProductImage(businessId);
  
  const [isGlobalLoading, setIsGlobalLoading] = useState(false); 

  // Función para cargar imágenes globales
  const loadGlobalImages = useCallback(async () => {
    if (hasLoadedGlobal) {
      setShowDropdown(true);
      return;
    }
    
    setIsGlobalLoading(true);
    try {
      const data = await fetchImageGlobal();
      setGlobalImages(data.data || []);
      setHasLoadedGlobal(true);
      setShowDropdown(true);
    } catch (error: unknown) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    } finally {
      setIsGlobalLoading(false);
    }
  }, [addAlert, hasLoadedGlobal]);

  // Toggle del dropdown
  const handleToggleDropdown = () => {
    if (showDropdown) {
        setShowDropdown(false);
    } else {
        loadGlobalImages();
    }
  };

  // Cerrar dropdown al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDropdown &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.use-existing-button')
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Subir archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  // Eliminar imagen
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

  // Seleccionar imagen global
  const handleSelectGlobalImage = (img: IGlobalImage) => {
    linkMutate.mutate(
      { menuProductId, imageId: img.id },
      {
        onSuccess: () => {
          setPreview(img.url);
          onUpdate({ imageUrl: img.url });
          setShowDropdown(false);
          addAlert({
            message: `Imagen global ${img.name} vinculada correctamente.`,
            type: "success",
          });
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
  
  // Estado general de carga
  const isPending = uploadMutate.isPending || deleteMutate.isPending || linkMutate.isPending || isGlobalLoading;
  
  // Botones con spinner
  const uploadButtonContent = useMemo(() => {
      if (uploadMutate.isPending) return <span className="flex items-center"><Upload className="w-4 h-4 mr-2 animate-spin" /> Subiendo...</span>;
      return <span className="flex items-center"><Upload className="w-4 h-4 mr-2" /> Subir/Cambiar</span>;
  }, [uploadMutate.isPending]);
  
  const libraryButtonContent = useMemo(() => {
      if (isGlobalLoading) return <span className="flex items-center"><Library className="w-4 h-4 mr-2 animate-spin" /> Cargando...</span>;
      return <span className="flex items-center"><Library className="w-4 h-4 mr-2" /> Librería</span>;
  }, [isGlobalLoading]);

  return (
    <div className="w-full relative">
      {/* 🖼️ Área de Previsualización 400x400 */}
      <div 
        className="w-96 h-96 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 relative mb-4 shadow-sm group hover:border-blue-500 transition-colors mx-auto"
      >
        {preview ? (
          <img src={preview} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 text-sm p-4 text-center">
            <Image className="w-8 h-8" />
            <span className="mt-2 text-base font-medium">Sin imagen para {name}</span>
            <span className="text-xs">Usa los botones de abajo para añadir una.</span>
          </div>
        )}

        {/* ❌ Botón de Eliminar */}
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 disabled:bg-gray-400 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Eliminar Imagen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ⚙️ Controles */}
      <div className="flex gap-2 justify-between items-center z-20">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending} 
          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {uploadButtonContent}
        </button>

        <button
          type="button"
          onClick={handleToggleDropdown}
          disabled={isPending}
          className="use-existing-button flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition relative"
        >
          {libraryButtonContent}
        </button>
      </div>

      {/* 🔽 Dropdown de imágenes globales */}
      {showDropdown && (
        <div 
          ref={dropdownRef} 
          className="absolute top-full mt-2 right-0 w-full md:w-80 max-h-64 overflow-y-auto border border-gray-200 bg-white z-30 shadow-2xl rounded-lg transform origin-top animate-fade-in"
        >
          <div className="p-3 border-b flex justify-between items-center sticky top-0 bg-white z-40">
            <span className="text-sm font-bold text-gray-700">Selecciona de la Librería Global</span>
            <button 
                onClick={() => setShowDropdown(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
            >
                <X className="w-4 h-4" />
            </button>
          </div>
          
          {linkMutate.isPending && (
            <div className="p-4 text-sm text-center text-blue-600">Vinculando imagen...</div>
          )}
          
          {globalImages.length === 0 && !isGlobalLoading && (
             <div className="p-4 text-sm text-center text-gray-500">No hay imágenes globales disponibles.</div>
          )}
          
          {globalImages.map((img) => (
            <div
              key={img.id}
              className="flex items-center p-2 cursor-pointer hover:bg-gray-100 transition"
              onClick={() => handleSelectGlobalImage(img)}
            >
              <img src={img.url} alt={img.name} className="w-24 h-24 object-cover mr-3 rounded" />
              <span className="text-sm truncate font-medium text-gray-800">{img.name}</span>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Animaciones Tailwind */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scaleY(0.95); }
          to { opacity: 1; transform: scaleY(1); }
        }
        .animate-fade-in { animation: fadeIn 0.15s ease-out forwards; }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
