import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { createRoleApi } from "../api/roles-api";
import { BusinessRole, CreateBusinessRole } from "../types/roles";
import { ApiResult } from "@/lib/apiFetch";
import { ApiError } from "@/types/api";

export const useCreateRole = (
  options?: UseMutationOptions<
    ApiResult<BusinessRole>,
    ApiError,
    CreateBusinessRole
  >
) => {
  return useMutation<ApiResult<BusinessRole>, ApiError, CreateBusinessRole>({
    mutationFn: createRoleApi,
    retry: false,
    ...options,
  });
};
