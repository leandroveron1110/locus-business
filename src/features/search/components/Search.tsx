"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import { useBusinesses } from "../hooks/useBusinesses";
import { withSkeleton } from "@/features/common/utils/withSkeleton";
import SearchBusinessListSkeleton from "./skeleton/SearchBusinessListSkeleton";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { useEffect } from "react";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
import { useInitialNotificationLoad } from "../hooks/useInitialNotificationLoad";

const DynamicSearchBusinessList = withSkeleton(
  () => import("./SearchBusinessList"),
  SearchBusinessListSkeleton
);

export default function SearchPage() {
  const { user } = useAuthStore();

  const businessIds = user?.businesses?.map((b) => b.id) || [];
  const { data, isLoading, isError, error } = useBusinesses(businessIds);

  useInitialNotificationLoad(businessIds);

  const { addAlert } = useAlert();

  useEffect(() => {
    if (isError) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  }, [isError, error, addAlert]);


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
  

  // Comentado/Eliminado porque el useEffect se encarga de la redirección
  if (!data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">No tienes negocios asociados</p>
      </div>
    );
  }

  
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