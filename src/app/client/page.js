import { listNearbyVendors } from "@/lib/actions/vendors";
import { getCurrentProfile } from "@/lib/supabase/server";
import { getClientStats } from "@/lib/actions/stats";
import VendorGrid from "./VendorGrid";
import Card from "@/components/ui/Card";
import { formatFCFA } from "@/lib/utils";
import { Package, Wallet, Heart } from "lucide-react";

export default async function ClientHomePage() {
  const profile = await getCurrentProfile();
  const [vendors, stats] = await Promise.all([
    listNearbyVendors({ city: profile?.city }),
    getClientStats()
  ]);

  return (
    <div className="space-y-5 pt-4">
      <Card className="bg-ink-800 text-white">
        <p className="font-display text-base font-medium">Commander du gaz</p>
        <p className="mt-0.5 text-sm text-white/60">
          Choisis un vendeur actif a {profile?.city || "ta ville"} et commande en 2 minutes.
        </p>
      </Card>

      {stats && stats.totalOrders > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <Package className="mx-auto h-4 w-4 text-flame-500" />
            <p className="mt-1.5 font-display text-lg font-medium text-ink-800">{stats.totalOrders}</p>
            <p className="text-[11px] text-ink-800/50">Commandes</p>
          </Card>
          <Card className="text-center">
            <Wallet className="mx-auto h-4 w-4 text-flame-500" />
            <p className="mt-1.5 font-display text-lg font-medium text-ink-800">{formatFCFA(stats.totalSpent)}</p>
            <p className="text-[11px] text-ink-800/50">Depense</p>
          </Card>
          <Card className="text-center">
            <Heart className="mx-auto h-4 w-4 text-flame-500" />
            <p className="mt-1.5 truncate font-display text-sm font-medium text-ink-800">
              {stats.favoriteVendor || "—"}
            </p>
            <p className="text-[11px] text-ink-800/50">Prefere</p>
          </Card>
        </div>
      )}

      <div>
        <h2 className="mb-3 font-display text-base font-medium text-ink-800">Vendeurs pres de toi</h2>
        <VendorGrid vendors={vendors} />
      </div>
    </div>
  );
}
