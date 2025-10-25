"use client";
import {
  NotificationType,
  useBusinessNotificationsStore,
} from "@/features/common/hooks/useBusinessNotificationsStore";
import { Bell, MessageCircle, Package, ShoppingCart, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import React from 'react';

interface Props {
  text: string;
}

export const TextWithLineBreaks: React.FC<Props> = ({ text }) => {
  // 1. Dividir el texto en un array usando el salto de línea (\n) como separador.
  const lines = text.split('\n');

  // 2. Mapear el array para renderizar cada línea, seguida de un <br />
  return (
    <>
      {lines.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {/* Añadir <br /> al final de todas las líneas excepto la última */}
          {index < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};


interface NotificationsBellProps {
  businessId: string;
}

export function NotificationsBell({ businessId }: NotificationsBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Asumimos que getNotifications está definido en tu store y devuelve el array filtrado.
  const { getNotifications } = useBusinessNotificationsStore(); 
  const notifications = getNotifications(businessId);
  const count = notifications.length;
  const router = useRouter();

  // --- Funciones de Ayuda ---

  // Retorna el ícono basado en el tipo de notificación
  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case "NEW_ORDER":
        return <ShoppingCart size={14} className="text-blue-500" />;
      case "STOCK_LOW":
        return <Package size={14} className="text-red-500" />;
      case "NEW_MESSAGE":
        return <MessageCircle size={14} className="text-green-500" />;
      default:
        return null;
    }
  };

  // Maneja la navegación al hacer clic en una notificación
  const handleNavigation = (type: NotificationType) => {
    setIsOpen(false); // Cierra el menú después de hacer clic
    
    let path = `/business/${businessId}/`;
    
    switch (type) {
        case "NEW_ORDER":
            path += 'orders';
            break;
        case "STOCK_LOW":
            path += 'products'; // Asumiendo que las alertas de stock llevan a la vista de productos
            break;
        case "NEW_MESSAGE":
            path += 'messages'; // O la ruta a tu bandeja de mensajes
            break;
        default:
            path += 'dashboard';
    }
    
    router.push(path);
  };

  
  return (
    <div className="relative">
      
      {/* Botón de la Campana */}
      <div
        className="cursor-pointer hover:bg-gray-100 p-1 rounded-full transition-colors"
        onClick={() => setIsOpen(!isOpen)} 
      >
        <Bell className="w-5 h-5 text-gray-700" />

        {/* Badge de Notificaciones */}
        {count > 0 && (
          <span
            className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 
              flex items-center justify-center w-4 h-4 text-[10px] font-extrabold text-white 
              bg-red-600 rounded-full shadow-md"
          >
            {count > 9 ? "9+" : count}
          </span>
        )}
      </div>

      {/* Menú Desplegable (Dropdown) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-150">
          
          {/* Encabezado del Menú */}
          <div className="p-3 flex justify-between items-center border-b border-gray-100">
            <h5 className="text-sm font-semibold text-gray-800">
              Notificaciones ({businessId.slice(0, 4)}...)
            </h5>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>

          {/* Lista de Notificaciones */}
          <div className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 text-sm p-4">
                No hay notificaciones nuevas.
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  // 💡 Implementación de navegación específica por tipo
                  onClick={() => handleNavigation(n.type)} 
                  className="p-3 border-b border-gray-100 hover:bg-gray-50 flex items-start gap-2 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getIconForType(n.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0"> 
                    <p className="text-xs font-medium text-gray-900 line-clamp-2 whitespace-normal break-words">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      {new Date(n.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pie de Página (Ver todas) */}
          {notifications.length > 0 && (
            <div className="p-2 border-t border-gray-100">
              <button
                onClick={() => handleNavigation("NEW_ORDER")} // Navega a la vista principal de órdenes
                className="w-full text-center text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}