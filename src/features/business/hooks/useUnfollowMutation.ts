// src/features/business/hooks/useUnfollowMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/api";
import { Business, BusinessFollow } from "../types/business";

interface UnfollowParams {
  userId: string;
  businessId: string;
}

const unfollowBusiness = async ({ userId, businessId }: UnfollowParams) => {
  const res = await axios.delete(`/follow/unfollow/${userId}/${businessId}`);
  return res.data;
};

export const useUnfollowMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfollowBusiness,
    onSuccess: (_, { businessId }) => {
      queryClient.setQueryData<BusinessFollow>(
        ["business-follow", businessId],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            count: oldData.count - 1,
            isFollowing: false,
          };
        }
      );
    },
    onError: (error) => {
      console.error("Error al dejar de seguir el negocio:", error);
    },
  });
};
