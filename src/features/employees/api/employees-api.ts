import { PermissionsEnum } from "@/features/common/utils/permissions.enum";
import api from "@/lib/api";
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
): Promise<BusinessRole[]> => {
  try {
    const response = await api.get(`/roles/business/${businessId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, "No se pudieron obtener los roles del negocio");
  }
};

export const getBusinessEmployees = async (
  businessId: string
): Promise<IEmployee[]> => {
  try {
    const response = await api.get(
      `/employees/business/employess/${businessId}`
    );
    return response.data;
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
    const response = await api.patch(
      `/employees/remove-role/${businessId}/${employeeId}`
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error, "No se pudo eliminar el rol del empleado");
  }
};

export const findUserById = async (
  userId: string
): Promise<UserSearchResponse> => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, "No se pudo encontrar el usuario por ID");
  }
};

export const findByEmail = async (
  email: string
): Promise<UserSearchResponse> => {
  try {
    const response = await api.get(`/users/email/${email}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, "No se pudo encontrar el usuario por email");
  }
};

export const createBusinessEmployee = async (
  businessId: string,
  payload: CreateBusinessEmployeePayload
): Promise<{ employeeId: string }> => {
  try {
    const response = await api.post(`/employees/business`, {
      ...payload,
      businessId,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "No se pudo crear el empleado");
  }
};

export const updateBusinessEmployeePermissions = async (
  employeeId: string,
  payload: UpdateBusinessEmployeePayload
) => {
  try {
    const response = await api.patch(
      `/employees/business/${employeeId}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw handleApiError(
      error,
      "No se pudieron actualizar los permisos del empleado"
    );
  }
};
