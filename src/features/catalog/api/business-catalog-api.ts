import { Business } from "../types/business";
import { handleApiError } from "@/lib/handleApiError";
import { apiGet, ApiResult } from "@/lib/apiFetch";

export const fetchBusinessID = async (
  businessId: string
): Promise<ApiResult<Business>> => {
  try {
    const res = await apiGet<Business>(
      `/business/business/porfile/${businessId}`
    ); // endpoint de tu API
    return res;
  } catch (error) {
    throw handleApiError(error, "Error al obtener el perfil del negocio");
  }
};
