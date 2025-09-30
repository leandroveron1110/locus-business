// src/hooks/useImageRemover.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBusinessDeleteGalery } from '../api/businessApi';
import { useAlert } from '@/features/common/ui/Alert/Alert';
import { getDisplayErrorMessage } from '@/lib/uiErrors';
import { ApiError } from '@/types/api';

export function useImageGaleryRemover(businessId: string) {
  const queryClient = useQueryClient();
  const { addAlert } = useAlert();

  const {
    mutate: removeImage,
    isPending: isRemoving,
  } = useMutation<void, ApiError, string>({
    mutationFn: (imageId: string) => {
      return fetchBusinessDeleteGalery(businessId, imageId);
    },
    onSuccess: () => {
      // Invalida la caché de la galería para que `react-query` haga un refetch
      queryClient.invalidateQueries({ queryKey: ['gallery', businessId] });
    },
    onError: (error) => {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: 'error'
      })
    },
  });

  return { removeImage, isRemoving };
}