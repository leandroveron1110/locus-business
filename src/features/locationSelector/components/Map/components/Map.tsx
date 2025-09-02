// src/components/MapComponent.tsx
"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DraggableMarker from "./DraggableMarker";

interface MapComponentProps {
  initialPosition: [number, number];
  onPositionChange: (newPosition: [number, number]) => void;
}

const MapComponent = ({ initialPosition, onPositionChange }: MapComponentProps) => {
  return (
    <MapContainer
      center={initialPosition}
      zoom={16}
      scrollWheelZoom={false}
      zoomControl={false} // Oculta el control de zoom
      attributionControl={false} // Oculta la atribución de Leaflet
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <SearchControl onSearchResult={onPositionChange} /> */}
      <DraggableMarker
        initialPosition={initialPosition}
        onPositionChange={onPositionChange}
      />
    </MapContainer>
  );
};

export default MapComponent;