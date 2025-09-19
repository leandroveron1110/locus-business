"use client";

import BackButton from "@/features/common/ui/BackButton/BackButton";
import Loader from "@/features/common/ui/Loader/Loader";
import Header from "@/features/header/components/Header";
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
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
          <Header />
          <div className="max-w-4xl mx-auto mb-6">
            <BackButton />
          </div>
          <h1 className="text-2xl font-bold mb-4">Crear Nuevo Rol</h1>
          <RoleManager businessId={businessId} />
        </div>
  );
}
