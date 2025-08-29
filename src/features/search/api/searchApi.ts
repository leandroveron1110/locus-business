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


export interface Business {
  id: string;
  name: string;
  address: string;
  description: string;
}


export const getBusinessesByIds = async (ids: string[]): Promise<Business[]> => {
  try {
    const response = await api.post<Business[]>("/businesses/businesses/ids/", { ids });
    return response.data;
  } catch (error: any) {
    throw error.response?.data as ApiErrorResponse || new Error("Error fetching businesses");
  }
};