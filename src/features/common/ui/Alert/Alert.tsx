"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { X } from "lucide-react";

export type AlertType = "success" | "error" | "info";

export interface AlertData {
  id: string;
  message: string;
  type?: AlertType;
  duration?: number; // ms, opcional para autodestruir
}

interface AlertContextProps {
  addAlert: (alert: Omit<AlertData, "id">) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert debe usarse dentro de AlertProvider");
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

// 💡 Duración por defecto para los toasts (5 segundos)
const DEFAULT_DURATION = 5000;

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);

  const addAlert = (alert: Omit<AlertData, "id">) => {
    const id = crypto.randomUUID();

    // 💡 Determina la duración: usa la duración provista o el valor por defecto
    const autoCloseDuration = alert.duration ?? DEFAULT_DURATION;

    const newAlert: AlertData = {
      ...alert,
      id,
      // Almacenamos la duración real para futura referencia si fuera necesario
      duration: autoCloseDuration,
    };

    setAlerts((prev) => [...prev, newAlert]);
    // 🎯 Siempre establecemos el setTimeout usando la duración determinada
    setTimeout(() => removeAlert(id), autoCloseDuration);
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AlertContext.Provider value={{ addAlert, removeAlert }}>
      {children}

      {/* Contenedor de alertas en pantalla */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {alerts.map((alert) => {
          const bgColor =
            alert.type === "success"
              ? "bg-green-100"
              : alert.type === "error"
              ? "bg-red-100"
              : "bg-blue-100";

          const textColor =
            alert.type === "success"
              ? "text-green-800"
              : alert.type === "error"
              ? "text-red-800"
              : "text-blue-800";

          return (
            <div
              key={alert.id}
              className={`${bgColor} ${textColor} p-4 rounded-lg shadow flex items-start justify-between min-w-[250px]`}
            >
              <p className="text-sm">{alert.message}</p>
              {/* El botón de cerrar sigue funcionando para que el usuario pueda cerrarla manualmente */}
              <button onClick={() => removeAlert(alert.id)} className="ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </AlertContext.Provider>
  );
};
