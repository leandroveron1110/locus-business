"use client";

import { useParams } from "next/navigation";
import Loader from "@/features/common/ui/Loader/Loader";
import ErrorMessage from "@/features/common/ui/ErrorMessage/ErrorMessage";
import BackButton from "@/features/common/ui/BackButton/BackButton";
import { useBusinessProfile } from "@/features/business/hooks/useBusinessProfile";
import BusinessProfile from "@/features/business/components/BusinessProfile";

export default function DeliveryProfilePage() {
  const { businessId } = useParams<{ businessId: string }>();

  const containerClass =
    "flex items-center justify-center min-h-screen bg-gray-50 p-4";

  // Si todavía no hay businessId
  if (!businessId) {
    return (
      <div className={containerClass}>
        <Loader message="Cargando perfil..." />
      </div>
    );
  }

  const { data, isLoading, error, isError } = useBusinessProfile(businessId);

  if (isLoading)
    return (
      <div className={containerClass}>
        <Loader message="Cargando perfil..." />
      </div>
    );

  if (isError)
    return (
      <div className={containerClass}>
        <ErrorMessage message="Error al cargar perfil" />
      </div>
    );

  if (!data)
    return (
      <div className={containerClass}>
        <ErrorMessage message="Compañía no encontrada" />
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto mb-6">
        <BackButton />
      </div>
      <BusinessProfile business={data} />
    </div>
  );
}
