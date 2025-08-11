"use client";

import Catalog from "@/features/catalog/components/Catalog";
import { useParams } from "next/navigation";

export default function Businesscatalog() {
  const params = useParams();
  const businessIdRaw = params.businessId;

  // businessId puede ser string | string[] | undefined
  const businessId = Array.isArray(businessIdRaw) ? businessIdRaw[0] : businessIdRaw;

  return (
    <div>
      {businessId ? <Catalog businessId={businessId} /> : null}
    </div>
  );
}
