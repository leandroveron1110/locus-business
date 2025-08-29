"use client";

import React from "react";
import BusinessOrdersPage from "./BusinessOrdersPage";

interface Props {
  businessId: string;
}

export default function Catalog({ businessId }: Props) {

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <BusinessOrdersPage businessId={businessId} />
      </div>
    </div>
  );
}
