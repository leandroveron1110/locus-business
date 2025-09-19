// src/components/Header.tsx
import { useAuthStore } from "@/features/auth/store/authStore";
import { ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { user, logout } = useAuthStore();
  const [selectedBusiness, setSelectedBusiness] = useState(
    user?.businesses?.[0] ?? null
  );

  if (!user) return null; // Si no hay usuario, no renderizamos el header

  return (
    <header className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between">
      {/* 👤 Usuario */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-xs text-gray-500">
            Rol global: <strong>{user.role}</strong>
          </span>
        </div>
      </div>

      {/* 🏪 Negocios (si existen) */}
      {user.businesses && user.businesses.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">Negocio:</span>
          <div className="relative">
            <button
              onClick={() => {
                if (user.businesses && user.businesses.length === 1) return;
                // Aquí podrías abrir un dropdown si hay varios negocios
              }}
              className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded-lg text-sm bg-gray-50 hover:bg-gray-100"
            >
              {selectedBusiness?.role}
              {user.businesses.length > 1 && <ChevronDown size={16} />}
            </button>
          </div>
        </div>
      )}

      {/* 🚪 Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
      >
        <LogOut size={16} />
        Salir
      </button>
    </header>
  );
}
