"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import { useBusinesses } from "../hooks/useBusinesses";
import { withSkeleton } from "@/features/common/utils/withSkeleton";
import SearchBusinessListSkeleton from "./skeleton/SearchBusinessListSkeleton";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { useEffect } from "react";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
// 1. Importar el hook de router de Next.js
import { useRouter } from "next/navigation"; // Asegúrate de que esta sea la importación correcta para tu versión de Next.js (app router)

const DynamicSearchBusinessList = withSkeleton(
  () => import("./SearchBusinessList"),
  SearchBusinessListSkeleton
);

export default function SearchPage() {
  const { user } = useAuthStore();
  // Inicializar el router
  const router = useRouter(); 

  const businessIds = user?.businesses?.map((b) => b.id) || [];
  const { data, isLoading, isError, error } = useBusinesses(businessIds);

  const { addAlert } = useAlert();

  useEffect(() => {
    if (isError) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  }, [isError, error, addAlert]);

  // **2. Añadir useEffect para manejar la redirección si no hay negocios
  //    (Es más seguro hacerlo en un useEffect para evitar problemas de rendering,
  //     aunque también se podría hacer en la lógica de renderizado condicional con un return).**
  useEffect(() => {
    // Si no está cargando, no hay error Y NO HAY datos O la lista de datos está vacía
    if (!isLoading && !isError && (!data || data.data.length === 0)) {
        // Redirigir al login. Ajusta la ruta a la de tu login real.
        // También puedes redirigir a una página de "Crear Negocio" si es más apropiado.
        router.push("/login"); 
    }
  }, [isLoading, isError, data, router]); // Dependencias para re-evaluar

  // ---

  // La lógica de `isLoading` y `isError` se mantiene igual.

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Cargando negocios...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error cargando negocios</p>
      </div>
    );
  }

  // **3. Eliminar el bloque de "No tienes negocios asociados"
  //    porque la redirección ya se maneja en el `useEffect` de arriba
  //    para que ocurra tan pronto como se determine la ausencia de negocios.**
  
  /*
  // Comentado/Eliminado porque el useEffect se encarga de la redirección
  if (!data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">No tienes negocios asociados</p>
      </div>
    );
  }
  */
  
  // Como el `useEffect` ya ha empujado al `/login` si no hay datos, si el flujo llega aquí,
  // sabemos que `data` existe y tiene elementos.
  if (!data || data.data.length === 0) {
    // Retornar null o un indicador temporal mientras el router hace la redirección
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Redirigiendo...</p>
      </div>
    );
  }


  // ---

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mt-6">
        <DynamicSearchBusinessList businesses={data.data} />
      </div>
    </div>
  );
}