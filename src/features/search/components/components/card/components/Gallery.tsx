// src/components/Gallery.tsx
"use client";

import { useState, useEffect } from "react";
import { ImageOff, ChevronLeft, ChevronRight, X } from "lucide-react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useGallery } from "@/features/search/hooks/useGallery";

interface Props {
  businessId: string;
}

// ➡️ Lightbox
interface LightboxProps {
  images: { id: string; url: string; alt?: string }[];
  selectedIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const Lightbox = ({
  images,
  selectedIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onPrev, onNext]);

  return createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Visor de imágenes de la galería"
      onClick={onClose}
    >
      <div
        className="relative flex items-center justify-center w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-red-500 focus:outline-none z-10"
          aria-label="Cerrar visor de imágenes"
        >
          <X size={32} />
        </button>

        {/* Anterior */}
        <button
          onClick={onPrev}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold hover:text-blue-400 focus:outline-none z-10"
          aria-label="Imagen anterior"
        >
          <ChevronLeft size={40} />
        </button>

        {/* Imagen */}
        <div
          className="relative w-full max-w-[90vw] max-h-[80vh] animate-scale-in"
          style={{ height: "80vh" }}
        >
          <Image
            src={images[selectedIndex].url}
            alt={`Imagen negocio ${selectedIndex + 1}`}
            fill
            className="rounded-lg shadow-lg object-contain"
            sizes="(max-width: 768px) 100vw, 75vw"
          />
        </div>

        {/* Siguiente */}
        <button
          onClick={onNext}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold hover:text-blue-400 focus:outline-none z-10"
          aria-label="Imagen siguiente"
        >
          <ChevronRight size={40} />
        </button>

        {/* Contador */}
        <p className="absolute bottom-6 text-white text-sm select-none z-10">
          Imagen {selectedIndex + 1} de {images.length}
        </p>
      </div>
    </div>,
    document.body
  );
};

// ➡️ Componente principal Gallery
export default function Gallery({ businessId }: Props) {
  const { data, isError } = useGallery(businessId);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);


  if (isError || !data || data.length === 0)
    return (
      <div className="mt-8 flex flex-col items-center justify-center p-12 rounded-xl bg-gray-50 border border-gray-200 shadow-sm">
        <ImageOff className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-400 text-center text-sm sm:text-base">
          Sin imágenes para mostrar
        </p>
      </div>
    );

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const showPrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (prevIndex) => (prevIndex! - 1 + data.length) % data.length
    );
  };
  const showNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prevIndex) => (prevIndex! + 1) % data.length);
  };

  return (
    <section className="mt-8">
      {/* Grilla */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-[7rem] sm:auto-rows-[8rem]">
        {data.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => openLightbox(idx)}
            className="relative overflow-hidden rounded-2xl shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Abrir imagen ${idx + 1} de la galería`}
          >
            <Image
              src={img.url}
              alt={`Imagen negocio ${idx + 1}`}
              fill
              className="object-cover transform transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 640px) 50vw, 25vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 hover:opacity-100 transition-opacity rounded-2xl" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <Lightbox
          images={data}
          selectedIndex={selectedIndex}
          onClose={closeLightbox}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </section>
  );
}
