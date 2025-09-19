// src/components/roles/RoleList.tsx
"use client";

import { PermissionLabels } from "@/features/common/utils/permissions-translations";
import { PermissionsEnum } from "@/features/common/utils/permissions.enum";
import React from "react";
import { BadgeCheck, ShieldCheck } from "lucide-react";

interface Role {
  id: string;
  name: string;
  permissions: PermissionsEnum[];
}

interface RoleListProps {
  roles: Role[];
}

export const RoleList: React.FC<RoleListProps> = ({ roles }) => {
  if (roles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg text-gray-500">
        <ShieldCheck className="w-12 h-12 mb-4 text-gray-400" />
        <p className="text-center font-medium">No hay roles creados.</p>
        <p className="text-center text-sm">Crea un nuevo rol para gestionar permisos.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role) => (
        <div key={role.id} className="relative p-6 bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">{role.name}</h2>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Permisos:</h3>
            <ul className="space-y-2">
              {role.permissions.map((permission) => (
                <li key={permission} className="flex items-center text-sm text-gray-700">
                  <BadgeCheck className="w-4 h-4 mr-2 text-green-500" />
                  <span>{PermissionLabels[permission] ?? permission}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};