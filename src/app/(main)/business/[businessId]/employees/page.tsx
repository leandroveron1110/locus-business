"use client";

// src/app/business/employees/new/page.tsx
import BackButton from "@/features/common/ui/BackButton/BackButton";
import Loader from "@/features/common/ui/Loader/Loader";
import { EmployeesContainer } from "@/features/employees/components/EmployeesContainer";
import Header from "@/features/header/components/Header";
import { Metadata } from "next";
import { useParams } from "next/navigation";

export default function NewEmployeePage() {
    const { businessId } = useParams<{ businessId: string }>();
  
    const containerClass = "flex items-center justify-center min-h-screen bg-gray-50 p-4";
  
    if (!businessId) {
      return (
        <div className={containerClass}>
          <Loader message="Cargando ..." />
        </div>
      );
    }
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="max-w-xl mx-auto mb-6">
        <BackButton />
      </div>
      <EmployeesContainer businessId={businessId} />
    </div>
  );
}
