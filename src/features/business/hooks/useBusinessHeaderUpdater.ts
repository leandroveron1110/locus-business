// src/hooks/useBusinessHeaderUpdater.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/api';

interface UpdateData {
  name?: string;
  shortDescription?: string;
  fullDescription?: string;
}

export const useBusinessHeaderUpdater = (businessId: string) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async (data: UpdateData) => {
      // Endpoint para actualizar solo los datos de texto del encabezado
      const response = await axios.patch(`/business/${businessId}`, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalida la caché de la consulta del negocio para que se refresque
      queryClient.invalidateQueries({ queryKey: ['business', businessId] });
    },
  });

  return { updateHeader: mutate, isUpdating: isPending, isError, error };
};