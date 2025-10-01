"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import Loader from "@/features/common/ui/Loader/Loader";
import ErrorMessage from "@/features/common/ui/ErrorMessage/ErrorMessage";
import BackButton from "@/features/common/ui/BackButton/BackButton"; // El BackButton circular
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

  // Se simplifica la lógica de carga/error/no-ID para evitar duplicar el Header

  if (!businessId) {
    // Podríamos usar el mismo layout de renderizado final para consistencia
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-60px)] bg-gray-50 p-4">
          <Loader message="ID de negocio no proporcionado." />
        </div>
      </>
    );
  }

  // Se encapsula el contenido de carga/error en un layout consistente
  const renderContent = () => {
    if (isLoading) {
      return <Loader message="Cargando perfil..." />;
    }

    if (isError) {
      return (
        <ErrorMessage message="Error al cargar perfil. Intenta de nuevo más tarde." />
      );
    }

    if (!data) {
      return <ErrorMessage message="Compañía no encontrada." />;
    }

    // Si la data está OK, se renderiza el perfil
    return <BusinessProfile business={data} />;
  };

  return (
    <>
      <Header />
      <div className="bg-gray-50 min-h-[calc(100vh-60px)] pt-4 pb-12 relative">
        <div className="ml-4 mb-4">
          <BackButton />
        </div>
        <div className="">{renderContent()}</div>
      </div>
    </>
  );
}
