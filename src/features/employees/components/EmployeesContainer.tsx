"use client";
import { RoleManager } from "@/features/roles/components/RoleManager";
import { EmployeeList } from "./EmployeeList";
import { NewEmployeeForm } from "./news/NewEmployeeForm";

interface RoleManagerProps {
  businessId: string;
  initialData?: any; // Puedes tipar mejor según tu caso
}
export function EmployeesContainer({ businessId }: RoleManagerProps) {
  return (
    <div className="max-w-7xl mx-auto md:p-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Gestión de Empleados
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Lado izquierdo: Formulario */}
        <div className="bg-white shadow-md">
          <NewEmployeeForm />
        </div>

        {/* Lado derecho: Lista de empleados */}
        <div className="bg-whiteshadow-md flex flex-col">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 text-center">
            Empleados Existentes
          </h2>
          <div className="overflow-y-auto max-h-[70vh]">
            <EmployeeList />
          </div>
        </div>
      </div>

      <RoleManager businessId={businessId} />
    </div>
  );
}
