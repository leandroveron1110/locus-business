"use client";

import React, { useState } from "react";
import { RoleForm } from "./RoleForm";
import { useCreateRole } from "@/features/roles/hooks/useCreateRole";
import { RoleViewer } from "./RoleViewer";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
import { CreateBusinessRole } from "../types/roles";
import { PermissionsEnum } from "@/features/common/utils/permissions.enum";

interface RoleManagerProps {
  businessId: string;
  initialData?: CreateBusinessRole; // Puedes tipar mejor según tu caso
}

export const RoleManager: React.FC<RoleManagerProps> = ({
  businessId,
  initialData,
}) => {
  const { mutate, isPending } = useCreateRole();
  const [showForm, setShowForm] = useState(false);
  const { addAlert } = useAlert();

  const handleSubmit = (formData: { name: string; permissions: string[] }) => {
    const create: CreateBusinessRole = {
      businessId,
      name: formData.name,
      permissions: formData.permissions as PermissionsEnum[],
    };
    mutate(
      { ...create, businessId },
      {
        onSuccess: () => {
          setShowForm(false); // ocultamos el form después de crear el rol
        },
        onError: (error) => {
          addAlert({
            message: getDisplayErrorMessage(error),
            type: "error",
          });
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Botón para mostrar/ocultar el formulario */}
      <button
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "Cancelar" : "Crear nuevo rol"}
      </button>

      {/* Mostrar el formulario solo si showForm = true */}
      {showForm && (
        <RoleForm
          onSubmit={handleSubmit}
          initialData={initialData}
          isSubmitting={isPending}
        />
      )}

      {/* Lista de roles */}
      <RoleViewer businessId={businessId} />
    </div>
  );
};
