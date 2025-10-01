"use client";

// src/app/business/employees/new/page.tsx
import BackButton from "@/features/common/ui/BackButton/BackButton";
import Loader from "@/features/common/ui/Loader/Loader";
import { EmployeesContainer } from "@/features/employees/components/EmployeesContainer";
import Header from "@/features/header/components/Header";
import { useParams } from "next/navigation";

export default function NewEmployeePage() {
  const { businessId } = useParams<{ businessId: string }>();

  const containerClass =
    "flex items-center justify-center min-h-screen bg-gray-50 p-4";

  if (!businessId) {
    return (
      <div className={containerClass}>
        <Loader message="Cargando ..." />
      </div>
    );
  }
  return (
    <>
      <Header />

      <div className="bg-gray-50 min-h-[calc(100vh-60px)] pt-4 pb-12 relative">
        <div className="ml-4 mb-4">
          <BackButton />
        </div>
        <EmployeesContainer businessId={businessId} />
      </div>
    </>
  );
}
