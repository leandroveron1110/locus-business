// src/features/search/api/searchApi.ts
import { ISearchBusinessParams, ISearchBusiness } from "../types/search";
import { BusinessCategory, BusinessTag } from "../types/business";
import { apiGet, apiPost, ApiResult } from "@/lib/apiFetch";
import { handleApiError } from "@/lib/handleApiError";

/**
 * Buscar negocios según parámetros
 */
export const fetcSearchBusiness = async (
  params?: ISearchBusinessParams
): Promise<ApiResult<ISearchBusiness>> => {
  try {
    const response = await apiGet<ISearchBusiness>(`/search/businesses`, { params });
    return response;
  } catch (error: unknown) {
    throw handleApiError(error, "No se pudieron obtener los negocios. Intente nuevamente.");
  }
};

/**
 * Obtener negocios por IDs
 */
export const getBusinessesByIds = async (
  ids: string[]
): Promise<ApiResult<ISearchBusiness>> => {
  try {
    const response = await apiPost<ISearchBusiness>("/search/businesses/ids/", { ids });
    return response;
  } catch (error: unknown) {
    throw handleApiError(error, "No se pudieron cargar los negocios solicitados por ID.");
  }
};

/**
 * Obtener tags de un negocio
 */
export const fetchBusinessTags = async (
  businessId: string
): Promise<ApiResult<BusinessTag[]>> => {
  try {
    const res = await apiGet<BusinessTag[]>(`business/${businessId}/tags/tags`);
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudieron obtener los tags del negocio con ID ${businessId}.`);
  }
};

/**
 * Obtener categorías de un negocio
 */
export const fetchBusinessCategories = async (
  businessId: string
): Promise<ApiResult<BusinessCategory[]>> => {
  try {
    const res = await apiGet<BusinessCategory[]>(`/business/${businessId}/categories/category`);
    return res;
  } catch (error: unknown) {
    throw handleApiError(error, `No se pudieron obtener las categorías del negocio con ID ${businessId}.`);
  }
};
