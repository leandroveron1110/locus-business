// src/app/business/employees/new/page.tsx
import BackButton from "@/features/common/ui/BackButton/BackButton";
import { EmployeesContainer } from "@/features/employees/components/EmployeesContainer";
import Header from "@/features/header/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Empleado",
  description: "Página para crear nuevos empleados y asignar roles de negocio.",
};

export default function NewEmployeePage() {
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="max-w-xl mx-auto mb-6">
        <BackButton />
      </div>
      <EmployeesContainer />
    </div>
  );
}
