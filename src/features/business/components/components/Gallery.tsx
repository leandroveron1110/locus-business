"use client";

import { useState } from "react";
import { useGallery } from "../../hooks/useGallery";
import { SkeletonGallery } from "./Skeleton/SkeletonGallery";

interface Props {
  businessId: string;
}

export default function Gallery({ businessId }: Props) {
  const { data, isLoading, isError } = useGallery(businessId);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (isLoading) return <SkeletonGallery />;
  if (isError || !data || data.length === 0) return <p className="text-gray-600">No hay imágenes para mostrar.</p>;

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

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Galería</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-[7rem] sm:auto-rows-[8rem]">
        {data.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => openLightbox(idx)}
            className="relative overflow-hidden rounded-2xl shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-5"
            aria-label={`Abrir imagen ${idx + 1} de la galería`}
          >
            <img
              src={img.url}
              alt={`Imagen negocio ${idx + 1}`}
              loading="lazy"
              className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-1"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 hover:opacity-100 transition-opacity rounded-2xl" />
          </button>
        ))}
      </div>

      {/* Lightbox modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imágenes de la galería"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-red-500 focus:outline-none"
            aria-label="Cerrar visor de imágenes"
          >
            &times;
          </button>

          <button
            onClick={showPrev}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold hover:text-blue-400 focus:outline-none"
            aria-label="Imagen anterior"
          >
            ‹
          </button>

          <img
            src={data[selectedIndex].url}
            alt={`Imagen negocio ${selectedIndex + 1}`}
            className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
          />

          <button
            onClick={showNext}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold hover:text-blue-400 focus:outline-none"
            aria-label="Imagen siguiente"
          >
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
