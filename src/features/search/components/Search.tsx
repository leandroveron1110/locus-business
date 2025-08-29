"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import { useBusinesses } from "../hooks/useBusinesses";
import { SearchBusinessCard } from "./SearchBusinessCard";

export default function SearchPage() {
  const user = useAuthStore();

  const businessIds = user.user?.businesses?.map((b) => b.id) || [];

  const { data: businesses, isLoading, isError } = useBusinesses(businessIds);

  if (isLoading) return <p>Cargando...</p>;
  if (isError) return <p>Error cargando negocios</p>;

  // Juntar rol del JWT con datos del backend
  const businessesWithRole = businesses?.map((b) => {
    const userBusiness = user.user?.businesses?.find((ub) => ub.id === b.id);
    return {
      ...b,
      role: userBusiness?.role, // 'OWNER' | 'CASHIER' | 'WAITER' ...
    };
  });

  return (
    <ul>
      {businessesWithRole?.map((b) => (
        <SearchBusinessCard
          business={{
            id: b.id,
            name: b.name,
            address: b.address,
            description: b.description,
            role: b.role || "",
          }}
        />
      ))}
    </ul>
  );
}
