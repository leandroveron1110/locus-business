// src/app/business/employees/EmployeeList.tsx
"use client";

import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { RoleList } from "@/features/roles/components/RoleList";
import { MoreHorizontal } from "lucide-react"; // ✅ Importación del icono
import { EditEmployeeForm } from "./edit/EditEmployeeForm";
import { useBusinessEmployees } from "../hooks/useFindUserById";
import { IEmployee } from "../api/employees-api";
import { PermissionLabels } from "@/features/common/utils/permissions-translations";
import { EmployeeDetailsModal } from "./EmployeeDetailsModal";

// Componente del Modal de Detalles

// Componente principal de la lista de empleados
export function EmployeeList() {
  const { user } = useAuthStore();
  const businessId = user?.businesses?.[0]?.id;
  const {
    data: employees,
    isLoading,
    error,
  } = useBusinessEmployees(businessId);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false); // ✅ Nuevo estado para controlar la edición

  const handleEmployeeClick = (employee: IEmployee) => {
    setSelectedEmployee(employee);
    setIsEditing(false); // ✅ Asegurar que se muestre el modal de detalles primero
  };

  const handleEditClick = (employee: IEmployee) => {
    setSelectedEmployee(employee);
    setIsEditing(true); // ✅ Cambiar al modo de edición
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setIsEditing(false);
  };

  if (!businessId) {
    return (
      <div className="p-8 text-center text-red-500">
        Error: No se encontró un negocio asociado.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">Cargando empleados...</div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        Error al cargar empleados: {error.message}
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No hay empleados registrados.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-bold mb-4">Empleados Existentes</h3>
      <ul className="space-y-2">
        {employees.map((employee) => (
          <li
            key={employee.id}
            className="p-4 bg-gray-100 rounded-lg flex items-center justify-between transition-colors"
          >
            <div
              className="flex items-center space-x-3 flex-1 cursor-pointer"
              onClick={() => handleEmployeeClick(employee)}
            >
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">
                {employee.firstName} {employee.lastName}
              </span>
              <span className="text-sm text-gray-500">{employee.email}</span>
              {employee.role ? (
                <span className="text-sm text-blue-600 font-semibold">
                  {employee.role.name}
                </span>
              ) : (
                <span className="text-sm text-gray-400 italic">
                  Sin rol asignado
                </span>
              )}
            </div>
              
            </div>
          </li>
        ))}
      </ul>

      {selectedEmployee && !isEditing && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={closeModal}
          onEdit={() => handleEditClick(selectedEmployee)} // ✅ Pasar la función de edición
        />
      )}

      {selectedEmployee && isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <EditEmployeeForm
              employee={selectedEmployee}
              businessId={businessId}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
