"use client";

import React from "react";
import { RoleList } from "./RoleList";
import { useRolesByBusinessId } from "../hooks/useRolesByBusinessId";

interface RoleViewerProps {
  businessId: string;
}

export const RoleViewer: React.FC<RoleViewerProps> = ({ businessId }) => {
  const { data: roles = [], isLoading, error } = useRolesByBusinessId(businessId);

  if (isLoading) return <p>Cargando roles...</p>;
  if (error) return <p className="text-red-500">Error cargando roles.</p>;

  return <RoleList roles={roles} />;
};
