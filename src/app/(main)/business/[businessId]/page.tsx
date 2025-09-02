"use client";

import BusinessDashboard from "@/features/BusinessDashboard/BusinessDashboard";
import BackButton from "@/features/common/ui/BackButton/BackButton";
import { useParams } from "next/navigation";

export default function BusinessPage() {
  const params = useParams<{ businessId: string }>();
  const businessId = params.businessId;

  if (!businessId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Business no encontrado</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-6">
        <BackButton />
      </div>
      <BusinessDashboard businessId={businessId} />
      {/* Podés agregar más componentes que reciban businessId aquí */}
    </div>
  );
}
