import { apiGet, apiPatch, apiPost, ApiResult } from "@/lib/apiFetch";
import { Order, SyncResponse } from "../types/order";
import { ICompany } from "../types/company";
import { handleApiError } from "@/lib/handleApiError";

export const fetchOrdersByBusinessId = async (
  businessId: string
): Promise<ApiResult<Order[]>> => {
  try {
    const res = await apiGet<Order[]>(`/orders/business/${businessId}`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al obtener las ordenes del negocio");
  }
};

export const syncOrdersByBusinessId = async (
  businessId: string,
  lastSyncTime?: string
) => {
  try {
    const res = await apiPost<SyncResponse>(`/orders/sync/business`, {
      businessId,
      lastSyncTime,
    });

    if (!res.success || !res.data) {
      throw handleApiError(
        res.error,
        "Error al obtener las  sync ordenes del negocio."
      );
    }
    return {
      newOrUpdatedOrders: res.data.newOrUpdatedOrders,
      latestTimestamp: res.timestamp,
    };
  } catch (error: unknown) {
    throw handleApiError(
      error,
      "Error al obtener las  sync ordenes del negocio."
    );
  }
};

export const fetchUpdateOrdersByOrderID = async (
  orderId: string,
  status: string
): Promise<ApiResult<Order>> => {
  try {
    const res = await apiPatch<Order>(`/orders/order/status/${orderId}`, {
      status,
    });
    return res.data;
  } catch (error) {
    throw handleApiError(error, "Error al actualizar el status");
  }
};

export const fetchUpdateOrdersPaymentByOrderID = async (
  orderId: string,
  status: string
): Promise<ApiResult<Order>> => {
  try {
    const res = await apiPatch<Order>(
      `/orders/order/payment-status/status/${orderId}`,
      { status }
    );
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al actualizar el payment-status");
  }
};

export const fetchDeliveryCompany = async (): Promise<
  ApiResult<ICompany[]>
> => {
  try {
    const res = await apiGet<ICompany[]>(`/delivery/companies`);
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error cargando delivery companies");
  }
};

export async function fetchAssignCompany(orderId: string, companyId: string) {
  try {
    const res = await apiPost(
      `/delivery/orders/${orderId}/assign-company/${companyId}`
    );
    return res.data;
  } catch (error: unknown) {
    throw handleApiError(error, "Error al asignar una compania delivery");
  }
}
