"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { updateOrderStatus } from "@/lib/actions/orders";
import { formatFCFA, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";

const NEXT_STATUS = {
  pending: { next: "accepted", label: "Accepter" },
  accepted: { next: "delivering", label: "Marquer en livraison" },
  delivering: { next: "completed", label: "Marquer livree" }
};

export default function OrderCard({ order }) {
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const action = NEXT_STATUS[status];

  async function advance() {
    setLoading(true);
    const result = await updateOrderStatus(order.id, action.next);
    if (result?.success) setStatus(action.next);
    setLoading(false);
  }

  async function cancel() {
    setLoading(true);
    const result = await updateOrderStatus(order.id, "cancelled");
    if (result?.success) setStatus("cancelled");
    setLoading(false);
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-800">{order.profiles?.full_name}</p>
          <p className="text-xs text-ink-800/50">{order.profiles?.phone}</p>
          <p className="mt-1 text-xs text-ink-800/50">
            {order.brand} {order.capacity_kg}kg x{order.quantity} — {order.delivery_method === "delivery" ? "Livraison" : "Retrait"}
          </p>
        </div>
        <Badge className={ORDER_STATUS_COLORS[status]}>{ORDER_STATUS_LABELS[status]}</Badge>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3">
        <span className="text-sm font-medium text-ink-800">{formatFCFA(order.total_price)}</span>
        {action && (
          <div className="flex gap-2">
            {status === "pending" && (
              <Button variant="ghost" className="text-red-500" onClick={cancel} disabled={loading}>
                Refuser
              </Button>
            )}
            <Button onClick={advance} disabled={loading} className="text-xs">
              {loading ? "..." : action.label}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
