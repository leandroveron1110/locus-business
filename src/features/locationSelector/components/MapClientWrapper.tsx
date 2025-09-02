// src/components/MapClientWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { AddressData } from "../types/address-data";

// Usamos dynamic para importar el componente del mapa del lado del cliente
const MapComponent = dynamic(() => import("./Map/LocationSelector"), {
  ssr: false, // Deshabilita el Server-Side Rendering
});

interface MapClientWrapperProps {
  onSave: (data: AddressData) => void;
}
export default function MapClientWrapper({ onSave }: MapClientWrapperProps) {
  return <MapComponent onSave={onSave} />;
}