import { PermissionsEnum } from "@/features/common/utils/permissions.enum";
import { apiGet, apiPatch, apiPost, ApiResult } from "@/lib/apiFetch";
import { handleApiError } from "@/lib/handleApiError";

// --- Interfaz para el payload de creación de un empleado ---
export interface CreateBusinessEmployeePayload {
  userId: string;
  roleId: string;
}

// --- Interfaz para la sobrescritura de permisos (tomado de tu backend) ---
export interface OverrideDto {
  permission: string; // Usamos string para el enum
  allowed: boolean;
}

// --- Interfaz para el payload de actualización ---
export interface UpdateBusinessEmployeePayload {
  roleId: string;
  overrides: OverrideDto[];
}

// --- Interfaz para el rol de negocio con sus permisos ---
export interface BusinessRole {
  id: string;
  name: string;
  permissions: PermissionsEnum[];
}

// --- Interfaz para buscar un cliente ---
export interface UserSearchResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IEmployeeOverride {
  permission: PermissionsEnum;
  allowed: boolean;
}

export interface IEmployeeRole {
  id: string;
  name: string;
  permissions: PermissionsEnum[];
}

export interface IEmployee {
  id: string;
  idUser: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarId: string | null;
  isDeleted: boolean;
  role: IEmployeeRole | null;
  overrides: IEmployeeOverride[];
}

export const getBusinessRolesAndPermissions = async (
  businessId: string
): Promise<ApiResult<BusinessRole[]>> => {
  try {
    const response = await apiGet<BusinessRole[]>(`/roles/business/${businessId}`);
    return response;
  } catch (error) {
    throw handleApiError(error, "No se pudieron obtener los roles del negocio");
  }
};

export const getBusinessEmployees = async (
  businessId: string
): Promise<ApiResult<IEmployee[]>> => {
  try {
    const response = await apiGet<IEmployee[]>(
      `/employees/business/employess/${businessId}`
    );
    return response;
  } catch (error) {
    throw handleApiError(
      error,
      "No se pudieron obtener los empleados del negocio"
    );
  }
};

export const deleteRoleEmployees = async (
  businessId: string,
  employeeId: string
) => {
  try {
    const response = await apiPatch(
      `/employees/remove-role/${businessId}/${employeeId}`
    );
    return response;
  } catch (error) {
    throw handleApiError(error, "No se pudo eliminar el rol del empleado");
  }
};

export const findUserById = async (
  userId: string
): Promise<ApiResult<UserSearchResponse>> => {
  try {
    const response = await apiGet<UserSearchResponse>(`/users/${userId}`);
    return response;
  } catch (error) {
    throw handleApiError(error, "No se pudo encontrar el usuario por ID");
  }
};

export const findByEmail = async (
  email: string
): Promise<ApiResult<UserSearchResponse>> => {
  try {
    const response = await apiGet<UserSearchResponse>(`/users/email/${email}`);
    return response;
  } catch (error) {
    throw handleApiError(error, "No se pudo encontrar el usuario por email");
  }
};

export const createBusinessEmployee = async (
  businessId: string,
  payload: CreateBusinessEmployeePayload
): Promise<ApiResult<{ employeeId: string }>> => {
  try {
    const response = await apiPost<{employeeId: string}>(`/employees/business`, {
      ...payload,
      businessId,
    });
    return response;
  } catch (error) {
    throw handleApiError(error, "No se pudo crear el empleado");
  }
};

export const updateBusinessEmployeePermissions = async (
  employeeId: string,
  payload: UpdateBusinessEmployeePayload
) => {
  try {
    const response = await apiPatch(
      `/employees/business/${employeeId}`,
      payload
    );
    return response;
  } catch (error) {
    throw handleApiError(
      error,
      "No se pudieron actualizar los permisos del empleado"
    );
  }
};
