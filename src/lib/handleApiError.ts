// src/utils/handleApiError.ts (Versión Mejorada)

import { ApiError, ApiResponse } from "@/types/api"; // Tu interfaz ApiError de frontend
import { AxiosError } from "axios";

// Helper para validar si un objeto es tu ApiError de frontend
const isApiError = (e: any): e is ApiError =>
  typeof e === "object" &&
  e !== null &&
  "statusCode" in e &&
  "message" in e &&
  "path" in e;


export const handleApiError = (
  error: unknown,
  defaultMessage: string
): ApiError => {
  // 1. Manejo de errores de Axios (respuestas con código HTTP != 2xx)
  if (error instanceof AxiosError && error.response) {
    // Intentamos extraer la estructura ApiResponse<T> del cuerpo de la respuesta
    const apiResponseData: ApiResponse<unknown> = error.response.data;

    // A. Comprobamos si el backend nos devolvió el objeto de error esperado
    if (apiResponseData && apiResponseData.error) {
      const backendError = apiResponseData.error;

      // Usamos el helper isApiError para asegurar la estructura (aunque el backend debería cumplirla)
      if (isApiError(backendError)) {
        return backendError;
      }
    }

    // B. Si la respuesta de Axios existe, pero no tiene el objeto 'error' (ej: error 500 genérico, o un error no mapeado por el backend)
    return {
      statusCode: error.response?.status ?? 500,
      // Usar el mensaje del backend si existe, sino el mensaje por defecto
      message: (apiResponseData as any)?.message || defaultMessage, 
      timestamp: new Date().toISOString(),
      path: error.config?.url ?? window.location.pathname,
    };
  }
  
  // 2. Manejo de errores que no son de Axios (ej: errores de red, throw local, etc.)
  // Si ya tenemos un objeto que parece un ApiError, lo devolvemos.
  if (isApiError(error)) {
    return error;
  }

  // 3. Caso por defecto (error desconocido)
  return {
    statusCode: 500,
    message: defaultMessage, // Mensaje genérico de fallback
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
  };
};