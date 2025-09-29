"use client";

import React from "react";
import { RoleList } from "./RoleList";
import { useRolesByBusinessId } from "../hooks/useRolesByBusinessId";
import { ApiError } from "@/types/api";
import { Error } from "@/features/common/ui/Error/Error";

interface RoleViewerProps {
  businessId: string;
}

export const RoleViewer: React.FC<RoleViewerProps> = ({ businessId }) => {
  const { data: roles = [], isLoading, error } = useRolesByBusinessId(businessId);

  if (isLoading) return <p>Cargando roles...</p>;
  if (error) return <Error error={error as ApiError} />;
  if(!roles) return <p>Sin roles</p>

  return <RoleList roles={roles} />;
};
