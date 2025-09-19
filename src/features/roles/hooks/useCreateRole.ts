import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { createRoleApi } from '../api/roles-api';
import { BusinessRole, CreateBusinessRole } from '../types/roles';

export const useCreateRole = (
  options?: UseMutationOptions<BusinessRole, Error, CreateBusinessRole>
) => {
  return useMutation({
    mutationFn: createRoleApi,
    onSuccess: (data) => {
      console.log("Rol creado exitosamente:", data);
      // Puedes manejar la navegación aquí, o dejarlo en el componente
      // router.push('/roles'); 
    },
    onError: () => {
      alert("Error al crear el rol. Inténtalo de nuevo.");
    },
    ...options, // Permite sobrescribir las opciones por defecto
  });
};