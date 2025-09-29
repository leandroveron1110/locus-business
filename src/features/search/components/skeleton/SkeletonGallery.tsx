"use client";

// SkeletonGallery.tsx
export const SkeletonGallery = () => {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Galería</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-28 w-full bg-gray-200 dark:bg-gray-700 rounded-2xl shadow-md animate-pulse"
          ></div>
        ))}
      </div>
    </section>
  );
};
