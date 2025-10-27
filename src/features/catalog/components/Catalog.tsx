"use client";

import React, { useEffect } from "react";
import { useCatalg } from "../hooks/useCatalg";
import CatalogMenu from "./views/CatalogMenu";
import { useAuthStore } from "@/features/auth/store/authStore";
import NewCatalogMenu from "./news/NewCatalogMenu";
import { IMenu, MenuCreate } from "../types/catlog";
import { useMenuStore } from "../stores/menuStore";
import { getDisplayErrorMessage } from "@/lib/uiErrors"; // Asumiendo que tienes esta utilidad
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { useCreateMenu } from "../hooks/useMenuHooks";
import { generateTempId } from "@/features/common/utils/utilities-rollback";

interface Props {
  businessId: string;
}

export default function Catalog({ businessId }: Props) {
  const { addAlert } = useAlert();

  const { data, isLoading, isError, error } = useCatalg(businessId);

  const user = useAuthStore((state) => state.user);

  const menus = useMenuStore((state) => state.menus);
  const setMenus = useMenuStore((state) => state.setMenus);
  const replaceTempId = useMenuStore((state) => state.replaceTempId);
  const addMenu = useMenuStore((state) => state.addMenu);
  const deleteMenu = useMenuStore((state) => state.deleteMenu);

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
  }, [isError, error, addAlert]);

  const handleAddMenu = async (menuCreate: MenuCreate) => {
    const tempId = generateTempId();

    const optimisticMenu: IMenu = {
      id: tempId,
      businessId: menuCreate.businessId,
      name: menuCreate.name,
      sections: [],
    };

    addMenu(optimisticMenu);

    try {
      const newMenu = await createMenuMutation.mutateAsync(menuCreate);

      if (newMenu && newMenu.id) {
        replaceTempId("menu", {}, tempId, newMenu.id);

        // 6. Notificar Éxito
        addAlert({
          message: `Menú "${newMenu.name}" creado con éxito.`,
          type: "success",
        });
      } else {
        addAlert({
          message: `API no devolvió el ID real del menú.`,
          type: "error",
        });
        deleteMenu(tempId);
      }
    } catch (err) {
      deleteMenu(tempId);
      addAlert({
        message: `No se pudo crear el menú: ${getDisplayErrorMessage(err)}`,
        type: "error",
      });
    }
  };

  if (isLoading ) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-gray-500 text-lg">Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="pb-25">
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
