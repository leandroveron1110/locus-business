// src/utils/handleApiError.ts (Versión Mejorada)

import { ApiError, ApiResponse } from "@/types/api"; 
import { AxiosError } from "axios";

// Helper para validar si un objeto es tu ApiError de frontend
const isApiError = (e: unknown): e is ApiError =>
  typeof e === "object" &&
  e !== null &&
  "statusCode" in e &&
  "message" in e &&
  "path" in e;

export const handleApiError = (
  error: unknown,
  defaultMessage: string
): ApiError & { contextMessage?: string } => {
  // 1. Manejo de errores de Axios (respuestas con código HTTP != 2xx)
  if (error instanceof AxiosError && error.response) {
    const apiResponseData: ApiResponse<unknown> = error.response.data;

    // A. El backend devolvió el objeto de error esperado
    if (apiResponseData && apiResponseData.error) {
      const backendError = apiResponseData.error;

      if (isApiError(backendError)) {
        return {
          ...backendError,
          contextMessage: defaultMessage,
        };
      }
    }

    // B. Axios devolvió algo pero no en el formato esperado
    return {
      statusCode: error.response?.status ?? 500,
      message: (apiResponseData as any)?.message || defaultMessage,
      contextMessage: defaultMessage,
      timestamp: new Date().toISOString(),
      path: error.config?.url ?? window.location.pathname,
    };
  }

  // 2. Errores que no son de Axios
  if (isApiError(error)) {
    return {
      ...error,
      contextMessage: defaultMessage,
    };
  }

  // 3. Error desconocido
  return {
    statusCode: 500,
    message: defaultMessage,
    contextMessage: defaultMessage,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
  };
};
