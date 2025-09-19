// src/hooks/useImageRemover.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBusinessDeleteGalery } from '../api/businessApi';

export function useImageGaleryRemover(businessId: string) {
  const queryClient = useQueryClient();

  const {
    mutate: removeImage,
    isPending: isRemoving,
  } = useMutation({
    mutationFn: (imageId: string) => {
      return fetchBusinessDeleteGalery(businessId, imageId);
    },
    onSuccess: () => {
      // Invalida la caché de la galería para que `react-query` haga un refetch
      queryClient.invalidateQueries({ queryKey: ['gallery', businessId] });
      console.log('Imagen eliminada correctamente.');
    },
    onError: (error) => {
      console.error('Hubo un error al eliminar la imagen:', error);
    },
  });

  return { removeImage, isRemoving };
}