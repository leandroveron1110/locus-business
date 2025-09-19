// src/hooks/useImageUploader.ts
import { useState } from "react";
import axios from "@/lib/api";

type RefetchFunction = () => Promise<any>;

export const useImageGaleryUploader = (businessId: string, refetch: RefetchFunction) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // El nombre 'file' debe coincidir con el del @UseInterceptors(FileInterceptor('file')) en tu controlador.

    setIsUploading(true);
    setError(null);

    try {
      // Usamos la URL que define tu controlador
      await axios.post(`/business/${businessId}/gallery`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Si la subida es exitosa, refresca la galería
      await refetch();
    } catch (err) {
      console.error("Error al subir la imagen:", err);
      // Aquí puedes manejar el error de forma más detallada
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
};