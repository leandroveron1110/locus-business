import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { createRoleApi } from "../api/roles-api";
import { BusinessRole, CreateBusinessRole } from "../types/roles";
import { ApiResult } from "@/lib/apiFetch";
import { ApiError } from "@/types/api";

export const useCreateRole = (
  options?: UseMutationOptions<
    ApiResult<BusinessRole>,
    ApiError,
    CreateBusinessRole
  >
) => {
  return useMutation<ApiResult<BusinessRole>, ApiError, CreateBusinessRole>({
    mutationFn: createRoleApi,
    onSuccess: (data) => {
      console.log("Rol creado exitosamente:", data);
      // Si querés, podés usar "variables" para mostrar qué rol se creó
    },
    onError: (error) => {
      alert(error.message || "Error al crear el rol. Inténtalo de nuevo.");
    },
    retry: false,
    ...options,
  });
};
