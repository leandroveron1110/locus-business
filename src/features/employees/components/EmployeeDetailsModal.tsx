// src/app/business/employees/EmployeeDetailsModal.tsx
"use client";

import { RoleList } from "@/features/roles/components/RoleList";
import { IEmployee } from "../api/employees-api";
import { PermissionsEnum } from "@/features/common/utils/permissions.enum";
import { PermissionLabels } from "@/features/common/utils/permissions-translations";
import { PlusCircle, MinusCircle, BadgeCheck, XCircle } from "lucide-react";

interface EmployeeDetailsModalProps {
  employee: IEmployee;
  onClose: () => void;
  onEdit: (employee: IEmployee) => void;
}

export function EmployeeDetailsModal({ employee, onClose, onEdit }: EmployeeDetailsModalProps) {
  // 1. Convertir los permisos del rol y las sobrescrituras a Sets/Maps para búsqueda eficiente
  const rolePermissions = new Set(employee.role?.permissions || []);
  const overrides = new Map(employee.overrides.map(o => [o.permission, o.allowed]));

  // 2. Obtener los permisos "inherentes" al rol que no han sido denegados por sobrescritura
  const inherentPermissions = Array.from(rolePermissions).filter(
    (p) => !overrides.has(p) || (overrides.has(p) && overrides.get(p) === true)
  );

  // 3. Obtener los permisos "agregados" por sobrescritura que no están en el rol
  const addedPermissions = Array.from(overrides.keys()).filter(
    (p) => overrides.get(p) === true && !rolePermissions.has(p)
  );
  
  // 4. Obtener los permisos "denegados" por sobrescritura
  const deniedPermissions = Array.from(overrides.keys()).filter(
    (p) => overrides.get(p) === false
  );

  // 5. Combinar todas las listas para el renderizado final
  const allPermissionsToShow = [
    ...inherentPermissions,
    ...addedPermissions,
    ...deniedPermissions
  ];

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
    {/* Header Fijo */}
    <div className="flex justify-between items-center px-6 py-4 border-b">
      <h2 className="text-xl font-bold text-gray-800">
        {employee.firstName} {employee.lastName}
      </h2>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition">
        <XCircle size={24} />
      </button>
    </div>

    {/* Info Básica */}
    <div className="px-6 py-4 space-y-3 border-b">
      <div>
        <p className="font-semibold text-gray-700">Email</p>
        <p className="text-gray-600">{employee.email}</p>
      </div>
      <div>
        <p className="font-semibold text-gray-700">Rol Asignado</p>
        {employee.role ? (
          <span className="text-blue-600 font-medium">{employee.role.name}</span>
        ) : (
          <span className="text-gray-400">Sin Rol Asignado</span>
        )}
      </div>
    </div>

    {/* Lista de Permisos */}
    <div className="px-6 py-4 flex-1 overflow-y-auto">
      <h3 className="font-semibold text-gray-700 mb-3">Permisos</h3>
      <ul className="divide-y divide-gray-200">
        {allPermissionsToShow.map((permission) => {
          const isAdded = addedPermissions.includes(permission);
          const isDenied = deniedPermissions.includes(permission);
          const isInherited = inherentPermissions.includes(permission);

          return (
            <li
              key={permission}
              className="flex items-center justify-between py-2 hover:bg-gray-50 transition rounded"
            >
              <div className="flex items-center space-x-2">
                {isAdded && <PlusCircle size={16} className="text-green-500" />}
                {isDenied && <MinusCircle size={16} className="text-red-500" />}
                {isInherited && <BadgeCheck size={16} className="text-blue-500" />}
                <span
                  className={`font-medium ${
                    isDenied ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {PermissionLabels[permission]}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {isAdded && (
                  <span className="text-xs text-green-600 font-semibold px-2 py-1 bg-green-100 rounded-full">
                    Agregado
                  </span>
                )}
                {isDenied && (
                  <span className="text-xs text-red-600 font-semibold px-2 py-1 bg-red-100 rounded-full">
                    Denegado
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>

    {/* Footer */}
    <div className="px-6 py-4 border-t">
      <button
        onClick={() => onEdit(employee)}
        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        Editar Permisos
      </button>
    </div>
  </div>
</div>

  );
}