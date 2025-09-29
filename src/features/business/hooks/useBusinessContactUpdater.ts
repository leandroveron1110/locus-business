// src/hooks/useBusinessContactUpdater.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ContactUpdateData, fetchBusinessConctat } from '../api/businessApi';
import { ApiError } from '@/types/api';



export const useBusinessContactUpdater = (businessId: string) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation<void, ApiError, ContactUpdateData>({
    mutationFn: (data: ContactUpdateData)=> fetchBusinessConctat(businessId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", businessId] });
    }
  });

  return { updateContact: mutate, isUpdating: isPending, isError, error };
};
