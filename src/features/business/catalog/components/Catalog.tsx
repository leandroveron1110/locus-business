// app/components/Catalog.tsx
"use client";

import React from "react";
import { useCatalg } from "../hooks/useCatalg";
import CatalogMenu from "./CatalogMenu";
import { useAuthStore } from "@/features/auth/store/authStore";
import BusinessHeader from "./BusinessHeader"; // Importa el nuevo componente de encabezado
import { useBusinessProfile } from "../hooks/useBusiness";

interface Props {
  businessId: string;
}

export default function Catalog({ businessId }: Props) {
  const { data, isLoading, isError, error } = useCatalg(businessId);
    const {
    data: dataBusiness,
    isLoading: isLoadingBusiness,
    isError: isErrorBusiness,
    error: errorBusiness,
  } = useBusinessProfile(businessId);

  const user = useAuthStore((state) => state.user);

  if (isLoading || isLoadingBusiness) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 text-lg">Cargando catálogo...</p>
      </div>
    );
  }

  if (isError || isErrorBusiness) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-red-600 text-lg">
          Error al cargar la información:{" "}
          {(error || (errorBusiness as Error))?.message}
        </p>
      </div>
    );
  }

  // Asegúrate de que tanto el catálogo como los datos del negocio estén disponibles
  if (!data || data.length === 0 || !dataBusiness) {
    return (
      <div className="text-center py-20 text-gray-600">
        <p>No hay catálogos o información de negocio disponible.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Coloca el encabezado del negocio antes del contenedor principal */}
      <BusinessHeader business={dataBusiness} />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Columna izquierda: Catálogo */}
        <div className="flex-1 space-y-16">
          {data.map((menu) => (
            <CatalogMenu key={menu.id} menu={menu} ownerId={user?.id || "" } />
          ))}
        </div>
      </div>
    </div>
  );
}
