"use client";

import React, { useEffect } from "react";
import { useCatalg } from "../hooks/useCatalg";
import CatalogMenu from "./views/CatalogMenu";
import { useAuthStore } from "@/features/auth/store/authStore";
import BusinessHeader from "./views/BusinessHeader";
import { useBusinessProfile } from "../hooks/useBusiness";
import NewCatalogMenu from "./news/NewCatalogMenu";
import { MenuCreate } from "../types/catlog";
import { useCreateMenu } from "../hooks/useMenuHooks";
import { useMenuStore } from "../stores/menuStore";

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

  const menus = useMenuStore((state) => state.menus);
  const setMenus = useMenuStore((state) => state.setMenus);
  const addMenu = useMenuStore((state) => state.addMenu);

  const createMenuMutation = useCreateMenu();

  useEffect(() => {
    if (data) setMenus(data);
  }, [data, setMenus]);

  const handleAddMenu = async (menuCreate: MenuCreate) => {
    try {
      const newMenu = await createMenuMutation.mutateAsync(menuCreate);
      addMenu(newMenu);
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

  return (
    <div className="pb-25">
     {dataBusiness && (<BusinessHeader business={dataBusiness} />)} 
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-16">
          {menus && menus.length > 0 ? (
            // Muestra las secciones si hay menús disponibles
            <>
              {(menus).map((menu) => (
                <CatalogMenu
                  key={menu.id}
                  businessId={businessId}
                  menuId={menu.id}
                  ownerId={user?.id || ""}
                />
              ))}
              <NewCatalogMenu
                businessId={businessId}
                ownerId={user?.id || ""}
                onAddMenu={handleAddMenu}
              />
            </>
          ) : (
            // Muestra solo el componente de creación si no hay menús
            <div className="text-center py-20 text-gray-600">
              <p className="mb-4">No hay catálogos o información de negocio disponible.</p>
              <NewCatalogMenu
                businessId={businessId}
                ownerId={user?.id || ""}
                onAddMenu={handleAddMenu}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}