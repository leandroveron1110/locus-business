// src/hooks/useBusinessPushSubscription.ts

import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { subscribeBusinessToPush } from "../pushSubscription";

/**
 * Custom Hook para gestionar la suscripción a notificaciones Push de Negocios.
 * Se ejecuta solo en el cliente, cuando el estado de Zustand ha sido hidratado
 * y el usuario tiene IDs de negocio asociados.
 */
export function useBusinessPushSubscription() {
  // 1. 🟢 SELECCIÓN DE IDs DE NEGOCIO SEGÚN TU ESTRUCTURA:
  // Extraemos los IDs mapeando el array 'businesses' dentro del objeto 'user'.
  const { user } = useAuthStore();

  const businessIds = user?.businesses?.map((b) => b.id) || [];

  // 2. Seleccionar el estado de autenticación
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Variables de control de ambiente y estado de Zustand
  const [isClient, setIsClient] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Efecto 1: Verificar que estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Efecto 2: GESTIONAR LA HIDRATACIÓN de Zustand
  useEffect(() => {
    if (!isClient) return;

    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
      return;
    }

    const handleHydration = () => {
      setIsHydrated(true);
      console.log(
        "✅ Zustand Store hidratado. Listo para la suscripción de Negocios."
      );
    };

    useAuthStore.persist.onFinishHydration(handleHydration);
  }, [isClient]);

  // --- 🚀 EFECTO 3: GESTIONAR LA SUSCRIPCIÓN DE NEGOCIOS ---
  useEffect(() => {
    const hasBusiness = businessIds && businessIds.length > 0;

    // 🚀 Condición de Suscripción: Debe ser cliente, hidratado, autenticado y tener IDs.
    if (isClient && isHydrated && isAuthenticated && hasBusiness) {
      console.log(
        `🚀 useBusinessPushSubscription: Intentando suscribir a ${businessIds.length} negocios.`
      );

      // Llama a la función optimizada con la lista de IDs
      subscribeBusinessToPush(businessIds);
    }

    // 🔒 Manejo de limpieza al hacer logout o si se pierde el acceso a los negocios
    if (isClient && isHydrated && (!isAuthenticated || !hasBusiness)) {
      // Solo limpiamos la caché si ya estábamos autenticados/hidratados
      console.log(
        "🔒 Usuario desconectado o sin negocios. Limpiando bandera de suscripción local."
      );
      localStorage.removeItem("push_business_sub_ids");
    }

    // ⚠️ Dependencia crucial: 'businessIds' es un array. La re-evaluación es vital si la lista cambia.
  }, [isClient, isHydrated, isAuthenticated, businessIds]);

  return null;
}
