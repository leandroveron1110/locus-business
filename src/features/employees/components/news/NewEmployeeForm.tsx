"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Save, Search, XCircle } from "lucide-react";
import { useBusinessRoles, useEmployeeMutations, useFindUser } from "../../hooks/useFindUserById";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { RoleList } from "@/features/roles/components/RoleList";
import { buttonBaseClasses, cardClasses, formContainerClasses, inputClasses, primaryButtonClasses, secondaryButtonClasses } from "@/lib/styles";

const idSchema = z.object({
  email: z.string().min(1, "El email del cliente no puede estar vacío."),
});
type IdFormValues = z.infer<typeof idSchema>;

const employeeAssignmentSchema = z.object({
  roleId: z.string().uuid("Selecciona un rol válido."),
});
type EmployeeAssignmentFormValues = z.infer<typeof employeeAssignmentSchema>;

export function NewEmployeeForm() {
  const { user } = useAuthStore();
  const businessId = user?.businesses?.[0]?.id;
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const queryClient = useQueryClient();
  const { addAlert } = useAlert();

  // Hooks de datos
  const { data: foundUser, isLoading: isUserSearching, error } = useFindUser(userEmail);
  const { data: roles, isLoading: rolesLoading } = useBusinessRoles(businessId);
  const { assignRoleMutation } = useEmployeeMutations(businessId!, foundUser?.id ?? null);

  // Formularios
  const {
    register: idRegister,
    handleSubmit: handleIdSubmit,
    formState: { errors: idErrors },
    reset: resetIdForm,
  } = useForm<IdFormValues>({ resolver: zodResolver(idSchema) });

  const {
    register: employeeRegister,
    handleSubmit: handleEmployeeSubmit,
    formState: { errors: employeeErrors },
    reset: resetEmployeeForm,
  } = useForm<EmployeeAssignmentFormValues>({
    resolver: zodResolver(employeeAssignmentSchema),
    defaultValues: { roleId: "" },
  });

  // ----------------------
  // Handlers
  // ----------------------
  const onIdSubmit = (data: IdFormValues) => setUserEmail(data.email);

  const onEmployeeAssign = (data: EmployeeAssignmentFormValues) => {
    if (!foundUser) return;

    assignRoleMutation.mutate(
      { userId: foundUser.id, roleId: data.roleId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["employees", businessId] });
          addAlert({
            message: `Rol asignado a ${foundUser.firstName} con éxito!`,
            type: "success",
            duration: 3000,
          });
          handleCancel();
        },
      }
    );
  };

  const handleCancel = () => {
    setUserEmail(null);
    setSelectedRoleId("");
    resetIdForm();
    resetEmployeeForm();
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    employeeRegister("roleId").onChange(e);
    setSelectedRoleId(e.target.value);
  };

  if (!businessId) {
    return (
      <div className="p-8 text-center text-red-500">
        Error: No se encontró un negocio asociado.
      </div>
    );
  }

  const selectedRole = roles?.find((r) => r.id === selectedRoleId);


return (
  <div className={formContainerClasses}>
    <div className={cardClasses}>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {foundUser ? "Asignar Rol" : "Buscar Cliente"}
      </h2>
      {!foundUser ? (
        <form onSubmit={handleIdSubmit(onIdSubmit)} className="space-y-6">
          <div className="relative">
            <label htmlFor="user-email" className="sr-only">
              Email del Cliente
            </label>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
            <input
              id="user-email"
              type="text"
              {...idRegister("email")}
              placeholder="Ingresa el email del cliente"
              className={inputClasses}
            />
          </div>
          {idErrors.email && <p className="text-red-500 text-sm mt-1">{idErrors.email.message}</p>}

          {(error?.statusCode === 404 || (error && error.statusCode !== 404)) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
              <p>{error.statusCode === 404 ? "Usuario no encontrado. Por favor, verifica el email." : `Ocurrió un error: ${error.message}`}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isUserSearching}
            className={`${buttonBaseClasses} ${primaryButtonClasses}`}
          >
            {isUserSearching ? "Buscando..." : "Buscar Cliente"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleEmployeeSubmit(onEmployeeAssign)} className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-800">Usuario encontrado:</h3>
            <p className="text-gray-700 mt-1">
              <span className="font-medium">{foundUser.firstName} {foundUser.lastName}</span>
              <br />
              <span className="text-sm text-gray-500">{foundUser.email}</span>
            </p>
          </div>

          <div>
            <label htmlFor="roleId" className="block text-gray-700 font-medium mb-2">
              Rol del Empleado
            </label>
            {rolesLoading ? (
              <div className="text-gray-500 p-2">Cargando roles...</div>
            ) : (
              <select
                id="roleId"
                {...employeeRegister("roleId")}
                value={selectedRoleId}
                onChange={handleRoleChange}
                className={inputClasses}
              >
                <option value="">Selecciona un rol</option>
                {roles?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            )}
            {employeeErrors.roleId && <p className="text-red-500 text-sm mt-1">{employeeErrors.roleId.message}</p>}
          </div>
            <div className="w-full" >
              {selectedRole && <RoleList roles={[selectedRole]} />}

            </div>

          {assignRoleMutation.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
              <p>{assignRoleMutation.error.message}</p>
            </div>
          )}

          {/* Contenedor flexible para los botones de acción */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className={`${buttonBaseClasses} ${secondaryButtonClasses}`}
            >
              <XCircle size={20} className="inline-block mr-2" /> Cancelar
            </button>
            <button
              type="submit"
              disabled={assignRoleMutation.isPending}
              className={`${buttonBaseClasses} ${primaryButtonClasses}`}
            >
              <Save size={20} className="inline-block mr-2" /> {assignRoleMutation.isPending ? "Asignando..." : `Asignar Rol a ${foundUser.firstName}`}
            </button>
          </div>
        </form>
      )}
    </div>
  </div>
);
}
