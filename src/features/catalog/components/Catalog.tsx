"use client";

import React, { useEffect } from "react";
import { useCatalg } from "../hooks/useCatalg";
import CatalogMenu from "./views/CatalogMenu";
import { useAuthStore } from "@/features/auth/store/authStore";
import BusinessHeader from "./views/BusinessHeader";
import { useBusinessProfile } from "../hooks/useBusiness";
import NewCatalogMenu from "./news/NewCatalogMenu";
import { MenuCreate } from "../types/catlog";
import { useMenuStore } from "../stores/menuStore";
import { getDisplayErrorMessage } from "@/lib/uiErrors"; // Asumiendo que tienes esta utilidad
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { useCreateMenu } from "../hooks/useMenuHooks";

interface Props {
  businessId: string;
}

export default function Catalog({ businessId }: Props) {
  const { addAlert } = useAlert();

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

  const createMenuMutation = useCreateMenu(businessId);

  useEffect(() => {
    if (data) {
      setMenus(data);
    }
  }, [data, setMenus]);

  // 💡 useEffect para manejar errores de carga (catálogo o negocio)
  useEffect(() => {
    if (isError) {
      addAlert({
        message: `Error al cargar el catálogo: ${getDisplayErrorMessage(
          error
        )}`,
        type: "error",
        duration: 8000,
      });
    }
    if (isErrorBusiness) {
      addAlert({
        message: `Error al cargar perfil de negocio: ${getDisplayErrorMessage(
          errorBusiness
        )}`,
        type: "error",
        duration: 8000,
      });
    }
  }, [isError, error, addAlert]);

  const handleAddMenu = async (menuCreate: MenuCreate) => {
    try {
      const newMenu = await createMenuMutation.mutateAsync(menuCreate);
      if (newMenu) {
        addMenu(newMenu);
        // Alerta de éxito al crear menú
        addAlert({
          message: `Menú "${newMenu.name}" creado con éxito.`,
          type: "success",
        });
      }
    } catch (err) {
      // 🎯 Usar Alerta para el error de API al crear menú
      addAlert({
        message: `No se pudo crear el menú: ${getDisplayErrorMessage(err)}`,
        type: "error",
      });
    }
  };

  if (isLoading || isLoadingBusiness) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 text-lg">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="pb-25">
      {dataBusiness && <BusinessHeader business={dataBusiness} />}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-16">
          {menus && menus.length > 0 ? (
            // Muestra las secciones si hay menús disponibles
            <>
              {menus.map((menu) => (
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
              <p className="mb-4">
                No hay catálogos o información de negocio disponible.
              </p>
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
