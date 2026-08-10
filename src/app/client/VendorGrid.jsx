"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, Navigation } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatFCFA, distanceKm } from "@/lib/utils";

export default function VendorGrid({ vendors, clientLat, clientLng }) {
  if (vendors.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="Aucun vendeur actif pour l'instant"
        description="Reviens bientot, de nouveaux vendeurs rejoignent AlloGaz regulierement."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {vendors.map((vendor, i) => {
        const km = distanceKm(clientLat, clientLng, vendor.latitude, vendor.longitude);
        return (
          <motion.div
            key={vendor.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i * 0.05, 0.3), duration: 0.3 }}
          >
            <Link href={`/client/commander/${vendor.id}`}>
              <Card className="h-full transition-transform hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-sm font-medium text-ink-800">{vendor.business_name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-800/50">
                      <MapPin className="h-3 w-3" /> {vendor.neighborhood || vendor.city}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {vendor.rating > 0 && (
                      <Badge className="bg-ember-400/20 text-ember-500">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" /> {vendor.rating}
                        </span>
                      </Badge>
                    )}
                    {km !== null && (
                      <span className="flex items-center gap-1 text-[11px] text-ink-800/40">
                        <Navigation className="h-3 w-3" /> {km} km
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {vendor.gas_stock?.filter((s) => s.full_bottles > 0).slice(0, 4).map((s) => (
                    <Badge key={s.id} className="bg-flame-50 text-flame-600">
                      {s.brand} {s.capacity_kg}kg — {formatFCFA(s.price)}
                    </Badge>
                  ))}
                  {(!vendor.gas_stock || vendor.gas_stock.every((s) => s.full_bottles === 0)) && (
                    <Badge className="bg-red-50 text-red-600">Stock epuise</Badge>
                  )}
                </div>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
