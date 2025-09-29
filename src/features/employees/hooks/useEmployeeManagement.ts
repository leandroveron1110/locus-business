// import { useState } from "react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   createBusinessEmployee,
//   updateBusinessEmployeePermissions,
//   CreateBusinessEmployeePayload,
//   UpdateBusinessEmployeePayload,
// } from "../api/employees-api";
// import { useAuthStore } from "@/features/auth/store/authStore";

// const permissionOverrideSchema = z.object({
//   permissions: z.array(z.string()),
// });
// type PermissionOverrideFormValues = z.infer<typeof permissionOverrideSchema>;

// export function useEmployeeManagement(
//   foundUser: any,
//   selectedRoleId: string,
//   selectedRolePermissions: string[],
//   resetIdForm: () => void,
//   resetEmployeeForm: () => void
// ) {
//   const { user } = useAuthStore();
//   const businessId = user?.businesses?.[0]?.id;
//   const [newEmployeeId, setNewEmployeeId] = useState<string | null>(null);
//   const queryClient = useQueryClient();

//   const ALL_PERMISSIONS = [
//     "MANAGE_PRODUCTS",
//     "VIEW_ORDERS",
//     "MANAGE_ORDERS",
//     "VIEW_REPORTS",
//     "MANAGE_EMPLOYEES",
//   ];

//   // Mutación para asignar rol
//   const {
//     mutate: assignRoleMutation,
//     isPending: isAssigning,
//     isSuccess: isRoleAssigned,
//     error: assignError,
//   } = useMutation({
//     mutationFn: (payload: CreateBusinessEmployeePayload) => createBusinessEmployee(businessId!, payload),
//     onSuccess: (data) => {
//       if(data){
//         setNewEmployeeId(data.employeeId);
//       }
//     },
//   });

//   const onAssignRole = () => {
//     if (foundUser && selectedRoleId) {
//       const payload: CreateBusinessEmployeePayload = {
//         userId: foundUser.id,
//         roleId: selectedRoleId,
//       };
//       assignRoleMutation(payload);
//     }
//   };

//   // Mutación para sobrescribir permisos
//   const {
//     register: overrideRegister,
//     handleSubmit: handleOverrideSubmit,
//     reset: resetOverrideForm,
//     formState: { errors: overrideErrors },
//   } = useForm<PermissionOverrideFormValues>({
//     resolver: zodResolver(permissionOverrideSchema),
//     defaultValues: { permissions: selectedRolePermissions },
//   });

//   const {
//     mutate: overrideMutation,
//     isPending: isOverriding,
//     isSuccess: isOverridden,
//     error: overrideError,
//   } = useMutation({
//     mutationFn: (payload: UpdateBusinessEmployeePayload) => updateBusinessEmployeePermissions(newEmployeeId!, payload),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["employees"] });
//       resetAllForms();
//     },
//   });

//   const onOverrideSubmit = handleOverrideSubmit((data) => {
//     if(data){
//       const payload: UpdateBusinessEmployeePayload = {
//         overrides: data.permissions.map((p) => ({ permission: p, allowed: true })),
//       };
//       overrideMutation(payload);

//     }
//   });

//   const resetAllForms = () => {
//     setNewEmployeeId(null);
//     resetIdForm();
//     resetEmployeeForm();
//     resetOverrideForm();
//   };

//   return {
//     ALL_PERMISSIONS,
//     newEmployeeId,
//     assignRoleMutation: onAssignRole,
//     assignError,
//     isAssigning,
//     isRoleAssigned,
//     overrideRegister,
//     handleOverrideSubmit: onOverrideSubmit,
//     overrideError,
//     isOverriding,
//     isOverridden,
//     resetOverrideForm,
//     resetAllForms,
//   };
// }
