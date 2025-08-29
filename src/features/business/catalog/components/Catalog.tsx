"use client";

import React, { useEffect, useState } from "react";
import { useCatalg } from "../hooks/useCatalg";
import CatalogMenu from "./CatalogMenu";
import { useAuthStore } from "@/features/auth/store/authStore";
import BusinessHeader from "./BusinessHeader";
import { useBusinessProfile } from "../hooks/useBusiness";
import NewCatalogMenu from "./news/NewCatalogMenu";
import { IMenu, MenuCreate } from "../types/catlog";
import { useCreateMenu } from "../hooks/useMenuHooks";

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

  // Estado local de menús
  const [allMenus, setAllMenus] = useState<IMenu[]>(data || []);

  // Hook para crear menú
  const createMenuMutation = useCreateMenu();

  useEffect(() => {
    if (data) setAllMenus(data);
  }, [data]);

  // Función que se pasa a NewCatalogMenu
  const handleAddMenu = async (menuCreate: MenuCreate) => {
    try {
      const newMenu = await createMenuMutation.mutateAsync(menuCreate);
      // Actualizamos el estado local para reflejar el cambio
      setAllMenus((prev) => [...prev, newMenu]);
    } catch (err) {
      console.error("Error creando el menú:", err);
    }
  };

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

  if (!allMenus || allMenus.length === 0 || !dataBusiness) {
    return (
      <div className="text-center py-20 text-gray-600">
        <p>No hay catálogos o información de negocio disponible.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BusinessHeader business={dataBusiness} />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-16">
          {allMenus.map((menu) => (
            <CatalogMenu
              key={menu.id}
              businessId={businessId}
              menu={menu}
              ownerId={user?.id || ""}
            />
          ))}

          <NewCatalogMenu
            businessId={businessId}
            ownerId={user?.id || ""}
            onAddMenu={handleAddMenu}
          />
        </div>
      </div>
    </div>
  );
}
