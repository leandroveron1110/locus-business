"use client"
// SkeletonSchedule.tsx
export const SkeletonSchedule = () => {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex justify-between">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );
};