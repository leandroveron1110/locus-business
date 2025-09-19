"use client";

import BackButton from "@/features/common/ui/BackButton/BackButton";
import Header from "@/features/header/components/Header";
import Order from "@/features/order/components/Order";
import { useParams } from "next/navigation";

export default function BusinessCatalog() {
  const params = useParams();
  const businessIdRaw = params.businessId;

  // businessId puede ser string | string[] | undefined
  const businessId = Array.isArray(businessIdRaw) ? businessIdRaw[0] : businessIdRaw;

  if (!businessId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <p>Negocio no encontrado</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="max-w-4xl mx-auto mb-6">
        <BackButton />
      </div>
      <div className="max-w-4xl mx-auto">
        <Order businessId={businessId} />
      </div>
    </div>
  );
}
