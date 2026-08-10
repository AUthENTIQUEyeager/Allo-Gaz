"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const vendorIcon = L.divIcon({
  className: "",
  html: `<div style="background:#F2540E;width:16px;height:16px;border-radius:9999px;border:3px solid white;box-shadow:0 1px 6px rgba(0,0,0,.45)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

const clientIcon = L.divIcon({
  className: "",
  html: `<div style="background:#2563eb;width:14px;height:14px;border-radius:9999px;border:3px solid white;box-shadow:0 1px 6px rgba(0,0,0,.45)"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) {
      map.fitBounds(points, { padding: [36, 36] });
    }
  }, [points, map]);
  return null;
}

export default function LeafletMap({ vendorLat, vendorLng, vendorName, clientLat, clientLng }) {
  const vendorPos = [vendorLat, vendorLng];
  const hasClient = Boolean(clientLat && clientLng);
  const points = hasClient ? [vendorPos, [clientLat, clientLng]] : [vendorPos];

  return (
    <MapContainer
      center={vendorPos}
      zoom={14}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={vendorPos} icon={vendorIcon}>
        <Popup>{vendorName}</Popup>
      </Marker>
      {hasClient && (
        <Marker position={[clientLat, clientLng]} icon={clientIcon}>
          <Popup>Toi</Popup>
        </Marker>
      )}
      <FitBounds points={points} />
    </MapContainer>
  );
}
