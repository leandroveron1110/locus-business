// src/features/roles/hooks/useRolesByBusinessId.ts
import { useQuery } from "@tanstack/react-query";
import { getRolesByBusinessIdApi } from "../api/roles-api";
import { BusinessRole } from "../types/roles";

export const useRolesByBusinessId = (businessId: string) => {
  return useQuery<BusinessRole[], Error>({
    queryKey: ["roles", businessId],
    queryFn: () => getRolesByBusinessIdApi(businessId),
    enabled: !!businessId,
  });
};
