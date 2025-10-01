// src/app/business/employees/hooks.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBusinessEmployees, // Importa la nueva función
  IEmployee,
  getBusinessRolesAndPermissions,
  createBusinessEmployee,
  updateBusinessEmployeePermissions,
  UserSearchResponse,
  BusinessRole,
  CreateBusinessEmployeePayload,
  UpdateBusinessEmployeePayload,
  deleteRoleEmployees,
  findByEmail,
} from "../api/employees-api";
import { ApiError } from "@/types/api";
import { ApiResult } from "@/lib/apiFetch";

// Hook para buscar un usuario por ID
export const useFindUser = (userEmail: string | null) => {
  return useQuery<ApiResult<UserSearchResponse>, ApiError>({
    queryKey: ["findUser", userEmail],
    queryFn: () => findByEmail(userEmail!),
    enabled: !!userEmail,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
    retry: (failureCount, error) => {
      // No reintentar si es un 404 (usuario no encontrado)
      if (error?.statusCode === 404) return false;
      return failureCount < 1; // Opcional: reintenta 1 vez para otros errores
    },
  });
};

// Hook para obtener los roles de un negocio
export const useBusinessRoles = (businessId: string | undefined) => {
  return useQuery<ApiResult<BusinessRole[]>, ApiError>({
    queryKey: ["businessRoles", businessId],
    queryFn: () => getBusinessRolesAndPermissions(businessId!),
    enabled: !!businessId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};

export const useBusinessEmployees = (businessId: string | undefined) => {
  return useQuery<ApiResult<IEmployee[]>, ApiError>({
    queryKey: ["employees", businessId],
    queryFn: () => getBusinessEmployees(businessId!),
    enabled: !!businessId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};

export const useDeleteRoleEmployess = (businessId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId }: { employeeId: string }) =>
      deleteRoleEmployees(businessId, employeeId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["employees", businessId] }),
  });
};

// Hook para las mutaciones de empleado (crear y actualizar permisos)
export const useEmployeeMutations = (
  businessId: string,
  newEmployeeId: string | null
) => {
  const assignRoleMutation = useMutation({
    mutationFn: (payload: CreateBusinessEmployeePayload) =>
      createBusinessEmployee(businessId!, payload),
  });

  const overridePermissionsMutation = useMutation({
    mutationFn: (payload: UpdateBusinessEmployeePayload) =>
      updateBusinessEmployeePermissions(newEmployeeId!, payload),
  });

  return { assignRoleMutation, overridePermissionsMutation };
};
