"use client";

import { useState } from "react";
import { useGallery } from "../../hooks/useGallery";
import { useImageUploader } from "../../hooks/useImageUploader";
import { SkeletonGallery } from "./Skeleton/SkeletonGallery";
import { ImagePlus, Trash2 } from 'lucide-react'; // Cambiado de Heroicons a Lucide React

interface Props {
  businessId: string;
}

export default function Gallery({ businessId }: Props) {
  const { data, isLoading, isError, refetch } = useGallery(businessId);
  const { uploadImage, isUploading } = useImageUploader(businessId, refetch);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (isLoading) return <SkeletonGallery />;
  if (isError || !data || data.length === 0) return (
    <div className="text-center p-8">
      <p className="text-gray-600 mb-4">No hay imágenes para mostrar.</p>
      <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
        <ImagePlus className="-ml-1 mr-2 h-5 w-5" />
        Sube la primera
        <input type="file" className="hidden" onChange={uploadImage} disabled={isUploading} />
      </label>
    </div>
  );

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const showPrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + data.length) % data.length);
  };
  const showNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % data.length);
  };

  const handleDelete = async (imageId: string) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta imagen?")) {
      return;
    }
    console.log("Eliminando imagen con ID:", imageId);
    await new Promise(resolve => setTimeout(resolve, 500));
    refetch();
  };

  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Galería</h2>
        <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer">
          <ImagePlus className="-ml-1 mr-2 h-5 w-5" />
          {isUploading ? "Subiendo..." : "Agregar Imagen"}
          <input type="file" className="hidden" onChange={uploadImage} disabled={isUploading} />
        </label>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-[7rem] sm:auto-rows-[8rem]">
        {data.map((img, idx) => (
          <div key={img.id} className="relative group rounded-2xl shadow-md overflow-hidden">
            <button
              onClick={() => openLightbox(idx)}
              className="w-full h-full relative focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Abrir imagen ${idx + 1} de la galería`}
            >
              <img
                src={img.url}
                alt={`Imagen negocio ${idx + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                decoding="async"
              />
            </button>
            <button
              onClick={() => handleDelete(img.id)}
              className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Eliminar imagen"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imágenes de la galería"
        >
          <button onClick={closeLightbox} className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-red-500 focus:outline-none" aria-label="Cerrar visor de imágenes">
            &times;
          </button>
          <button onClick={showPrev} className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold hover:text-blue-400 focus:outline-none" aria-label="Imagen anterior">
            ‹
          </button>
          <img src={data[selectedIndex].url} alt={`Imagen negocio ${selectedIndex + 1}`} className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg" />
          <button onClick={showNext} className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold hover:text-blue-400 focus:outline-none" aria-label="Imagen siguiente">
            ›
          </button>
          <p className="text-white mt-4 text-sm select-none">
            Imagen {selectedIndex + 1} de {data.length}
          </p>
        </div>
      )}
    </section>
  );
}