// src/features/search/api/searchApi.ts
import api from "../../../lib/api"; // Importa la instancia de Axios configurada
import {
  ISearchBusinessParams,
  ISearchBusiness,
} from "../types/search";
import {  ApiErrorResponse } from "../../../types/api";

export const fetcSearchBusiness = async (
  params?: ISearchBusinessParams
): Promise<ISearchBusiness> => {
  try {
    const response = await api.get<ISearchBusiness>(`/search/businesses`, {
      params,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error searching businesses:", error);
    throw (
      (error.response?.data as ApiErrorResponse) ||
      new Error("Error desconocido al buscar negocios.")
    );
  }
};