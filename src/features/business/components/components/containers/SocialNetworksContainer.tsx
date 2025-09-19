"use client";

import { SocialNetworkData } from "@/features/business/types/business-form";
import { useState } from "react";
import SocialNetworksEdit from "../edits/SocialNetworksEdit";
import SocialNetworks from "../views/SocialNetworks";


interface Props {
  initialData: SocialNetworkData;
}

export default function SocialNetworksContainer({ initialData }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<SocialNetworkData>(initialData);

  const handleSave = (updated: SocialNetworkData) => {
    setData(updated);
    setIsEditing(false);
    // acá podrías guardar en backend
  };

  return (
    <div className="mt-8">
      {isEditing ? (
        <SocialNetworksEdit
          data={data}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <SocialNetworks data={data} />
          <div className="mt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Editar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
