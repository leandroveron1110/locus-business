// src/components/DraggableMarker.tsx
"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import * as L from "leaflet";

// @ts-expect-error Leaflet internal property, safe to delete
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface DraggableMarkerProps {
  initialPosition: [number, number];
  onPositionChange: (newPosition: [number, number]) => void; // Nueva prop
}

const DraggableMarker = ({ initialPosition, onPositionChange }: DraggableMarkerProps) => {
  const [position, setPosition] = useState(initialPosition);
  const markerRef = useRef<L.Marker>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos: [number, number] = [marker.getLatLng().lat, marker.getLatLng().lng];
          setPosition(newPos);
          onPositionChange(newPos); // Llama a la función de callback con la nueva posición
        }
      },
    }),
    [onPositionChange] // Asegura que el hook se actualice si la función cambia
  );

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup>
        Tu ubicación. <br /> Arrastra el marcador para ajustar.
      </Popup>
    </Marker>
  );
};

export default DraggableMarker;