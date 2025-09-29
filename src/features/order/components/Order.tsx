"use client";

import React from "react";
import BusinessOrdersPage from "./BusinessOrdersPage";

interface Props {
  businessId: string;
}

export default function Catalog({ businessId }: Props) {

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        <BusinessOrdersPage businessId={businessId} />
      </div>
    </div>
  );
}
