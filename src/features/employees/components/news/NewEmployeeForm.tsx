// src/app/business/employees/new/NewEmployeeForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { User, Search, Save, XCircle } from "lucide-react";
import { 
  BusinessRole, 
  createBusinessEmployee, 
  CreateBusinessEmployeePayload, 
  findUserById, 
  getBusinessRolesAndPermissions, 
  UserSearchResponse, 
  updateBusinessEmployeePermissions,
  UpdateBusinessEmployeePayload
} from "../../api/employees-api";

// Esquema de validación para el ID del cliente
const idSchema = z.object({
  id: z.string().min(1, "El ID del cliente no puede estar vacío."),
});
type IdFormValues = z.infer<typeof idSchema>;

// Esquema de validación para la asignación del rol
const employeeAssignmentSchema = z.object({
  roleId: z.string().uuid("Selecciona un rol válido."),
});
type EmployeeAssignmentFormValues = z.infer<typeof employeeAssignmentSchema>;

// Esquema para la modificación de permisos
const permissionOverrideSchema = z.object({
  permissions: z.array(z.string()),
});
type PermissionOverrideFormValues = z.infer<typeof permissionOverrideSchema>;

// Mock de permisos disponibles (reemplázalo con tu enum real)
const ALL_PERMISSIONS = [
  "MANAGE_PRODUCTS",
  "VIEW_ORDERS",
  "MANAGE_ORDERS",
  "VIEW_REPORTS",
  "MANAGE_EMPLOYEES"
];

export function NewEmployeeForm() {
  const { user } = useAuthStore();
  const businessId = user?.businesses?.[0]?.id;
  const [userId, setUserId] = useState<string | null>(null);
  const [newEmployeeId, setNewEmployeeId] = useState<string | null>(null);
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // ----------------------------------------------------
  // Formulario de Búsqueda de Usuario
  // ----------------------------------------------------
  const { 
    register: idRegister,
    handleSubmit: handleIdSubmit,
    formState: { errors: idErrors },
    reset: resetIdForm,
  } = useForm<IdFormValues>({ resolver: zodResolver(idSchema) });

  const { data: foundUser, isLoading: isUserSearching } = useQuery<UserSearchResponse>({
    queryKey: ["findUser", userId],
    queryFn: () => findUserById(userId!),
    enabled: !!userId,
    staleTime: Infinity,
  });

  const onIdSubmit = (data: IdFormValues) => {
    setUserId(data.id);
  };

  // ----------------------------------------------------
  // Formulario de Asignación de Rol
  // ----------------------------------------------------
  const {
    register: employeeRegister,
    handleSubmit: handleEmployeeSubmit,
    watch,
    formState: { errors: employeeErrors },
    reset: resetEmployeeForm,
  } = useForm<EmployeeAssignmentFormValues>({
    resolver: zodResolver(employeeAssignmentSchema),
    defaultValues: { roleId: "" },
  });

  const { data: roles, isLoading: rolesLoading } = useQuery<BusinessRole[]>({
    queryKey: ["businessRoles", businessId],
    queryFn: () => getBusinessRolesAndPermissions(businessId!),
    enabled: !!businessId,
  });

  const { 
    mutate: assignRoleMutation, 
    isPending: isAssigning, 
    isSuccess: isRoleAssigned, 
    error: assignError 
  } = useMutation({
    mutationFn: (payload: CreateBusinessEmployeePayload) => createBusinessEmployee(businessId!, payload),
    onSuccess: (data) => {
      alert("¡Rol de empleado asignado con éxito!");
      setNewEmployeeId(data.employeeId); // Guardamos el ID del nuevo empleado
    },
  });

  const onEmployeeAssign = (data: EmployeeAssignmentFormValues) => {
    if (foundUser) {
      const payload: CreateBusinessEmployeePayload = {
        userId: foundUser.id,
        roleId: data.roleId,
      };
      assignRoleMutation(payload);
    }
  };

  // ----------------------------------------------------
  // Formulario de Sobrescritura de Permisos
  // ----------------------------------------------------
  const {
    register: overrideRegister,
    handleSubmit: handleOverrideSubmit,
    formState: { errors: overrideErrors },
    reset: resetOverrideForm,
  } = useForm<PermissionOverrideFormValues>({
    resolver: zodResolver(permissionOverrideSchema),
    defaultValues: { permissions: selectedRolePermissions },
  });

  const { 
    mutate: overrideMutation, 
    isPending: isOverriding, 
    isSuccess: isOverridden, 
    error: overrideError 
  } = useMutation({
    mutationFn: (payload: UpdateBusinessEmployeePayload) => updateBusinessEmployeePermissions(newEmployeeId!, payload),
    onSuccess: () => {
      alert("¡Permisos actualizados con éxito!");
      resetAllForms();
      // Invalidamos la caché para que los nuevos permisos se vean
      queryClient.invalidateQueries({ queryKey: ["employees"] }); 
    },
  });

  const onOverrideSubmit = (data: PermissionOverrideFormValues) => {
    const payload: UpdateBusinessEmployeePayload = {
      overrides: data.permissions.map(p => ({ permission: p, allowed: true })),
    };
    overrideMutation(payload);
  };

  // ----------------------------------------------------
  // Lógica de UI y Efectos
  // ----------------------------------------------------
  const selectedRoleId = watch("roleId");
  useEffect(() => {
    if (selectedRoleId && roles) {
      const role = roles.find((r) => r.id === selectedRoleId);
      if (role) {
        setSelectedRolePermissions(role.permissions);
        resetOverrideForm({ permissions: role.permissions });
      } else {
        setSelectedRolePermissions([]);
      }
    }
  }, [selectedRoleId, roles, resetOverrideForm]);

  const resetAllForms = () => {
    setUserId(null);
    setNewEmployeeId(null);
    resetIdForm();
    resetEmployeeForm();
    resetOverrideForm();
  };
  
  if (!businessId) {
    return <div className="p-8 text-center text-red-500">Error: No se encontró un negocio asociado.</div>;
  }
  
  return (
    <div className="flex justify-center p-8">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Gestión de Empleados</h2>
        
        {/* Vista del primer paso: Asignación inicial */}
        {!newEmployeeId ? (
          <>
            {/* Formulario de búsqueda (si no se ha encontrado el usuario) */}
            {!foundUser && (
              <form onSubmit={handleIdSubmit(onIdSubmit)} className="space-y-4">
                <div className="mb-4">
                  <label htmlFor="user-id-search" className="block text-gray-700 font-medium mb-2">ID del Cliente</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="user-id-search"
                      type="text"
                      {...idRegister("id")}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {idErrors.id && <p className="text-red-500 text-sm mt-1">{idErrors.id.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isUserSearching}
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {isUserSearching ? "Buscando..." : "Buscar Cliente"}
                </button>
              </form>
            )}

            {/* Formulario de asignación de rol (si se encuentra el usuario) */}
            {foundUser && (
              <form onSubmit={handleEmployeeSubmit(onEmployeeAssign)} className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold">Cliente encontrado:</h3>
                  <p className="text-gray-700">{foundUser.firstName} {foundUser.lastName} ({foundUser.email})</p>
                </div>
                
                {/* Selector de rol */}
                <div className="mb-4">
                  <label htmlFor="roleId" className="block text-gray-700 font-medium mb-2">Rol del Empleado</label>
                  {rolesLoading ? (
                    <div className="text-gray-500">Cargando roles...</div>
                  ) : (
                    <select
                      id="roleId"
                      {...employeeRegister("roleId")}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                {/* Lista de Permisos del rol */}
                {selectedRolePermissions.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Permisos por Defecto</h3>
                    <ul className="list-disc list-inside bg-gray-100 p-4 rounded-lg">
                      {selectedRolePermissions.map((permission) => (
                        <li key={permission} className="capitalize">{permission.toLowerCase().replace(/_/g, ' ')}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {assignError && <p className="text-red-500 text-sm text-center mb-4">Error: {assignError.message}</p>}
                {isRoleAssigned && <p className="text-green-500 text-sm text-center mb-4">¡Rol asignado!</p>}

                <button
                  type="submit"
                  disabled={isAssigning}
                  className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                >
                  {isAssigning ? "Asignando Rol..." : `Asignar Rol a ${foundUser.firstName}`}
                </button>
              </form>
            )}
          </>
        ) : (
          /* Vista del segundo paso: Sobrescritura de permisos */
          <form onSubmit={handleOverrideSubmit(onOverrideSubmit)} className="space-y-4">
            <h3 className="text-xl font-bold">Sobrescribir Permisos</h3>
            <p className="text-gray-600">Puedes añadir o quitar permisos específicos para este empleado.</p>
            
            <div className="space-y-2">
              {ALL_PERMISSIONS.map((permission) => (
                <div key={permission} className="flex items-center">
                  <input
                    id={permission}
                    type="checkbox"
                    value={permission}
                    {...overrideRegister("permissions")}
                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <label htmlFor={permission} className="ml-2 text-sm font-medium text-gray-900">
                    {permission.toLowerCase().replace(/_/g, ' ')}
                  </label>
                </div>
              ))}
            </div>

            {overrideError && <p className="text-red-500 text-sm text-center mb-4">Error: {overrideError.message}</p>}
            {isOverridden && <p className="text-green-500 text-sm text-center mb-4">¡Permisos guardados!</p>}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={resetAllForms}
                className="w-full flex-grow-0 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
              >
                <XCircle size={20} className="inline-block mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isOverriding}
                className="w-full flex-grow bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
              >
                <Save size={20} className="inline-block mr-2" />
                {isOverriding ? "Guardando..." : "Guardar Permisos"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}