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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      
      {/* Título y descripción */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Crear o Editar Rol</h2>
        <p className="mt-1 text-sm text-gray-600">
          Asigna un nombre al rol y selecciona los permisos correspondientes.
        </p>
      </div>

      {/* Nombre del rol */}
      <div>
<div className="space-y-1">
  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
    Nombre del Rol
  </label>
  <p className="mt-1 text-xs text-gray-500">
    Dale a tu rol un nombre descriptivo.
  </p>
  <input
    id="name"
    type="text"
    {...register("name")}
    className="mt-1 block w-full px-4 py-2 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
    placeholder="Ej: Administrador de sucursal"
  />
</div>
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      {/* Permisos agrupados */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Permisos</h3>
        <p className="text-sm text-gray-600">
          Marca las casillas para conceder los permisos asociados a este rol.
        </p>
        
        <div className="space-y-4">
          {Object.entries(PermissionGroups).map(([groupKey, group]) => (
            <div key={groupKey} className="border border-gray-200 rounded-xl p-4 transition-colors hover:border-blue-300">
              <h4 className="font-bold text-gray-900 mb-2">{group.label}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                {group.permissions.map((permission) => (
                  <div key={permission} className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id={permission}
                        type="checkbox"
                        value={permission}
                        {...register("permissions")}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor={permission} className="font-medium text-gray-700">
                        {PermissionLabels[permission] ?? permission}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {errors.permissions && (
          <p className="text-red-600 text-sm mt-2">{errors.permissions.message}</p>
        )}
      </div>

      {/* Botón de guardar */}
      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? "Guardando..." : "Guardar Rol"}
        </button>
      </div>
    </form>
  );
};