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
import { ApiErrorResponse } from "@/types/api";

// Hook para buscar un usuario por ID
export const useFindUser = (userEmail: string | null) => {
  return useQuery<UserSearchResponse, ApiErrorResponse>({
    queryKey: ["findUser", userEmail],
    queryFn: () => findByEmail(userEmail!),
    enabled: !!userEmail,
    staleTime: Infinity,
    retry: (failureCount, error) => {
      // No reintentar si es un 404 (usuario no encontrado)
      if (error?.statusCode === 404) return false;
      return failureCount < 1; // Opcional: reintenta 1 vez para otros errores
    },
  });
};

// Hook para obtener los roles de un negocio
export const useBusinessRoles = (businessId: string | undefined) => {
  return useQuery<BusinessRole[], ApiErrorResponse>({
    queryKey: ["businessRoles", businessId],
    queryFn: () => getBusinessRolesAndPermissions(businessId!),
    enabled: !!businessId,
  });
};

export const useBusinessEmployees = (businessId: string | undefined) => {
  return useQuery<IEmployee[], ApiErrorResponse>({
    queryKey: ["employees", businessId],
    queryFn: () => getBusinessEmployees(businessId!),
    enabled: !!businessId,
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
