// src/components/ErrorMessage.tsx (Mejorado)
import React from "react";
import { ApiError } from "@/types/api";

interface ErrorMessageProps {
  error: ApiError;
  onRetry?: () => void;
}

export const Error: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  let userMessage: string | string[];

  // 1. Priorizar el mensaje del backend si existe
  if (error.message) {
    userMessage = error.message;
  } else {
    // 2. Usar un mensaje amigable por defecto basado en el statusCode
    switch (error.statusCode) {
      case 400:
        userMessage = "La solicitud es inválida o tiene datos incorrectos.";
        break;
      case 401:
        userMessage = "Debes iniciar sesión para continuar (No autorizado).";
        break;
      case 403:
        userMessage = "No tenés permisos para acceder a esta información (Prohibido).";
        break;
      case 404:
        userMessage = "No se encontró el recurso solicitado.";
        break;
      case 500:
        userMessage = "Ocurrió un error interno en el servidor. Intentalo más tarde.";
        break;
      default:
        userMessage = "Ocurrió un error inesperado al consultar la API.";
        break;
    }
  }

  // Manejar el caso donde `error.message` es un array de strings (común en validaciones 400)
  const messagesToDisplay = Array.isArray(userMessage)
    ? userMessage
    : [userMessage];


  return (
    <div className="text-center p-4 bg-red-50 border border-red-200 rounded-xl shadow-md" role="alert">
      <p className="text-red-600 font-bold mb-2">
        ⚠️ Error ({error.statusCode})
      </p>
      {/* Mostrar todos los mensajes relevantes */}
      {messagesToDisplay.map((msg, index) => (
        <p key={index} className="text-red-600 mb-1">
          {msg}
        </p>
      ))}

      {/* Opcional: Mostrar información técnica solo si es necesario, quizás en un `details` */}
      {/* <details className="mt-2 text-sm text-red-500">
        <summary>Detalles Técnicos</summary>
        <p>Path: {error.path}</p>
        <p>Timestamp: {new Date(error.timestamp).toLocaleString()}</p>
      </details> */}
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};