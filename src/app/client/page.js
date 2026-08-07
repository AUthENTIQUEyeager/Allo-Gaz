import Link from "next/link";
import { MapPin, Star, Phone } from "lucide-react";
import { listNearbyVendors } from "@/lib/actions/vendors";
import { getCurrentProfile } from "@/lib/supabase/server";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatFCFA } from "@/lib/utils";

export default async function ClientHomePage() {
  const profile = await getCurrentProfile();
  const vendors = await listNearbyVendors({ city: profile?.city });

  return (
    <div className="space-y-4 pt-4">
      <Card className="bg-ink-800 text-white">
        <p className="font-display text-base font-medium">Commander du gaz</p>
        <p className="mt-0.5 text-sm text-white/60">
          Choisis un vendeur actif a {profile?.city || "ta ville"} et commande en 2 minutes.
        </p>
      </Card>

      <div>
        <h2 className="mb-3 font-display text-base font-medium text-ink-800">
          Vendeurs pres de toi
        </h2>

        {vendors.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="Aucun vendeur actif pour l'instant"
            description="Reviens bientot, de nouveaux vendeurs rejoignent AlloGaz regulierement."
          />
        ) : (
          <div className="space-y-3">
            {vendors.map((vendor) => (
              <Link key={vendor.id} href={`/client/commander/${vendor.id}`}>
                <Card className="transition-transform active:scale-[0.98]">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display text-sm font-medium text-ink-800">
                        {vendor.business_name}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-800/50">
                        <MapPin className="h-3 w-3" /> {vendor.neighborhood || vendor.city}
                      </p>
                    </div>
                    {vendor.rating > 0 && (
                      <Badge className="bg-ember-400/20 text-ember-500">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" /> {vendor.rating}
                        </span>
                      </Badge>
                    )}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
