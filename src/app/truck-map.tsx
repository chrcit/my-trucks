"use client";

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngTuple } from "leaflet";

import { Truck } from "~/swr/use-fetch-trucks";
import { TruckCard } from "./truck-card";
import { useEffect, useRef } from "react";

const icon = L.icon({ iconUrl: "/marker-icon.png" });

const DEFAULT_MAP_CENTER = [48.23, 16.11] as LatLngTuple;

const CustomMarker = ({
  truck,
  activeTruckId,
  onMarkerClick,
  onPopupClose,
}: {
  truck: Truck;
  activeTruckId: number | null;
  onMarkerClick: (truckId: number) => void;
  onPopupClose: (truckId: number) => void;
}) => {
  const markerRef = useRef<any>(null); // TODO: see if you can find type for this
  const map = useMap();

  useEffect(() => {
    if (activeTruckId === truck.id) {
      map.flyTo([truck.position.lat, truck.position.lng], 10, {
        duration: 0.75,
      });

      markerRef.current?.openPopup();
    } else {
      markerRef.current?.closePopup();
    }

    if (activeTruckId === null) {
      map.flyTo(DEFAULT_MAP_CENTER, 8, {
        duration: 0.75,
      });
    }
  }, [activeTruckId]);

  return (
    <Marker
      ref={markerRef}
      key={`truck-marker-${truck.id}`}
      position={[truck.position.lat, truck.position.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onMarkerClick(truck.id),
      }}
    >
      <Popup
        eventHandlers={{
          remove: () => onPopupClose(truck.id),
        }}
      >
        <TruckCard truck={truck} />
      </Popup>
    </Marker>
  );
};

export const TruckMap = ({
  trucks,
  onMarkerClick,
  onPopupClose,
  activeTruckId,
}: {
  trucks: Truck[];
  onMarkerClick: (truckId: number) => void;
  onPopupClose: (truckId: number) => void;
  activeTruckId: number | null;
}) => {
  return (
    <MapContainer
      className="h-[300px] lg:h-[700px] max-h-[calc(100vh-300px)] w-full"
      center={DEFAULT_MAP_CENTER}
      zoom={8}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {trucks.map((truck) => (
        <CustomMarker
          key={`truck-marker-${truck.id}`}
          truck={truck}
          activeTruckId={activeTruckId}
          onMarkerClick={onMarkerClick}
          onPopupClose={onPopupClose}
        />
      ))}
    </MapContainer>
  );
};
