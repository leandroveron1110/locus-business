// src/components/containers/BusinessHeaderContainer.tsx
"use client";

import { useState } from "react";
import BusinessHeaderEditor from "../edits/BusinessHeaderEditor";
import BusinessHeader from "../views/BusinessHeader";
import { BusinessHeaderData } from "@/features/business/types/business-form";
import { useBusinessHeaderUpdater } from "@/features/business/hooks/useBusinessHeaderUpdater";

interface BusinessHeaderContainerProps {
  businessId: string;
  logoUrl?: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
}

export default function BusinessHeaderContainer({
  businessId,
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

  // Utiliza el hook de mutación
  const { updateHeader, isUpdating } = useBusinessHeaderUpdater(businessId);

  // La función getChangedFields se mantiene igual para identificar cambios
  const getChangedFields = (
    oldData: BusinessHeaderData,
    newData: BusinessHeaderData
  ) => {
    const diff: Partial<Omit<BusinessHeaderData, "logoUrl">> = {};

    // Filtramos 'logoUrl' del array de claves para evitar el error.
    const keysToCompare = (
      Object.keys(newData) as (keyof BusinessHeaderData)[]
    ).filter((key) => key !== "logoUrl");

    keysToCompare.forEach((key) => {
      if (newData[key] !== oldData[key]) {
        // Ahora, TypeScript sabe que 'key' nunca será 'logoUrl'
        // por lo que el error de tipado se elimina.
        diff[key] = newData[key] as any; // Usamos 'as any' para evitar un error de "assignability" que pueda surgir en la comparación de los tipos, aunque la solución ideal sería usar una aserción de tipo más específica si es posible.
      }
    });

    return diff;
  };

  const handleSave = (newData: BusinessHeaderData) => {
    const changes = getChangedFields(businessData, newData);

    // Solo actualiza si hay cambios en los campos de texto
    if (Object.keys(changes).length === 0) {
      console.log("⚠️ No hay cambios en los campos de texto para guardar");
      setIsEditing(false);
      return;
    }

    // Llama al hook para enviar los cambios al backend
    updateHeader(changes, {
      onSuccess: () => {
        setBusinessData((prev) => ({ ...prev, ...changes }));
        setIsEditing(false);
      },
      onError: (err) => {
        // La lógica del hook ya maneja la salida de error a la consola.
        // Aquí puedes agregar un toast o un mensaje de error si lo necesitas.
      },
    });
  };

  return (
    <div>
      {isEditing ? (
        <BusinessHeaderEditor
          businessId={businessId}
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
