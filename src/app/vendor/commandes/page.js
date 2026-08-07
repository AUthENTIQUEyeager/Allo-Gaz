import { Package } from "lucide-react";
import { listVendorOrders } from "@/lib/actions/orders";
import EmptyState from "@/components/ui/EmptyState";
import OrderCard from "./OrderCard";

export default async function VendorOrdersPage() {
  const orders = await listVendorOrders();

  return (
    <div className="space-y-3 pt-4">
      <h2 className="font-display text-lg font-medium text-ink-800">Commandes recues</h2>
      {orders.length === 0 ? (
        <EmptyState icon={Package} title="Aucune commande pour l'instant" />
      ) : (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
}
