import api from '@/lib/api';

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
  overrides: OverrideDto[];
}

// --- Interfaz para el rol de negocio con sus permisos ---
export interface BusinessRole {
  id: string;
  name: string;
  permissions: string[];
}

// --- Interfaz para buscar un cliente ---
export interface UserSearchResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Obtiene los roles de negocio y sus permisos de la API.
 */
export const getBusinessRolesAndPermissions = async (businessId: string): Promise<BusinessRole[]> => {
  const response = await api.get(`/roles/business/${businessId}`);
  return response.data;
};

/**
 * Busca un usuario (cliente) por su ID.
 */
export const findUserById = async (userId: string): Promise<UserSearchResponse> => {
    // Necesitas un endpoint en tu backend para buscar por ID.
    const response = await api.get(`/users/${userId}`);
    return response.data;
};

/**
 * Crea un nuevo empleado y devuelve el ID del empleado recién creado.
 */
export const createBusinessEmployee = async (businessId: string, payload: CreateBusinessEmployeePayload): Promise<{ employeeId: string }> => {
  const response = await api.post(`/employees/business`, { ...payload, businessId });
  // Se asume que el backend devuelve el ID del empleado creado
  return response.data;
};

/**
 * Actualiza los permisos de un empleado de negocio.
 */
export const updateBusinessEmployeePermissions = async (employeeId: string, payload: UpdateBusinessEmployeePayload) => {
  const response = await api.patch(`/employees/business/${employeeId}`, payload);
  return response.data;
};