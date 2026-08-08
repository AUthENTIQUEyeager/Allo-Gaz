import { ClipboardList } from "lucide-react";
import { listAllOrdersAdmin } from "@/lib/actions/orders";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatFCFA, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await listAllOrdersAdmin();

  return (
    <div className="space-y-3 pt-4">
      <h2 className="font-display text-lg font-medium text-ink-800">Toutes les commandes</h2>
      {orders.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Aucune commande sur la plateforme" />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-800">
                    {order.profiles?.full_name} → {order.vendors?.business_name}
                  </p>
                  <p className="text-xs text-ink-800/50">
                    {order.brand} {order.capacity_kg}kg x{order.quantity}
                  </p>
                </div>
                <Badge className={ORDER_STATUS_COLORS[order.status]}>
                  {ORDER_STATUS_LABELS[order.status]}
                </Badge>
              </div>
              <p className="mt-2 text-sm font-medium text-ink-800">{formatFCFA(order.total_price)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
