"use client";

import { Loader2, Star } from "lucide-react";
import { useFollowMutation } from "../../hooks/useFollowMutation";
import { useUnfollowMutation } from "../../hooks/useUnfollowMutation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useFollowInfo } from "../../hooks/useFollowInfo";
import { SkeletonFollowButton } from "./Skeleton/SkeletonFollowButton";

interface Props {
  businessId: string;
}

export default function FollowButton({ businessId }: Props) {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? null;

  const { data, isLoading, isError } = useFollowInfo(businessId);

  const followMutation = useFollowMutation();
  const unfollowMutation = useUnfollowMutation();

  const isMutating = followMutation.isPending || unfollowMutation.isPending;

  const handleFollowToggle = () => {
    if (!userId || !data) return;

    if (data.isFollowing) {
      unfollowMutation.mutate({ userId, businessId });
    } else {
      followMutation.mutate({ userId, businessId });
    }
  };

  if (isLoading) return <SkeletonFollowButton />;
  if (isError || !data) return null;

  return (
    <div className="flex items-center justify-between mt-4 gap-4 flex-wrap">
      <button
        onClick={handleFollowToggle}
        disabled={isMutating}
        aria-pressed={data.isFollowing}
        aria-label={data.isFollowing ? "Dejar de seguir negocio" : "Seguir negocio"}
        className={`
          group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm
          transition-all duration-200 ease-in-out
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            data.isFollowing
              ? "bg-white border border-gray-300 text-gray-800 hover:bg-gray-100"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:brightness-110"
          }
          shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        `}
      >
        {isMutating ? (
          <Loader2 className="animate-spin h-5 w-5 text-current" />
        ) : (
          <>
            <Star
              size={18}
              className={`transition-colors duration-200 ${
                data.isFollowing ? "text-yellow-400" : "text-white group-hover:text-yellow-300"
              }`}
              fill={data.isFollowing ? "currentColor" : "none"}
              strokeWidth={2}
            />
            {data.isFollowing ? "Siguiendo" : "Seguir"}
          </>
        )}
      </button>

      <div className="flex items-center gap-1 text-sm text-gray-600">
        <Star size={16} className="text-yellow-400" />
        <span className="font-medium">{data.count}</span>
        <span className="text-gray-400">seguidores</span>
      </div>
    </div>
  );
}
