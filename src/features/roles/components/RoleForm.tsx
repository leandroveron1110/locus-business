// src/components/roles/RoleForm.tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PermissionsEnum } from "@/features/common/utils/permissions.enum";
import { PermissionLabels } from "@/features/common/utils/permissions-translations";
import { PermissionGroups } from "@/features/common/utils/permissions-groups";

const permissionSchema = z.enum(Object.values(PermissionsEnum) as [string, ...string[]]);

const formSchema = z.object({
  name: z.string().min(3, "El nombre del rol es requerido y debe tener al menos 3 caracteres."),
  permissions: z.array(permissionSchema).min(1, "Debe seleccionar al menos un permiso."),
});

type FormData = z.infer<typeof formSchema>;

interface RoleFormProps {
  initialData?: FormData;
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

export const RoleForm: React.FC<RoleFormProps> = ({ initialData, onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || { name: "", permissions: [] },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nombre del rol */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre del Rol
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      {/* Permisos agrupados */}
      <div className="space-y-4">
        {Object.entries(PermissionGroups).map(([groupKey, group]) => (
          <div key={groupKey} className="border rounded-md p-3 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-2">{group.label}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {group.permissions.map((permission) => (
                <div key={permission} className="flex items-center">
                  <input
                    id={permission}
                    type="checkbox"
                    value={permission}
                    {...register("permissions")}
                    className="h-4 w-4 text-indigo-600 rounded"
                  />
                  <label htmlFor={permission} className="ml-2 text-sm text-gray-900">
                    {PermissionLabels[permission] ?? permission}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
        {errors.permissions && (
          <p className="text-red-500 text-sm mt-1">{errors.permissions.message}</p>
        )}
      </div>

      {/* Botón submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {isSubmitting ? "Guardando..." : "Guardar Rol"}
      </button>
    </form>
  );
};
