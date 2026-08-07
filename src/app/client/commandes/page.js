import { Package } from "lucide-react";
import { listClientOrders } from "@/lib/actions/orders";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { formatFCFA, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import ReviewButton from "./ReviewButton";

export default async function ClientOrdersPage() {
  const orders = await listClientOrders();

  return (
    <div className="space-y-3 pt-4">
      <h2 className="font-display text-lg font-medium text-ink-800">Mes commandes</h2>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aucune commande pour l'instant"
          description="Tes commandes de gaz apparaitront ici."
        />
      ) : (
        orders.map((order) => (
          <Card key={order.id}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-sm font-medium text-ink-800">
                  {order.vendors?.business_name}
                </p>
                <p className="mt-0.5 text-xs text-ink-800/50">
                  {order.brand} {order.capacity_kg}kg x{order.quantity}
                </p>
              </div>
              <Badge className={ORDER_STATUS_COLORS[order.status]}>
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3">
              <span className="text-sm font-medium text-ink-800">{formatFCFA(order.total_price)}</span>
              {order.status === "completed" && <ReviewButton order={order} />}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
