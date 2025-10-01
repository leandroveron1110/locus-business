// src/components/common/BackButton.jsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    // Usar window.history.back() a veces es más robusto que router.back()
    // si quieres asegurar que siempre vuelve al historial del navegador.
    // Mantendré router.back() por ser de Next.js.
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="
        p-2 w-10 h-10
        bg-white         text-gray-700 
        rounded-full 
        shadow-md 
        hover:bg-gray-100 hover:text-blue-600 
        transition-all duration-200
        flex items-center justify-center 
      "
      aria-label="Volver a la página anterior"
      title="Volver"
    >
      {/* Icono más grande (opcional) o centrado */}
      <ArrowLeft className="w-5 h-5" aria-hidden="true" />
      {/* Eliminamos el <span>Volver</span> para hacerlo más compacto */}
    </button>
  );
}