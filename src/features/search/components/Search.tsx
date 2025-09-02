"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import { useBusinesses } from "../hooks/useBusinesses";
import { SearchBusinessCard } from "./SearchBusinessCard";

export default function SearchPage() {
  const user = useAuthStore();

  const businessIds = user.user?.businesses?.map((b) => b.id) || [];
  const { data: businesses, isLoading, isError } = useBusinesses(businessIds);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando negocios...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Error cargando negocios</p>
      </div>
    );
  }

  // Combinar rol del JWT con datos del backend
  const businessesWithRole = businesses?.map((b) => {
    const userBusiness = user.user?.businesses?.find((ub) => ub.id === b.id);
    return {
      ...b,
      role: userBusiness?.role || "",
    };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {businessesWithRole?.map((b) => (
        <SearchBusinessCard
          key={b.id}
          business={{
            id: b.id,
            name: b.name,
            address: b.address,
            description: b.description,
            role: b.role,
          }}
        />
      ))}
    </div>
  );
}
