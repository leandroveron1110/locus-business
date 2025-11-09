// src/components/MenuProductImage/ImagePreviewComponent.tsx (MEJORADO)

import { useState, useEffect } from "react";
import { Trash2, Image as ImageIcon } from "lucide-react";

interface ImagePreviewProps {
  preview: string;
  name: string;
  isPending: boolean;
  onRemove: () => void;
  maxDisplaySize?: number; // Tamaño máximo recomendado (ej: 300px)
}

export function ImagePreviewComponent({
  preview,
  name,
  isPending,
  onRemove,
  maxDisplaySize = 300,
}: ImagePreviewProps) {
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!preview) {
      setImageSize(null);
      return;
    }

    const img = new window.Image();
    img.onload = () => setImageSize({ width: img.width, height: img.height });
    img.onerror = () => setImageSize(null);
    img.src = preview;
  }, [preview]);

  // Verificamos si la imagen es pequeña respecto al tamaño MÁXIMO de display
  const isSmallImage = imageSize
    ? imageSize.width < maxDisplaySize && imageSize.height < maxDisplaySize
    : false;

  return (
    <div
      // 🔑 CAMBIO CLAVE: Contenedor con tamaño MÁXIMO más compacto (ej: max-w-sm h-72)
      className="max-w-sm h-72 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 relative mb-4 shadow-sm group hover:border-blue-500 transition-colors mx-auto flex items-center justify-center bg-gray-50"
      style={{ maxWidth: `${maxDisplaySize}px`, height: `${maxDisplaySize}px` }} // Forzar el tamaño máximo a 300x300px
    >
      {preview ? (
        <>
          <img
            src={preview}
            alt={name}
            // 🔑 CAMBIO CLAVE: object-contain para que la imagen no se estire y se mantenga dentro del contenedor.
            // El tamaño máximo es manejado por el contenedor y las propiedades max-width/max-height en CSS.
            className="max-w-full max-h-full object-contain"
            style={{
              // Si la imagen es más pequeña que el máximo, usamos sus dimensiones reales para evitar estiramiento.
              width:
                imageSize && imageSize.width < maxDisplaySize
                  ? `${imageSize.width}px`
                  : "100%",
              height:
                imageSize && imageSize.height < maxDisplaySize
                  ? `${imageSize.height}px`
                  : "100%",
            }}
          />

          {/* 🔑 Mensaje ahora indica que se muestra a tamaño reducido si es pequeña */}
          {isSmallImage && (
            <div className="absolute bottom-2 left-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded shadow">
              ⚠️ Imagen de {imageSize?.width}x{imageSize?.height}px. Se muestra
              a tamaño original.
            </div>
          )}

          {/* Botón de Eliminar */}
          <button
            type="button"
            onClick={onRemove}
            disabled={isPending}
            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 disabled:bg-gray-400 transition opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Eliminar Imagen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 text-sm p-4 text-center">
          <ImageIcon className="w-8 h-8" />
          <span className="mt-2 text-base font-medium">
            Sin imagen para {name}
          </span>
          <span className="text-xs">
            Usa los botones de abajo para añadir una.
          </span>
        </div>
      )}
    </div>
  );
}
