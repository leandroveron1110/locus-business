"use client";

import Order from "@/features/order/components/Order";
import { useParams } from "next/navigation";

export default function Businesscatalog() {
  const params = useParams();
  const businessIdRaw = params.businessId;

  // businessId puede ser string | string[] | undefined
  const businessId = Array.isArray(businessIdRaw) ? businessIdRaw[0] : businessIdRaw;

  return (
    <div>
      {businessId ? <Order businessId={businessId} /> : null}
    </div>
  );
}
