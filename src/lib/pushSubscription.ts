// utils/pushSubscription.ts

import { apiGet, apiPost } from "./apiFetch";

// --- Constantes de Almacenamiento ---
const VAPID_KEY_STORAGE = "push_vapid_public_key";
// ⚠️ Nueva clave de caché para el estado de suscripción de NEGOCIOS
export const BUSINESS_SUB_STATUS_STORAGE = "push_business_sub_ids"; 

// --- Interfaces (Se mantienen igual) ---
interface PushKeyResponse {
    publicKey: string;
}

interface SubscriptionResponse {
    success: boolean;
    // ... otros campos que tu backend pueda devolver
}

// --- Función Auxiliar (Se mantiene igual) ---
const urlBase64ToUint8Array = (base64String: string) => {
    // ... (función completa) ...
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

// 💡 Helper para verificar si dos arrays son iguales (ignorando el orden)
const arraysAreEquivalent = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) return false;
    // Creamos Sets para comparar eficientemente si tienen los mismos elementos
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    if (set1.size !== set2.size) return false;
    for (const item of set1) {
        if (!set2.has(item)) return false;
    }
    return true;
};


/**
 * Gestiona el registro del Service Worker y la suscripción a las notificaciones Push
 * para una lista de NEGOCIOS.
 * @param businessIds - Array de IDs de los negocios a los que el dispositivo debe suscribirse.
 * @param entityType - El tipo de entidad, debe ser 'BUSINESS'.
 */
export async function subscribeBusinessToPush(
    businessIds: string[], 
    entityType: 'BUSINESS' = 'BUSINESS' 
) {
    if (!businessIds || businessIds.length === 0) {
        console.warn(
            "Suscripción Push omitida: No se proporcionaron IDs de negocio para suscribir."
        );
        return;
    }

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn(
            "Este navegador no soporta Service Workers o Push Notifications."
        );
        return;
    }

    try {
        // 3. Manejo del estado de permisos (Se mantiene igual)
        // ... (Lógica de permisos: denied, requestPermission) ...
        const permission = Notification.permission;
        if (permission === "denied") {
            console.error("El usuario ha denegado las notificaciones. No se puede continuar.");
            return;
        }
        if (permission !== "granted") {
            const newPermission = await Notification.requestPermission();
            if (newPermission !== "granted") {
                console.error("Permiso de notificación denegado o no concedido.");
                return;
            }
        }
        
        // --- 🟢 OPTIMIZACIÓN 1: VERIFICAR ESTADO DE NEGOCIOS EN LOCALSTORAGE ---
        const storedBusinessIdsJSON = localStorage.getItem(BUSINESS_SUB_STATUS_STORAGE);

        if (storedBusinessIdsJSON) {
            try {
                const storedBusinessIds: string[] = JSON.parse(storedBusinessIdsJSON);
                
                // Si la lista de IDs actual es idéntica a la lista cacheada, SALIMOS.
                if (arraysAreEquivalent(businessIds, storedBusinessIds)) {
                    console.log("✅ Suscripción de Negocios ya registrada y actualizada. Omitiendo llamadas a la API.");
                    return;
                }
                console.log("⚠️ La lista de Negocios ha cambiado. Re-suscribiendo...");
            } catch (e) {
                console.error("Error al parsear el estado de suscripción de negocios de localStorage. Re-suscribiendo...");
                localStorage.removeItem(BUSINESS_SUB_STATUS_STORAGE); // Limpiar dato corrupto
            }
        }

        // --- 🟢 OPTIMIZACIÓN 2: Obtener la clave pública VAPID (con sessionStorage) ---
        let VAPID_PUBLIC_KEY = sessionStorage.getItem(VAPID_KEY_STORAGE);

        if (!VAPID_PUBLIC_KEY) {
            console.log("🔑 Obteniendo clave VAPID de la API.");
            const keyResponse = await apiGet<PushKeyResponse>("/push/key"); // ⚠️ AHORRO DE LLAMADA
            VAPID_PUBLIC_KEY = keyResponse.data?.publicKey ? keyResponse.data?.publicKey : null;

            if (!VAPID_PUBLIC_KEY) {
                console.error("No se pudo obtener la clave VAPID del servidor.");
                return;
            }
            sessionStorage.setItem(VAPID_KEY_STORAGE, VAPID_PUBLIC_KEY); // Guardar para la sesión
        } else {
            console.log("🔑 Clave VAPID recuperada de sessionStorage.");
        }


        // 5. Registrar el Service Worker (Se mantiene igual)
        const registration = await navigator.serviceWorker.register("/service-worker.js");

        // 6. Obtener o crear la suscripción en el navegador (Se mantiene igual)
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedKey,
            });
            console.log("Nueva suscripción de negocio creada.");
        } else {
            console.log("Suscripción de negocio existente encontrada. Actualizando.");
        }

        const subscriptionJSON = subscription.toJSON();
        
        // 7. Enviar la suscripción al backend (almacenamiento)
        const subscriptionDataToSend = {
            endpoint: subscriptionJSON.endpoint,
            keys: subscriptionJSON.keys,
            targetEntityIds: businessIds, 
            targetEntityType: entityType 
        };

        const postResponse = await apiPost<SubscriptionResponse>(
            "/push/subscribe", // ⚠️ AHORRO DE LLAMADA
            subscriptionDataToSend
        );

        if (postResponse.success) {
            console.log(`Dispositivo suscrito/actualizado con éxito a ${businessIds.length} negocios.`);
            
            // ✅ CRUCIAL: Guardar la lista de IDs actualizada en localStorage
            localStorage.setItem(
                BUSINESS_SUB_STATUS_STORAGE,
                JSON.stringify(businessIds)
            );
        } else {
            console.error(
                "El servidor falló al guardar la suscripción de negocio. Respuesta:",
                postResponse
            );
            // Si falla, removemos el estado para intentarlo de nuevo en la próxima carga
            localStorage.removeItem(BUSINESS_SUB_STATUS_STORAGE);
        }
    } catch (error) {
        console.error("Fallo grave en el proceso de suscripción Push de Negocio:", error);
        localStorage.removeItem(BUSINESS_SUB_STATUS_STORAGE);
    }
}