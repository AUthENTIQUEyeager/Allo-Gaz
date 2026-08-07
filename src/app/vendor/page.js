import Link from "next/link";
import { AlertTriangle, Package, Star, Wallet } from "lucide-react";
import { getMyVendorProfile } from "@/lib/actions/vendors";
import { listVendorOrders } from "@/lib/actions/orders";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatFCFA, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";

export default async function VendorDashboard() {
  const vendor = await getMyVendorProfile();

  if (!vendor) {
    return (
      <div className="pt-4">
        <Card className="text-center">
          <p className="font-display text-base font-medium text-ink-800">
            Complete ton profil vendeur
          </p>
          <p className="mt-1 text-sm text-ink-800/50">
            Renseigne ton commerce pour commencer a recevoir des commandes.
          </p>
          <Link href="/vendor/profil" className="mt-4 inline-block text-sm font-medium text-flame-500">
            Aller au profil →
          </Link>
        </Card>
      </div>
    );
  }

  const orders = await listVendorOrders();
  const pending = orders.filter((o) => o.status === "pending");
  const completed = orders.filter((o) => o.status === "completed");
  const revenue = completed.reduce((sum, o) => sum + Number(o.total_price), 0);
  const lowStock = (vendor.gas_stock || []).filter((s) => s.full_bottles <= 3);

  return (
    <div className="space-y-4 pt-4">
      {vendor.status === "pending" && (
        <Card className="bg-ember-400/10 border-ember-400/30">
          <p className="flex items-center gap-2 text-sm font-medium text-ember-500">
            <AlertTriangle className="h-4 w-4" /> Profil en attente de validation par l'admin
          </p>
        </Card>
      )}
      {vendor.status === "suspended" && (
        <Card className="bg-red-50 border-red-200">
          <p className="text-sm font-medium text-red-600">Ton compte est suspendu.</p>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <Package className="h-4 w-4 text-flame-500" />
          <p className="mt-2 font-display text-xl font-medium text-ink-800">{pending.length}</p>
          <p className="text-xs text-ink-800/50">Commandes en attente</p>
        </Card>
        <Card>
          <Wallet className="h-4 w-4 text-flame-500" />
          <p className="mt-2 font-display text-xl font-medium text-ink-800">{formatFCFA(revenue)}</p>
          <p className="text-xs text-ink-800/50">Revenus (livrees)</p>
        </Card>
        <Card>
          <Star className="h-4 w-4 text-flame-500" />
          <p className="mt-2 font-display text-xl font-medium text-ink-800">
            {vendor.rating || "—"}
          </p>
          <p className="text-xs text-ink-800/50">Note ({vendor.rating_count} avis)</p>
        </Card>
        <Card>
          <AlertTriangle className="h-4 w-4 text-flame-500" />
          <p className="mt-2 font-display text-xl font-medium text-ink-800">{lowStock.length}</p>
          <p className="text-xs text-ink-800/50">Stocks faibles</p>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 font-display text-base font-medium text-ink-800">
          Commandes a traiter
        </h2>
        {pending.length === 0 ? (
          <EmptyState icon={Package} title="Rien a traiter pour l'instant" />
        ) : (
          <div className="space-y-3">
            {pending.map((order) => (
              <Card key={order.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-800">{order.profiles?.full_name}</p>
                    <p className="text-xs text-ink-800/50">
                      {order.brand} {order.capacity_kg}kg x{order.quantity}
                    </p>
                  </div>
                  <Badge className={ORDER_STATUS_COLORS[order.status]}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
