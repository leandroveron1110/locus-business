"use client";

import { useState } from "react";
import BusinessContactEditor from "../edits/BusinessContactEditor";
import BusinessContact from "../views/BusinessContact";

interface Props {
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export default function BusinessContactContainer({
  address,
  phone,
  whatsapp,
  email,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [contactData, setContactData] = useState({ address, phone, whatsapp, email });

  const getChanges = (newData: typeof contactData) => {
    const diff: Partial<typeof contactData> = {};
    (Object.keys(newData) as (keyof typeof contactData)[]).forEach((key) => {
      if (newData[key] !== contactData[key]) diff[key] = newData[key];
    });
    return diff;
  };

  const handleSave = (newData: typeof contactData) => {
    const changes = getChanges(newData);
    if (Object.keys(changes).length === 0) {
      console.log("⚠️ No hay cambios para guardar");
      setIsEditing(false);
      return;
    }

    // 🚀 Enviar cambios al backend
    console.log("Guardando cambios:", changes);

    // Actualizar estado local
    setContactData((prev) => ({ ...prev, ...changes }));
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <BusinessContactEditor
          {...contactData}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
        />
      ) : (
        <BusinessContact {...contactData} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
}
