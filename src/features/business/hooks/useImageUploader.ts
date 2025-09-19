// src/hooks/useImageUploader.ts
import { useState } from "react";
import axios from "@/lib/api";


export const useFileUploader = (businessId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setUploadError(null);

    try {
      const response = await axios.post(`/business/${businessId}/logo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Retorna los datos de la respuesta para que el componente los maneje
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al subir la imagen.";
      setUploadError(errorMessage);
      console.error("Error al subir el archivo:", err);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, uploadError };
};