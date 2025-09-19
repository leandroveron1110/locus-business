// src/hooks/useBusinessContactUpdater.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ContactUpdateData, fetchBusinessConctat } from '../api/businessApi';



export const useBusinessContactUpdater = (businessId: string) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (data: ContactUpdateData)=> fetchBusinessConctat(businessId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", businessId] });
      console.log("✅ Datos de contacto guardados con éxito.");
    },
    onError: (err) => {
      console.error("❌ Hubo un error al actualizar el contacto:", err);
    },
  });

  return { updateContact: mutate, isUpdating: isPending, isError, error };
};
