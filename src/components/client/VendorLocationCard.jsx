"use client";

import dynamic from "next/dynamic";
import { Navigation, MapPin } from "lucide-react";
import Card from "@/components/ui/Card";
import { distanceKm } from "@/lib/utils";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <div className="h-56 w-full animate-pulse rounded-2xl bg-black/5" />
});

export default function VendorLocationCard({ vendor, clientLat, clientLng }) {
  if (!vendor.latitude || !vendor.longitude) {
    return (
      <Card className="flex items-center gap-2 text-sm text-ink-800/50">
        <MapPin className="h-4 w-4 shrink-0" />
        Ce vendeur n'a pas encore partage sa position exacte.
      </Card>
    );
  }

  const km = distanceKm(clientLat, clientLng, vendor.latitude, vendor.longitude);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`;

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-ink-800">Position du vendeur</p>
          {km !== null && <p className="text-xs text-ink-800/50">A environ {km} km de chez toi</p>}
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-flame-500 px-3.5 py-2 text-xs font-medium text-white hover:bg-flame-600"
        >
          <Navigation className="h-3.5 w-3.5" /> Itineraire
        </a>
      </div>

      <div className="h-56 w-full overflow-hidden rounded-2xl">
        <LeafletMap
          vendorLat={vendor.latitude}
          vendorLng={vendor.longitude}
          vendorName={vendor.business_name}
          clientLat={clientLat}
          clientLng={clientLng}
        />
      </div>
    </Card>
  );
}
