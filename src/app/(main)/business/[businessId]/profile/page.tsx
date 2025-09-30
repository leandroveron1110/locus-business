"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/features/common/ui/Loader/Loader";
import ErrorMessage from "@/features/common/ui/ErrorMessage/ErrorMessage";
import BackButton from "@/features/common/ui/BackButton/BackButton";
import { useBusinessProfile } from "@/features/business/hooks/useBusinessProfile";
import BusinessProfile from "@/features/business/components/BusinessProfile";
import Header from "@/features/header/components/Header";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

export default function DeliveryProfilePage() {
  const { businessId } = useParams<{ businessId: string }>();
  const { data, isLoading, error, isError } = useBusinessProfile(businessId);
  const { addAlert } = useAlert();

  useEffect(() => {
    if (isError && error) {
      addAlert({
        message: getDisplayErrorMessage(error),
        type: "error",
      });
    }
  }, [isError, error, addAlert]);


  const containerClass =
    "flex items-center justify-center min-h-screen bg-gray-50 p-4";

  if (!businessId) {
    return (
      <div className={containerClass}>
        <Loader message="Cargando perfil..." />
      </div>
    );
  }


  if (isLoading) {
    return (
      <div className={containerClass}>
        <Loader message="Cargando perfil..." />
      </div>
    );
  }

  if (isError) {
    // Ya mostramos el alert global, podés elegir si renderizar algo acá o dejarlo vacío
    return (
      <div className={containerClass}>
        <ErrorMessage message="Error al cargar perfil" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={containerClass}>
        <ErrorMessage message="Compañía no encontrada" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-xl mx-auto mb-6">
        <BackButton />
      </div>
      <BusinessProfile business={data} />
    </div>
  );
}
