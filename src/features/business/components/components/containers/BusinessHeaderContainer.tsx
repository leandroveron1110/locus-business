"use client";

import { useState } from "react";
import BusinessHeaderEditor from "../edits/BusinessHeaderEditor";
import BusinessHeader from "../views/BusinessHeader";
import { BusinessHeaderData } from "@/features/business/types/business-form";

interface BusinessHeaderContainerProps extends BusinessHeaderData {}

export default function BusinessHeaderContainer({
  logoUrl,
  name,
  shortDescription,
  fullDescription,
}: BusinessHeaderContainerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessHeaderData>({
    logoUrl,
    name,
    shortDescription,
    fullDescription,
  });

  // 🔑 devuelve solo los cambios
  const getChangedFields = (oldData: BusinessHeaderData, newData: BusinessHeaderData) => {
    const diff: Partial<BusinessHeaderData> = {};
    (Object.keys(newData) as (keyof BusinessHeaderData)[]).forEach((key) => {
      if (newData[key] !== oldData[key]) {
        diff[key] = newData[key];
      }
    });
    return diff;
  };

  const handleSave = (newData: BusinessHeaderData) => {
    const changes = getChangedFields(businessData, newData);

    if (Object.keys(changes).length === 0) {
      console.log("⚠️ No hay cambios para guardar");
      setIsEditing(false);
      return;
    }

    // 🚀 Request al backend solo con los cambios
    console.log("Guardando cambios:", changes);

    setBusinessData((prev) => ({ ...prev, ...changes }));
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <BusinessHeaderEditor
          {...businessData}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
        />
      ) : (
        <BusinessHeader {...businessData} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
