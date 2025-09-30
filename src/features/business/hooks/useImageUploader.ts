// src/hooks/useImageUploader.ts
import { useState } from "react";
import axios from "@/lib/api";
import { fetchFileUploader } from "../api/businessApi";


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
      const response = await fetchFileUploader(businessId, formData)

      if(response) {
        return response;

      }

      // Retorna los datos de la respuesta para que el componente los maneje
    } catch (err) {

      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, uploadError };
};