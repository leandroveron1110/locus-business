"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useGallery } from "../../hooks/useGallery";
import { useImageGaleryUploader } from "../../hooks/useImageGaleryUploader";
import { SkeletonGallery } from "./Skeleton/SkeletonGallery";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { useImageGaleryRemover } from "../../hooks/useImageGaleryRemover";
import { useApiError } from "@/features/common/utils/useApiError";

interface Props {
  businessId: string;
}

export default function Gallery({ businessId }: Props) {
  const { data, isLoading, isError, refetch, error } = useGallery(businessId);

  useApiError(isError, error);
  const { uploadImage, isUploading } = useImageGaleryUploader(businessId, refetch);
  const { removeImage, isRemoving } = useImageGaleryRemover(businessId);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState(false);

  if (isLoading) return <SkeletonGallery />;

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const showPrev = () =>
    setSelectedIndex((prev) =>
      prev !== null ? (prev - 1 + (data?.length ?? 0)) % (data?.length ?? 1) : null
    );
  const showNext = () =>
    setSelectedIndex((prev) =>
      prev !== null ? (prev + 1) % (data?.length ?? 1) : null
    );

  const handleDelete = async (imageId: string) => {
    const confirmed = confirm("¿Eliminar esta imagen?");
    if (confirmed) {
      removeImage(imageId);
      refetch();
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } } as unknown;
      await uploadImage(fakeEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Galería</h2>
        <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer">
          <ImagePlus className="-ml-1 mr-2 h-5 w-5" />
          {isUploading ? "Subiendo..." : "Agregar Imagen"}
          <input type="file" className="hidden" onChange={uploadImage} />
        </label>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`mb-4 border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-500" />
        <p className="text-sm text-gray-600 mt-2">
          Arrastra y suelta una imagen aquí, o usa el botón de arriba
        </p>
      </div>

      {/* Galería */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-[7rem] sm:auto-rows-[8rem]">
          {data?.map((img, idx) => (
            <motion.div
              key={img.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group rounded-2xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => openLightbox(idx)}
                className="w-full h-full relative focus:outline-none"
              >
                <Image
                  src={img.url}
                  alt={`Imagen negocio ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  priority={idx === 0}
                />
              </button>
              <button
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isRemoving}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Lightbox */}
      {selectedIndex !== null && data && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-red-500"
          >
            &times;
          </button>
          <button
            onClick={showPrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-4xl font-bold hover:text-blue-400"
          >
            ‹
          </button>
          <div className="relative max-h-[80vh] max-w-[90vw] w-full h-full flex items-center justify-center">
            <Image
              src={data[selectedIndex].url}
              alt={`Imagen negocio ${selectedIndex + 1}`}
              fill
              sizes="80vw"
              className="object-contain rounded-lg shadow-lg"
            />
          </div>
          <button
            onClick={showNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-4xl font-bold hover:text-blue-400"
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
