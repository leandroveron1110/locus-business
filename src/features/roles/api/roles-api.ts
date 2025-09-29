import { handleApiError } from "@/lib/handleApiError";
import { BusinessRole, CreateBusinessRole } from "../types/roles";
import { apiGet, apiPatch, apiPost, ApiResult } from "@/lib/apiFetch";

export const createRoleApi = async (
  data: CreateBusinessRole
): Promise<ApiResult<BusinessRole>> => { 
  try {
    return await apiPost<BusinessRole>('/roles', data);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo crear el rol "${data.name}".`);
  }
};

export const getRoleApi = async (roleId: string): Promise<ApiResult<BusinessRole>> => {
  try {
    return await apiGet<BusinessRole>(`/roles/${roleId}`);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo obtener el rol con ID ${roleId}.`);
  }
};

export const getRolesByBusinessIdApi = async (
  businessId: string
): Promise<ApiResult<BusinessRole[]>> => {
  try {
    return await apiGet<BusinessRole[]>(`/roles/business/${businessId}`);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudieron obtener los roles del negocio con ID ${businessId}.`);
  }
};

export const updateRoleApi = async ({
  roleId,
  data,
}: {
  roleId: string;
  data: Partial<CreateBusinessRole>;
}): Promise<ApiResult<BusinessRole>> => {
  try {
    return await apiPatch<BusinessRole>(`/roles/${roleId}`, data);
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudo actualizar el rol con ID ${roleId}.`);
  }
};
