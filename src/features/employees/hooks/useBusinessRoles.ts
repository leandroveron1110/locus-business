import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { getBusinessRolesAndPermissions, BusinessRole } from "../api/employees-api";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ApiResult } from "@/lib/apiFetch";

const employeeAssignmentSchema = z.object({
  roleId: z.string().uuid("Selecciona un rol válido."),
});
type EmployeeAssignmentFormValues = z.infer<typeof employeeAssignmentSchema>;

export function useBusinessRoles() {
  const { user } = useAuthStore();
  const businessId = user?.businesses?.[0]?.id;
  const [selectedRoleId, setSelectedRoleId] = useState<string>(""); 
  const [selectedRolePermissions, setSelectedRolePermissions] = useState<string[]>([]);

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

  const { data: roles, isLoading: rolesLoading } = useQuery<ApiResult<BusinessRole[]>>({
    queryKey: ["businessRoles", businessId],
    queryFn: () => getBusinessRolesAndPermissions(businessId!),
    enabled: !!businessId,
  });

  // Sincronizar permisos al cambiar el rol seleccionado
  useEffect(() => {
    if (selectedRoleId && roles) {
      const role = roles.find((r) => r.id === selectedRoleId);
      setSelectedRolePermissions(role?.permissions ?? []);
    } else {
      setSelectedRolePermissions([]);
    }
  }, [selectedRoleId, roles]);

  return {
    roles,
    rolesLoading,
    selectedRoleId,
    setSelectedRoleId,
    selectedRolePermissions,
    employeeRegister,
    handleEmployeeSubmit,
    employeeErrors,
    resetEmployeeForm,
  };
}
