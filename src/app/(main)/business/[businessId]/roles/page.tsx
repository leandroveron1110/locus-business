"use client";

import Loader from "@/features/common/ui/Loader/Loader";
import { RoleManager } from "@/features/roles/components/RoleManager";
import { useParams } from "next/navigation";

export default function RolePage() {
  const { businessId } = useParams<{ businessId: string }>();

  const containerClass = "flex items-center justify-center min-h-screen bg-gray-50 p-4";

  if (!businessId) {
    return (
      <div className={containerClass}>
        <Loader message="Cargando roles..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Crear Nuevo Rol</h1>
      <RoleManager businessId={businessId} />
    </div>
  );
}
