"use client";

import { useRouter } from "next/navigation";
import { Package, ShoppingCart, Settings, Users, Shield } from "lucide-react"; 


interface Props {
  businessId: string;
}

export default function BusinessDashboard({ businessId }: Props) {
  const router = useRouter();

  return (
    <main className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
      <section className="bg-white rounded-3xl shadow-lg p-8 sm:p-12 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center sm:text-left">
          Panel de negocio
        </h1>
        <p className="text-gray-600 text-center sm:text-left">
          Gestiona tu negocio fácilmente desde aquí.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <button
            onClick={() => router.push(`/business/${businessId}/orders`)}
            className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-2xl shadow hover:bg-blue-100 transition"
          >
            <ShoppingCart className="w-10 h-10 text-blue-600 mb-3" />
            <span className="text-lg font-semibold text-gray-800">Órdenes</span>
            <p className="text-sm text-gray-500">Revisa y gestiona pedidos</p>
          </button>

          <button
            onClick={() => router.push(`/business/${businessId}/products`)}
            className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-2xl shadow hover:bg-green-100 transition"
          >
            <Package className="w-10 h-10 text-green-600 mb-3" />
            <span className="text-lg font-semibold text-gray-800">
              Productos
            </span>
            <p className="text-sm text-gray-500">Administra tu menú/catálogo</p>
          </button>

          <button
            onClick={() => router.push(`/business/${businessId}/profile`)}
            className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-2xl shadow hover:bg-purple-100 transition"
          >
            <Settings className="w-10 h-10 text-purple-600 mb-3" />
            <span className="text-lg font-semibold text-gray-800">Perfil</span>
            <p className="text-sm text-gray-500">Edita la info de tu negocio</p>
          </button>

          <button
            onClick={() => router.push(`/business/${businessId}/employees`)}
            className="flex flex-col items-center justify-center p-6 bg-orange-50 rounded-2xl shadow hover:bg-orange-100 transition"
          >
            <Users className="w-10 h-10 text-orange-600 mb-3" />
            <span className="text-lg font-semibold text-gray-800">
              Empleados
            </span>
            <p className="text-sm text-gray-500">Gestiona roles y permisos</p>
          </button>

          {/* NUEVO BOTÓN PARA ROLES */}
          <button
            onClick={() => router.push(`/business/${businessId}/roles`)}
            className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-2xl shadow hover:bg-red-100 transition"
          >
            <Shield className="w-10 h-10 text-red-600 mb-3" />
            <span className="text-lg font-semibold text-gray-800">Roles</span>
            <p className="text-sm text-gray-500">Administra roles y permisos</p>
          </button>
        </div>
      </section>
    </main>
  );
}
