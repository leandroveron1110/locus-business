// src/components/MenuProductImage/GlobalImageLibraryDropdown.tsx (CORREGIDO)

"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { X, Search, Library, Cloud, RefreshCw } from "lucide-react";
import { IGlobalImage } from "@/types/global-image";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { useLinkMenuProductImage } from "@/features/catalog/hooks/useMenuHooks";
import { useGlobalImageStore } from "@/lib/stores/globalImageStore";
import { useGlobalImageSearch } from "@/lib/stores/useGlobalImageSearch";
import { ImageItem } from "./ImageItem";

interface GlobalLibraryProps {
  show: boolean;
  onClose: () => void;
  onUpdate: (data: { imageUrl: string }) => void;
  menuProductId: string;
}

export function GlobalImageLibraryDropdown({
  show,
  onClose,
  onUpdate,
  menuProductId,
}: GlobalLibraryProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addAlert } = useAlert();
  const linkMutate = useLinkMenuProductImage();

  const { getGlobalImage } = useGlobalImageStore();
  const globalImages = getGlobalImage();

  const { syncGlobalImages } = useGlobalImageSearch();

  const isLinking = linkMutate.isPending;

  // 🔑 Filtrado de imágenes de la caché (STORE)
  const filteredImages = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    if (!trimmedQuery) {
      return globalImages;
    }

    // Filtramos por nombre o ID
    return globalImages.filter(
      (img) =>
        img.name.toLowerCase().includes(trimmedQuery) ||
        img.id.toLowerCase().includes(trimmedQuery)
    );
  }, [globalImages, query]);

  /** 📦 Buscar imágenes globales: Dispara la llamada a la API (Backend) */
  const handleApiSearch = useCallback(
    async (search: string) => {
      const trimmedSearch = search.trim();

      setIsLoading(true);
      try {
        // Disparamos la llamada al backend. El hook maneja el lastSyncTime condicional.
        await syncGlobalImages(trimmedSearch);
      } catch (error) {
        addAlert({
          message: getDisplayErrorMessage(error),
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [syncGlobalImages, addAlert]
  );

  // --- EFECTOS Y MANEJADORES ---

  /** 🔹 Carga inicial cuando se abre */
  useEffect(() => {
    // Solo se hace la llamada inicial al backend (query vacío para sync incremental)
    if (show && globalImages.length === 0) {
      handleApiSearch("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  /** 📦 Vincular imagen global (CORREGIDO: Esta función debe existir) */
  const handleSelectImage = (img: IGlobalImage) => {
    if (isLinking) return;

    linkMutate.mutate(
      { menuProductId, imageId: img.id },
      {
        onSuccess: () => {
          onUpdate({ imageUrl: img.url });
          onClose();
          addAlert({
            message: `Imagen "${img.name}" vinculada correctamente.`,
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

  /** 🔹 Cerrar al hacer click fuera */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        show &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (show) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

  // --- RENDERIZADO ---

  if (!show) return null;

  // Variables de visualización
  const isQueryEmpty = query.trim() === "";
  const hasResults = filteredImages.length > 0;

  return (
    <div
      ref={dropdownRef}
      className=" mt-2 right-0 w-full md:w-96 max-h-[480px] bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-40"
    >
      {/* 🔹 Header con buscador */}
      <div className="sticky top-0 bg-white border-b p-3 z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold flex items-center text-gray-700">
            <Library className="w-4 h-4 mr-1" /> Librería Global
          </span>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar imágenes en la caché..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading || isLinking}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#9e2d49] focus:border-[#9e2d49]"
          />
        </div>
      </div>

      {/* 🔹 Contenido */}
      <div className="overflow-y-auto max-h-[400px] p-2">
        {isLoading && (
          <div className="text-center text-sm text-[#9e2d49] py-6">
            Buscando en la nube...
          </div>
        )}

        {!isLoading && hasResults && (
          <>
            <div className="text-xs text-gray-500 mb-2 px-1 flex items-center">
              <Library className="w-3 h-3 mr-1" />
              Resultados en Caché: Se encontraron {filteredImages.length} ítems.
            </div>
            <div className="flex flex-col divide-y divide-gray-100 overflow-y-auto max-h-[70vh] sm:max-h-[80vh]">
              {filteredImages.map((img) => (
                <ImageItem
                  key={img.id}
                  img={img}
                  handleSelectImage={handleSelectImage}
                />
              ))}
            </div>
          </>
        )}

        {/* 🔑 BOTÓN/INDICADOR DE BÚSQUEDA EN LA NUBE (Si no hay resultados locales) */}
        {!isLoading && !isQueryEmpty && !hasResults && (
          <div className="text-center py-6 border-t mt-4">
            <p className="text-sm text-gray-500 mb-3">
              No se encontraron resultados en la caché local.
            </p>
            <button
              onClick={() => handleApiSearch(query)}
              disabled={isLoading || isLinking}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#9e2d49] hover:bg-[#7c233a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9e2d49]"
            >
              <Cloud className="w-5 h-5 mr-2" /> Buscar {query} en la Nube
            </button>
          </div>
        )}

        {/* 🔑 Botón para forzar Sincronización (Si hay resultados locales, pero quiere buscar nuevos) */}
        {!isLoading && !isQueryEmpty && hasResults && (
          <div className="text-center py-4 border-t mt-4">
            <button
              onClick={() => handleApiSearch(query)}
              disabled={isLoading || isLinking}
              className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9e2d49]"
            >
              <RefreshCw className="w-4 h-4 mr-1" /> Re-sincronizar con la Nube
            </button>
          </div>
        )}

        {/* Mensajes de estado inicial o vacío */}
        {!isLoading && isQueryEmpty && globalImages.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-6">
            No hay imágenes globales.
          </div>
        )}
      </div>
    </div>
  );
}
