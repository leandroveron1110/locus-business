"use client";

import { PermissionLabels } from "@/features/common/utils/permissions-translations";
import { PermissionsEnum } from "@/features/common/utils/permissions.enum";
import React from "react";

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
    return <p className="text-gray-500">No hay roles creados.</p>;
  }

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <div key={role.id} className="p-4 border rounded-md shadow-sm bg-white">
          <h2 className="text-lg font-semibold">{role.name}</h2>
          <p className="text-sm text-gray-600 mt-1">
            Permisos: {role.permissions.map((p) => `${PermissionLabels[p]}`)}
          </p>
        </div>
      ))}
    </div>
  );
};
