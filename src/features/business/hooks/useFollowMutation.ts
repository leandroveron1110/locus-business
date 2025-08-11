// src/features/business/hooks/useFollowMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BusinessFollow } from "../types/business";
import { fetchFollowBusinessAddUser } from "../api/businessApi";


export const useFollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchFollowBusinessAddUser,
    onSuccess: (_, { businessId }) => {
      queryClient.setQueryData<BusinessFollow>(
        ["business-follow", businessId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            count: oldData.count + 1,
            isFollowing: true
          };
        }
      );
    },
    onError: (error) => {
      console.error("Error al seguir el negocio:", error);
    },
  });
};
