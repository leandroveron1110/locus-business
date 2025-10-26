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
    const response = await apiGet<ISearchBusiness>(`/search/businesses`, {
      params,
    });
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      "No se pudieron obtener los negocios. Intente nuevamente."
    );
  }
};

/**
 * Obtener negocios por IDs
 */
export const getBusinessesByIds = async (
  ids: string[]
): Promise<ApiResult<ISearchBusiness>> => {
  try {
    const response = await apiPost<ISearchBusiness>("/search/businesses/ids/", {
      ids,
    });
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      "No se pudieron cargar los negocios solicitados por ID."
    );
  }
};

interface GetNewOrdersNotificationBody {
  businessIds: string[];
}

export const getNewNotificationOrders = async (
  businessIds: string[]
): Promise<ApiResult<OrderNotification[]>> => {
  const body: GetNewOrdersNotificationBody = { businessIds };

  try {
    // Usamos apiPost ya que pasamos los businessIds en el cuerpo (body)
    const response = await apiPost<OrderNotification[]>(
      `/orders/notifications/new`, // ⬅️ La ruta POST definida en el controlador
      body
    );
    return response.data;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      "No se pudieron obtener las nuevas órdenes de notificación."
    );
  }
};

export interface OrderNotification {
  id: string;
  businessId: string;
  customerName: string;
  total: string;
  createdAt: string;
}
interface SyncTimesMap {
  [businessId: string]: string | null;
}

interface ISyncOrdersNotificationResponse {
  newOrders: (OrderNotification & { latestTimestamp: string })[];
}

export const syncNewNotificationOrders = async (syncTimes: SyncTimesMap) => {
  const body = { ...syncTimes };
  try {
    const response = await apiPost<ISyncOrdersNotificationResponse>(
      `/orders/notifications/sync`,
      body
    );
    // 💡 Verificación de éxito más limpia
    if (!response.success || !response.data) {
      throw handleApiError(
        response.error,
        "No se pudieron obtener las nuevas órdenes de notificación."
      );
    }

    // Devolvemos los datos y el timestamp global
    return {
      newOrders: response.data.newOrders,
      latestTimestamp: response.timestamp,
    };
  } catch (error: unknown) {
    throw handleApiError(
      error,
      "No se pudieron obtener las nuevas órdenes de notificación."
    );
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
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      `No se pudieron obtener los tags del negocio con ID ${businessId}.`
    );
  }
};

/**
 * Obtener categorías de un negocio
 */
export const fetchBusinessCategories = async (
  businessId: string
): Promise<ApiResult<BusinessCategory[]>> => {
  try {
    const res = await apiGet<BusinessCategory[]>(
      `/business/${businessId}/categories/category`
    );
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(
      error,
      `No se pudieron obtener las categorías del negocio con ID ${businessId}.`
    );
  }
};
