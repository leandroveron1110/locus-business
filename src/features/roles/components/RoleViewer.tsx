"use client";

import React, { useEffect } from "react";
import { RoleList } from "./RoleList";
import { useRolesByBusinessId } from "../hooks/useRolesByBusinessId";
import { useAlert } from "@/features/common/ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";

interface RoleViewerProps {
  businessId: string;
}

export const RoleViewer: React.FC<RoleViewerProps> = ({ businessId }) => {
  const {
    data: roles = [],
    isLoading,
    error,
    isError,
  } = useRolesByBusinessId(businessId);
  const { addAlert } = useAlert();
  useEffect(() => {
    addAlert({
      message: getDisplayErrorMessage(error),
      type: "error",
    });
  }, [isError, error, addAlert]);

  if (isLoading) return <p>Cargando roles...</p>;
  if (!roles) return <p>Sin roles</p>;

  return <RoleList roles={roles} />;
};
