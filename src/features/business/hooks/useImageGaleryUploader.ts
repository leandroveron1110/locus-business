// src/hooks/useImageUploader.ts
import { useState } from "react";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { fetchUploadImageGelery } from "../api/businessApi";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

type RefetchFunction = () => Promise<unknown>;

export const useImageGaleryUploader = (businessId: string, refetch: RefetchFunction) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addAlert } = useAlert()
  

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // El nombre 'file' debe coincidir con el del @UseInterceptors(FileInterceptor('file')) en tu controlador.

    setIsUploading(true);
    setError(null);

    try {
      // Usamos la URL que define tu controlador
      await fetchUploadImageGelery(businessId, formData);

      await refetch();
    } catch (err) {
      addAlert({
        message: getDisplayErrorMessage(err),
        type: 'error'
      })
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
};