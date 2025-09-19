"use client";

import Catalog from "@/features/catalog/components/Catalog";
import BackButton from "@/features/common/ui/BackButton/BackButton";
import Loader from "@/features/common/ui/Loader/Loader";
import Header from "@/features/header/components/Header";
import { useParams } from "next/navigation";

export default function BusinessCatalogPage() {
  const params = useParams();
  const businessIdRaw = params.businessId;

  // businessId puede ser string | string[] | undefined
  const businessId = Array.isArray(businessIdRaw) ? businessIdRaw[0] : businessIdRaw;

  if (!businessId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <Loader message="Cargando catálogo..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="max-w-4xl mx-auto mb-6">
        <BackButton />
      </div>
      <Catalog businessId={businessId} />
    </div>
  );
}
