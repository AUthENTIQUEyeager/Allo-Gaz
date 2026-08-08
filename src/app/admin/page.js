import { Store, ClipboardList, Wallet, AlertTriangle } from "lucide-react";
import { listVendorsForAdmin } from "@/lib/actions/vendors";
import { listAllOrdersAdmin } from "@/lib/actions/orders";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatFCFA } from "@/lib/utils";

export default async function AdminDashboard() {
  const vendors = await listVendorsForAdmin();
  const orders = await listAllOrdersAdmin();

  const pendingVendors = vendors.filter((v) => v.status === "pending");
  const activeVendors = vendors.filter((v) => v.status === "active");
  const completedOrders = orders.filter((o) => o.status === "completed");
  const revenue = completedOrders.reduce((sum, o) => sum + Number(o.total_price), 0);

  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card>
          <Store className="h-4 w-4 text-flame-500" />
          <p className="mt-2 font-display text-xl font-medium text-ink-800">{activeVendors.length}</p>
          <p className="text-xs text-ink-800/50">Vendeurs actifs</p>
        </Card>
        <Card>
          <ClipboardList className="h-4 w-4 text-flame-500" />
          <p className="mt-2 font-display text-xl font-medium text-ink-800">{orders.length}</p>
          <p className="text-xs text-ink-800/50">Commandes totales</p>
        </Card>
        <Card>
          <Wallet className="h-4 w-4 text-flame-500" />
          <p className="mt-2 font-display text-xl font-medium text-ink-800">{formatFCFA(revenue)}</p>
          <p className="text-xs text-ink-800/50">Volume livre</p>
        </Card>
        <Card>
          <AlertTriangle className="h-4 w-4 text-flame-500" />
          <p className="mt-2 font-display text-xl font-medium text-ink-800">{pendingVendors.length}</p>
          <p className="text-xs text-ink-800/50">Vendeurs en attente</p>
        </Card>
      </div>

      {pendingVendors.length > 0 && (
        <div>
          <h2 className="mb-3 font-display text-base font-medium text-ink-800">
            En attente de validation
          </h2>
          <div className="space-y-2">
            {pendingVendors.map((v) => (
              <Card key={v.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-ink-800">{v.business_name}</p>
                  <p className="text-xs text-ink-800/50">{v.city}</p>
                </div>
                <Badge className="bg-ember-400/20 text-ember-600">En attente</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
