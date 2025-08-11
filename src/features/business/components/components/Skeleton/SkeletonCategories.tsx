"use client"
// SkeletonCategories.tsx
export const SkeletonCategories = () => {
  return (
    <div className="flex flex-wrap gap-2 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700"
        ></div>
      ))}
    </div>
  );
};