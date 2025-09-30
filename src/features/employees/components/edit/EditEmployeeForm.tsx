// Tu componente modificado: EditEmployeeForm.tsx

"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Save, XCircle } from "lucide-react";

import {
  IEmployee,
  UpdateBusinessEmployeePayload,
  updateBusinessEmployeePermissions,
} from "../../api/employees-api";
import {
  useBusinessRoles,
  useDeleteRoleEmployess,
} from "../../hooks/useFindUserById";
import { PermissionsEnum } from "@/features/common/utils/permissions.enum";
import { PermissionLabels } from "@/features/common/utils/permissions-translations";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import ConfirmationModal, {
  ConfirmationModalRef,
} from "@/features/common/ui/Modal/ConfirmationModal";

const editEmployeeSchema = z.object({
  roleId: z.string().uuid("Selecciona un rol válido."),
  permissions: z.array(z.string()),
});
type EditEmployeeFormValues = z.infer<typeof editEmployeeSchema>;

interface EditEmployeeFormProps {
  employee: IEmployee;
  businessId: string;
  onCancel: () => void;
}

const ALL_PERMISSIONS: PermissionsEnum[] = Object.values(PermissionsEnum);

export function EditEmployeeForm({
  employee,
  businessId,
  onCancel,
}: EditEmployeeFormProps) {
  const queryClient = useQueryClient();
  const { addAlert } = useAlert();
  const { data: roles, isLoading: rolesLoading } = useBusinessRoles(businessId);
  const confirmationModalRef = useRef<ConfirmationModalRef>(null);

  const { mutate: updateEmployee, isPending: isUpdating } = useMutation({
    mutationFn: (payload: UpdateBusinessEmployeePayload) =>
      updateBusinessEmployeePermissions(employee.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees", businessId] });
      addAlert({
        message: "Empleado actualizado con éxito.",
        type: "success",
        duration: 3000,
      });
      onCancel();
    },
    onError: (error) => {
      addAlert({
        message: "Error al actualizar: " + error.message,
        type: "error",
        duration: 5000,
      });
    },
  });

  const { mutate: deleteEmployee, isPending: isDeleting } =
    useDeleteRoleEmployess(businessId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: {
      roleId: employee.role?.id || "",
      permissions: [
        ...(employee.role?.permissions || []),
        ...employee.overrides.filter((o) => o.allowed).map((o) => o.permission),
      ],
    },
  });

  const selectedRoleId = watch("roleId");

  useEffect(() => {
    if (selectedRoleId && roles) {
      const newRole = roles.find((r) => r.id === selectedRoleId);
      const newRolePermissions = new Set(newRole?.permissions || []);
      const currentOverrides = new Map(
        employee.overrides.map((o) => [o.permission, o.allowed])
      );

      const combinedPermissions = new Set(newRolePermissions);

      currentOverrides.forEach((allowed, permission) => {
        if (allowed) {
          combinedPermissions.add(permission);
        } else {
          combinedPermissions.delete(permission);
        }
      });

      reset({ ...watch(), permissions: Array.from(combinedPermissions) });
    }
  }, [selectedRoleId, roles, reset, watch, employee.overrides]);

  const onUpdateSubmit = (data: EditEmployeeFormValues) => {
    const selectedRole = roles?.find((r) => r.id === data.roleId);
    const rolePermissions = new Set(selectedRole?.permissions || []);
    const formPermissions = new Set(data.permissions);

    const overrides = ALL_PERMISSIONS.reduce((acc, permission) => {
      const hasRolePermission = rolePermissions.has(permission);
      const hasFormPermission = formPermissions.has(permission);
      if (hasRolePermission !== hasFormPermission) {
        acc.push({ permission, allowed: hasFormPermission });
      }
      return acc;
    }, [] as { permission: PermissionsEnum; allowed: boolean }[]);

    updateEmployee({ roleId: data.roleId, overrides });
  };

  const handleDeleteEmployee = () => {
    confirmationModalRef.current?.open();
  };

  const handleConfirmDeletion = () => {
    deleteEmployee(
      { employeeId: employee.id },
      {
        onSuccess: () => {
          addAlert({
            message: "Empleado eliminado con éxito.",
            type: "success",
            duration: 3000,
          });
          onCancel();
        },
        onError: (error) => {
          addAlert({
            message: "Error al eliminar el empleado: " + error.message,
            type: "error",
            duration: 5000,
          });
        },
      }
    );
  };

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Editar Empleado
        </h2>

        <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="roleId"
              className="block text-gray-700 font-medium mb-2"
            >
              Rol del Empleado
            </label>
            {rolesLoading ? (
              <div className="text-gray-500">Cargando roles...</div>
            ) : (
              <select
                id="roleId"
                {...register("roleId")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un rol</option>
                {roles?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            )}
            {errors.roleId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.roleId.message}
              </p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              Permisos
            </h3>
            <p className="text-gray-500 text-sm mb-3">
              Selecciona los permisos que tendrá el empleado.
            </p>
            <div className="max-h-56 overflow-y-auto border-t pt-3 space-y-2 pr-2">
              {ALL_PERMISSIONS.map((permission) => (
                <div key={permission} className="flex items-center">
                  <input
                    id={permission}
                    type="checkbox"
                    value={permission}
                    {...register("permissions")}
                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={permission}
                    className="ml-2 text-sm font-medium text-gray-900"
                  >
                    {PermissionLabels[permission]}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition-all"
            >
              <XCircle size={20} /> Cancelar
            </button>

            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save size={20} />{" "}
              {isUpdating ? "Actualizando..." : "Actualizar Empleado"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleDeleteEmployee}
            disabled={isDeleting}
            className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Eliminando..." : "Eliminar Empleado"}
          </button>
        </form>
      </div>

      <ConfirmationModal
        ref={confirmationModalRef}
        title="Eliminar empleado"
        message={`¿Estás seguro de que deseas eliminar a ${employee.firstName} ${employee.lastName}? Esta acción no se puede deshacer.`}
        onConfirm={handleConfirmDeletion}
        onCancel={() => {}}
      />
    </>
  );
}
