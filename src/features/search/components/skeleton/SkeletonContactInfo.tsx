// src/features/business/components/Skeleton/SkeletonContactInfo.tsx
import React from "react";

export const SkeletonContactInfo: React.FC = () => (
  <div className="p-4 space-y-4 rounded-lg bg-gray-100 animate-pulse">
    <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
    <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
  </div>
);